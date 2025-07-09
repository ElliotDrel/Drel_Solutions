"""
Model Recommendation API

Simple FastAPI backend that uses OpenAI to recommend AI models based on user queries.
"""

from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from pydantic import BaseModel, Field, validator
from typing import List, Dict, Optional
import logging
import uvicorn
import os
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from auth import verify_api_key, log_security_event
import re
from config import settings
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

from services.openai_service import get_openai_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Security middleware for CSP and security headers
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Content Security Policy
        csp_policy = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self' data:; "
            "connect-src 'self' https://api.openai.com; "
            "frame-ancestors 'none'; "
            "base-uri 'self'; "
            "form-action 'self'"
        )
        
        # Security headers
        response.headers["Content-Security-Policy"] = csp_policy
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "microphone=(), camera=(), geolocation=()"
        
        # HSTS header for HTTPS connections
        if request.url.scheme == "https":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        
        return response

# Initialize FastAPI app with request size limits
app = FastAPI(
    title="Model Recommendation API",
    description="Find the perfect AI model for your task",
    version="2.0.0"
)

# Add request size limit middleware
class RequestSizeLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_size: int = 10 * 1024 * 1024):  # 10MB default
        super().__init__(app)
        self.max_size = max_size
    
    async def dispatch(self, request: Request, call_next):
        # Check content-length header
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > self.max_size:
            log_security_event("request_size_exceeded", {
                "content_length": content_length,
                "max_size": self.max_size,
                "severity": "medium"
            }, request)
            return Response(
                content="Request entity too large",
                status_code=413,
                headers={"Content-Type": "text/plain"}
            )
        
        # For chunked requests, we need to read the body
        if content_length is None:
            body = await request.body()
            if len(body) > self.max_size:
                log_security_event("request_body_size_exceeded", {
                    "body_size": len(body),
                    "max_size": self.max_size,
                    "severity": "medium"
                }, request)
                return Response(
                    content="Request entity too large",
                    status_code=413,
                    headers={"Content-Type": "text/plain"}
                )
        
        response = await call_next(request)
        return response

# Add security middleware
app.add_middleware(SecurityHeadersMiddleware)

# Add request size limit middleware
app.add_middleware(RequestSizeLimitMiddleware, max_size=settings.max_request_size)

# Add trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"] if settings.environment == "development" else settings.allowed_hosts
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,  # Secure: use validated config
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)

# Add rate limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Request/Response models
class ModelSearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=1000, description="Search query for model recommendations")

    @validator('query')
    def sanitize_query(cls, v):
        # Enhanced input validation with comprehensive patterns
        harmful_patterns = [
            # Prompt injection patterns
            r'ignore.*previous.*instructions',
            r'system.*prompt',
            r'role.*play',
            r'act.*as.*if',
            r'pretend.*to.*be',
            r'forget.*everything',
            r'new.*instructions',
            r'override.*previous',
            
            # Script injection patterns
            r'<script.*>',
            r'javascript:',
            r'data:text/html',
            r'vbscript:',
            r'on\w+\s*=',
            
            # SQL injection patterns
            r'union.*select',
            r'drop.*table',
            r'delete.*from',
            r'insert.*into',
            r'update.*set',
            r'create.*table',
            
            # Path traversal patterns
            r'\.\./',
            r'\.\.\\',
            r'/etc/passwd',
            r'/etc/shadow',
            r'c:\\windows',
            
            # Command injection patterns
            r';\s*\w+',
            r'\|\s*\w+',
            r'&&\s*\w+',
            r'`\w+`',
            r'\$\(\w+\)',
            
            # Additional security patterns
            r'eval\s*\(',
            r'exec\s*\(',
            r'system\s*\(',
            r'shell_exec\s*\(',
            r'passthru\s*\(',
            r'file_get_contents\s*\(',
            r'fopen\s*\(',
            r'include\s*\(',
            r'require\s*\(',
        ]
        
        # Check for suspicious patterns
        for pattern in harmful_patterns:
            if re.search(pattern, v, re.IGNORECASE):
                # Log security event for harmful content detection
                from auth import log_security_event
                log_security_event("harmful_content_detected", {
                    "pattern_matched": pattern,
                    "query_preview": v[:100],
                    "severity": "high"
                })
                raise ValueError("Query contains potentially harmful content")
        
        # Check for excessive special characters (potential obfuscation)
        special_char_count = len(re.findall(r'[^\w\s]', v))
        if special_char_count > len(v) * 0.3:  # More than 30% special characters
            from auth import log_security_event
            log_security_event("suspicious_special_chars", {
                "special_char_ratio": special_char_count / len(v),
                "query_preview": v[:100],
                "severity": "medium"
            })
            raise ValueError("Query contains too many special characters")
        
        # Check for repeated characters (potential DoS)
        if re.search(r'(.)\1{50,}', v):  # 50+ repeated characters
            from auth import log_security_event
            log_security_event("repeated_chars_detected", {
                "query_preview": v[:100],
                "severity": "medium"
            })
            raise ValueError("Query contains excessive repeated characters")
        
        # Check for extremely long words (potential buffer overflow)
        words = v.split()
        for word in words:
            if len(word) > 100:
                from auth import log_security_event
                log_security_event("long_word_detected", {
                    "word_length": len(word),
                    "query_preview": v[:100],
                    "severity": "medium"
                })
                raise ValueError("Query contains excessively long words")
        
        return v.strip()

class ModelRecommendation(BaseModel):
    rank: int
    name: str
    provider: str
    why: str
    when: str
    rationale: str

class ModelSearchResponse(BaseModel):
    recommendations: List[ModelRecommendation]

# Initialize services
openai_service = get_openai_service()

@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "service": "Model Recommendation API",
        "status": "healthy",
        "version": "2.0.0"
    }

@app.post("/api/model_search", response_model=ModelSearchResponse, dependencies=[Depends(verify_api_key)])
@limiter.limit("10/minute")
async def search_models(request: Request, model_request: ModelSearchRequest):
    """
    Search for AI models based on user query.
    
    This endpoint:
    1. Takes a natural language query
    2. Sends it to OpenAI along with all model documentation
    3. Returns top 5 model recommendations with explanations
    """
    try:
        logger.info(f"Model search request: {model_request.query[:100]}...")
        
        # Get recommendations from OpenAI
        result = await openai_service.get_model_recommendations(model_request.query)
        
        # Convert to response model
        recommendations = [
            ModelRecommendation(**rec) for rec in result["recommendations"]
        ]
        
        return ModelSearchResponse(recommendations=recommendations)
        
    except ValueError as e:
        log_security_event("validation_error", {
            "error": str(e),
            "query_preview": model_request.query[:100],
            "severity": "medium"
        }, request)
        logger.error(f"Validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        log_security_event("search_error", {
            "error": str(e),
            "query_preview": model_request.query[:100],
            "severity": "medium"
        }, request)
        logger.error(f"Search error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get model recommendations")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3298) 
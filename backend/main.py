"""
Model Recommendation API

Simple FastAPI backend that uses OpenAI to recommend AI models based on user queries.
"""

from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator
from typing import List, Dict, Optional
import logging
import uvicorn
import os
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from auth import verify_api_key
import re
from config import settings

from services.openai_service import get_openai_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Model Recommendation API",
    description="Find the perfect AI model for your task",
    version="2.0.0"
)

# Configure CORS
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,  # Secure: use env var
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
        # Remove potentially harmful prompt injection patterns
        harmful_patterns = [
            r'ignore.*previous.*instructions',
            r'system.*prompt',
            r'role.*play',
            r'<script.*>',
            r'javascript:',
        ]
        for pattern in harmful_patterns:
            if re.search(pattern, v, re.IGNORECASE):
                raise ValueError("Query contains potentially harmful content")
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
        logger.error(f"Validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Search error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get model recommendations")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3298) 
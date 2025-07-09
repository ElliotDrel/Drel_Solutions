from fastapi import HTTPException, Depends, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
import logging
import time
from typing import Optional

# Configure security logger
security_logger = logging.getLogger('security')
security_logger.setLevel(logging.INFO)

# Create a security-specific handler if not already exists
if not security_logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        '%(asctime)s - SECURITY - %(levelname)s - %(message)s'
    )
    handler.setFormatter(formatter)
    security_logger.addHandler(handler)

security = HTTPBearer()

def log_security_event(event_type: str, details: dict, request: Optional[Request] = None):
    """Log security events with structured data"""
    log_data = {
        "event_type": event_type,
        "timestamp": time.time(),
        **details
    }
    
    if request:
        log_data.update({
            "client_ip": request.client.host if request.client else "unknown",
            "user_agent": request.headers.get("user-agent", "unknown"),
            "method": request.method,
            "path": str(request.url.path),
            "query_params": str(request.url.query) if request.url.query else None,
        })
    
    security_logger.info(f"Security Event: {log_data}")

async def verify_api_key(request: Request, credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify API key from Authorization header with security logging"""
    start_time = time.time()
    
    try:
        api_key = os.getenv("API_KEY")
        if not api_key:
            log_security_event("server_config_error", {
                "error": "API_KEY environment variable not set",
                "severity": "critical"
            }, request)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Server configuration error"
            )
        
        if credentials.credentials != api_key:
            log_security_event("auth_failure", {
                "reason": "invalid_api_key",
                "provided_key_prefix": credentials.credentials[:8] + "..." if len(credentials.credentials) > 8 else "short_key",
                "severity": "high",
                "response_time": time.time() - start_time
            }, request)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid API key"
            )
        
        log_security_event("auth_success", {
            "severity": "info",
            "response_time": time.time() - start_time
        }, request)
        
        return credentials.credentials
        
    except HTTPException:
        raise
    except Exception as e:
        log_security_event("auth_error", {
            "error": str(e),
            "severity": "high",
            "response_time": time.time() - start_time
        }, request)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication error"
        ) 
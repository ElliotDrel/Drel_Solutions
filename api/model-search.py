"""
Model Recommendation API

Simple FastAPI backend that uses OpenAI to recommend AI models based on user queries.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import logging
import uvicorn

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
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class ModelSearchRequest(BaseModel):
    query: str

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
async def model_search_info():
    """Model search endpoint information."""
    return {
        "endpoint": "Model Search API",
        "method": "POST",
        "description": "Send a query to get AI model recommendations",
        "version": "2.0.0"
    }

@app.post("/", response_model=ModelSearchResponse)
async def search_models(request: ModelSearchRequest):
    """
    Search for AI models based on user query.
    
    This endpoint:
    1. Takes a natural language query
    2. Sends it to OpenAI along with all model documentation
    3. Returns top 5 model recommendations with explanations
    """
    try:
        if not request.query or not request.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty")
        
        logger.info(f"Model search request: {request.query[:100]}...")
        
        # Get recommendations from OpenAI
        result = await openai_service.get_model_recommendations(request.query)
        
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

# Remove the following block for serverless deployment
# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=3298) 
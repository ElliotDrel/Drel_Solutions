"""
OpenAI Service Module

Handles all OpenAI API interactions for model recommendations.
Configuration variables are defined at the top of the file.
"""

import os
import json
import asyncio
import logging
from typing import List, Dict, Optional
from pathlib import Path

try:
    import openai
except ImportError as e:
    logging.error(f"Missing OpenAI dependency: {e}")
    raise

# OpenAI Configuration Variables
# In serverless environment, read directly from environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
MODEL_NAME = "gpt-4.1"  # Using GPT-4 Turbo
TEMPERATURE = 0.3
MAX_TOKENS = 3000
TOP_P = 1.0
FREQUENCY_PENALTY = 0.0
PRESENCE_PENALTY = 0.0

# System prompt for model recommendations
SYSTEM_PROMPT = """You are an AI model recommendation expert. Your task is to analyze a user's request and recommend the most suitable AI models based on the provided model documentation.

Consider these factors:
1. Task alignment - How well the model fits the specific use case
2. Performance capabilities - Model strengths and limitations  
3. Cost efficiency - Balance of capability and cost
4. Speed requirements - Response time considerations
5. Accuracy needs - Precision requirements for the task

Review ALL the provided model documentation and the user query. Recommend the top 5 models that best match the requirements.

For each recommended model, provide:
- Why this model: Clear explanation of why it fits the task
- When to use: Specific scenarios where this model excels
- Position rationale: Why it ranks at this position (1st through 5th)

You MUST respond with valid JSON matching the specified schema."""

logger = logging.getLogger(__name__)

class OpenAIService:
    """Handles OpenAI API interactions for model recommendations"""
    
    def __init__(self):
        if not OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY environment variable is required")
        
        self.client = openai.OpenAI(api_key=OPENAI_API_KEY)
        # Use absolute path to model_docs directory relative to project root
        self.model_docs_path = Path(__file__).parent.parent.parent / "model_docs"
    
    async def load_all_documents(self) -> Dict[str, str]:
        """Load all model documentation files"""
        documents = {}
        
        if not self.model_docs_path.exists():
            logger.error(f"Model docs directory {self.model_docs_path} does not exist")
            return documents
        
        # Walk through provider directories
        for provider_dir in self.model_docs_path.iterdir():
            if not provider_dir.is_dir():
                continue
            
            # Load each model file
            for model_file in provider_dir.glob("*.txt"):
                try:
                    with open(model_file, 'r', encoding='utf-8') as f:
                        content = f.read().strip()
                        key = f"{provider_dir.name}/{model_file.stem}"
                        documents[key] = content
                        logger.debug(f"Loaded document: {key}")
                except Exception as e:
                    logger.error(f"Error loading {model_file}: {e}")
        
        logger.info(f"Loaded {len(documents)} model documents")
        return documents
    
    async def get_model_recommendations(self, user_query: str) -> Dict:
        """Get model recommendations for a user query"""
        try:
            # Load all model documents
            documents = await self.load_all_documents()
            
            if not documents:
                raise ValueError("No model documents found")
            
            # Prepare messages with all model documentation
            messages = [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"User task: {user_query}"}
            ]
            
            # Add all model documentation as context
            for model_name, content in documents.items():
                messages.append({
                    "role": "user",
                    "content": f"Model Documentation - {model_name}:\n{content}"
                })
            
            # Define tools schema for structured response
            tools = [{
                "type": "function",
                "function": {
                    "name": "recommend_models",
                    "description": "Recommend the top 5 AI models for the given task",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "recommendations": {
                                "type": "array",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "rank": {
                                            "type": "integer",
                                            "description": "Ranking position (1 through 5)"
                                        },
                                        "name": {
                                            "type": "string",
                                            "description": "Model name"
                                        },
                                        "provider": {
                                            "type": "string",
                                            "description": "Model provider (openai, anthropic, google, etc.)"
                                        },
                                        "why": {
                                            "type": "string",
                                            "description": "Why this model fits the task"
                                        },
                                        "when": {
                                            "type": "string",
                                            "description": "When to use this model"
                                        },
                                        "rationale": {
                                            "type": "string",
                                            "description": "Why it ranks at this position"
                                        }
                                    },
                                    "required": ["rank", "name", "provider", "why", "when", "rationale"]
                                },
                                "minItems": 5,
                                "maxItems": 5
                            }
                        },
                        "required": ["recommendations"]
                    }
                }
            }]
            
            # Make API call
            response = await asyncio.to_thread(
                self.client.chat.completions.create,
                model=MODEL_NAME,
                messages=messages,
                tools=tools,
                tool_choice={"type": "function", "function": {"name": "recommend_models"}},
                temperature=TEMPERATURE,
                max_tokens=MAX_TOKENS,
                top_p=TOP_P,
                frequency_penalty=FREQUENCY_PENALTY,
                presence_penalty=PRESENCE_PENALTY
            )
            
            # Parse the tool call response
            tool_call = response.choices[0].message.tool_calls[0]
            if not tool_call:
                raise ValueError("No tool call in response")
            
            result = json.loads(tool_call.function.arguments)
            
            # Validate response structure
            if "recommendations" not in result:
                raise ValueError("Invalid response structure: missing recommendations")
            
            if len(result["recommendations"]) != 5:
                raise ValueError(f"Expected 5 recommendations, got {len(result['recommendations'])}")
            
            # Sort by rank to ensure proper order
            result["recommendations"].sort(key=lambda x: x["rank"])
            
            logger.info(f"Generated {len(result['recommendations'])} recommendations")
            return result
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse OpenAI response: {e}")
            raise ValueError("Invalid JSON response from OpenAI")
        except Exception as e:
            logger.error(f"Error getting recommendations: {e}")
            raise

# Global instance
_openai_service: Optional[OpenAIService] = None

def get_openai_service() -> OpenAIService:
    """Get the global OpenAI service instance"""
    global _openai_service
    if _openai_service is None:
        _openai_service = OpenAIService()
    return _openai_service 
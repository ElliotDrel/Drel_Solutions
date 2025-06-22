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
SYSTEM_PROMPT = """You are an elite AI model recommendation consultant with deep expertise in language, vision, audio, and multimodal models.

## 🎯 OBJECTIVE
Analyze the user's request and recommend the most suitable AI models based on the provided model documentation. You will receive:
1. Multiple model documentation entries (each as a separate message)
2. The user's task description (final message)

## 📝 EVALUATION CRITERIA
Evaluate each model on ALL of the following dimensions:

| Dimension            | Guiding Questions                                                                                 |
|----------------------|----------------------------------------------------------------------------------------------------|
| **Task Alignment**   | Does the model natively support the user's task(s)? Any domain-specific functions?                 |
| **Performance**      | Strengths & known limitations (context window, modal coverage, multilingual, reasoning depth, etc.)|
| **Cost Efficiency**  | Inference price per 1K tokens vs. capability; note free tiers if relevant                        |
| **Speed**            | Typical latency and throughput for real-time or batch usage                                       |
| **Accuracy Needs**   | Empirical benchmarks (MMLU, truthfulness, etc.) or vendor-reported metrics                       |

## 🔬 ANALYSIS WORKFLOW
1. **Parse Requirements**: Extract primary tasks, secondary tasks, hard requirements, nice-to-haves, latency & budget limits, required modalities
2. **Build Candidate Pool**: Consider ALL provided models, discard only completely irrelevant ones (e.g., vision-only for NLP-only tasks)
3. **Score Each Model**: Rate 0-10 on each dimension with clear justification
4. **Apply Ranking Logic**: 
   - Primary: Total weighted score (equal weights unless user specifies priorities)
   - Tie-breakers: Task Alignment → Cost Efficiency → Speed → Performance → Accuracy
5. **Select Top 5**: Rank by final score, ensure diverse provider representation when scores are close

## 🎯 RECOMMENDATION QUALITY
For each recommended model, provide:
- **Why this model**: Clear, specific explanation of fit for the user's exact task
- **When to use**: Concrete scenarios where this model excels vs alternatives  
- **Position rationale**: Detailed justification for this specific ranking (1st through 5th)

## 🚦 GUARDRAILS
- Never hallucinate model capabilities; rely strictly on provided documentation
- If essential user requirements are unclear, make reasonable assumptions and note them
- Ensure recommendations span different use case scenarios when appropriate
- Consider both immediate needs and potential scaling requirements

You MUST respond using the recommend_models function with exactly 5 ranked recommendations.

Take a deep breath and work on this problem step-by-step.
"""

logger = logging.getLogger(__name__)

class OpenAIService:
    """Handles OpenAI API interactions for model recommendations"""
    
    def __init__(self):
        if not OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY environment variable is required")
        
        self.client = openai.OpenAI(api_key=OPENAI_API_KEY)
        # Use absolute path to model_docs directory relative to project root
        self.model_docs_path = Path(__file__).parent.parent.parent / "model_docs"
    
    async def load_all_documents(self) -> Dict[str, Dict[str, str]]:
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
                        
                        # Extract actual model name from first line
                        lines = content.split('\n')
                        model_name = lines[0].replace('Model: ', '').strip() if lines else model_file.stem
                        
                        documents[model_name] = {
                            'content': content,
                            'provider': provider_dir.name.title()
                        }
                        logger.debug(f"Loaded document: {model_name} ({provider_dir.name})")
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
            
            # Prepare messages with all model documentation first, then user query
            messages = [
                {"role": "system", "content": SYSTEM_PROMPT}
            ]
            
            # Add all model documentation as context first
            for model_name, model_data in documents.items():
                messages.append({
                    "role": "user",
                    "content": f"Model Documentation - {model_name} ({model_data['provider']}):\n{model_data['content']}"
                })
            
            # Add user query last
            messages.append({
                "role": "user", 
                "content": f"User task: {user_query}"
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
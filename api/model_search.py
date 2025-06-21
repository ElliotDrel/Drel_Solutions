"""
Model Recommendation API

Simple Vercel serverless function that uses OpenAI to recommend AI models based on user queries.
"""

from http.server import BaseHTTPRequestHandler
import json
import logging
from typing import List, Dict

from .services.openai_service import get_openai_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize services
openai_service = get_openai_service()

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Handle GET requests - return API info"""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response = {
            "endpoint": "Model Search API",
            "method": "POST",
            "description": "Send a query to get AI model recommendations",
            "version": "2.0.0"
        }
        self.wfile.write(json.dumps(response).encode())

    def do_POST(self):
        """Handle POST requests - process model search"""
        try:
            # Read request body
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))
            
            # Validate request
            query = request_data.get('query', '').strip()
            if not query:
                self.send_error(400, "Query cannot be empty")
                return
            
            logger.info(f"Model search request: {query[:100]}...")
            
            # Get recommendations from OpenAI
            import asyncio
            result = asyncio.run(openai_service.get_model_recommendations(query))
            
            # Send successful response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            self.wfile.write(json.dumps(result).encode())
            
        except ValueError as e:
            logger.error(f"Validation error: {e}")
            self.send_error(400, str(e))
        except Exception as e:
            logger.error(f"Search error: {e}")
            self.send_error(500, "Failed to get model recommendations")

    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers() 
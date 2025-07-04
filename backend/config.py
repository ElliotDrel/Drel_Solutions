import os
from typing import List

class Settings:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.api_key = os.getenv("API_KEY")
        self.allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
        self.environment = os.getenv("ENVIRONMENT", "development")
        self.log_level = os.getenv("LOG_LEVEL", "INFO")
        self._validate()

    def _validate(self):
        if not self.openai_api_key:
            raise ValueError("OPENAI_API_KEY environment variable is required")
        if not self.api_key and self.environment == "production":
            raise ValueError("API_KEY environment variable is required in production")
        if not self.allowed_origins or self.allowed_origins == [""]:
            raise ValueError("ALLOWED_ORIGINS environment variable is required")

settings = Settings() 
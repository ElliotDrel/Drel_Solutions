import os
import re
from typing import List
from urllib.parse import urlparse

class Settings:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.api_key = os.getenv("API_KEY")
        self.environment = os.getenv("ENVIRONMENT", "development")
        self.log_level = os.getenv("LOG_LEVEL", "INFO")
        self.max_request_size = int(os.getenv("MAX_REQUEST_SIZE", "10485760"))  # 10MB default
        self.rate_limit = os.getenv("RATE_LIMIT", "100/minute")
        self.allowed_origins = self._parse_allowed_origins(os.getenv("ALLOWED_ORIGINS", ""))
        self.allowed_hosts = self._parse_allowed_hosts(os.getenv("ALLOWED_HOSTS", ""))
        self._validate()

    def _parse_allowed_origins(self, origins_str: str) -> List[str]:
        """Parse and validate allowed origins"""
        if not origins_str:
            if self.environment == "development":
                return ["http://localhost:3000", "http://localhost:6756", "http://127.0.0.1:3000", "http://127.0.0.1:6756"]
            else:
                return []
        
        origins = [origin.strip() for origin in origins_str.split(",")]
        validated_origins = []
        
        for origin in origins:
            if origin in ["*"]:
                if self.environment == "development":
                    validated_origins.append(origin)
                else:
                    raise ValueError("Wildcard (*) origins not allowed in production")
            elif self._is_valid_url(origin):
                validated_origins.append(origin)
            else:
                raise ValueError(f"Invalid origin URL: {origin}")
        
        return validated_origins
    
    def _parse_allowed_hosts(self, hosts_str: str) -> List[str]:
        """Parse and validate allowed hosts"""
        if not hosts_str:
            if self.environment == "development":
                return ["localhost", "127.0.0.1", "0.0.0.0"]
            else:
                return []
        
        hosts = [host.strip() for host in hosts_str.split(",")]
        validated_hosts = []
        
        for host in hosts:
            if host in ["*"]:
                if self.environment == "development":
                    validated_hosts.append(host)
                else:
                    raise ValueError("Wildcard (*) hosts not allowed in production")
            elif self._is_valid_host(host):
                validated_hosts.append(host)
            else:
                raise ValueError(f"Invalid host: {host}")
        
        return validated_hosts
    
    def _is_valid_url(self, url: str) -> bool:
        """Validate URL format"""
        try:
            result = urlparse(url)
            return all([result.scheme, result.netloc]) and result.scheme in ["http", "https"]
        except Exception:
            return False
    
    def _is_valid_host(self, host: str) -> bool:
        """Validate host format (domain or IP)"""
        # Basic domain validation
        domain_pattern = r'^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$'
        # Basic IP validation
        ip_pattern = r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
        
        return bool(re.match(domain_pattern, host) or re.match(ip_pattern, host))

    def _validate(self):
        """Validate all configuration settings"""
        if not self.openai_api_key:
            raise ValueError("OPENAI_API_KEY environment variable is required")
        
        if not self.api_key and self.environment == "production":
            raise ValueError("API_KEY environment variable is required in production")
        
        if not self.allowed_origins:
            raise ValueError("ALLOWED_ORIGINS environment variable is required")
        
        if self.environment == "production" and not self.allowed_hosts:
            raise ValueError("ALLOWED_HOSTS environment variable is required in production")
        
        if self.max_request_size < 1024 or self.max_request_size > 100 * 1024 * 1024:  # 1KB - 100MB
            raise ValueError("MAX_REQUEST_SIZE must be between 1KB and 100MB")
        
        if self.environment not in ["development", "production", "staging"]:
            raise ValueError("ENVIRONMENT must be one of: development, production, staging")
        
        if self.log_level not in ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]:
            raise ValueError("LOG_LEVEL must be one of: DEBUG, INFO, WARNING, ERROR, CRITICAL")

settings = Settings() 
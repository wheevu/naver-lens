"""
Configuration module for LLM evaluation pipeline.
"""

import os
from typing import Optional


class Config:
    """Configuration class for API credentials and settings."""
    
    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        output_dir: Optional[str] = None
    ):
        """
        Initialize configuration from environment variables.
        
        Args:
            api_key: NAVER CLOVA Studio API key (overrides env var)
            base_url: NAVER CLOVA base URL (overrides env var)
            output_dir: Directory to save results (overrides env var)
        """
        # API credentials
        self.api_key = api_key or os.getenv('CLOVASTUDIO_API_KEY')
        self.base_url = base_url or os.getenv(
            'CLOVASTUDIO_BASE_URL',
            'https://clovastudio.stream.ntruss.com/v3/chat-completions'
        )
        
        # Log API key info for debugging (first/last 4 chars only)
        if self.api_key:
            key_preview = f"{self.api_key[:4]}...{self.api_key[-4:]}" if len(self.api_key) > 8 else "***"
            print(f"[Config] API Key loaded: {key_preview} (length: {len(self.api_key)})")
        else:
            print("[Config] WARNING: No API key found!")
        
        # Model configurations
        self.model = os.getenv('SUMMARIZATION_MODEL', 'HCX-005')
        self.judge_model = os.getenv('JUDGE_MODEL', 'HCX-007')
        
        # Summarization parameters
        self.temperature = float(os.getenv('SUMMARIZATION_TEMPERATURE', '0.5'))
        self.top_p = float(os.getenv('SUMMARIZATION_TOP_P', '0.8'))
        self.max_tokens = int(os.getenv('SUMMARIZATION_MAX_TOKENS', '500'))
        self.repeat_penalty = float(os.getenv('SUMMARIZATION_REPEAT_PENALTY', '1.0'))
        
        # LLM judge parameters
        self.judge_temperature = float(os.getenv('JUDGE_TEMPERATURE', '0.3'))
        self.judge_max_tokens = int(os.getenv('JUDGE_MAX_TOKENS', '1000'))
        self.judge_thinking = os.getenv('JUDGE_THINKING', 'true').lower() == 'true'
        self.judge_thinking_effort = os.getenv('JUDGE_THINKING_EFFORT', 'low')
        
        # Output settings
        self.output_dir = output_dir or os.getenv('OUTPUT_DIR', 'results')
        
        # Rate limiting
        self.rate_limit_delay = float(os.getenv('RATE_LIMIT_DELAY', '1.0'))
        self.max_retries = int(os.getenv('MAX_RETRIES', '3'))
        self.retry_delay = float(os.getenv('RETRY_DELAY', '2.0'))
        
    def validate(self) -> bool:
        """
        Validate that required configuration is present.
        
        Returns:
            True if configuration is valid
            
        Raises:
            ValueError: If required configuration is missing
        """
        if not self.api_key:
            raise ValueError(
                "API key is required. Set CLOVASTUDIO_API_KEY in .env file or pass api_key parameter."
            )
        if not self.base_url:
            raise ValueError(
                "Base URL is required. Set CLOVASTUDIO_BASE_URL in .env file or pass base_url parameter."
            )
        return True
    
    def __repr__(self) -> str:
        """Return string representation of config."""
        return (
            f"Config(\n"
            f"  model={self.model},\n"
            f"  judge_model={self.judge_model},\n"
            f"  temperature={self.temperature},\n"
            f"  judge_temperature={self.judge_temperature},\n"
            f"  output_dir={self.output_dir}\n"
            f")"
        )


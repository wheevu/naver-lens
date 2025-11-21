"""
NAVER CLOVA API client for summarization and chat completions.
"""

import logging
import time
from typing import Dict, List, Optional

import requests

from .prompts import SUMMARIZATION_SYSTEM_PROMPT, format_summarization_prompt

logger = logging.getLogger(__name__)


class NaverClovaClient:
    """Client for NAVER CLOVA Studio API."""
    
    def __init__(
        self,
        api_key: str,
        base_url: str,
        model: str = 'HCX-005',
        temperature: float = 0.5,
        top_p: float = 0.8,
        max_tokens: int = 500,
        repeat_penalty: float = 1.0,
        max_retries: int = 3,
        retry_delay: float = 2.0
    ):
        """
        Initialize NAVER CLOVA client.
        
        Args:
            api_key: CLOVA Studio API key
            base_url: Base URL for CLOVA API
            model: Model ID (e.g., HCX-005)
            temperature: Sampling temperature
            top_p: Top-p sampling parameter
            max_tokens: Maximum tokens to generate
            repeat_penalty: Repetition penalty
            max_retries: Maximum number of retries on failure
            retry_delay: Delay between retries (seconds)
        """
        self.api_key = api_key
        self.base_url = base_url
        self.model = model
        self.temperature = temperature
        self.top_p = top_p
        self.max_tokens = max_tokens
        self.repeat_penalty = repeat_penalty
        self.max_retries = max_retries
        self.retry_delay = retry_delay
        
        # Log API key details for debugging
        if self.api_key:
            key_preview = f"{self.api_key[:4]}...{self.api_key[-4:]}" if len(self.api_key) > 8 else "***"
            logger.info(f"NaverClovaClient initialized with API key: {key_preview} (length: {len(self.api_key)})")
            logger.info(f"Authorization header will be: Bearer {key_preview}")
        else:
            logger.error("NaverClovaClient initialized with NO API KEY!")
        
        self.headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.api_key}',
            'Accept': 'application/json'
        }
    
    def generate_summary(self, product: Dict) -> str:
        """
        Generate a summary for a product using NAVER CLOVA.
        
        Args:
            product: Product dictionary with structured data
            
        Returns:
            Generated summary string
        """
        # Build prompt messages
        messages = self._build_summarization_messages(product)
        
        # Call chat completion API
        response = self._chat_completion(messages)
        
        # Extract summary from response
        summary = response.get('result', {}).get('message', {}).get('content', '')
        
        return summary
    
    def _build_summarization_messages(self, product: Dict) -> List[Dict]:
        """
        Build message array for summarization prompt.
        Uses prompts from prompts.py for centralized prompt management.
        
        Args:
            product: Product data dictionary
            
        Returns:
            List of message dictionaries (system + user)
        """
        # Use centralized prompts from prompts.py
        user_prompt = format_summarization_prompt(product)
        
        messages = [
            {
                'role': 'system',
                'content': SUMMARIZATION_SYSTEM_PROMPT
            },
            {
                'role': 'user',
                'content': user_prompt
            }
        ]
        
        return messages
    
    def _format_product_data(self, product: Dict) -> str:
        """
        Format product data into a structured prompt.
        
        Args:
            product: Product data dictionary
            
        Returns:
            Formatted product data string
        """
        parts = []
        
        parts.append("Please analyze the following product and create a comprehensive summary:\n")
        
        # Basic info
        parts.append(f"Product Name: {product.get('name', 'Unknown')}")
        parts.append(f"Brand: {product.get('brand', 'Unknown')}")
        parts.append(f"Manufacturer: {product.get('manufacturer', 'Unknown')}")
        
        # Categories
        categories = product.get('categories', [])
        if categories:
            parts.append(f"Categories: {', '.join(categories)}")
        
        # Price
        prices = product.get('prices', {})
        if prices.get('current_price', 0) > 0:
            parts.append(f"Price: {prices.get('price_range', 'N/A')}")
        
        # Rating
        rating = product.get('rating', 0)
        if rating > 0:
            parts.append(f"Average Rating: {rating:.1f}/5.0")
        
        # Specifications
        dimension = product.get('dimension', '')
        if dimension:
            parts.append(f"Dimensions: {dimension}")
        
        weight = product.get('weight', '')
        if weight:
            parts.append(f"Weight: {weight}")
        
        colors = product.get('colors', '')
        if colors:
            parts.append(f"Available Colors: {colors}")
        
        sizes = product.get('sizes', '')
        if sizes:
            parts.append(f"Available Sizes: {sizes}")
        
        # Reviews
        reviews = product.get('reviews', [])
        if reviews:
            parts.append(f"\nCustomer Reviews ({len(reviews)} review(s)):")
            for i, review in enumerate(reviews[:5], 1):  # Include up to 5 reviews
                review_parts = []
                if review.get('title'):
                    review_parts.append(f"Title: {review['title']}")
                if review.get('rating', 0) > 0:
                    review_parts.append(f"Rating: {review['rating']}/5")
                if review.get('text'):
                    review_parts.append(f"Review: {review['text'][:500]}")  # Limit review length
                if review_parts:
                    parts.append(f"\nReview {i}:")
                    parts.extend(review_parts)
        
        parts.append("\nPlease provide a summary including:")
        parts.append("1. Product overview (name, brand, key features)")
        parts.append("2. Price and value assessment")
        parts.append("3. Average rating and customer satisfaction")
        parts.append("4. Pros (positive highlights from reviews)")
        parts.append("5. Cons (concerns or issues mentioned)")
        parts.append("6. Count of positive vs negative sentiments")
        
        return '\n'.join(parts)
    
    def _chat_completion(
        self,
        messages: List[Dict],
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None
    ) -> Dict:
        """
        Call NAVER CLOVA chat completion API.
        
        Args:
            messages: List of message dictionaries
            temperature: Override default temperature
            max_tokens: Override default max_tokens
            
        Returns:
            API response dictionary
        """
        url = f"{self.base_url}/{self.model}"
        
        payload = {
            'messages': messages,
            'temperature': temperature or self.temperature,
            'topP': self.top_p,
            'maxTokens': max_tokens or self.max_tokens,
            'repeatPenalty': self.repeat_penalty
        }
        
        # Retry logic
        for attempt in range(self.max_retries):
            try:
                logger.debug(f"Calling CLOVA API (attempt {attempt + 1}/{self.max_retries})...")
                
                # Log request details for debugging
                # logger.info(f"Request URL: {url}")
                # headers_safe = {k: (v if k != 'Authorization' else f"Bearer {v[7:11]}...{v[-4:]}") for k, v in self.headers.items()}
                # logger.info(f"Request headers: {headers_safe}")
                # logger.info(f"Payload keys: {list(payload.keys())}")
                
                response = requests.post(
                    url,
                    headers=self.headers,
                    json=payload,
                    timeout=30
                )
                
                if response.status_code == 200:
                    return response.json()
                elif response.status_code == 429:
                    # Rate limit - wait longer
                    wait_time = self.retry_delay * (attempt + 1)
                    logger.warning(f"Rate limit hit, waiting {wait_time}s...")
                    time.sleep(wait_time)
                    continue
                else:
                    logger.error(f"API error: {response.status_code} - {response.text}")
                    response.raise_for_status()
                    
            except requests.exceptions.RequestException as e:
                logger.error(f"Request failed (attempt {attempt + 1}): {e}")
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay)
                    continue
                raise
        
        raise Exception(f"Failed to complete request after {self.max_retries} attempts")

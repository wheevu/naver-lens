"""
LLM-as-a-judge evaluator using NAVER CLOVA HCX-007 with thinking mode.
"""

import json
import logging
import re
import time
from typing import Dict, Optional

import requests

from .prompts import JUDGE_SYSTEM_PROMPT, format_judge_prompt

logger = logging.getLogger(__name__)


class LLMJudge:
    """LLM-as-a-judge evaluator for summary quality assessment."""
    
    def __init__(
        self,
        api_key: str,
        base_url: str,
        judge_model: str = 'HCX-007',
        temperature: float = 0.3,
        max_tokens: int = 1000,
        use_thinking: bool = True,
        max_retries: int = 3,
        retry_delay: float = 2.0
    ):
        """
        Initialize LLM judge.
        
        Args:
            api_key: CLOVA Studio API key
            base_url: Base URL for CLOVA API
            judge_model: Judge model ID (HCX-007)
            temperature: Sampling temperature (lower for consistent scoring)
            max_tokens: Maximum tokens for judgment
            use_thinking: Enable thinking mode for deeper reasoning
            max_retries: Maximum retries on failure
            retry_delay: Delay between retries
        """
        self.api_key = api_key
        self.base_url = base_url
        self.judge_model = judge_model
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.use_thinking = use_thinking
        self.max_retries = max_retries
        self.retry_delay = retry_delay
        
        self.headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.api_key}',
            'Accept': 'application/json'
        }
        
        self.criteria = [
            'factuality',
            'coverage',
            'proscons_accuracy',
            'readability',
            'conciseness'
        ]
    
    def judge_summary(
        self,
        product_data: Dict,
        generated_summary: str
    ) -> Dict:
        """
        Judge the quality of a generated summary.
        
        Args:
            product_data: Original product data dictionary
            generated_summary: Generated summary text to evaluate
            
        Returns:
            Dictionary with scores and reasoning for each criterion
        """
        # Build judgment prompt
        messages = self._build_judge_messages(product_data, generated_summary)
        
        # Call chat completion API with thinking mode
        response = self._chat_completion(messages)
        
        # Parse judgment from response
        judgment = self._parse_judgment(response)
        
        return judgment
    
    def _build_judge_messages(
        self,
        product_data: Dict,
        generated_summary: str
    ) -> list:
        """
        Build message array for LLM judge prompt.
        Uses prompts from prompts.py for centralized prompt management.
        
        Args:
            product_data: Product data dictionary
            generated_summary: Generated summary to evaluate
            
        Returns:
            List of message dictionaries (system + user)
        """
        # Use centralized prompts from prompts.py
        user_prompt = format_judge_prompt(product_data, generated_summary)
        
        messages = [
            {
                'role': 'system',
                'content': JUDGE_SYSTEM_PROMPT
            },
            {
                'role': 'user',
                'content': user_prompt
            }
        ]
        
        return messages
    
    def _format_judge_input(
        self,
        product_data: Dict,
        generated_summary: str
    ) -> str:
        """
        Format product data and summary for judge evaluation.
        
        Args:
            product_data: Product data dictionary
            generated_summary: Generated summary
            
        Returns:
            Formatted evaluation input string
        """
        parts = []
        
        parts.append("=== ORIGINAL PRODUCT DATA ===\n")
        
        # Product basics
        parts.append(f"Product Name: {product_data.get('name', 'Unknown')}")
        parts.append(f"Brand: {product_data.get('brand', 'Unknown')}")
        
        # Categories
        categories = product_data.get('categories', [])
        if categories:
            parts.append(f"Categories: {', '.join(categories)}")
        
        # Price
        prices = product_data.get('prices', {})
        if prices.get('current_price', 0) > 0:
            parts.append(f"Price: {prices.get('price_range', 'N/A')}")
        
        # Rating
        rating = product_data.get('rating', 0)
        if rating > 0:
            parts.append(f"Rating: {rating:.1f}/5.0")
        
        # Specifications
        specs = []
        if product_data.get('dimension'):
            specs.append(f"Dimensions: {product_data['dimension']}")
        if product_data.get('weight'):
            specs.append(f"Weight: {product_data['weight']}")
        if specs:
            parts.append(f"Specifications: {', '.join(specs)}")
        
        # Reviews
        reviews = product_data.get('reviews', [])
        if reviews:
            parts.append(f"\nCustomer Reviews ({len(reviews)} review(s)):")
            for i, review in enumerate(reviews[:3], 1):
                parts.append(f"\nReview {i}:")
                if review.get('rating'):
                    parts.append(f"  Rating: {review['rating']}/5")
                if review.get('title'):
                    parts.append(f"  Title: {review['title']}")
                if review.get('text'):
                    text = review['text'][:300] + '...' if len(review['text']) > 300 else review['text']
                    parts.append(f"  Text: {text}")
        
        parts.append("\n\n=== GENERATED SUMMARY ===\n")
        parts.append(generated_summary)
        
        parts.append("\n\n=== YOUR TASK ===")
        parts.append("Think through your evaluation carefully, then output ONLY the JSON evaluation object as your final answer.")
        
        return '\n'.join(parts)
    
    def _chat_completion(self, messages: list) -> Dict:
        """
        Call NAVER CLOVA chat completion API (v3) in reasoning (thinking) mode.
        """
        url = f"{self.base_url}/{self.judge_model}"
        
        # Build payload according to CLOVA API spec
        payload = {
            "messages": messages,
            "thinking": {
                "effort": "low" if self.use_thinking else "none"
            },
            "topP": 0.8,
            "topK": 0,
            # Use maxCompletionTokens when using thinking
            "maxCompletionTokens": self.max_tokens,
            "temperature": self.temperature,
            "repetitionPenalty": 1.0
        }
        
        for attempt in range(self.max_retries):
            try:
                logger.debug(f"Calling CLOVA judge API (attempt {attempt + 1})…")
                response = requests.post(
                    url,
                    headers=self.headers,
                    json=payload,
                    timeout=60
                )
                if response.status_code == 200:
                    return response.json()
                elif response.status_code == 429:
                    wait = self.retry_delay * (attempt + 1)
                    logger.warning(f"Rate limited. Waiting {wait}s then retrying…")
                    time.sleep(wait)
                    continue
                else:
                    logger.error(f"API error: {response.status_code} - {response.text}")
                    response.raise_for_status()

            except requests.exceptions.RequestException as e:
                logger.error(f"Request failed (attempt {attempt + 1}): {e}")
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay)
                else:
                    raise
        
        raise Exception(f"Failed to get a valid response after {self.max_retries} attempts")

    
    def _parse_judgment(self, response: Dict) -> Dict:
        """
        Parse judgment from API response.
        
        Args:
            response: API response dictionary
            
        Returns:
            Parsed judgment with scores and reasoning
        """
        # Debug: Log the full response structure
        logger.debug(f"Full API response structure: {list(response.keys())}")
        
        # Try multiple paths for content extraction (API v3 format variations)
        content = None
        thinking_content = None
        
        # Path 1: v3 format - result.message.content (and thinkingContent for thinking mode)
        if 'result' in response:
            result = response['result']
            logger.debug(f"Result keys: {list(result.keys())}")
            if 'message' in result:
                message = result['message']
                logger.debug(f"Message keys: {list(message.keys())}")
                content = message.get('content', '')
                thinking_content = message.get('thinkingContent', '')
        
        # Path 2: Direct content field
        if not content and 'content' in response:
            content = response['content']
            
        # Path 3: Check for 'message' at top level
        if not content and 'message' in response:
            message = response['message']
            if isinstance(message, dict):
                content = message.get('content', '')
            elif isinstance(message, str):
                content = message
        
        # Path 4: If content is empty but we have thinkingContent, use that
        if not content and thinking_content:
            logger.info("Using thinkingContent as content is empty")
            content = thinking_content
        
        if not content:
            logger.error(f"Empty response from judge API. Response keys: {list(response.keys())}")
            logger.error(f"Full response: {json.dumps(response, indent=2, ensure_ascii=False)[:500]}")
            return self._get_default_judgment("Empty response from API")
        
        # Try to extract JSON from response
        try:
            # Look for JSON block in response
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            
            if json_match:
                json_str = json_match.group(0)
                
                # Try to fix common JSON issues from LLM output
                # Fix 1: "reasoning: " (missing closing quote) -> "reasoning": "
                json_str = re.sub(r'"reasoning:\s*"', '"reasoning": "', json_str)
                
                # Fix 2: "score: X -> "score": X
                json_str = re.sub(r'"score:\s*(\d)', r'"score": \1', json_str)
                
                # Fix 3: Unclosed strings before commas - add closing quote
                # Pattern: "text without closing quote,
                json_str = re.sub(r':\s*"([^"]*?)(?=\s*[,}])', r': "\1"', json_str)
                
                logger.debug(f"Extracted JSON string (first 300 chars): {json_str[:300]}")
                
                try:
                    judgment_data = json.loads(json_str)
                except json.JSONDecodeError as e:
                    logger.warning(f"First JSON parse failed: {e}. Trying more aggressive fixes...")
                    
                    # More aggressive fix: extract each field individually
                    judgment_data = {}
                    
                    # Extract factuality
                    fact_match = re.search(r'"factuality":\s*\{[^}]*"score":\s*(\d)[^}]*"reasoning":\s*"([^"]*)"', json_str)
                    if fact_match:
                        judgment_data['factuality'] = {"score": int(fact_match.group(1)), "reasoning": fact_match.group(2)}
                    
                    # Extract coverage
                    cov_match = re.search(r'"coverage":\s*\{[^}]*"score":\s*(\d)[^}]*"reasoning":\s*"([^"]*)"', json_str)
                    if cov_match:
                        judgment_data['coverage'] = {"score": int(cov_match.group(1)), "reasoning": cov_match.group(2)}
                    
                    # Extract proscons_accuracy
                    pros_match = re.search(r'"proscons_accuracy":\s*\{[^}]*"score":\s*(\d)[^}]*"reasoning":\s*"([^"]*)"', json_str)
                    if pros_match:
                        judgment_data['proscons_accuracy'] = {"score": int(pros_match.group(1)), "reasoning": pros_match.group(2)}
                    
                    # Extract readability
                    read_match = re.search(r'"readability":\s*\{[^}]*"score":\s*(\d)[^}]*"reasoning":\s*"([^"]*)"', json_str)
                    if read_match:
                        judgment_data['readability'] = {"score": int(read_match.group(1)), "reasoning": read_match.group(2)}
                    
                    # Extract conciseness
                    conc_match = re.search(r'"conciseness":\s*\{[^}]*"score":\s*(\d)[^}]*"reasoning":\s*"([^"]*)"', json_str)
                    if conc_match:
                        judgment_data['conciseness'] = {"score": int(conc_match.group(1)), "reasoning": conc_match.group(2)}
                    
                    # Extract overall
                    overall_match = re.search(r'"overall":\s*([\d.]+)', json_str)
                    if overall_match:
                        judgment_data['overall'] = float(overall_match.group(1))
                    
                    if not judgment_data:
                        raise json.JSONDecodeError("Could not extract any fields", json_str, 0)
                
                # Extract scores and reasoning with defaults for missing criteria
                scores = {}
                reasoning = {}
                
                for criterion in self.criteria:
                    if criterion in judgment_data:
                        criterion_data = judgment_data[criterion]
                        if isinstance(criterion_data, dict):
                            scores[criterion] = criterion_data.get('score', 3)
                            reasoning[criterion] = criterion_data.get('reasoning', '')
                        else:
                            scores[criterion] = criterion_data
                            reasoning[criterion] = ''
                    else:
                        # Default values for missing criteria
                        scores[criterion] = 3
                        reasoning[criterion] = 'Criterion not found in response'
                
                # Overall score
                if 'overall' in judgment_data:
                    overall_score = judgment_data['overall']
                else:
                    # Compute average if not provided
                    overall_score = sum(scores.values()) / len(scores) if scores else 3.0
                
                return {
                    'scores': {
                        **scores,
                        'overall': overall_score
                    },
                    'reasoning': reasoning,
                    'raw_response': content
                }
            else:
                logger.warning("No JSON found in response, attempting fallback parsing")
                return self._fallback_parse(content)
                
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON from response: {e}")
            return self._fallback_parse(content)
    
    def _fallback_parse(self, content: str) -> Dict:
        """
        Fallback parser for when JSON extraction fails.
        Attempts to extract scores from text.
        
        Args:
            content: Response content text
            
        Returns:
            Best-effort judgment dictionary
        """
        scores = {}
        reasoning = {}
        
        # Try to find scores in text (e.g., "factuality: 4", "score: 5")
        for criterion in self.criteria:
            pattern = rf'{criterion}[:\s]+(\d)'
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                scores[criterion] = int(match.group(1))
            else:
                scores[criterion] = 3  # Default to middle score
            
            # Try to extract reasoning (paragraph after criterion mention)
            reasoning_pattern = rf'{criterion}.*?(?:reasoning|:)[\s:]*([^.\n]+)'
            reasoning_match = re.search(reasoning_pattern, content, re.IGNORECASE | re.DOTALL)
            if reasoning_match:
                reasoning[criterion] = reasoning_match.group(1).strip()[:200]
            else:
                reasoning[criterion] = "Unable to extract reasoning from response"
        
        overall = sum(scores.values()) / len(scores) if scores else 3.0
        
        return {
            'scores': {
                **scores,
                'overall': overall
            },
            'reasoning': reasoning,
            'raw_response': content,
            'parse_method': 'fallback'
        }
    
    def _get_default_judgment(self, error_message: str) -> Dict:
        """
        Return default judgment when evaluation fails.
        
        Args:
            error_message: Error description
            
        Returns:
            Default judgment dictionary
        """
        return {
            'scores': {
                'factuality': 3,
                'coverage': 3,
                'proscons_accuracy': 3,
                'readability': 3,
                'conciseness': 3,
                'overall': 3.0
            },
            'reasoning': {
                criterion: error_message
                for criterion in self.criteria
            },
            'error': error_message
        }

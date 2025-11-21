"""
Prompt templates for LLM evaluation pipeline.
Centralized location for all prompt engineering.
"""


# =============================================================================
# SUMMARIZATION PROMPTS (for HCX-005)
# =============================================================================

SUMMARIZATION_SYSTEM_PROMPT = """You are an expert product analyst specializing in e-commerce.
Your task is to create comprehensive, accurate product summaries for online shoppers.

Key Requirements:
- Extract and present factual product information accurately
- Synthesize customer reviews into clear pros and cons
- Maintain objectivity and avoid adding unverified claims
- Structure information in a clear, scannable format
- Focus on information that helps purchase decisions"""


SUMMARIZATION_USER_TEMPLATE = """Please create a comprehensive product summary based on the following information.

=== PRODUCT INFORMATION ===
Name: {name}
Brand: {brand}
{categories}
{price}
{rating}
{specifications}

=== CUSTOMER REVIEWS ===
{reviews}

=== YOUR TASK ===
Create a well-structured summary that includes:

1. **Product Overview**: Brief description with key specifications
2. **Pricing & Availability**: Current price range and value assessment
3. **Customer Sentiment**: Overall rating and review distribution
4. **Pros**: Key benefits mentioned in customer reviews (3-5 points)
5. **Cons**: Common issues or limitations from reviews (3-5 points)
6. **Recommendation**: Who this product is best suited for

Requirements:
- Be factual and accurate - only include information from the data provided
- Keep it concise but comprehensive (around 200-300 words)
- Use bullet points for pros/cons
- Avoid marketing language or unverified claims"""


# =============================================================================
# LLM JUDGE PROMPTS (for HCX-007)
# =============================================================================

JUDGE_SYSTEM_PROMPT = """You are an expert evaluator for product summarization systems.
Your task is to carefully assess the quality of AI-generated product summaries based on multiple criteria.

IMPORTANT: After your thinking/reasoning process, you MUST output your final evaluation as a valid JSON object.

Evaluation Criteria (rate each 1-5):

1. FACTUALITY (1-5): Does the summary accurately represent the product information without hallucinations?
   - 5: Completely accurate, no errors
   - 4: Mostly accurate, minor imprecisions
   - 3: Some inaccuracies present
   - 2: Multiple factual errors
   - 1: Severely inaccurate or misleading

2. COVERAGE (1-5): Does the summary cover all important product aspects (specs, price, rating, reviews)?
   - 5: Comprehensive coverage of all key aspects
   - 4: Most important aspects covered
   - 3: Some key information missing
   - 2: Many gaps in coverage
   - 1: Minimal or inadequate coverage

3. PROS/CONS ACCURACY (1-5): Are the pros and cons accurately extracted from customer reviews?
   - 5: Highly accurate reflection of customer sentiment
   - 4: Mostly accurate with minor deviations
   - 3: Some misrepresentation of reviews
   - 2: Significant misrepresentation
   - 1: Pros/cons don't match reviews at all

4. READABILITY (1-5): Is the summary well-structured, clear, and easy to understand?
   - 5: Excellent structure and clarity
   - 4: Good readability with minor issues
   - 3: Acceptable but could be clearer
   - 2: Confusing or poorly structured
   - 1: Very difficult to understand

5. CONCISENESS (1-5): Is the summary appropriately concise without redundancy?
   - 5: Perfectly concise, no unnecessary information
   - 4: Generally concise with minor redundancy
   - 3: Some verbosity or repetition
   - 2: Overly verbose or repetitive
   - 1: Extremely wordy or repetitive

REQUIRED OUTPUT FORMAT (you must output this exact JSON structure):
{
  "factuality": {"score": X, "reasoning": "brief explanation"},
  "coverage": {"score": X, "reasoning": "brief explanation"},
  "proscons_accuracy": {"score": X, "reasoning": "brief explanation"},
  "readability": {"score": X, "reasoning": "brief explanation"},
  "conciseness": {"score": X, "reasoning": "brief explanation"},
  "overall": X.X
}

The overall score must be the average of all criteria scores (compute: (factuality + coverage + proscons_accuracy + readability + conciseness) / 5). Keep reasoning concise (1-2 sentences max)."""


JUDGE_USER_TEMPLATE = """=== ORIGINAL PRODUCT DATA ===
{product_data}

=== GENERATED SUMMARY ===
{generated_summary}

=== YOUR TASK ===
Think through your evaluation carefully, then output ONLY the JSON evaluation object as your final answer."""


# =============================================================================
# PROMPT FORMATTING HELPERS
# =============================================================================

def format_summarization_prompt(product_data: dict) -> str:
    """
    Format product data into summarization prompt.
    
    Args:
        product_data: Dictionary containing product information
        
    Returns:
        Formatted prompt string
    """
    # Format categories
    categories = product_data.get('categories', [])
    categories_str = f"Categories: {', '.join(categories)}" if categories else ""
    
    # Format price
    prices = product_data.get('prices', {})
    price_str = ""
    if prices.get('current_price', 0) > 0:
        price_str = f"Price: {prices.get('price_range', 'N/A')}"
    
    # Format rating
    rating = product_data.get('rating', 0)
    rating_str = f"Rating: {rating:.1f}/5.0 based on {len(product_data.get('reviews', []))} reviews" if rating > 0 else ""
    
    # Format specifications
    specs = []
    if product_data.get('dimension'):
        specs.append(f"Dimensions: {product_data['dimension']}")
    if product_data.get('weight'):
        specs.append(f"Weight: {product_data['weight']}")
    specs_str = "Specifications:\n" + "\n".join(f"  - {spec}" for spec in specs) if specs else ""
    
    # Format reviews (show first 5 reviews)
    reviews = product_data.get('reviews', [])
    reviews_list = []
    for i, review in enumerate(reviews[:5], 1):
        review_parts = [f"\nReview {i}:"]
        if review.get('rating'):
            review_parts.append(f"  Rating: {review['rating']}/5")
        if review.get('title'):
            review_parts.append(f"  Title: {review['title']}")
        if review.get('text'):
            text = review['text'][:300] + '...' if len(review['text']) > 300 else review['text']
            review_parts.append(f"  Text: {text}")
        reviews_list.append('\n'.join(review_parts))
    
    reviews_str = '\n'.join(reviews_list) if reviews_list else "No reviews available"
    if len(reviews) > 5:
        reviews_str += f"\n\n(Showing 5 of {len(reviews)} reviews)"
    
    return SUMMARIZATION_USER_TEMPLATE.format(
        name=product_data.get('name', 'Unknown'),
        brand=product_data.get('brand', 'Unknown'),
        categories=categories_str,
        price=price_str,
        rating=rating_str,
        specifications=specs_str,
        reviews=reviews_str
    )


def format_judge_prompt(product_data: dict, generated_summary: str) -> str:
    """
    Format judge evaluation prompt.
    
    Args:
        product_data: Original product data
        generated_summary: AI-generated summary to evaluate
        
    Returns:
        Formatted judge prompt string
    """
    # Format product data for judge
    parts = []
    parts.append(f"Product Name: {product_data.get('name', 'Unknown')}")
    parts.append(f"Brand: {product_data.get('brand', 'Unknown')}")
    
    categories = product_data.get('categories', [])
    if categories:
        parts.append(f"Categories: {', '.join(categories)}")
    
    prices = product_data.get('prices', {})
    if prices.get('current_price', 0) > 0:
        parts.append(f"Price: {prices.get('price_range', 'N/A')}")
    
    rating = product_data.get('rating', 0)
    if rating > 0:
        parts.append(f"Rating: {rating:.1f}/5.0")
    
    specs = []
    if product_data.get('dimension'):
        specs.append(f"Dimensions: {product_data['dimension']}")
    if product_data.get('weight'):
        specs.append(f"Weight: {product_data['weight']}")
    if specs:
        parts.append(f"Specifications: {', '.join(specs)}")
    
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
    
    product_data_str = '\n'.join(parts)
    
    return JUDGE_USER_TEMPLATE.format(
        product_data=product_data_str,
        generated_summary=generated_summary
    )

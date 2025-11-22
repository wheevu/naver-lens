'use strict';


const summarizationPrompts = {
  /**
   * SYSTEM PROMPT - Establishes AI role, expertise, and core principles
   */
  system: `You're a helpful shopping assistant providing clear product insights based on customer reviews.

YOUR MISSION:
- Help shoppers understand what makes this product special
- Share genuine customer experiences
- Present both strengths and considerations
- Only include information from actual reviews

CORE PRINCIPLES:
1. FACTUALITY FIRST: Only include information explicitly provided in the product data
2. NO HALLUCINATIONS: Never invent features, specifications, or claims not present in the data
3. CUSTOMER-CENTRIC: Prioritize information that directly impacts purchase decisions
4. BALANCED ANALYSIS: Present both strengths and limitations objectively
5. TRANSPARENCY: Acknowledge when information is limited or unavailable

OUTPUT FORMAT - Return ONLY valid JSON (no markdown, no code blocks):

{
  "overview": "1-2 sentences describing what this product is and its main appeal based on reviews",
  "ratings": {
    "score": "4.8/5.0",
    "count": "954 customers",
    "sentiment": "Brief summary of customer satisfaction",
    "coverage": "What aspects customers discuss most"
  },
  "satisfaction": {
    "aspects": [
      {"name": "Comfort", "score": 85, "feedback": "Well-received by most users"},
      {"name": "Quality", "score": 78, "feedback": "Solid build quality reported"},
      {"name": "Design", "score": 90, "feedback": "Modern aesthetic appreciated"},
      {"name": "Durability", "score": 45, "feedback": "Limited long-term feedback"}
    ]
  },
  "keywords": {
    "positive": [
      {"word": "comfortable", "count": 18},
      {"word": "quality", "count": 15},
      {"word": "stylish", "count": 12}
    ],
    "concerns": [
      {"word": "sizing", "count": 8},
      {"word": "price", "count": 5}
    ],
    "notable": [
      {"word": "versatile", "count": 11},
      {"word": "lightweight", "count": 9}
    ]
  },
  "strengths": [
    "Specific benefit with brief detail from reviews",
    "Another strength mentioned in reviews",
    "Additional positive aspect"
  ],
  "considerations": [
    "Specific concern from reviews",
    "Another consideration"
  ],
  "bestFor": "1-2 sentences on ideal customer based on reviews",
  "productInfo": {
    "brand": "Brand name",
    "category": "Category",
    "options": "Available variations"
  }
}

QUALITY STANDARDS:
✓ Return ONLY the JSON object (no surrounding text, no markdown, no code blocks)
✓ Ensure valid JSON syntax (proper quotes, commas, brackets)
✓ Count keywords accurately from actual reviews
✓ Keep descriptions concise (200-250 words total across all fields)
✓ All scores 0-100 based on review coverage and sentiment

CRITICAL:
- Output must be valid, parseable JSON
- Do NOT wrap in markdown code blocks
- Do NOT add any text before or after the JSON
- Do NOT use backticks
- Start response with { and end with }

WHAT TO AVOID:
✗ Markdown formatting or code blocks
✗ Unverified claims not in source data
✗ Generic statements
✗ Marketing hyperbole`,

  /**
   * USER PROMPT TEMPLATE - Provides structured product data for analysis
   * @param {Object} productData - Cleaned product information
   * @returns {string} Formatted prompt with product data
   */
  userTemplate: (productData) => {
    // Format rating display
    const ratingDisplay = productData.rating && productData.rating !== 'N/A'
      ? `${productData.rating}/5.0`
      : 'No rating';

    // Format review count
    const reviewCountDisplay = productData.reviewCount 
      ? `${productData.reviewCount.toLocaleString()} customers`
      : 'No reviews yet';

    // Format available options
    const optionsDisplay = productData.options && productData.options.length > 0
      ? productData.options.map(opt => `${opt.name}: ${opt.values.join(', ')}`).join(' | ')
      : 'Standard options';

    // Format reviews section
    const reviewsSection = productData.reviews && productData.reviews.length > 0
      ? `\n=== CUSTOMER REVIEWS (${productData.reviews.length} sample${productData.reviews.length > 1 ? 's' : ''}) ===\n${
          productData.reviews.slice(0, 10).map((review, idx) => 
            `Review ${idx + 1}: "${review}"`
          ).join('\n')
        }\n${productData.reviews.length > 10 ? `\n(Showing 10 of ${productData.reviews.length} reviews)` : ''}`
      : '\n=== CUSTOMER REVIEWS ===\nNo customer reviews available yet.';

    return `Analyze this product and return a structured JSON summary based on customer reviews.

=== PRODUCT INFO ===
Name: ${productData.name || 'Product name unavailable'}
Brand: ${productData.brand || 'Brand not specified'}
Category: ${productData.category || 'Uncategorized'}

=== CUSTOMER RATINGS ===
Overall Rating: ${ratingDisplay} from ${reviewCountDisplay}

=== PRODUCT DESCRIPTION ===
${productData.description || 'No detailed description provided.'}

=== AVAILABLE OPTIONS ===
${optionsDisplay}
${reviewsSection}

=== YOUR TASK ===
Return ONLY a valid JSON object following the exact structure in your system instructions.

CRITICAL REQUIREMENTS:
1. Start your response with { and end with }
2. NO markdown, NO code blocks, NO backticks
3. Count keywords from actual review text above
4. Base all feedback on provided reviews only
5. If info is missing, use "Limited feedback available"
6. Target 200-250 words total across all text fields

Return the JSON now:`;
  }
};

export default summarizationPrompts;
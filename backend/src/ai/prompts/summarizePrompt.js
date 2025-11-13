'use strict';

const summarizationPrompts = {
  system: `You are an expert product analyst. Analyze and summarize product information clearly and concisely in Korean.

Focus on:
- Key features and specifications
- Price and value proposition
- Pros and cons
- Target audience
- Overall recommendation

Keep summaries under 300 words and make them easy to understand.`,

  userTemplate: (productData) => {
    return `Please analyze and summarize this product:

Product Name: ${productData.name || 'N/A'}
Price: ${productData.price || 'N/A'}
Brand: ${productData.brand || 'N/A'}
Category: ${productData.category || 'N/A'}
Description: ${productData.description || 'N/A'}
Mall Name: ${productData.mallName || 'N/A'}
Rating: ${productData.rating || 'N/A'}

Provide a comprehensive summary in Korean that helps users make an informed purchase decision.`;
  }
};

export default summarizationPrompts;
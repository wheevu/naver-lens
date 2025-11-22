// Summarize service logic 
'use strict';

import NaverClovaProvider from '../ai/providers/naverProvider.js';
import summarizationPrompts from '../ai/prompts/summarizePrompt.js';
import TextProcessor from '../ai/processors/textProcessor.js';

class SummarizeService {
  constructor(apiKey, baseUrl) {
    this.clovaProvider = new NaverClovaProvider(apiKey, baseUrl);
  }

  /**
   * Summarize product using NAVER CLOVA AI
   * @param {Object} productData - Product information
   * @param {string} lang - Language for summary ('en' or 'ko')
   */
  async summarizeProduct(productData, lang = 'en') {
    try {
      // 1. Extract and sanitize product info
      const cleanedData = TextProcessor.extractProductInfo(productData);

      // 2. Build messages for CLOVA
      const messages = [
        {
          role: 'system',
          content: summarizationPrompts.system(lang)
        },
        {
          role: 'user',
          content: summarizationPrompts.userTemplate(cleanedData, lang)
        }
      ];

      // 3. Generate summary using NAVER CLOVA
      const response = await this.clovaProvider.chatCompletion(messages, {
        model: 'HCX-005',
        maxTokens: 1500,  // Increased for complete JSON response
        temperature: 0.5,
        topP: 0.8
      });

      // 4. Extract content from response
      const summaryContent = response.result?.message?.content || response.choices?.[0]?.message?.content || '';

      // 5. Format and return result
      const formattedSummary = TextProcessor.formatSummary(summaryContent, cleanedData);

      return {
        success: true,
        data: {
          product: cleanedData,
          summary: formattedSummary
        }
      };
    } catch (error) {
      console.error('Product summarization error:', error);
      throw error;
    }
  }
}

export default SummarizeService;
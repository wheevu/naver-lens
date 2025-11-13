'use strict';

class TextProcessor {
  /**
   * Sanitize and clean input text
   */
  static sanitizeInput(text) {
    if (!text || typeof text !== 'string') return '';
    return text.trim().replace(/\s+/g, ' ');
  }

  /**
   * Strip HTML tags from text
   */
  static stripHtml(input) {
    if (typeof input !== 'string') return '';
    return input.replace(/<[^>]*>/g, '');
  }

  /**
   * Extract and clean product information
   */
  static extractProductInfo(rawData) {
    return {
      name: this.stripHtml(this.sanitizeInput(rawData.title || rawData.name)),
      price: this.sanitizeInput(rawData.lprice || rawData.price),
      brand: this.sanitizeInput(rawData.brand),
      category: this.sanitizeInput(rawData.category1 || rawData.category),
      description: this.stripHtml(this.sanitizeInput(rawData.description)),
      mallName: this.sanitizeInput(rawData.mallName),
      rating: rawData.rating || 'N/A',
      productId: rawData.productId
    };
  }

  /**
   * Format AI summary response
   */
  static formatSummary(summary, productData) {
    return {
      productId: productData.productId,
      summary: this.sanitizeInput(summary),
      generatedAt: new Date().toISOString(),
      wordCount: summary.split(' ').length
    };
  }
}

export default TextProcessor;
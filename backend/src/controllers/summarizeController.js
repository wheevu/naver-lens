'use strict';
import SummarizeService from '../services/summarizeService.js';
import { loadDetailsProducts } from '../services/productService.js';

let summarizeService;

// Initialize service with env variables
function initializeService() {
  if (!summarizeService) {
    const apiKey = process.env.CLOVASTUDIO_API_KEY;
    const baseUrl = process.env.CLOVASTUDIO_BASE_URL;

    if (!apiKey || !baseUrl) {
      throw new Error('CLOVASTUDIO_API_KEY and CLOVASTUDIO_BASE_URL must be set in .env');
    }

    summarizeService = new SummarizeService(apiKey, baseUrl);
  }
  return summarizeService;
}

/**
 * POST /api/summarize
 * Body: { productId: string } or { productData: object }
 */
async function summarizeProduct(req, res) {
  try {
    const service = initializeService();
    let productData;

    console.log('📥 Request body:', JSON.stringify(req.body, null, 2));

    // Option 1: Get product by ID from our data
    if (req.body.productId) {
      // console.log('🔍 Looking up product by ID:', req.body.productId);
      const result = await loadDetailsProducts();
      const products = result.data; // Extract the data array from the result object
      productData = products.find(p => p.productId === req.body.productId);

      if (!productData) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }
      console.log('✅ Found product:', productData.title);
    }
    // Option 2: Use provided product data
    else if (req.body.productData) {
      productData = req.body.productData;
      console.log('📦 Using provided product data');
    }
    // Option 3: Use entire body as product data
    else if (req.body.title || req.body.name) {
      productData = req.body;
      console.log('📄 Using request body as product data');
    }
    else {
      return res.status(400).json({
        success: false,
        error: 'Either productId or productData is required'
      });
    }

    console.log('Generating summary for:', productData.title || productData.name);

    // Generate summary
    const result = await service.summarizeProduct(productData);

    console.log('Summary generated successfully', result);
    return res.status(200).json(result);
  } catch (error) {
    console.error('❌ Summarization controller error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate product summary',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

export { summarizeProduct };
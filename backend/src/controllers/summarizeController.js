'use strict';
import SummarizeService from '../services/summarizeService.js';
import { loadDetailsProducts } from '../services/productService.js';
import Product from '../models/productModel.js';

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

    console.log('Request body:', JSON.stringify(req.body, null, 2));

    // Determine product data from different input formats
    if (req.body.productId) {
      // Option 1: Get product by ID from our data
      const result = await loadDetailsProducts();
      const products = result.data;
      productData = products.find(p => p.productId === req.body.productId);

      if (!productData) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }
      console.log('Found product:', productData.title);
    }
    else if (req.body.productData) {
      // Option 2: Use provided product data
      productData = req.body.productData;
      console.log('Using provided product data');
    }
    else if (req.body.title || req.body.name) {
      // Option 3: Use entire body as product data
      productData = req.body;
      console.log('Using request body as product data');
    }
    else {
      return res.status(400).json({
        success: false,
        error: 'Either productId or productData is required'
      });
    }

    // Check MongoDB Cache (works for all input formats if productId is available)
    if (productData.productId) {
      try {
        const cachedProduct = await Product.findOne({ productId: productData.productId });
        if (cachedProduct && cachedProduct.ai_summary) {
          console.log('✅ Cache Hit: Returning summary from MongoDB for', productData.productId);
          // Return the same structure as the service would
          return res.status(200).json({
            success: true,
            data: {
              product: {
                title: cachedProduct.title,
                productId: cachedProduct.productId,
                price: cachedProduct.price,
                brand: cachedProduct.brand
              },
              summary: cachedProduct.ai_summary
            }
          });
        } else {
          console.log('⚠️ Cache Miss: No cached summary found for', productData.productId);
        }
      } catch (dbError) {
        console.warn('⚠️ Cache check failed, proceeding to generate:', dbError.message);
      }
    }

    console.log('Generating summary for:', productData.title || productData.name);

    // Extract language parameter
    const lang = req.body.lang || 'en'; // Default to English
    console.log('🌐 Requested language:', lang);

    const result = await service.summarizeProduct(productData, lang);

    console.log('Summary generated successfully', result);

    // Save to MongoDB Cache
    if (productData.productId && result.data && result.data.summary) {
      try {
        // result.data.summary is an object with { productId, summary, generatedAt, wordCount }
        // We store the entire summary object in ai_summary field (schema type: Mixed)
        console.log('Saving summary to MongoDB for', productData.productId);
        console.log('Summary object type:', typeof result.data.summary);
        
        await Product.findOneAndUpdate(
          { productId: productData.productId },
          {
            $set: {
              ai_summary: result.data.summary, // Store the whole summary object
              title: productData.title,
              price: productData.price || 0, // Required field
              brand: productData.brand || ''
            }
          },
          { upsert: true, new: true }
        );
        console.log('Cache Update: Saved summary to MongoDB for', productData.productId);
      } catch (dbSaveError) {
        console.error('Failed to save cache to MongoDB:', dbSaveError.message);
      }
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Summarization controller error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate product summary',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

export { summarizeProduct };
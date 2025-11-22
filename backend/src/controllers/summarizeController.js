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

    console.log('📥 Request body:', JSON.stringify(req.body, null, 2));

    // Option 1: Get product by ID from our data
    if (req.body.productId) {
      // Check MongoDB Cache First
      try {
        const cachedProduct = await Product.findOne({ productId: req.body.productId });
        if (cachedProduct && cachedProduct.ai_summary) {
          console.log('✅ Cache Hit: Returning summary from MongoDB for', req.body.productId);
          // Return the same structure as the service would
          return res.status(200).json({ summary: cachedProduct.ai_summary });
        }
      } catch (dbError) {
        console.warn('⚠️ Cache check failed, proceeding to generate:', dbError.message);
      }

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

    // Extract language parameter
    const lang = req.body.lang || 'en'; // Default to English
    console.log('🌐 Requested language:', lang);

<<<<<<< HEAD
    // Generate summary
    const result = await service.summarizeProduct(productData, lang);

    console.log('Summary generated successfully', result);
=======
    // Save to MongoDB Cache
    if (productData.productId && result.summary) {
      try {
        // We use findOneAndUpdate with upsert to save the summary
        // Note: We are only saving the summary and minimal fields if it doesn't exist.
        // Ideally, we should sync the whole product, but for this feature, ensuring ai_summary is saved is key.
        await Product.findOneAndUpdate(
          { productId: productData.productId },
          {
            $set: {
              ai_summary: result.summary,
              title: productData.title,
              price: productData.price || 0 // Required field
              // Add other fields if necessary for the schema validation
            }
          },
          { upsert: true, new: true }
        );
        console.log('💾 Cache Update: Saved summary to MongoDB for', productData.productId);
      } catch (dbSaveError) {
        console.error('❌ Failed to save cache to MongoDB:', dbSaveError.message);
      }
    }

>>>>>>> 0247f3c (feat: implement AI summary caching in MongoDB)
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
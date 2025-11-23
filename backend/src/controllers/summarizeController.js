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
 * Streams the summary response in real-time using SSE
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

    // Extract language parameter
    const lang = req.body.lang || 'en';
    console.log('🌐 Requested language:', lang);

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

    // Helper function to send SSE events
    const sendSSE = (event, data) => {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // Check MongoDB Cache (works for all input formats if productId is available)
    if (productData.productId) {
      try {
        const cachedProduct = await Product.findOne({ productId: productData.productId });
        if (cachedProduct && cachedProduct.ai_summary) {
          console.log('✅ Cache Hit: Streaming cached summary for', productData.productId);
          
          // Stream the cached summary token by token to simulate real-time effect
          const cachedSummary = cachedProduct.ai_summary;
          console.log('📦 Cached summary type:', typeof cachedSummary);
          console.log('📦 Has summary field:', !!cachedSummary.summary);
          
          // Extract the actual summary text
          let summaryText;
          if (typeof cachedSummary === 'string') {
            summaryText = cachedSummary;
          } else if (cachedSummary.summary) {
            summaryText = typeof cachedSummary.summary === 'string' 
              ? cachedSummary.summary 
              : JSON.stringify(cachedSummary.summary);
          } else {
            summaryText = JSON.stringify(cachedSummary);
          }
          
          // Clean the summary text - extract only the first complete JSON object
          if (summaryText.trim().startsWith('{')) {
            let depth = 0;
            let jsonEnd = -1;
            for (let i = 0; i < summaryText.length; i++) {
              if (summaryText[i] === '{') depth++;
              if (summaryText[i] === '}') {
                depth--;
                if (depth === 0) {
                  jsonEnd = i + 1;
                  break;
                }
              }
            }
            if (jsonEnd > 0 && jsonEnd < summaryText.length) {
              console.log('⚠️ Detected extra content after JSON, trimming from', summaryText.length, 'to', jsonEnd);
              summaryText = summaryText.substring(0, jsonEnd);
            }
          }
          
          console.log('📦 Summary text length:', summaryText.length);

          // Send metadata first
          sendSSE('metadata', {
            cached: true,
            productId: productData.productId,
            product: {
              title: cachedProduct.title,
              productId: cachedProduct.productId,
              price: cachedProduct.price,
              brand: cachedProduct.brand
            }
          });

          // Stream the cached content character by character (or in chunks)
          const chunkSize = 20; // Characters per chunk - increased for faster streaming
          for (let i = 0; i < summaryText.length; i += chunkSize) {
            const chunk = summaryText.slice(i, i + chunkSize);
            sendSSE('token', { content: chunk });
            
            // Small delay to simulate streaming effect (10ms for smoother, faster streaming)
            await new Promise(resolve => setTimeout(resolve, 10));
          }

          // Send completion event
          sendSSE('complete', {
            success: true,
            data: {
              product: {
                title: cachedProduct.title,
                productId: cachedProduct.productId,
                price: cachedProduct.price,
                brand: cachedProduct.brand
              },
              summary: {
                productId: cachedProduct.productId,
                summary: summaryText,
                generatedAt: cachedSummary.generatedAt,
                wordCount: summaryText.split(' ').length
              }
            }
          });

          console.log('✅ Cached streaming complete');
          return res.end();
        } else {
          console.log('⚠️ Cache Miss: No cached summary found for', productData.productId);
        }
      } catch (dbError) {
        console.warn('⚠️ Cache check failed, proceeding to generate:', dbError.message);
      }
    }

    console.log('Generating summary for:', productData.title || productData.name);

    // Send metadata for new generation
    sendSSE('metadata', {
      cached: false,
      productId: productData.productId,
      generating: true
    });

    // Stream new summary from CLOVA API
    let finalResult = null;

    await service.summarizeProductStream(
      productData,
      lang,
      // onToken callback
      (token) => {
        sendSSE('token', { content: token });
      },
      // onComplete callback
      async (result) => {
        console.log('Summary generated successfully');
        finalResult = result;

        // Save to MongoDB Cache
        if (productData.productId && result.data && result.data.summary) {
          try {
            console.log('💾 Saving summary to MongoDB for', productData.productId);
            
            await Product.findOneAndUpdate(
              { productId: productData.productId },
              {
                $set: {
                  ai_summary: result.data.summary,
                  title: productData.title,
                  price: productData.price || 0,
                  brand: productData.brand || ''
                }
              },
              { upsert: true, new: true }
            );
            console.log('✅ Cache Update: Saved summary to MongoDB for', productData.productId);
          } catch (dbSaveError) {
            console.error('❌ Failed to save cache to MongoDB:', dbSaveError.message);
          }
        }

        // Send completion event
        sendSSE('complete', result);
        res.end();
      },
      // onError callback
      (error) => {
        console.error('❌ Streaming error:', error);
        sendSSE('error', {
          success: false,
          error: 'Failed to generate product summary',
          message: error.message
        });
        res.end();
      }
    );

  } catch (error) {
    console.error('❌ Summarization controller error:', error);
    
    // If headers not sent yet, send error as JSON
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate product summary',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    } else {
      // If streaming already started, send error event
      res.write(`event: error\n`);
      res.write(`data: ${JSON.stringify({
        success: false,
        error: error.message
      })}\n\n`);
      res.end();
    }
  }
}

export { summarizeProduct };
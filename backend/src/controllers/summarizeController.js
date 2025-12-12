'use strict';
import SummarizeService from '../services/summarizeService.js';
import { loadDetailsProducts } from '../services/productService.js';
import Product from '../models/productModel.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

function normalizeLang(rawLang) {
  const value = String(rawLang || '').toLowerCase();
  if (value === 'ko' || value.startsWith('ko')) return 'ko';
  return 'en';
}

function buildShowcaseUiSummary(mockJson, lang = 'en') {
  const overall = Number(mockJson?.ratings?.overall);
  const totalReviews = Number(mockJson?.ratings?.totalReviews);

  const safeOverall = Number.isFinite(overall) ? overall : 4.5;
  const safeTotalReviews = Number.isFinite(totalReviews) ? totalReviews : 0;

  const satisfactionArray = Array.isArray(mockJson?.satisfaction) ? mockJson.satisfaction : [];

  const toWordObjects = (arr) => {
    if (!Array.isArray(arr)) return [];
    // Provide stable, deterministic fake counts so the UI can render.
    return arr.map((word, i) => ({
      word: String(word),
      count: Math.max(1, (arr.length - i) * 3)
    }));
  };

  const keywords = mockJson?.keywords || {};

  return {
    overview: mockJson?.overview || '',
    ratings: {
      score: `${safeOverall.toFixed(1)}/5.0`,
      count: lang === 'ko'
        ? `${safeTotalReviews.toLocaleString()}명의 고객`
        : `${safeTotalReviews.toLocaleString()} customers`,
      sentiment: lang === 'ko'
        ? '전반적으로 긍정적이며 디자인/품질 관련 만족도가 높습니다.'
        : 'Mostly positive, with strong praise for design and overall build quality.',
      coverage: lang === 'ko'
        ? '디자인, 품질, 배수/받침, 포장 상태'
        : 'Design, quality, drainage/saucer, packaging condition.'
    },
    satisfaction: {
      aspects: satisfactionArray.map((a) => ({
        name: a?.aspect || '',
        score: Number.isFinite(Number(a?.score)) ? Number(a.score) : 0,
        feedback: a?.summary || ''
      }))
    },
    keywords: {
      positive: toWordObjects(keywords.positive),
      concerns: toWordObjects(keywords.concerns),
      notable: toWordObjects(keywords.notable)
    },
    strengths: Array.isArray(mockJson?.strengths) ? mockJson.strengths : [],
    considerations: Array.isArray(mockJson?.considerations) ? mockJson.considerations : [],
    bestFor: mockJson?.bestFor || '',
    productInfo: {
      // Map the mock's productInfo into the fields the current UI renders.
      brand: mockJson?.productInfo?.material || '',
      category: mockJson?.productInfo?.dimensions || '',
      options: mockJson?.productInfo?.features || ''
    }
  };
}

/**
 * POST /api/summarize
 * Body: { productId: string } or { productData: object }
 * Streams the summary response in real-time using SSE
 */
async function summarizeProduct(req, res) {
  try {
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

    const showcaseMode = String(process.env.SHOWCASE_MODE || '').toLowerCase() === 'true';
    if (showcaseMode) {
      // --- SHOWCASE MODE LOGIC ---
      const normalizedLang = normalizeLang(lang);
      
      // Determine which mock summary to load based on product ID
      const productId = productData?.productId || '';
      let mockFileName = `mockSummary.${normalizedLang}.json`; // default (plant pot)
      
      if (productId.includes('earbuds')) {
        mockFileName = `mockSummary.earbuds.${normalizedLang}.json`;
      } else if (productId.includes('blanket')) {
        mockFileName = `mockSummary.blanket.${normalizedLang}.json`;
      }
      
      const mockFilePath = path.resolve(__dirname, '../ai/mocks', mockFileName);

      try {
        const mockDataString = await fs.readFile(mockFilePath, 'utf-8');
        const mockDataJson = JSON.parse(mockDataString);

        // The frontend currently expects the streamed text to be a JSON string matching its
        // `SummaryData` shape. The mock files are stored in a simpler, demo-friendly format,
        // so we adapt them here while still sourcing everything from the mock JSON file.
        const uiJson = buildShowcaseUiSummary(mockDataJson, normalizedLang);
        const fullResponseString = JSON.stringify(uiJson);

        sendSSE('metadata', {
          cached: true,
          status: 'cached',
          showcase: true,
          lang: normalizedLang,
          productId: productData?.productId
        });

        const chunkSize = 25;
        for (let i = 0; i < fullResponseString.length; i += chunkSize) {
          const chunk = fullResponseString.slice(i, i + chunkSize);
          sendSSE('token', { content: chunk });
          await new Promise((resolve) => setTimeout(resolve, 25));
        }

        sendSSE('complete', {
          success: true,
          // Per spec: include the raw mock JSON payload we loaded from disk.
          final_response: mockDataJson,
          // Extra: also include the UI-adapted payload the frontend actually renders.
          final_ui_response: uiJson,
          data: {
            product: {
              title: productData?.title || productData?.name || 'Showcase Product',
              productId: productData?.productId || 'showcase',
              price: productData?.price || 0,
              brand: productData?.brand || ''
            },
            summary: {
              productId: productData?.productId || 'showcase',
              summary: fullResponseString,
              generatedAt: new Date().toISOString(),
              wordCount: fullResponseString.split(/\s+/).filter(Boolean).length
            }
          }
        });

        return res.end();
      } catch (error) {
        console.error('Error in showcase mode:', error);
        sendSSE('error', {
          success: false,
          message: 'Failed to load mock summary.'
        });
        return res.end();
      }
    } else {
      // --- ORIGINAL LIVE API LOGIC ---
      // Keep all the original code that calls the HyperCLOVA API here.
      // Do NOT delete it.

      const service = initializeService();

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
    }

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
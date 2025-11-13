/**
 * Naver Lens - Simple Express.js API Server
 *
 * Endpoints:
 *  - GET  /api/products         → List product summaries (id, name, imageUrl)
 *  - GET  /api/products/:id     → Get full product details by id
 *  - POST /api/summarize        → Mock AI summarization (placeholder)
 *
 * Data Sources:
 *  - backend/data/products-search.json (object with `items` array)
 *  - backend/data/products-details.json (array of product objects)
 *
 * How to run:
 *  - PORT=3001 node backend/server.js
 *  - Or just: node backend/server.js (defaults to 3001)
 */

'use strict';

const express = require('express');
const cors = require('cors');
const productRoutes = require('./src/routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/api/products', productRoutes);

/**
 * Placeholder that simulates an AI call (e.g., HyperCLOVA X).
 * Waits 1s, then returns a hardcoded result.
 * Do NOT call external services here.
 */
async function getAiSummary({ description, reviews }) {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return mock summary as specified
  return {
    summary:
      'This is a mock AI summary. The product has a modern, oversized fit and is made of a soft, breathable cotton blend.',
    pros: ['High-quality material', 'Color matches the photos', 'Fast shipping'],
    cons: ['Runs slightly large, consider sizing down', 'Prone to wrinkling']
  };
}

// Product routes are mounted at /api/products

/**
 * Endpoint 3: AI Summarization (Placeholder)
 * - Expects: { description: string, reviews: string[] }
 * - Returns: result from getAiSummary()
 */
app.post('/api/summarize', async (req, res) => {
  try {
    const { description, reviews } = req.body || {};

    // Basic validation for expected payload shape
    const reviewsAreStringsArray =
      Array.isArray(reviews) && reviews.every((r) => typeof r === 'string');

    if (typeof description !== 'string' || !reviewsAreStringsArray) {
      return res.status(400).json({
        error: 'Invalid payload: expected { description: string, reviews: string[] }'
      });
    }

    const result = await getAiSummary({ description, reviews });
    res.json(result);
  } catch (err) {
    console.error('Error in summarize:', err);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// Optional health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Naver Lens API server listening on port ${PORT}`);
});



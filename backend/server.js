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
 *  - npm run dev (with auto-reload)
 *  - npm start (production)
 */

'use strict';

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import productRoutes from './src/routes/productRoutes.js';
import summarizeRoutes from './src/routes/summarizeRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/summarize', summarizeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Naver Lens API server listening on port ${PORT}`);
});



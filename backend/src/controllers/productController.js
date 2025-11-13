'use strict';

import {
  loadSearchItems,
  loadDetailsProducts,
  stripHtml
} from '../services/productService.js';

/**
 * GET /api/products
 * Returns lightweight product summaries: { id, name, imageUrl }[]
 */
async function getAllProducts(req, res) {
  try {
    const items = await loadSearchItems();
    const summaries = items.map((product) => ({
      id: product.productId,
      name: stripHtml(product.title),
      imageUrl: product.image
    }));
    res.json(summaries);
  } catch (err) {
    console.error('Error reading products:', err);
    res.status(500).json({ error: 'Failed to read products' });
  }
}

/**
 * GET /api/products/:id
 * Returns the full product object if found; 404 otherwise
 */
async function getProductById(req, res) {
  try {
    const products = await loadDetailsProducts();
    const product = products.find((p) => p.productId === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error reading product:', err);
    res.status(500).json({ error: 'Failed to read products' });
  }
}

export { getAllProducts, getProductById };



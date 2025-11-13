'use strict';

const path = require('path');
const fs = require('fs/promises');

// Resolve data file paths relative to this service file
const PRODUCTS_SEARCH_FILE_PATH = path.join(__dirname, '..', '..', 'data', 'products-search.json');
const PRODUCTS_DETAILS_FILE_PATH = path.join(__dirname, '..', '..', 'data', 'products-details.json');

/**
 * Reads and parses the products-search JSON file.
 * Expected shape: { items: Array<...> }
 * Returns: Promise<Array<ProductSearchItem>>
 */
async function loadSearchItems() {
  const fileContents = await fs.readFile(PRODUCTS_SEARCH_FILE_PATH, 'utf-8');
  const parsed = JSON.parse(fileContents);
  const items = parsed && Array.isArray(parsed.items) ? parsed.items : null;
  if (!items) {
    throw new Error('products-search.json must contain an object with array property `items`');
  }
  return items;
}

/**
 * Reads and parses the products-details JSON file.
 * Expected shape: Array<ProductDetails>
 * Returns: Promise<Array<ProductDetails>>
 */
async function loadDetailsProducts() {
  const fileContents = await fs.readFile(PRODUCTS_DETAILS_FILE_PATH, 'utf-8');
  const products = JSON.parse(fileContents);
  if (!Array.isArray(products)) {
    throw new Error('products-details.json must contain an array');
  }
  return products;
}

/**
 * Removes all HTML tags from a given string.
 * Basic sanitizer for product titles coming from search results.
 */
function stripHtml(input) {
  if (typeof input !== 'string') return '';
  return input.replace(/<[^>]*>/g, '');
}

module.exports = {
  loadSearchItems,
  loadDetailsProducts,
  stripHtml
};



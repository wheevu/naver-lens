import path from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve data file paths relative to this service file
const PRODUCTS_SEARCH_FILE_PATH = path.join(__dirname, '..', '..', 'data', 'products-search.json');
const PRODUCTS_DETAILS_FILE_PATH = path.join(__dirname, '..', '..', 'data', 'products-details.json');

/**
 * Reads and parses the products-search JSON file.
 * Expected shape: { items: Array<...> }
 * Returns: Promise<Array<ProductSearchItem>>
 */
async function loadSearchItems() {
  const raw = await readFile(PRODUCTS_SEARCH_FILE_PATH, 'utf-8');
  const parsed = JSON.parse(raw);
  return parsed.items || [];
}

/**
 * Reads and parses the products-details JSON file.
 * Expected shape: Array<ProductDetails>
 * Returns: Promise<Array<ProductDetails>>
 */
async function loadDetailsProducts() {
  const raw = await readFile(PRODUCTS_DETAILS_FILE_PATH, 'utf-8');
  return JSON.parse(raw);
}

/**
 * Removes all HTML tags from a given string.
 * Basic sanitizer for product titles coming from search results.
 */
function stripHtml(input) {
  if (typeof input !== 'string') return '';
  return input.replace(/<[^>]*>/g, '');
}

export { loadSearchItems, loadDetailsProducts, stripHtml };
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve data file paths relative to this service file
const PRODUCTS_DETAILS_FILE_PATH = path.join(__dirname, '..', '..', 'data', 'products-details.json');

/**
 * Reads and parses the products-details JSON file.
 * Expected shape: Array<ProductDetails>
 * Returns: Promise<Array<ProductDetails>>
 */
async function loadDetailsProducts() {
  const raw = await readFile(PRODUCTS_DETAILS_FILE_PATH, 'utf-8');
  return JSON.parse(raw);
}

export { loadDetailsProducts };
import { loadDetailsProducts } from './productService.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let productsCache = [];
let cacheInitialized = false;
let initializingPromise = null;
let mockProductsCache = null;

// Mock product file mappings
const MOCK_PRODUCT_FILES = [
  'mockProduct.json',           // Plant pot ceramic (default)
  'mockProduct.earbuds.json',   // Wireless earbuds
  'mockProduct.blanket.json',   // Throw blanket
];

// Helper to check showcase mode
function isShowcaseMode() {
  return String(process.env.SHOWCASE_MODE || '').toLowerCase() === 'true';
}

// Load all mock products for showcase mode
async function loadMockProducts() {
  if (mockProductsCache) return mockProductsCache;
  try {
    const products = [];
    for (const filename of MOCK_PRODUCT_FILES) {
      const mockFilePath = path.resolve(__dirname, '../ai/mocks', filename);
      try {
        const data = await fs.readFile(mockFilePath, 'utf-8');
        products.push(JSON.parse(data));
      } catch (err) {
        console.warn(`Failed to load mock product ${filename}:`, err.message);
      }
    }
    mockProductsCache = products;
    return mockProductsCache;
  } catch (error) {
    console.error('Failed to load mock products:', error);
    return [];
  }
}

// Get a specific mock product by ID
async function getMockProductById(productId) {
  const products = await loadMockProducts();
  return products.find(p => p.productId === productId) || products[0];
}

async function initializeCache() {
  if (cacheInitialized) {
    return;
  }

  if (initializingPromise) {
    return initializingPromise;
  }

  initializingPromise = loadDetailsProducts()
    .then((result) => { // Renamed to 'result' for clarity
      // --- MINIMAL CHANGE HERE ---
      // Extract the 'data' array from the resolved result object.
      const productData = result?.data || [];
      
      productsCache = Array.isArray(productData) ? productData : []; 
      cacheInitialized = true;
      console.log(`Product cache initialized with ${productsCache.length} products`);
    })
    .catch((error) => {
      cacheInitialized = false;
      console.error('Failed to initialize product cache:', error);
      throw error;
    })
    .finally(() => {
      initializingPromise = null;
    });

  return initializingPromise;
}

function ensureCacheReady() {
  // In showcase mode, we don't need the real cache
  if (isShowcaseMode()) {
    return;
  }
  if (!cacheInitialized) {
    throw new Error('Product cache not initialized. Call initializeCache() first.');
  }
}

function getAllProducts() {
  // In showcase mode, return all mock products
  if (isShowcaseMode()) {
    if (mockProductsCache && mockProductsCache.length > 0) {
      return [...mockProductsCache];
    }
    // Sync fallback - caller should use getAllProductsAsync for showcase mode
    return [];
  }
  ensureCacheReady();
  return [...productsCache];
}

// Async version for showcase mode support
async function getAllProductsAsync() {
  if (isShowcaseMode()) {
    const mockProducts = await loadMockProducts();
    return mockProducts || [];
  }
  ensureCacheReady();
  return [...productsCache];
}

function getProductById(productId) {
  if (productId === undefined || productId === null) {
    return undefined;
  }

  const normalizedId = String(productId);

  // In showcase mode, find matching mock product or return first one
  if (isShowcaseMode()) {
    if (mockProductsCache && mockProductsCache.length > 0) {
      const found = mockProductsCache.find(p => String(p.productId) === normalizedId);
      return found || mockProductsCache[0];
    }
    return undefined;
  }

  ensureCacheReady();
  return productsCache.find((product) => String(product.productId) === normalizedId);
}

// Async version for showcase mode support
async function getProductByIdAsync(productId) {
  if (productId === undefined || productId === null) {
    return undefined;
  }

  const normalizedId = String(productId);

  if (isShowcaseMode()) {
    const mockProducts = await loadMockProducts();
    if (mockProducts && mockProducts.length > 0) {
      // Find exact match or return the first mock product
      const found = mockProducts.find(p => String(p.productId) === normalizedId);
      return found || mockProducts[0];
    }
    return undefined;
  }

  ensureCacheReady();
  return productsCache.find((product) => String(product.productId) === normalizedId);
}

async function reloadCache() {
  if (isShowcaseMode()) {
    console.log('🎭 Showcase mode: reloading mock products');
    mockProductsCache = null;
    await loadMockProducts();
    return;
  }
  const newProducts = await loadDetailsProducts();
  productsCache = Array.isArray(newProducts) ? newProducts : [];
  cacheInitialized = true;
  console.log(`Product cache reloaded with ${productsCache.length} products`);
}

// Pre-load mock products on module load if in showcase mode
if (isShowcaseMode()) {
  loadMockProducts().then((products) => {
    console.log(`🎭 ${products.length} mock products pre-loaded for showcase mode`);
  }).catch(err => {
    console.error('Failed to pre-load mock products:', err);
  });
}

export {
  initializeCache,
  getAllProducts,
  getAllProductsAsync,
  getProductById,
  getProductByIdAsync,
  reloadCache
};


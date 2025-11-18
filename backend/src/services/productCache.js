import { loadDetailsProducts } from './productService.js';

let productsCache = [];
let cacheInitialized = false;
let initializingPromise = null;

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
  if (!cacheInitialized) {
    throw new Error('Product cache not initialized. Call initializeCache() first.');
  }
}

function getAllProducts() {
  ensureCacheReady();
  return productsCache;
}

function getProductById(productId) {
  ensureCacheReady();
  if (productId === undefined || productId === null) {
    return undefined;
  }

  const normalizedId = String(productId);
  return productsCache.find((product) => String(product.productId) === normalizedId);
}

async function reloadCache() {
  cacheInitialized = false;
  productsCache = [];
  return initializeCache();
}

export {
  initializeCache,
  getAllProducts,
  getProductById,
  reloadCache
};


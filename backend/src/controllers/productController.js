'use strict';

import {
  getAllProducts as getCachedProducts,
  getProductById as getCachedProductById
} from '../services/productCache.js';

function transformProduct(product) {
  return {
    id: product.productId,
    name: product.title,
    imageUrl: product.images?.[0] || product.image || '',
    price: product.price,
    originalPrice: product.originalPrice,
    brand: product.brand,
    mallName: product.mallName,
    mallColor: product.mallColor,
    rating: product.rating,
    reviewCount: product.reviewCount,
    categories: {
      category1: product.category1,
      category2: product.category2,
      category3: product.category3,
      category4: product.category4
    },
    descriptionPreview: product.description?.substring(0, 100) || ''
  };
}

function parseNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function applyFilters(products, filters) {
  const {
    category1,
    category2,
    category3,
    category4,
    searchCategory,
    brand,
    mallName,
    minPrice,
    maxPrice,
    minRating
  } = filters;

  return products.filter((product) => {
    if (category1 && product.category1 !== category1) return false;
    if (category2 && product.category2 !== category2) return false;
    if (category3 && product.category3 !== category3) return false;
    if (category4 && product.category4 !== category4) return false;

    if (searchCategory) {
      const cat = searchCategory.toLowerCase();
      const matches =
        (product.category1 && product.category1.toLowerCase().includes(cat)) ||
        (product.category2 && product.category2.toLowerCase().includes(cat)) ||
        (product.category3 && product.category3.toLowerCase().includes(cat)) ||
        (product.category4 && product.category4.toLowerCase().includes(cat));
      if (!matches) return false;
    }

    if (brand) {
      const productBrand = product.brand?.toLowerCase() || '';
      if (!productBrand.includes(brand.toLowerCase())) {
        return false;
      }
    }

    if (mallName) {
      const productMall = product.mallName?.toLowerCase() || '';
      if (!productMall.includes(mallName.toLowerCase())) {
        return false;
      }
    }

    if (typeof minPrice === 'number') {
      const price = Number(product.price);
      if (!Number.isFinite(price) || price < minPrice) {
        return false;
      }
    }

    if (typeof maxPrice === 'number') {
      const price = Number(product.price);
      if (!Number.isFinite(price) || price > maxPrice) {
        return false;
      }
    }

    if (typeof minRating === 'number') {
      const rating = Number(product.rating);
      if (!Number.isFinite(rating) || rating < minRating) {
        return false;
      }
    }

    return true;
  });
}

function paginate(products, page, limit) {
  const total = products.length;
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = startIndex < total ? products.slice(startIndex, endIndex) : [];

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: totalPages > 0 && page < totalPages,
      hasPrev: totalPages > 0 && page > 1
    }
  };
}

function parsePaginationParams(query) {
  const DEFAULT_LIMIT = 20;
  const MAX_LIMIT = 100;

  const rawPage = Number.parseInt(query.page, 10);
  const rawLimit = Number.parseInt(query.limit, 10);

  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, MAX_LIMIT) : DEFAULT_LIMIT;

  return { page, limit };
}

function getAllProducts(req, res) {
  try {
    const products = getCachedProducts();
    const { page, limit } = parsePaginationParams(req.query);

    const filters = {
      category1: req.query.category1,
      category2: req.query.category2,
      category3: req.query.category3,
      category4: req.query.category4,
      searchCategory: req.query.searchCategory,
      brand: req.query.brand,
      mallName: req.query.mallName,
      minPrice: parseNumber(req.query.minPrice),
      maxPrice: parseNumber(req.query.maxPrice),
      minRating: parseNumber(req.query.minRating)
    };

    // Optimize: Filter -> Paginate -> Map
    // This avoids transforming the entire dataset when we only need one page
    const filtered = applyFilters(products, filters);
    const paginatedResult = paginate(filtered, page, limit);

    // Transform only the data for the current page
    paginatedResult.data = paginatedResult.data.map(transformProduct);

    res.json(paginatedResult);
  } catch (err) {
    console.error('Error getting products:', err);
    res.status(500).json({ error: 'Failed to get products' });
  }
}

function getProductById(req, res) {
  try {
    const product = getCachedProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error('Error getting product:', err);
    res.status(500).json({ error: 'Failed to get product' });
  }
}

export { getAllProducts, getProductById };



// src/services/productService.js

import Product from '../models/productModel.js'; 

/**
 * Fetches products from the database and formats the result 
 * to match the expected API response structure (data: [...], pagination: {...}).
 * * NOTE: This function is now creating the full API response object, 
 * which should ideally be done in the controller/route handler.
 * * Returns: Promise<{ data: Array<ProductDetails>, pagination: object }>
 */
async function loadDetailsProducts() {
    try {
        // 1. Fetch all products
        const products = await Product.find({}); 
        console.log(`[SERVICE LOG] Products fetched from DB: ${products.length}`);
        
        // 2. Calculate simple pagination data
        const total = products.length;
        const limit = 20; // Assuming default limit used by frontend/controller
        const totalPages = Math.ceil(total / limit);

        // 3. Return the data WRAPPED in the expected API response object
        return {
            data: products,
            pagination: {
                page: 1,
                limit: limit,
                total: total,
                totalPages: totalPages,
                hasNext: false, // Simple implementation
                hasPrev: false, // Simple implementation
            }
        };

    } catch (error) {
        console.error('Error fetching products from MongoDB:', error);
        
        // Return a response object with an empty data array on failure, 
        // preventing the server from crashing and matching the expected API shape.
        throw {
             error: 'Could not retrieve products from database.',
             data: [],
             pagination: { total: 0, totalPages: 0 }
        };
    }
}

export { loadDetailsProducts };
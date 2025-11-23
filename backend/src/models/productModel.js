// src/models/productModel.js

import mongoose from 'mongoose';

// Define the schema for the 'options' array items
const optionValueSchema = mongoose.Schema({
    name: { type: String, required: true },
    values: [{ type: String }], // Array of strings for sizes/colors
}, { _id: false }); // We don't need Mongoose to create an _id for sub-documents

const productSchema = mongoose.Schema(
    {
        productId: {
            type: String,
            required: true,
            unique: true
        },
        title: {
            type: String,
            required: true
        },
        brand: {
            type: String
        },
        maker: {
            type: String
        },
        images: {
            type: [String] // Array of image URLs
        },
        price: {
            type: Number,
            required: true
        },
        originalPrice: {
            type: Number
        },
        mallName: {
            type: String
        },
        mallColor: {
            type: String
        },
        shipping: {
            type: String
        },
        rating: {
            type: Number
        },
        reviewCount: {
            type: Number
        },
        options: {
            type: [optionValueSchema] // Use the sub-schema defined above
        },
        description: {
            type: String
        },
        reviews: {
            type: [String] // Array of review texts
        },
        category1: {
            type: String
        },
        category2: {
            type: String
        },
        category3: {
            type: String
        },
        category4: {
            type: String
        },
        ai_summary: {
            type: mongoose.Schema.Types.Mixed // Can store string or object
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
        collection: 'products'
    }
);


const Product = mongoose.model('Product', productSchema);

export default Product;
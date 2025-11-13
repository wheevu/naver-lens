// summarization controller - api summaryzation routes
'use strict';

import express from 'express';
import { summarizeProduct } from '../controllers/summarizeController.js';

const router = express.Router();

// POST /api/summarize
router.post('/', summarizeProduct);

export default router;
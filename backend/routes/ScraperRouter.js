import express from 'express';
import { fetchProductDetails } from '../controllers/ScraperController.js';
import { authMiddleware } from '../middleware/AuthValidation.js';
import createRateLimiter from '../middleware/rateLimiter.js';

const router = express.Router();

// Rate limit: 10 requests per minute per user
const scraperRateLimiter = createRateLimiter({ maxRequests: 10, windowMs: 60000 });

// POST /scraper/fetch-product
router.post('/fetch-product', authMiddleware, scraperRateLimiter, fetchProductDetails);

export default router;

import express from 'express';
import { createBid, getBidsByWish, acceptBid, getUserBids } from '../controllers/BidController.js';
import authMiddleware from '../middleware/AuthValidation.js';

const router = express.Router();

router.post('/:wishId', authMiddleware, createBid); // Create a new bid
router.get('/:wishId', authMiddleware, getBidsByWish); // Get all bids for a wish
router.patch('/:bidId/accept', authMiddleware, acceptBid); // Accept a specific bid
router.get('/user', authMiddleware, getUserBids); // Get user's own bids

export default router;
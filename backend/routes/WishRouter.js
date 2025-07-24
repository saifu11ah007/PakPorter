import express from 'express';
import { 
  createWish, 
  getWishes, 
  getWishById, 
  updateWish, 
  deleteWish,
  getMyWishes
} from '../controllers/WishController.js';
import authMiddleware from '../middleware/AuthValidation.js'; 
import { wishMiddleware } from '../middleware/WishValidation.js';

const router = express.Router();

// Routes
router.post('/', authMiddleware, createWish); // Create a new wish (authMiddlewareed)
router.get('/', getWishes); // Get all wishes
router.get('/:id', getWishById); // Get a single wish by ID
router.put('/:id', authMiddleware, updateWish); // Update a wish (authMiddlewareed)
router.delete('/:id', authMiddleware, deleteWish); // Delete a wish (authMiddlewareed)
router.get('/my-wishes', (req, res, next) => {
  console.log('Routing: /my-wishes'); // Debug
  next();
}, authMiddleware, wishMiddleware, getMyWishes); // Get authenticated user's wishes
export default router;
import express from 'express';
import { 
  createWish, 
  getWishes, 
  getWishById, 
  updateWish, 
  deleteWish,
  getMyWishes 
} from '../controllers/WishController.js';
import authMiddleware from '../middleware/AuthValidation.js'; // Adjust path based on your project structure
import { default as upload, saveProductImagesToBlob } from '../middleware/uploadProductImage.js';

const router = express.Router();

// Routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// POST /wish - Create a new product wish
router.post('/', authenticateToken,createWish, upload, saveProductImagesToBlob);
router.get('/', getWishes); // Get all wishes
router.get('/:id', getWishById); // Get a single wish by ID
router.put('/:id', authMiddleware, updateWish); // Update a wish (authMiddlewareed)
router.delete('/:id', authMiddleware, deleteWish); // Delete a wish (authMiddlewareed)
router.get('/wishes/my-wishes', authMiddleware, getMyWishes);
export default router;
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
router.post('/wish', authenticateToken, upload, saveProductImagesToBlob, async (req, res) => {
  try {
    const { title, description, basePrice, deliveryDeadline, productLink } = req.body;
    const location = JSON.parse(req.body['location'] || '{}'); // Parse location from FormData
    const imageUrls = req.body.imageUrls || []; // Get image URLs from middleware

    // Validate required fields
    if (!title || !description || !basePrice || !deliveryDeadline || !location.city || !location.country) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Validate delivery deadline
    const deadlineDate = new Date(deliveryDeadline);
    const today = new Date();
    if (deadlineDate <= today) {
      return res.status(400).json({ message: 'Delivery deadline must be in the future' });
    }

    // Create new wish
    const wish = new Wish({
      title,
      description,
      basePrice: parseFloat(basePrice),
      deliveryDeadline: deadlineDate,
      productLink: productLink || undefined,
      location: {
        country: location.country,
        city: location.city
      },
      images: imageUrls,
      createdBy: req.user.id, // From JWT token
      isFulfilled: false,
      acceptedBid: null,
      createdAt: new Date()
    });

    await wish.save();
    res.status(201).json({ message: 'Wish posted successfully', wishId: wish._id });
  } catch (error) {
    console.error('Error saving wish:', error);
    res.status(500).json({ message: 'Failed to post wish', error: error.message });
  }
});
router.get('/', getWishes); // Get all wishes
router.get('/:id', getWishById); // Get a single wish by ID
router.put('/:id', authMiddleware, updateWish); // Update a wish (authMiddlewareed)
router.delete('/:id', authMiddleware, deleteWish); // Delete a wish (authMiddlewareed)
router.get('/wishes/my-wishes', authMiddleware, getMyWishes);
export default router;

import asyncHandler from 'express-async-handler';
import User from '../models/User.js'; // Adjust path if needed

// Middleware to validate user for wish-related routes
const wishMiddleware = asyncHandler(async (req, res, next) => {
  console.log('wishMiddleware: req.user:', req.user); // Debug
  if (!req.user || (!req.user.id && !req.user._id)) {
    res.status(401);
    throw new Error('Invalid token payload');
  }
  try {
    const userId = req.user.id || req.user._id; // Support both id and _id
    const user = await User.findById(userId).select('-password');
    console.log('wishMiddleware: Fetched user:', user); // Debug
    if (!user) {
      res.status(401);
      throw new Error('User not found');
    }
    req.user = user; // Set req.user to the full user object
    next();
  } catch (err) {
    console.error('wishMiddleware: Error fetching user:', err); // Debug
    res.status(401);
    throw new Error('User validation failed');
  }
});

export { wishMiddleware };

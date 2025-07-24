import asyncHandler from 'express-async-handler';
import User from '../models/User.js'; // Adjust path based on your project structure

// Middleware to validate user for wish-related routes
const wishMiddleware = asyncHandler(async (req, res, next) => {
  if (!req.user || !req.user.id) {
    res.status(401);
    throw new Error('Invalid token payload');
  }
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }
  req.user = user; // Set req.user to the full user object
  next();
});

export { wishMiddleware };

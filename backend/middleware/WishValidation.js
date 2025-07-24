import asyncHandler from 'express-async-handler';
import User  from '../models/User.js';
// Middleware to validate user for wish-related routes
const wishMiddleware = asyncHandler(async (req, res, next) => {
  console.log('wishMiddleware: req.user:', req.user); // Debug
  if (!req.user || !req.user.id) {
    res.status(401);
    throw new Error('Invalid token payload');
  }
  const user = await User.findById(req.user.id).select('-password');
  console.log('wishMiddleware: Fetched user:', user); // Debug
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }
  req.user = user; // Set req.user to the full user object
  next();
});

export { wishMiddleware };

// AdminController.js
import User from '../models/User.js'; // Use import instead of require
import Product from '../models/Product.js';
import Bid from '../models/BId.js';

const getAllUsers = async (req, res) => {
  try {
    // Fetch all users and exclude sensitive information like passwords
    const users = await User.find({}, '-password -__v').sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      message: 'Error fetching users', 
      error: error.message 
    });
  }
};
// AuthController.js
const getProfile = async (req, res) => {
  try {
    console.log('req.user:', req.user); // Debug
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Invalid user data in token' });
    }
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    console.error('Error in getProfile:', err.message); // Debug
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
};

const verifyUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    // Validate input
    if (typeof isVerified !== 'boolean') {
      return res.status(400).json({ 
        message: 'isVerified must be a boolean value' 
      });
    }

    // Find and update user
    const user = await User.findByIdAndUpdate(
      id, 
      { isVerified }, 
      { new: true, runValidators: true }
    ).select('-password -__v');

    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    res.status(200).json({
      message: `User ${isVerified ? 'verified' : 'unverified'} successfully`,
      user
    });
  } catch (error) {
    console.error('Error updating user verification:', error);

    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid user ID format' 
      });
    }

    res.status(500).json({ 
      message: 'Error updating user verification status', 
      error: error.message 
    });
  }
};

// @desc    Request to become a traveller (auto-approve for now, real verification later)
// @route   PUT /auth/become-traveller
// @access  Private
const becomeTraveller = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Invalid user data in token' });
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { isVerifiedTraveller: true },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'You are now a verified traveller!', user });
  } catch (err) {
    console.error('Error in becomeTraveller:', err.message);
    res.status(500).json({ message: 'Error updating traveller status', error: err.message });
  }
};

// @desc    Delete a user and cascade-delete all their products and bids
// @route   DELETE /auth/users/:id
// @access  Admin / Private
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 1. Find all products created by this user
    const userProducts = await Product.find({ createdBy: id });
    const productIds = userProducts.map(p => p._id);

    // 2. Delete all bids placed ON the user's products
    if (productIds.length > 0) {
      await Bid.deleteMany({ productId: { $in: productIds } });
    }

    // 3. Delete all the user's products
    await Product.deleteMany({ createdBy: id });

    // 4. Find all bids this user placed on OTHER products (before deleting them)
    const userBidIds = await Bid.find({ bidder: id }).distinct('_id');

    // 5. Clear acceptedBid references on products that accepted a bid from this user
    //    (these are other users' products where this user's bid was accepted)
    if (userBidIds.length > 0) {
      await Product.updateMany(
        { acceptedBid: { $in: userBidIds } },
        { $set: { acceptedBid: null, isFulfilled: false } }
      );
    }

    // 6. Delete all bids this user placed on OTHER products
    await Bid.deleteMany({ bidder: id });

    // 6. Finally delete the user
    await User.findByIdAndDelete(id);

    res.status(200).json({
      message: 'User and all associated data deleted successfully',
      deletedProducts: productIds.length
    });
  } catch (error) {
    console.error('Error deleting user:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    res.status(500).json({
      message: 'Error deleting user',
      error: error.message
    });
  }
};

export { getAllUsers, verifyUser, getProfile, becomeTraveller, deleteUser }; // Use ES Module export
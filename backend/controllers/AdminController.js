// AdminController.js
import User from '../models/User.js'; // Use import instead of require

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

export { getAllUsers, verifyUser }; // Use ES Module export
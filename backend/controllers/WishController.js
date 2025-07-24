import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a new wish
// @route   POST /wish
// @access  Private
const createWish = asyncHandler(async (req, res) => {
  const { title, description, basePrice, deliveryDeadline, productLink, images, location } = req.body;

  // Validate required fields
  if (!title || !description || !basePrice || !deliveryDeadline || !location?.country || !location?.city) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  // Create new wish
  const wish = await Product.create({
    title,
    description,
    basePrice,
    deliveryDeadline,
    productLink,
    images,
    location,
    createdBy: req.user._id, // Assumes req.user is set by protect middleware
  });

  res.status(201).json(wish);
});

// @desc    Get all wishes
// @route   GET /wish
// @access  Public
const getWishes = asyncHandler(async (req, res) => {
  const wishes = await Product.find({})
    .populate('createdBy', 'username') // Populate creator's username
    .sort({ createdAt: -1 }); // Sort by newest first
  res.json(wishes);
});

// @desc    Get a single wish by ID
// @route   GET /wish/:id
// @access  Public
const getWishById = asyncHandler(async (req, res) => {
  const wish = await Product.findById(req.params.id)
    .populate('createdBy', 'username')
    .populate('acceptedBid'); // Populate accepted bid if any

  if (!wish) {
    res.status(404);
    throw new Error('Wish not found');
  }

  res.json(wish);
});

// @desc    Update a wish
// @route   PUT /wish/:id
// @access  Private
const updateWish = asyncHandler(async (req, res) => {
  const wish = await Product.findById(req.params.id);

  if (!wish) {
    res.status(404);
    throw new Error('Wish not found');
  }

  // Check if user is the creator
  if (wish.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this wish');
  }

  // Update fields
  const { title, description, basePrice, deliveryDeadline, productLink, images, location } = req.body;
  wish.title = title || wish.title;
  wish.description = description || wish.description;
  wish.basePrice = basePrice || wish.basePrice;
  wish.deliveryDeadline = deliveryDeadline || wish.deliveryDeadline;
  wish.productLink = productLink || wish.productLink;
  wish.images = images || wish.images;
  wish.location = location || wish.location;

  const updatedWish = await wish.save();
  res.json(updatedWish);
});

// @desc    Delete a wish
// @route   DELETE /wish/:id
// @access  Private
const deleteWish = asyncHandler(async (req, res) => {
  const wish = await Product.findById(req.params.id);

  if (!wish) {
    res.status(404);
    throw new Error('Wish not found');
  }

  // Check if user is the creator
  if (wish.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this wish');
  }

  await Product.deleteOne({ _id: req.params.id });
  res.json({ message: 'Wish deleted successfully' });
});

export { createWish, getWishes, getWishById, updateWish, deleteWish };
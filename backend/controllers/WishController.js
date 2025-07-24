import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

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
    createdBy: req.user._id,
  });

  res.status(201).json(wish);
});

// @desc    Get all wishes
// @route   GET /wish
// @access  Public
const getWishes = asyncHandler(async (req, res) => {
  const wishes = await Product.find({})
    .populate('createdBy', 'username')
    .sort({ createdAt: -1 });
  res.json(wishes);
});

// @desc    Get a single wish by ID
// @route   GET /wish/:id
// @access  Public
const getWishById = asyncHandler(async (req, res) => {
  // Validate ObjectId
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid wish ID');
  }

  const wish = await Product.findById(req.params.id)
    .populate('createdBy', 'username');

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
  // Validate ObjectId
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid wish ID');
  }

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
  // Validate ObjectId
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400);
    throw new Error('Invalid wish ID');
  }

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

// @desc    Get all wishes for the authenticated user
// @route   GET /wish/my-wishes
// @access  Private
const getMyWishes = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error('User not authenticated');
  }

  const wishes = await Product.find({ createdBy: req.user._id })
    .populate('createdBy', 'username')
    .sort({ createdAt: -1 });

  res.json(wishes);
});

export { createWish, getWishes, getWishById, updateWish, deleteWish, getMyWishes };
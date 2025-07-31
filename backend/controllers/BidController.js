import asyncHandler from 'express-async-handler';
import Bid from '../models/BId.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

// @desc    Create a new bid for a wish
// @route   POST /bids/:wishId
// @access  Private
const createBid = asyncHandler(async (req, res) => {
  const { wishId } = req.params;
  const { offerPrice, message, deliveryDate } = req.body;
  const bidder = req.user._id;

  // Validate wish exists
  const wish = await Product.findById(wishId);
  if (!wish) {
    res.status(404);
    throw new Error('Wish not found');
  }

  // Check if bidder is the wish owner
  if (wish.createdBy.toString() === bidder.toString()) {
    res.status(403);
    throw new Error('Wish owner cannot place a bid on their own wish');
  }

  // Check for duplicate bid
  const existingBid = await Bid.findOne({ productId: wishId, bidder });
  if (existingBid) {
    res.status(400);
    throw new Error('You have already placed a bid on this wish');
  }

  // Validate required fields
  if (!offerPrice || !deliveryDate) {
    res.status(400);
    throw new Error('Please provide offer price and delivery date');
  }

  // Validate delivery date
  const deliveryDateObj = new Date(deliveryDate);
  if (isNaN(deliveryDateObj) || deliveryDateObj <= new Date()) {
    res.status(400);
    throw new Error('Delivery date must be a valid date in the future');
  }

  // Create new bid
  const bid = await Bid.create({
    productId: wishId,
    bidder,
    offerPrice: parseFloat(offerPrice),
    message: message || '',
    deliveryDate: deliveryDateObj,
    status: 'pending'
  });

  res.status(201).json({ message: 'Bid placed successfully', bid });
});

// @desc    Get all bids for a specific wish
// @route   GET /bids/:wishId
// @access  Private (wish owner only)
const getBidsByWish = asyncHandler(async (req, res) => {
  const { wishId } = req.params;
  const userId = req.user._id;

  // Verify wish exists and user is the owner
  const wish = await Product.findById(wishId);
  if (!wish) {
    res.status(404);
    throw new Error('Wish not found');
  }
  if (wish.createdBy.toString() !== userId.toString()) {
    res.status(403);
    throw new Error('Only wish owner can view bids');
  }

  const bids = await Bid.find({ productId: wishId })
    .populate('bidder', 'username email')
    .sort({ createdAt: -1 });

  res.json(bids);
});

// @desc    Accept a specific bid
// @route   PATCH /bids/:bidId/accept
// @access  Private (wish owner only)
const acceptBid = asyncHandler(async (req, res) => {
  const { bidId } = req.params;
  const userId = req.user._id;

  // Validate bid ID
  if (!mongoose.isValidObjectId(bidId)) {
    res.status(400);
    throw new Error('Invalid bid ID');
  }

  // Find the bid
  const bid = await Bid.findById(bidId).populate('productId');
  if (!bid) {
    res.status(404);
    throw new Error('Bid not found');
  }

  // Verify user is the wish owner
  if (bid.productId.createdBy.toString() !== userId.toString()) {
    res.status(403);
    throw new Error('Only wish owner can accept bids');
  }

  // Update this bid to accepted
  bid.status = 'accepted';
  await bid.save();

  // Update other bids for this wish to rejected
  await Bid.updateMany(
    { productId: bid.productId, _id: { $ne: bidId }, status: 'pending' },
    { status: 'rejected' }
  );

  // Update the wish to mark it as fulfilled and store accepted bid
  await Product.findByIdAndUpdate(bid.productId, {
    isFulfilled: true,
    acceptedBid: bid._id
  });

  res.json({ message: 'Bid accepted successfully', bid });
});

// @desc    Get all bids placed by the authenticated user
// @route   GET /bids/user
// @access  Private
const getUserBids = asyncHandler(async (req, res) => {
  const bids = await Bid.find({ bidder: req.user._id })
    .populate('productId', 'title description')
    .sort({ createdAt: -1 });

  res.json(bids);
});

export { createBid, getBidsByWish, acceptBid, getUserBids };
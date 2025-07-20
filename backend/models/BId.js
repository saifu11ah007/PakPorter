import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Refers to the wish/product being bid on
    required: true,
  },
  bidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // The traveler who placed the bid
    required: true,
  },
  offerPrice: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    default: '',
  },
  deliveryDate: {
    type: Date,
    required: true, // Expected delivery timeline
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Bid', bidSchema);

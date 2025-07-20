import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryDeadline: {
    type: Date,
    required: true
  },
  productLink: {
    type: String,
    required: false,
    validate: {
      validator: function (v) {
        return /^https?:\/\/[\w\.-]+(\.[\w\.-]+)+[\w\-\._~:/?#[\]@!$&'()*+,;=.]+$/.test(v);
      },
      message: 'Invalid product link URL'
    }
  },
  images: [{
    type: String // URLs or file paths for product reference images
  }],
  location: {
    country: { type: String, required: true },
    city: { type: String, required: true }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isFulfilled: {
    type: Boolean,
    default: false
  },
  acceptedBid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid', // Will link to the accepted bid (if any)
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product;

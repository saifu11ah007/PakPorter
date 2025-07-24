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
    trim: true,
    maxlength: 1000
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryDeadline: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        return v > new Date();
      },
      message: 'Delivery deadline must be in the future'
    }
  },
  productLink: {
    type: String,
    required: false,
    validate: {
      validator: function (v) {
        if (!v) return true;
        return /^https?:\/\/[\w\.-]+(\.[\w\.-]+)+[\w\-\._~:/?#[\]@!$&'()*+,;=.]+$/.test(v);
      },
      message: 'Invalid product link URL'
    }
  },
  images: [{
  type: String,
  validate: {
    validator: function (v) {
      if (!v) return true;
      // More permissive regex for blob storage URLs
      return /^https?:\/\/.+/.test(v);
    },
    message: 'Invalid image URL'
  }
}],
  location: {
    country: { type: String, required: true, trim: true, lowercase: true },
    city: { type: String, required: true, trim: true, lowercase: true }
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
    ref: 'Bid',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

productSchema.index({ createdBy: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
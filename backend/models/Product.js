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
        if (!v || v.trim() === '') return true;
        return /^https?:\/\/[\w\.-]+(\.[\w\.-]+)+[\w\-\._~:/?#[\]@!$&'()*+,;=.]+$/.test(v);
      },
      message: 'Invalid product link URL'
    }
  },
  images: [{
    type: String,
    validate: {
      validator: function (v) {
        // Allow empty array, but validate non-empty strings
        if (!v || v.trim() === '') return false;
        return /^https?:\/\/[\w\.-]+(\.[\w\.-]+)+[\w\-\._~:/?#[\]@!$&'()*+,;=.]+$/.test(v);
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

// Pre-save middleware to clean up images array
productSchema.pre('save', function(next) {
  if (this.images && this.images.length > 0) {
    // Filter out empty strings and invalid URLs
    this.images = this.images.filter(url => 
      url && typeof url === 'string' && url.trim() !== '' &&
      /^https?:\/\/[\w\.-]+(\.[\w\.-]+)+[\w\-\._~:/?#[\]@!$&'()*+,;=.]+$/.test(url)
    );
  } else {
    // Ensure images is an empty array if no valid images
    this.images = [];
  }
  next();
});

productSchema.index({ createdBy: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
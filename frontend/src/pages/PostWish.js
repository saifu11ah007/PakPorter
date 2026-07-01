// PostWish.js – Updated to submit wish to backend and include required fields
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Upload, Plus, Minus, Link as LinkIcon, Check, Loader2, Sparkles, ShoppingBag } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Helper component for animating matching travellers
const TravelerCounter = ({ value }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = value;
      const duration = 1200; // 1.2s
      const incrementTime = 30;
      const step = end / (duration / incrementTime);
      const timer = setInterval(() => {
        start += step;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, incrementTime);
      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return <span ref={ref}>{Math.round(count)}</span>;
};

const PostWish = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1 states
  const [photos, setPhotos] = useState([]); // preview URLs
  const [uploadedFiles, setUploadedFiles] = useState([]); // actual File objects
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Electronics 💻');
  const [desiredCountry, setDesiredCountry] = useState('UAE 🇦🇪');
  const [quantity, setQuantity] = useState(1);
  const [productUrl, setProductUrl] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [deliveryDeadline, setDeliveryDeadline] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);

  // Step 2 states (address selection)
  const [savedAddresses, setSavedAddresses] = useState([
    { id: 1, title: "Home Address", details: "House 45, Sector Y, DHA Phase 3, Lahore, Pakistan", isPrimary: true },
    { id: 2, title: "Office Address", details: "Floor 5, Software Technology Park, Ferozepur Road, Lahore, Pakistan", isPrimary: false }
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ title: '', details: '' });
  // Explicit location fields (required by backend)
  const [locationCountry, setLocationCountry] = useState('');
  const [locationCity, setLocationCity] = useState('');

  // Step 3 state
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock URL Scraper autofill
  const handleFetchDetails = () => {
    if (!productUrl) return;
    setIsFetchingUrl(true);
    setTimeout(() => {
      setIsFetchingUrl(false);
      setProductName('iPhone 15 Pro Max (256GB, Natural Titanium)');
      setDescription('Original unlocked Apple iPhone 15 Pro Max with standard Apple global warranty. Box must be sealed.');
      setCategory('Electronics 💻');
    }, 1500);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const remainingSlots = 5 - photos.length;
      const filesToUpload = files.slice(0, remainingSlots);
      const newPreviews = filesToUpload.map((file) => URL.createObjectURL(file));
      setPhotos((prev) => [...prev, ...newPreviews]);
      setUploadedFiles((prev) => [...prev, ...filesToUpload]);
    }
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== index));
    setUploadedFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAddNewAddress = (e) => {
    e.preventDefault();
    if (!newAddress.title || !newAddress.details) return;
    const newId = savedAddresses.length + 1;
    const added = { id: newId, title: newAddress.title, details: newAddress.details, isPrimary: false };
    setSavedAddresses((prev) => [...prev, added]);
    setSelectedAddressId(newId);
    setNewAddress({ title: '', details: '' });
    setShowNewAddressForm(false);
  };

  const handlePostWish = async () => {
    // Basic validation
    if (!productName.trim() || !basePrice || !deliveryDeadline || !locationCountry || !locationCity) {
      alert('Please fill all required fields');
      return;
    }
    const form = new FormData();
    form.append('title', productName);
    form.append('description', description);
    form.append('basePrice', parseFloat(basePrice));
    form.append('deliveryDeadline', deliveryDeadline);
    if (productUrl && /^https?:\/\/.+/.test(productUrl)) form.append('productLink', productUrl);
    form.append('location[country]', locationCountry);
    form.append('location[city]', locationCity);
    uploadedFiles.forEach((file) => form.append('images', file));

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to post a wish');
        setIsLoading(false);
        return;
      }
      const response = await fetch(`${process.env.REACT_APP_API_URL}/wish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: form,
        credentials: 'include'
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to post wish');
      }
      // success
      setShowSuccess(true);
    } catch (error) {
      console.error('Error posting wish:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock URL fetch button stays as before

  return (
    <div className="min-h-screen bg-background flex flex-col pt-20">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-6 bg-gradient-to-br from-brandPrimary/5 via-background to-brandAccent/5">
        <AnimatePresence mode="wait">
          {!showSuccess ? (
            <motion.div
              key="form"
              className="w-full max-w-[700px] neo-flat p-8 md:p-10 space-y-8"
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {/* Header */}
              <div className="text-center">
                <h1 className="text-3xl font-extrabold text-textPrimary tracking-tight">Post a Product Wish</h1>
                <p className="text-sm font-semibold text-textSecondary mt-1">Order any product globally, safely brought by travelers.</p>
              </div>

              {/* Progress Indicator */}
              <div className="max-w-[400px] mx-auto">
                <div className="flex justify-between items-center relative mb-4">
                  <div className="absolute top-1/2 left-0 w-full h-[3px] bg-cardBase -translate-y-1/2 z-0" />
                  <motion.div
                    className="absolute top-1/2 left-0 h-[3px] bg-brandPrimary -translate-y-1/2 z-0 origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: (step - 1) / 2 }}
                    transition={{ duration: 0.3 }}
                    style={{ width: '100%' }}
                  />
                  {[1, 2, 3].map((num) => {
                    const isActive = step === num;
                    const isCompleted = step > num;
                    return (
                      <div key={num} className="relative z-10">
                        <motion.div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                            isCompleted
                              ? 'bg-success text-white shadow-neo'
                              : isActive
                              ? 'bg-brandPrimary text-white shadow-neo'
                              : 'neo-pressed text-textSecondary'
                          }`}
                          animate={{ scale: isActive ? 1.15 : 1 }}
                        >
                          {isCompleted ? <Check className="w-4 h-4" /> : num}
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs font-bold text-textSecondary px-1">
                  <span>Details</span>
                  <span>Address</span>
                  <span>Review</span>
                </div>
              </div>

              {/* Step Content */}
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-6"
                  >
                    {/* Photo upload */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">
                        Product Photos (up to 5)
                      </label>
                      <div className="grid grid-cols-5 gap-3">
                        {photos.map((url, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl neo-flat overflow-hidden group">
                            <img src={url} alt="Upload preview" className="w-full h-full object-cover" />
                            <button
                              onClick={() => removePhoto(idx)}
                              className="absolute inset-0 bg-error/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        {photos.length < 5 && (
                          <label className="aspect-square neo-pressed rounded-xl flex flex-col items-center justify-center text-textSecondary cursor-pointer hover:text-brandPrimary">
                            <Upload className="w-5 h-5 mb-1" />
                            <span className="text-[9px] font-extrabold uppercase">Upload</span>
                            <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
                          </label>
                        )}
                      </div>
                    </div>
                    {/* Product URL scraper */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Import from Product Link</label>
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
                          <input
                            type="text"
                            placeholder="https://amazon.com/product/..."
                            value={productUrl}
                            onChange={(e) => setProductUrl(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 neo-input text-sm"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleFetchDetails}
                          disabled={isFetchingUrl || !productUrl}
                          className="px-5 neo-button-brand font-bold text-sm flex items-center space-x-2"
                        >
                          {isFetchingUrl ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Autofill</span>}
                        </button>
                      </div>
                    </div>
                    {/* Product Name & Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Product Name</label>
                          <span className="text-xs font-bold text-textSecondary">{productName.length}/80</span>
                        </div>
                        <input
                          type="text"
                          maxLength={80}
                          placeholder="e.g. iPhone 15 Pro Max"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          className="w-full px-4 py-3.5 neo-input"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-4 py-3.5 neo-input appearance-none"
                        >
                          <option value="Electronics">Electronics</option>
                          <option value="Fashion">Fashion</option>
                          <option value="Beauty">Beauty</option>
                          <option value="Books">Books</option>
                          <option value="Home Goods">Home Goods</option>
                        </select>
                      </div>
                    </div>
                    {/* Source Country & Quantity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Source Country</label>
                        <select
                          value={desiredCountry}
                          onChange={(e) => setDesiredCountry(e.target.value)}
                          className="w-full px-4 py-3.5 neo-input"
                        >
                          <option value="UAE">UAE</option>
                          <option value="USA">USA</option>
                          <option value="UK">UK</option>
                          <option value="Germany">Germany</option>
                          <option value="Saudi Arabia">Saudi Arabia</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-textSecondary uppercase tracking-wider block">Quantity</label>
                        <div className="flex items-center space-x-4">
                          <button
                            type="button"
                            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                            className="p-3 rounded-xl neo-flat text-textSecondary hover:text-brandPrimary flex items-center justify-center cursor-pointer"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-lg font-extrabold text-textPrimary px-4">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => setQuantity((prev) => prev + 1)}
                            className="p-3 rounded-xl neo-flat text-textSecondary hover:text-brandPrimary flex items-center justify-center cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Base Price */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Base Price (PKR)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 50000"
                        value={basePrice}
                        onChange={(e) => setBasePrice(e.target.value)}
                        className="w-full px-4 py-3.5 neo-input"
                      />
                    </div>
                    {/* Delivery Deadline */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Delivery Deadline</label>
                      <input
                        type="date"
                        value={deliveryDeadline}
                        onChange={(e) => setDeliveryDeadline(e.target.value)}
                        className="w-full px-4 py-3.5 neo-input"
                      />
                    </div>
                    {/* Description */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Product Description</label>
                      <textarea
                        rows="4"
                        placeholder="Add notes about model, storage, color, packing requirements etc."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-3.5 neo-input resize-none"
                      />
                    </div>
                    <button
                      onClick={() => setStep(2)}
                      disabled={!productName.trim() || !basePrice || !deliveryDeadline}
                      className="w-full py-4 neo-button-brand font-bold text-base mt-4"
                    >
                      Continue
                    </button>
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-6"
                  >
                    {/* Saved addresses */}
                    <div className="space-y-4">
                      <label className="text-xs font-bold text-textSecondary uppercase tracking-wider block">Select Delivery Address</label>
                      <div className="space-y-4">
                        {savedAddresses.map((addr) => {
                          const isSelected = selectedAddressId === addr.id;
                          return (
                            <div
                              key={addr.id}
                              onClick={() => setSelectedAddressId(addr.id)}
                              className={`p-6 cursor-pointer relative overflow-hidden transition-all ${isSelected ? 'neo-pressed' : 'neo-flat'}`}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-bold text-textPrimary flex items-center space-x-2">
                                    <span>{addr.title}</span>
                                    {addr.isPrimary && (
                                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full text-brandPrimary bg-brandPrimary/10">Primary</span>
                                    )}
                                  </h4>
                                  <p className="text-xs font-semibold text-textSecondary mt-2 leading-relaxed">
                                    {addr.details}
                                  </p>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-brandPrimary bg-brandPrimary text-white' : 'border-cardBase'}`}>
                                  {isSelected && <Check className="w-3.5 h-3.5" />}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {/* Add new address */}
                      {!showNewAddressForm ? (
                        <button
                          onClick={() => setShowNewAddressForm(true)}
                          className="w-full py-3.5 neo-flat text-xs font-bold text-brandPrimary uppercase tracking-wider flex items-center justify-center space-x-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add New Address</span>
                        </button>
                      ) : (
                        <motion.form
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          onSubmit={handleAddNewAddress}
                          className="neo-flat p-6 space-y-4 text-left"
                        >
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Address Title</label>
                            <input
                              type="text"
                              placeholder="e.g. My Gym"
                              value={newAddress.title}
                              onChange={(e) => setNewAddress((prev) => ({ ...prev, title: e.target.value }))}
                              className="w-full px-4 py-3.5 neo-input"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Address Details</label>
                            <input
                              type="text"
                              placeholder="e.g. House 12, St 3, Cavalry Ground, Lahore"
                              value={newAddress.details}
                              onChange={(e) => setNewAddress((prev) => ({ ...prev, details: e.target.value }))}
                              className="w-full px-4 py-3.5 neo-input"
                            />
                          </div>
                          <div className="flex gap-4">
                            <button type="submit" className="flex-1 py-3 neo-button-brand font-bold text-xs">
                              Save Address
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowNewAddressForm(false)}
                              className="flex-1 py-3 neo-button-outline font-bold text-xs text-brandPrimary"
                            >
                              Cancel
                            </button>
                          </div>
                        </motion.form>
                      )}
                    </div>
                    {/* Explicit location fields */}
                    <div className="space-y-4 mt-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Delivery Country</label>
                        <input
                          type="text"
                          placeholder="e.g. United Arab Emirates"
                          value={locationCountry}
                          onChange={(e) => setLocationCountry(e.target.value)}
                          className="w-full px-4 py-3.5 neo-input"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Delivery City</label>
                        <input
                          type="text"
                          placeholder="e.g. Dubai"
                          value={locationCity}
                          onChange={(e) => setLocationCity(e.target.value)}
                          className="w-full px-4 py-3.5 neo-input"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => setStep(1)}
                        className="flex-1 py-4 neo-button-outline font-bold text-base text-brandPrimary"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setStep(3)}
                        className="flex-1 py-4 neo-button-brand font-bold text-base"
                      >
                        Next
                      </button>
                    </div>
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="space-y-6"
                  >
                    <label className="text-xs font-bold text-textSecondary uppercase tracking-wider block">Review Wish Summary</label>
                    {/* Summary Card */}
                    <div className="neo-flat p-6 space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-2xl neo-pressed flex items-center justify-center text-4xl">
                          {photos.length > 0 ? <img src={photos[0]} alt="Thumbnail" className="w-full h-full object-cover rounded-2xl" /> : '📦'}
                        </div>
                        <div>
                          <h4 className="font-bold text-textPrimary text-lg leading-tight">{productName}</h4>
                          <div className="flex items-center space-x-2 text-xs font-bold text-textSecondary mt-1">
                            <span>Qty: {quantity}</span>
                            <span>•</span>
                            <span>From {desiredCountry}</span>
                            <span>•</span>
                            <span>Category: {category}</span>
                          </div>
                        </div>
                      </div>
                      <hr className="border-cardBase" />
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Delivery Destination</span>
                        <p className="text-xs font-semibold text-textPrimary leading-relaxed">
                          {locationCity ? `${locationCity}, ${locationCountry}` : `${savedAddresses.find((a) => a.id === selectedAddressId)?.details}`}
                        </p>
                      </div>
                      <div className="neo-pressed p-4 text-center rounded-xl bg-brandPrimary/5 text-brandPrimary">
                        <p className="text-sm font-extrabold uppercase tracking-wide flex items-center justify-center space-x-2">
                          <Sparkles className="w-4 h-4 animate-pulse" />
                          <span>~ <TravelerCounter value={14} /> Matching Travellers Online</span>
                        </p>
                      </div>
                      <div className="flex gap-4 pt-4">
                        <button
                          onClick={() => setStep(2)}
                          className="flex-1 py-4 neo-button-outline font-bold text-base text-brandPrimary"
                        >
                          Back
                        </button>
                        <button
                          onClick={handlePostWish}
                          disabled={isLoading}
                          className="flex-1 py-4 neo-button-brand font-bold text-base flex items-center justify-center space-x-2"
                        >
                          {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : <span>Post Wish</span>}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            // Celebration Success State
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-[500px] neo-flat p-10 text-center space-y-8 bg-gradient-to-br from-success/5 via-surface to-brandPrimary/5"
            >
              <div className="w-20 h-20 rounded-full neo-pressed flex items-center justify-center text-success mx-auto">
                <Check className="w-10 h-10 fill-success text-white" />
              </div>
              <div className="space-y-3">
                <h2 className="text-3xl font-extrabold text-textPrimary">Your Wish is Live!</h2>
                <p className="text-sm font-semibold text-textSecondary max-w-sm mx-auto leading-relaxed">
                  Confetti celebrated! We are matching travellers on your flight route. Check your dashboard for offers shortly.
                </p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-4 neo-button-brand font-bold text-base flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Go to Dashboard</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
};

export default PostWish;

import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, DollarSign, Package, Upload, CheckCircle, AlertCircle, Globe, Truck } from 'lucide-react';

const PostWish = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    basePrice: '',
    deliveryDeadline: '',
    productLink: '',
    city: '',
    country: 'Pakistan'
  });
  
  const [selectedImages, setSelectedImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]); // Store actual File objects
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('authToken');
    if (!token) {
      setMessage({ type: 'error', text: 'Please log in to post a wish. Redirecting to login...' });
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return;
    }
    setIsAuthenticated(true);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setMessage({ type: 'error', text: 'Maximum 5 images allowed' });
      return;
    }
    
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setSelectedImages(imageUrls);
    setImageFiles(files); // Store the File objects
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.title.trim()) errors.push('Product title is required');
    if (!formData.description.trim()) errors.push('Description is required');
    if (!formData.basePrice || formData.basePrice <= 0) errors.push('Valid base price is required');
    if (!formData.deliveryDeadline) errors.push('Delivery deadline is required');
    if (!formData.city.trim()) errors.push('City is required');
    
    const deadlineDate = new Date(formData.deliveryDeadline);
    const today = new Date();
    if (deadlineDate <= today) errors.push('Deadline must be in the future');
    
    if (formData.productLink && !isValidUrl(formData.productLink)) {
      errors.push('Please enter a valid product link');
    }

    return errors;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setMessage({ type: 'error', text: errors.join(', ') });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('authToken');
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('basePrice', parseFloat(formData.basePrice));
      formDataToSend.append('deliveryDeadline', formData.deliveryDeadline);
      if (formData.productLink) formDataToSend.append('productLink', formData.productLink);
      formDataToSend.append('location[country]', formData.country);
      formDataToSend.append('location[city]', formData.city);

      // Append images to FormData
      imageFiles.forEach(file => {
        formDataToSend.append('images', file);
      });

      const response = await fetch(`${process.env.REACT_APP_API_URL}/wish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to post wish');
      }

      setMessage({ type: 'success', text: 'Your wish has been posted successfully!' });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        basePrice: '',
        deliveryDeadline: '',
        productLink: '',
        city: '',
        country: 'Pakistan'
      });
      setSelectedImages([]);
      setImageFiles([]);

      setTimeout(() => {
        window.location.href = '/my-wishes';
      }, 2000);

    } catch (error) {
      console.error('Error posting wish:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to post wish. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertCircle className="w-16 h-16 text-orange-500 mr-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to post a wish.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Post Your Wish
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Tell us what you need from anywhere in the world. Our trusted travelers will bring it to you at the best price.
          </p>
        </div>

        {/* Alert Messages */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg border ${message.type === 'success' 
            ? 'border-green-200 bg-green-50' 
            : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
              <p className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
                {message.text}
              </p>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl border-0">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg p-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Globe className="w-6 h-6" />
              Product Details
            </h2>
          </div>
          
          <div className="p-8">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Product Title */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Product Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., iPhone 14 Pro, Nike Air Max..."
                    className="w-full h-12 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none transition-colors"
                    maxLength="100"
                    required
                  />
                </div>

                {/* Base Price */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Your Budget (PKR) *
                  </label>
                  <input
                    type="number"
                    name="basePrice"
                    value={formData.basePrice}
                    onChange={handleInputChange}
                    placeholder="25000"
                    className="w-full h-12 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none transition-colors"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Product Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the product you want, including size, color, specifications, brand, etc."
                  className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none transition-colors resize-none"
                  maxLength="1000"
                  required
                />
                <p className="text-xs text-gray-500">{formData.description.length}/1000 characters</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* City */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Delivery City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g., Karachi, Lahore, Islamabad"
                    className="w-full h-12 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Delivery Deadline */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Delivery Deadline *
                  </label>
                  <input
                    type="date"
                    name="deliveryDeadline"
                    value={formData.deliveryDeadline}
                    onChange={handleInputChange}
                    className="w-full h-12 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none transition-colors"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              {/* Product Link */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Product Link (Optional)
                </label>
                <input
                  type="url"
                  name="productLink"
                  value={formData.productLink}
                  onChange={handleInputChange}
                  placeholder="https://example.com/product-page"
                  className="w-full h-12 px-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none transition-colors"
                />
                <p className="text-xs text-gray-500">Share a link to help travelers find the exact product</p>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Reference Images (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">Click to upload</span>
                    <span className="text-gray-500"> or drag and drop</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 5 images</p>
                </div>

                {/* Image Previews */}
                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-md transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Posting Your Wish...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Truck className="w-5 h-5" />
                      Post My Wish
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Your wish will be visible to trusted travelers who can bring your items from around the world. 
            <br />
            <span className="font-medium">No payment required until delivery is confirmed!</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostWish;
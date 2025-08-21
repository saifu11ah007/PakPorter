import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, ArrowLeft, Sparkles, DollarSign, Calendar, MessageSquare } from 'lucide-react';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('useAuth: authToken from localStorage:', token ? 'Present' : 'Missing');
    if (token) {
      try {
        if (token.split('.').length === 3) {
          const userData = { id: 'current-user-id', name: 'Current User', token };
          console.log('useAuth: Setting user:', userData);
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          console.log('useAuth: Invalid token format, clearing authToken');
          localStorage.removeItem('authToken');
        }
      } catch (err) {
        console.error('useAuth: Token parsing error:', err.message);
        localStorage.removeItem('authToken');
      }
    } else {
      console.log('useAuth: No token found in localStorage');
    }
    setLoading(false);
  }, []);

  return { user, isAuthenticated, loading };
};

const getWishIdFromUrl = () => {
  const pathParts = window.location.pathname.split('/');
  const bidIndex = pathParts.indexOf('bid');
  if (bidIndex !== -1 && pathParts[bidIndex + 1]) {
    return pathParts[bidIndex + 1];
  }
  return null;
};

const BidForm = () => {
  const wishId = getWishIdFromUrl();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [wishOwnerId, setWishOwnerId] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [message, setMessage] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    console.log('BidForm: wishId from getWishIdFromUrl:', wishId);
    console.log('BidForm: user:', user, 'isAuthenticated:', isAuthenticated, 'authLoading:', authLoading);

    if (authLoading) {
      console.log('BidForm: authLoading is true, waiting for auth to resolve');
      return;
    }

    if (!wishId) {
      setFetchError('Invalid wish ID');
      setIsLoading(false);
      return;
    }

    const fetchWishDetails = async () => {
      try {
        setIsLoading(true);
        console.log('fetchWishDetails: Fetching wish with URL:', `${process.env.REACT_APP_API_URL}/wish/${wishId}`);
        console.log('fetchWishDetails: Using token:', user?.token ? 'Present' : 'Missing');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/wish/${wishId}`, {
          headers: user?.token ? { Authorization: `Bearer ${user?.token}` } : {},
        });
        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 404) {
            throw new Error('Wish not found');
          } else if (response.status === 401) {
            console.log('fetchWishDetails: Unauthorized, clearing authToken');
            localStorage.removeItem('authToken');
            setFetchError('Your session has expired. Please log in again.');
            setTimeout(() => navigate('/login'), 2000);
            return;
          } else {
            throw new Error(errorData.message || 'Failed to fetch wish details');
          }
        }
        const wishData = await response.json();
        console.log('fetchWishDetails: Wish data:', wishData);
        setWishOwnerId(wishData.createdBy._id);
      } catch (err) {
        console.error('fetchWishDetails: Error:', err.message);
        setFetchError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (wishId && user?.token) {
      fetchWishDetails();
    } else if (!authLoading && !user?.token) {
      console.log('BidForm: No user token, redirecting to login');
      setFetchError('Please log in to place a bid');
      setTimeout(() => navigate('/login'), 2000);
      setIsLoading(false);
    }
  }, [wishId, user, isAuthenticated, authLoading, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!bidAmount || bidAmount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (message.length > 300) {
      newErrors.message = 'Message cannot exceed 300 characters';
    }
    if (!deliveryDate) {
      newErrors.deliveryDate = 'Delivery date is required';
    } else {
      const selectedDate = new Date(deliveryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.deliveryDate = 'Delivery date cannot be in the past';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!wishId) {
      setAlert({ type: 'error', message: 'Invalid wish ID' });
      setTimeout(() => setAlert(null), 3000);
      return;
    }
    if (!user?.token) {
      setAlert({ type: 'error', message: 'Please log in to place a bid' });
      setTimeout(() => { setAlert(null); navigate('/login'); }, 2000);
      return;
    }
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      console.log('handleSubmit: Submitting bid to:', `${process.env.REACT_APP_API_URL}/bids/${wishId}`);
      console.log('handleSubmit: Payload:', {
        offerPrice: parseFloat(bidAmount),
        message,
        deliveryDate: new Date(deliveryDate).toISOString(),
      });
      const response = await fetch(`${process.env.REACT_APP_API_URL}/bids/${wishId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          offerPrice: parseFloat(bidAmount),
          message,
          deliveryDate: new Date(deliveryDate).toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          console.log('handleSubmit: Unauthorized, clearing authToken');
          localStorage.removeItem('authToken');
          setAlert({ type: 'error', message: 'Your session has expired. Please log in again.' });
          setTimeout(() => { setAlert(null); navigate('/login'); }, 2000);
          return;
        } else if (response.status === 403) {
          console.log('handleSubmit: Forbidden, user not allowed to bid');
          setAlert({ type: 'error', message: errorData.message || 'You are not allowed to bid on this wish.' });
          setTimeout(() => setAlert(null), 3000);
          return;
        }
        throw new Error(errorData.message || 'Failed to place bid');
      }

      setIsSubmitted(true);
      setAlert({ type: 'success', message: 'Your bid has been placed successfully!' });
      setTimeout(() => {
        setAlert(null);
        navigate(`/wish/${wishId}`);
      }, 3000);
    } catch (error) {
      console.error('handleSubmit: Error:', error.message);
      setAlert({ type: 'error', message: error.message });
      setTimeout(() => setAlert(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-lg font-medium text-gray-700"
          >
            Preparing your bidding experience...
          </motion.p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-white/30"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-6"
          >
            <AlertCircle className="w-8 h-8" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-8">{fetchError}</p>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-blue-200 transition-all"
            >
              Go to Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(-1)}
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Go Back
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const isOwnWish = isAuthenticated && user && wishOwnerId === user.id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <AnimatePresence>
        {alert && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-6 right-6 p-4 rounded-xl shadow-lg text-white z-50 flex items-center space-x-3 ${
              alert.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-rose-500'
            }`}
          >
            {alert.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="font-medium">{alert.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md mx-auto">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </motion.button>

        {!isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/30"
          >
            <div className="relative h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center justify-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mr-3">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Place Your Bid
                </h2>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {!isAuthenticated ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center p-4 rounded-xl bg-amber-50 text-amber-700 border border-amber-200"
                >
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <p>Please log in to place a bid.</p>
                </motion.div>
              ) : isOwnWish ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center p-4 rounded-xl bg-rose-50 text-rose-700 border border-rose-200"
                >
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <p>You cannot place a bid on your own wish.</p>
                </motion.div>
              ) : (
                <motion.form 
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="space-y-2">
                    <label
                      htmlFor="bidAmount"
                      className="block text-sm font-medium text-gray-700 flex items-center"
                    >
                      <DollarSign className="w-4 h-4 mr-1" />
                      Bid Amount
                    </label>
                    <div className="relative">
                      <input
                        id="bidAmount"
                        type="number"
                        step="0.01"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder="0.00"
                        className="pl-10 mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:bg-gray-100 bg-white/50 transition-all"
                        disabled={isLoading}
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-1">
                        <span className="text-gray-500 font-medium">$</span>
                      </div>
                    </div>
                    {errors.amount && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-rose-500 bg-rose-50 p-2 rounded-lg"
                      >
                        {errors.amount}
                      </motion.p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label
                      htmlFor="deliveryDate"
                      className="block text-sm font-medium text-gray-700 flex items-center"
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      Expected Delivery Date
                    </label>
                    <input
                      id="deliveryDate"
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:bg-gray-100 bg-white/50 transition-all"
                      disabled={isLoading}
                    />
                    {errors.deliveryDate && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-rose-500 bg-rose-50 p-2 rounded-lg"
                      >
                        {errors.deliveryDate}
                      </motion.p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 flex items-center"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Message to Wisher (Optional)
                    </label>
                    <div className="relative">
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Why should the wisher choose you? Share your expertise and approach..."
                        className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:bg-gray-100 bg-white/50 transition-all"
                        rows={4}
                        maxLength={300}
                        disabled={isLoading}
                      />
                      <div className="absolute bottom-2 right-2 bg-white/80 px-2 py-1 rounded-lg text-xs text-gray-500">
                        {message.length}/300
                      </div>
                    </div>
                    {errors.message && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-rose-500 bg-rose-50 p-2 rounded-lg"
                      >
                        {errors.message}
                      </motion.p>
                    )}
                  </div>
                  
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 disabled:opacity-50 shadow-lg hover:shadow-blue-200 transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-4 w-4 rounded-full border-2 border-white border-t-transparent mr-2"
                        ></motion.span>
                        Submitting...
                      </span>
                    ) : (
                      "Place Bid"
                    )}
                  </motion.button>
                </motion.form>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/30 text-center p-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"
                >
                  <Sparkles className="w-3 h-3 text-white" />
                </motion.div>
              </div>
            </motion.div>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Bid Submitted Successfully!
            </h3>
            
            <p className="text-gray-600 mb-6">
              Your offer has been sent to the wisher. You'll be notified if it gets accepted.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/wish/${wishId}`)}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Return to Wish
              <ArrowLeft className="w-4 h-4 ml-1 transform rotate-180" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BidForm;
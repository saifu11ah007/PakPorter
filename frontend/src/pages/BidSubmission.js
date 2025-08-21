import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('useAuth: authToken from localStorage:', token ? 'Present' : 'Missing'); // Debug token presence
    if (token) {
      try {
        // Verify token format (basic JWT check)
        if (token.split('.').length === 3) {
          const userData = { id: 'current-user-id', name: 'Current User', token };
          console.log('useAuth: Setting user:', userData); // Debug user data
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
    console.log('BidForm: wishId from getWishIdFromUrl:', wishId); // Debug wishId
    console.log('BidForm: user:', user, 'isAuthenticated:', isAuthenticated, 'authLoading:', authLoading); // Debug auth

    if (authLoading) {
      console.log('BidForm: authLoading is true, waiting for auth to resolve');
      return; // Wait for authLoading to resolve
    }

    if (!wishId) {
      setFetchError('Invalid wish ID');
      setIsLoading(false);
      return;
    }

    const fetchWishDetails = async () => {
      try {
        setIsLoading(true);
        console.log('fetchWishDetails: Fetching wish with URL:', `${process.env.REACT_APP_API_URL}/wish/${wishId}`); // Debug URL
        console.log('fetchWishDetails: Using token:', user?.token ? 'Present' : 'Missing'); // Debug token
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
        console.log('fetchWishDetails: Wish data:', wishData); // Debug wish data
        setWishOwnerId(wishData.createdBy._id);
      } catch (err) {
        console.error('fetchWishDetails: Error:', err.message); // Debug error
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
      console.log('handleSubmit: Submitting bid to:', `${process.env.REACT_APP_API_URL}/bids/${wishId}`); // Debug submission
      console.log('handleSubmit: Payload:', {
        offerPrice: parseFloat(bidAmount),
        message,
        deliveryDate: new Date(deliveryDate).toISOString(),
      }); // Debug payload
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
      console.error('handleSubmit: Error:', error.message); // Debug error
      setAlert({ type: 'error', message: error.message });
      setTimeout(() => setAlert(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{fetchError}</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mb-2"
          >
            Go to Login
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isOwnWish = isAuthenticated && user && wishOwnerId === user.id;

  return (
    <AnimatePresence>
      {alert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white ${
            alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {alert.message}
        </motion.div>
      )}
      {!isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="max-w-md mx-auto mt-6 px-4 sm:px-0"
        >
          <div className="bg-white shadow-lg rounded-lg border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-center text-gray-800">
                Place Your Bid
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {!isAuthenticated ? (
                <div className="flex items-center justify-center text-red-500">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <p>Please log in to place a bid.</p>
                </div>
              ) : isOwnWish ? (
                <div className="flex items-center justify-center text-red-500">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <p>You cannot place a bid on your own wish.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="bidAmount"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Bid Amount (USD or PKR)
                    </label>
                    <input
                      id="bidAmount"
                      type="number"
                      step="0.01"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      disabled={isLoading}
                    />
                    {errors.amount && (
                      <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="deliveryDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Expected Delivery Date
                    </label>
                    <input
                      id="deliveryDate"
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      disabled={isLoading}
                    />
                    {errors.deliveryDate && (
                      <p className="mt-1 text-sm text-red-500">{errors.deliveryDate}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Message to Wisher (Optional)
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Why should the wisher choose you?"
                      className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      rows={4}
                      maxLength={300}
                      disabled={isLoading}
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500 text-right">
                      {message.length}/300
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 disabled:bg-blue-400"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Submitting...' : 'Place Bid'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-md mx-auto mt-6 px-4 sm:px-0 text-center"
        >
          <div className="bg-white shadow-lg rounded-lg border border-gray-200">
            <div className="p-6">
              <div className="flex flex-col items-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                <p className="text-lg font-semibold text-gray-800">
                  Your bid has been submitted.
                </p>
                <p className="text-gray-600">
                  You’ll be notified if it gets accepted.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BidForm;
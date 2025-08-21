import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  DollarSign, 
  MapPin, 
  User, 
  Heart,
  Share2,
  Eye,
  Package,
  ChevronRight,
  X,
  ZoomIn,
  Shield,
  Truck,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import jwtDecode from 'jwt-decode'; // Requires: npm install jwt-decode

const getWishIdFromUrl = () => {
  const pathParts = window.location.pathname.split('/');
  const wishIndex = pathParts.indexOf('wish');
  if (wishIndex !== -1 && pathParts[wishIndex + 1]) {
    return pathParts[wishIndex + 1];
  }
  return null;
};

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const userData = { id: 'current-user-id', name: 'Current User', token };
      setUser(userData);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  return { user, isAuthenticated, loading };
};

const WishDetailSkeleton = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div className="bg-gray-200 aspect-square rounded-xl"></div>
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

const ImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No image available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative group">
        <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
          <img
            src={images[selectedImage]}
            alt="Wish product"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwQzE2Ni42NjcgMTAwIDEzMy4zMzMgMTAwIDEwMCAxMDBWMzAwSDE2Ni42NjdIMjMzLjMzM0gzMDBWMTAwQzI2Ni66NjY3MTAwIDIzMy4zMzMgMTAwIDIwMCAxMDBaIiBmaWxsPSIjRTVFN0VCIi8+Cjwvc3ZnPgo=';
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
            <button
              onClick={() => setShowZoom(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-2 shadow-lg"
            >
              <ZoomIn className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAxNkMyNi42NjY3IDE2IDIxLjMzMzMgMTYgMTYgMTZWNDhIMjYuNjY2N0gzNy4zMzMzSDQ4VjE2QzQyLjY2NjcgMTYgMzcuMzMzMyAxNiAzMiAxNloiIGZpbGw9IiNFNUU3RUIiLz4KPC9zdmc+Cg==';
                }}
              />
            </button>
          ))}
        </div>
      )}
      {showZoom && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowZoom(false)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={images[selectedImage]}
              alt="Zoomed product"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const WishDetailPage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [wish, setWish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stickyHeader, setStickyHeader] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();
  const wishId = getWishIdFromUrl();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchWishDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching wish with ID:', wishId); // Line 166
        const token = localStorage.getItem('authToken');
        console.log('fetchWishDetails: authToken:', token ? 'Present' : 'Missing'); // Debug token
        if (token) {
          try {
            const decoded = jwtDecode(token);
            console.log('fetchWishDetails: Decoded user ID:', decoded._id); // Debug user ID
            setUserId(decoded._id);
          } catch (err) {
            console.error('fetchWishDetails: Token decode error:', err.message);
            setError('Invalid authentication token');
            localStorage.removeItem('authToken');
            setTimeout(() => navigate('/login'), 2000);
            setLoading(false);
            return;
          }
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/wish/${wishId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Wish not found');
          } else if (response.status === 400) {
            throw new Error('Invalid wish ID');
          } else if (response.status === 401) {
            localStorage.removeItem('authToken');
            throw new Error('Please log in to view this wish');
          } else {
            throw new Error('Failed to fetch wish details');
          }
        }

        const wishData = await response.json();
        console.log('Wish data:', wishData); // Line 186
        setWish(wishData);
      } catch (err) {
        console.error('Error fetching wish:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (wishId && user?.token) {
      fetchWishDetails();
    } else {
      setLoading(false);
      setError('Please log in to view this wish');
    }

    const handleScroll = () => {
      setStickyHeader(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [wishId, user, navigate]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: wish?.title,
        text: wish?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In real app, you would save this to user's bookmarks
  };

  const handlePlaceBid = () => {
    console.log('handlePlaceBid: Navigating to bid form with wishId:', wish._id); // Line 234
    navigate(`/bid/${wish._id}`);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <WishDetailSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.history.back()}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!wish) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Wish Not Found</h2>
          <p className="text-gray-600">The wish you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const isOwner = userId && wish.createdBy._id === userId;
  const daysLeft = Math.max(0, Math.ceil((new Date(wish.deliveryDeadline) - new Date()) / (1000 * 60 * 60 * 24)));
  const isExpired = new Date(wish.deliveryDeadline) < new Date();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 transition-all duration-200 ${
        stickyHeader ? 'translate-y-0 shadow-sm' : '-translate-y-full'
      }`}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-semibold text-gray-900 truncate">{wish.title}</h1>
          </div>
          <div className="text-lg font-bold text-blue-600">
            Rs. {wish.basePrice.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <button 
            onClick={() => window.location.href = '/'}
            className="hover:text-gray-900"
          >
            Home
          </button>
          <ChevronRight className="w-4 h-4" />
          <button 
            onClick={() => window.location.href = '/wishes'}
            className="hover:text-gray-900"
          >
            Wishes
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">Product Details</span>
        </nav>

        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Wishes
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <ImageGallery images={wish.images} />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-3">
                <h1 className="text-3xl font-bold text-gray-900 leading-tight">{wish.title}</h1>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={handleBookmark}
                    className={`p-2 rounded-full transition-colors ${
                      isBookmarked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <div className="text-3xl font-bold text-blue-600">
                  Rs. {wish.basePrice.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Budget</div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className={`flex items-center gap-1 ${isExpired ? 'text-red-600' : 'text-orange-600'}`}>
                  <Clock className="w-4 h-4" />
                  <span>
                    {isExpired ? 'Expired' : `${daysLeft} days left`}
                  </span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  wish.isFulfilled 
                    ? 'bg-green-100 text-green-800' 
                    : isExpired 
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {wish.isFulfilled ? 'Fulfilled' : isExpired ? 'Expired' : 'Active'}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="capitalize">
                  {wish.location.city}, {wish.location.country}
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span>
                  Deadline: {new Date(wish.deliveryDeadline).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <div className="flex items-center gap-3 text-gray-700">
                <User className="w-5 h-5 text-gray-400" />
                <span>Posted by {wish.createdBy.fullName}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="w-5 h-5 text-gray-400" />
                <span>
                  Posted on {new Date(wish.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {wish.productLink && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Reference Link</span>
                </div>
                <a
                  href={wish.productLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm break-all"
                >
                  {wish.productLink}
                </a>
              </div>
            )}

            <div className="space-y-3">
              {!isAuthenticated ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-yellow-600" />
                    <span className="font-medium text-yellow-900">Login Required</span>
                  </div>
                  <p className="text-yellow-700 text-sm mb-3">
                    Please log in to place a bid on this wish.
                  </p>
                  <button
                    onClick={() => window.location.href = '/login'}
                    className="w-full bg-yellow-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                  >
                    Login to Bid
                  </button>
                </div>
              ) : isOwner ? (
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900">This is your wish</span>
                    </div>
                    <p className="text-green-700 text-sm">
                      You can view and manage bids received for this wish.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/wish/${wish._id}/bids`)}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
                    disabled={!wish._id}
                  >
                    <Eye className="w-5 h-5" />
                    View All Bids
                  </button>
                </div>
              ) : (
                <button
                  onClick={handlePlaceBid}
                  disabled={isExpired || wish.isFulfilled || !wish._id}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <DollarSign className="w-5 h-5" />
                  {wish.isFulfilled ? 'Wish Fulfilled' : isExpired ? 'Bidding Closed' : 'Place Bid'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {wish.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <Shield className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Secure Payment</h4>
            <p className="text-sm text-gray-600">
              Payment is only released after you confirm delivery
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <Truck className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Global Delivery</h4>
            <p className="text-sm text-gray-600">
              Trusted travelers bring items from anywhere in the world
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <MessageCircle className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Direct Communication</h4>
            <p className="text-sm text-gray-600">
              Chat directly with travelers to discuss details
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishDetailPage;
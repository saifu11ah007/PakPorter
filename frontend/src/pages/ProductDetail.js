import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageLoader from '../components/PageLoader';

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
      try {
        const decoded = jwtDecode(token);
        setUser({ id: decoded._id, name: decoded.name || 'Current User', token });
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem('authToken');
      }
    }
    setLoading(false);
  }, []);

  return { user, isAuthenticated, loading };
};

const ImageGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showZoom, setShowZoom] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square neo-pressed rounded-2xl flex items-center justify-center">
        <div className="text-center space-y-2">
          <svg className="w-12 h-12 text-textSecondary mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="text-xs font-semibold text-textSecondary">No image available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative group">
        <div className="aspect-square neo-pressed rounded-2xl overflow-hidden">
          <img
            src={images[selectedImage]}
            alt="Wish product"
            className="w-full h-full object-cover cursor-zoom-in"
            onClick={() => setShowZoom(true)}
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPg==';
            }}
          />
        </div>
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all ${
                selectedImage === index ? 'neo-pressed' : 'neo-flat'
              }`}
            >
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
      {showZoom && (
        <div
          className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4"
          onClick={() => setShowZoom(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowZoom(false)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full neo-flat flex items-center justify-center text-textPrimary z-10"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={images[selectedImage]}
              alt="Zoomed product"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl"
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
  const navigate = useNavigate();
  const wishId = getWishIdFromUrl();

  useEffect(() => {
    const fetchWishDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('authToken');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/wish/${wishId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 404) throw new Error('Wish not found');
          else if (response.status === 400) throw new Error('Invalid wish ID');
          else if (response.status === 401) {
            localStorage.removeItem('authToken');
            throw new Error('Please log in to view this wish');
          } else {
            throw new Error(errorData.message || 'Failed to fetch wish details');
          }
        }

        const wishData = await response.json();
        setWish(wishData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (wishId) {
      fetchWishDetails();
    } else {
      setLoading(false);
      setError('Invalid wish ID');
    }
  }, [wishId]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: wish?.title, text: wish?.description, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handlePlaceBid = () => {
    if (!user?.token) {
      navigate('/login');
      return;
    }
    navigate(`/bid/${wish._id}`);
  };

  if (authLoading || loading) return <PageLoader />;

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col pt-20">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md neo-flat p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl neo-pressed flex items-center justify-center mx-auto text-error">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-textPrimary">Something went wrong</h2>
              <p className="text-sm font-semibold text-textSecondary">{error}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-3 neo-button-brand font-bold text-sm"
              >
                Try Again
              </button>
              <button
                onClick={() => window.history.back()}
                className="flex-1 py-3 neo-button-outline font-bold text-sm text-brandPrimary"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!wish) {
    return (
      <div className="min-h-screen bg-background flex flex-col pt-20">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md neo-flat p-10 text-center space-y-4">
            <div className="w-16 h-16 neo-pressed rounded-2xl flex items-center justify-center mx-auto text-textSecondary">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-textPrimary">Wish Not Found</h2>
            <p className="text-sm font-semibold text-textSecondary">The wish you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isOwner = user && wish.createdBy && wish.createdBy._id === user.id;
  const daysLeft = Math.max(0, Math.ceil((new Date(wish.deliveryDeadline) - new Date()) / (1000 * 60 * 60 * 24)));
  const isExpired = new Date(wish.deliveryDeadline) < new Date();

  return (
    <div className="min-h-screen bg-background flex flex-col pt-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10 w-full flex-1">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-bold text-textSecondary mb-6 uppercase tracking-wider">
          <button onClick={() => window.location.href = '/'} className="hover:text-brandPrimary transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => window.location.href = '/wishes'} className="hover:text-brandPrimary transition-colors">Wishes</button>
          <span>/</span>
          <span className="text-textPrimary">Product Details</span>
        </nav>

        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm font-bold text-textSecondary hover:text-brandPrimary mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Wishes
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          {/* Image Gallery */}
          <div>
            <ImageGallery images={wish.images} />
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Title + Share */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-extrabold text-textPrimary leading-tight tracking-tight">{wish.title}</h1>
              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl neo-flat text-textSecondary hover:text-brandPrimary flex-shrink-0 transition-colors"
                title="Share"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>

            {/* Price + Status */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-extrabold text-brandPrimary">
                PKR {wish.basePrice.toLocaleString()}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                wish.isFulfilled
                  ? 'bg-success/10 text-success'
                  : isExpired
                  ? 'bg-error/10 text-error'
                  : 'bg-brandPrimary/10 text-brandPrimary'
              }`}>
                {wish.isFulfilled ? 'Fulfilled' : isExpired ? 'Expired' : 'Active'}
              </span>
              {!isExpired && !wish.isFulfilled && (
                <span className="text-xs font-bold text-textSecondary">{daysLeft} days left</span>
              )}
            </div>

            {/* Meta info */}
            <div className="neo-flat p-5 space-y-3">
              <div className="flex items-center gap-3 text-sm font-semibold text-textSecondary">
                <svg className="w-4 h-4 text-brandPrimary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="capitalize">{wish.location.city}, {wish.location.country}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-textSecondary">
                <svg className="w-4 h-4 text-brandPrimary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Deadline: {new Date(wish.deliveryDeadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-textSecondary">
                <svg className="w-4 h-4 text-brandPrimary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Posted by {wish.createdBy.fullName}</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold text-textSecondary">
                <svg className="w-4 h-4 text-brandPrimary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Posted on {new Date(wish.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            {/* Product Link */}
            {wish.productLink && (
              <div className="neo-pressed p-4 rounded-2xl">
                <span className="text-[10px] font-extrabold text-textSecondary uppercase tracking-wider block mb-1">Reference Link</span>
                <a
                  href={wish.productLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-brandPrimary hover:underline break-all"
                >
                  {wish.productLink}
                </a>
              </div>
            )}

            {/* CTA */}
            <div className="space-y-3">
              {!isAuthenticated ? (
                <div className="neo-flat p-5 space-y-3">
                  <p className="text-sm font-semibold text-textSecondary">Please log in to place a bid on this wish.</p>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full py-3.5 neo-button-brand font-bold text-sm"
                  >
                    Login to Bid
                  </button>
                </div>
              ) : isOwner ? (
                <div className="space-y-3">
                  <div className="neo-pressed p-4 rounded-2xl">
                    <span className="text-[10px] font-extrabold text-success uppercase tracking-wider block mb-1">Your Wish</span>
                    <p className="text-xs font-semibold text-textSecondary">You can view and manage bids received for this wish.</p>
                  </div>
                  <button
                    onClick={() => navigate(`/wish/${wish._id}/bids`)}
                    className="w-full py-3.5 neo-button-brand font-bold text-sm"
                    disabled={!wish._id}
                  >
                    View All Bids
                  </button>
                </div>
              ) : (
                <button
                  onClick={handlePlaceBid}
                  disabled={isExpired || wish.isFulfilled || !wish._id}
                  className="w-full py-3.5 neo-button-brand font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {wish.isFulfilled ? 'Wish Fulfilled' : isExpired ? 'Bidding Closed' : 'Place Bid'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="neo-flat p-8">
          <h3 className="text-lg font-extrabold text-textPrimary mb-4 uppercase tracking-wider">Description</h3>
          <p className="text-sm font-semibold text-textSecondary leading-relaxed whitespace-pre-wrap">
            {wish.description}
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WishDetailPage;
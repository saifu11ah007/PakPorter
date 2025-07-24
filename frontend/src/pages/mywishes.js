import  { useState, useEffect, useCallback } from 'react';
import { 
  Eye, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Package,
  Plus,
  Loader2,
  Sparkles,
  Star,
  Heart
} from 'lucide-react';

const MyWishesPage = () => {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Check if user is logged in
  const token = localStorage?.getItem('token');
  
  const fetchMyWishes = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/wish`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wishes');
      }

      const data = await response.json();
      setWishes(data.wishes || data || []);
    } catch (err) {
      setError('Failed to load your wishes. Please try again.');
      console.error('Error fetching wishes:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);
  
  useEffect(() => {
    if (!token) {
      setError('Please log in to view your wishes');
      setLoading(false);
      return;
    }
    fetchMyWishes();
  }, [token, fetchMyWishes]);


  const getStatusBadgeColor = (isFulfilled) => {
    if (isFulfilled) {
      return 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border-emerald-200 shadow-sm';
    } else {
      return 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-blue-200 shadow-sm';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No deadline';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Not specified';
    return `PKR ${parseInt(price).toLocaleString()}`;
  };

  // const getStatusText = (isFulfilled) => {
  //   return isFulfilled ? 'Fulfilled' : 'Open';
  // };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 p-6 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-8 -right-8 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center py-16">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30 animate-pulse scale-110"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full inline-block">
                <Package className="w-16 h-16 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">Access Denied</h2>
            <p className="text-gray-500 mb-8 text-lg">Please log in to view your wishes</p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 p-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-8 -right-8 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center py-16">
            <div className="relative mb-4">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
              <div className="absolute inset-0 bg-blue-600 rounded-full blur-md opacity-30 animate-ping"></div>
            </div>
            <p className="text-gray-600 text-lg">Loading your wishes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-8 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-teal-600/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <Sparkles className="w-8 h-8 text-blue-600" />
                  <div className="absolute inset-0 bg-blue-600 rounded-full blur-sm opacity-30 animate-pulse"></div>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  My Wishes
                </h1>
              </div>
              <p className="text-gray-600 text-lg ml-11">
                Manage all your product requests in one magical place ✨
              </p>
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <Plus className="w-5 h-5" />
              <span className="font-semibold">Post New Wish</span>
            </button>
          </div>
          
          {wishes.length > 0 && (
            <div className="mt-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Package className="w-6 h-6 text-blue-600" />
                      <div className="absolute inset-0 bg-blue-600 rounded-full blur-sm opacity-30"></div>
                    </div>
                    <span className="font-bold text-gray-900 text-lg">
                      Total Wishes: {wishes.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-600" />
                    <span className="text-sm text-gray-600 font-medium">Community wishes</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 mb-8 shadow-lg">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && wishes.length === 0 && !error && (
          <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border border-white/30 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
            <div className="relative z-10">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-2xl opacity-20 scale-150 animate-pulse"></div>
                <Package className="w-20 h-20 text-gray-400 mx-auto relative z-10" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
                No wishes yet
              </h3>
              <p className="text-gray-500 mb-8 text-lg">Start by posting your first magical product request</p>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl inline-flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <Plus className="w-5 h-5" />
                <span className="font-semibold">Create Your First Wish</span>
              </button>
            </div>
          </div>
        )}

        {/* Wishes Grid */}
        {wishes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {wishes.map((wish, index) => (
              <div key={wish.id} className="group relative">
                {/* Card glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-all duration-500"></div>
                
                <div className="relative bg-white/70 backdrop-blur-sm border border-white/30 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
                  {/* Card Header with gradient */}
                  <div className="p-6 pb-4 relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                    <div className="flex items-start justify-between">
                      <h3 className="text-xl font-bold text-gray-900 line-clamp-2 flex-1 mr-3 group-hover:text-blue-900 transition-colors">
                        {wish.title || wish.productTitle || 'Untitled Wish'}
                      </h3>
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border-2 ${getStatusBadgeColor(wish.status)} transition-all duration-300`}>
                        {wish.status || 'Open'}
                      </span>
                    </div>
                    {/* Wish number badge */}
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-6 pt-2">
                    {/* Product Image */}
                    {wish.images && wish.images.length > 0 && (
                      <div className="mb-4 rounded-xl overflow-hidden shadow-lg">
                        <img 
                          src={wish.images[0]} 
                          alt={wish.title}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {/* Description */}
                    {wish.description && (
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-6">
                        <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed">
                          {wish.description}
                        </p>
                      </div>
                    )}
                    
                    {/* Details Grid */}
                    <div className="space-y-4 mb-6">
                      {/* Price */}
                      <div className="flex items-center gap-3 text-sm bg-green-50 rounded-lg p-3 transition-all hover:bg-green-100">
                        <div className="relative">
                          <DollarSign className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <div className="absolute inset-0 bg-green-600 rounded-full blur-sm opacity-20"></div>
                        </div>
                        <span className="text-gray-800 font-semibold">
                          Budget: <span className="text-green-700 font-bold">{formatPrice(wish.basePrice)}</span>
                        </span>
                      </div>
                      
                      {/* Location */}
                      {wish.location && (
                        <div className="flex items-center gap-3 text-sm bg-red-50 rounded-lg p-3 transition-all hover:bg-red-100">
                          <MapPin className="w-5 h-5 text-red-600 flex-shrink-0" />
                          <span className="text-gray-800">
                            <span className="font-semibold">Location:</span> 
                            <span className="text-red-700 font-medium">
                              {wish.location.city}, {wish.location.country}
                            </span>
                          </span>
                        </div>
                      )}
                      
                      {/* Deadline */}
                      <div className="flex items-center gap-3 text-sm bg-purple-50 rounded-lg p-3 transition-all hover:bg-purple-100">
                        <Calendar className="w-5 h-5 text-purple-600 flex-shrink-0" />
                        <span className="text-gray-800">
                          <span className="font-semibold">Deadline:</span> 
                          <span className="text-purple-700 font-medium">{formatDate(wish.deliveryDeadline)}</span>
                        </span>
                      </div>

                      {/* Product Link */}
                      {wish.productLink && (
                        <div className="flex items-center gap-3 text-sm bg-blue-50 rounded-lg p-3 transition-all hover:bg-blue-100">
                          <Package className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          <span className="text-gray-800">
                            <span className="font-semibold">Reference:</span> 
                            <a 
                              href={wish.productLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-700 font-medium hover:underline ml-1"
                            >
                              View Original
                            </a>
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Button */}
                    <div className="pt-4 border-t border-gray-200">
                      <button className="w-full h-12 px-6 text-sm font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-xl inline-flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                        <Eye className="w-5 h-5" />
                        <span>View Product Details</span>
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyWishesPage;
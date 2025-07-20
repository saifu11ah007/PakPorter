import React, { useState, useEffect, useCallback } from 'react';
import { 
  Trash2, 
  Edit, 
  Eye, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Package,
  Plus,
  Loader2
} from 'lucide-react';

const MyWishesPage = () => {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Check if user is logged in
  const token = localStorage.getItem('token');
  
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

  const handleDeleteWish = async (wishId) => {
    if (!window.confirm('Are you sure you want to delete this wish? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(wishId);
    try {
      const response = await fetch(`https://pak-porter.vercel.app/wish/${wishId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete wish');
      }

      // Remove the deleted wish from state
      setWishes(wishes.filter(wish => wish.id !== wishId));
    } catch (err) {
      console.error('Error deleting wish:', err);
      alert('Failed to delete wish. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const getStatusBadgeColor = (status) => {
    const statusLower = status?.toLowerCase() || '';
    switch (statusLower) {
      case 'open':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'closed':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
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

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Access Denied</h2>
            <p className="text-gray-500 mb-6">Please log in to view your wishes</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your wishes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishes</h1>
              <p className="text-gray-600">
                Manage all your product requests in one place
              </p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <Plus className="w-4 h-4" />
              Post New Wish
            </button>
          </div>
          
          {wishes.length > 0 && (
            <div className="mt-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">
                    Total Wishes: {wishes.length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && wishes.length === 0 && !error && (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200 shadow-sm">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No wishes yet</h3>
            <p className="text-gray-500 mb-6">Start by posting your first product request</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 transition-colors">
              <Plus className="w-4 h-4" />
              Create Your First Wish
            </button>
          </div>
        )}

        {/* Wishes Grid */}
        {wishes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {wishes.map((wish) => (
              <div key={wish.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200">
                {/* Card Header */}
                <div className="p-6 pb-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
                      {wish.title || wish.productTitle || 'Untitled Wish'}
                    </h3>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${getStatusBadgeColor(wish.status)}`}>
                      {wish.status || 'Open'}
                    </span>
                  </div>
                </div>
                
                {/* Card Content */}
                <div className="p-6 pt-0">
                  {/* Description */}
                  {wish.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {wish.description}
                    </p>
                  )}
                  
                  {/* Details Grid */}
                  <div className="space-y-3 mb-4">
                    {/* Price */}
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">
                        <strong>Budget:</strong> {formatPrice(wish.basePrice || wish.price)}
                      </span>
                    </div>
                    
                    {/* Category */}
                    {wish.category && (
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-gray-700">
                          <strong>Category:</strong> {wish.category}
                        </span>
                      </div>
                    )}
                    
                    {/* City */}
                    {wish.city && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span className="text-gray-700">
                          <strong>City:</strong> {wish.city}
                        </span>
                      </div>
                    )}
                    
                    {/* Deadline */}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      <span className="text-gray-700">
                        <strong>Deadline:</strong> {formatDate(wish.deadline)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    {/* View Bids Button */}
                    <button className="flex-1 h-8 px-3 text-xs border border-blue-200 bg-white hover:bg-blue-50 text-blue-600 rounded-md inline-flex items-center justify-center gap-1 transition-colors">
                      <Eye className="w-4 h-4" />
                      View Bids
                    </button>
                    
                    {/* Edit Button */}
                    <button 
                      disabled
                      className="h-8 px-3 text-xs border border-gray-200 bg-white text-gray-400 rounded-md inline-flex items-center justify-center cursor-not-allowed"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    {/* Delete Button */}
                    <button 
                      className="h-8 px-3 text-xs border border-red-200 bg-white hover:bg-red-50 text-red-600 rounded-md inline-flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={deleteLoading === wish.id}
                      onClick={() => handleDeleteWish(wish.id)}
                    >
                      {deleteLoading === wish.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
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
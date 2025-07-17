import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  MapPin, 
  Shield, 
  LogOut, 
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if no token
      window.location.href = '/login';
      return;
    }
    
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Debug
      console.log('API URL:', `${process.env.REACT_APP_API_URL}/auth/profile`); // Debug
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Response status:', response.status); // Debug
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json(); // Read body once as JSON
      console.log('Response body:', data); // Debug JSON data
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Unable to fetch user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 text-lg">Loading your profile...</p>
      </div>
    </div>
  );

  const ErrorMessage = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={fetchProfile}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">PakPorter</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {profile?.fullName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center">
              <div className="bg-white rounded-full p-3 mr-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">User Profile</h2>
                <p className="text-blue-100">Manage your account information</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="text-lg font-medium text-gray-900">{profile?.fullName}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-lg font-medium text-gray-900">{profile?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="text-lg font-medium text-gray-900">{profile?.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <CreditCard className="w-5 h-5 text-gray-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">CNIC Number</p>
                      <p className="text-lg font-medium text-gray-900">{profile?.cnicNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="text-lg font-medium text-gray-900">{profile?.city}, {profile?.country}</p>
                    </div>
                  </div>

                  {/* Verification Status */}
                  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <Shield className="w-5 h-5 text-gray-600 mr-3" />
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <p className="text-sm text-gray-600">Verification Status</p>
                        <div className="flex items-center mt-1">
                          {profile?.isVerified ? (
                            <>
                              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                Verified
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5 text-red-500 mr-2" />
                              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                                Not Verified
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CNIC Images */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">CNIC Documents</h3>
                
                <div className="space-y-6">
                  {/* Front Image */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-700 mb-3">CNIC Front Image</h4>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
                      
                      
                      {profile.cnicFront && (
                        <img
                          src={profile.cnicFront}
                          alt="CNIC Front"
                          className="w-full h-48 object-cover rounded-lg shadow-md"
                          title="CNIC Front"
                        />
                      )}
                    </div>
                  </div>

                  {/* Back Image */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-700 mb-3">CNIC Back Image</h4>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
                      {profile.cnicBack && (
                        <img
                          src={profile.cnicBack}
                          alt="CNIC Back"
                          className="cnic-image"
                          title="CNIC Back"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex justify-center">
                <button
                  onClick={handleLogout}
                  className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
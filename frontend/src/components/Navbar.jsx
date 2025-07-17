import React from 'react';
import { Truck, LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('tokenTimestamp');
      alert('Logged out successfully!');
      navigate('/login', { replace: true }); // Use replace to prevent back navigation
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              PakPorter
            </span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">Services</Link>
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">Tracking</Link>
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">About</Link>
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">Contact</Link>
            {isLoggedIn && (
              <button
                onClick={() => navigate('/user/profile')}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Profile
              </button>
            )}
          </nav>
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/user/profile')}
                className="md:hidden text-gray-700 hover:text-blue-600 transition-colors"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, LogOut, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('authToken');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenTimestamp');
    alert('Logged out successfully!');
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'Browse Wishes', path: '/wishes' },
    { name: 'Become a Traveller', path: '/wishes' }
  ];

  const handleNavClick = (path) => {
    setMobileMenuOpen(false);
    if (path.startsWith('/#')) {
      if (location.pathname === '/') {
        const id = path.substring(2);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate(path);
      }
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
            ? 'neo-flat backdrop-blur-md bg-opacity-80 py-3 mx-0 rounded-none shadow-md'
            : 'bg-transparent py-5'
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <span className="text-2xl font-extrabold tracking-tight">
              <span className="text-brandPrimary">Pak</span>
              <span className="text-textPrimary">Porter</span>
            </span>
          </div>

          {/* Navigation Links - Center */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.path ||
                (link.path.startsWith('/#') && location.pathname === '/' && location.hash === link.path.substring(1));
              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.path)}
                  className="relative px-1 py-2 text-sm font-semibold text-textSecondary hover:text-brandPrimary transition-colors duration-200"
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brandPrimary to-brandAccent"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle Icon in Navbar */}
            <motion.button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl neo-flat text-textPrimary hover:text-brandPrimary cursor-pointer focus:outline-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5 text-brandAccent" />
              )}
            </motion.button>

            {isLoggedIn ? (
              <>
                <motion.button
                  onClick={() => navigate('/dashboard')}
                  className="p-2.5 rounded-xl neo-flat text-textPrimary hover:text-brandPrimary flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User className="w-5 h-5 text-brandPrimary" />
                  <span className="text-sm font-semibold">Dashboard</span>
                </motion.button>
                <motion.button
                  onClick={() => navigate('/user/profile')}
                  className="p-2.5 rounded-xl neo-flat text-textPrimary hover:text-brandPrimary flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <User className="w-5 h-5 text-brandPrimary" />
                  <span className="text-sm font-semibold">Profile</span>
                </motion.button>
                <motion.button
                  onClick={handleLogout}
                  className="px-5 py-2.5 rounded-xl neo-button-outline text-sm font-bold flex items-center space-x-2"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                <motion.button
                  onClick={() => navigate('/login')}
                  className="px-5 py-2.5 rounded-xl neo-button-outline text-sm font-bold"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Login
                </motion.button>
                <motion.button
                  onClick={() => navigate('/signup')}
                  className="px-5 py-2.5 neo-button-brand text-sm font-bold"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Sign Up
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-3">
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-xl neo-flat text-textPrimary hover:text-brandPrimary cursor-pointer focus:outline-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5 text-brandAccent" />
              )}
            </motion.button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 neo-flat text-textPrimary"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden absolute top-full left-0 w-full neo-flat rounded-none shadow-xl border-t border-gray-100 dark:border-gray-800 py-6 px-6 space-y-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.path)}
                    className="w-full text-left py-2 text-base font-semibold text-textSecondary hover:text-brandPrimary transition-colors"
                  >
                    {link.name}
                  </button>
                ))}
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />

              <div className="flex flex-col space-y-3">
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate('/user/profile');
                      }}
                      className="w-full py-3 neo-flat text-center font-bold text-textPrimary flex items-center justify-center space-x-2"
                    >
                      <User className="w-5 h-5 text-brandPrimary" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full py-3 neo-button-outline text-center font-bold flex items-center justify-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate('/login');
                      }}
                      className="w-full py-3 neo-button-outline text-center font-bold"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate('/signup');
                      }}
                      className="w-full py-3 neo-button-brand text-center font-bold"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;

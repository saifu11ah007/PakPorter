import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Star, ArrowRight, ShoppingBag, ChevronRight, Gift, User, Plane } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Wishlist');
  const [expandedCategoryId, setExpandedCategoryId] = useState(null);

  const [userProfile, setUserProfile] = useState(null);
  const [wishes, setWishes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfileData = async () => {
      try {
        const profileRes = await fetch(`${API_BASE}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setUserProfile(profileData);
        }

        const wishesRes = await fetch(`${API_BASE}/wish/wishes/my-wishes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (wishesRes.ok) {
          const wishesData = await wishesRes.json();
          setWishes(wishesData);
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const activeCount = wishes.filter(w => !w.isFulfilled).length;
  const fulfilledCount = wishes.filter(w => w.isFulfilled).length;

  const stats = [
    { label: "Wishes Posted", value: wishes.length },
    { label: "Wishes Fulfilled", value: fulfilledCount },
    { label: "Followers", value: 14 },
    { label: "Following", value: 8 }
  ];

  // Map user wishes to wishlist Categories dynamically
  const wishlistCategories = [
    {
      id: 1,
      name: "My Active Wishes",
      count: activeCount,
      items: wishes.filter(w => !w.isFulfilled).map(w => w.title)
    },
    {
      id: 2,
      name: "Fulfilled Wishes",
      count: fulfilledCount,
      items: wishes.filter(w => w.isFulfilled).map(w => w.title)
    }
  ];

  const reviews = [
    { id: 1, stars: 5, quote: "Excellent wisher. Fast payment through Escrow escrow verification.", author: "Traveller Sarah", date: "June 20, 2026" }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col pt-20">
      <Navbar />

      <div className="flex-1 max-w-[800px] mx-auto px-6 py-12 w-full space-y-10">
        
        {/* Top Profile Summary Card */}
        <div className="neo-flat p-8 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brandPrimary/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative inline-block">
            {/* Avatar with Neumorphic border and checkmark verified overlay */}
            <div className="w-28 h-28 rounded-full neo-flat border-4 border-brandPrimary flex items-center justify-center bg-cardBase text-textSecondary mx-auto">
              <User className="w-12 h-12" />
            </div>
            {userProfile?.isVerified && (
              <div className="absolute bottom-1 right-2 bg-success text-white p-1 rounded-full border-2 border-surface">
                <CheckCircle className="w-5 h-5 fill-success" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-textPrimary tracking-tight">
              {userProfile?.fullName || 'Loading...'}
            </h2>
            <div className="flex items-center justify-center space-x-2 text-xs font-bold text-textSecondary uppercase tracking-wider">
              <span>{userProfile?.city || 'Lahore'}, {userProfile?.country || 'Pakistan'}</span>
              <span>•</span>
              <span>Member since {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Jan 2026'}</span>
            </div>
          </div>

          {/* Animated rating stars */}
          <div className="flex justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <motion.div 
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              >
                <Star className="w-5 h-5 text-warning fill-warning" />
              </motion.div>
            ))}
          </div>

          {/* Stats Row pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="neo-pressed py-3.5 px-4 text-center rounded-2xl">
                <span className="text-lg font-extrabold text-brandPrimary block">{stat.value}</span>
                <span className="text-[10px] font-bold text-textSecondary uppercase tracking-wider mt-0.5 block">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Become a Traveller Section */}
        <div className="neo-flat p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-40 h-40 bg-brandAccent/5 rounded-full blur-3xl pointer-events-none" />
          {userProfile?.isVerifiedTraveller ? (
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl neo-pressed flex items-center justify-center text-success">
                <Plane className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-extrabold text-textPrimary">Verified Traveller</h3>
                  <CheckCircle className="w-5 h-5 text-success fill-success" />
                </div>
                <p className="text-xs font-semibold text-textSecondary mt-1">
                  You can browse and bid on product wishes from other users.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl neo-pressed flex items-center justify-center text-brandPrimary">
                  <Plane className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-textPrimary">Become a Traveller</h3>
                  <p className="text-xs font-semibold text-textSecondary mt-1 max-w-sm">
                    Unlock the ability to browse wishes and earn by delivering products for others.
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('authToken');
                    const res = await fetch(`${API_BASE}/auth/become-traveller`, {
                      method: 'PUT',
                      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                    });
                    if (res.ok) {
                      const data = await res.json();
                      setUserProfile(data.user);
                    } else {
                      const err = await res.json();
                      alert(err.message || 'Failed to become traveller');
                    }
                  } catch (err) {
                    console.error('Error becoming traveller:', err);
                    alert('Something went wrong');
                  }
                }}
                className="px-8 py-3.5 neo-button-brand font-bold text-sm flex items-center space-x-2 whitespace-nowrap"
              >
                <Plane className="w-4 h-4" />
                <span>Become a Traveller</span>
              </motion.button>
            </div>
          )}
        </div>

        {/* Dynamic tabs row */}
        <div className="flex justify-center space-x-4 border-b border-cardBase pb-1">
          {['Wishlist', 'Reviews', 'Gifts Sent'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative px-6 py-3.5 text-sm font-bold text-textSecondary hover:text-brandPrimary"
              >
                <span className="relative z-10">{tab}</span>
                {isActive && (
                  <motion.div
                    layoutId="profileTabLine"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brandPrimary to-brandAccent z-0"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab contents details */}
        <AnimatePresence mode="wait">
          {activeTab === 'Wishlist' && (
            <motion.div
              key="wishlist"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {wishlistCategories.map((cat) => {
                const isExpanded = expandedCategoryId === cat.id;
                return (
                  <div key={cat.id} className="neo-flat p-6 transition-all duration-300">
                    <div 
                      onClick={() => setExpandedCategoryId(isExpanded ? null : cat.id)}
                      className="flex justify-between items-center cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl neo-pressed flex items-center justify-center text-brandPrimary text-lg">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-textPrimary text-base">{cat.name}</h4>
                          <span className="text-[10px] font-bold text-textSecondary uppercase tracking-wider mt-0.5 block">{cat.count} items in list</span>
                        </div>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-textSecondary transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mt-6 border-t border-cardBase pt-6 space-y-3"
                        >
                          {cat.items.map((item, index) => (
                            <div key={index} className="neo-pressed p-3 flex items-center justify-between text-xs font-bold text-textPrimary">
                              <span>{item}</span>
                              <ArrowRight className="w-4 h-4 text-brandPrimary" />
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'Reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {reviews.map((rev) => (
                <div key={rev.id} className="neo-flat p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex space-x-1">
                      {[...Array(rev.stars)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-warning fill-warning" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">{rev.date}</span>
                  </div>
                  
                  <p className="text-sm font-medium text-textPrimary leading-relaxed">
                    "{rev.quote}"
                  </p>

                  <h5 className="text-xs font-extrabold text-brandPrimary uppercase tracking-wider">— {rev.author}</h5>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'Gifts Sent' && (
            <motion.div
              key="gifts"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="neo-pressed p-12 text-center rounded-[32px] space-y-4 text-textSecondary"
            >
              <Gift className="w-12 h-12 mx-auto text-brandPrimary animate-bounce" />
              <p className="text-xs font-bold uppercase tracking-wider">No gifts sent yet. Start sending deals to friends!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;

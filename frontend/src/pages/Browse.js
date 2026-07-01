import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Sliders, ShoppingBag, Package, Plane, Lock, Eye } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Browse = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxBudget, setMaxBudget] = useState(600000);
  const [sortBy, setSortBy] = useState('Newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [wishes, setWishes] = useState([]);
  const [isTraveller, setIsTraveller] = useState(null); // null = loading, true/false = checked
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Check if user is a verified traveller
    const checkTraveller = async () => {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (!token) {
        setIsTraveller(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/auth/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const profile = await res.json();
          setCurrentUserId(profile._id);
          setIsTraveller(profile.isVerifiedTraveller === true);
        } else {
          setIsTraveller(false);
        }
      } catch {
        setIsTraveller(false);
      }
    };
    checkTraveller();
  }, []);

  useEffect(() => {
    if (isTraveller !== true) return;
    const fetchWishes = async () => {
      try {
        const response = await fetch(`${API_BASE}/wish`);
        const data = await response.json();
        setWishes(data);
      } catch (err) {
        console.error('Error fetching wishes:', err);
      }
    };
    fetchWishes();
  }, [isTraveller]);

  // If still checking, show loading
  if (isTraveller === null) {
    return (
      <div className="min-h-screen bg-background flex flex-col pt-20">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full neo-pressed flex items-center justify-center mx-auto animate-pulse">
              <Plane className="w-6 h-6 text-brandPrimary" />
            </div>
            <p className="text-sm font-bold text-textSecondary">Checking traveller status...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // If not a verified traveller, show gate
  if (!isTraveller) {
    return (
      <div className="min-h-screen bg-background flex flex-col pt-20">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md neo-flat p-10 text-center space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brandPrimary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="w-20 h-20 rounded-full neo-pressed flex items-center justify-center mx-auto text-brandPrimary">
              <Lock className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-textPrimary tracking-tight">Travellers Only</h2>
              <p className="text-sm font-semibold text-textSecondary leading-relaxed">
                You need to be a verified traveller to browse and bid on product wishes. Head to your profile to get verified.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/profile')}
              className="w-full py-4 neo-button-brand font-bold text-base flex items-center justify-center space-x-2"
            >
              <Plane className="w-5 h-5" />
              <span>Go to Profile</span>
            </motion.button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const countries = ['UAE', 'USA', 'UK', 'Germany', 'Saudi Arabia'];
  
  const categoryFilters = [
    { label: 'All' },
    { label: 'Electronics' },
    { label: 'Fashion' },
    { label: 'Beauty' },
    { label: 'Books' }
  ];

  const handleCountryToggle = (country) => {
    setSelectedCountries(prev => 
      prev.includes(country) 
        ? prev.filter(c => c !== country) 
        : [...prev, country]
    );
  };

  // Stagger variants for the wishes grid
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  // Reactive filtering logic
  const filteredWishes = wishes.filter(wish => {
    const matchesSearch = wish.title.toLowerCase().includes(searchQuery.toLowerCase());
    const countryName = wish.location?.country || '';
    const matchesCountry = selectedCountries.length === 0 || selectedCountries.some(c => c.toLowerCase() === countryName.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || wish.title.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesBudget = wish.basePrice <= maxBudget;
    return matchesSearch && matchesCountry && matchesCategory && matchesBudget;
  }).sort((a, b) => {
    if (sortBy === 'Newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'Budget High-Low') return b.basePrice - a.basePrice;
    return 0;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col pt-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10 w-full flex-1">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Desktop Filter Panel Left Side */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="neo-flat p-6 space-y-8 sticky top-28">
              <div className="flex items-center space-x-2 pb-2 border-b border-cardBase">
                <Sliders className="w-5 h-5 text-brandPrimary" />
                <h3 className="font-extrabold text-base text-textPrimary uppercase tracking-wider">Filters</h3>
              </div>

              {/* Search Bar */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Search</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-textSecondary" />
                  <input 
                    type="text" 
                    placeholder="Search wishes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 neo-input text-sm"
                  />
                </div>
              </div>

              {/* Category selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-textSecondary uppercase tracking-wider block">Category</label>
                <div className="flex flex-col space-y-2">
                  {categoryFilters.map((cat) => {
                    const isSel = selectedCategory === cat.label;
                    return (
                      <button
                        key={cat.label}
                        onClick={() => setSelectedCategory(cat.label)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-xs font-bold rounded-xl transition-all duration-300 ${
                          isSel ? 'neo-pressed text-brandPrimary' : 'neo-flat text-textSecondary hover:-translate-y-0.5'
                        }`}
                      >
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Country Select Pills */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-textSecondary uppercase tracking-wider block">Country From</label>
                <div className="flex flex-wrap gap-2">
                  {countries.map((c) => {
                    const isSelected = selectedCountries.includes(c);
                    return (
                      <button
                        key={c}
                        onClick={() => handleCountryToggle(c)}
                        className={`px-3 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                          isSelected ? 'neo-pressed text-brandPrimary' : 'neo-flat text-textSecondary'
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Budget slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-textSecondary uppercase tracking-wider">
                  <span>Max Budget</span>
                  <span className="text-brandPrimary">PKR {maxBudget.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min={5000} 
                  max={600000} 
                  step={5000}
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full accent-brandPrimary cursor-pointer py-2"
                />
              </div>

              {/* Sort by dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-textSecondary uppercase tracking-wider block">Sort By</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 neo-input text-xs font-bold appearance-none"
                >
                  <option value="Newest">Newest Posted</option>
                  <option value="Budget High-Low">Budget High-Low</option>
                  <option value="Most Offers">Most Offers</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Collapsible Mobile Filter Drawer trigger */}
          <div className="lg:hidden w-full flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
              <input 
                type="text" 
                placeholder="Search wishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 neo-input"
              />
            </div>
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="p-3.5 rounded-xl neo-flat text-brandPrimary flex items-center justify-center"
              aria-label="Filter settings"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Filter Slide-up bottom sheet */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div 
                className="lg:hidden fixed inset-0 z-50 bg-black/50 flex items-end justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="w-full max-h-[85vh] overflow-y-auto neo-flat rounded-t-[32px] rounded-b-none p-6 space-y-6"
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  exit={{ y: 100 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 260 }}
                >
                  <div className="flex justify-between items-center pb-2 border-b border-cardBase">
                    <h3 className="font-extrabold text-base text-textPrimary uppercase tracking-wider">Filters</h3>
                    <button onClick={() => setShowMobileFilters(false)} className="text-xs font-extrabold text-brandPrimary uppercase tracking-wider">Close</button>
                  </div>
                  {/* Category toggle pills */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-textSecondary uppercase tracking-wider block">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {categoryFilters.map((cat) => {
                        const isSel = selectedCategory === cat.label;
                        return (
                          <button
                            key={cat.label}
                            onClick={() => setSelectedCategory(cat.label)}
                            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
                              isSel ? 'neo-pressed text-brandPrimary' : 'neo-flat text-textSecondary'
                            }`}
                          >
                            <span>{cat.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Country toggle pills */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-textSecondary uppercase tracking-wider block">Country From</label>
                    <div className="flex flex-wrap gap-2">
                      {countries.map((c) => {
                        const isSelected = selectedCountries.includes(c);
                        return (
                          <button
                            key={c}
                            onClick={() => handleCountryToggle(c)}
                            className={`px-3 py-2.5 text-xs font-bold rounded-xl transition-all ${
                              isSelected ? 'neo-pressed text-brandPrimary' : 'neo-flat text-textSecondary'
                            }`}
                          >
                            {c}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-textSecondary">
                      <span>Max Budget</span>
                      <span className="text-brandPrimary">PKR {maxBudget.toLocaleString()}</span>
                    </div>
                    <input 
                      type="range" 
                      min={5000} 
                      max={600000} 
                      step={5000}
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(Number(e.target.value))}
                      className="w-full accent-brandPrimary cursor-pointer"
                    />
                  </div>

                  {/* Sort */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-textSecondary uppercase tracking-wider block">Sort By</label>
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-3.5 neo-input"
                    >
                      <option value="Newest">Newest Posted</option>
                      <option value="Budget High-Low">Budget High-Low</option>
                      <option value="Most Offers">Most Offers</option>
                    </select>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right Wishes Grid */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-textPrimary tracking-tight">Active Delivery Requests</h2>
              <span className="text-xs font-bold text-textSecondary uppercase tracking-wider">{filteredWishes.length} wishes found</span>
            </div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {filteredWishes.length > 0 ? (
                filteredWishes.map((wish) => (
                  <motion.div
                    key={wish._id}
                    variants={itemVariants}
                    className="neo-flat overflow-hidden flex flex-col group relative"
                    whileHover={{ y: -6, boxShadow: "var(--neo-shadow-flat-hover)" }}
                  >
                    {/* Top half image/emoji placeholder representation */}
                    <div className="h-44 neo-pressed m-3 rounded-2xl flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-brandPrimary/5 to-brandAccent/10">
                      {wish.images && wish.images.length > 0 ? (
                        <img src={wish.images[0]} alt={wish.title} className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        <Package className="w-12 h-12 text-brandPrimary" />
                      )}
                      <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide rounded-full text-brandPrimary bg-brandPrimary/10">
                        {wish.title.toLowerCase().includes('phone') || wish.title.toLowerCase().includes('macbook') ? 'Electronics' : 'General'}
                      </span>
                    </div>

                    {/* Bottom half info details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-bold text-textPrimary text-base line-clamp-1">{wish.title}</h4>
                        <div className="flex items-center space-x-2 text-xs font-bold text-textSecondary">
                          <span>from {wish.location?.country || 'Unknown'}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-[10px] font-bold text-textSecondary uppercase tracking-wider block">Estimated Reward</span>
                          <span className="text-base font-extrabold text-brandPrimary">PKR {wish.basePrice.toLocaleString()}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-textSecondary uppercase tracking-wider block">Status</span>
                          <span className="text-xs font-extrabold text-textPrimary">{wish.isFulfilled ? 'Fulfilled' : 'Pending'}</span>
                        </div>
                      </div>

                      {/* Make an offer / View bids button */}
                      {currentUserId && wish.createdBy && 
                       (typeof wish.createdBy === 'object' ? wish.createdBy._id : wish.createdBy) === currentUserId ? (
                        <button
                          onClick={() => navigate(`/wish/${wish._id}`)}
                          className="w-full py-3 neo-flat font-bold text-xs transform group-hover:scale-102 transition-transform flex items-center justify-center space-x-2 text-brandPrimary"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Bids</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate(`/bid/${wish._id}`)}
                          className="w-full py-3 neo-button-brand font-bold text-xs transform group-hover:scale-102 transition-transform"
                        >
                          Make an Offer
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full neo-pressed p-16 text-center rounded-[32px] space-y-4">
                  <div className="w-16 h-16 rounded-2xl neo-flat flex items-center justify-center mx-auto text-brandPrimary">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-textPrimary">No matching wishes found</h4>
                  <p className="text-xs text-textSecondary font-semibold max-w-xs mx-auto">Try clearing selected filter parameters or search tags.</p>
                </div>
              )}
            </motion.div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Browse;

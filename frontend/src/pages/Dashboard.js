import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Home, ShoppingBag, Map, MessageSquare, CreditCard, User, CheckCircle, Package, Plus, Clock, ChevronRight, LogOut } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Helper component for animating dashboard numbers
const DashboardCounter = ({ value, prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = value;
      const duration = 1000; // 1s
      const incrementTime = 25;
      const step = (end / (duration / incrementTime));

      const timer = setInterval(() => {
        start += step;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return (
    <span ref={ref}>
      {prefix}
      {Math.round(count).toLocaleString()}
      {suffix}
    </span>
  );
};

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [activeSidebarTab, setActiveSidebarTab] = useState('Home');

  const [userProfile, setUserProfile] = useState(null);
  const [wishes, setWishes] = useState([]);
  const [activities, setActivities] = useState([]);



  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch User Profile
        const profileRes = await fetch(`${API_BASE}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setUserProfile(profileData);
        }

        // Fetch User's wishes
        const wishesRes = await fetch(`${API_BASE}/wish/wishes/my-wishes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (wishesRes.ok) {
          const wishesData = await wishesRes.json();
          setWishes(wishesData);
        }

        // Mock activities based on real wishes or default entries
        setActivities([
          { id: 1, type: "system", desc: "Welcome to PakPorter! Complete CNIC validation to start matching.", time: "Joined recently" }
        ]);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenTimestamp');
    navigate('/login');
  };

  const activeWishesCount = wishes.filter(w => !w.isFulfilled).length;
  const deliveredWishesCount = wishes.filter(w => w.isFulfilled).length;
  const totalSpent = wishes.filter(w => w.isFulfilled).reduce((acc, w) => acc + w.basePrice, 0);
  const pendingOffersCount = wishes.reduce((acc, w) => acc + (w.acceptedBid ? 1 : 0), 0);

  const kpis = [
    { label: "Active Wishes", value: activeWishesCount, icon: <ShoppingBag className="w-6 h-6 text-brandPrimary" /> },
    { label: "Pending Offers", value: pendingOffersCount, icon: <MessageSquare className="w-6 h-6 text-brandAccent" /> },
    { label: "Delivered Items", value: deliveredWishesCount, icon: <Package className="w-6 h-6 text-success" /> },
    { label: "Total Spent", value: totalSpent, prefix: "PKR ", icon: <CreditCard className="w-6 h-6 text-warning" /> }
  ];

  const statusTabs = ['All', 'Requested', 'Delivered'];

  const filteredWishes = wishes.filter(wish => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Requested') return !wish.isFulfilled;
    if (activeTab === 'Delivered') return wish.isFulfilled;
    return true;
  });



  const sidebarItems = [
    { name: 'Home', icon: <Home className="w-5 h-5" />, path: '/dashboard' },
    { name: 'My Wishes', icon: <ShoppingBag className="w-5 h-5" />, path: '/wishes' },
    { name: 'My Trips', icon: <Map className="w-5 h-5" />, path: '/trips' },
    { name: 'Profile', icon: <User className="w-5 h-5" />, path: '/profile' }
  ];

  return (
    <div className="min-h-screen bg-background text-textPrimary pt-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="neo-flat p-6 space-y-8 sticky top-28">
              {/* User Avatar Section */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full neo-flat border-2 border-brandPrimary overflow-hidden flex items-center justify-center bg-cardBase text-textSecondary">
                    <User className="w-6 h-6" />
                  </div>
                  {userProfile?.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-success text-white p-0.5 rounded-full border border-surface">
                      <CheckCircle className="w-4 h-4 fill-success" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-textPrimary leading-tight truncate max-w-[120px]">
                    {userProfile?.fullName || 'Loading...'}
                  </h3>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${userProfile?.isVerified ? 'text-success' : 'text-error'}`}>
                    {userProfile?.isVerified ? 'CNIC Verified' : 'Unverified'}
                  </span>
                </div>
              </div>

              {/* Navigation list */}
              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const isActive = activeSidebarTab === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setActiveSidebarTab(item.name);
                        if (item.path !== '/dashboard') navigate(item.path);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                        isActive
                          ? 'bg-brandPrimary text-white shadow-[inset_4px_4px_8px_rgba(0,0,0,0.2)]'
                          : 'text-textSecondary hover:text-brandPrimary hover:-translate-y-0.5'
                      }`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </button>
                  );
                })}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-semibold rounded-xl text-error hover:bg-error/5 hover:-translate-y-0.5 transition-all mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Dashboard Content */}
          <main className="flex-1 space-y-10 min-w-0">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-textPrimary tracking-tight">Wisher Dashboard</h1>
                <p className="text-sm font-semibold text-textSecondary mt-1">Manage your custom international orders.</p>
              </div>
              <button 
                onClick={() => navigate('/post-wish')}
                className="p-3 neo-button-brand rounded-full flex items-center justify-center"
                aria-label="Post a new wish"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpis.map((kpi, index) => (
                <div key={index} className="neo-flat p-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-textSecondary uppercase tracking-wider">{kpi.label}</span>
                    <div className="text-2xl font-extrabold text-textPrimary">
                      <DashboardCounter value={kpi.value} prefix={kpi.prefix} />
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl neo-pressed flex items-center justify-center">
                    {kpi.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* Two Column Grid for Wishes lists and activity feeds */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
              
              {/* Left Column: Wishes Tab Lists (2 cols on xl) */}
              <div className="xl:col-span-2 space-y-6">
                <div className="neo-flat p-6 space-y-6">
                  <h3 className="text-xl font-bold text-textPrimary">My Product Wishes</h3>

                  {/* Horizontal Status tabs */}
                  <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin">
                    {statusTabs.map((tab) => {
                      const isActive = activeTab === tab;
                      return (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className="relative px-4 py-2 text-xs font-bold text-textSecondary hover:text-brandPrimary rounded-lg whitespace-nowrap"
                        >
                          <span className="relative z-10">{tab}</span>
                          {isActive && (
                            <motion.div
                              layoutId="dashboardTabIndicator"
                              className="absolute inset-0 bg-brandPrimary/10 border-b-2 border-brandPrimary rounded-lg z-0"
                              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Wish items List */}
                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {filteredWishes.length > 0 ? (
                        filteredWishes.map((wish) => (
                          <motion.div
                            key={wish._id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="neo-flat p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-14 h-14 rounded-2xl neo-pressed flex items-center justify-center flex-shrink-0">
                                {wish.images && wish.images.length > 0 ? (
                                  <img src={wish.images[0]} alt={wish.title} className="w-full h-full object-cover rounded-2xl" />
                                ) : (
                                  <Package className="w-6 h-6 text-brandPrimary" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-bold text-textPrimary">{wish.title}</h4>
                                <div className="flex items-center space-x-2 text-xs font-bold text-textSecondary mt-0.5">
                                  <span>{wish.location?.country || 'Unknown'}</span>
                                  <span>•</span>
                                  <span>Posted {new Date(wish.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                              <div className="flex flex-col items-start md:items-end">
                                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${wish.isFulfilled ? 'text-success bg-success/10' : 'text-brandPrimary bg-brandPrimary/10'}`}>
                                  {wish.isFulfilled ? 'Delivered' : 'Requested'}
                                </span>
                                <span className="text-xs font-bold text-textSecondary mt-1">
                                  {wish.acceptedBid ? '1' : '0'} Offers
                                </span>
                              </div>
                              
                              <button 
                                onClick={() => navigate(`/wish/${wish._id}`)}
                                className="p-2.5 rounded-xl neo-flat text-textSecondary hover:text-brandPrimary hover:scale-105 transition-all flex items-center justify-center"
                              >
                                <ChevronRight className="w-5 h-5" />
                              </button>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="neo-pressed p-10 text-center rounded-2xl space-y-4">
                          <p className="text-sm font-semibold text-textSecondary">No wishes found in this status category.</p>
                          <button 
                            onClick={() => navigate('/post-wish')}
                            className="px-5 py-2.5 neo-button-brand text-xs font-bold"
                          >
                            Post Your First Wish
                          </button>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Right Column: Recent Activity Feed */}
              <div className="space-y-6">
                <div className="neo-flat p-6 space-y-6">
                  <h3 className="text-xl font-bold text-textPrimary">Recent Activity</h3>
                  
                  <div className="relative border-l border-cardBase ml-3 pl-6 space-y-8 py-2">
                    {activities.map((act) => (
                      <div key={act.id} className="relative">
                        {/* Timeline dot */}
                        <div className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full bg-background border-2 border-brandPrimary flex items-center justify-center z-10">
                          <div className="w-1.5 h-1.5 rounded-full bg-brandPrimary" />
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-textPrimary leading-relaxed">
                            {act.desc}
                          </p>
                          <span className="text-[10px] font-bold text-textSecondary uppercase tracking-wider flex items-center space-x-1">
                            <Clock className="w-3 h-3 mr-0.5" />
                            <span>{act.time}</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </main>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;

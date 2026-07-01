import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ShoppingBag, Map, MessageSquare, CreditCard, User, Settings, Calendar, ArrowRight, CheckCircle, Navigation, ChevronDown, ChevronUp, LogOut, Package } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Trips = () => {
  const navigate = useNavigate();
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [fromLocation, setFromLocation] = useState('Dubai, UAE');
  const [toLocation, setToLocation] = useState('Lahore, Pakistan');
  const [selectedDate, setSelectedDate] = useState('2026-07-15');
  const [expandedTripId, setExpandedTripId] = useState(null);
  const [activeTripTab, setActiveTripTab] = useState('Wishes');
  const [activeSidebarTab, setActiveSidebarTab] = useState('My Trips');

  const [trips, setTrips] = useState([
    { id: 1, from: "New York, USA", to: "Karachi, Pakistan", date: "July 12, 2026", type: "One-Way", status: "Active", matchedCount: 4 },
    { id: 2, from: "London, UK", to: "Lahore, Pakistan", date: "August 02, 2026", type: "Round-Trip", status: "Active", matchedCount: 2 }
  ]);

  const matchedWishes = [
    { id: 101, name: "iPhone 15 Pro (256GB)", from: "USA", budget: 345000, reward: 25000 },
    { id: 102, name: "Sony WH-1000XM5", from: "USA", budget: 110000, reward: 8500 }
  ];

  const handlePostTrip = (e) => {
    e.preventDefault();
    const newId = trips.length + 1;
    const added = {
      id: newId,
      from: fromLocation,
      to: toLocation,
      date: new Date(selectedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' }),
      type: isRoundTrip ? 'Round-Trip' : 'One-Way',
      status: 'Active',
      matchedCount: 3
    };
    setTrips(prev => [added, ...prev]);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenTimestamp');
    navigate('/login');
  };

  const toggleTripExpand = (id) => {
    setExpandedTripId(prev => (prev === id ? null : id));
  };

  const sidebarItems = [
    { name: 'Home', icon: <Home className="w-5 h-5" />, path: '/dashboard' },
    { name: 'My Wishes', icon: <ShoppingBag className="w-5 h-5" />, path: '/my-wishes' },
    { name: 'My Trips', icon: <Map className="w-5 h-5" />, path: '/trips' },
    { name: 'Messages', icon: <MessageSquare className="w-5 h-5" />, path: '/dashboard' },
    { name: 'Transactions', icon: <CreditCard className="w-5 h-5" />, path: '/dashboard' },
    { name: 'Profile', icon: <User className="w-5 h-5" />, path: '/profile' },
    { name: 'Settings', icon: <Settings className="w-5 h-5" />, path: '/profile' }
  ];

  return (
    <div className="min-h-screen bg-background text-textPrimary pt-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="neo-flat p-6 space-y-8 sticky top-28">
              {/* User Avatar */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full neo-flat border-2 border-brandPrimary overflow-hidden flex items-center justify-center bg-cardBase text-xl font-bold">
                    🇵🇰
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-success text-white p-0.5 rounded-full border border-surface">
                    <CheckCircle className="w-4 h-4 fill-success" />
                  </div>
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-textPrimary leading-tight">Kamran Khan</h3>
                  <span className="text-[10px] font-bold text-success uppercase tracking-wider">CNIC Verified</span>
                </div>
              </div>

              {/* Navigation links */}
              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const isActive = activeSidebarTab === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        setActiveSidebarTab(item.name);
                        if (item.path !== '/trips') navigate(item.path);
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

          {/* Main Content Area */}
          <main className="flex-1 space-y-10 min-w-0">
            {/* Header */}
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-textPrimary tracking-tight">Traveller Trip Planner</h1>
              <p className="text-sm font-semibold text-textSecondary mt-1">Register a flight route to see matching wishes.</p>
            </div>

            {/* Post a Trip Section Card */}
            <div className="neo-flat p-6 md:p-8 space-y-6">
              <h3 className="text-xl font-bold text-textPrimary flex items-center space-x-2">
                <Navigation className="w-5 h-5 text-brandPrimary" />
                <span>Plan a New Trip</span>
              </h3>

              <form onSubmit={handlePostTrip} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Trip Type Toggle switch */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-textSecondary uppercase tracking-wider block">Trip Type</label>
                    <div className="flex neo-flat p-1 max-w-[240px]">
                      <button
                        type="button"
                        onClick={() => setIsRoundTrip(false)}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                          !isRoundTrip ? 'neo-pressed text-brandPrimary' : 'text-textSecondary'
                        }`}
                      >
                        One-Way
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsRoundTrip(true)}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                          isRoundTrip ? 'neo-pressed text-brandPrimary' : 'text-textSecondary'
                        }`}
                      >
                        Round-Trip
                      </button>
                    </div>
                  </div>

                  {/* Date Picker input */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Departure Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
                      <input 
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 neo-input text-sm font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* From / To locations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">From Location</label>
                    <select
                      value={fromLocation}
                      onChange={(e) => setFromLocation(e.target.value)}
                      className="w-full px-4 py-3.5 neo-input"
                    >
                      <option value="Dubai, UAE">Dubai, UAE</option>
                      <option value="New York, USA">New York, USA</option>
                      <option value="London, UK">London, UK</option>
                      <option value="Berlin, Germany">Berlin, Germany</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">To Destination</label>
                    <select
                      value={toLocation}
                      onChange={(e) => setToLocation(e.target.value)}
                      className="w-full px-4 py-3.5 neo-input"
                    >
                      <option value="Lahore, Pakistan">Lahore, Pakistan</option>
                      <option value="Karachi, Pakistan">Karachi, Pakistan</option>
                      <option value="Islamabad, Pakistan">Islamabad, Pakistan</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="px-8 py-4 neo-button-brand font-bold text-base w-full md:w-auto"
                >
                  Register Trip
                </button>
              </form>
            </div>

            {/* My Trips List */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-textPrimary">Registered Trips</h3>

              <div className="space-y-4">
                {trips.map((trip) => {
                  const isExpanded = expandedTripId === trip.id;
                  return (
                    <div key={trip.id} className="neo-flat p-6 transition-all duration-300">
                      <div 
                        onClick={() => toggleTripExpand(trip.id)}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                      >
                        <div className="flex items-center space-x-6">
                          <div className="w-12 h-12 rounded-xl neo-pressed flex items-center justify-center text-brandPrimary">
                            <Map className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-3">
                              <span className="font-extrabold text-textPrimary text-base">{trip.from.split(',')[0]}</span>
                              <ArrowRight className="w-4 h-4 text-brandPrimary" />
                              <span className="font-extrabold text-textPrimary text-base">{trip.to.split(',')[0]}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs font-bold text-textSecondary mt-1">
                              <span>Date: {trip.date}</span>
                              <span>•</span>
                              <span>{trip.type}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-6">
                          <div className="flex flex-col items-start md:items-end">
                            <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full text-success bg-success/10">
                              {trip.status}
                            </span>
                            <span className="text-xs font-bold text-textSecondary mt-1">
                              {trip.matchedCount} Matched Wishes
                            </span>
                          </div>
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>

                      {/* Expandable Matched Wishes Area */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden mt-6 border-t border-cardBase pt-6 space-y-6"
                          >
                            {/* Expandable Tabs row */}
                            <div className="flex space-x-3">
                              {['Wishes', 'Offers', 'To Deliver', 'Delivered', 'Disputed'].map((t) => {
                                const isTabActive = activeTripTab === t;
                                return (
                                  <button
                                    key={t}
                                    onClick={() => setActiveTripTab(t)}
                                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                                      isTabActive ? 'neo-pressed text-brandPrimary' : 'neo-flat text-textSecondary'
                                    }`}
                                  >
                                    {t}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Conditional lists matching expanded tab */}
                            {activeTripTab === 'Wishes' ? (
                              <div className="space-y-4">
                                {matchedWishes.map((wish) => (
                                  <div key={wish.id} className="neo-pressed p-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-10 h-10 rounded-xl neo-flat flex items-center justify-center bg-brandPrimary/5 text-brandPrimary flex-shrink-0">
                                        <Package className="w-5 h-5" />
                                      </div>
                                      <div>
                                        <h5 className="font-bold text-xs text-textPrimary">{wish.name}</h5>
                                        <span className="text-[10px] font-bold text-textSecondary uppercase">from {wish.from}</span>
                                      </div>
                                    </div>
                                    <div className="text-right space-y-1">
                                      <span className="text-[10px] font-bold text-textSecondary uppercase block">Est. Reward</span>
                                      <span className="text-xs font-extrabold text-brandPrimary">PKR {wish.reward.toLocaleString()}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="neo-pressed p-8 text-center text-xs font-bold text-textSecondary">
                                No records found in this category tab.
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </main>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Trips;

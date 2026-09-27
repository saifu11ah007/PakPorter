import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import OrbitDeliveryHero from '../components/ui/orbit-delivery-hero';
import { useTheme } from '../context/ThemeContext';

// Helper component for animating stats counts
const StatCounter = ({ value, label, prefix = "", suffix = "", decimals = 0 }) => {
  const [count, setCount] = React.useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  React.useEffect(() => {
    if (inView) {
      let start = 0;
      const end = value;
      const duration = 1500;
      const incrementTime = 30;
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
    <div ref={ref} className="neo-flat px-6 py-4 flex items-center space-x-3">
      <span className="text-xl md:text-2xl font-extrabold text-brandPrimary">
        {prefix}
        {count.toFixed(decimals)}
        {suffix}
      </span>
      <span className="text-xs md:text-sm font-bold text-textSecondary uppercase tracking-wider">{label}</span>
    </div>
  );
};

// Animated Checkmark for For Wishers / For Travellers sections
const AnimatedCheck = () => (
  <svg className="w-5 h-5 text-brandPrimary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
    <motion.path
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const PakPorterHomepage = () => {
  const navigate = useNavigate();
  let theme = 'light';
  try {
    const themeContext = useTheme();
    if (themeContext?.theme) theme = themeContext.theme;
  } catch (e) {
    // Fallback if rendered outside ThemeProvider
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-background text-textPrimary overflow-x-hidden pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-12 lg:py-24 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Text & CTAs */}
            <motion.div
              className="space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="space-y-6">
                <motion.h1
                  className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-textPrimary tracking-tight"
                  variants={itemVariants}
                >
                  Your Wish.<br />
                  Their Journey.<br />
                  <span className="text-brandPrimary">
                    Delivered.
                  </span>
                </motion.h1>
                <motion.p
                  className="text-lg md:text-xl text-textSecondary max-w-xl font-medium leading-relaxed"
                  variants={itemVariants}
                >
                  Post what you want from anywhere in the world. A traveller heading that way will bring it home for you.
                </motion.p>
              </div>

              {/* CTAs */}
              <motion.div className="flex flex-wrap gap-5" variants={itemVariants}>
                <motion.button
                  onClick={() => navigate('/product/wish/post')}
                  className="px-8 py-4 neo-button-brand text-lg font-bold flex items-center space-x-2"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span>Post a Wish</span>
                </motion.button>
                <motion.button
                  onClick={() => navigate('/wishes')}
                  className="px-8 py-4 neo-button-outline text-lg font-bold"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Become a Traveller
                </motion.button>
              </motion.div>

              {/* Stats badges */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4"
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
                  <StatCounter prefix="" value={50} suffix="+" label="Countries" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <StatCounter prefix=" " value={1200} suffix="+" label="Wishes Met" />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <StatCounter prefix="" value={4.8} decimals={1} label="Rating" />
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Column: 3D Orbit & Runner Animation */}
            <motion.div
              className="relative flex items-center justify-center w-full min-h-[460px] lg:min-h-[540px]"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="relative w-full h-[460px] lg:h-[540px] flex items-center justify-center">
                <OrbitDeliveryHero theme={theme} onlyOrbit={true} />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-extrabold text-textPrimary tracking-tight">
              How PakPorter Works
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-brandPrimary to-brandAccent mx-auto mt-4 rounded-full" />
          </div>

          {/* Steps Grid with Connecting Dash Line */}
          <div className="relative">
            {/* Animated Dashed Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 hidden lg:block z-0 px-24">
              <svg viewBox="0 0 1000 10" className="w-full h-2">
                <motion.path
                  d="M 0 5 H 1000"
                  fill="none"
                  stroke="var(--brand-accent)"
                  strokeWidth="3"
                  strokeDasharray="10, 10"
                  animate={{ strokeDashoffset: [-20, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="opacity-50"
                />
              </svg>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
              {/* Step 1 */}
              <motion.div
                className="neo-flat p-8 flex flex-col items-center text-center space-y-6"
                whileHover={{ y: -4 }}
              >
                <div className="text-5xl font-black text-brandPrimary">01</div>
                <h3 className="text-xl font-bold text-textPrimary">Post Your Wish</h3>
                <p className="text-sm text-textSecondary leading-relaxed">
                  Describe what item you need, which international store or country it's from, and set your reward.
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                className="neo-flat p-8 flex flex-col items-center text-center space-y-6"
                whileHover={{ y: -4 }}
              >
                <div className="text-5xl font-black text-brandPrimary">02</div>
                <h3 className="text-xl font-bold text-textPrimary">Traveller Makes Offers</h3>
                <p className="text-sm text-textSecondary leading-relaxed">
                  Verified travellers heading your way place delivery bids. Choose the offer that fits your budget.
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                className="neo-flat p-8 flex flex-col items-center text-center space-y-6"
                whileHover={{ y: -4 }}
              >
                <div className="text-5xl font-black text-brandPrimary">03</div>
                <h3 className="text-xl font-bold text-textPrimary">Pay Securely</h3>
                <p className="text-sm text-textSecondary leading-relaxed">
                  Escrow holds your payment securely. The traveller gets paid only after you verify and accept delivery.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* For Wishers vs For Travellers Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Wishers Panel */}
            <motion.div
              className="neo-flat p-10 md:p-12 space-y-8"
              whileHover={{ y: -4 }}
            >
              <div className="space-y-4">
                <h3 className="text-3xl font-extrabold text-textPrimary">Want something from abroad?</h3>
                <p className="text-textSecondary font-medium">Get international items brought home safely without shipping markup.</p>
              </div>

              <ul className="space-y-4 text-sm font-semibold text-textSecondary">
                <li className="flex items-center space-x-3">
                  <AnimatedCheck />
                  <span>Access products not officially available in Pakistan</span>
                </li>
                <li className="flex items-center space-x-3">
                  <AnimatedCheck />
                  <span>Pay up to 70% less compared to import shipping fees</span>
                </li>
                <li className="flex items-center space-x-3">
                  <AnimatedCheck />
                  <span>Secure Escrow Protection protects your funds</span>
                </li>
                <li className="flex items-center space-x-3">
                  <AnimatedCheck />
                  <span>Direct chat with travellers for custom purchases</span>
                </li>
              </ul>

              <button
                onClick={() => navigate('/product/wish/post')}
                className="w-full py-4 neo-button-brand text-base font-bold"
              >
                Post a Wish
              </button>
            </motion.div>

            {/* For Travellers Panel */}
            <motion.div
              className="neo-flat p-10 md:p-12 space-y-8"
              whileHover={{ y: -4 }}
            >
              <div className="space-y-4">
                <h3 className="text-3xl font-extrabold text-textPrimary">Travelling internationally?</h3>
                <p className="text-textSecondary font-medium">Monetize your unused luggage space and subsidize your travel costs.</p>
              </div>

              <ul className="space-y-4 text-sm font-semibold text-textSecondary">
                <li className="flex items-center space-x-3">
                  <AnimatedCheck />
                  <span>Earn US Dollars or local currency on delivery rewards</span>
                </li>
                <li className="flex items-center space-x-3">
                  <AnimatedCheck />
                  <span>Select only the delivery requests that suit your travel schedule</span>
                </li>
                <li className="flex items-center space-x-3">
                  <AnimatedCheck />
                  <span>Verification of users ensures safety on both ends</span>
                </li>
                <li className="flex items-center space-x-3">
                  <AnimatedCheck />
                  <span>Earn additional traveler badges to unlock bigger offers</span>
                </li>
              </ul>

              <button
                onClick={() => navigate('/wishes')}
                className="w-full py-4 neo-button-outline text-base font-bold text-brandPrimary"
              >
                Start Earning
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 1.4: Live Wish Feed */}
      <section className="py-16 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-textPrimary">
            Wishes Being Posted Right Now
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-brandPrimary to-brandAccent mx-auto mt-3 rounded-full" />
        </div>
        <div className="w-full overflow-hidden py-4 relative">
          <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="animate-scroll space-x-6 flex">
            {[
              { name: "iPhone 15 Pro", country: "UAE", budget: 345000 },
              { name: "Nike Air Max", country: "UK", budget: 45000 },
              { name: "MacBook Pro M3", country: "USA", budget: 580000 },
              { name: "PlayStation 5", country: "Saudi Arabia", budget: 165000 },
              { name: "Dyson Airwrap", country: "Germany", budget: 185000 }
            ].concat([
              { name: "iPhone 15 Pro", country: "UAE", budget: 345000 },
              { name: "Nike Air Max", country: "UK", budget: 45000 },
              { name: "MacBook Pro M3", country: "USA", budget: 580000 },
              { name: "PlayStation 5", country: "Saudi Arabia", budget: 165000 },
              { name: "Dyson Airwrap", country: "Germany", budget: 185000 }
            ]).map((wish, index) => (
              <div key={index} className="neo-flat flex-shrink-0 w-72 p-6 flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl neo-pressed flex items-center justify-center">
                  <svg className="w-5 h-5 text-brandPrimary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-bold text-textPrimary truncate">{wish.name}</h4>
                  <p className="text-xs text-textSecondary font-semibold mt-0.5 flex items-center space-x-1">
                    <span>from</span>
                    <span>{wish.country}</span>
                  </p>
                  <p className="text-sm font-extrabold text-brandPrimary mt-1">PKR {wish.budget.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="neo-flat p-10 md:p-16 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-extrabold text-textPrimary leading-tight">
              Ready to make your first wish?
            </h2>
            <p className="text-textSecondary font-medium text-lg leading-relaxed">
              Join thousands of Pakistanis who are sourcing authentic global products directly from travellers. Sign up today and get started.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/signup')}
                className="px-8 py-4 neo-button-brand font-bold text-lg w-full sm:w-auto"
              >
                Sign Up Free
              </button>
              <button
                onClick={() => navigate('/wishes')}
                className="px-8 py-4 neo-button-outline font-bold text-lg w-full sm:w-auto text-brandPrimary"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PakPorterHomepage;
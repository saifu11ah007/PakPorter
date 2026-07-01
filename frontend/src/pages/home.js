import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Package, Shield, Sparkles, Navigation, Lock, MessageSquare, Gavel, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Helper component for animating stats counts
const StatCounter = ({ value, label, prefix = "", suffix = "", decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const end = value;
      const duration = 1500; // 1.5 seconds
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

const testimonials = [
  {
    rating: 5,
    quote: "Needed a dyson airwrap for my sister's wedding. Posted a wish on PakPorter and a traveller from UAE got it delivered in 4 days. Saved me PKR 30,000!",
    name: "Ayesha Khan",
    type: "Wisher",
    city: "Lahore"
  },
  {
    rating: 5,
    quote: "Travelling back from the US once a year. Bringing laptops and gadgets on PakPorter helps me earn enough to cover my round-trip flight ticket!",
    name: "Zain Ahmed",
    type: "Traveller",
    city: "Karachi"
  },
  {
    rating: 5,
    quote: "The escrow system made it completely stress-free. My payment was held secure until I physically verified my Nike sneakers.",
    name: "Hamza Malik",
    type: "Wisher",
    city: "Islamabad"
  }
];

const TestimonialCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setIndex(prev => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[index];

  return (
    <div className="neo-flat p-8 md:p-12 relative flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
      <div className="flex space-x-1 justify-center">
        {[...Array(current.rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 text-warning fill-warning" />
        ))}
      </div>
      <p className="text-lg md:text-xl font-medium text-textPrimary italic leading-relaxed">
        "{current.quote}"
      </p>
      <div>
        <h4 className="text-base font-bold text-textPrimary">{current.name}</h4>
        <span className="text-xs font-bold text-brandPrimary uppercase tracking-wider">
          {current.type} • {current.city}
        </span>
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          onClick={handlePrev}
          className="p-3 rounded-xl neo-flat text-textSecondary hover:text-brandPrimary hover:scale-105 transition-all"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="p-3 rounded-xl neo-flat text-textSecondary hover:text-brandPrimary hover:scale-105 transition-all"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const PakPorterHomepage = () => {
  const navigate = useNavigate();

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

  const globePath = "M 80 140 Q 200 60, 260 240";

  return (
    <div className="min-h-screen bg-background text-textPrimary overflow-x-hidden pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 flex items-center justify-center">
        {/* Infinite Shifting Hue Radial Gradient */}
        <div className="absolute inset-0 animate-radial-gradient z-0 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
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
                  <span className="bg-gradient-to-r from-brandPrimary to-brandAccent bg-clip-text text-transparent">
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

            {/* Right Column: Globe, Path Offset Animation & Floating Notification Card */}
            <motion.div
              className="relative flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Globe SVG Area */}
              <div className="relative w-full max-w-[420px] aspect-square">
                <svg viewBox="0 0 400 400" className="w-full h-full">
                  {/* Outer Rings */}
                  <circle cx="200" cy="200" r="140" fill="none" stroke="var(--brand-primary)" strokeWidth="1.5" strokeDasharray="6 6" className="opacity-20 animate-[spin_60s_linear_infinite]" />
                  <circle cx="200" cy="200" r="110" fill="none" stroke="var(--brand-accent)" strokeWidth="1" className="opacity-30" />

                  {/* Globe Grid lines */}
                  <path d="M 90 200 Q 200 240, 310 200" fill="none" stroke="var(--text-secondary)" strokeWidth="1" className="opacity-10" />
                  <path d="M 90 200 Q 200 160, 310 200" fill="none" stroke="var(--text-secondary)" strokeWidth="1" className="opacity-10" />
                  <path d="M 200 90 Q 240 200, 200 310" fill="none" stroke="var(--text-secondary)" strokeWidth="1" className="opacity-10" />
                  <path d="M 200 90 Q 160 200, 200 310" fill="none" stroke="var(--text-secondary)" strokeWidth="1" className="opacity-10" />

                  {/* Flight Path Arc */}
                  <path
                    d={globePath}
                    fill="none"
                    stroke="url(#hero-gradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="opacity-70"
                  />

                  <defs>
                    <linearGradient id="hero-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--brand-primary)" />
                      <stop offset="100%" stopColor="var(--brand-accent)" />
                    </linearGradient>
                  </defs>

                  {/* Flight Path Animated Plane */}
                  <motion.g
                    style={{
                      offsetPath: `path('${globePath}')`,
                      offsetRotate: "auto",
                    }}
                    animate={{
                      offsetDistance: ["0%", "100%"]
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <g transform="scale(0.8)">
                      <path
                        d="M-8 -8 L14 0 L-8 8 L-3 0 Z"
                        fill="var(--brand-primary)"
                        stroke="white"
                        strokeWidth="1.5"
                      />
                    </g>
                  </motion.g>
                </svg>

                {/* Floating Notification Neumorphic Card */}
                <motion.div
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 w-72 neo-flat p-4 flex items-center space-x-3"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-10 h-10 rounded-xl neo-pressed flex items-center justify-center text-brandPrimary">
                    <Package className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-brandPrimary tracking-wider uppercase">Wish Posted</span>
                    <p className="text-xs text-textPrimary font-semibold mt-0.5">iPhone 15 Pro from Dubai</p>
                  </div>
                </motion.div>
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
                whileHover={{ y: -6, boxShadow: "var(--neo-shadow-flat-hover)" }}
              >
                <div className="text-5xl font-black text-brandPrimary">01</div>
                <div className="w-16 h-16 rounded-2xl neo-pressed flex items-center justify-center text-brandPrimary">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-textPrimary">Post Your Wish</h3>
                <p className="text-sm text-textSecondary leading-relaxed">
                  Describe what item you need, which international store or country it's from, and set your reward.
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                className="neo-flat p-8 flex flex-col items-center text-center space-y-6"
                whileHover={{ y: -6, boxShadow: "var(--neo-shadow-flat-hover)" }}
              >
                <div className="text-5xl font-black text-brandPrimary">02</div>
                <div className="w-16 h-16 rounded-2xl neo-pressed flex items-center justify-center text-brandPrimary">
                  <Navigation className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-textPrimary">Traveller Makes Offers</h3>
                <p className="text-sm text-textSecondary leading-relaxed">
                  Verified travellers heading your way place delivery bids. Choose the offer that fits your budget.
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                className="neo-flat p-8 flex flex-col items-center text-center space-y-6"
                whileHover={{ y: -6, boxShadow: "var(--neo-shadow-flat-hover)" }}
              >
                <div className="text-5xl font-black text-brandPrimary">03</div>
                <div className="w-16 h-16 rounded-2xl neo-pressed flex items-center justify-center text-brandPrimary">
                  <Shield className="w-8 h-8" />
                </div>
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
              className="neo-flat p-10 md:p-12 space-y-8 relative overflow-hidden"
              whileHover={{ y: -4, boxShadow: "var(--neo-shadow-flat-hover)" }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brandPrimary/10 rounded-full blur-3xl pointer-events-none" />
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
              className="neo-flat p-10 md:p-12 space-y-8 relative overflow-hidden"
              whileHover={{ y: -4, boxShadow: "var(--neo-shadow-flat-hover)" }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brandAccent/15 rounded-full blur-3xl pointer-events-none" />
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
                <div className="w-10 h-10 rounded-xl neo-pressed flex items-center justify-center bg-brandPrimary/5">
                  <Package className="w-5 h-5 text-brandPrimary" />
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

      {/* Section 1.5: Trust and Safety */}
      <section className="py-24 bg-background relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-textPrimary tracking-tight">
              Built on Trust
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-brandPrimary to-brandAccent mx-auto mt-3 rounded-full" />
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              { icon: <Shield className="w-6 h-6" />, title: "CNIC Verified Users", desc: "All local users undergo real-time CNIC validation before transaction access." },
              { icon: <Lock className="w-6 h-6" />, title: "Escrow Payment Protection", desc: "Payments are held securely in escrow until delivery is confirmed by you." },
              { icon: <MessageSquare className="w-6 h-6" />, title: "Real-time Chat", desc: "Discuss product specs, luggage room, and receipts securely in-app." },
              { icon: <Gavel className="w-6 h-6" />, title: "Dispute Resolution", desc: "Dedicated support team processes fast claims if anything goes wrong." }
            ].map((card, idx) => (
              <motion.div
                key={idx}
                className="neo-flat p-8 flex flex-col items-center text-center space-y-4"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: "var(--neo-shadow-flat-hover)" }}
              >
                <div className="w-14 h-14 rounded-full neo-pressed flex items-center justify-center text-brandPrimary">
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-textPrimary">{card.title}</h3>
                <p className="text-xs text-textSecondary font-semibold leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section 1.6: Testimonials */}
      <section className="py-24 bg-background relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-textPrimary tracking-tight">
              What Our Community Says
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-brandPrimary to-brandAccent mx-auto mt-3 rounded-full" />
          </div>

          <TestimonialCarousel />
        </div>
      </section>

      {/* Section 1.7: CTA Banner */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="neo-flat p-10 md:p-16 text-center relative overflow-hidden bg-gradient-to-br from-brandPrimary/5 to-brandAccent/10">
          <div className="absolute inset-0 bg-gradient-to-r from-brandPrimary/10 to-brandAccent/10 pointer-events-none animate-pulse duration-5000" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
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
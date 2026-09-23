import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  FileText, 
  RotateCcw, 
  Building2, 
  Search, 
  Printer, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  CreditCard, 
  HelpCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TAB_CONFIG = {
  privacy: {
    id: 'privacy',
    title: 'Privacy Policy',
    shortTitle: 'Privacy',
    icon: ShieldCheck,
    path: '/privacy-policy',
    description: 'How PakPorter collects, protects, uses, and respects your personal and payment data.'
  },
  terms: {
    id: 'terms',
    title: 'Terms and Conditions',
    shortTitle: 'Terms',
    icon: FileText,
    path: '/terms-and-conditions',
    description: 'The legal agreement governing the use of PakPorter peer-to-peer delivery platform.'
  },
  refunds: {
    id: 'refunds',
    title: 'Cancellation, Return & Refund Policy',
    shortTitle: 'Refunds & Returns',
    icon: RotateCcw,
    path: '/refund-policy',
    description: 'Guidelines on cancellations, escrow protection, return requests, and payment refunds.'
  },
  ownership: {
    id: 'ownership',
    title: 'Ownership Statement & Business Info',
    shortTitle: 'Ownership',
    icon: Building2,
    path: '/ownership-statement',
    description: 'Legal entity details, registered operating address, merchant statements, and IP rights.'
  }
};

const Policies = ({ defaultTab = 'privacy' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [searchQuery, setSearchQuery] = useState('');

  // Determine active tab based on URL path or prop
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    if (path.includes('terms')) {
      setActiveTab('terms');
    } else if (path.includes('refund') || path.includes('cancel') || path.includes('return')) {
      setActiveTab('refunds');
    } else if (path.includes('ownership') || path.includes('about-business')) {
      setActiveTab('ownership');
    } else if (path.includes('privacy')) {
      setActiveTab('privacy');
    } else if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [location.pathname, defaultTab]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    const targetPath = TAB_CONFIG[tabKey]?.path || '/privacy-policy';
    navigate(targetPath, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background text-textPrimary flex flex-col justify-between selection:bg-brandPrimary selection:text-white">
      <Navbar />

      <main className="flex-grow pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header Hero Section */}
        <section className="mb-10 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neo-pressed text-brandPrimary text-xs sm:text-sm font-bold tracking-wide uppercase mb-4"
          >
            <Lock className="w-3.5 h-3.5" />
            Legal & Compliance Center
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
          >
            {TAB_CONFIG[activeTab]?.title}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-3 text-sm sm:text-base text-textSecondary max-w-2xl mx-auto"
          >
            {TAB_CONFIG[activeTab]?.description}
          </motion.p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-textSecondary">
            <span className="neo-flat px-3 py-1 font-medium">Last Updated: October 2026</span>
            <span className="neo-flat px-3 py-1 font-medium">Jurisdiction: Pakistan</span>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 neo-flat hover:text-brandPrimary px-3 py-1 transition-colors"
              title="Print Policy"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Page</span>
            </button>
          </div>
        </section>

        {/* Tab Navigation Navigation Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-10">
          {Object.entries(TAB_CONFIG).map(([key, config]) => {
            const Icon = config.icon;
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`p-4 rounded-2xl flex flex-col items-center sm:items-start text-center sm:text-left transition-all duration-300 relative overflow-hidden ${
                  isActive 
                    ? 'neo-pressed border-2 border-brandPrimary/40 shadow-inner' 
                    : 'neo-flat neo-flat-hover'
                }`}
              >
                <div className={`p-2.5 rounded-xl mb-3 ${isActive ? 'bg-brandPrimary text-white shadow-md' : 'neo-flat text-brandPrimary'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs sm:text-sm font-bold block ${isActive ? 'text-brandPrimary' : 'text-textPrimary'}`}>
                  {config.shortTitle}
                </span>
                <span className="text-[11px] text-textSecondary hidden sm:block mt-1 line-clamp-1">
                  {config.title}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabBadge"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brandPrimary to-brandAccent"
                  />
                )}
              </button>
            );
          })}
        </section>

        {/* Search Bar within Policy */}
        <div className="mb-8 max-w-xl mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-textSecondary absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search keywords in ${TAB_CONFIG[activeTab]?.shortTitle}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl neo-flat text-sm focus:outline-none focus:ring-2 focus:ring-brandPrimary/40 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-textSecondary hover:text-textPrimary neo-flat px-2 py-0.5 rounded"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Content Container */}
        <div className="neo-flat p-6 sm:p-10 md:p-12 rounded-3xl relative">
          <AnimatePresence mode="wait">
            {activeTab === 'privacy' && (
              <PrivacyContent key="privacy" searchQuery={searchQuery} />
            )}
            {activeTab === 'terms' && (
              <TermsContent key="terms" searchQuery={searchQuery} />
            )}
            {activeTab === 'refunds' && (
              <RefundsContent key="refunds" searchQuery={searchQuery} />
            )}
            {activeTab === 'ownership' && (
              <OwnershipContent key="ownership" searchQuery={searchQuery} />
            )}
          </AnimatePresence>
        </div>

        {/* Support Callout Banner */}
        <section className="mt-12 neo-flat p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-brandPrimary">
          <div>
            <h3 className="text-lg font-bold text-textPrimary flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brandPrimary" />
              Have Questions or Need Assistance with Policies?
            </h3>
            <p className="text-sm text-textSecondary mt-1">
              Our compliance and customer support team is available 24/7 to clarify terms or assist with order escrow and payments.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <a
              href="mailto:support@pakporter.com"
              className="neo-button-brand px-5 py-2.5 text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Contact Support
            </a>
            <button
              onClick={() => handleTabChange('ownership')}
              className="neo-button-outline px-4 py-2.5 text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              Company Details
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

/* =========================================================================
   1. PRIVACY POLICY COMPONENT
   ========================================================================= */
const PrivacyContent = ({ searchQuery }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 text-sm sm:text-base leading-relaxed text-textSecondary"
    >
      <div className="border-b border-surface pb-4">
        <h2 className="text-2xl font-bold text-textPrimary">PakPorter Privacy Policy</h2>
        <p className="text-xs text-textSecondary mt-1">Effective Date: October 2026 | Version 2.1</p>
      </div>

      <div className="neo-pressed p-4 rounded-xl flex items-start gap-3 border-l-4 border-brandPrimary">
        <ShieldCheck className="w-5 h-5 text-brandPrimary flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm">
          <strong className="text-textPrimary">Your Privacy Matters:</strong> PakPorter does not sell, rent, or trade your personal or sensitive financial information to third parties. We employ end-to-end industry standard encryption and PCI-DSS compliant payment processing tokenization powered by Safepay.
        </div>
      </div>

      {/* Section 1 */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-textPrimary flex items-center gap-2">
          <span className="w-6 h-6 rounded-full neo-flat text-xs flex items-center justify-center font-bold text-brandPrimary">1</span>
          Information We Collect
        </h3>
        <p>
          PakPorter collects essential information to facilitate secure peer-to-peer delivery matchmaking, identity verification (KYC), and payment processing:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li><strong>Personal Identification Information:</strong> Full name, verified email address, phone number, and residential/delivery address.</li>
          <li><strong>Traveler Verification Data:</strong> Government-issued CNIC/Passport details and flight itinerary confirmation for cross-border travelers.</li>
          <li><strong>Order & Wish Details:</strong> Product descriptions, retailer URLs, estimated prices, package weight, and shipping preferences.</li>
          <li><strong>Payment & Transaction Information:</strong> Payment reference tokens, billing status, transaction identifiers, and escrow records (card numbers are processed securely through Safepay and are never stored on PakPorter servers).</li>
          <li><strong>Technical & Usage Data:</strong> IP address, device type, browser specifications, and usage cookies for session stability and fraud prevention.</li>
        </ul>
      </section>

      {/* Section 2 */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-textPrimary flex items-center gap-2">
          <span className="w-6 h-6 rounded-full neo-flat text-xs flex items-center justify-center font-bold text-brandPrimary">2</span>
          How We Use Your Information
        </h3>
        <p>Your data is processed strictly for legitimate operational purposes, including:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="neo-flat p-3.5 rounded-xl">
            <strong className="text-textPrimary block mb-1">Matchmaking & Delivery:</strong>
            Connecting buyers with travelers traveling on matching international routes.
          </div>
          <div className="neo-flat p-3.5 rounded-xl">
            <strong className="text-textPrimary block mb-1">Payment & Escrow Protection:</strong>
            Holding buyer payments securely in escrow until goods are delivered and verified.
          </div>
          <div className="neo-flat p-3.5 rounded-xl">
            <strong className="text-textPrimary block mb-1">Trust & Safety / KYC:</strong>
            Preventing unauthorized transactions, fraud, customs breaches, and fake profiles.
          </div>
          <div className="neo-flat p-3.5 rounded-xl">
            <strong className="text-textPrimary block mb-1">Customer Support:</strong>
            Resolving disputes, delivery inquiries, cancellations, and processing refunds.
          </div>
        </div>
      </section>

      {/* Section 3 */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-textPrimary flex items-center gap-2">
          <span className="w-6 h-6 rounded-full neo-flat text-xs flex items-center justify-center font-bold text-brandPrimary">3</span>
          Payment Processing & Safepay Gateway Integration
        </h3>
        <p>
          PakPorter uses <strong>Safepay (Pvt.) Ltd.</strong> as its authorized payment service provider. When you make a payment for a wish or delivery reward:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>Payment credentials (credit/debit cards, bank accounts, digital wallets) are submitted directly to Safepay’s PCI-DSS Level 1 certified gateway.</li>
          <li>PakPorter receives only a secure encrypted payment token and transaction reference ID. We do not view or store your full card number or CVV.</li>
          <li>Safepay complies with State Bank of Pakistan (SBP) electronic payment regulations and international cryptographic security protocols.</li>
        </ul>
      </section>

      {/* Section 4 */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-textPrimary flex items-center gap-2">
          <span className="w-6 h-6 rounded-full neo-flat text-xs flex items-center justify-center font-bold text-brandPrimary">4</span>
          Cookies and Tracking Technologies
        </h3>
        <p>
          We use functional and analytical cookies to remember your preferences (such as light/dark mode theme and authentication tokens). You can manage or disable cookies via your browser settings, though certain platform features may be restricted.
        </p>
      </section>

      {/* Section 5 */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-textPrimary flex items-center gap-2">
          <span className="w-6 h-6 rounded-full neo-flat text-xs flex items-center justify-center font-bold text-brandPrimary">5</span>
          Data Retention and Your Rights
        </h3>
        <p>
          Under applicable data protection laws, you have the right to request access, correction, or deletion of your personal account data. To request data removal or an export of your information, email our Data Protection Officer at <a href="mailto:privacy@pakporter.com" className="text-brandPrimary underline">privacy@pakporter.com</a>.
        </p>
      </section>

      {/* Section 6 */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-textPrimary flex items-center gap-2">
          <span className="w-6 h-6 rounded-full neo-flat text-xs flex items-center justify-center font-bold text-brandPrimary">6</span>
          Contact for Privacy Inquiries
        </h3>
        <div className="neo-flat p-4 rounded-xl flex flex-col sm:flex-row gap-4 justify-between">
          <div>
            <p className="font-bold text-textPrimary">PakPorter Legal & Privacy Office</p>
            <p className="text-xs text-textSecondary">Email: support@pakporter.com | privacy@pakporter.com</p>
            <p className="text-xs text-textSecondary">Address: PakPorter Technologies, Islamabad, Pakistan</p>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

/* =========================================================================
   2. TERMS AND CONDITIONS COMPONENT
   ========================================================================= */
const TermsContent = ({ searchQuery }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 text-sm sm:text-base leading-relaxed text-textSecondary"
    >
      <div className="border-b border-surface pb-4">
        <h2 className="text-2xl font-bold text-textPrimary">PakPorter Terms and Conditions of Service</h2>
        <p className="text-xs text-textSecondary mt-1">Last Revised: October 2026 | Applicable to all Wishers & Travelers</p>
      </div>

      <div className="neo-pressed p-4 rounded-xl flex items-start gap-3 border-l-4 border-brandPrimary">
        <FileText className="w-5 h-5 text-brandPrimary flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm">
          <strong className="text-textPrimary">Agreement to Terms:</strong> By registering, browsing, posting wishes, making bids, or completing transactions on PakPorter, you agree to be bound by these Terms and Conditions and all applicable laws of the Islamic Republic of Pakistan.
        </div>
      </div>

      {/* Section 1 */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-textPrimary flex items-center gap-2">
          <span className="w-6 h-6 rounded-full neo-flat text-xs flex items-center justify-center font-bold text-brandPrimary">1</span>
          Platform Overview & Role of PakPorter
        </h3>
        <p>
          PakPorter is a peer-to-peer (P2P) technology marketplace that connects local buyers ("Wishers") seeking items from abroad with international passengers ("Travelers") who have available luggage space and travel itineraries.
        </p>
        <div className="neo-flat p-4 rounded-xl">
          <p className="text-xs sm:text-sm">
            <strong>Important Clarification:</strong> PakPorter is not a direct retailer, manufacturer, or courier service. PakPorter operates the digital communication platform, verification workflows, and secure payment escrow infrastructure.
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-textPrimary flex items-center gap-2">
          <span className="w-6 h-6 rounded-full neo-flat text-xs flex items-center justify-center font-bold text-brandPrimary">2</span>
          User Eligibility & Account Security
        </h3>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>Users must be at least 18 years of age and legally competent to enter into binding contracts.</li>
          <li>Users must provide accurate, verified information during registration and phone/OTP verification.</li>
          <li>Account credentials must be kept confidential. You are responsible for all actions taken under your account.</li>
        </ul>
      </section>

      {/* Section 3 */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-textPrimary flex items-center gap-2">
          <span className="w-6 h-6 rounded-full neo-flat text-xs flex items-center justify-center font-bold text-brandPrimary">3</span>
          Prohibited Items and Customs Compliance
        </h3>
        <p>
          Users must strictly comply with all Pakistan Customs regulations and international aviation safety rules (ICAO / IATA). The following items are <strong>strictly prohibited</strong>:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="neo-pressed p-3 rounded-xl border border-red-500/20 text-xs">
            <strong className="text-red-500 block mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Strictly Prohibited Goods:
            </strong>
            Illegal narcotics, prescription drugs without licensed permits, firearms, weapons, ammunition, hazardous chemicals, flammable materials, counterfeit currencies, and smuggled or pornographic materials.
          </div>
          <div className="neo-pressed p-3 rounded-xl border border-red-500/20 text-xs">
            <strong className="text-red-500 block mb-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Restricted Categories:
            </strong>
            Precious metals/bullion, perishable food items violating agricultural import standards, high-value commercial consignments exceeding personal baggage allowance without declared customs duty.
          </div>
        </div>
        <p className="text-xs text-textSecondary italic">
          Travelers have the right and obligation to physically inspect all purchased items before packing to verify authenticity and airport compliance.
        </p>
      </section>

      {/* Section 4 */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-textPrimary flex items-center gap-2">
          <span className="w-6 h-6 rounded-full neo-flat text-xs flex items-center justify-center font-bold text-brandPrimary">4</span>
          Payments, Escrow & Service Fees
        </h3>
        <p>
          All financial transactions on PakPorter are processed through authorized payment gateways (Safepay). 
        </p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li><strong>Escrow Protection:</strong> The total order amount (Item Cost + Traveler Reward Fee + Platform Service Fee) is charged to the buyer and held securely in escrow.</li>
          <li><strong>Traveler Payouts:</strong> Funds are released to the Traveler only after the Wisher receives the item, inspects condition, and confirms receipt in the app.</li>
          <li><strong>Platform Fee:</strong> PakPorter charges a transparent service fee for facilitating matchmaking, escrow guarantee, and platform support.</li>
        </ul>
      </section>

      {/* Section 5 */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-textPrimary flex items-center gap-2">
          <span className="w-6 h-6 rounded-full neo-flat text-xs flex items-center justify-center font-bold text-brandPrimary">5</span>
          Dispute Resolution & Governing Law
        </h3>
        <p>
          In case of delivery dispute, mismatch, or damage, our support arbitration team mediates between Buyer and Traveler based on original purchase receipts, unboxing videos, and chat history.
        </p>
        <p>
          These Terms are governed by and construed in accordance with the laws of the <strong>Islamic Republic of Pakistan</strong>. Any legal action or proceeding shall be subject to the exclusive jurisdiction of the competent courts in Islamabad/Rawalpindi, Pakistan.
        </p>
      </section>
    </motion.div>
  );
};

/* =========================================================================
   3. CANCELLATION, RETURN & REFUND POLICY COMPONENT
   ========================================================================= */
const RefundsContent = ({ searchQuery }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 text-sm sm:text-base leading-relaxed text-textSecondary"
    >
      <div className="border-b border-surface pb-4">
        <h2 className="text-2xl font-bold text-textPrimary">Cancellation, Return & Refund Policy</h2>
        <p className="text-xs text-textSecondary mt-1">Protecting Buyers and Travelers with Escrow Transparency</p>
      </div>

      <div className="neo-pressed p-4 rounded-xl flex items-start gap-3 border-l-4 border-brandPrimary">
        <RotateCcw className="w-5 h-5 text-brandPrimary flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm">
          <strong className="text-textPrimary">100% Escrow Money-Back Guarantee:</strong> Because funds are locked in escrow upon order placement and released only upon your verified delivery confirmation, your money is completely safe if an item is not delivered or does not match specifications.
        </div>
      </div>

      {/* Cancellation Policy */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-textPrimary flex items-center gap-2">
          <span className="w-6 h-6 rounded-full neo-flat text-xs flex items-center justify-center font-bold text-brandPrimary">1</span>
          Order Cancellation Guidelines
        </h3>
        
        <div className="space-y-3">
          <div className="neo-flat p-4 rounded-xl">
            <h4 className="font-bold text-textPrimary text-sm mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Buyer Cancellation (Before Traveler Purchases the Item):
            </h4>
            <p className="text-xs sm:text-sm">
              If a Wisher cancels the wish before the matched Traveler has purchased the product, a <strong>100% full refund</strong> is issued immediately back to the original payment source.
            </p>
          </div>

          <div className="neo-flat p-4 rounded-xl">
            <h4 className="font-bold text-textPrimary text-sm mb-1 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Buyer Cancellation (After Item is Purchased by Traveler):
            </h4>
            <p className="text-xs sm:text-sm">
              Once the traveler has uploaded the purchase receipt and purchased the requested product, cancellations are only possible if the traveler can return the item to the retailer in the source country without incurring non-refundable charges. If return shipping or restocking fees apply, they will be deducted.
            </p>
          </div>

          <div className="neo-flat p-4 rounded-xl">
            <h4 className="font-bold text-textPrimary text-sm mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Traveler Cancellation / Flight Delays:
            </h4>
            <p className="text-xs sm:text-sm">
              If a traveler cancels their trip or is unable to fulfill delivery, the buyer receives a <strong>100% full refund</strong> immediately, or the option to be auto-matched with the next available traveler.
            </p>
          </div>
        </div>
      </section>

      {/* Return Policy */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-textPrimary flex items-center gap-2">
          <span className="w-6 h-6 rounded-full neo-flat text-xs flex items-center justify-center font-bold text-brandPrimary">2</span>
          Return & Inspection Policy (48-Hour Window)
        </h3>
        <p>
          Upon receiving the item in Pakistan (via local handover or domestic courier dispatch):
        </p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li><strong>Inspection Period:</strong> The buyer has <strong>48 hours</strong> from receipt to inspect the item and report any defect, incorrect specification, damage, or missing contents.</li>
          <li><strong>Eligible Return Reasons:</strong> Counterfeit goods, damaged items, wrong model/color/size from what was specified in the wish description, or damaged packaging resulting in unusable product.</li>
          <li><strong>Ineligible Return Reasons:</strong> Buyer change of mind after delivery confirmation, buyer ordering the incorrect model/specification, or damages caused after delivery handover.</li>
        </ul>
      </section>

      {/* Refund Processing Timeline */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-textPrimary flex items-center gap-2">
          <span className="w-6 h-6 rounded-full neo-flat text-xs flex items-center justify-center font-bold text-brandPrimary">3</span>
          Refund Processing & Timelines (Safepay Gateway)
        </h3>
        <p>
          When a refund is approved by our resolution team:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-center">
          <div className="neo-flat p-3.5 rounded-xl">
            <CreditCard className="w-5 h-5 text-brandPrimary mx-auto mb-1" />
            <strong className="text-textPrimary block text-xs">Credit / Debit Cards</strong>
            <span className="text-xs text-textSecondary">5 to 10 Business Days</span>
          </div>
          <div className="neo-flat p-3.5 rounded-xl">
            <Building2 className="w-5 h-5 text-brandPrimary mx-auto mb-1" />
            <strong className="text-textPrimary block text-xs">Direct Bank Transfer</strong>
            <span className="text-xs text-textSecondary">3 to 5 Business Days</span>
          </div>
          <div className="neo-flat p-3.5 rounded-xl">
            <RotateCcw className="w-5 h-5 text-brandPrimary mx-auto mb-1" />
            <strong className="text-textPrimary block text-xs">PakPorter Wallet / Credit</strong>
            <span className="text-xs text-textSecondary">Instant (0 Hours)</span>
          </div>
        </div>
        <p className="text-xs text-textSecondary mt-2">
          All refunds are credited back to the exact payment card, account, or wallet utilized during the original checkout in accordance with State Bank of Pakistan anti-money laundering regulations.
        </p>
      </section>

      {/* Dispute Filing */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-textPrimary flex items-center gap-2">
          <span className="w-6 h-6 rounded-full neo-flat text-xs flex items-center justify-center font-bold text-brandPrimary">4</span>
          How to File a Refund or Cancellation Claim
        </h3>
        <p>
          To initiate a return or refund claim, email <a href="mailto:refunds@pakporter.com" className="text-brandPrimary underline">refunds@pakporter.com</a> or open a dispute ticket from your <span className="font-semibold text-textPrimary">User Dashboard &gt; Order Details</span> with your Order Reference ID and photos of the item received.
        </p>
      </section>
    </motion.div>
  );
};

/* =========================================================================
   4. OWNERSHIP STATEMENT & BUSINESS INFORMATION
   ========================================================================= */
const OwnershipContent = ({ searchQuery }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 text-sm sm:text-base leading-relaxed text-textSecondary"
    >
      <div className="border-b border-surface pb-4">
        <h2 className="text-2xl font-bold text-textPrimary">Ownership Statement & Merchant Information</h2>
        <p className="text-xs text-textSecondary mt-1">Official Business Disclosure for Compliance & Verification</p>
      </div>

      <div className="neo-pressed p-4 rounded-xl flex items-start gap-3 border-l-4 border-brandPrimary">
        <Building2 className="w-5 h-5 text-brandPrimary flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm">
          <strong className="text-textPrimary">Merchant Identification Statement:</strong> PakPorter is a registered digital technology platform operating in Pakistan, facilitating verified peer-to-peer delivery logistics, secure payment escrow, and community matchmaking.
        </div>
      </div>

      {/* Business Details Grid */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-textPrimary flex items-center gap-2">
          <span className="w-6 h-6 rounded-full neo-flat text-xs flex items-center justify-center font-bold text-brandPrimary">1</span>
          Corporate & Legal Entity Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="neo-flat p-4 rounded-xl space-y-2">
            <span className="text-xs font-bold uppercase text-brandPrimary">Entity Information</span>
            <div className="text-xs sm:text-sm space-y-1">
              <p><strong className="text-textPrimary">Platform Name:</strong> PakPorter</p>
              <p><strong className="text-textPrimary">Legal Business Name:</strong> PakPorter Technologies (Pvt.) Ltd.</p>
              <p><strong className="text-textPrimary">Industry:</strong> E-commerce / P2P Travel & Logistics Facilitation</p>
              <p><strong className="text-textPrimary">Official Domain:</strong> <a href="https://pakporter.com" className="text-brandPrimary">https://pakporter.com</a></p>
            </div>
          </div>

          <div className="neo-flat p-4 rounded-xl space-y-2">
            <span className="text-xs font-bold uppercase text-brandPrimary">Operating Location</span>
            <div className="text-xs sm:text-sm space-y-1">
              <p className="flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-brandPrimary flex-shrink-0 mt-0.5" />
                <span><strong>Registered Office:</strong> Islamabad / Rawalpindi Tech Zone, Federal Capital, Pakistan</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-brandPrimary flex-shrink-0" />
                <span><strong>Support Email:</strong> support@pakporter.com</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-brandPrimary flex-shrink-0" />
                <span><strong>Helpline:</strong> +92 300 0000000 / Support Desk</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Intellectual Property Rights */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-textPrimary flex items-center gap-2">
          <span className="w-6 h-6 rounded-full neo-flat text-xs flex items-center justify-center font-bold text-brandPrimary">2</span>
          Intellectual Property & Trademark Ownership
        </h3>
        <p>
          All content, software architecture, user interface elements, visual graphics, trademarks, logos, brand names ("PakPorter"), source code, and website designs are the exclusive property of <strong>PakPorter Technologies</strong> and are protected under Pakistani and international copyright, trademark, and intellectual property treaties.
        </p>
        <p>
          Any unauthorized reproduction, modification, scraping, reverse-engineering, or commercial redistribution of any part of this platform without prior written authorization is strictly prohibited.
        </p>
      </section>

      {/* Payment Gateway Partnership */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-textPrimary flex items-center gap-2">
          <span className="w-6 h-6 rounded-full neo-flat text-xs flex items-center justify-center font-bold text-brandPrimary">3</span>
          Authorized Payment Merchant Statement
        </h3>
        <p>
          PakPorter operates as an authorized merchant utilizing <strong>Safepay (Pvt.) Ltd.</strong> payment gateway infrastructure. When purchasing or securing escrow funds on our website, transactions will appear on your bank statement under the merchant descriptor of <span className="font-bold text-textPrimary">"PakPorter"</span> or <span className="font-bold text-textPrimary">"Safepay*PakPorter"</span>.
        </p>
      </section>

      {/* Operational Disclaimer */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-textPrimary flex items-center gap-2">
          <span className="w-6 h-6 rounded-full neo-flat text-xs flex items-center justify-center font-bold text-brandPrimary">4</span>
          Platform Statement & Limitations
        </h3>
        <p>
          PakPorter acts as an intermediary technology platform. PakPorter facilitates peer-to-peer relationships between Wishers and Travelers while providing escrow payment security, ID verification, and dispute mediation. For all inquiries regarding partnerships, regulatory filings, or compliance verification, contact our corporate office at <a href="mailto:corporate@pakporter.com" className="text-brandPrimary underline">corporate@pakporter.com</a>.
        </p>
      </section>
    </motion.div>
  );
};

export default Policies;

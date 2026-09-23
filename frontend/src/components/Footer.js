import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="relative mt-20">
      {/* Brand gradient top border accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brandPrimary via-brandAccent to-brandPrimary" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 neo-flat p-8 md:p-10">
          {/* Column 1: About PakPorter */}
          <div className="space-y-4 lg:col-span-1">
            <span className="text-2xl font-extrabold tracking-tight block">
              <span className="text-brandPrimary">Pak</span>
              <span className="text-textPrimary">Porter</span>
            </span>
            <p className="text-textSecondary text-xs sm:text-sm leading-relaxed">
              Your Wish. Their Journey. Delivered. We connect international travelers with local buyers to facilitate peer-to-peer cross-border delivery.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-textPrimary">Quick Links</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-textSecondary">
              <li>
                <button onClick={() => navigate('/')} className="hover:text-brandPrimary transition-colors text-left">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/wishes')} className="hover:text-brandPrimary transition-colors text-left">
                  Browse Wishes
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/product/wish/post')} className="hover:text-brandPrimary transition-colors text-left">
                  Post a Wish
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: For Travellers */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-textPrimary">For Travellers</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-textSecondary">
              <li>
                <button onClick={() => navigate('/wishes')} className="hover:text-brandPrimary transition-colors text-left">
                  Start Earning
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/terms-and-conditions')} className="hover:text-brandPrimary transition-colors text-left">
                  Delivery Guidelines
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/refund-policy')} className="hover:text-brandPrimary transition-colors text-left">
                  Escrow Guarantee
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Policies (Safepay compliance) */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-textPrimary">Legal & Policy</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-textSecondary">
              <li>
                <button onClick={() => navigate('/privacy-policy')} className="hover:text-brandPrimary transition-colors text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/terms-and-conditions')} className="hover:text-brandPrimary transition-colors text-left">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/refund-policy')} className="hover:text-brandPrimary transition-colors text-left">
                  Refund & Cancellation
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/ownership-statement')} className="hover:text-brandPrimary transition-colors text-left">
                  Ownership Statement
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact & Socials */}
          <div className="space-y-3">
            <h4 className="text-base font-bold text-textPrimary">Contact</h4>
            <p className="text-textSecondary text-xs sm:text-sm">
              Email: support@pakporter.com
            </p>
            <div className="flex space-x-2 pt-1">
              <button aria-label="Facebook" className="p-2 rounded-xl neo-flat text-textSecondary hover:text-brandPrimary hover:scale-105 transition-all duration-200">
                <Facebook className="w-4 h-4" />
              </button>
              <button aria-label="Twitter" className="p-2 rounded-xl neo-flat text-textSecondary hover:text-brandPrimary hover:scale-105 transition-all duration-200">
                <Twitter className="w-4 h-4" />
              </button>
              <button aria-label="Instagram" className="p-2 rounded-xl neo-flat text-textSecondary hover:text-brandPrimary hover:scale-105 transition-all duration-200">
                <Instagram className="w-4 h-4" />
              </button>
              <button aria-label="LinkedIn" className="p-2 rounded-xl neo-flat text-textSecondary hover:text-brandPrimary hover:scale-105 transition-all duration-200">
                <Linkedin className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between text-xs text-textSecondary px-4 space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} PakPorter Technologies. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button onClick={() => navigate('/privacy-policy')} className="hover:text-brandPrimary transition-colors">Privacy</button>
            <span>•</span>
            <button onClick={() => navigate('/terms-and-conditions')} className="hover:text-brandPrimary transition-colors">Terms</button>
            <span>•</span>
            <button onClick={() => navigate('/refund-policy')} className="hover:text-brandPrimary transition-colors">Refunds & Returns</button>
            <span>•</span>
            <button onClick={() => navigate('/ownership-statement')} className="hover:text-brandPrimary transition-colors">Ownership</button>
          </div>
          <p className="flex items-center space-x-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-brandPrimary fill-brandPrimary" />
            <span>in Pakistan</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

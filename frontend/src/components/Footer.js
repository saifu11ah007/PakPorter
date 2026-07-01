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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 neo-flat p-10 md:p-12">
          {/* Column 1: About PakPorter */}
          <div className="space-y-4">
            <span className="text-2xl font-extrabold tracking-tight block">
              <span className="text-brandPrimary">Pak</span>
              <span className="text-textPrimary">Porter</span>
            </span>
            <p className="text-textSecondary text-sm leading-relaxed">
              Your Wish. Their Journey. Delivered. We connect international travelers with local buyers to facilitate peer-to-peer cross-border shipping and delivery.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-textPrimary">Quick Links</h4>
            <ul className="space-y-2 text-sm text-textSecondary">
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
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-textPrimary">For Travellers</h4>
            <ul className="space-y-2 text-sm text-textSecondary">
              <li>
                <button onClick={() => navigate('/wishes')} className="hover:text-brandPrimary transition-colors text-left">
                  Start Earning
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/wishes')} className="hover:text-brandPrimary transition-colors text-left">
                  Delivery Guidelines
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/wishes')} className="hover:text-brandPrimary transition-colors text-left">
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Socials */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-textPrimary">Contact</h4>
            <p className="text-textSecondary text-sm">
              Email: support@pakporter.com
            </p>
            <div className="flex space-x-3 pt-2">
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
          <p>© {new Date().getFullYear()} PakPorter. All rights reserved.</p>
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

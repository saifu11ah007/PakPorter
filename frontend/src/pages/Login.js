import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { Mail, Lock, Eye, EyeOff, AlertCircle, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '', general: '' }));
  };

  const validate = () => {
    const err = {};
    if (!formData.email.trim()) {
      err.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      err.email = 'Invalid email address';
    }
    if (!formData.password) {
      err.password = 'Password is required';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      localStorage.setItem('token', result.token);
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('tokenTimestamp', Date.now().toString());

      navigate('/dashboard');
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-20">
      <Navbar />

      <div className="flex-1 flex items-center justify-center py-12 px-6 bg-gradient-to-br from-brandPrimary/5 via-background to-brandAccent/5">
        <div className="w-full max-w-[420px] neo-flat p-8 md:p-10 text-center">
          
          {/* Logo Area */}
          <div className="mb-8">
            <span className="text-3xl font-extrabold tracking-tight block">
              <span className="text-brandPrimary">Pak</span>
              <span className="text-textPrimary">Porter</span>
            </span>
            <p className="text-sm font-semibold text-textSecondary mt-2">Welcome Back! Login to continue.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            {errors.general && (
              <div className="neo-pressed p-4 bg-error/5 text-error text-xs font-bold flex items-center space-x-2 rounded-xl">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errors.general}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
                <input 
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 neo-input"
                />
              </div>
              {errors.email && <p className="text-xs font-bold text-error">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Password</label>
                <a href="#!" className="text-xs font-bold text-brandPrimary hover:underline">Forgot Password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 neo-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-textSecondary"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs font-bold text-error">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 neo-button-brand font-bold text-base mt-2 flex items-center justify-center space-x-2"
            >
              {isLoading ? <RefreshCw className="w-5 h-5 animate-spin mx-auto" /> : <span>Login</span>}
            </button>
          </form>

          {/* Social Sign In Divider */}
          <div className="my-8 flex items-center justify-between text-xs font-bold text-textSecondary uppercase tracking-wider">
            <div className="w-[30%] h-[1px] bg-cardBase" />
            <span>or continue with</span>
            <div className="w-[30%] h-[1px] bg-cardBase" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-3 gap-4">
            {/* Google */}
            <button className="py-3.5 neo-flat flex items-center justify-center hover:scale-105 transition-all">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.504 0-6.357-2.853-6.357-6.357s2.853-6.357 6.357-6.357c1.6 0 3.055.59 4.184 1.564l3.14-3.14C19.14 1.7 15.86 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.897 0 10.793-4.225 10.793-11.24 0-.625-.08-1.22-.2-1.785H12.24z"/>
              </svg>
            </button>

            {/* Facebook */}
            <button className="py-3.5 neo-flat flex items-center justify-center hover:scale-105 transition-all">
              <svg className="w-5 h-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>

            {/* Apple */}
            <button className="py-3.5 neo-flat flex items-center justify-center hover:scale-105 transition-all">
              <svg className="w-5 h-5 text-textPrimary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.7-1.13 1.84-.99 2.94.1.08.31.13.43.13.92 0 2.03-.59 2.69-1.46z"/>
              </svg>
            </button>
          </div>

          <p className="text-center text-sm font-semibold text-textSecondary mt-8">
            Don't have an account? <Link to="/signup" className="text-brandPrimary hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
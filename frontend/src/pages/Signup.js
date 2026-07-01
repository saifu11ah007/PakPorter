import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, CreditCard, Phone, MapPin, Upload, Check, AlertCircle, RefreshCw, Globe } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    cnic: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: 'Lahore',
    country: 'Pakistan',
  });

  // Verification files
  const [cnicFrontFile, setCnicFrontFile] = useState(null);
  const [cnicBackFile, setCnicBackFile] = useState(null);
  const [previews, setPreviews] = useState({ front: null, back: null });
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [ocrStatus, setOcrStatus] = useState(null); // 'success' | 'error' | null
  const [ocrMessage, setOcrMessage] = useState('');

  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field Blur Validation States
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  // OTP State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(90); // 1:30 in seconds
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [otpSuccess, setOtpSuccess] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // Focus helper for OTP boxes
  const otpInputsRef = useRef([]);

  // Timer countdown
  useEffect(() => {
    if (step === 2 && otpTimer > 0) {
      const interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (otpTimer === 0) {
      setCanResendOtp(true);
    }
  }, [step, otpTimer]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `Resend in ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // CNIC Formatting helper
  const handleCnicChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 13);
    let formatted = value;
    if (value.length > 5 && value.length <= 12) {
      formatted = `${value.slice(0, 5)}-${value.slice(5)}`;
    } else if (value.length > 12) {
      formatted = `${value.slice(0, 5)}-${value.slice(5, 12)}-${value.slice(12)}`;
    }
    setFormData(prev => ({ ...prev, cnic: formatted }));
    validateField('cnic', formatted);
  };

  // Field Validation
  const validateField = (field, value) => {
    let err = '';
    const val = value !== undefined ? value : formData[field];
    
    if (field === 'fullName') {
      if (!val.trim()) err = 'Full Name is required';
    } else if (field === 'email') {
      if (!val.trim()) err = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(val)) err = 'Invalid email address';
    } else if (field === 'cnic') {
      const clean = val.replace(/\D/g, '');
      if (!val.trim()) err = 'CNIC is required';
      else if (clean.length !== 13) err = 'CNIC must be 13 digits';
    } else if (field === 'password') {
      if (!val) err = 'Password is required';
      else if (val.length < 8) err = 'Must be at least 8 characters';
    } else if (field === 'confirmPassword') {
      if (!val) err = 'Please confirm password';
      else if (val !== formData.password) err = 'Passwords do not match';
    } else if (field === 'phone') {
      if (!val.trim()) err = 'Phone number is required';
    }

    setErrors(prev => ({ ...prev, [field]: err }));
    return !err;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };

  // OTP Inputs handling
  const handleOtpChange = (index, val) => {
    if (/^\d*$/.test(val)) {
      const newOtp = [...otp];
      newOtp[index] = val.slice(-1);
      setOtp(newOtp);

      if (val && index < 5) {
        otpInputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Upload Preview handler
  const handleFileChange = (e, target) => {
    const file = e.target.files[0];
    if (file) {
      if (target === 'front') {
        setCnicFrontFile(file);
        setPreviews(prev => ({ ...prev, front: URL.createObjectURL(file) }));
      } else {
        setCnicBackFile(file);
        setPreviews(prev => ({ ...prev, back: URL.createObjectURL(file) }));
      }
    }
  };

  // Step submissions
  const handleStep1Submit = async (e) => {
    e.preventDefault();
    
    // Validate all Step 1 fields
    const isNameValid = validateField('fullName');
    const isEmailValid = validateField('email');
    const isCnicValid = validateField('cnic');
    const isPassValid = validateField('password');
    const isConfirmValid = validateField('confirmPassword');

    setTouched({
      fullName: true,
      email: true,
      cnic: true,
      password: true,
      confirmPassword: true
    });

    if (isNameValid && isEmailValid && isCnicValid && isPassValid && isConfirmValid) {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE}/auth/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            fullName: formData.fullName,
            password: formData.password,
            cnicNumber: formData.cnic,
          }),
        });

        const data = await response.json();
        if (response.ok || data.success) {
          // Store pending data in localStorage as fallback
          localStorage.setItem('pendingEmail', formData.email);
          localStorage.setItem('pendingName', formData.fullName);
          localStorage.setItem('pendingCnic', formData.cnic);
          setStep(2);
        } else {
          alert(data.message || 'Error sending OTP');
        }
      } catch (err) {
        console.error(err);
        alert('Network error. Failed to initiate signup.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) return;

    setIsLoading(true);
    setOtpError(false);

    try {
      const response = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: enteredOtp,
        }),
      });

      const data = await response.json();
      if (response.ok || data.success) {
        setOtpSuccess(true);
        setTimeout(() => {
          setStep(3);
        }, 1000);
      } else {
        setOtpError(true);
      }
    } catch (err) {
      console.error(err);
      setOtpError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResendOtp) return;
    setCanResendOtp(false);
    setOtpTimer(90);
    setOtp(['', '', '', '', '', '']);
    setOtpError(false);

    try {
      await fetch(`${API_BASE}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleStep3Submit = async (e) => {
    e.preventDefault();
    if (!formData.phone.trim()) {
      setErrors(prev => ({ ...prev, phone: 'Phone number is required' }));
      return;
    }
    if (!cnicFrontFile || !cnicBackFile) {
      alert('Please upload both CNIC Front and CNIC Back images.');
      return;
    }

    setIsProcessingFiles(true);
    setOcrStatus(null);

    // Create Form data to submit
    const dataToSend = new FormData();
    dataToSend.append('email', formData.email);
    dataToSend.append('phone', formData.phone);
    dataToSend.append('country', formData.country);
    dataToSend.append('city', formData.city);
    dataToSend.append('cnicFront', cnicFrontFile);
    dataToSend.append('cnicBack', cnicBackFile);

    try {
      const response = await fetch(`${API_BASE}/auth/complete-info`, {
        method: 'POST',
        body: dataToSend
      });

      const result = await response.json();
      if (response.ok || result.success) {
        setOcrStatus('success');
        setOcrMessage('Identity successfully verified by OCR!');
        
        // Save auth token if returned
        if (result.token) {
          localStorage.setItem('authToken', result.token);
        }

        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setOcrStatus('error');
        setOcrMessage(result.message || 'OCR validation failed. Ensure image is clear.');
      }
    } catch (err) {
      console.error(err);
      setOcrStatus('error');
      setOcrMessage('Failed to connect to the server.');
    } finally {
      setIsProcessingFiles(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-20">
      <Navbar />

      {/* Main card outer wrapper with slow animation */}
      <div className="flex-1 flex items-center justify-center py-12 px-6 bg-gradient-to-br from-brandPrimary/5 via-background to-brandAccent/5">
        <div className="w-full max-w-[480px] neo-flat p-8 md:p-10 relative overflow-hidden">
          
          {/* Stepper Progress Bar */}
          <div className="mb-10">
            <div className="flex justify-between items-center relative mb-4">
              {/* Connecting line */}
              <div className="absolute top-1/2 left-0 w-full h-[3px] bg-cardBase -translate-y-1/2 z-0" />
              <motion.div 
                className="absolute top-1/2 left-0 h-[3px] bg-brandPrimary -translate-y-1/2 z-0 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: (step - 1) / 2 }}
                transition={{ duration: 0.4 }}
                style={{ width: '100%' }}
              />

              {/* Step pills */}
              {[1, 2, 3].map((num) => {
                const isActive = step === num;
                const isCompleted = step > num;
                return (
                  <div key={num} className="relative z-10">
                    <motion.div 
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                        isCompleted 
                          ? 'bg-success text-white shadow-neo' 
                          : isActive 
                            ? 'bg-brandPrimary text-white shadow-neo' 
                            : 'neo-pressed text-textSecondary'
                      }`}
                      animate={{ scale: isActive ? 1.15 : 1 }}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : num}
                    </motion.div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-between text-xs font-bold text-textSecondary px-1">
              <span>Basic Info</span>
              <span>Verification</span>
              <span>Complete Setup</span>
            </div>
          </div>

          {/* Form Content steps */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleStep1Submit}
                className="space-y-6"
              >
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-extrabold text-textPrimary">Join PakPorter</h2>
                  <p className="text-sm text-textSecondary font-semibold">Step 1: Set up your travel details login</p>
                </div>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
                      <input 
                        type="text" 
                        placeholder="John Doe" 
                        value={formData.fullName}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, fullName: e.target.value }));
                          validateField('fullName', e.target.value);
                        }}
                        onBlur={() => handleBlur('fullName')}
                        className="w-full pl-12 pr-10 py-3.5 neo-input"
                      />
                      {touched.fullName && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          {errors.fullName ? <AlertCircle className="w-5 h-5 text-error" /> : <Check className="w-5 h-5 text-success" />}
                        </div>
                      )}
                    </div>
                    {touched.fullName && errors.fullName && <p className="text-xs font-bold text-error">{errors.fullName}</p>}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
                      <input 
                        type="email" 
                        placeholder="john@example.com" 
                        value={formData.email}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, email: e.target.value }));
                          validateField('email', e.target.value);
                        }}
                        onBlur={() => handleBlur('email')}
                        className="w-full pl-12 pr-10 py-3.5 neo-input"
                      />
                      {touched.email && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          {errors.email ? <AlertCircle className="w-5 h-5 text-error" /> : <Check className="w-5 h-5 text-success" />}
                        </div>
                      )}
                    </div>
                    {touched.email && errors.email && <p className="text-xs font-bold text-error">{errors.email}</p>}
                  </div>

                  {/* CNIC Number */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">CNIC Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
                      <input 
                        type="text" 
                        placeholder="35201-1234567-1" 
                        value={formData.cnic}
                        onChange={handleCnicChange}
                        onBlur={() => handleBlur('cnic')}
                        className="w-full pl-12 pr-10 py-3.5 neo-input"
                      />
                      {touched.cnic && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          {errors.cnic ? <AlertCircle className="w-5 h-5 text-error" /> : <Check className="w-5 h-5 text-success" />}
                        </div>
                      )}
                    </div>
                    {touched.cnic && errors.cnic && <p className="text-xs font-bold text-error">{errors.cnic}</p>}
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="••••••••" 
                        value={formData.password}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, password: e.target.value }));
                          validateField('password', e.target.value);
                        }}
                        onBlur={() => handleBlur('password')}
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
                    {touched.password && errors.password && <p className="text-xs font-bold text-error">{errors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
                      <input 
                        type={showConfirmPassword ? 'text' : 'password'} 
                        placeholder="••••••••" 
                        value={formData.confirmPassword}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, confirmPassword: e.target.value }));
                          validateField('confirmPassword', e.target.value);
                        }}
                        onBlur={() => handleBlur('confirmPassword')}
                        className="w-full pl-12 pr-12 py-3.5 neo-input"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-textSecondary"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {touched.confirmPassword && errors.confirmPassword && <p className="text-xs font-bold text-error">{errors.confirmPassword}</p>}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-4 neo-button-brand font-bold text-base mt-2 flex items-center justify-center space-x-2"
                >
                  {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <span>Continue</span>}
                </button>

                <p className="text-center text-sm font-semibold text-textSecondary">
                  Already have an account? <Link to="/login" className="text-brandPrimary hover:underline">Login</Link>
                </p>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleStep2Submit}
                className="space-y-6"
              >
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-extrabold text-textPrimary">Verify Email</h2>
                  <p className="text-sm text-textSecondary font-semibold">Enter the 6-digit OTP code sent to your email.</p>
                </div>

                {/* OTP input boxes */}
                <div className="flex justify-between gap-2 max-w-[320px] mx-auto py-4">
                  {otp.map((digit, idx) => (
                    <motion.input
                      key={idx}
                      ref={el => otpInputsRef.current[idx] = el}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className={`w-11 h-12 text-center text-xl font-bold neo-input border-2 ${
                        otpError 
                          ? 'border-error bg-error/5 animate-[shake_0.4s_ease-in-out]' 
                          : otpSuccess 
                            ? 'border-success bg-success/5 animate-[pulse_0.4s_ease]' 
                            : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>

                <div className="text-center space-y-4">
                  <p className="text-sm font-semibold text-textSecondary">
                    {formatTimer(otpTimer)}
                  </p>
                  
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={!canResendOtp}
                    className={`text-sm font-bold flex items-center space-x-1 mx-auto ${
                      canResendOtp 
                        ? 'text-brandPrimary hover:underline' 
                        : 'text-textSecondary opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Resend OTP</span>
                  </button>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading || otp.join('').length !== 6}
                  className="w-full py-4 neo-button-brand font-bold text-base"
                >
                  {isLoading ? <RefreshCw className="w-5 h-5 animate-spin mx-auto" /> : <span>Verify OTP</span>}
                </button>
              </motion.form>
            )}

            {step === 3 && (
              <motion.form 
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleStep3Submit}
                className="space-y-6"
              >
                <div className="space-y-2 text-center">
                  <h2 className="text-3xl font-extrabold text-textPrimary">Complete Profile</h2>
                  <p className="text-sm text-textSecondary font-semibold">Upload your identity proof to start verifying.</p>
                </div>

                <div className="space-y-4">
                  {/* Phone Number */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
                      <input 
                        type="text" 
                        placeholder="+92 300 1234567" 
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        onBlur={() => handleBlur('phone')}
                        className="w-full pl-12 pr-4 py-3.5 neo-input"
                      />
                    </div>
                    {errors.phone && <p className="text-xs font-bold text-error">{errors.phone}</p>}
                  </div>

                  {/* City Select */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">City</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
                      <select 
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full pl-12 pr-4 py-3.5 neo-input appearance-none"
                      >
                        <option value="Lahore">Lahore</option>
                        <option value="Karachi">Karachi</option>
                        <option value="Islamabad">Islamabad</option>
                        <option value="Rawalpindi">Rawalpindi</option>
                        <option value="Faisalabad">Faisalabad</option>
                        <option value="Multan">Multan</option>
                        <option value="Peshawar">Peshawar</option>
                        <option value="Quetta">Quetta</option>
                      </select>
                    </div>
                  </div>

                  {/* Country Select (Auto Filled Pakistan) */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-textSecondary uppercase tracking-wider">Country</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" />
                      <input 
                        type="text" 
                        value={formData.country} 
                        disabled 
                        className="w-full pl-12 pr-4 py-3.5 neo-input opacity-70 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* CNIC Upload Section */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-textSecondary uppercase tracking-wider block mb-2">Upload CNIC Proof</label>
                    <div className="grid grid-cols-2 gap-4">
                      {/* CNIC Front */}
                      <label className="neo-pressed p-4 flex flex-col items-center justify-center text-center cursor-pointer aspect-video relative overflow-hidden group">
                        {previews.front ? (
                          <>
                            <img src={previews.front} alt="CNIC Front" className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Upload className="w-6 h-6 text-white" />
                            </div>
                          </>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-textSecondary mb-1" />
                            <span className="text-[10px] font-bold text-textSecondary uppercase">CNIC Front</span>
                          </>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'front')} />
                      </label>

                      {/* CNIC Back */}
                      <label className="neo-pressed p-4 flex flex-col items-center justify-center text-center cursor-pointer aspect-video relative overflow-hidden group">
                        {previews.back ? (
                          <>
                            <img src={previews.back} alt="CNIC Back" className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Upload className="w-6 h-6 text-white" />
                            </div>
                          </>
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-textSecondary mb-1" />
                            <span className="text-[10px] font-bold text-textSecondary uppercase">CNIC Back</span>
                          </>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'back')} />
                      </label>
                    </div>
                  </div>
                </div>

                {/* File Upload Processing Anim & Status result */}
                {isProcessingFiles && (
                  <div className="neo-pressed p-4 flex items-center justify-center space-x-3 text-brandPrimary">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span className="text-xs font-bold uppercase tracking-wider">Processing OCR Verification...</span>
                  </div>
                )}

                {ocrStatus && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`neo-flat p-4 flex items-start space-x-3 ${ocrStatus === 'success' ? 'bg-success/5 text-success' : 'bg-error/5 text-error'}`}
                  >
                    {ocrStatus === 'success' ? <Check className="w-5 h-5 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                    <div className="text-xs font-semibold">
                      <span className="font-extrabold uppercase tracking-wide block">
                        {ocrStatus === 'success' ? 'Verification Success' : 'Verification Failed'}
                      </span>
                      <p className="mt-0.5">{ocrMessage}</p>
                    </div>
                  </motion.div>
                )}

                <button 
                  type="submit" 
                  disabled={isProcessingFiles || isLoading}
                  className="w-full py-4 neo-button-brand font-bold text-base"
                >
                  Complete Setup
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Signup;
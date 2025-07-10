import React, { useState, useEffect } from 'react';
import { Check, ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PakPorterOTPScreen = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  const step = localStorage.getItem("step");
  const pendingEmail = localStorage.getItem("pendingEmail");
  if (step !== "otp" || !pendingEmail) {
    navigate("/signup");
  }
}, [navigate]);
  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleResendOTP = async () => {
    const email = localStorage.getItem("pendingEmail");
    setIsResending(true);
    try {
      const response = await fetch("http://localhost:5000/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      alert(result.message);
    } catch (err) {
      alert("Error resending OTP");
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async () => {
    const enteredOTP = otp.join('');
    const email = localStorage.getItem("pendingEmail");

    try {
      const response = await fetch("http://localhost:5000/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: enteredOTP }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert("✅ OTP verified successfully!");
        navigate("/signup/completion");
      } else {
        alert("❌ " + result.message);
      }
    } catch (error) {
      alert("Server error during OTP verification.");
    }
  
  };

  const handleBack = () => {
    localStorage.setItem("step", "signup");
    navigate("/signup");
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute top-1/2 right-10 w-48 h-48 bg-white/5 rounded-full"></div>

        <div className="flex flex-col justify-center px-12 relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4">PakPorter</h1>
          <p className="text-xl text-white/90 mb-8">Pakistan's Premier Delivery Network</p>
          <div className="space-y-4">
            {["Fast & Reliable Delivery", "Real-time Tracking", "Secure & Trusted"].map((text, i) => (
              <div key={i} className="flex items-center text-white/90">
                <Check className="w-5 h-5 mr-3 text-green-300" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - OTP Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          {/* Form Container */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Verify Your Email</h2>
              <p className="text-gray-600 mb-1">Enter the 6-digit code sent to</p>
              <p className="text-gray-900 font-medium">{localStorage.getItem("pendingEmail")}</p>
            </div>

            {/* OTP Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Verification Code
              </label>
              <div className="flex space-x-3 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  />
                ))}
              </div>
            </div>

            {/* Resend OTP */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
              <button
                onClick={handleResendOTP}
                disabled={isResending}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors disabled:opacity-50"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                    Resending...
                  </>
                ) : (
                  'Resend OTP'
                )}
              </button>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={!isOtpComplete}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${isOtpComplete
                ? 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
                : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
              Verify
            </button>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center mt-6">
              By continuing, you agree to our{' '}
              {/* <a href="#" className="text-blue-600 hover:text-blue-700">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700">
                Privacy Policy
              </a>. */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PakPorterOTPScreen;

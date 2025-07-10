import  { useState, useEffect } from 'react';
import { Upload, CheckCircle, User, Mail, Phone, MapPin, Globe, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const PakPorterSignupFinal = () => {
  const [formData, setFormData] = useState({
    phone: '',
    country: '',
    city: '',
    cnicFront: null,
    cnicBack: null
  });
  const navigate = useNavigate();
  const [previews, setPreviews] = useState({
    cnicFront: null,
    cnicBack: null
  });
  
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Mock previous step data (in real app, this would come from localStorage or context)
  useEffect(() => {
    // Simulate fetching user data from previous steps
    const mockUserData = {
  name: localStorage.getItem("pendingName") || "Unknown",
  email: localStorage.getItem("pendingEmail") || "Unknown"
};

    
    // In real implementation, check if previous steps completed
    // If not, redirect to /signup
    setUserInfo(mockUserData);
  }, []);

  const countries = [
    'Pakistan', 'United States', 'United Kingdom', 'Canada', 'Australia', 
    'Germany', 'France', 'UAE', 'Saudi Arabia', 'Turkey'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          [type]: 'Please upload a valid image file'
        }));
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [type]: 'File size must be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        [type]: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => ({
          ...prev,
          [type]: e.target.result
        }));
      };
      reader.readAsDataURL(file);
      
      // Clear error
      setErrors(prev => ({
        ...prev,
        [type]: ''
      }));
    }
    
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.country) {
      newErrors.country = 'Country is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.cnicFront) {
      newErrors.cnicFront = 'CNIC front image is required';
    }
    
    if (!formData.cnicBack) {
      newErrors.cnicBack = 'CNIC back image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  setIsSubmitting(true);
  
  try {
    const submitData = new FormData();
    submitData.append('phone', formData.phone);
    submitData.append('country', formData.country);
    submitData.append('city', formData.city);
    submitData.append('cnicFront', formData.cnicFront);
    submitData.append('cnicBack', formData.cnicBack);
    submitData.append('email', userInfo.email);
    submitData.append('fullName', userInfo.name);
    submitData.append('password', localStorage.getItem('pendingPassword'));
    submitData.append('cnicNumber', localStorage.getItem('pendingCnic'));

    const response = await fetch('http://localhost:5000/auth/complete-info', {
      method: 'POST',
      body: submitData
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Server error');
    }

    // Clear localStorage after successful signup
    localStorage.removeItem("signupData");
    localStorage.removeItem("pendingName");
    localStorage.removeItem("pendingEmail");
    localStorage.removeItem("pendingPassword");
    localStorage.removeItem("pendingCnic");
    localStorage.removeItem("step");

    alert('Signup completed successfully! Welcome to PakPorter!');
    navigate("/login"); // Redirect to login page after completion
  } catch (error) {
    console.error('Submission error:', error);
    alert('An error occurred. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};
 useEffect(() => {
  const step = localStorage.getItem("step");
  const pendingEmail = localStorage.getItem("pendingEmail");
  const pendingName = localStorage.getItem("pendingName");
  if (step !== "otp" || !pendingEmail || !pendingName) {
    navigate("/signup");
  } else {
    setUserInfo({
      name: pendingName,
      email: pendingEmail
    });
  }
}, [navigate]);
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full">
              <User className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600">Final step to join PakPorter community</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step 3 of 3</span>
            <span className="text-sm font-semibold text-blue-600">100%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300" style={{width: '100%'}}></div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Account Details Verified</h3>
              <div className="flex items-center space-x-4 mt-1">
                <span className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-1" />
                  {userInfo.name}
                </span>
                <span className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-1" />
                  {userInfo.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+92 300 1234567"
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                  errors.phone 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
              {errors.phone && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="w-4 h-4 mr-1">⚠️</span>
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Country and City Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    errors.country 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                {errors.country && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="w-4 h-4 mr-1">⚠️</span>
                    {errors.country}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter your city"
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    errors.city 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-200 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                />
                {errors.city && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="w-4 h-4 mr-1">⚠️</span>
                    {errors.city}
                  </p>
                )}
              </div>
            </div>

            {/* CNIC Upload Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Camera className="w-5 h-5 mr-2" />
                CNIC Verification
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CNIC Front */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CNIC Front Side
                  </label>
                  <div className={`relative border-2 border-dashed rounded-xl p-4 transition-all duration-200 ${
                    errors.cnicFront 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                  }`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'cnicFront')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {previews.cnicFront ? (
                      <div className="text-center">
                        <img 
                          src={previews.cnicFront} 
                          alt="CNIC Front" 
                          className="mx-auto h-20 w-32 object-cover rounded-lg mb-2"
                        />
                        <p className="text-sm text-green-600 font-medium">✓ Image uploaded</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Click to upload</p>
                      </div>
                    )}
                  </div>
                  {errors.cnicFront && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="w-4 h-4 mr-1">⚠️</span>
                      {errors.cnicFront}
                    </p>
                  )}
                </div>

                {/* CNIC Back */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CNIC Back Side
                  </label>
                  <div className={`relative border-2 border-dashed rounded-xl p-4 transition-all duration-200 ${
                    errors.cnicBack 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                  }`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'cnicBack')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {previews.cnicBack ? (
                      <div className="text-center">
                        <img 
                          src={previews.cnicBack} 
                          alt="CNIC Back" 
                          className="mx-auto h-20 w-32 object-cover rounded-lg mb-2"
                        />
                        <p className="text-sm text-green-600 font-medium">✓ Image uploaded</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Click to upload</p>
                      </div>
                    )}
                  </div>
                  {errors.cnicBack && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="w-4 h-4 mr-1">⚠️</span>
                      {errors.cnicBack}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Finish Signup
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-800 text-center">
            <span className="font-semibold">🔒 Your information is secure.</span> We use industry-standard encryption to protect your data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PakPorterSignupFinal;
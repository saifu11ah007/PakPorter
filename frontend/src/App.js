import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import OTP from './pages/OTP';
import CompleteSignup from './pages/Complete-Signup';
import PakPorterHomepage from './pages/home.js';
import Login from './pages/Login.js';
import AdminLogin from './pages/AdminLogin.js';
import AdminDashboard from './pages/AdminDashboard.js';
import RequireAdminAuth from './utils/RequireAdminAuth.js';
import WishDetailPage from './pages/ProductDetail.js';
import BidForm from './pages/BidSubmission.js';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';

// Redesigned pages
import Dashboard from './pages/Dashboard';
import PostWish from './pages/PostWish';
import Browse from './pages/Browse';
import Trips from './pages/Trips';
import Profile from './pages/Profile';

// Redirect logged-in users away from login/signup
const RedirectIfLoggedIn = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('authToken');
  return isLoggedIn ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
           <Route path="/admin/login" element={<AdminLogin />} />
           <Route 
            path="/admin/dashboard" 
            element={
              <RequireAdminAuth>
                <AdminDashboard />
              </RequireAdminAuth>
            } 
          />
          <Route path="/" element={<PakPorterHomepage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          <Route path="/post-wish" element={<PostWish />} />
          <Route path="/product/wish/post" element={<PostWish />} />
          
          <Route path="/browse" element={<Browse />} />
          <Route path="/wishes" element={<Browse />} />
          
          <Route path="/trips" element={<Trips />} />
          
          <Route path="/profile" element={<Profile />} />
          <Route path="/user/profile" element={<Profile />} />

          <Route path="/wish/:id" element={<WishDetailPage />} />
          <Route path="/bid/:id" element={<BidForm />} />
          
          <Route
            path="/login"
            element={
              <RedirectIfLoggedIn>
                <Login />
              </RedirectIfLoggedIn>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectIfLoggedIn>
                <Signup />
              </RedirectIfLoggedIn>
            }
          />
          <Route path="/otp" element={<OTP />} />
          <Route path="/signup/completion" element={<CompleteSignup />} />
        </Routes>
        <ThemeToggle />
      </Router>
    </ThemeProvider>
  );
}

export default App; 
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import OTP from './pages/OTP';
import CompleteSignup from './pages/Complete-Signup';
import PakPorterHomepage from './pages/home.js';
import PakPorterLogin from './pages/Login.js';
import AdminLogin from './pages/AdminLogin.js';
import AdminDashboard from './pages/AdminDashboard.js';
import RequireAdminAuth from './utils/RequireAdminAuth.js';
import UserProfile from './pages/UserProfile.js';
import PostWish from './pages/ProductWish.js';
import MyWishesPage from './pages/mywishes.js';
// Redirect logged-in users away from login/signup
const RedirectIfLoggedIn = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('authToken');
  return isLoggedIn ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <Router>
      <Routes>
         <Route path="/admin/login" element={<AdminLogin />} />
         <Route path="/user/profile" element={<UserProfile />} />
         <Route 
          path="/admin/dashboard" 
          element={
            <RequireAdminAuth>
              <AdminDashboard />
            </RequireAdminAuth>
          } 
        />
        <Route path="/" element={<PakPorterHomepage />} />
        <Route path="/product/wish/post" element={<PostWish />} />
        <Route path="/wishes" element={<MyWishesPage />} />
        <Route
          path="/login"
          element={
            <RedirectIfLoggedIn>
              <PakPorterLogin />
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
    </Router>
  );
}

export default App; 
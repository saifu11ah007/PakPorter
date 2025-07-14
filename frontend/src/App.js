import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import OTP from './pages/OTP';
import CompleteSignup from './pages/Complete-Signup';
import PakPorterHomepage from './pages/home.js';
import PakPorterLogin from './pages/Login.js';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import RequireAdminAuth from './utils/RequireAdminAuth';
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
         <Route 
          path="/admin/dashboard" 
          element={
            <RequireAdminAuth>
              <AdminDashboard />
            </RequireAdminAuth>
          } 
        />
        <Route path="/" element={<PakPorterHomepage />} />
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
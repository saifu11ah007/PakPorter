import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import OTP from './pages/OTP';
import CompleteSignup from './pages/Complete-Signup';
import PakPorterHomepage from './pages/home.js';
import PakPorterLogin from './pages/Login.js';

// Redirect logged-in users away from login/signup
const RedirectIfLoggedIn = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('authToken');
  return isLoggedIn ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <Router>
      <Routes>
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
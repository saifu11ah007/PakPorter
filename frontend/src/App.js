import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import OTP from './pages/OTP';
import CompleteSignup from './pages/Complete-Signup';
import PakPorterHomepage from './pages/home.js'; 
import PakPorterLogin from './pages/Login.js';
import ProtectedRoute from './utils/ProtectedRoutes.js';
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoute />}>
        <Route path="/" element={<PakPorterHomepage />} />
      </Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<PakPorterLogin />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/signup/completion" element={<CompleteSignup />} />
      </Routes>
    </Router>
  );
}

export default App;

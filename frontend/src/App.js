import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import OTP from './pages/OTP';
import CompleteSignup from './pages/Complete-Signup';
import PakPorterHomepage from './pages/home.js'; 
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PakPorterHomepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/signup/completion" element={<CompleteSignup />} />
      </Routes>
    </Router>
  );
}

export default App;

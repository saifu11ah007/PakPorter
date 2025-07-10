// --- [2] UPDATED AuthController.js ---
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmailOTP from '../config/OTP.js';

const otpMemory = {}; // Temporary in-memory store

const signup = async (req, res) => {
  try {
    const { email, fullName, password, cnicNumber } = req.body;
    if (!email || !fullName || !password || !cnicNumber) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check for existing email
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    // Check for existing CNIC
    const existingUserByCnic = await User.findOne({ cnicNumber });
    if (existingUserByCnic) {
      return res.status(409).json({ success: false, message: 'CNIC number already exists' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpMemory[email] = { otp, fullName, email, password, cnicNumber };
    await sendEmailOTP(email, otp);
    return res.status(200).json({ success: true, message: 'OTP sent to email' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Signup error', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(403).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const sendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    if (!otpMemory[email]) otpMemory[email] = {};
    otpMemory[email].otp = otp;
    await sendEmailOTP(email, otp);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'OTP sending failed', error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    if (!otpMemory[email] || otpMemory[email].otp !== otp) {
      return res.status(400).json({ success: false, message: 'Incorrect OTP' });
    }
    otpMemory[email].verified = true;
    res.status(200).json({ success: true, message: 'OTP verified' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const resendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    if (!otpMemory[email]) {
      return res.status(404).json({ message: 'No OTP request found for this email' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpMemory[email].otp = otp;
    await sendEmailOTP(email, otp);
    res.status(200).json({ message: 'OTP resent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Resend OTP failed', error: error.message });
  }
};

 const completeSignup = async (req, res) => {
         try {
           const { email, phone, country, city } = req.body;
           const cnicFront = req.files?.cnicFront?.[0]?.key;
           const cnicBack = req.files?.cnicBack?.[0]?.key;

           const user = await User.findOneAndUpdate(
             { email },
             {
               phone,
               country,
               city,
               cnicFront,
               cnicBack,
               isVerified: true
             },
             { new: true }
           );

           if (!user) {
             return res.status(404).json({ success: false, message: 'User not found' });
           }

           res.status(200).json({ success: true, message: 'User created' });
         } catch (error) {
           console.error('Complete signup error:', error);
           res.status(500).json({ success: false, message: 'Server error', error: error.message });
         }
       };

export { signup, login, sendOTP, verifyOTP, resendOTP, completeSignup };

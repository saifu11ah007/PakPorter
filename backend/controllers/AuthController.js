// AuthController.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sendEmailOTP from '../config/OTP.js';
import { createWorker } from 'tesseract.js';
import stringSimilarity from 'string-similarity';
import path from 'path';

const otpMemory = {}; // in-memory store for OTP and signup data

// Signup: creates OTP and stores pending user data
const signup = async (req, res) => {
  try {
    const { email, fullName, password, cnicNumber } = req.body;
    if (!email || !fullName || !password || !cnicNumber) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    const existingUserByCnic = await User.findOne({ cnicNumber });
    if (existingUserByCnic) {
      return res.status(409).json({ success: false, message: 'CNIC number already exists' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpMemory[email] = { otp, fullName, email, password, cnicNumber };
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await sendEmailOTP(email, otp);
      console.log('✅ OTP email sent to', email);
    } else {
      console.warn('⚠️ EMAIL_USER / EMAIL_PASS not configured – skipping real email send');
    }
    return res.status(200).json({ success: true, message: 'OTP sent (email skipped in dev)' });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ success: false, message: 'Signup error', error: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Generated token payload:', { _id: user._id });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Send OTP (used for resending)
const sendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    if (!otpMemory[email]) otpMemory[email] = {};
    otpMemory[email].otp = otp;
    await sendEmailOTP(email, otp);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'OTP sending failed', error: error.message });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    if (!otpMemory[email] || otpMemory[email].otp !== otp) {
      return res.status(400).json({ success: false, message: 'Incorrect OTP' });
    }
    otpMemory[email].verified = true;
    res.status(200).json({ success: true, message: 'OTP verified' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Resend OTP
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
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Resend OTP failed', error: error.message });
  }
};

// Complete signup with CNIC OCR verification
const completeSignup = async (req, res) => {
  try {
    const { email, phone, country, city } = req.body;
    const cnicFront = req.files?.cnicFront?.[0]?.key; // Vercel Blob URL
    const cnicBack = req.files?.cnicBack?.[0]?.key;

    const pendingUser = otpMemory[email];
    if (!pendingUser || !pendingUser.verified) {
      return res.status(400).json({ message: 'OTP not verified or missing data' });
    }

    // Fetch CNIC front image
    const imageResponse = await fetch(cnicFront);
    if (!imageResponse.ok) {
      return res.status(400).json({ success: false, message: 'Unable to fetch CNIC image' });
    }
    const imageBuffer = await imageResponse.arrayBuffer();

    // OCR with tesseract.js worker – custom corePath for Vercel
    const wasmPath = path.resolve(__dirname, '..', 'tesseract', 'tesseract-core-relaxedsimd.wasm');
    const worker = createWorker({ corePath: wasmPath });
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text: rawOcrText } } = await worker.recognize(Buffer.from(imageBuffer));
    await worker.terminate();
    // 1️⃣ Clean the OCR output – remove non‑ASCII characters and normalize whitespace
    const ocrText = rawOcrText.replace(/[^\x00-\x7F]/g, '').replace(/[\r\n]+/g, '\n');
    console.log('🧠 OCR Text:', ocrText);

    // 2️⃣ Landmark checks (kept for original validation logic)
    const hasPakistan = /Pakistan/i.test(ocrText);
    const hasNameKeyword = /Name/i.test(ocrText);
    const hasCNIC = /\d{5}-\d{7}-\d/.test(ocrText) || /\d{13}/.test(ocrText);
    const hasDobOrId = /Date of Birth|Identity Number/i.test(ocrText);

    // 3️⃣ Robust CNIC extraction – try hyphenated then plain 13‑digit format
    let extractedCnic = null;
    const hyphenMatch = ocrText.match(/\d{5}-\d{7}-\d/);
    if (hyphenMatch) {
      extractedCnic = hyphenMatch[0];
    } else {
      const plainMatch = ocrText.match(/\b\d{13}\b/);
      if (plainMatch) {
        const digits = plainMatch[0];
        // Re‑format to 5‑7‑1 pattern
        extractedCnic = `${digits.slice(0,5)}-${digits.slice(5,12)}-${digits.slice(12)}`;
      }
    }
    console.log('🔎 Extracted CNIC:', extractedCnic);

    // 4️⃣ Name extraction – first try label based, then fallback to similarity with the submitted full name
    let extractedName = '';
    // a) Simple label scan (Name, Name:, Name‑)
    for (let i = 0; i < ocrText.split('\n').length; i++) {
      const line = ocrText.split('\n')[i].trim();
      const colonMatch = line.match(/^Name\s*[:\-]?\s*(.*)$/i);
      if (colonMatch && colonMatch[1]) {
        extractedName = colonMatch[1].trim();
        break;
      }
      if (/^Name$/i.test(line) && i + 1 < ocrText.split('\n').length) {
        extractedName = ocrText.split('\n')[i + 1].trim();
        break;
      }
    }
    // b) If still empty, use fuzzy matching against the original full name
    if (!extractedName) {
      const linesArray = ocrText.split('\n').map(l => l.trim()).filter(l => l);
      const similarityScores = linesArray.map(l => stringSimilarity.compareTwoStrings(l.toLowerCase(), pendingUser.fullName.toLowerCase()));
      const bestIdx = similarityScores.reduce((best, score, idx) => (score > best.score ? { idx, score } : best), { idx: -1, score: 0 }).idx;
      if (bestIdx !== -1 && similarityScores[bestIdx] > 0.5) {
        extractedName = linesArray[bestIdx];
      }
    }
    // c) Clean up any stray punctuation from OCR artefacts
    extractedName = extractedName.replace(/[^A-Za-z\s\-]/g, '').trim();
    console.log('👤 Extracted Name:', extractedName);

    if (!hasPakistan || !hasNameKeyword || !hasCNIC || !hasDobOrId) {
      return res.status(400).json({
        success: false,
        message: 'CNIC image does not contain required landmarks. Please upload a clearer image.'
      });
    }




    // Verify CNIC number matches the one provided earlier
    if (extractedCnic !== pendingUser.cnicNumber) {
      return res.status(400).json({ success: false, message: 'The CNIC number extracted from the image does not match the CNIC you entered. Please ensure the uploaded image is clear and the numbers are correct.' });
    }

    // Fuzzy name similarity (threshold 0.75)
    const similarity = stringSimilarity.compareTwoStrings(pendingUser.fullName.toLowerCase(), extractedName.toLowerCase());
    if (similarity < 0.75) {
      return res.status(400).json({ success: false, message: 'The name on the CNIC image does not closely match the full name you provided. Please verify the image or correct the name.' });
    }

    // All checks passed – create verified user
    const isVerified = true;
    const hashedPassword = await bcrypt.hash(pendingUser.password, 10);
    const user = new User({
      fullName: pendingUser.fullName,
      email: pendingUser.email,
      password: hashedPassword,
      cnicNumber: pendingUser.cnicNumber,
      phone,
      country,
      city,
      isVerified,
      cnicFront,
      cnicBack
    });

    await user.save();
    delete otpMemory[email];
    res.status(200).json({ success: true, message: 'User created', isVerified });
  } catch (error) {
    console.error('Complete signup error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export { signup, login, sendOTP, verifyOTP, resendOTP, completeSignup };

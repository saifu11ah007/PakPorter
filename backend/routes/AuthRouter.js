import express from 'express';
import { signup, verifyOTP, resendOTP, completeSignup, login } from '../controllers/AuthController.js';
import { verifyUser, getAllUsers } from '../controllers/AdminController.js';

import upload, { saveToBlob } from '../middleware/upload.js';
const router = express.Router();

router.post('/send-otp', signup);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/complete-info', upload, saveToBlob, completeSignup);
router.post('/login', login);
router.get('/users', getAllUsers);
router.put('/verify-user/:id', verifyUser);


export default router;
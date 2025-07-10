import { signup, login, verifyOTP, resendOTP, completeSignup } from '../controllers/AuthController.js';
import upload from '../middleware/upload.js';
import express from 'express';

const router = express.Router();

router.post('/login', login);
router.post('/send-otp', signup);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/complete-info', upload.fields([{ name: 'cnicFront' }, { name: 'cnicBack' }]), completeSignup);

export default router;
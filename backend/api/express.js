import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import AuthRouter from '../routes/AuthRouter.js';
import serverless from 'serverless-http';
import WishRouter from '../routes/WishRouter.js';
import Bid from '../models/BId.js';
import BidRouter from '../routes/BidRouter.js';
import ScraperRouter from '../routes/ScraperRouter.js';

dotenv.config();
const app = express();

app.use(express.json());

// CORS origins are driven by the CORS_ORIGINS env var (comma‑separated).
const allowedOrigins = process.env.CORS_ORIGINS?.split(',').map(o => o.trim()) || [];
app.use(cors({
  origin: function (origin, callback) {
    // allow non‑browser requests (no origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // reject other origins – Vercel will still handle production via env config
    return callback(null, false);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Database connection lazy-loader for serverless environment
const connectDBWithRetry = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  try {
    await connectDB();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
};

app.use(async (req, res, next) => {
  try {
    await connectDBWithRetry();
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Database connection failed. Please check backend environment variables or network whitelist.',
      error: error.message,
    });
  }
});

app.get('/', (req, res) => res.send('PakPorter'));

app.use('/auth', AuthRouter);
app.use('/wish', WishRouter);
app.use('/bids', BidRouter);
app.use('/scraper', ScraperRouter);

export default app;
export const handler = serverless(app);
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import bodyParser from 'body-parser';
import AuthRouter from './routes/AuthRouter.js';
import sendEmailOTP from './config/OTP.js';
import WishRouter from './routes/WishRouter.js';
import BidRouter from './routes/BidRouter.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// added cors to env
app.use(bodyParser.json());
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // fallback to default for other origins (e.g., production)
    return callback(null, true); // allow all in production
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use('/uploads', express.static('uploads')); // Serve uploaded images
app.get('/', (req, res) => res.send('PakPorter'));
async function startServer() {
  try {
    await connectDB(); // Runs after dotenv.config()
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}
app.use('/auth', AuthRouter);
app.use('/wish', WishRouter);
app.use('/bids', BidRouter);
startServer();

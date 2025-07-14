import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import bodyParser  from 'body-parser';
import AuthRouter from './routes/AuthRouter.js';
import sendEmailOTP from './config/OTP.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors({ origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
app.use('/auth',AuthRouter)

startServer();

import express from 'express';
       import cors from 'cors';
       import dotenv from 'dotenv';
       import connectDB from '../config/db.js';
       import AuthRouter from '../routes/AuthRouter.js';
       import serverless from 'serverless-http';
import WishRouter from '../routes/WishRouter.js';
import Bid from '../models/BId.js';
       dotenv.config();
       const app = express();

       app.use(express.json());
       app.use(cors({ 
         origin: 'https://pakporter-fyp.netlify.app',
         methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
          credentials: true
       }));
       app.get('/', (req, res) => res.send('PakPorter'));

       app.use('/auth', AuthRouter);
      app.use('/wish',WishRouter);
       async function startServer() {
         try {
           await connectDB();
           console.log('Connected to MongoDB');
         } catch (error) {
           console.error('Failed to connect to MongoDB:', error);
           process.exit(1);
         }
       }

       startServer();

       export default app;
       export const handler = serverless(app);
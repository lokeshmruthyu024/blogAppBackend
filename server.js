import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';
import authRoutes from './routes/auth.routes.js';
import postRoutes from './routes/post.routes.js';
import cors from 'cors';

import connectMongoDB from './db/connectMongo.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:3004',
  'https://blogapplokesh.netlify.app',
  'https://omnifyfrontend.onrender.com'
];

// ✅ CORS with debug logging
app.use(cors({
  origin: function (origin, callback) {
    console.log('🔍 Incoming origin:', origin);
    if (!origin) {
      console.log('✅ No origin (likely Postman or curl), allowing');
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ Allowed origin: ${origin}`);
      return callback(null, true);
    } else {
      console.warn(`❌ Blocked origin: ${origin}`);
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
  },
  credentials: true
}));

// ✅ Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the Blog API');
});

// ✅ Cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// ✅ Start server and connect DB
app.listen(PORT, () => {
  console.log(`✅ Server ready on port ${PORT}`);
  connectMongoDB();
});

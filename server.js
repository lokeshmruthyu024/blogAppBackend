import express from 'express'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary'
import authRoutes from './routes/auth.routes.js'
import postRoutes from './routes/post.routes.js';
import cors from 'cors';

import connectMongoDB from './db/connectMongo.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004',               // local dev frontend
  'https://blogapplokesh.netlify.app/' // replace with your actual Netlify URL
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin like Postman or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Allow cookies/auth headers to be sent
}));

app.get('/', (req, res) => {
  res.send('Welcome to the Blog API');
})

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
app.use(cookieParser());



app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.listen(PORT, () => {
  console.log(`Server ready in ${PORT}`);
  connectMongoDB();
})

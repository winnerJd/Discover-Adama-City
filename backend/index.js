import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoute.js';
import categoryRoutes from './routes/categoryRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import aiRoutes from './routes/ai.js';
import connectDB from './config/db.js';

// Load env variables
dotenv.config();

const app = express();
const __dirname = path.resolve();

// CORS config
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:8081',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://discover-adama-city.vercel.app', // your deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all origins for now, can restrict later
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
  })
);

// Handle preflight requests
app.options('*', cors());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Add CORS headers for static files (images/videos)
// Note: Static files don't need credentials, so we can use more permissive CORS
app.use('/api/uploads', (req, res, next) => {
  const origin = req.headers.origin;
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    // Allow from any origin in allowed list, or allow all if list is empty
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (allowedOrigins.length === 0) {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
    return res.sendStatus(200);
  }
  
  // For GET requests, set CORS headers
  if (origin) {
    if (allowedOrigins.includes(origin)) {
      // Use specific origin when in allowed list
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (allowedOrigins.length === 0) {
      // Allow all origins if no restrictions
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
  } else {
    // No origin header - likely same-origin or direct access, allow it
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  // Expose headers that might be needed
  res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Type, Content-Disposition');
  
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/ai', aiRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Discover Adama City API is running...');
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

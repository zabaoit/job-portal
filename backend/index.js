import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors"
import dotenv from 'dotenv';
import connectDB from './utils/db.js';

// Load environment variables from .env into process.env
dotenv.config({});

// Create Express application instance
const app = express();

// Parse JSON request body
app.use(express.json());
// Parse URL-encoded form body
app.use(express.urlencoded({ extended: true }));
// Parse cookie header into req.cookies
app.use(cookieParser());

// CORS configuration for frontend app
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true, // Allow cookies to be sent
};
app.use(cors(corsOptions));

// Use env port if provided, fallback to 3000
const PORT = process.env.PORT || 3000;

// Start HTTP server and connect to MongoDB
app.listen(PORT, () => {
    connectDB();
  console.log(`Server is running on port ${PORT}`);
});

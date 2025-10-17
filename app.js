import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import MongodbConnect from "./config/db.js";
import probRouter from './routes/problemRouter.js';
import authRouter from './routes/authRouter.js';
import problemListRouter from './routes/problemListRouter.js';
import userRouter from './routes/userRouter.js';

const app = express();

// Connect to MongoDB
MongodbConnect();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter); // User management (delete account, stats)
app.use('/api', problemListRouter); // Problem and list management
app.use(probRouter); // Legacy problem schedule routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

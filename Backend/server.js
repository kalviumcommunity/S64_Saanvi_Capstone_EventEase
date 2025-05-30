const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const multer = require('multer');
const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const budgetItem = require("./routes/budgetItem");
// const reviewRoutes = require("./routes/reviewRoutes");
const guestRoutes = require("./routes/guestsRoutes");
const dashboard = require("./routes/Dashboard");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Increase payload size limit for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadDir = path.resolve(__dirname, 'uploads');
const profileUploadDir = path.resolve(uploadDir, 'profiles');

console.log('Server upload directory:', uploadDir);
console.log('Server profiles directory:', profileUploadDir);

if (!fs.existsSync(uploadDir)) {
  console.log('Creating server uploads directory');
  fs.mkdirSync(uploadDir);
}
if (!fs.existsSync(profileUploadDir)) {
  console.log('Creating server profiles directory');
  fs.mkdirSync(profileUploadDir);
}

// Serve static files from uploads directory
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Define routes
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/budget", budgetItem);
// app.use("/api/reviews", reviewRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/dashboard", dashboard);
// Home route for testing
app.get("/api", (req, res) => {
  res.json({ message: "Hello from EventEase server!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    type: err.name
  });

  // Handle specific error types
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ 
      message: 'File upload error', 
      error: err.message 
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      error: err.message
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token',
      error: err.message
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expired',
      error: err.message
    });
  }

  // Default error response
  res.status(500).json({ 
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/eventease';
    console.log('Connecting to MongoDB at:', mongoURI);
    
    await mongoose.connect(mongoURI);
    
    console.log("✅ MongoDB connected successfully");
    
    // Log the number of existing users
    const User = require('./models/User');
    const userCount = await User.countDocuments();
    console.log(`Found ${userCount} users in database`);
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log('CORS enabled for:', ['http://localhost:3000', 'http://localhost:5173']);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    console.error("Error details:", {
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  console.error('Error details:', {
    message: err.message,
    stack: err.stack
  });
  process.exit(1);
});

// Start the server
connectDB();

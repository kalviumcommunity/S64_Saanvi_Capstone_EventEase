const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Simple test route to check if server is running
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'Backend is running!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eventease')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./Backend/routes/authRoutes'));
app.use('/api/events', require('./Backend/routes/eventRoutes'));
app.use('/api/guests', require('./Backend/routes/guestsRoutes'));
app.use('/api/profile', require('./Backend/routes/profileRoutes'));
app.use('/api/dashboard', require('./Backend/routes/Dashboard'));
app.use('/api/reviews', require('./Backend/routes/reviewRoutes'));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'Frontend/client/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend/client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
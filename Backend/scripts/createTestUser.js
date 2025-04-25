const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createTestUser = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/eventease';
    console.log('Connecting to MongoDB at:', mongoURI);
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB successfully');
    
    // Delete existing test user if exists
    await User.deleteOne({ email: 'test@example.com' });
    console.log('Cleaned up existing test user');

    // Create new test user
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Johen',
      lastName: 'Doe',
      phone: '123-456-7890',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipcode: '12345'
      }
    });

    await testUser.save();
    console.log('Test user created successfully:', {
      id: testUser._id,
      username: testUser.username,
      email: testUser.email,
      firstName: testUser.firstName,
      lastName: testUser.lastName
    });

    // Verify user exists in database
    const verifyUser = await User.findOne({ email: 'test@example.com' });
    console.log('Verified user in database:', {
      id: verifyUser._id,
      username: verifyUser.username,
      email: verifyUser.email,
      firstName: verifyUser.firstName,
      lastName: verifyUser.lastName
    });

    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error creating test user:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      errors: error.errors
    });
    process.exit(1);
  }
};

createTestUser(); 
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'], // Validation for name field
    trim: true, // Ensures no leading or trailing spaces
  },
  email: {
    type: String,
    required: [true, 'Email is required'], // Validation for email field
    unique: true, // Ensure the email is unique in the database
    trim: true, // Remove extra spaces
    lowercase: true, 
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w)*(\.\w{2,3})+$/, // Regex for email validation
      'Please enter a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'], // Validation for password field
    minlength: [6, 'Password must be at least 6 characters long'], // Password length validation
  },
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event', // References the Event model for user's events
  }],
}, { timestamps: true });
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash the password if it's modified
  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next(); // Continue with the save operation
  } catch (err) {
    next(err);
  }
});
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); // Compare entered password with hashed password
};
module.exports = mongoose.models.User || mongoose.model('User', userSchema);

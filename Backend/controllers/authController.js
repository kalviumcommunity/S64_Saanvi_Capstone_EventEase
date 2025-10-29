const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Registering user:", email);
  
  try {
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("User already exists with email:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ 
      name: username,
      email, 
      password 
    });
    
    const userResponse = {
      _id: user._id,
      username: user.name,
      email: user.email,
    };

    const token = generateToken(user._id);
    console.log("Registration successful for user:", email);
    
    res.status(201).json({ 
      user: userResponse, 
      token: token 
    });
  } catch (err) {
    console.error("Registration error:", err);
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      // Collect all error messages
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(' ') });
    }
    // Handle duplicate key error
    if (err.code === 11000) {
      return res.status(400).json({ message: "User already exists" });
    }
    res.status(500).json({ message: "Server error during registration" });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt for username:", username);
  
  try {
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ name: username });
    if (!user) {
      console.log("User not found:", username);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log("Invalid password for user:", username);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userResponse = {
      _id: user._id,
      username: user.name,
      email: user.email,
    };

    const token = generateToken(user._id);
    console.log("Login successful for user:", username);

    res.json({ 
      user: userResponse, 
      token: token 
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

module.exports = { registerUser, loginUser };

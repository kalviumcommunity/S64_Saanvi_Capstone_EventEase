const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Registering user:", email);
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

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
    
    res.status(201).json({ 
      user: userResponse, 
      token: generateToken(user._id) 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userResponse = {
      _id: user._id,
      username: user.name,
      email: user.email,
    };

    res.json({ 
      user: userResponse, 
      token: generateToken(user._id) 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser };

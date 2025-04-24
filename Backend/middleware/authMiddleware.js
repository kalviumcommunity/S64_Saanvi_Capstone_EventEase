const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming User model is located here

const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in request headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database
      const user = await User.findById(decoded.id).select("-password");
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } else {
      res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    if (err.name === 'JsonWebTokenError') {
      res.status(401).json({ message: "Invalid token" });
    } else if (err.name === 'TokenExpiredError') {
      res.status(401).json({ message: "Token expired" });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
};

module.exports = { protect };

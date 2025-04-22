const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming User model is located here

const protect = async (req, res, next) => {
  let token;

  // Check for token in request headers
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database
      req.user = await User.findById(decoded.id).select("-password"); // Exclude password

      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // If no token, send an error
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };

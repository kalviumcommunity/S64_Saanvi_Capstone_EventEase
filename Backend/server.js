const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'PORT', 'JWT_SECRET', 'FOURSQUARE_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
<<<<<<< HEAD
    'http://localhost:3000',
=======
    'https://clinquant-begonia-a9be6f.netlify.app', // Your actual Netlify domain
    'https://snazzy-taffy-c51887.netlify.app', // Additional Netlify domain
    'http://localhost:5000',
>>>>>>> 07d155fccab82b07afa831ea5823fa450841e912
    'http://localhost:5173',
    process.env.FRONTEND_URL,
    // Add common Netlify patterns for production
    /^https:\/\/.*\.netlify\.app$/,
    /^https:\/\/.*\.vercel\.app$/
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Upload directory setup with cleanup
const uploadDir = path.resolve(__dirname, 'uploads');
const profileUploadDir = path.resolve(uploadDir, 'profiles');

// Create directories if they don't exist
[uploadDir, profileUploadDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Cleanup old files (older than 24 hours)
const cleanupOldFiles = (directory) => {
  const files = fs.readdirSync(directory);
  const now = Date.now();
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);
    const fileAge = now - stats.mtime.getTime();
    
    if (fileAge > 24 * 60 * 60 * 1000) { // 24 hours
      fs.unlinkSync(filePath);
    }
  });
};

// Run cleanup every hour
setInterval(() => {
  cleanupOldFiles(uploadDir);
  cleanupOldFiles(profileUploadDir);
}, 60 * 60 * 1000);

app.use('/api/uploads', express.static(uploadDir));

// === Import Routes ===
const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const budgetItem = require("./routes/budgetItem");
const guestRoutes = require("./routes/guestsRoutes");
const dashboard = require("./routes/Dashboard");

// Apply routes
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/budget", budgetItem);
app.use("/api/guests", guestRoutes);
app.use("/api/dashboard", dashboard);

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// === Foursquare Vendor API ===
const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;

const categoryMapping = {
  'Photography': '13331',
  'Catering': '13065',
  'Decorations': '13210',
  'Entertainment': '13004',
  'Venues': '13194',
  'Flowers': '13032'
};

app.get('/api/vendors', async (req, res) => {
  try {
    const { lat, lng, category } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: 'Location coordinates are required' });
    }

    const requestOptions = {
      method: 'GET',
      url: 'https://api.foursquare.com/v3/places/search',
      params: {
        ll: `${lat},${lng}`,
        radius: 10000,
        limit: 50,
        sort: 'DISTANCE'
      },
      headers: {
        'Accept': 'application/json',
        'Authorization': FOURSQUARE_API_KEY
      }
    };

    if (category && category !== 'All') {
      requestOptions.params.categories = categoryMapping[category] || '';
      if (category === 'Photography') {
        requestOptions.params.query = 'photographer';
      }
    }

    const response = await axios(requestOptions);
    const places = response.data.results || [];

    const processedVendors = places.map(place => {
      let vendorCategory = 'Miscellaneous';
      const categoryName = place.categories?.[0]?.name || '';

      if (categoryName.includes('Photo') || category === 'Photography') {
        vendorCategory = 'Photography';
      } else if (categoryName.includes('Food') || categoryName.includes('Restaurant') || categoryName.includes('Catering')) {
        vendorCategory = 'Catering';
      } else if (categoryName.includes('Event') || categoryName.includes('Decor')) {
        vendorCategory = 'Decorations';
      } else if (categoryName.includes('Entertainment') || categoryName.includes('Music')) {
        vendorCategory = 'Entertainment';
      } else if (categoryName.includes('Venue') || categoryName.includes('Space') || categoryName.includes('Hall')) {
        vendorCategory = 'Venues';
      } else if (categoryName.includes('Flower') || categoryName.includes('Florist')) {
        vendorCategory = 'Flowers';
      } else if (category && category !== 'All') {
        vendorCategory = category;
      }

      return {
        id: place.fsq_id,
        name: place.name,
        category: vendorCategory,
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviews: Math.floor(Math.random() * 200) + 5,
        location: place.location?.locality || 'Local Area',
        price: (Math.random() * 200 + 50).toFixed(0),
        imageUrl: place.photos?.length > 0 ? place.photos[0].prefix + '300x200' + place.photos[0].suffix : null,
        distance: place.distance,
        address: place.location?.formatted_address || '',
        coordinates: {
          lat: place.geocodes?.main?.latitude,
          lng: place.geocodes?.main?.longitude
        }
      };
    });

    const featuredVendors = processedVendors.filter(v => parseFloat(v.rating) >= 4.5).slice(0, 2);

    const categoryCount = {
      'Photography': 0,
      'Catering': 0,
      'Decorations': 0,
      'Entertainment': 0,
      'Venues': 0,
      'Flowers': 0,
      'Miscellaneous': 0
    };

    processedVendors.forEach(v => {
      const cat = v.category;
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    const categories = [
      { name: 'All', count: processedVendors.length },
      ...Object.keys(categoryCount).filter(name => name !== 'Miscellaneous').map(name => ({
        name,
        count: categoryCount[name] || 0
      }))
    ];

    res.json({
      vendors: processedVendors,
      featuredVendors: featuredVendors.length > 0 ? featuredVendors : processedVendors.slice(0, 2),
      categories
    });

  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ 
      error: 'Failed to fetch vendors', 
      details: error.message 
    });
  }
});

// === Global Error Handler ===
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
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

// === MongoDB Connection + Start Server ===
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    console.log("🔌 Attempting to connect to MongoDB...");
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000 // Increased timeout for production
    });
    
    console.log("✅ MongoDB connected successfully");

    const User = require('./models/User');
    const userCount = await User.countDocuments();
    console.log(`👥 Users in DB: ${userCount}`);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📝 API Documentation available at http://localhost:${PORT}/api-docs`);
    });

  } catch (err) {
    console.error("❌ DB Connection Error:", err);
    console.error("❌ Please check your MONGO_URI environment variable");
    process.exit(1);
  }
};

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Start the server
connectDB();

// === Serve Frontend ===
app.use(express.static(path.join(__dirname, "client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

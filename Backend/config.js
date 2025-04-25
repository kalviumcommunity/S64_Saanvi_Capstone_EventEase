require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/eventease',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h',
  uploadPath: process.env.UPLOAD_PATH || 'uploads',
  maxFileSize: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['image/jpeg', 'image/jpg', 'image/png']
}; 
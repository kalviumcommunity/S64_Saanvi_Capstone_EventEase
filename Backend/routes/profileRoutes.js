const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Ensure uploads directory exists
const uploadsDir = path.resolve(__dirname, '../uploads');
const profilesDir = path.resolve(uploadsDir, 'profiles');

console.log('Uploads directory:', uploadsDir);
console.log('Profiles directory:', profilesDir);

if (!fs.existsSync(uploadsDir)) {
  console.log('Creating uploads directory');
  fs.mkdirSync(uploadsDir);
}
if (!fs.existsSync(profilesDir)) {
  console.log('Creating profiles directory');
  fs.mkdirSync(profilesDir);
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Saving file to:', profilesDir);
    cb(null, profilesDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  console.log('Received file:', file);
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG and PNG files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Get user profile
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update user profile
router.put('/update', protect, async (req, res) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'No user found' });
    }
    // Update user fields
    const updates = {};
    if (req.body.firstName !== undefined) updates.firstName = req.body.firstName;
    if (req.body.lastName !== undefined) updates.lastName = req.body.lastName;
    if (req.body.phone !== undefined) updates.phone = req.body.phone;
    // Update address if any address field is provided
    if (req.body.street || req.body.city || req.body.state || req.body.zipcode) {
      updates.address = {
        street: req.body.street || user.address?.street || '',
        city: req.body.city || user.address?.city || '',
        state: req.body.state || user.address?.state || '',
        zipcode: req.body.zipcode || user.address?.zipcode || ''
      };
    }
    // Update the user with the new data
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ 
      message: 'Error updating profile', 
      error: err.message,
      details: err.errors
    });
  }
});

// Upload profile image
router.post('/upload-image', protect, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Delete old profile image if it exists
    if (user.profileImage) {
      const oldImagePath = path.join(profilesDir, path.basename(user.profileImage));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    const imageUrl = `/api/uploads/profiles/${req.file.filename}`;
    user.profileImage = imageUrl;
    await user.save();
    res.json({ 
      message: 'Profile image uploaded successfully', 
      profileImage: user.profileImage,
      user: user
    });
  } catch (err) {
    console.error('Error uploading profile image:', err);
    if (req.file) {
      const filePath = path.join(profilesDir, req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    res.status(500).json({ 
      message: 'Error uploading profile image', 
      error: err.message,
      details: err.errors
    });
  }
});

// Delete profile image
router.delete('/image', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.profileImage) {
      const imagePath = path.join(profilesDir, path.basename(user.profileImage));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      user.profileImage = '';
      await user.save();
    }
    res.json({ message: 'Profile image deleted successfully' });
  } catch (err) {
    console.error('Error deleting profile image:', err);
    res.status(500).json({ message: 'Error deleting profile image', error: err.message });
  }
});

// Delete account
router.delete('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Optionally delete profile image
    if (user.profileImage) {
      const imagePath = path.join(profilesDir, path.basename(user.profileImage));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Error deleting account:', err);
    res.status(500).json({ message: 'Error deleting account', error: err.message });
  }
});

module.exports = router; 
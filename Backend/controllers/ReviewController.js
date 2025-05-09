const Review = require('../models/Review');
const User = require('../models/User');

// Get all reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .populate('user', 'username avatar verified')
      .populate('likes', 'username')
      .populate({
        path: 'replies.user',
        select: 'username avatar'
      });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a review
exports.createReview = async (req, res) => {
  try {
    const { heading, details, stars, pictures } = req.body;
    
    const review = await Review.create({
      user: req.user._id,
      heading,
      details,
      stars,
      pictures: pictures || []
    });
    
    const populatedReview = await Review.findById(review._id)
      .populate('user', 'username avatar verified')
      .populate('likes', 'username')
      .populate({
        path: 'replies.user',
        select: 'username avatar'
      });
    
    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like a review
exports.likeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user already liked the review
    const alreadyLiked = review.likes.includes(req.user._id);
    
    if (alreadyLiked) {
      // Unlike
      review.likes = review.likes.filter(
        userId => userId.toString() !== req.user._id.toString()
      );
    } else {
      // Like
      review.likes.push(req.user._id);
    }
    
    await review.save();
    
    const populatedReview = await Review.findById(review._id)
      .populate('user', 'username avatar verified')
      .populate('likes', 'username')
      .populate({
        path: 'replies.user',
        select: 'username avatar'
      });
    
    res.json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add reply to a review
exports.addReply = async (req, res) => {
  try {
    const { text } = req.body;
    
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    review.replies.push({
      user: req.user._id,
      text
    });
    
    await review.save();
    
    const populatedReview = await Review.findById(review._id)
      .populate('user', 'username avatar verified')
      .populate('likes', 'username')
      .populate({
        path: 'replies.user',
        select: 'username avatar'
      });
    
    res.json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload review images
exports.uploadReviewImages = async (req, res) => {
  try {
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    res.json(imageUrls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

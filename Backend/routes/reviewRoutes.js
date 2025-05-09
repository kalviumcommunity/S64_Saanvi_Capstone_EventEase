const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', reviewController.getReviews);
router.post('/', protect, reviewController.createReview);
router.post('/upload', protect, upload.array('pictures', 5), reviewController.uploadReviewImages);
router.put('/:id/like', protect, reviewController.likeReview);
router.post('/:id/reply', protect, reviewController.addReply);

module.exports = router;

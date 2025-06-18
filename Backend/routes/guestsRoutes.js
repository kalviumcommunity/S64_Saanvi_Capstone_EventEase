// routes/guestsRoutes.js
const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { validateGuest } = require('../middleware/validation');

// Protected routes with authentication
// router.use(authenticateToken);

// Guest routes with validation
router.get('/', guestController.getGuests);
router.post('/', validateGuest, guestController.addGuest);
router.put('/:id', validateGuest, guestController.updateGuest);
router.delete('/:id', guestController.deleteGuest);
router.post('/:id/invite', guestController.sendInvitation);

module.exports = router;

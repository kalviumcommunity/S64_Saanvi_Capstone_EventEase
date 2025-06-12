// routes/guestRoutes.js
const express = require('express');
const router = express.Router();
const guestController = require('../controllers/guestController');

router.get('/', guestController.getGuests);
router.post('/', guestController.addGuest);
router.put('/:id', guestController.updateGuest);
router.delete('/:id', guestController.deleteGuest);
router.post('/:id/invite', guestController.sendInvitation);

module.exports = router;

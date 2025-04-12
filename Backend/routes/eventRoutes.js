const express = require('express');
const router = express.Router();
const Event = require("../models/event");
const { createEvent } = require('../controllers/eventController');

// GET /api/events (Fetch all events)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/events (Create a new event)
router.post('/', createEvent);

module.exports = router;

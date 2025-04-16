// routes/eventRoutes.js

const express = require('express');
const router = express.Router();
const Event = require("../models/event");
const {
  createEvent,
  updateEvent,
  getAllEvents,
  getEventById,
  deleteEvent,
} = require('../controllers/eventController');

// GET /api/events - Fetch all events
router.get('/', getAllEvents);

// GET /api/events/:id - Fetch a single event by ID
router.get('/:id', getEventById);

// POST /api/events - Create a new event
router.post('/', createEvent);

// PUT /api/events/:id - Update an event
router.put('/:id', updateEvent);

// DELETE /api/events/:id - Delete an event
router.delete('/:id', deleteEvent);

module.exports = router;

const Event = require("../models/event");

const createEvent = async (req, res) => {
  try {
    const { title, date, location, description, organizer, guests, budget, status } = req.body;

    if (!title || !date || !location || !organizer) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newEvent = new Event({
      title,
      date,
      location,
      description,
      organizer,
      guests,
      budget,
      status,
    });

    await newEvent.save();
    res.status(201).json({ message: "Event created", event: newEvent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createEvent };

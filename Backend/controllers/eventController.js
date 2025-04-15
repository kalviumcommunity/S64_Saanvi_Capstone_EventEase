const Event = require("../models/event");

const createEvent = async (req, res) => {
  try {
    const {
      title,
      date,
      location,
      description,
      organizer,
      guests,
      budget,
      status,
    } = req.body;

    if (!title || !date || !location || !organizer) {
      return res.status(400).json({ message: "Missing required fields: title, date, location, organizer" });
    }

    if (typeof title !== "string" || typeof location !== "string" || typeof organizer !== "string") {
      return res.status(400).json({ message: "Title, location, and organizer must be strings" });
    }

    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (guests && (!Array.isArray(guests) || !guests.every(g => typeof g === "string"))) {
      return res.status(400).json({ message: "Guests must be an array of strings" });
    }

    if (budget && typeof budget !== "number") {
      return res.status(400).json({ message: "Budget must be a number" });
    }

    const allowedStatuses = ['Planning', 'Confirmed', 'Completed', 'Cancelled'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Allowed values are: ${allowedStatuses.join(", ")}` });
    }

    const newEvent = new Event({
      title,
      date: eventDate,
      location,
      description,
      organizer,
      guests,
      budget,
      status,
    });

    await newEvent.save();
    res.status(201).json({ message: "Event created successfully", event: newEvent });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const updates = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event updated", event: updatedEvent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createEvent, updateEvent };

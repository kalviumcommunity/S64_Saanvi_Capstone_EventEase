const Event = require("../models/event");
const Vendor = require("../models/Vendor");
const User = require("../models/User");

// Create Event (Write)
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
      vendorIds, // Add this for associated vendors
    } = req.body;

    if (!title || !date || !location || !organizer) {
      return res.status(400).json({
        message: "Missing required fields: title, date, location, organizer",
      });
    }

    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if (
      guests &&
      (!Array.isArray(guests) || !guests.every((g) => typeof g === "string"))
    ) {
      return res.status(400).json({ message: "Guests must be an array of strings" });
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
      vendorIds, // Add vendors to the event
    });

    await newEvent.save();
    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Event (Write)
const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const updates = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event updated", event: updatedEvent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Events (Read)
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("vendorIds"); // Populate vendor data
    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Event by ID (Read)
const getEventById = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId).populate("vendorIds"); // Populate vendor data

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Event (Optional Write)
const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted", event: deletedEvent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create Vendor (Write) (New Endpoint)
const createVendor = async (req, res) => {
  try {
    const { name, type, contactDetails, servicesOffered } = req.body;

    if (!name || !type || !contactDetails) {
      return res.status(400).json({
        message: "Missing required fields: name, type, contactDetails",
      });
    }

    const newVendor = new Vendor({
      name,
      type,
      contactDetails,
      servicesOffered,
    });

    await newVendor.save();
    res.status(201).json({ message: "Vendor created successfully", vendor: newVendor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Vendors (Read) (New Endpoint)
const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json(vendors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createEvent,
  updateEvent,
  getAllEvents,
  getEventById,
  deleteEvent,
  createVendor,    // Expose vendor creation functionality
  getAllVendors,  // Expose vendor retrieval functionality
};

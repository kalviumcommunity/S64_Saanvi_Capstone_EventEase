// controllers/guestController.js
const Guest = require('../models/Guest');

// Get all guests
exports.getGuests = async (req, res) => {
  try {
    const guests = await Guest.find().sort({ createdAt: -1 });
    res.json(guests);
  } catch (err) {
    console.error("Error in getGuests:", err.message);
    res.status(500).json({ 
      error: "Failed to fetch guests",
      details: err.message 
    });
  }
};

// Add a guest assssssssss
exports.addGuest = async (req, res) => {
  try {
    const { name, contact, status, time, plusOne } = req.body;

    // Check for duplicate contact
    const existingGuest = await Guest.findOne({ contact });
    if (existingGuest) {
      return res.status(400).json({ 
        error: "A guest with this contact number already exists" 
      });
    }

    const guest = new Guest({ 
      name, 
      contact, 
      status, 
      time, 
      plusOne 
    });

    await guest.save();
    res.status(201).json(guest);
  } catch (err) {
    console.error("Error in addGuest:", err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ 
        error: "Validation Error", 
        details: errors 
      });
    }

    res.status(400).json({ 
      error: "Failed to add guest",
      details: err.message 
    });
  }
};

// Update a guest
exports.updateGuest = async (req, res) => {
  try {
    const { name, contact, status, time, plusOne } = req.body;
    const updateData = {};

    // Only update fields that are provided
    if (name) updateData.name = name;
    if (contact) updateData.contact = contact;
    if (status) updateData.status = status;
    if (time) updateData.time = time;
    if (plusOne !== undefined) updateData.plusOne = plusOne;

    // If contact is being updated, check for duplicates
    if (contact) {
      const existingGuest = await Guest.findOne({ 
        contact, 
        _id: { $ne: req.params.id } 
      });
      if (existingGuest) {
        return res.status(400).json({ 
          error: "A guest with this contact number already exists" 
        });
      }
    }

    const guest = await Guest.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    res.json(guest);
  } catch (err) {
    console.error("Error in updateGuest:", err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ 
        error: "Validation Error", 
        details: errors 
      });
    }

    res.status(400).json({ 
      error: "Failed to update guest",
      details: err.message 
    });
  }
};

// Delete a guest
exports.deleteGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndDelete(req.params.id);
    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }
    res.json({ 
      message: 'Guest deleted successfully',
      deletedGuest: guest 
    });
  } catch (err) {
    console.error("Error in deleteGuest:", err);
    res.status(400).json({ 
      error: "Failed to delete guest",
      details: err.message 
    });
  }
};

// Send invitation to a guest
exports.sendInvitation = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    if (!guest) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    // In a real application, you would integrate with an email/SMS service here
    // For now, we'll just simulate success
    console.log(`Simulating sending invitation to guest: ${guest.name} (${guest.contact})`);
    
    res.status(200).json({ 
      message: 'Invitation sent successfully!',
      guest: {
        _id: guest._id,
        name: guest.name,
        contact: guest.contact
      }
    });
  } catch (err) {
    console.error("Error in sendInvitation:", err);
    res.status(500).json({ 
      error: "Failed to send invitation",
      details: err.message 
    });
  }
};

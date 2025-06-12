// controllers/guestController.js
const Guest = require('../models/guest');

// Get all guests
exports.getGuests = async (req, res) => {
  try {
    const guests = await Guest.find().sort({ createdAt: -1 });
    res.json(guests);
  } catch (err) {
    console.error("Error in getGuests:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Add a guest
exports.addGuest = async (req, res) => {
  try {
    const { name, contact, status, time, plusOne } = req.body;
    const guest = new Guest({ name, contact, status, time, plusOne });
    await guest.save();
    res.status(201).json(guest);
  } catch (err) {
    console.error("Error in addGuest:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// Update a guest (status/time/plusOne)
exports.updateGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!guest) return res.status(404).json({ error: 'Guest not found' });
    res.json(guest);
  } catch (err) {
    console.error("Error in updateGuest:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// Delete a guest
exports.deleteGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndDelete(req.params.id);
    if (!guest) return res.status(404).json({ error: 'Guest not found' });
    res.json({ message: 'Guest deleted' });
  } catch (err) {
    console.error("Error in deleteGuest:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// Send invitation to a guest (new endpoint)
exports.sendInvitation = async (req, res) => {
  try {
    const guestId = req.params.id;
    // In a real application, you would integrate with an email/SMS service here
    // For now, we'll just simulate success
    console.log(`Simulating sending invitation to guest ID: ${guestId}`);
    res.status(200).json({ message: 'Invitation sent successfully!' });
  } catch (err) {
    console.error("Error in sendInvitation:", err.message);
    res.status(500).json({ error: err.message });
  }
};

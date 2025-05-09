// models/Guest.js
const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  status: { type: String, enum: ['Confirmed', 'Pending', 'Declined'], default: 'Pending' },
  time: { type: String, default: 'Not responded' },
  plusOne: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Guest', guestSchema);

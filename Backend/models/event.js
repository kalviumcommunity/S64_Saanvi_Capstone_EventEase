const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: String,
  organizer: {
    type: String,
    required: true,
  },
  guests: {
    type: [String],
    default: [],
  },
  budget: Number,
  status: {
    type: String,
    enum: ['Planning', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Planning',
  },
  vendors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
    }
  ]
}, { timestamps: true });

module.exports = mongoose.models.Event || mongoose.model('Event', eventSchema);

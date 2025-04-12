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
  description: {
    type: String,
  },
  organizer: {
    type: String,
    required: true,
  },
  guests: {
    type: [String],
    default: [],
  },
  budget: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['Planning', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Planning',
  }
}, { timestamps: true });

// ✅ Avoid OverwriteModelError
module.exports = mongoose.models.Event || mongoose.model('Event', eventSchema);

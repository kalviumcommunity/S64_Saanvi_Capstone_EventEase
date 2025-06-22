// models/Guest.js
const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true
  },
  contact: { 
    type: String, 
    required: [true, 'Contact number is required'],
    trim: true,
    validate: {
      validator: function(v) {
        // Basic phone number validation (allows +, -, spaces, and numbers)
        return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  status: { 
    type: String, 
    enum: {
      values: ['Confirmed', 'Pending', 'Declined'],
      message: '{VALUE} is not a valid status'
    }, 
    default: 'Pending' 
  },
  time: { 
    type: String, 
    enum: {
      values: ['On time', 'A little late', 'Not responded'],
      message: '{VALUE} is not a valid time status'
    },
    default: 'Not responded' 
  },
  plusOne: { 
    type: Number, 
    min: [0, 'Plus one count cannot be negative'],
    default: 0 
  }
}, { 
  timestamps: true 
});

// Add index for faster queries
guestSchema.index({ contact: 1 }, { unique: true });

module.exports = mongoose.model('Guest', guestSchema);

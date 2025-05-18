const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Photography', 'Catering', 'Decorations', 'Entertainment', 'Venues', 'Flowers', 'Miscellaneous']
  },
  rating: {
    type: Number,
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imageUrl: String,
  address: String,
  coordinates: {
    lat: Number,
    lng: Number
  },
  description: String,
  contactInfo: {
    email: String,
    phone: String,
    website: String
  },
  availability: {
    type: Map,
    of: Boolean
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Vendor', vendorSchema); 
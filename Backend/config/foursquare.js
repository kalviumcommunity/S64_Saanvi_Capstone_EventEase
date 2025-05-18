require('dotenv').config();

const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;

const categoryMapping = {
  'Photography': '13331',
  'Catering': '13065',
  'Decorations': '13210',
  'Entertainment': '13004',
  'Venues': '13194',
  'Flowers': '13032'
};

module.exports = {
  FOURSQUARE_API_KEY,
  categoryMapping
};
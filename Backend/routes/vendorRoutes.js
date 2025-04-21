const express = require('express');
const router = express.Router();

// Correctly import the controller functions
const { createVendor, getAllVendors, getVendorById } = require('../controllers/vendorController');

// Routes
router.post('/', createVendor); // POST /api/vendors
router.get('/', getAllVendors); // GET /api/vendors
router.get('/:id', getVendorById); // GET /api/vendors/:id

module.exports = router;

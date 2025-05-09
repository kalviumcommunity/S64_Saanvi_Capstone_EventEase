const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// GET /api/dashboard/:userId/summary
router.get('/:userId/summary', dashboardController.getUserDashboardSummary);

module.exports = router;

const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

// User-specific dashboard summary
router.get("/:userId/summary", dashboardController.getUserDashboardSummary);

// Common upcoming events (same for all users)
router.get("/common/upcoming-events", dashboardController.getCommonUpcomingEvents);

module.exports = router;

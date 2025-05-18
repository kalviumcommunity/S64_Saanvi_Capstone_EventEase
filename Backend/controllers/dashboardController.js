// const Event = require('../models/dashboard');
// const Task = require('../models/Task');

// exports.getUserDashboardSummary = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // Fetch events with tasks populated
//     const events = await Event.find({ userId }).populate('tasks');

//     const totalEvents = events.length;

//     // Filter and sort upcoming events
//     const upcomingEvents = events
//       .filter(event => new Date(event.date) > new Date())
//       .sort((a, b) => new Date(a.date) - new Date(b.date));

//     // Task statistics
//     let totalTasks = 0;
//     let completedTasks = 0;

//     events.forEach(event => {
//       if (Array.isArray(event.tasks)) {
//         event.tasks.forEach(task => {
//           if (task && typeof task.completed !== "undefined") {
//             totalTasks++;
//             if (task.completed) completedTasks++;
//           }
//         });
//       }
//     });

//     // Format response
//     res.status(200).json({
//       totalEvents,
//       upcomingEvents: upcomingEvents.slice(0, 6), // Next 6 events only
//       taskStats: {
//         total: totalTasks,
//         completed: completedTasks,
//         percent: totalTasks ? Math.floor((completedTasks / totalTasks) * 100) : 0
//       },
//       events, // send all events with tasks for the table
//     });
//   } catch (err) {
//     console.error('Dashboard error:', err);
//     res.status(500).json({ error: 'Failed to load dashboard data' });
//   }
// };
const Event = require("../models/dashboard");

// User-specific stats
exports.getUserDashboardSummary = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Get all events for the user
    const events = await Event.find({ userId });

    // Stats
    const totalEvents = events.length;
    const allTasks = events.flatMap(ev => ev.tasks || []);
    const completed = allTasks.filter(t => t.completed).length;
    const total = allTasks.length;

    res.json({
      totalEvents,
      events,
      taskStats: { total, completed }
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to get dashboard summary" });
  }
};

// Common upcoming events (same for all users)
exports.getCommonUpcomingEvents = async (req, res) => {
  // You can make this dynamic, or just use a static list for demo:
  const commonEvents = [
    {
      _id: "global1",
      name: "Global Music Fest",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      type: "Festival",
      description: "A global music festival for everyone!"
    },
    {
      _id: "global2",
      name: "Open Tech Conference",
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      type: "Conference",
      description: "Tech talks and networking."
    }
  ];
  res.json(commonEvents);
};

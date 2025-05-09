const Dashboard = require('../models/Dashboard');
const Task = require('../models/Task');

exports.getUserDashboardSummary = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch events with tasks populated
    const events = await Event.find({ userId }).populate('tasks');

    const totalEvents = events.length;

    // Filter and sort upcoming events
    const upcomingEvents = events
      .filter(event => new Date(event.date) > new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Task statistics
    let totalTasks = 0;
    let completedTasks = 0;

    events.forEach(event => {
      if (Array.isArray(event.tasks)) {
        event.tasks.forEach(task => {
          if (task && typeof task.completed !== "undefined") {
            totalTasks++;
            if (task.completed) completedTasks++;
          }
        });
      }
    });

    // Format response
    res.status(200).json({
      totalEvents,
      upcomingEvents: upcomingEvents.slice(0, 6), // Next 6 events only
      taskStats: {
        total: totalTasks,
        completed: completedTasks,
        percent: totalTasks ? Math.floor((completedTasks / totalTasks) * 100) : 0
      },
      events, // send all events with tasks for the table
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: 'Failed to load dashboard data' });
  }
};

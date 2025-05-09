import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { motion, AnimatePresence } from "framer-motion";
import "../Styles/Dashboard.css";

Chart.register(ArcElement, Tooltip, Legend);

const eventImages = {
  Wedding: "/images/wedding.jpg",
  Festival: "/images/festival.jpg",
  Party: "/images/party.jpg",
  default: "/images/default.jpg",
};

const DEMO_EVENTS = [
  {
    _id: "demo1",
    name: "Sample Festival",
    date: new Date(),
    type: "Festival",
    description: "A fun festival event with music and food.",
    tasks: [
      { _id: "t1", completed: true },
      { _id: "t2", completed: false },
      { _id: "t3", completed: true },
    ],
  },
  {
    _id: "demo2",
    name: "Spring Wedding",
    date: new Date(),
    type: "Wedding",
    description: "A beautiful wedding in spring.",
    tasks: [
      { _id: "t4", completed: true },
      { _id: "t5", completed: true },
      { _id: "t6", completed: false },
    ],
  },
  {
    _id: "demo3",
    name: "Office Party",
    date: new Date(),
    type: "Party",
    description: "Annual office party with games and awards.",
    tasks: [],
  },
  {
    _id: "demo4",
    name: "Charity Run",
    date: new Date(),
    type: "Festival",
    description: "Join us for a charity marathon run.",
    tasks: [
      { _id: "t7", completed: false },
      { _id: "t8", completed: false },
    ],
  },
  {
    _id: "demo5",
    name: "Music Night",
    date: new Date(),
    type: "Festival",
    description: "Live music with local bands.",
    tasks: [
      { _id: "t9", completed: true },
      { _id: "t10", completed: true },
      { _id: "t11", completed: true },
    ],
  },
  {
    _id: "demo6",
    name: "Food Carnival",
    date: new Date(),
    type: "Festival",
    description: "Taste delicious foods from around the world.",
    tasks: [
      { _id: "t12", completed: false },
      { _id: "t13", completed: true },
    ],
  },
];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId") || "demoUserId";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/dashboard/${userId}/summary`);
        setData(response.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [userId]);

  // Fallbacks if backend fails
  const totalEvents = data?.totalEvents ?? DEMO_EVENTS.length;
  const upcomingEvents =
    data?.upcomingEvents && data.upcomingEvents.length > 0
      ? data.upcomingEvents
      : DEMO_EVENTS;

  const taskStats = data?.taskStats || {
    total: DEMO_EVENTS.reduce((acc, ev) => acc + (ev.tasks?.length || 0), 0),
    completed: DEMO_EVENTS.reduce(
      (acc, ev) =>
        acc + (ev.tasks ? ev.tasks.filter((t) => t?.completed).length : 0),
      0
    ),
  };
  taskStats.percent =
    taskStats.total > 0
      ? Math.floor((taskStats.completed / taskStats.total) * 100)
      : 0;

  const eventsForTable =
    data?.events && data.events.length > 0 ? data.events : DEMO_EVENTS;

  const pieData = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [taskStats.completed, Math.max(0, taskStats.total - taskStats.completed)],
        backgroundColor: ["#36A2EB", "#FFCE56"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <AnimatePresence>
      <motion.div
        className="dashboard-root"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {loading && <div className="loading-spinner">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {!loading && !error && (
          <div className="dashboard-container">
            <h1>Dashboard</h1>
            <motion.div
              className="stats-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div className="stat-card" whileHover={{ scale: 1.04 }}>
                <div className="stat-title">Total Events</div>
                <div className="stat-value">{totalEvents}</div>
              </motion.div>
              <motion.div className="stat-card" whileHover={{ scale: 1.04 }}>
                <div className="stat-title">Upcoming Events</div>
                <div className="stat-value">{upcomingEvents.length}</div>
                {upcomingEvents[0] && (
                  <div className="stat-desc">
                    Next: {upcomingEvents[0].name} <br />
                    {new Date(upcomingEvents[0].date).toLocaleDateString()}
                  </div>
                )}
              </motion.div>
              <motion.div className="stat-card" whileHover={{ scale: 1.04 }}>
                <div className="stat-title">Tasks Progress</div>
                <div className="stat-value">
                  {taskStats.completed}/{taskStats.total}
                </div>
                <div style={{ width: 120, margin: "0 auto" }}>
                  <Pie data={pieData} options={{ plugins: { legend: { display: false } } }} />
                </div>
                <div className="stat-desc">{taskStats.percent}% Complete</div>
              </motion.div>
            </motion.div>

            <h2 className="section-title">Event Task Table</h2>
            <div className="table-scroll">
              <table className="task-table">
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Total Tasks</th>
                    <th>Completed</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {eventsForTable.map((event, idx) => {
                    const tasks = Array.isArray(event.tasks) ? event.tasks : [];
                    const totalTasks = tasks.length;
                    const completedTasks = tasks.filter((t) => t && t.completed).length;
                    const progressPercent =
                      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

                    return (
                      <tr key={event._id || idx}>
                        <td>{event.name || "Unnamed Event"}</td>
                        <td>{totalTasks}</td>
                        <td>{completedTasks}</td>
                        <td>{progressPercent}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <h2 className="section-title">Upcoming Events</h2>
            <div className="events-grid">
              {upcomingEvents.slice(0, 6).map((event, idx) => (
                <motion.div
                  className="event-card"
                  key={event._id || idx}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 8px 32px rgba(80,80,160,0.18)",
                  }}
                  onClick={() => navigate(`/event/${event._id || idx}`)}
                >
                  <div className="card-img-wrap">
                    <motion.img
                      src={eventImages[event.type] || eventImages.default}
                      alt={event.name || "Event"}
                      className="event-img"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <div className="event-info">
                    <div className="event-name">{event.name || "Unnamed Event"}</div>
                    <div className="event-summary">
                      {(event.description && event.description.slice(0, 60)) ||
                        "No description available."}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Dashboard;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import {
  FaCalendarAlt,
  FaTasks,
  FaBell,
  FaTachometerAlt,
  FaCalendar,
  FaUsers,
  FaChartPie,
  FaSignOutAlt,
  FaCog,
  FaPlus,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import event1Img from "../assets/download.jpg";
import event2Img from "../assets/image.png";
import event3Img from "../assets/signup.jpg";
import "../Styles/dashboard.css";

Chart.register(ArcElement, Tooltip, Legend);

const NAV_ITEMS = [
  { label: "Dashboard", icon: <FaTachometerAlt />, path: "/dashboard" },
  { label: "Events", icon: <FaCalendar />, path: "/events" },
  { label: "Tasks", icon: <FaTasks />, path: "/tasks" },
  { label: "Guests", icon: <FaUsers />, path: "/guests" },
  { label: "Analytics", icon: <FaChartPie />, path: "/analytics" },
  { label: "Settings", icon: <FaCog />, path: "/settings" },
];

const eventTypeIcons = {
  Wedding: <FaCalendarAlt color="#b388ff" />,
  Festival: <FaBell color="#64b5f6" />,
  Party: <FaUsers color="#ffd54f" />,
  default: <FaCalendarAlt color="#a7a7a7" />,
};

const EVENT_IDEAS = [
  {
    _id: "idea1",
    name: "Retro Disco Night",
    date: "2023-11-12",
    image: event1Img,
    description: "A throwback party with disco balls, 80s music, and funky outfits.",
    tasks: [
      { name: "Book DJ", completed: false },
      { name: "Decorate venue", completed: false },
      { name: "Send invitations", completed: false },
    ],
  },
  {
    _id: "idea2",
    name: "Outdoor Movie Marathon",
    date: "2023-10-05",
    image: event2Img,
    description: "Enjoy classic films under the stars with popcorn and friends.",
    tasks: [
      { name: "Set up projector", completed: false },
      { name: "Arrange seating", completed: false },
      { name: "Buy snacks", completed: false },
    ],
  },
  {
    _id: "idea3",
    name: "Food Carnival",
    date: "2023-09-20",
    image: event3Img,
    description: "Taste dishes from around the world at this fun food festival.",
    tasks: [
      { name: "Contact vendors", completed: false },
      { name: "Design flyers", completed: false },
      { name: "Book venue", completed: false },
    ],
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId") || "demoUserId";

  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal state for adding event
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedIdeaId, setSelectedIdeaId] = useState("");
  const selectedIdea = EVENT_IDEAS.find(e => e._id === selectedIdeaId);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const userRes = await fetch(`/api/dashboard/${userId}/summary`);
        const userData = await userRes.json();
        setUserStats(userData);
      } catch (err) {
        setUserStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [userId]);

  const taskStats = userStats?.taskStats || { total: 0, completed: 0 };
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

  // Modal handlers
  const handleOpenAddModal = () => {
    setShowAddModal(true);
    setSelectedIdeaId("");
  };

  const handleConfirmAdd = async () => {
    // TODO: Replace with API call to add event for the user.
    setShowAddModal(false);
    setSelectedIdeaId("");
    alert("Event added to your events!");
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedIdeaId("");
  };

  if (loading) return <div className="dashboard-loading">Loading...</div>;

  return (
    <div className="dashboard-outer">
      {/* Sidebar */}
      <nav className="dashboard-nav">
        <div className="nav-logo" onClick={() => navigate("/dashboard")}>MyApp</div>
        <ul>
          {NAV_ITEMS.map((item) => (
            <li key={item.label} onClick={() => navigate(item.path)}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </li>
          ))}
        </ul>
        <div className="nav-footer" onClick={() => navigate("/logout")}>
          <FaSignOutAlt className="nav-icon" /> <span className="nav-label">Logout</span>
        </div>
      </nav>

      {/* Main content */}
      <main className="dashboard-main">
        <AnimatePresence>
          <motion.div
            className="dashboard-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
              <FaCalendarAlt className="stat-icon" />
              <div className="stat-title">Total Events</div>
              <div className="stat-value">{userStats?.totalEvents ?? 0}</div>
            </motion.div>
            <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
              <FaBell className="stat-icon" />
              <div className="stat-title">Ideas Available</div>
              <div className="stat-value">{EVENT_IDEAS.length}</div>
              <div className="stat-desc">
                {EVENT_IDEAS[0]
                  ? `Try: ${EVENT_IDEAS[0].name} (${new Date(
                      EVENT_IDEAS[0].date
                    ).toLocaleDateString()})`
                  : "No ideas"}
              </div>
            </motion.div>
            <motion.div className="stat-card" whileHover={{ scale: 1.05 }}>
              <FaTasks className="stat-icon" />
              <div className="stat-title">Task Progress</div>
              <div className="stat-value">
                {taskStats.completed}/{taskStats.total}
              </div>
              <div style={{ width: 80, margin: "0 auto" }}>
                <Pie data={pieData} options={{ plugins: { legend: { display: false } } }} />
              </div>
              <div className="stat-desc">
                {taskStats.total > 0
                  ? Math.floor((taskStats.completed / taskStats.total) * 100)
                  : 0}
                % Complete
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* User-specific events table */}
        <section className="dashboard-table-section">
          <h2>Your Events</h2>
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
                {(userStats?.events?.length > 0 ? userStats.events : [
                  { _id: 'dummy1', name: 'Spring Wedding', type: 'Wedding', tasks: [{completed:true},{completed:false},{completed:true}] },
                  { _id: 'dummy2', name: 'Corporate Gala', type: 'Festival', tasks: [{completed:true},{completed:true}] },
                  { _id: 'dummy3', name: 'Birthday Bash', type: 'Party', tasks: [{completed:false},{completed:false}] },
                ]).map((event, idx) => {
                  const tasks = Array.isArray(event.tasks) ? event.tasks : [];
                  const totalTasks = tasks.length;
                  const completedTasks = tasks.filter((t) => t && t.completed).length;
                  const progressPercent =
                    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
                  return (
                    <tr key={event._id || idx}>
                      <td>
                        {eventTypeIcons[event.type] || eventTypeIcons.default}{" "}
                        {event.name || "Unnamed Event"}
                      </td>
                      <td>{totalTasks}</td>
                      <td>{completedTasks}</td>
                      <td>
                        <div className="progress-bar">
                          <div
                            className="progress-bar-inner"
                            style={{
                              width: `${progressPercent}%`,
                              background:
                                progressPercent === 100
                                  ? "#81c784"
                                  : "#64b5f6",
                            }}
                          />
                        </div>
                        <span className="progress-label">{progressPercent}%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Upcoming Events Section (Card Grid) */}
        <section className="dashboard-upcoming-section">
          <h2>Upcoming Events</h2>
          <div className="events-grid" style={{display:'flex',gap:'32px',flexWrap:'wrap',justifyContent:'flex-start'}}>
            {(userStats?.upcomingEvents ?? [
              { _id: 'up1', name: 'Spring Wedding', date: '2024-07-15', type: 'Wedding', guests: [1,2,3], status: 'Confirmed', image: event1Img },
              { _id: 'up2', name: 'Corporate Gala', date: '2024-08-02', type: 'Festival', guests: [1,2], status: 'Planned', image: event2Img },
              { _id: 'up3', name: 'Birthday Bash', date: '2024-09-10', type: 'Party', guests: [1], status: 'Planned', image: event3Img },
            ]).map((event, idx) => (
              <div className="event-card fancy-card" key={event._id || idx} style={{width:'270px',minWidth:'220px',maxWidth:'270px',display:'flex',flexDirection:'column',alignItems:'stretch'}}>
                <div className="event-image-wrap" style={{height:'160px',width:'100%',overflow:'hidden',borderRadius:'12px 12px 0 0',background:'#ede7f6'}}>
                  <img src={event.image} alt={event.name} className="event-image" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                </div>
                <div className="event-info" style={{padding:'16px 14px 10px 14px',flex:'1 1 auto'}}>
                  <div className="event-name" style={{fontWeight:700,fontSize:'1.1rem',marginBottom:'4px'}}>{event.name}</div>
                  <div className="event-date" style={{color:'#7c4dff',fontWeight:500,marginBottom:'6px'}}>{event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}</div>
                  <div className="event-summary" style={{color:'#444',fontSize:'0.98rem',marginBottom:'6px'}}>{eventTypeIcons[event.type] || eventTypeIcons.default} {event.type || '-'}</div>
                  <div style={{marginTop:'auto',fontSize:'0.97rem'}}>
                    <span className={`status-badge status-${(event.status || '').toLowerCase()}`}>{event.status || 'Planned'}</span>
                    <span style={{marginLeft:10,color:'#888'}}>Guests: {event.guests?.length ?? 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Add Event Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <div style={{ padding: "22px 22px 0 22px" }}>
                <label htmlFor="event-idea-select" style={{ fontWeight: 600, color: "#7c4dff" }}>
                  Select an Event Idea:
                </label>
                <select
                  id="event-idea-select"
                  value={selectedIdeaId}
                  onChange={e => setSelectedIdeaId(e.target.value)}
                  style={{
                    width: "100%",
                    margin: "10px 0 18px 0",
                    padding: "8px",
                    borderRadius: "7px",
                    border: "1px solid #d1c4e9",
                    fontSize: "1rem"
                  }}
                >
                  <option value="">-- Choose an event --</option>
                  {EVENT_IDEAS.map(idea => (
                    <option key={idea._id} value={idea._id}>
                      {idea.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedIdea && (
                <>
                  <div className="event-image-wrap">
                    <img src={selectedIdea.image} alt={selectedIdea.name} className="event-image" />
                  </div>
                  <div className="event-info">
                    <div className="event-name">{selectedIdea.name}</div>
                    <div className="event-date">{new Date(selectedIdea.date).toLocaleDateString()}</div>
                    <div className="event-summary">{selectedIdea.description}</div>
                    <h4 style={{ margin: "14px 0 7px 0", color: "#7c4dff" }}>Event Tasks</h4>
                    <div className="table-scroll">
                      <table className="modal-task-table">
                        <thead>
                          <tr>
                            <th>Task</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedIdea.tasks.map((task, idx) => (
                            <tr key={idx}>
                              <td>{task.name}</td>
                              <td>
                                <span
                                  style={{
                                    color: task.completed ? "#81c784" : "#e57373",
                                    fontWeight: 600,
                                  }}
                                >
                                  {task.completed ? "Done" : "Pending"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button
                      className="confirm-add-btn"
                      onClick={handleConfirmAdd}
                    >
                      Confirm & Add Event
                    </button>
                  </div>
                </>
              )}
              <button
                className="close-modal-btn"
                onClick={handleCloseModal}
                style={{ marginLeft: 22, marginTop: 10 }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

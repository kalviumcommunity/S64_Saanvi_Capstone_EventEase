import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaClipboardList,
  FaUserFriends,
  FaMoneyBillWave,
  FaUserPlus,
  FaSearch,
  FaCalendarPlus,
  FaChartPie,
  FaStar,
} from "react-icons/fa";
import "../Styles/Home.css";

const Home = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId") || "demoUserId";
    fetch(`/api/dashboard/${userId}/summary`)
      .then((res) => res.json())
      .then((data) => setDashboardData(data))
      .catch(() => setDashboardData(null));
  }, []);

  const totalEvents = dashboardData?.totalEvents ?? 0;
  const budget = dashboardData?.budget ?? 23690;
  const upcomingEvents = dashboardData?.upcomingEvents ?? [];
  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null;
  const nextEventDate = nextEvent ? new Date(nextEvent.date).toLocaleDateString() : "N/A";
  const nextEventName = nextEvent ? nextEvent.name : "No upcoming events";

  return (
    <div className="home-root">
      <div className="home-main">
        <div className="home-header">
          <h2>Welcome back, Username</h2>
          <button className="add-budget-btn" onClick={() => navigate("/addbudget")}>
            add budget
          </button>
        </div>

        <div className="home-stats-row">
          <div className="home-stat yellow stat-card">
            <FaClipboardList className="home-stat-icon" />
            <div className="stat-title">Your Events</div>
            <div className="stat-value">{totalEvents}</div>
            <div className="stat-desc">All Events planned by you</div>
          </div>
          <div className="home-stat green stat-card">
            <FaMoneyBillWave className="home-stat-icon" />
            <div className="stat-title">Budget Status</div>
            <div className="stat-value">{budget.toLocaleString()}</div>
            <div className="stat-desc">Total Budget set by you</div>
          </div>
          <div className="home-stat purple stat-card">
            <FaCalendarPlus className="home-stat-icon" />
            <div className="stat-title">Upcoming Events</div>
            <div className="stat-value">{nextEventDate}</div>
            <div className="stat-desc">Next event: {nextEventName}</div>
          </div>
        </div>

        <div className="home-section">
          <h3 style={{ color: "#b71c1c", marginBottom: 0 }}>
            What would you like to manage today?
          </h3>
          <div style={{ color: "#333", fontWeight: 500, marginBottom: 16 }}>
            Your event planning tools are ready
          </div>
          <div className="home-actions-grid">
            <div className="home-action green action-card" onClick={() => navigate("/dashboard")}>
              <FaClipboardList className="action-icon" />
              <div className="action-title">Manage Events</div>
              <button>Go to dashboard</button>
            </div>
            <div className="home-action purple action-card" onClick={() => navigate("/vendor")}>
              <FaSearch className="action-icon" />
              <div className="action-title">Book vendors</div>
              <button>Explore vendors</button>
            </div>
            <div className="home-action orange action-card" onClick={() => navigate("/guest")}>
              <FaUserFriends className="action-icon" />
              <div className="action-title">Guest management</div>
              <button>Manage guest</button>
            </div>
            <div className="home-action blue action-card" onClick={() => navigate("/budget")}>
              <FaChartPie className="action-icon" />
              <div className="action-title">Budget Tracking</div>
              <button>Track budget</button>
            </div>
          </div>
        </div>

        <div className="home-section">
          <div style={{ fontWeight: 600, marginBottom: 10 }}>Quick Actions</div>
          <div className="home-quick-actions">
            <button className="quick-btn blue" onClick={() => navigate("/newevent")}>
              <FaCalendarPlus /> New event
            </button>
            <button className="quick-btn purple" onClick={() => navigate("/budget")}>
              <FaChartPie /> Track budget
            </button>
            <button className="quick-btn yellow" onClick={() => navigate("/vendor")}>
              <FaSearch /> Find vendors
            </button>
            <button className="quick-btn red" onClick={() => navigate("/guest")}>
              <FaUserPlus /> Add Guest
            </button>
            <button className="quick-btn green" onClick={() => navigate("/reviews")}>
              <FaStar /> Check reviews
            </button>
          </div>
        </div>
        <footer className="home-footer">
          <p>
            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;

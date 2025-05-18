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
import AOS from 'aos';
import 'aos/dist/aos.css';
import "../Styles/Home.css";
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
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
          <h2>Welcome back, {user?.name || user?.email || 'User'}</h2>
          <button className="add-budget-btn" onClick={() => navigate("/addbudget")}>
            add budget
          </button>
        </div>

        <div className="home-stats-row">
          <div className="home-stat yellow stat-card" data-aos="fade-up" data-aos-delay="0">
            <FaClipboardList className="home-stat-icon" style={{fontSize: 32, color: '#ffd54f', opacity: 0.7}} />
            <div className="stat-title">Your Events</div>
            <div className="stat-value" style={{fontSize: '2rem'}}>{totalEvents}</div>
            <div className="stat-desc">All Events planned by you</div>
          </div>
          <div className="home-stat green stat-card" data-aos="fade-up" data-aos-delay="100">
            <FaMoneyBillWave className="home-stat-icon" style={{fontSize: 32, color: '#81c784', opacity: 0.7}} />
            <div className="stat-title">Budget Status</div>
            <div className="stat-value" style={{fontSize: '2rem'}}>{budget.toLocaleString()}</div>
            <div className="stat-desc">Total Budget set by you</div>
          </div>
          <div className="home-stat purple stat-card" data-aos="fade-up" data-aos-delay="200">
            <FaCalendarPlus className="home-stat-icon" style={{fontSize: 32, color: '#ba68c8', opacity: 0.7}} />
            <div className="stat-title">Upcoming Events</div>
            <div className="stat-value" style={{fontSize: '2rem'}}>{nextEventDate}</div>
            <div className="stat-desc">Next event: {nextEventName}</div>
          </div>
        </div>

        <div className="home-section" data-aos="fade-right">
          <h3 style={{ color: "#b71c1c", marginBottom: 0, fontSize: '1.3rem' }}>
            What would you like to manage today?
          </h3>
          <div style={{ color: "#333", fontWeight: 500, marginBottom: 16, fontSize: '1.1rem' }}>
            Your event planning tools are ready
          </div>
          <div className="home-actions-grid">
            <div className="home-action green action-card" data-aos="zoom-in" data-aos-delay="0" onClick={() => navigate("/dashboard")}>
              <FaClipboardList className="action-icon" style={{fontSize: 28}} />
              <div className="action-title">Manage Events</div>
              <button>Go to dashboard</button>
            </div>
            <div className="home-action purple action-card" data-aos="zoom-in" data-aos-delay="100" onClick={() => navigate("/vendors")}>
              <FaSearch className="action-icon" style={{fontSize: 28}} />
              <div className="action-title">Book vendors</div>
              <button>Explore vendors</button>
            </div>
            <div className="home-action orange action-card" data-aos="zoom-in" data-aos-delay="200" onClick={() => navigate("/guests")}>
              <FaUserFriends className="action-icon" style={{fontSize: 28}} />
              <div className="action-title">Guest management</div>
              <button>Manage guests</button>
            </div>
            <div className="home-action blue action-card" data-aos="zoom-in" data-aos-delay="300" onClick={() => navigate("/budget")}>
              <FaChartPie className="action-icon" style={{fontSize: 28}} />
              <div className="action-title">Budget Tracking</div>
              <button>Track budget</button>
            </div>
          </div>
        </div>

        <div className="home-section" data-aos="fade-left">
          <div style={{ fontWeight: 600, marginBottom: 10, fontSize: '1.1rem' }}>Quick Actions</div>
          <div className="home-quick-actions">
            <button className="quick-btn blue" onClick={() => navigate("/newevent")}>
              <FaCalendarPlus /> New event
            </button>
            <button className="quick-btn purple" onClick={() => navigate("/budget")}>
              <FaChartPie /> Track budget
            </button>
            <button className="quick-btn yellow" onClick={() => navigate("/vendors")}>
              <FaSearch /> Find vendors
            </button>
            <button className="quick-btn red" onClick={() => navigate("/guests")}>
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

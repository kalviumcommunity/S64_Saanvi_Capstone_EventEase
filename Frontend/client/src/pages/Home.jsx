import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import '../styles/Home.css';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/eventeaselogo.png';

// Import Material UI icons
import EventIcon from '@mui/icons-material/Event';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import StarIcon from '@mui/icons-material/Star';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNotification, setShowNotification] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  
  const [stats, setStats] = useState({
    events: {
      count: 4,
      label: 'All Events planned by you',
      trend: '+2 this month'
    },
    budget: {
      amount: 23690,
      label: 'Total Budget set by you',
      trend: '+$5,000 available'
    },
    nextEvent: {
      date: selectedDate,
      label: 'Next event: Company Retreat',
      countdown: '5 days away'
    }
  });

  useEffect(() => {
    // Show welcome notification after a delay
    setTimeout(() => {
      setShowNotification(true);
    }, 1000);

    // Hide notification after 5 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 6000);
  }, []);

  const navigateToSection = (section) => {
    setActiveSection(section);
    navigate(`/${section}`);
  };

  const handleAddBudget = () => {
    navigate('/budget/add');
  };

  const quickActions = [
    { label: 'New event', path: 'dashboard', icon: <AddIcon />, color: 'primary' },
    { label: 'Track budget', path: 'budget', icon: <AccountBalanceWalletIcon />, color: 'secondary' },
    { label: 'Find vendors', path: 'vendor', icon: <SearchIcon />, color: 'success' },
    { label: 'Add Guest', path: 'guests', icon: <PersonAddIcon />, color: 'warning' },
    { label: 'Check reviews', path: 'reviews', icon: <StarIcon />, color: 'purple' }
  ];

  return (
    <div className="home-container">
      {showNotification && (
        <div className="notification">
          <NotificationsIcon />
          <span>Welcome back! You have upcoming events this week.</span>
        </div>
      )}
      
      <nav className="navbar">
        <div className="nav-left">
          <img src={logo} alt="EventEase" className="logo" />
          <div className="nav-links">
            {['home', 'vendor', 'reviews', 'budget','profile', 'dashboard', 'guests'].map((section) => (
              <button
                key={section}
                className={`nav-link ${activeSection === section ? 'active' : ''}`}
                onClick={() => navigateToSection(section)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <button className="profile-btn">
          <img 
            src={user?.avatar || '/default-avatar.png'} 
            alt="" 
            style={{ width: '24px', height: '24px', borderRadius: '50%' }} 
          />
          <span>{user?.username || 'Profile'}</span>
        </button>
      </nav>

      <div className="main-content">
        <div className="welcome-section">
          <div className="welcome-left">
            <div className="welcome-text">
              <h1>Welcome back, {user?.username || 'User'}</h1>
              <p className="welcome-subtitle">Ready to plan your next amazing event?</p>
            </div>
          </div>
          <button className="add-budget-btn" onClick={handleAddBudget}>
            <span>Add Budget</span>
          </button>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <h2>{stats.events.count}</h2>
            <p className="trend">{stats.events.trend}</p>
            <p>{stats.events.label}</p>
          </div>

          <div className="stat-card">
            <h2>${stats.budget.amount.toLocaleString()}</h2>
            <p className="trend">{stats.budget.trend}</p>
            <p>{stats.budget.label}</p>
          </div>

          <div className="stat-card">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd MMM"
              className="date-picker"
            />
            <p className="trend">{stats.nextEvent.countdown}</p>
            <p>{stats.nextEvent.label}</p>
          </div>
        </div>

        <div className="management-section">
          <h2>What would you like to manage today?</h2>
          <p>Your event planning tools are ready</p>

          <div className="management-grid">
            {[
              { title: 'Manage Events', icon: <DashboardIcon />, action: 'Go to dashboard', path: 'dashboard' },
              { title: 'Book vendors', icon: <StorefrontIcon />, action: 'Explore vendors', path: 'vendor' },
              { title: 'Guest management', icon: <PeopleIcon />, action: 'Manage guest', path: 'guests' },
              { title: 'Budget Tracking', icon: <AssessmentIcon />, action: 'Track budget', path: 'budget' }
            ].map((card, index) => (
              <div
                key={index}
                className="management-card"
                onClick={() => navigateToSection(card.path)}
              >
                <div className="card-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <button className="action-btn">
                  <span>{card.action}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className={`quick-action-btn ${action.color}`}
                onClick={() => navigateToSection(action.path)}
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
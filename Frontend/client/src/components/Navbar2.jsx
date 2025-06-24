import React from "react";
import { NavLink } from "react-router-dom";
import "../Styles/Navbar2.css";
import logo from "../assets/eventeaselogo.png";
import { useAuth } from '../Context/AuthContext';

const Navbar = () => {
  const { logout } = useAuth();
  return (
  <nav className="navbar">
    <div className="navbar-logo">
      <img src={logo} alt="EventEase Logo" style={{ height: '64px', marginRight: '64px' }} />
      <span className="navbar-brand">EventEase</span>
    </div>
    <ul className="navbar-links">
        <li><NavLink to="/Home" end>Home</NavLink></li>
      <li><NavLink to="/vendors">Vendor</NavLink></li>
      <li><NavLink to="/review">Reviews</NavLink></li>
      <li><NavLink to="/budget">Budget</NavLink></li>
      <li><NavLink to="/dashboard">Dashboard</NavLink></li>
      <li><NavLink to="/guests">Guests</NavLink></li>
      <li className="navbar-profile"><NavLink to="/profile">Profile</NavLink></li>
        <li>
          <button onClick={() => { logout(); window.location.href = "/login"; }} style={{ background: 'none', border: 'none', color: '#222', fontWeight: 'bold', cursor: 'pointer' }}>Logout</button>
        </li>
    </ul>
  </nav>
);
};

export default Navbar;

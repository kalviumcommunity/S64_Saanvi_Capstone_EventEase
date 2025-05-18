// src/components/Navbar.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaStar, FaSignInAlt, FaUserPlus, FaListAlt, FaTachometerAlt } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('user'); // Adjust as per your auth logic
  const isLanding = location.pathname === '/';

  const styles = {
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 40px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #ddd',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      animation: 'slideDown 0.7s cubic-bezier(.68,-0.55,.27,1.55)'
    },
    brand: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#A33F5E',
      letterSpacing: '2px',
      transition: 'color 0.3s',
    },
    navLinks: {
      display: 'flex',
      gap: '28px',
      alignItems: 'center',
    },
    navLink: {
      color: '#555',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '18px',
      position: 'relative',
      transition: 'color 0.3s',
      display: 'flex',
      alignItems: 'center',
      gap: '7px',
    },
    button: {
      padding: '8px 18px',
      borderRadius: '6px',
      backgroundColor: '#fff',
      color: '#e6007e',
      fontWeight: '600',
      border: '2px solid #e6007e',
      cursor: 'pointer',
      marginLeft: '10px',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      gap: '7px',
    },
    signupButton: {
      padding: '10px 20px',
      borderRadius: '6px',
      backgroundColor: '#e6007e',
      color: '#fff',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      marginLeft: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '7px',
    },
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>EventEase</Link>
      <div style={styles.navLinks}>
        <Link to="/features" style={styles.navLink}><FaListAlt /> Features</Link>
        <Link to="/example-dashboard" style={styles.navLink}><FaTachometerAlt /> Example Dashboard</Link>
        <Link to="/review" style={styles.navLink}><FaStar /> Reviews</Link>
        {(isLanding || !isLoggedIn) && <>
          <Link to="/login"><button style={styles.button}><FaSignInAlt /> Login</button></Link>
          <Link to="/signup"><button style={styles.signupButton}><FaUserPlus /> Sign Up</button></Link>
        </>}
        {!isLanding && isLoggedIn && <Link to="/dashboard" style={styles.navLink}>My Dashboard</Link>}
      </div>
    </nav>
  );
};

export default Navbar;

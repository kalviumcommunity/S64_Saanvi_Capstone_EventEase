// src/components/Navbar.jsx

import React from 'react';

const Navbar = () => {
  const styles = {
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 40px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #ddd',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    brand: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#A33F5E',
    },
    navLinks: {
      display: 'flex',
      gap: '20px',
    },
    navLink: {
      color: '#555',
      textDecoration: 'none',
      fontWeight: '500',
      fontSize: '16px',
    },
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>EventEase</div>
      <div style={styles.navLinks}>
        <a href="#features" style={styles.navLink}>Features</a>
        <a href="#how-it-works" style={styles.navLink}>How It Works</a>
        <a href="#contact" style={styles.navLink}>Contact</a>
      </div>
    </nav>
  );
};

export default Navbar;

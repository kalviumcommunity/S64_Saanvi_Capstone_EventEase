import React from 'react';
import Navbar from '../components/NavBar';

const LandingPage = () => {
  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(to bottom right, #FFF8F0, #F5FADC)',
      color: '#000',
      margin: 0,
      padding: 0,
      width: '100%',
    },
    hero: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '80px 60px',
      minHeight: '100vh',
      backgroundColor: 'transparent',
    },
    heroText: {
      maxWidth: '600px',
      flex: 1,
      animation: 'fadeIn 1s ease-in-out',
    },
    pinkButton: {
      marginTop: '30px',
      backgroundColor: '#FF3DAB',
      color: '#fff',
      border: 'none',
      padding: '16px 32px',
      borderRadius: '12px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '18px',
      transition: 'transform 0.3s ease',
    },
    heroImage: {
      maxWidth: '380px',
      borderRadius: '14px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      marginTop: '30px',
      animation: 'slideIn 1s ease-in-out',
    },
    section: {
      padding: '80px 60px',
    },
    featureSection: {
      backgroundColor: '#E6FFC8',
    },
    featureGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '32px',
      marginTop: '40px',
    },
    featureCard: {
      padding: '24px',
      borderRadius: '14px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease',
    },
    howItWorks: {
      textAlign: 'center',
      backgroundColor: '#FFF0FA',
    },
    stepsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '30px',
      marginTop: '40px',
    },
    stepCard: {
      padding: '24px',
      borderRadius: '14px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      textAlign: 'left',
    },
    footer: {
      backgroundColor: '#222',
      color: '#fff',
      padding: '60px 60px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: '30px',
    },
    footerTitle: {
      fontWeight: 'bold',
      marginBottom: '12px',
      fontSize: '18px',
    },
    footerLink: {
      marginBottom: '8px',
      fontSize: '15px',
      color: '#ccc',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <Navbar />

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroText}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '24px' }}>
            Plan Your Events with <span style={{ color: '#A33F5E' }}>Ease</span>
          </h1>
          <p style={{ fontSize: '20px', lineHeight: '1.8' }}>
            Your all-in-one platform for seamless event planning. Connect with vendors,
            manage budgets, and coordinate guests — all in one place.
          </p>
          <button style={styles.pinkButton}>Start Planning</button>
        </div>
        <img src="/hero-image.jpg" alt="Event" style={styles.heroImage} />
      </section>

      {/* Features Section */}
      <section style={{ ...styles.section, ...styles.featureSection }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px' }}>
          Everything You Need for Successful Events
        </h2>
        <p style={{ fontSize: '18px' }}>
          Simplify your event planning with our comprehensive set of features designed to make your life easier.
        </p>
        <div style={styles.featureGrid}>
          {[ 
            { title: 'Event Dashboard', color: '#dff0ff' },
            { title: 'Vendor Marketplace', color: '#ffe5e5' },
            { title: 'Budget Tracker', color: '#e0ffe2' },
            { title: 'Guest Management', color: '#f1e5ff' },
            { title: 'Event Logistics', color: '#fff8ce' },
            { title: 'Business Growth', color: '#ffe6ed' },
          ].map((f, i) => (
            <div key={i} style={{ ...styles.featureCard, backgroundColor: f.color }}>
              <h4 style={{ fontSize: '20px', fontWeight: 'bold' }}>{f.title}</h4>
              <p>Short description of the feature...</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{ ...styles.section, ...styles.howItWorks }}>
        <h2 style={{ fontSize: '32px', fontWeight: 'bold' }}>How EventEase Works</h2>
        <p style={{ color: '#A33F5E', fontWeight: 'bold', fontSize: '18px', marginBottom: '30px' }}>
          Planning an event has never been easier.
        </p>
        <div style={styles.stepsGrid}>
          {[
            { step: '1', title: 'Create Your Event' },
            { step: '2', title: 'Find & Book Vendors' },
            { step: '3', title: 'Manage Your Budget' },
            { step: '4', title: 'Coordinate Guests' },
            { step: '5', title: 'Track Progress in Dashboard' },
            { step: '6', title: 'Switch to Backup Vendors if Needed' },
          ].map((s, i) => (
            <div key={i} style={styles.stepCard}>
              <h3 style={{ fontSize: '24px', color: '#A33F5E' }}>{s.step}</h3>
              <h4 style={{ fontSize: '20px', fontWeight: 'bold' }}>{s.title}</h4>
              <p>Details about this step go here...</p>
            </div>
          ))}
        </div>
        <button style={{ ...styles.pinkButton, marginTop: '50px' }}>Start Planning</button>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        {[
          { title: 'EventEase', links: ['All-in-one platform', 'Guest & vendor management'] },
          { title: 'About', links: ['Features', 'Marketplace', 'Dashboard'] },
          { title: 'Company', links: ['Contact Us', 'Blog', 'Team'] },
          { title: 'Legal', links: ['Terms', 'Privacy', 'Cookies'] },
        ].map((col, i) => (
          <div key={i}>
            <div style={styles.footerTitle}>{col.title}</div>
            {col.links.map((l, j) => (
              <div key={j} style={styles.footerLink}>{l}</div>
            ))}
          </div>
        ))}
      </footer>
    </div>
  );
};

export default LandingPage;

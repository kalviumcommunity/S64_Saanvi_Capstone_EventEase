import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import cakeimage from '../assets/image.png';
import Navbar from '../components/NavBar';

const features = [
  {
    title: 'Event Dashboard',
    description: 'A central hub for tracking event progress, task completion, budgeting, and scheduling.',
    icon: '📋',
    bgColor: '#cceeff',
  },
  {
    title: 'Vendor Marketplace',
    description: 'Browse, search, filter, and book vendors based on location, price range, and ratings.',
    icon: '🤝',
    bgColor: '#ffe0cc',
  },
  {
    title: 'Budget Tracker',
    description: 'Monitor event expenses, log payments, and track balances to stay within budget.',
    icon: '🐷',
    bgColor: '#d4f7b8',
  },
  {
    title: 'Guest Management',
    description: 'Manage guest lists, send invitations, and track RSVPs with real-time responses.',
    icon: '👥',
    bgColor: '#e5ccff',
  },
  {
    title: 'Event Logistics',
    description: 'Track vendor statuses, deliveries, and task progress for seamless execution.',
    icon: '🚚',
    bgColor: '#fdf4b2',
  },
  {
    title: 'Business Growth',
    description: 'Vendor tools including performance dashboards and insights for business growth.',
    icon: '📈',
    bgColor: '#ffcccc',
  },
];

const howItWorks = [
  {
    title: 'Create Your Event',
    description: 'Set up your event details, including date, location, event type, and estimated budget.',
    icon: '👜',
    bgColor: '#ffb3b3',
  },
  {
    title: 'Find & Book Vendors',
    description: 'Browse our marketplace of verified vendors, read reviews, and book the perfect match for your event.',
    icon: '📋',
    bgColor: '#b2f2d0',
  },
  {
    title: 'Manage Your Budget',
    description: 'Track all expenses, payments, and outstanding balances to stay within your planned budget.',
    icon: '🐖',
    bgColor: '#9fe3e3',
  },
  {
    title: 'Coordinate Guests',
    description: 'Create guest lists, send custom invitations, and track RSVPs in real-time.',
    icon: '👤👤',
    bgColor: '#e8c2ff',
  },
];

const LandingPage = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#f4fbe8', color: '#222' }}>
      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <section
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '80px 10%',
          gap: '60px',
        }}
      >
        <div data-aos="fade-right" style={{ flex: 1 }}>
          <h1 style={{ fontSize: '69px', marginBottom: '26px' }}>
            Plan Your Events with <span style={{ color: '#e6007e' }}>Ease</span>
          </h1>
          <p style={{ fontSize: '28px', lineHeight: '1.6', maxWidth: '600px' }}>
            Your all-in-one platform for seamless event planning. Connect with vendors, manage budgets, and coordinate guests — all in one place.
          </p>
          <button
            style={{
              marginTop: '30px',
              padding: '16px 28px',
              fontSize: '34px',
              background: '#e6007e',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
            }}
          >
            Start Planning
          </button>
        </div>
        <div data-aos="fade-left" style={{ flex: 1, textAlign: 'center' }}>
          <img
            src={cakeimage}
            alt="Event Decor"
            style={{
              width: '100%',
              maxWidth: '1000px',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            }}
          />
        </div>
      </section>

      {/* Animated Feature Showcase Section */}
      <section id="showcase" style={{ padding: '60px 10%' }}>
        <h2 data-aos="fade-up" style={{ textAlign: 'center', fontSize: '40px', fontWeight: '700', marginBottom: '10px', color: '#e6007e' }}>
          EventEase Features Showcase
        </h2>
        <p data-aos="fade-up" data-aos-delay="100" style={{ textAlign: 'center', fontSize: '22px', color: '#5a005f', maxWidth: '700px', margin: '0 auto 40px auto', fontWeight: '500' }}>
          Discover how EventEase makes event planning effortless and fun!
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
          gap: '36px',
          marginTop: '40px',
        }}>
          {features.map((feature, idx) => (
            <div
              key={feature.title}
              data-aos="zoom-in-up"
              data-aos-delay={idx * 100}
              style={{
                background: feature.bgColor,
                borderRadius: '18px',
                boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
                padding: '38px 28px',
                textAlign: 'center',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '260px',
                animation: 'featurePop 0.7s cubic-bezier(.68,-0.55,.27,1.55)'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'scale(1.06)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(230,0,126,0.18)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{ fontSize: '54px', marginBottom: '18px', animation: 'iconBounce 1.2s infinite alternate' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '10px', color: '#A33F5E' }}>{feature.title}</h3>
              <p style={{ fontSize: '18px', color: '#333', fontWeight: '500' }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '60px 10%' }}>
        <h2 data-aos="fade-up" style={{ textAlign: 'center', fontSize: '36px', fontWeight: '700', marginBottom: '10px' }}>
          Everything You Need for Successful Events
        </h2>
        <p
          data-aos="fade-up"
          data-aos-delay="100"
          style={{
            textAlign: 'center',
            fontSize: '20px',
            color: '#5a005f',
            maxWidth: '700px',
            margin: '0 auto 40px auto',
            fontWeight: '500',
          }}
        >
          Simplify your event planning with our comprehensive set of features designed to make your life easier.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '30px',
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              style={{
                background: feature.bgColor,
                padding: '30px',
                borderRadius: '16px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ fontSize: '36px', marginBottom: '10px' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '10px' }}>{feature.title}</h3>
              <p style={{ fontSize: '16px', lineHeight: '1.6' }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How EventEase Works Section */}
      <section style={{ padding: '60px 10%', background: '#edf9d9' }}>
        <h2 data-aos="fade-up" style={{ textAlign: 'center', fontSize: '36px', fontWeight: '700', marginBottom: '10px' }}>
          How EventEase Works
        </h2>
        <p
          data-aos="fade-up"
          data-aos-delay="100"
          style={{
            textAlign: 'center',
            fontSize: '20px',
            color: '#9d00a7',
            maxWidth: '700px',
            margin: '0 auto 40px auto',
            fontWeight: '500',
          }}
        >
          Planning an event has never been easier. Follow these simple steps to create a memorable event with minimal stress.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '30px',
          }}
        >
          {howItWorks.map((step, index) => (
            <div
              key={index}
              data-aos="zoom-in"
              data-aos-delay={index * 100}
              style={{
                background: step.bgColor,
                padding: '30px',
                borderRadius: '16px',
                boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
                position: 'relative',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  fontSize: '22px',
                  fontWeight: 'bold',
                  color: '#b30000',
                }}
              >
                {index + 1}
              </span>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>{step.icon}</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>{step.title}</h3>
              <p style={{ fontSize: '16px', lineHeight: '1.6' }}>{step.description}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            style={{
              padding: '14px 32px',
              background: '#e6007e',
              color: '#fff',
              fontSize: '18px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            Start Planning
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1a1a1a', color: '#fff', padding: '20px 10%' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '39px', marginBottom: '23px', color: '#ff66a3' }}>EventEase</h3>
            <p style={{ fontSize: '26px', lineHeight: '1.6' }}>
              Your all-in-one platform for event planning, coordination, and execution.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '45px', marginBottom: '35px', color: '#ff99cc' }}>About</h4>
            <p>Features</p>
            <p>How it works</p>
            <p>Pricing</p>
          </div>
          <div>
            <h4 style={{ fontSize: '45px', marginBottom: '35px', color: '#ff99cc' }}>Company</h4>
            <p>Contact</p>
            <p>Careers</p>
            <p>Press</p>
          </div>
          <div>
            <h4 style={{ fontSize: '45px', marginBottom: '35px', color: '#ff99cc' }}>Legal</h4>
            <p>Terms</p>
            <p>Privacy</p>
            <p>Cookies</p>
          </div>
        </div>
        <div style={{ textAlign: 'center', fontSize: '30px', color: '#aaa' }}>
          © {new Date().getFullYear()} EventEase. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
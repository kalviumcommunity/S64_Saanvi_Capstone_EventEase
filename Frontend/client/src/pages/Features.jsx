import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaChartPie, FaHandshake, FaPiggyBank, FaUsers, FaTruck, FaChartLine } from 'react-icons/fa';

const features = [
  {
    title: 'Event Dashboard',
    description: 'A central hub for tracking event progress, task completion, budgeting, and scheduling.',
    icon: <FaChartPie size={54} color="#A33F5E" />,
    bgColor: '#cceeff',
  },
  {
    title: 'Vendor Marketplace',
    description: 'Browse, search, filter, and book vendors based on location, price range, and ratings.',
    icon: <FaHandshake size={54} color="#A33F5E" />,
    bgColor: '#ffe0cc',
  },
  {
    title: 'Budget Tracker',
    description: 'Monitor event expenses, log payments, and track balances to stay within budget.',
    icon: <FaPiggyBank size={54} color="#A33F5E" />,
    bgColor: '#d4f7b8',
  },
  {
    title: 'Guest Management',
    description: 'Manage guest lists, send invitations, and track RSVPs with real-time responses.',
    icon: <FaUsers size={54} color="#A33F5E" />,
    bgColor: '#e5ccff',
  },
  {
    title: 'Event Logistics',
    description: 'Track vendor statuses, deliveries, and task progress for seamless execution.',
    icon: <FaTruck size={54} color="#A33F5E" />,
    bgColor: '#fdf4b2',
  },
  {
    title: 'Business Growth',
    description: 'Vendor tools including performance dashboards and insights for business growth.',
    icon: <FaChartLine size={54} color="#A33F5E" />,
    bgColor: '#ffcccc',
  },
];

const Features = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#f4fbe8', color: '#222', minHeight: '100vh' }}>
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
              <div style={{ marginBottom: '18px', animation: 'iconBounce 1.2s infinite alternate' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '26px', fontWeight: '700', marginBottom: '10px', color: '#A33F5E' }}>{feature.title}</h3>
              <p style={{ fontSize: '18px', color: '#333', fontWeight: '500' }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Features; 
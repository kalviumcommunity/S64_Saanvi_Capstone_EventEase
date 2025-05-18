import React from 'react';
import { FaCalendarAlt, FaUsers, FaTasks, FaChartPie } from 'react-icons/fa';

const demoStats = [
  { icon: <FaCalendarAlt />, label: 'Events Managed', value: 12, color: '#e6007e' },
  { icon: <FaUsers />, label: 'Guests Invited', value: 320, color: '#7c4dff' },
  { icon: <FaTasks />, label: 'Tasks Completed', value: 45, color: '#36A2EB' },
  { icon: <FaChartPie />, label: 'Budget Used', value: '75%', color: '#FFCE56' },
];

const upcomingEvents = [
  {
    name: 'Spring Wedding',
    date: '2024-07-15',
    desc: 'A beautiful outdoor wedding with 150 guests and live music.'
  },
  {
    name: 'Corporate Gala',
    date: '2024-08-02',
    desc: 'Annual gala dinner for company partners and employees.'
  },
  {
    name: 'Birthday Bash',
    date: '2024-09-10',
    desc: 'A fun-filled birthday party with games, food, and a DJ.'
  },
];

const ExampleDashboard = () => (
  <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #f4fbe8 60%, #f3e5f5 100%)', padding: '60px 0' }}>
    <h1 style={{ textAlign: 'center', fontSize: '3rem', color: '#e6007e', marginBottom: '40px', fontWeight: 700 }}>
      Example Dashboard
    </h1>
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '40px',
      flexWrap: 'wrap',
      marginBottom: '60px',
    }}>
      {demoStats.map((stat, idx) => (
        <div
          key={stat.label}
          style={{
            background: '#fff',
            borderRadius: '18px',
            boxShadow: '0 6px 24px rgba(230,0,126,0.08)',
            padding: '38px 48px',
            minWidth: '220px',
            minHeight: '160px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'box-shadow 0.3s, transform 0.3s',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            animation: 'fadeInUp 0.7s cubic-bezier(.68,-0.55,.27,1.55)',
            border: `2px solid ${stat.color}`,
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'scale(1.06)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(230,0,126,0.18)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(230,0,126,0.08)';
          }}
        >
          <div style={{ fontSize: '2.8rem', color: stat.color, marginBottom: '18px', animation: 'iconBounce 1.2s infinite alternate' }}>{stat.icon}</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 600, color: stat.color, marginBottom: '8px' }}>{stat.label}</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 700, color: '#222' }}>{stat.value}</div>
        </div>
      ))}
    </div>
    <div style={{ textAlign: 'center', fontSize: '1.3rem', color: '#555', maxWidth: 700, margin: '0 auto 40px auto' }}>
      <p>
        This is a sample dashboard to showcase how your event management stats and progress will look in EventEase.<br />
        Sign up or log in to access your personalized dashboard and start planning your events with ease!
      </p>
    </div>
    <div style={{ maxWidth: 900, margin: '0 auto', marginTop: 50 }}>
      <h2 style={{ textAlign: 'center', color: '#7c4dff', fontWeight: 700, fontSize: '2rem', marginBottom: 30 }}>Upcoming Events</h2>
      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {upcomingEvents.map(ev => (
          <div key={ev.name} style={{
            background: '#fff',
            borderRadius: '14px',
            boxShadow: '0 4px 16px rgba(124,77,255,0.10)',
            padding: '28px 32px',
            minWidth: 220,
            maxWidth: 320,
            marginBottom: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            borderLeft: '6px solid #e6007e',
            transition: 'box-shadow 0.2s, transform 0.2s',
          }}>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#e6007e', marginBottom: 6 }}>{ev.name}</div>
            <div style={{ color: '#7c4dff', fontWeight: 500, marginBottom: 8 }}>{new Date(ev.date).toLocaleDateString()}</div>
            <div style={{ color: '#444', fontSize: '1rem' }}>{ev.desc}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ExampleDashboard; 
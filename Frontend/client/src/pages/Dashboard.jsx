import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}>
        <div>
          <h1 style={{ 
            fontSize: '24px', 
            color: '#2954a3',
            marginBottom: '8px'
          }}>
            Welcome, {user.name || 'User'}!
          </h1>
          <p style={{ color: '#666' }}>
            Manage your events and settings here
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            backgroundColor: '#fff',
            color: '#e6007e',
            border: '2px solid #e6007e',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#e6007e';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#fff';
            e.currentTarget.style.color = '#e6007e';
          }}
        >
          Logout
        </button>
      </header>

      <main style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        padding: '20px',
      }}>
        <div style={{
          padding: '30px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ marginBottom: '20px', color: '#2954a3' }}>Your Events</h2>
          <p style={{ color: '#666' }}>No events created yet.</p>
        </div>

        <div style={{
          padding: '30px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
          <h2 style={{ marginBottom: '20px', color: '#2954a3' }}>Quick Actions</h2>
          <button
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#2954a3',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '10px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1f3f7a'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2954a3'}
          >
            Create New Event
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 
import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <p>Welcome to your event dashboard, {user?.username}!</p>
      {/* TODO: Add dashboard content */}
    </div>
  );
};

export default Dashboard; 
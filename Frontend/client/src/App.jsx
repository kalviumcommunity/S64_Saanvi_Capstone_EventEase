import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Vendor from './pages/Vendor';
import Guests from './pages/Guests';
import Budget from './pages/Budget';
import AddBudget from './pages/AddBudget';
import Reviews from './pages/Reviews';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import { NotificationProvider } from './context/NotificationContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="app">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/vendor"
                element={
                  <ProtectedRoute>
                    <Vendor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/guests"
                element={
                  <ProtectedRoute>
                    <Guests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/budget"
                element={
                  <ProtectedRoute>
                    <Budget />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/budget/add"
                element={
                  <ProtectedRoute>
                    <AddBudget />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reviews"
                element={
                  <ProtectedRoute>
                    <Reviews />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Catch all route - 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;

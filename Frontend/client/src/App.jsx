import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Guests from './pages/Guests';
import BudgetManagementPage from './pages/BudgetManagementPage';
import ReviewPage from './pages/ReviewPage';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import Features from './pages/Features';
import ExampleDashboard from './pages/ExampleDashboard';
import Vendor from './pages/Vendor';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/NavBar';      // Before login
import Navbar2 from './components/Navbar2';    // After login
import Dashboard from './pages/Dashboard';
import EventDetails from './pages/EventDetails';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" />;
  }
  return children;
};

// Wrapper to handle navbar logic
const AppContent = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Define routes where you want the BEFORE login navbar
  const publicRoutes = ['/', '/login', '/signup'];

  // If on a public route and NOT logged in, show Navbar
  const showBeforeLoginNavbar = publicRoutes.includes(location.pathname.toLowerCase()) && !user;

  // If logged in and not on a public route, show Navbar2
  const showAfterLoginNavbar = user && !publicRoutes.includes(location.pathname.toLowerCase());

  // For debugging - always show Navbar on landing page for now
  const isLandingPage = location.pathname === '/';
  
  // Debug logging
  console.log('AppContent Debug:', {
    pathname: location.pathname,
    user: user,
    showBeforeLoginNavbar,
    showAfterLoginNavbar,
    isLandingPage
  });

  return (
    <>
      {(showBeforeLoginNavbar || isLandingPage) && <Navbar />}
      {showAfterLoginNavbar && <Navbar2 />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route
          path="/Home"
          element={
            <ProtectedRoute>
              <Home />
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
        <Route
          path="/budget"
          element={
            <ProtectedRoute>
              <BudgetManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/review"
          element={
            <ProtectedRoute>
              <ReviewPage />
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
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/event-details"
          element={
            <ProtectedRoute>
              <EventDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendors"
          element={
            <ProtectedRoute>
              <Vendor />
            </ProtectedRoute>
          }
        />
        <Route path="/features" element={<Features />} />
        <Route path="/example-dashboard" element={<ExampleDashboard />} />

        {/* Catch all route - 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="app">
            <AppContent />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;

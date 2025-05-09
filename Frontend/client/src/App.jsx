// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider, useAuth } from './context/AuthContext';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import Dashboard from './pages/Dashboard';
// import Vendor from './pages/Vendor';
// import Guests from './pages/Guests';
// import BudgetManagementPage from './pages/BudgetManagementPage';
// import AddBudget from './pages/AddBudget';
// import ReviewPage from './pages/ReviewPage';
// import Profile from './pages/Profile';
// import LandingPage from './pages/LandingPage';
// import { NotificationProvider } from './context/NotificationContext';

// // Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   const { user } = useAuth();
//   if (!user) {
//     return <Navigate to="/login" />;
//   }
//   return children;
// };

// const App = () => {
//   return (
//     <AuthProvider>
//       <NotificationProvider>
//         <Router>
//           <div className="app">
//             <Routes>
//               {/* Public Routes */}
//               <Route path="/" element={<LandingPage />} />
//               <Route path="/login" element={<Login />} />
//               <Route path="/signup" element={<Signup />} />
//               <Route path="/home" element={<Home/>} />
//               <Route path="/profile" element={<Profile />}/>
//               <Route path="/budget" element={<BudgetManagementPage />} />
//               <Route path="/Review" element={<ReviewPage />} />

//               {/* Protected Routes
//               <Route
//                 path="/home"
//                 element={
//                   <ProtectedRoute>
//                     <Home />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/dashboard"
//                 element={
//                   <ProtectedRoute>
//                     <Dashboard />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/vendor"
//                 element={
//                   <ProtectedRoute>
//                     <Vendor />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/guests"
//                 element={
//                   <ProtectedRoute>
//                     <Guests />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/budget"
//                 element={
//                   <ProtectedRoute>
//                     <Budget />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/budget/add"
//                 element={
//                   <ProtectedRoute>
//                     <AddBudget />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/reviews"
//                 element={
//                   <ProtectedRoute>
//                     <Reviews />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="/profile"
//                 element={
//                   <ProtectedRoute>
//                     <Profile />
//                   </ProtectedRoute>
//                 }
//               /> */}

//               {/* Catch all route - 404 */}
//               <Route path="*" element={<Navigate to="/" replace />} />
//             </Routes>
//           </div>
//         </Router>
//       </NotificationProvider>
//     </AuthProvider>
//   );
// };

// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Guests from './pages/Guest';
import BudgetManagementPage from './pages/BudgetManagementPage';
import ReviewPage from './pages/ReviewPage';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
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

  return (
    <>
      {showBeforeLoginNavbar && <Navbar />}
      {showAfterLoginNavbar && <Navbar2 />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/budget" element={<BudgetManagementPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/guest" element={<Guests />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/event-details" element={<EventDetails />} />

        {/* Protected Routes */}
        {/* <Route
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
              <BudgetManagementPage />
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
          path="/review"
          element={
            <ProtectedRoute>
              <ReviewPage />
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
        /> */}

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
          <AppContent />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;

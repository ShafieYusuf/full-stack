import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchBus from './pages/SearchBus';
import Booking from './pages/Booking';
import Bookings from './pages/Bookings';
import BookingConfirmation from './pages/BookingConfirmation';
import Dashboard from './pages/Dashboard';
import AdminLayout from './admin/components/AdminLayout';
import AdminDashboard from './admin/pages/Dashboard';
import AdminBuses from './admin/pages/Buses';
import AdminBookings from './admin/pages/Bookings';
import AdminBookingDetails from './admin/pages/BookingDetails';
import AdminUsers from './admin/pages/Users';
import AdminAnalytics from './admin/pages/Analytics';
import { useAuth } from './context/AuthContext';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import PaymentPage from './pages/PaymentPage';
import About from './pages/About';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading, checkTokenExpiry } = useAuth();

  useEffect(() => {
    if (user) {
      checkTokenExpiry();
    }
  }, [user, checkTokenExpiry]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} />;
  }

  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user, loading, checkTokenExpiry } = useAuth();

  useEffect(() => {
    if (user) {
      checkTokenExpiry();
    }
  }, [user, checkTokenExpiry]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" state={{ from: window.location.pathname }} />;
  }

  return <AdminLayout>{children}</AdminLayout>;
};

// Main Routes Component
const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Customer Routes */}
      <Route path="/search" element={<SearchBus />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            {user?.role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <Dashboard />}
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/bookings" 
        element={
          <ProtectedRoute>
            {user?.role === 'admin' ? <Navigate to="/admin/bookings" replace /> : <Bookings />}
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/booking/:busId" 
        element={
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/booking/confirmation/:bookingId" 
        element={
          <ProtectedRoute>
            <BookingConfirmation />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/payment/:temporaryBookingId" 
        element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        } 
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/buses"
        element={
          <AdminRoute>
            <AdminBuses />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <AdminRoute>
            <AdminBookings />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/bookings/:bookingId"
        element={
          <AdminRoute>
            <AdminBookingDetails />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <AdminRoute>
            <AdminAnalytics />
          </AdminRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <AuthProvider>
          <LanguageProvider>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <AppRoutes />
            </div>
          </LanguageProvider>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;

const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getDashboardStats,
  getBookingAnalytics,
  getUserAnalytics,
  getBusAnalytics,
  getRevenueAnalytics,
  getAllBuses,
  createBus,
  updateBus,
  deleteBus,
  getAllBookings,
  updateBookingStatus,
  getAllUsers,
  updateUserRole,
  updateUserStatus
} = require('../controllers/admin.controller');

const router = express.Router();

// Protect all routes and restrict to admin only
router.use(protect);
router.use(authorize('admin'));

// Dashboard routes
router.get('/dashboard', getDashboardStats);

// Bus management routes
router.route('/buses')
  .get(getAllBuses)
  .post(createBus);

router.route('/buses/:id')
  .put(updateBus)
  .delete(deleteBus);

// Booking management routes
router.get('/bookings', getAllBookings);
router.patch('/bookings/:id', updateBookingStatus);

// User management routes
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/status', updateUserStatus);

// Analytics routes
router.get('/analytics/bookings', getBookingAnalytics);
router.get('/analytics/users', getUserAnalytics);
router.get('/analytics/buses', getBusAnalytics);
router.get('/analytics/revenue', getRevenueAnalytics);

module.exports = router; 
const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  createBooking,
  getUserBookings,
  getBookingDetails,
  cancelBooking,
  getBookingStats,
  updatePaymentStatus,
  deleteBooking,
  createTemporaryBooking,
  confirmBooking,
  getTemporaryBooking,
  generateTicket
} = require('../controllers/booking.controller');

const router = express.Router();

// Protect all routes
router.use(protect);

// User routes
router.post('/', createBooking);
router.post('/temporary', createTemporaryBooking);
router.get('/temporary/:id', getTemporaryBooking);
router.post('/confirm/:id', confirmBooking);
router.get('/', getUserBookings);
router.get('/:id', getBookingDetails);
router.put('/:id/cancel', cancelBooking);
router.put('/:id/payment', updatePaymentStatus);
router.delete('/:id', deleteBooking);
router.get('/:id/ticket', generateTicket);

// Admin routes
router.use(authorize('admin'));
router.get('/stats', getBookingStats);

module.exports = router; 
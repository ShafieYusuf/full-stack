const express = require('express');
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  searchBuses,
  getBusDetails,
  addBus,
  updateBus,
  deleteBus,
  getPopularRoutes
} = require('../controllers/bus.controller');

const router = express.Router();

// Public routes
router.post('/search', searchBuses);
router.get('/popular-routes', getPopularRoutes);
router.get('/:id', getBusDetails);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.post('/', addBus);
router.put('/:id', updateBus);
router.delete('/:id', deleteBus);

module.exports = router; 
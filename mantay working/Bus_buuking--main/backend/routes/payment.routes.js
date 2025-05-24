const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { initiateWaafiPayment, handleWaafiCallback } = require('../controllers/payment.controller');

const router = express.Router();

// Protected routes
router.post('/waafi/initiate', protect, initiateWaafiPayment);

// Public routes (for callbacks from WaafiPay)
router.post('/waafi/callback', handleWaafiCallback);

module.exports = router; 
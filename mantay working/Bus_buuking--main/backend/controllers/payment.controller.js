const asyncHandler = require('express-async-handler');
const axios = require('axios');
const Booking = require('../models/booking.model');
const crypto = require('crypto');
const Bus = require('../models/bus.model');

// WaafiPay API configuration
const WAAFI_API_URL = process.env.WAAFI_API_URL || 'https://api.waafipay.net/asm';
const MERCHANT_UID = process.env.WAAFI_MERCHANT_UID;
const API_USER_ID = process.env.WAAFI_API_USER_ID;
const API_KEY = process.env.WAAFI_API_KEY;

// Validate required environment variables
if (!MERCHANT_UID || !API_USER_ID || !API_KEY) {
  console.error('Missing required WaafiPay configuration. Please check your environment variables.');
}

/**
 * Generate a unique request ID
 */
const generateRequestId = () => {
  return crypto.randomBytes(8).toString('hex');
};

/**
 * Initiate WaafiPay payment
 * @route POST /api/payments/waafi/initiate
 * @access Private
 */
const initiateWaafiPayment = asyncHandler(async (req, res) => {
  try {
    const { paymentMethod, phoneNumber, amount, bookingId, currency = 'USD', description } = req.body;

    // Validate required fields
    if (!phoneNumber || !amount || !bookingId) {
      return res.status(400).json({
        success: false,
        message: 'Phone number, amount, and booking ID are required'
      });
    }

    // Validate booking exists and belongs to user
    const booking = await Booking.findOne({ _id: bookingId, userId: req.user._id });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or does not belong to the user'
      });
    }

    // Prepare WaafiPay request payload
    const requestPayload = {
      schemaVersion: "1.0",
      requestId: generateRequestId(),
      timestamp: new Date().toISOString(),
      channelName: "WEB",
      serviceName: "API_PURCHASE",
      serviceParams: {
        merchantUid: MERCHANT_UID,
        apiUserId: API_USER_ID,
        apiKey: API_KEY,
        paymentMethod: "mwallet_account",
        payerInfo: {
          accountNo: phoneNumber
        },
        transactionInfo: {
          referenceId: bookingId,
          invoiceId: `INV-${bookingId}`,
          amount: parseFloat(amount),
          currency: currency,
          description: description || `Bus Booking Payment - ${bookingId}`
        }
      }
    };

    console.log('Initiating WaafiPay payment with payload:', JSON.stringify(requestPayload, null, 2));

    // Make request to WaafiPay API
    const response = await axios.post(WAAFI_API_URL, requestPayload);
    console.log('WaafiPay API Response:', JSON.stringify(response.data, null, 2));

    // Handle WaafiPay response
    if (response.data.responseCode === '2001') {
      // Payment initiated successfully
      return res.json({
        success: true,
        paymentId: response.data.params.transactionId,
        hostedPayPageUrl: response.data.params.redirectUrl
      });
    } else {
      return res.status(400).json({
        success: false,
        message: response.data.responseMsg || 'Payment initiation failed',
        details: response.data
      });
    }
  } catch (error) {
    console.error('Payment initiation error:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
      error: error.response?.data?.responseMsg || error.message
    });
  }
});

/**
 * Handle WaafiPay callback
 * @route POST /api/payments/waafi/callback
 * @access Public
 */
const handleWaafiCallback = asyncHandler(async (req, res) => {
  const { referenceId, transactionId, responseCode, responseMsg } = req.body;

  try {
    // Find the booking
    const booking = await Booking.findById(referenceId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    // Handle payment rejection (code 5310 is for user rejection)
    if (responseCode === '5310') {
      // Delete the booking since payment was rejected
      await Booking.findByIdAndDelete(referenceId);
      
      // Also update the bus to release the seats
      const bus = await Bus.findById(booking.busId);
      if (bus) {
        bus.availableSeats += booking.seats.length;
        bus.bookedSeats = bus.bookedSeats.filter(seat => 
          !booking.seats.some(bookedSeat => bookedSeat.seatNumber === seat.seatNumber)
        );
        await bus.save();
      }

      return res.json({ success: true, message: 'Payment rejected, booking deleted' });
    }

    // Update booking payment status for other cases
    if (responseCode === '2001') {
      booking.paymentStatus = 'completed';
      booking.status = 'confirmed';
      booking.paymentId = transactionId;
      await booking.save();

      // TODO: Send payment confirmation email to user
    } else {
      booking.paymentStatus = 'failed';
      booking.paymentError = responseMsg;
      await booking.save();
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Payment callback error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = {
  initiateWaafiPayment,
  handleWaafiCallback
}; 
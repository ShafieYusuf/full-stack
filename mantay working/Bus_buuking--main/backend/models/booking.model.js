const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true
  },
  seats: [{
    seatNumber: {
      type: Number,
      required: true
    },
    passenger: {
      name: {
        type: String,
        required: true
      },
      age: {
        type: Number,
        required: true
      },
      gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
      }
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: [0.01, 'Total amount must be at least 0.01']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentId: {
    type: String
  },
  paymentMethod: {
    type: String,
    enum: ['evc', 'zaad', 'golis']
  },
  transactionId: {
    type: String
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  journeyDate: {
    type: Date,
    required: true
  },
  cancellationReason: {
    type: String
  },
  cancellationDate: {
    type: Date
  },
  refundAmount: {
    type: Number
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Add index for faster queries
bookingSchema.index({ userId: 1, journeyDate: -1 });
bookingSchema.index({ busId: 1, journeyDate: 1 });

// Index for expiring temporary bookings
bookingSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking; 
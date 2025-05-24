const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busName: {
    type: String,
    required: [true, 'Bus name is required'],
    trim: true
  },
  busNumber: {
    type: String,
    required: [true, 'Bus number is required'],
    unique: true,
    trim: true
  },
  from: {
    type: String,
    required: [true, 'Departure city is required'],
    trim: true
  },
  to: {
    type: String,
    required: [true, 'Destination city is required'],
    trim: true
  },
  departureTime: {
    type: Date,
    required: [true, 'Departure time is required']
  },
  arrivalTime: {
    type: Date,
    required: [true, 'Arrival time is required']
  },
  fare: {
    type: Number,
    required: [true, 'Fare is required'],
    min: [0.01, 'Fare must be at least 0.01'],
    get: v => parseFloat(v.toFixed(2)),
    set: v => parseFloat(parseFloat(v).toFixed(2))
  },
  totalSeats: {
    type: Number,
    required: [true, 'Total seats is required'],
    min: [1, 'Total seats must be at least 1']
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 0
  },
  seatLayout: {
    type: String,
    enum: ['2x2', '2x3'],
    default: '2x2'
  },
  amenities: [{
    type: String,
    enum: ['AC', 'WiFi', 'USB Charging', 'Snacks', 'Water', 'Blanket', 'Movie']
  }],
  type: {
    type: String,
    enum: ['AC Sleeper', 'Non-AC Sleeper', 'AC Seater', 'Non-AC Seater'],
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Cancelled', 'Completed'],
    default: 'Active'
  },
  bookedSeats: [{
    seatNumber: Number,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

// Virtual field for duration
busSchema.virtual('duration').get(function() {
  return Math.round((this.arrivalTime - this.departureTime) / (1000 * 60 * 60)); // Duration in hours
});

const Bus = mongoose.model('Bus', busSchema);

module.exports = Bus; 
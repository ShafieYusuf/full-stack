const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB with better error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bus-booking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB Connected Successfully');
})
.catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

// Import routes
const authRoutes = require('./routes/auth.routes');
const busRoutes = require('./routes/bus.routes');
const bookingRoutes = require('./routes/booking.routes');
const adminRoutes = require('./routes/admin.routes');
const paymentRoutes = require('./routes/payment.routes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Bus Booking API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: Object.values(err.errors).map(error => error.message)
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      message: 'Duplicate field value entered',
      field: Object.keys(err.keyPattern)[0]
    });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong on the server',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
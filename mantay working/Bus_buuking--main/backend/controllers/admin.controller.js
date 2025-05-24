const Bus = require('../models/bus.model');
const Booking = require('../models/booking.model');
const User = require('../models/user.model');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalBookings,
      totalRevenue,
      totalUsers,
      totalBuses,
      recentBookings,
      bookingStats,
      popularRoutes
    ] = await Promise.all([
      // Total bookings
      Booking.countDocuments(),
      
      // Total revenue
      Booking.aggregate([
        { $match: { status: 'confirmed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),

      // Total users
      User.countDocuments({ role: 'customer' }),

      // Total buses
      Bus.countDocuments(),

      // Recent bookings
      Booking.find()
        .populate('userId', 'name email')
        .populate('busId', 'busName from to')
        .sort('-createdAt')
        .limit(5),

      // Booking statistics by status
      Booking.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            revenue: { $sum: '$totalAmount' }
          }
        }
      ]),

      // Popular routes
      Bus.aggregate([
        {
          $group: {
            _id: { from: '$from', to: '$to' },
            count: { $sum: 1 },
            revenue: { $sum: '$fare' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    ]);

    res.json({
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalUsers,
      totalBuses,
      recentBookings,
      bookingStats,
      popularRoutes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking analytics
// @route   GET /api/admin/analytics/bookings
// @access  Private/Admin
exports.getBookingAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const bookingAnalytics = await Booking.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.json(bookingAnalytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user analytics
// @route   GET /api/admin/analytics/users
// @access  Private/Admin
exports.getUserAnalytics = async (req, res) => {
  try {
    const userAnalytics = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json(userAnalytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bus occupancy analytics
// @route   GET /api/admin/analytics/buses
// @access  Private/Admin
exports.getBusAnalytics = async (req, res) => {
  try {
    const busAnalytics = await Bus.aggregate([
      {
        $group: {
          _id: '$type',
          totalBuses: { $sum: 1 },
          averageOccupancy: {
            $avg: {
              $subtract: [
                '$totalSeats',
                '$availableSeats'
              ]
            }
          }
        }
      }
    ]);

    res.json(busAnalytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get revenue analytics
// @route   GET /api/admin/analytics/revenue
// @access  Private/Admin
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const revenueAnalytics = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          bookings: { $sum: 1 },
          averageTicketPrice: { $avg: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json(revenueAnalytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bus Management
exports.getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBus = async (req, res) => {
  try {
    const bus = await Bus.create(req.body);
    res.status(201).json(bus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.json(bus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.json({ message: 'Bus deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Booking Management
exports.getAllBookings = async (req, res) => {
  try {
    const { status, date, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build query
    const query = {
      // Exclude temporary/pending bookings and rejected payments
      $and: [
        { status: { $ne: 'pending' } },
        { paymentStatus: { $ne: 'pending' } }
      ]
    };

    // Add status filter if provided
    if (status && status !== 'all') {
      query.status = status;
    }

    // Add date filter if provided
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.journeyDate = {
        $gte: startDate,
        $lt: endDate
      };
    }

    // Add search filter if provided
    if (search) {
      query.$or = [
        { 'busId.busName': { $regex: search, $options: 'i' } },
        { 'userId.name': { $regex: search, $options: 'i' } },
        { bookingNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const bookings = await Booking.find(query)
      .populate('busId', 'busName from to departureTime arrivalTime type')
      .populate('userId', 'name email phoneNumber')
      .sort(sort);

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// User Management
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    ).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 
exports.getAdminBookings = async (req, res) => {
  try {
    const { status, date, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build query
    let query = {
      // By default, only show completed payments
      paymentStatus: 'completed'
    };
    
    // Add status filter if provided and not 'all'
    if (status && status !== 'all') {
      query.status = status;
    } else {
      // If no status filter or 'all', still exclude pending payments
      query.status = { $ne: 'pending' };
    }
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.journeyDate = {
        $gte: startDate,
        $lt: endDate
      };
    }
    
    if (search) {
      query.$or = [
        { 'bookingNumber': { $regex: search, $options: 'i' } },
        { 'userId.name': { $regex: search, $options: 'i' } },
        { 'userId.email': { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sortObject = {};
    sortObject[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const bookings = await Booking.find(query)
      .populate('userId', 'name email')
      .populate('busId', 'busName from to departureTime')
      .sort(sortObject)
      .lean();

    res.json(bookings);
  } catch (error) {
    console.error('Error in getAdminBookings:', error);
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
}; 
const Bus = require('../models/bus.model');

// @desc    Search buses
// @route   POST /api/buses/search
// @access  Public
exports.searchBuses = async (req, res) => {
  try {
    const { from, to, date, passengers } = req.body;
    console.log('Received search params:', { from, to, date, passengers });
    
    if (!from || !to || !date) {
      return res.status(400).json({ message: 'Please provide from, to and date' });
    }

    // Create base query
    const query = {
      from: from,
      to: to,
      status: 'Active',
      availableSeats: { $gte: passengers || 1 }
    };

    // Parse the search date and set to midnight UTC
    const searchDate = new Date(date);
    // Ensure we're working with UTC
    const utcYear = searchDate.getUTCFullYear();
    const utcMonth = searchDate.getUTCMonth();
    const utcDay = searchDate.getUTCDate();
    
    // Create start of day in UTC
    const startOfDay = new Date(Date.UTC(utcYear, utcMonth, utcDay, 0, 0, 0, 0));
    
    // Create end of day in UTC
    const endOfDay = new Date(Date.UTC(utcYear, utcMonth, utcDay, 23, 59, 59, 999));

    // Add date range to query
    query.departureTime = {
      $gte: startOfDay,
      $lte: endOfDay
    };

    console.log('Search query:', JSON.stringify(query, null, 2));
    console.log('Date range:', {
      start: startOfDay.toISOString(),
      end: endOfDay.toISOString()
    });

    // First find all buses for this route (for debugging)
    const routeBuses = await Bus.find({
      from: from,
      to: to,
      status: 'Active'
    }).lean();

    console.log('All buses for this route:', JSON.stringify(routeBuses, null, 2));

    // Now search with all criteria
    const buses = await Bus.find(query)
      .select('busName type from to departureTime arrivalTime fare availableSeats amenities seatLayout')
      .sort('departureTime')
      .lean();

    console.log('Matching buses:', JSON.stringify(buses, null, 2));

    res.json(buses);
  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bus details
// @route   GET /api/buses/:id
// @access  Public
exports.getBusDetails = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new bus
// @route   POST /api/buses
// @access  Private/Admin
exports.addBus = async (req, res) => {
  try {
    const bus = new Bus({
      ...req.body,
      availableSeats: req.body.totalSeats
    });
    const savedBus = await bus.save();
    res.status(201).json(savedBus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update bus
// @route   PUT /api/buses/:id
// @access  Private/Admin
exports.updateBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    Object.assign(bus, req.body);
    const updatedBus = await bus.save();
    res.json(updatedBus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete bus
// @route   DELETE /api/buses/:id
// @access  Private/Admin
exports.deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    await bus.remove();
    res.json({ message: 'Bus removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get popular routes
// @route   GET /api/buses/popular-routes
// @access  Public
exports.getPopularRoutes = async (req, res) => {
  try {
    const routes = await Bus.aggregate([
      { $match: { status: 'Active' } },
      {
        $group: {
          _id: { from: '$from', to: '$to' },
          count: { $sum: 1 },
          minFare: { $min: '$fare' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 
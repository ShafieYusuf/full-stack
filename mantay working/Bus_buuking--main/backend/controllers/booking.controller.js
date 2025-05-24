const Booking = require('../models/booking.model');
const Bus = require('../models/bus.model');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const { busId, seats, paymentMethod } = req.body;

    // Check if bus exists and has available seats
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    // Validate seat availability
    const unavailableSeats = seats.filter(seat => 
      bus.bookedSeats.some(bookedSeat => bookedSeat.seatNumber === seat.seatNumber)
    );

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: `Seats ${unavailableSeats.map(s => s.seatNumber).join(', ')} are already booked. Please refresh and select different seats.`
      });
    }

    // Check if there are enough available seats
    if (bus.availableSeats < seats.length) {
      return res.status(400).json({
        message: 'Not enough available seats'
      });
    }

    // Calculate total amount
    const totalAmount = seats.length * bus.fare;

    // Create booking
    const booking = new Booking({
      userId: req.user._id,
      busId,
      seats,
      totalAmount,
      paymentMethod,
      journeyDate: bus.departureTime
    });

    // Save booking
    const savedBooking = await booking.save();

    // Update bus available seats and booked seats
    bus.availableSeats -= seats.length;
    bus.bookedSeats.push(...seats.map(seat => ({
      seatNumber: seat.seatNumber,
      userId: req.user._id
    })));
    await bus.save();

    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ 
      userId: req.user._id,
      paymentStatus: 'completed',  // Only show completed payments
      status: 'confirmed'  // Only show confirmed bookings
    })
      .populate('busId', 'busName from to departureTime arrivalTime')
      .sort('-bookingDate');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking details
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('busId', 'busName from to departureTime arrivalTime type')
      .populate('userId', 'name email phoneNumber');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is admin or the booking owner
    if (req.user.role !== 'admin' && booking.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking belongs to the user
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Check if booking can be cancelled (e.g., not too close to departure)
    const now = new Date();
    const departureTime = new Date(booking.journeyDate);
    const hoursUntilDeparture = (departureTime - now) / (1000 * 60 * 60);

    if (hoursUntilDeparture < 24) {
      return res.status(400).json({ message: 'Booking cannot be cancelled within 24 hours of departure' });
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.cancellationDate = new Date();
    booking.cancellationReason = req.body.reason;

    // Calculate refund amount (e.g., 75% if cancelled more than 24 hours before)
    booking.refundAmount = Math.round(booking.totalAmount * 0.75);

    // Update bus available seats
    const bus = await Bus.findById(booking.busId);
    if (bus) {
      bus.availableSeats += booking.seats.length;
      bus.bookedSeats = bus.bookedSeats.filter(seat => 
        !booking.seats.some(bookedSeat => bookedSeat.seatNumber === seat.seatNumber)
      );
      await bus.save();
    }

    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking statistics
// @route   GET /api/bookings/stats
// @access  Private/Admin
exports.getBookingStats = async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking payment status
// @route   PUT /api/bookings/:id/payment
// @access  Private
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId, status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to update this booking
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    // Update booking with payment information
    booking.paymentStatus = status;
    booking.paymentId = paymentId;
    booking.paymentDate = new Date();

    // If payment is successful, update the booking status to confirmed
    if (status === 'paid') {
      booking.status = 'confirmed';
    }

    await booking.save();

    // Return updated booking
    const updatedBooking = await Booking.findById(req.params.id)
      .populate('busId', 'busName from to departureTime arrivalTime type')
      .populate('userId', 'name email phoneNumber');

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete booking (when payment is rejected)
// @route   DELETE /api/bookings/:id
// @access  Private
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to delete this booking
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }

    // Update bus available seats and remove booked seats
    const bus = await Bus.findById(booking.busId);
    if (bus) {
      // Increase available seats
      bus.availableSeats += booking.seats.length;
      
      // Remove booked seats
      bus.bookedSeats = bus.bookedSeats.filter(seat => 
        !booking.seats.some(bookedSeat => bookedSeat.seatNumber === seat.seatNumber)
      );
      
      await bus.save();
    }

    // Delete the booking
    await booking.deleteOne();

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clean up expired temporary bookings
// @route   Internal function
const cleanupExpiredBookings = async () => {
  try {
    // Find all expired temporary bookings
    const expiredBookings = await Booking.find({
      status: 'pending',
      paymentStatus: 'pending',
      expiresAt: { $lt: new Date() }
    });

    // Delete each expired booking and update bus seats
    for (const booking of expiredBookings) {
      // Update bus available seats
      const bus = await Bus.findById(booking.busId);
      if (bus) {
        bus.availableSeats += booking.seats.length;
        bus.bookedSeats = bus.bookedSeats.filter(seat => 
          !booking.seats.some(bookedSeat => bookedSeat.seatNumber === seat.seatNumber)
        );
        await bus.save();
      }

      // Delete the booking
      await booking.deleteOne();
    }
  } catch (error) {
    console.error('Error cleaning up expired bookings:', error);
  }
};

// Run cleanup every 5 minutes
setInterval(cleanupExpiredBookings, 5 * 60 * 1000);

// @desc    Create temporary booking before payment
// @route   POST /api/bookings/temporary
// @access  Private
exports.createTemporaryBooking = async (req, res) => {
  try {
    const { busId, seats } = req.body;

    // Check if bus exists and has available seats
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    // Validate seat availability
    const unavailableSeats = seats.filter(seat => 
      bus.bookedSeats.some(bookedSeat => bookedSeat.seatNumber === seat.seatNumber)
    );

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: `Seats ${unavailableSeats.map(s => s.seatNumber).join(', ')} are already booked. Please refresh and select different seats.`
      });
    }

    // Check if there are enough available seats
    if (bus.availableSeats < seats.length) {
      return res.status(400).json({
        message: 'Not enough available seats'
      });
    }

    // Calculate total amount
    const totalAmount = seats.length * bus.fare;

    // Create temporary booking
    const booking = new Booking({
      userId: req.user._id,
      busId,
      seats,
      totalAmount,
      paymentStatus: 'pending',
      status: 'pending',
      journeyDate: bus.departureTime,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000) // Expires in 15 minutes
    });

    // Save booking
    const savedBooking = await booking.save();

    // Don't update bus seats yet since this is temporary
    // We'll update them after payment is confirmed

    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Confirm booking after successful payment
// @route   POST /api/bookings/confirm/:id
// @access  Private
exports.confirmBooking = async (req, res) => {
  try {
    const { paymentId, transactionId } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to confirm this booking' });
    }

    // Check if booking is still pending
    if (booking.status !== 'pending' || booking.paymentStatus !== 'pending') {
      return res.status(400).json({ message: 'Invalid booking status' });
    }

    // Update bus available seats and booked seats
    const bus = await Bus.findById(booking.busId);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    // Check if seats are still available
    const unavailableSeats = booking.seats.filter(seat => 
      bus.bookedSeats.some(bookedSeat => bookedSeat.seatNumber === seat.seatNumber)
    );

    if (unavailableSeats.length > 0) {
      // Delete the booking since seats are no longer available
      await booking.deleteOne();
      return res.status(400).json({
        message: `Seats ${unavailableSeats.map(s => s.seatNumber).join(', ')} are no longer available`
      });
    }

    // Update bus seats
    bus.availableSeats -= booking.seats.length;
    bus.bookedSeats.push(...booking.seats.map(seat => ({
      seatNumber: seat.seatNumber,
      userId: req.user._id
    })));
    await bus.save();

    // Update booking status
    booking.status = 'confirmed';
    booking.paymentStatus = 'completed';
    booking.paymentId = paymentId;
    booking.transactionId = transactionId;
    booking.paymentDate = new Date();
    booking.expiresAt = undefined; // Remove expiration since booking is confirmed
    booking.bookingNumber = `BK${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(7)}`; // Generate unique booking number

    // Save the confirmed booking
    const confirmedBooking = await booking.save();

    // Return the confirmed booking with populated fields
    const populatedBooking = await Booking.findById(confirmedBooking._id)
      .populate('busId', 'busName from to departureTime arrivalTime type')
      .populate('userId', 'name email phoneNumber');

    res.json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get temporary booking details
// @route   GET /api/bookings/temporary/:id
// @access  Private
exports.getTemporaryBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('busId', 'busName from to departureTime arrivalTime type fare')
      .populate('userId', 'name email phoneNumber');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to view this booking
    if (booking.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    // Check if booking is temporary
    if (booking.status !== 'pending' || booking.paymentStatus !== 'pending') {
      return res.status(400).json({ message: 'Invalid booking status' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate ticket PDF
// @route   GET /api/bookings/:id/ticket
// @access  Private
exports.generateTicket = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('busId', 'busName from to departureTime arrivalTime type')
      .populate('userId', 'name email phoneNumber');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to view this booking
    if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    // Check if booking is confirmed
    if (booking.status !== 'confirmed' || booking.paymentStatus !== 'completed') {
      return res.status(400).json({ message: 'Booking is not confirmed' });
    }

    const PDFDocument = require('pdfkit');
    const doc = new PDFDocument();

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ticket-${booking.bookingNumber}.pdf`);

    // Pipe the PDF document to the response
    doc.pipe(res);

    // Add content to the PDF
    doc.fontSize(20).text('Bus Ticket', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Booking Number: ${booking.bookingNumber}`);
    doc.moveDown();

    // Bus Details
    doc.fontSize(14).text('Bus Details', { underline: true });
    doc.fontSize(12).text(`Bus Name: ${booking.busId.busName}`);
    doc.text(`Route: ${booking.busId.from} → ${booking.busId.to}`);
    doc.text(`Departure: ${new Date(booking.journeyDate).toLocaleString()}`);
    doc.moveDown();

    // Passenger Details
    doc.fontSize(14).text('Passenger Details', { underline: true });
    booking.seats.forEach(seat => {
      doc.fontSize(12).text(`Seat ${seat.seatNumber}:`);
      doc.text(`Name: ${seat.passenger.name}`);
      doc.text(`Age: ${seat.passenger.age}`);
      doc.text(`Gender: ${seat.passenger.gender}`);
      doc.moveDown();
    });

    // Payment Details
    doc.fontSize(14).text('Payment Details', { underline: true });
    doc.fontSize(12).text(`Total Amount: $${booking.totalAmount}`);
    doc.text(`Payment Status: ${booking.paymentStatus}`);
    doc.text(`Transaction ID: ${booking.transactionId}`);
    doc.moveDown();

    // Terms and conditions
    doc.moveDown();
    doc.fontSize(10).text('Terms and Conditions:', { underline: true });
    doc.fontSize(8).text('1. Please arrive at least 30 minutes before departure.');
    doc.text('2. Show this ticket and a valid ID at the time of boarding.');
    doc.text('3. Ticket is non-transferable and valid only for the date and time shown.');

    // Finalize the PDF
    doc.end();
  } catch (error) {
    console.error('Error generating ticket:', error);
    res.status(500).json({ message: 'Error generating ticket' });
  }
}; 
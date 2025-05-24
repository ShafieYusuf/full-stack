require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

// Import the Bus model using the correct path
const Bus = require(path.join(__dirname, '..', 'models', 'bus.model'));

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bus-booking';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const testBusApi = async () => {
  try {
    console.log('Starting bus API test...');

    // Clear existing test data
    console.log('Clearing existing test data...');
    await Bus.deleteMany({ busNumber: { $regex: '^TEST' } });

    // Create test bus
    const testBus = new Bus({
      busName: 'TEST BUS 1',
      busNumber: 'TEST-001',
      from: 'Mogadishu',
      to: 'Galkayo',
      departureTime: new Date('2025-05-22T08:00:00Z'),
      arrivalTime: new Date('2025-05-22T16:00:00Z'),
      fare: 50,
      totalSeats: 20,
      availableSeats: 20,
      seatLayout: '2x2',
      amenities: ['AC', 'WiFi'],
      type: 'AC Seater',
      status: 'Active'
    });

    const savedBus = await testBus.save();
    console.log('\nTest bus created:', JSON.stringify(savedBus, null, 2));

    // Test search functionality with different date scenarios
    const testSearches = [
      {
        params: {
          from: 'Mogadishu',
          to: 'Galkayo',
          date: '2025-05-22',
          passengers: 1
        },
        description: 'Exact date match'
      },
      {
        params: {
          from: 'Mogadishu',
          to: 'Galkayo',
          date: '2025-05-22T08:00:00Z',
          passengers: 1
        },
        description: 'Exact date and time match'
      },
      {
        params: {
          from: 'Mogadishu',
          to: 'Galkayo',
          date: new Date('2025-05-22').toISOString(),
          passengers: 1
        },
        description: 'ISO string date'
      }
    ];

    for (const test of testSearches) {
      console.log('\n-----------------------------------');
      console.log('Testing search:', test.description);
      console.log('Search params:', test.params);

      // Create search query
      const searchDate = new Date(test.params.date);
      const utcYear = searchDate.getUTCFullYear();
      const utcMonth = searchDate.getUTCMonth();
      const utcDay = searchDate.getUTCDate();
      
      const startOfDay = new Date(Date.UTC(utcYear, utcMonth, utcDay, 0, 0, 0, 0));
      const endOfDay = new Date(Date.UTC(utcYear, utcMonth, utcDay, 23, 59, 59, 999));

      const query = {
        from: test.params.from,
        to: test.params.to,
        status: 'Active',
        availableSeats: { $gte: test.params.passengers },
        departureTime: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      };

      console.log('\nMongoDB query:', JSON.stringify(query, null, 2));
      console.log('Date range:', {
        start: startOfDay.toISOString(),
        end: endOfDay.toISOString()
      });
      
      // Execute search
      const results = await Bus.find(query).lean();
      console.log('\nSearch results:', JSON.stringify(results, null, 2));
      console.log('Number of results:', results.length);
      
      // Log all buses for this route regardless of date
      const allBuses = await Bus.find({
        from: test.params.from,
        to: test.params.to,
        status: 'Active'
      }).lean();
      
      console.log('\nAll buses for this route:', JSON.stringify(allBuses, null, 2));
      console.log('-----------------------------------');
    }

    // Cleanup
    await Bus.deleteMany({ busNumber: { $regex: '^TEST' } });
    console.log('\nTest data cleaned up');

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
};

// Run the test
console.log('Running bus API test...');
testBusApi()
  .then(() => console.log('Test completed'))
  .catch(err => console.error('Test failed:', err)); 
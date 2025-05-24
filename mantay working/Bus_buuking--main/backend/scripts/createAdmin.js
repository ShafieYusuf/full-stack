require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bus-booking', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected');

    // Admin details
    const adminData = {
      name: 'Admin User',
      email: 'admin@busbooking.com',
      password: 'admin123', // This will be hashed before saving
      role: 'admin'
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create new admin user
    const admin = new User(adminData);
    await admin.save();

    console.log('Admin user created successfully');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();
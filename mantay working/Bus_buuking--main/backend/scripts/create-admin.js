const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
require('dotenv').config({ path: '../.env' });

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jo');
    console.log('Connected to MongoDB');

    // Admin user details
    const adminData = {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123', // This will be hashed before saving
      role: 'admin',
      phoneNumber: '+1234567890' // Adding required phone number
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
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin(); 
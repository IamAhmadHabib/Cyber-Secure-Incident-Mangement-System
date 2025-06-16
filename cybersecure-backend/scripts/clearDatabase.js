const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Department = require('../models/Department');
const Incident = require('../models/Incident');
const Asset = require('../models/Asset');
const IncidentAsset = require('../models/IncidentAsset');

const connectDB = async () => {
  try {
    // Use MONGO_URI or fallback to MONGODB_URI or default
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/cybersecure_db';
    
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB Connected for clearing');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🗑️  Clearing database...');
    
    await User.deleteMany({});
    await Department.deleteMany({});
    await Incident.deleteMany({});
    await Asset.deleteMany({});
    await IncidentAsset.deleteMany({});
    
    console.log('✅ Database cleared successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
};

clearDatabase();
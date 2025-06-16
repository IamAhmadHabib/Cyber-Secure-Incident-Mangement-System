const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use MONGO_URI (consistent with seeder) or fallback to MONGODB_URI
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/cybersecure_db';
    
    const conn = await mongoose.connect(mongoUri, {
      // Remove deprecated options - they're no longer needed in modern Mongoose
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Enable Mongoose debugging in development
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', true);
    }

  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('📴 MongoDB connection closed.');
  process.exit(0);
});

module.exports = connectDB;
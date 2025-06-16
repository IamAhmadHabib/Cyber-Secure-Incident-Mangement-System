const mongoose = require('mongoose');

// Connect to MongoDB and list all databases
mongoose.connect('mongodb://localhost:27017/')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // List all databases
    const adminDb = mongoose.connection.db.admin();
    const dbs = await adminDb.listDatabases();
    
    console.log('\n🗄️  ALL DATABASES ON THIS MONGODB SERVER:');
    dbs.databases.forEach(db => {
      console.log(`- ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });
    
    console.log(`\n📍 Backend is configured to use: cybersecure_db`);
    console.log(`📍 You showed screenshots of: Final_Project_DB`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

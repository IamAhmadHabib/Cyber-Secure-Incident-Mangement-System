const mongoose = require('mongoose');
const User = require('./models/User');
const Incident = require('./models/Incident');
const Asset = require('./models/Asset');

// Connect to the exact same database as the backend
mongoose.connect('mongodb://localhost:27017/cybersecure_db')
  .then(async () => {
    console.log('Connected to MongoDB: cybersecure_db');
    
    console.log('\n=== CHECKING EXACT DATABASE CONTENTS ===');
    
    // Count all documents
    const incidentCount = await Incident.countDocuments();
    const assetCount = await Asset.countDocuments();
    const userCount = await User.countDocuments();
    
    console.log(`\n📊 DOCUMENT COUNTS:`);
    console.log(`Incidents: ${incidentCount}`);
    console.log(`Assets: ${assetCount}`);
    console.log(`Users: ${userCount}`);
    
    // List all incidents
    console.log(`\n📋 ALL INCIDENTS (${incidentCount}):`);
    const allIncidents = await Incident.find({}, 'incident_id title severity status');
    allIncidents.forEach((inc, index) => {
      console.log(`${index + 1}. ${inc.incident_id}: ${inc.title} (${inc.severity})`);
    });
    
    // List all assets
    console.log(`\n🏢 ALL ASSETS (${assetCount}):`);
    const allAssets = await Asset.find({}, 'asset_id asset_name asset_type status');
    allAssets.forEach((asset, index) => {
      console.log(`${index + 1}. ${asset.asset_id}: ${asset.asset_name} (${asset.asset_type}) - ${asset.status}`);
    });
    
    // Check database name and collections
    console.log(`\n🔍 DATABASE INFO:`);
    console.log(`Database Name: ${mongoose.connection.name}`);
    console.log(`Connection Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\n📁 COLLECTIONS IN DATABASE:`);
    collections.forEach(col => {
      console.log(`- ${col.name}`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

const mongoose = require('mongoose');
const User = require('./models/User');
const Incident = require('./models/Incident');
const Asset = require('./models/Asset');

// Connect to database
mongoose.connect('mongodb://localhost:27017/cybersecure_db')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Test queries
    console.log('\n=== TESTING DATABASE QUERIES ===');
    
    // Count documents
    const totalIncidents = await Incident.countDocuments();
    const totalAssets = await Asset.countDocuments();
    const totalUsers = await User.countDocuments();
    
    console.log('Total Incidents:', totalIncidents);
    console.log('Total Assets:', totalAssets);
    console.log('Total Users:', totalUsers);
    
    // Get actual incidents
    console.log('\n=== RECENT INCIDENTS ===');
    const incidents = await Incident.find().limit(5).select('incident_id title severity status created_at');
    incidents.forEach(inc => {
      console.log(`${inc.incident_id}: ${inc.title} (${inc.severity}) - ${inc.status}`);
    });
    
    // Get actual assets
    console.log('\n=== ASSETS ===');
    const assets = await Asset.find().limit(5).select('asset_id asset_name asset_type status criticality');
    assets.forEach(asset => {
      console.log(`${asset.asset_id}: ${asset.asset_name} (${asset.asset_type}) - ${asset.status} - ${asset.criticality}`);
    });
    
    // Get actual users
    console.log('\n=== USERS ===');
    const users = await User.find().limit(5).select('user_id username role status');
    users.forEach(user => {
      console.log(`${user.user_id}: ${user.username} (${user.role}) - ${user.status}`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

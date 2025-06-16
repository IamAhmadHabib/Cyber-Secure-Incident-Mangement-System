const mongoose = require('mongoose');
const User = require('./models/User');
const Incident = require('./models/Incident');
const Asset = require('./models/Asset');

// Connect to database
mongoose.connect('mongodb://localhost:27017/cybersecure_db')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    console.log('\n=== EXACT DASHBOARD QUERIES ===');
    
    // Replicate exact dashboard queries
    const totalIncidents = await Incident.countDocuments();
    const activeIncidents = await Incident.countDocuments({ status: { $in: ['open', 'investigating', 'in-progress'] } });
    const resolvedIncidents = await Incident.countDocuments({ status: 'resolved' });
    const criticalIncidents = await Incident.countDocuments({ severity: 'Critical' });
    const highIncidents = await Incident.countDocuments({ severity: 'High' });
    const mediumIncidents = await Incident.countDocuments({ severity: 'Medium' });
    const lowIncidents = await Incident.countDocuments({ severity: 'Low' });
    
    console.log('=== INCIDENT STATS ===');
    console.log('Total Incidents:', totalIncidents);
    console.log('Active Incidents:', activeIncidents);
    console.log('Resolved Incidents:', resolvedIncidents);
    console.log('Critical Incidents:', criticalIncidents);
    console.log('High Incidents:', highIncidents);
    console.log('Medium Incidents:', mediumIncidents);
    console.log('Low Incidents:', lowIncidents);
    
    // Asset queries
    const totalAssets = await Asset.countDocuments();
    const activeAssets = await Asset.countDocuments({ status: 'active' });
    const vulnerableAssets = await Asset.countDocuments({ status: 'vulnerable' });
    const criticalAssets = await Asset.countDocuments({ criticality: 'critical' });
    
    console.log('\n=== ASSET STATS ===');
    console.log('Total Assets:', totalAssets);
    console.log('Active Assets:', activeAssets);
    console.log('Vulnerable Assets:', vulnerableAssets);
    console.log('Critical Assets (lowercase):', criticalAssets);
    
    // Check case sensitivity issue
    const criticalAssetsCapital = await Asset.countDocuments({ criticality: 'Critical' });
    console.log('Critical Assets (Capital):', criticalAssetsCapital);
    
    // User queries
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const analystUsers = await User.countDocuments({ role: 'analyst' });
    
    console.log('\n=== USER STATS ===');
    console.log('Total Users:', totalUsers);
    console.log('Active Users:', activeUsers);
    console.log('Admin Users:', adminUsers);
    console.log('Analyst Users:', analystUsers);
    
    // Check recent incidents
    console.log('\n=== RECENT INCIDENTS ===');
    const recentIncidents = await Incident.find()
      .sort({ created_at: -1 })
      .limit(10)
      .select('incident_id title severity status assignee_id created_at');
      
    console.log('Recent incidents count:', recentIncidents.length);
    recentIncidents.forEach(inc => {
      console.log(`${inc.incident_id}: ${inc.title} - ${inc.severity} - ${inc.status}`);
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

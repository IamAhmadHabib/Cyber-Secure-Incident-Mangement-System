const User = require('../models/User');
const Incident = require('../models/Incident');
const Asset = require('../models/Asset');

// @desc    Get comprehensive dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    // Get incident statistics
    const totalIncidents = await Incident.countDocuments();
    const activeIncidents = await Incident.countDocuments({ status: { $in: ['open', 'investigating', 'in-progress'] } });
    const resolvedIncidents = await Incident.countDocuments({ status: 'resolved' });
    const criticalIncidents = await Incident.countDocuments({ severity: 'Critical' });
    const highIncidents = await Incident.countDocuments({ severity: 'High' });
    const mediumIncidents = await Incident.countDocuments({ severity: 'Medium' });
    const lowIncidents = await Incident.countDocuments({ severity: 'Low' });    // Get recent incidents
    const recentIncidentsRaw = await Incident.find()
      .sort({ created_at: -1 })
      .limit(10)
      .select('incident_id title severity status assignee_id created_at');

    // Manually populate assignee information
    const recentIncidents = await Promise.all(
      recentIncidentsRaw.map(async (incident) => {
        let assigneeInfo = null;
        if (incident.assignee_id) {
          const assignee = await User.findOne({ user_id: incident.assignee_id })
            .select('first_name last_name');
          assigneeInfo = assignee;
        }
        return {
          ...incident.toObject(),
          assignee: assigneeInfo
        };
      })
    );    // Get asset statistics
    const totalAssets = await Asset.countDocuments();
    const activeAssets = await Asset.countDocuments({ status: 'active' });
    const vulnerableAssets = await Asset.countDocuments({ status: 'vulnerable' });
    const criticalAssets = await Asset.countDocuments({ criticality: 'Critical' }); // Fixed case sensitivity

    // Get user statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const analystUsers = await User.countDocuments({ role: 'analyst' });

    // Determine threat level based on critical and high incidents
    let threatLevel = 'Low';
    if (criticalIncidents > 0) {
      threatLevel = 'Critical';
    } else if (highIncidents > 5) {
      threatLevel = 'High';
    } else if (highIncidents > 0 || mediumIncidents > 10) {
      threatLevel = 'Medium';
    }

    const dashboardStats = {
      incidents: {
        total: totalIncidents,
        active: activeIncidents,
        resolved: resolvedIncidents,
        critical: criticalIncidents,
        high: highIncidents,
        medium: mediumIncidents,
        low: lowIncidents,        recentIncidents: recentIncidents.map(incident => ({
          _id: incident._id,
          incident_id: incident.incident_id,
          title: incident.title,
          severity: incident.severity,
          status: incident.status,
          assignee: incident.assignee ? 
            `${incident.assignee.first_name} ${incident.assignee.last_name}` : 
            undefined,
          created_at: incident.created_at
        }))
      },
      assets: {
        total: totalAssets,
        active: activeAssets,
        vulnerable: vulnerableAssets,
        critical: criticalAssets
      },
      users: {
        total: totalUsers,
        active: activeUsers,
        online: Math.floor(activeUsers * 0.3), // Mock online users as 30% of active
        admins: adminUsers,
        analysts: analystUsers
      },      threats: {
        level: threatLevel,
        updates: [
          {
            type: 'Security Alert',
            title: 'Active Incidents Monitoring',
            description: `${criticalIncidents} critical and ${highIncidents} high priority incidents require attention`,
            severity: criticalIncidents > 0 ? 'Critical' : highIncidents > 2 ? 'High' : 'Medium',
            timestamp: new Date().toISOString()
          },
          {
            type: 'Asset Status',
            title: 'Asset Health Check',
            description: `${vulnerableAssets} vulnerable assets detected, ${criticalAssets} critical assets monitored`,
            severity: vulnerableAssets > 0 ? 'High' : 'Low',
            timestamp: new Date(Date.now() - 60000).toISOString()
          },
          {
            type: 'System Status',
            title: 'Security Operations Center',
            description: `${activeIncidents} active incidents under investigation by ${analystUsers} analysts`,
            severity: 'Low',
            timestamp: new Date(Date.now() - 120000).toISOString()
          }
        ]
      },
      systemHealth: {
        siem: 'Operational',
        endpointProtection: '99.8% Coverage',
        networkMonitoring: 'Operational',
        backup: 'Healthy'
      }
    };

    res.status(200).json({
      success: true,
      data: dashboardStats
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
};

// @desc    Get system health status
// @route   GET /api/dashboard/health
// @access  Private
const getSystemHealth = async (req, res) => {
  try {
    const systemHealth = {
      siem: 'Operational',
      endpointProtection: '99.8% Coverage',
      networkMonitoring: 'Operational',
      backup: 'Healthy',
      lastUpdated: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      data: systemHealth
    });

  } catch (error) {
    console.error('System health error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system health status'
    });
  }
};

// @desc    Get threat intelligence updates
// @route   GET /api/dashboard/threats
// @access  Private
const getThreatUpdates = async (req, res) => {
  try {
    const threatUpdates = [
      {
        type: 'CVE Alert',
        title: 'Critical Vulnerability Discovered',
        description: 'CVE-2024-1234: Remote code execution in popular web framework',
        severity: 'High',
        timestamp: new Date().toISOString()
      },
      {
        type: 'Threat Campaign',
        title: 'Advanced Persistent Threat Activity',
        description: 'APT-29 targeting financial sector with new malware variant',
        severity: 'Medium',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        type: 'IOC Update',
        title: 'Threat Intelligence Feed Update',
        description: '252 new indicators of compromise added to database',
        severity: 'Low',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      },
      {
        type: 'Security Advisory',
        title: 'Zero-Day Vulnerability Alert',
        description: 'New zero-day affecting enterprise email systems',
        severity: 'Critical',
        timestamp: new Date(Date.now() - 10800000).toISOString()
      }
    ];

    res.status(200).json({
      success: true,
      data: threatUpdates
    });

  } catch (error) {
    console.error('Threat updates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch threat intelligence updates'
    });
  }
};

// @desc    Get time series data for charts
// @route   GET /api/dashboard/timeseries
// @access  Private
const getTimeSeriesData = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const timeSeriesData = [];
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(days));

    // Generate mock time series data for the last N days
    for (let i = parseInt(days) - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(endDate.getDate() - i);
      
      // Get actual incident count for this date
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);
      
      const incidentCount = await Incident.countDocuments({
        created_at: { $gte: dayStart, $lte: dayEnd }
      });

      // Get actual asset count (total assets don't change much daily, so we'll use current count)
      const assetCount = await Asset.countDocuments();

      timeSeriesData.push({
        date: date.toISOString().split('T')[0],
        incidents: incidentCount,
        assets: assetCount,
        vulnerabilities: Math.floor(Math.random() * 10) + 1 // Mock vulnerability data
      });
    }

    res.status(200).json({
      success: true,
      data: timeSeriesData
    });

  } catch (error) {
    console.error('Time series data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch time series data'
    });
  }
};

module.exports = {
  getDashboardStats,
  getSystemHealth,
  getThreatUpdates,
  getTimeSeriesData
};

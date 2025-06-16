const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getSystemHealth,
  getThreatUpdates,
  getTimeSeriesData
} = require('../controllers/dashboardController');

// Import middleware
const auth = require('../middleware/auth');

// @route   GET /api/dashboard/stats
// @desc    Get comprehensive dashboard statistics
// @access  Private
router.get('/stats', auth, getDashboardStats);

// @route   GET /api/dashboard/health
// @desc    Get system health status
// @access  Private
router.get('/health', auth, getSystemHealth);

// @route   GET /api/dashboard/threats
// @desc    Get threat intelligence updates
// @access  Private
router.get('/threats', auth, getThreatUpdates);

// @route   GET /api/dashboard/timeseries
// @desc    Get time series data for charts
// @access  Private
router.get('/timeseries', auth, getTimeSeriesData);

module.exports = router;

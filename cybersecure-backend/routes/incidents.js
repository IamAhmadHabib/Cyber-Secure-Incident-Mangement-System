const express = require('express');
const router = express.Router();
const {
  getIncidents,
  getIncident,
  createIncident,
  updateIncident,
  deleteIncident,
  getIncidentStats
} = require('../controllers/incidentController');

// Import middleware
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// @route   GET /api/incidents/stats
// @desc    Get incident statistics
// @access  Private
router.get('/stats', auth, getIncidentStats);

// @route   GET /api/incidents
// @desc    Get all incidents
// @access  Private
router.get('/', auth, getIncidents);

// @route   GET /api/incidents/:id
// @desc    Get single incident
// @access  Private
router.get('/:id', auth, getIncident);

// @route   POST /api/incidents
// @desc    Create new incident
// @access  Private
router.post('/', auth, createIncident);

// @route   PUT /api/incidents/:id
// @desc    Update incident
// @access  Private
router.put('/:id', auth, updateIncident);

// @route   DELETE /api/incidents/:id
// @desc    Delete incident
// @access  Private (Admin only)
router.delete('/:id', auth, authorize('admin'), deleteIncident);

module.exports = router;
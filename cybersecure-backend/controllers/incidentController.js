const Incident = require('../models/Incident');
const User = require('../models/User');
const IncidentAsset = require('../models/IncidentAsset');

// @desc    Get all incidents
// @route   GET /api/incidents
// @access  Private
const getIncidents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      severity,
      category,
      assignee_id,
      reporter_id,
      search
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    if (category) filter.category = category;
    if (assignee_id) filter.assignee_id = assignee_id;
    if (reporter_id) filter.reporter_id = reporter_id;
    
    // Add search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { incident_id: { $regex: search, $options: 'i' } }
      ];
    }

    // Role-based filtering
    if (req.user.role === 'analyst') {
      // Analysts can only see incidents assigned to them or unassigned
      filter.$or = [
        { assignee_id: req.user.user_id },
        { assignee_id: null }
      ];
    }

    // Execute query with pagination
    const incidents = await Incident.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ created_at: -1 });

    // Get total count for pagination
    const total = await Incident.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        incidents,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / limit),
          total_incidents: total,
          per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get incidents error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching incidents'
    });
  }
};

// @desc    Get single incident
// @route   GET /api/incidents/:id
// @access  Private
const getIncident = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found'
      });
    }

    // Get related assets
    const relatedAssets = await IncidentAsset.find({
      incident_id: incident.incident_id
    });

    res.status(200).json({
      success: true,
      data: {
        incident,
        related_assets: relatedAssets
      }
    });

  } catch (error) {
    console.error('Get incident error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching incident'
    });
  }
};

// @desc    Create incident
// @route   POST /api/incidents
// @access  Private
const createIncident = async (req, res) => {
  try {
    const {
      incident_id,
      title,
      description,
      severity,
      category,
      assignee_id
    } = req.body;

    // Check if incident_id already exists
    const existingIncident = await Incident.findOne({ incident_id });
    if (existingIncident) {
      return res.status(400).json({
        success: false,
        message: 'Incident ID already exists'
      });
    }

    // Verify assignee exists if provided
    if (assignee_id) {
      const assignee = await User.findOne({ user_id: assignee_id });
      if (!assignee) {
        return res.status(400).json({
          success: false,
          message: 'Assignee not found'
        });
      }
    }

    // Create incident
    const incident = await Incident.create({
      incident_id,
      title,
      description,
      severity,
      category,
      reporter_id: req.user.user_id,
      assignee_id: assignee_id || null,
      status: 'open'
    });

    res.status(201).json({
      success: true,
      message: 'Incident created successfully',
      data: incident
    });

  } catch (error) {
    console.error('Create incident error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating incident'
    });
  }
};

// @desc    Update incident
// @route   PUT /api/incidents/:id
// @access  Private
const updateIncident = async (req, res) => {
  try {
    const incidentId = req.params.id;
    const updateData = req.body;

    // Check if incident exists
    const incident = await Incident.findById(incidentId);
    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found'
      });
    }

    // Check permissions
    const canUpdate = 
      req.user.role === 'admin' ||
      incident.assignee_id === req.user.user_id ||
      incident.reporter_id === req.user.user_id;

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this incident'
      });
    }

    // Verify assignee exists if being updated
    if (updateData.assignee_id) {
      const assignee = await User.findOne({ user_id: updateData.assignee_id });
      if (!assignee) {
        return res.status(400).json({
          success: false,
          message: 'Assignee not found'
        });
      }
    }

    // Update incident
    const updatedIncident = await Incident.findByIdAndUpdate(
      incidentId,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Incident updated successfully',
      data: updatedIncident
    });

  } catch (error) {
    console.error('Update incident error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating incident'
    });
  }
};

// @desc    Delete incident
// @route   DELETE /api/incidents/:id
// @access  Private (Admin only)
const deleteIncident = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found'
      });
    }

    // Delete related incident-asset relationships
    await IncidentAsset.deleteMany({ incident_id: incident.incident_id });

    // Delete incident
    await Incident.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Incident deleted successfully'
    });

  } catch (error) {
    console.error('Delete incident error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting incident'
    });
  }
};

// @desc    Get incident statistics
// @route   GET /api/incidents/stats
// @access  Private
const getIncidentStats = async (req, res) => {
  try {
    const stats = await Incident.aggregate([
      {
        $group: {
          _id: null,
          total_incidents: { $sum: 1 },
          open_incidents: {
            $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] }
          },
          investigating_incidents: {
            $sum: { $cond: [{ $eq: ['$status', 'investigating'] }, 1, 0] }
          },
          resolved_incidents: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          },
          critical_incidents: {
            $sum: { $cond: [{ $eq: ['$severity', 'Critical'] }, 1, 0] }
          }
        }
      }
    ]);

    const severityStats = await Incident.aggregate([
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await Incident.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {
          total_incidents: 0,
          open_incidents: 0,
          investigating_incidents: 0,
          resolved_incidents: 0,
          critical_incidents: 0
        },
        by_severity: severityStats,
        by_category: categoryStats
      }
    });

  } catch (error) {
    console.error('Get incident stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching incident statistics'
    });
  }
};

module.exports = {
  getIncidents,
  getIncident,
  createIncident,
  updateIncident,
  deleteIncident,
  getIncidentStats
};
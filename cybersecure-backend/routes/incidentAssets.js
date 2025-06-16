const express = require('express');
const router = express.Router();
const IncidentAsset = require('../models/IncidentAsset');
const Incident = require('../models/Incident');
const Asset = require('../models/Asset');

// Import middleware
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// @desc    Get all incident-asset relationships
// @route   GET /api/incident-assets
// @access  Private
const getIncidentAssets = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      incident_id,
      asset_id,
      impact_level
    } = req.query;

    const filter = {};
    if (incident_id) filter.incident_id = incident_id;
    if (asset_id) filter.asset_id = asset_id;
    if (impact_level) filter.impact_level = impact_level;

    const incidentAssets = await IncidentAsset.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ created_at: -1 });

    const total = await IncidentAsset.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        incident_assets: incidentAssets,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / limit),
          total_relationships: total,
          per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get incident assets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching incident-asset relationships'
    });
  }
};

// @desc    Link incident to asset
// @route   POST /api/incident-assets
// @access  Private (Admin, Analyst)
const linkIncidentAsset = async (req, res) => {
  try {
    const {
      incident_id,
      asset_id,
      impact_level,
      affected_services,
      discovery_method,
      notes
    } = req.body;

    // Verify incident exists
    const incident = await Incident.findOne({ incident_id });
    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found'
      });
    }

    // Verify asset exists
    const asset = await Asset.findOne({ asset_id });
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    // Check if relationship already exists
    const existingLink = await IncidentAsset.findOne({
      incident_id,
      asset_id
    });

    if (existingLink) {
      return res.status(400).json({
        success: false,
        message: 'This incident-asset relationship already exists'
      });
    }

    // Create relationship
    const incidentAsset = await IncidentAsset.create({
      incident_id,
      asset_id,
      impact_level,
      affected_services,
      discovery_method,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Incident-asset relationship created successfully',
      data: incidentAsset
    });

  } catch (error) {
    console.error('Link incident asset error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while linking incident to asset'
    });
  }
};

// @desc    Update incident-asset relationship
// @route   PUT /api/incident-assets/:id
// @access  Private (Admin, Analyst)
const updateIncidentAsset = async (req, res) => {
  try {
    const relationshipId = req.params.id;
    const updateData = req.body;

    const incidentAsset = await IncidentAsset.findById(relationshipId);
    if (!incidentAsset) {
      return res.status(404).json({
        success: false,
        message: 'Incident-asset relationship not found'
      });
    }

    const updatedRelationship = await IncidentAsset.findByIdAndUpdate(
      relationshipId,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Incident-asset relationship updated successfully',
      data: updatedRelationship
    });

  } catch (error) {
    console.error('Update incident asset error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating relationship'
    });
  }
};

// @desc    Remove incident-asset relationship
// @route   DELETE /api/incident-assets/:id
// @access  Private (Admin, Analyst)
const unlinkIncidentAsset = async (req, res) => {
  try {
    const incidentAsset = await IncidentAsset.findById(req.params.id);

    if (!incidentAsset) {
      return res.status(404).json({
        success: false,
        message: 'Incident-asset relationship not found'
      });
    }

    await IncidentAsset.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Incident-asset relationship removed successfully'
    });

  } catch (error) {
    console.error('Unlink incident asset error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing relationship'
    });
  }
};

// @desc    Get assets affected by specific incident
// @route   GET /api/incident-assets/by-incident/:incidentId
// @access  Private
const getAssetsByIncident = async (req, res) => {
  try {
    const { incidentId } = req.params;

    const relationships = await IncidentAsset.find({ incident_id: incidentId });

    // Get detailed asset information
    const assetIds = relationships.map(rel => rel.asset_id);
    const assets = await Asset.find({ asset_id: { $in: assetIds } });

    // Combine relationship data with asset details
    const detailedResults = relationships.map(rel => {
      const asset = assets.find(a => a.asset_id === rel.asset_id);
      return {
        relationship: rel,
        asset: asset
      };
    });

    res.status(200).json({
      success: true,
      data: detailedResults
    });

  } catch (error) {
    console.error('Get assets by incident error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching assets for incident'
    });
  }
};

// @desc    Get incidents affecting specific asset
// @route   GET /api/incident-assets/by-asset/:assetId
// @access  Private
const getIncidentsByAsset = async (req, res) => {
  try {
    const { assetId } = req.params;

    const relationships = await IncidentAsset.find({ asset_id: assetId });

    // Get detailed incident information
    const incidentIds = relationships.map(rel => rel.incident_id);
    const incidents = await Incident.find({ incident_id: { $in: incidentIds } });

    // Combine relationship data with incident details
    const detailedResults = relationships.map(rel => {
      const incident = incidents.find(i => i.incident_id === rel.incident_id);
      return {
        relationship: rel,
        incident: incident
      };
    });

    res.status(200).json({
      success: true,
      data: detailedResults
    });

  } catch (error) {
    console.error('Get incidents by asset error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching incidents for asset'
    });
  }
};

// Apply routes with corrected parameter names
router.get('/', auth, getIncidentAssets);
router.post('/', auth, authorize('admin', 'analyst'), linkIncidentAsset);
router.put('/:id', auth, authorize('admin', 'analyst'), updateIncidentAsset);
router.delete('/:id', auth, authorize('admin', 'analyst'), unlinkIncidentAsset);
router.get('/by-incident/:incidentId', auth, getAssetsByIncident);
router.get('/by-asset/:assetId', auth, getIncidentsByAsset);

module.exports = router;
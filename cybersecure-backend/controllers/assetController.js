const Asset = require('../models/Asset');
const User = require('../models/User');
const IncidentAsset = require('../models/IncidentAsset');

// @desc    Get all assets
// @route   GET /api/assets
// @access  Private
const getAssets = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      asset_type,
      status,
      criticality,
      owner_id,
      location,
      search
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (asset_type) filter.asset_type = asset_type;
    if (status) filter.status = status;
    if (criticality) filter.criticality = criticality;
    if (owner_id) filter.owner_id = owner_id;
    if (location) filter.location = { $regex: location, $options: 'i' };
    
    // Add search functionality
    if (search) {
      filter.$or = [
        { asset_name: { $regex: search, $options: 'i' } },
        { asset_id: { $regex: search, $options: 'i' } },
        { ip_address: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const assets = await Asset.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ created_at: -1 });

    // Get total count for pagination
    const total = await Asset.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        assets,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / limit),
          total_assets: total,
          per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get assets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching assets'
    });
  }
};

// @desc    Get single asset
// @route   GET /api/assets/:id
// @access  Private
const getAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    // Get related incidents
    const relatedIncidents = await IncidentAsset.find({
      asset_id: asset.asset_id
    });

    res.status(200).json({
      success: true,
      data: {
        asset,
        related_incidents: relatedIncidents,
        security_score: asset.security_score
      }
    });

  } catch (error) {
    console.error('Get asset error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching asset'
    });
  }
};

// @desc    Create asset
// @route   POST /api/assets
// @access  Private (Admin/Analyst)
const createAsset = async (req, res) => {
  try {
    const {
      asset_id,
      asset_name,
      asset_type,
      ip_address,
      mac_address,
      location,
      owner_id,
      criticality,
      operating_system,
      software_version
    } = req.body;

    // Check if asset_id already exists
    const existingAsset = await Asset.findOne({ asset_id });
    if (existingAsset) {
      return res.status(400).json({
        success: false,
        message: 'Asset ID already exists'
      });
    }

    // Check if IP address already exists (if provided)
    if (ip_address) {
      const existingIP = await Asset.findOne({ ip_address });
      if (existingIP) {
        return res.status(400).json({
          success: false,
          message: 'IP address already assigned to another asset'
        });
      }
    }

    // Verify owner exists
    const owner = await User.findOne({ user_id: owner_id });
    if (!owner) {
      return res.status(400).json({
        success: false,
        message: 'Asset owner not found'
      });
    }

    // Create asset
    const asset = await Asset.create({
      asset_id,
      asset_name,
      asset_type,
      ip_address,
      mac_address,
      location,
      owner_id,
      status: 'active',
      criticality,
      operating_system,
      software_version,
      last_scan_date: new Date(),
      vulnerabilities_count: 0
    });

    res.status(201).json({
      success: true,
      message: 'Asset created successfully',
      data: asset
    });

  } catch (error) {
    console.error('Create asset error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating asset'
    });
  }
};

// @desc    Update asset
// @route   PUT /api/assets/:id
// @access  Private (Admin/Analyst or Owner)
const updateAsset = async (req, res) => {
  try {
    const assetId = req.params.id;
    const updateData = req.body;

    // Check if asset exists
    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    // Check permissions
    const canUpdate = 
      req.user.role === 'admin' ||
      req.user.role === 'analyst' ||
      asset.owner_id === req.user.user_id;

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this asset'
      });
    }

    // Check IP address uniqueness if being updated
    if (updateData.ip_address && updateData.ip_address !== asset.ip_address) {
      const existingIP = await Asset.findOne({ 
        ip_address: updateData.ip_address,
        _id: { $ne: assetId }
      });
      if (existingIP) {
        return res.status(400).json({
          success: false,
          message: 'IP address already assigned to another asset'
        });
      }
    }

    // Verify new owner exists if being updated
    if (updateData.owner_id && updateData.owner_id !== asset.owner_id) {
      const newOwner = await User.findOne({ user_id: updateData.owner_id });
      if (!newOwner) {
        return res.status(400).json({
          success: false,
          message: 'New asset owner not found'
        });
      }
    }

    // Update asset
    const updatedAsset = await Asset.findByIdAndUpdate(
      assetId,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Asset updated successfully',
      data: updatedAsset
    });

  } catch (error) {
    console.error('Update asset error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating asset'
    });
  }
};

// @desc    Delete asset
// @route   DELETE /api/assets/:id
// @access  Private (Admin only)
const deleteAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    // Delete related incident-asset relationships
    await IncidentAsset.deleteMany({ asset_id: asset.asset_id });

    // Delete asset
    await Asset.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Asset deleted successfully'
    });

  } catch (error) {
    console.error('Delete asset error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting asset'
    });
  }
};

// @desc    Get asset statistics
// @route   GET /api/assets/stats
// @access  Private
const getAssetStats = async (req, res) => {
  try {
    const stats = await Asset.aggregate([
      {
        $group: {
          _id: null,
          total_assets: { $sum: 1 },
          active_assets: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          critical_assets: {
            $sum: { $cond: [{ $eq: ['$criticality', 'Critical'] }, 1, 0] }
          },
          compromised_assets: {
            $sum: { $cond: [{ $eq: ['$status', 'compromised'] }, 1, 0] }
          },
          avg_vulnerabilities: { $avg: '$vulnerabilities_count' }
        }
      }
    ]);

    const typeStats = await Asset.aggregate([
      {
        $group: {
          _id: '$asset_type',
          count: { $sum: 1 }
        }
      }
    ]);

    const criticalityStats = await Asset.aggregate([
      {
        $group: {
          _id: '$criticality',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {
          total_assets: 0,
          active_assets: 0,
          critical_assets: 0,
          compromised_assets: 0,
          avg_vulnerabilities: 0
        },
        by_type: typeStats,
        by_criticality: criticalityStats
      }
    });

  } catch (error) {
    console.error('Get asset stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching asset statistics'
    });
  }
};

module.exports = {
  getAssets,
  getAsset,
  createAsset,
  updateAsset,
  deleteAsset,
  getAssetStats
};
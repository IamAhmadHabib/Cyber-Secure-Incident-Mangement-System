const express = require('express');
const router = express.Router();
const {
  getAssets,
  getAsset,
  createAsset,
  updateAsset,
  deleteAsset,
  getAssetStats
} = require('../controllers/assetController');

// Import middleware
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// @route   GET /api/assets/stats
// @desc    Get asset statistics
// @access  Private
router.get('/stats', auth, getAssetStats);

// @route   GET /api/assets
// @desc    Get all assets
// @access  Private
router.get('/', auth, getAssets);

// @route   GET /api/assets/:id
// @desc    Get single asset
// @access  Private
router.get('/:id', auth, getAsset);

// @route   POST /api/assets
// @desc    Create new asset
// @access  Private (Admin, Analyst)
router.post('/', auth, authorize('admin', 'analyst'), createAsset);

// @route   PUT /api/assets/:id
// @desc    Update asset
// @access  Private
router.put('/:id', auth, updateAsset);

// @route   DELETE /api/assets/:id
// @desc    Delete asset
// @access  Private (Admin only)
router.delete('/:id', auth, authorize('admin'), deleteAsset);

module.exports = router;
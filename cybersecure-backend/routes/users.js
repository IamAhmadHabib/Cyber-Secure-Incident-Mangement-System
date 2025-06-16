const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/userController');

// Import middleware
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private (Admin only)
router.get('/stats', auth, authorize('admin'), getUserStats);

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin, Analyst)
router.get('/', auth, authorize('admin', 'analyst'), getUsers);

// @route   GET /api/users/:id
// @desc    Get single user
// @access  Private
router.get('/:id', auth, getUser);

// @route   POST /api/users
// @desc    Create new user
// @access  Private (Admin only)
router.post('/', auth, authorize('admin'), createUser);

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Admin or own profile)
router.put('/:id', auth, updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/:id', auth, authorize('admin'), deleteUser);

module.exports = router;
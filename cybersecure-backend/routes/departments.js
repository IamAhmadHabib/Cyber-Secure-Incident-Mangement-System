const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const User = require('../models/User');

// Import middleware
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

// @route   GET /api/departments
// @desc    Get all departments
// @access  Private
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ department_name: 1 });

    res.status(200).json({
      success: true,
      data: departments
    });

  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching departments'
    });
  }
};

// @route   GET /api/departments/:id
// @desc    Get single department
// @access  Private
const getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Get department users
    const users = await User.find({ 
      department_id: department.department_id 
    }).select('-password -login_attempts -account_locked_until');

    res.status(200).json({
      success: true,
      data: {
        department,
        users
      }
    });

  } catch (error) {
    console.error('Get department error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching department'
    });
  }
};

// @route   POST /api/departments
// @desc    Create department
// @access  Private (Admin only)
const createDepartment = async (req, res) => {
  try {
    const {
      department_id,
      department_name,
      manager_id,
      location,
      budget,
      description
    } = req.body;

    // Check if department_id already exists
    const existingDept = await Department.findOne({ department_id });
    if (existingDept) {
      return res.status(400).json({
        success: false,
        message: 'Department ID already exists'
      });
    }

    // Verify manager exists
    const manager = await User.findOne({ user_id: manager_id });
    if (!manager) {
      return res.status(400).json({
        success: false,
        message: 'Manager not found'
      });
    }

    const department = await Department.create({
      department_id,
      department_name,
      manager_id,
      location,
      budget,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department
    });

  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating department'
    });
  }
};

// @route   PUT /api/departments/:id
// @desc    Update department
// @access  Private (Admin only)
const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Verify new manager exists if being updated
    if (req.body.manager_id && req.body.manager_id !== department.manager_id) {
      const newManager = await User.findOne({ user_id: req.body.manager_id });
      if (!newManager) {
        return res.status(400).json({
          success: false,
          message: 'New manager not found'
        });
      }
    }

    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Department updated successfully',
      data: updatedDepartment
    });

  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while updating department'
    });
  }
};

// @route   DELETE /api/departments/:id
// @desc    Delete department
// @access  Private (Admin only)
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Check if department has users
    const usersInDept = await User.countDocuments({ 
      department_id: department.department_id 
    });

    if (usersInDept > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete department with existing users'
      });
    }

    await Department.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Department deleted successfully'
    });

  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting department'
    });
  }
};

// Apply routes
router.get('/', auth, getDepartments);
router.get('/:id', auth, getDepartment);
router.post('/', auth, authorize('admin'), createDepartment);
router.put('/:id', auth, authorize('admin'), updateDepartment);
router.delete('/:id', auth, authorize('admin'), deleteDepartment);

module.exports = router;
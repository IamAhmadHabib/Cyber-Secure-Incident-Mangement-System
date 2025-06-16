const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  department_id: {
    type: String,
    required: [true, 'Department ID is required'],
    unique: true,
    match: [/^DEPT[0-9]{3,}$/, 'Department ID must start with DEPT followed by numbers']
  },
  department_name: {
    type: String,
    required: [true, 'Department name is required'],
    trim: true,
    maxlength: [100, 'Department name cannot exceed 100 characters']
  },
  manager_id: {
    type: String,
    required: [true, 'Manager ID is required'],
    match: [/^U[0-9]{3,}$/, 'Manager ID must be a valid user ID']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  budget: {
    type: Number,
    required: [true, 'Budget is required'],
    min: [0, 'Budget cannot be negative']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

// Remove duplicate indexes (unique: true already creates them)
// departmentSchema.index({ department_id: 1 }); // REMOVE
departmentSchema.index({ manager_id: 1 });
departmentSchema.index({ department_name: 1 });

module.exports = mongoose.model('Department', departmentSchema);
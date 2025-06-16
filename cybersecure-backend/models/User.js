const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: [true, 'User ID is required'],
    unique: true,
    match: [/^U[0-9]{3,}$/, 'User ID must start with U followed by numbers']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [50, 'Username cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  first_name: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  last_name: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'analyst', 'viewer'],
      message: 'Role must be admin, analyst, or viewer'
    },
    default: 'viewer'
  },
  department_id: {
    type: String,
    required: [true, 'Department ID is required'],
    match: [/^DEPT[0-9]{3,}$/, 'Department ID must start with DEPT followed by numbers']
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'inactive', 'suspended'],
      message: 'Status must be active, inactive, or suspended'
    },
    default: 'active'
  },
  last_login: {
    type: Date,
    default: null
  },
  login_attempts: {
    type: Number,
    default: 0
  },
  account_locked_until: {
    type: Date,
    default: null
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('full_name').get(function() {
  return `${this.first_name} ${this.last_name}`;
});

// Only define indexes once (remove duplicates)
// These indexes are already handled by "unique: true" above
// userSchema.index({ username: 1 }); // REMOVE - already unique
// userSchema.index({ email: 1 }); // REMOVE - already unique
// userSchema.index({ user_id: 1 }); // REMOVE - already unique

// Keep only composite indexes
userSchema.index({ role: 1, status: 1 });
userSchema.index({ department_id: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if account is locked
userSchema.methods.isAccountLocked = function() {
  return !!(this.account_locked_until && this.account_locked_until > Date.now());
};

// Increment login attempts
userSchema.methods.incrementLoginAttempts = async function() {
  if (this.account_locked_until && this.account_locked_until < Date.now()) {
    return this.updateOne({
      $unset: { account_locked_until: 1 },
      $set: { login_attempts: 1 }
    });
  }
  
  const updates = { $inc: { login_attempts: 1 } };
  
  if (this.login_attempts + 1 >= 5 && !this.isAccountLocked()) {
    updates.$set = { account_locked_until: Date.now() + 2 * 60 * 60 * 1000 };
  }
  
  return this.updateOne(updates);
};

module.exports = mongoose.model('User', userSchema);
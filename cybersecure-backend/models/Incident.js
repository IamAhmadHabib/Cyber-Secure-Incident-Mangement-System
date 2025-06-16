const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  incident_id: {
    type: String,
    required: [true, 'Incident ID is required'],
    unique: true,
    match: [/^INC[0-9]{3,}$/, 'Incident ID must start with INC followed by numbers']
  },
  title: {
    type: String,
    required: [true, 'Incident title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Incident description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  severity: {
    type: String,
    required: [true, 'Severity is required'],
    enum: {
      values: ['Critical', 'High', 'Medium', 'Low'],
      message: 'Severity must be Critical, High, Medium, or Low'
    }
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['open', 'investigating', 'in-progress', 'resolved', 'closed'],
      message: 'Status must be open, investigating, in-progress, resolved, or closed'
    },
    default: 'open'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Malware', 'Phishing', 'Data Breach', 'Network Intrusion', 'Denial of Service', 'Insider Threat', 'Other'],
      message: 'Please select a valid category'
    }
  },
  reporter_id: {
    type: String,
    required: [true, 'Reporter ID is required'],
    match: [/^U[0-9]{3,}$/, 'Reporter ID must be a valid user ID']
  },
  assignee_id: {
    type: String,
    default: null,
    match: [/^U[0-9]{3,}$/, 'Assignee ID must be a valid user ID']
  },
  priority: {
    type: String,
    enum: ['Urgent', 'High', 'Normal', 'Low'],
    default: function() {
      const severityToPriority = {
        'Critical': 'Urgent',
        'High': 'High',
        'Medium': 'Normal',
        'Low': 'Low'
      };
      return severityToPriority[this.severity] || 'Normal';
    }
  },
  estimated_resolution_time: {
    type: Number,
    min: [0, 'Estimated resolution time cannot be negative']
  },
  actual_resolution_time: {
    type: Number,
    min: [0, 'Actual resolution time cannot be negative']
  },
  resolved_at: {
    type: Date,
    default: null
  },
  closed_at: {
    type: Date,
    default: null
  },
  resolution_notes: {
    type: String,
    maxlength: [1000, 'Resolution notes cannot exceed 1000 characters']
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

// Remove duplicate indexes
// incidentSchema.index({ incident_id: 1 }); // REMOVE - already unique
incidentSchema.index({ reporter_id: 1 });
incidentSchema.index({ assignee_id: 1 });
incidentSchema.index({ status: 1, severity: 1 });
incidentSchema.index({ category: 1 });
incidentSchema.index({ created_at: -1 });
incidentSchema.index({ status: 1, assignee_id: 1 });

// Virtual for days since creation
incidentSchema.virtual('days_open').get(function() {
  const now = this.resolved_at || new Date();
  const diffTime = Math.abs(now - this.created_at);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Auto-update resolved_at when status changes to resolved
incidentSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'resolved' && !this.resolved_at) {
      this.resolved_at = new Date();
    }
    if (this.status === 'closed' && !this.closed_at) {
      this.closed_at = new Date();
    }
  }
  next();
});

module.exports = mongoose.model('Incident', incidentSchema);
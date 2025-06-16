const mongoose = require('mongoose');

const incidentAssetSchema = new mongoose.Schema({
  incident_id: {
    type: String,
    required: [true, 'Incident ID is required'],
    match: [/^INC[0-9]{3,}$/, 'Incident ID must be a valid incident ID']
  },
  asset_id: {
    type: String,
    required: [true, 'Asset ID is required'],
    match: [/^AST[0-9]{3,}$/, 'Asset ID must be a valid asset ID']
  },
  impact_level: {
    type: String,
    required: [true, 'Impact level is required'],
    enum: {
      values: ['Critical', 'High', 'Medium', 'Low'],
      message: 'Impact level must be Critical, High, Medium, or Low'
    }
  },
  affected_services: [{
    type: String,
    trim: true
  }],
  discovery_method: {
    type: String,
    required: [true, 'Discovery method is required'],
    enum: {
      values: [
        'Automated Monitoring', 
        'Automated Scanning',      // Added this value
        'Manual Investigation', 
        'Log Analysis', 
        'User Report', 
        'External Alert',
        'Security Monitoring',     // Added this value
        'Performance Monitoring',  // Added this value
        'Network Monitoring',      // Added this value
        'Traffic Analysis',        // Added this value
        'Access Log Review'        // Added this value
      ],
      message: 'Please select a valid discovery method'
    }
  },
  detection_time: {
    type: Date,
    default: Date.now
  },
  containment_status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Contained', 'Failed'],
    default: 'Not Started'
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

// Compound indexes for efficient queries
incidentAssetSchema.index({ incident_id: 1, asset_id: 1 }, { unique: true });
incidentAssetSchema.index({ incident_id: 1 });
incidentAssetSchema.index({ asset_id: 1 });
incidentAssetSchema.index({ impact_level: 1 });

module.exports = mongoose.model('IncidentAsset', incidentAssetSchema);
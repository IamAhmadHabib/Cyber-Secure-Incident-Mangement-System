const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  asset_id: {
    type: String,
    required: [true, 'Asset ID is required'],
    unique: true,
    match: [/^AST[0-9]{3,}$/, 'Asset ID must start with AST followed by numbers']
  },
  asset_name: {
    type: String,
    required: [true, 'Asset name is required'],
    trim: true,
    maxlength: [100, 'Asset name cannot exceed 100 characters']
  },
  asset_type: {
    type: String,
    required: [true, 'Asset type is required'],
    enum: {
      values: ['Server', 'Workstation', 'Network Device', 'Mobile Device', 'Database', 'Application', 'Cloud Service'],
      message: 'Please select a valid asset type'
    }
  },
  ip_address: {
    type: String,
    required: function() {
      return ['Server', 'Workstation', 'Network Device'].includes(this.asset_type);
    },
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(v);
      },
      message: 'Please provide a valid IP address'
    }
  },
  mac_address: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true;
        return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(v);
      },
      message: 'Please provide a valid MAC address'
    }
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  owner_id: {
    type: String,
    required: [true, 'Owner ID is required'],
    match: [/^U[0-9]{3,}$/, 'Owner ID must be a valid user ID']
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['active', 'inactive', 'maintenance', 'compromised', 'decommissioned'],
      message: 'Status must be active, inactive, maintenance, compromised, or decommissioned'
    },
    default: 'active'
  },
  criticality: {
    type: String,
    required: [true, 'Criticality is required'],
    enum: {
      values: ['Critical', 'High', 'Medium', 'Low'],
      message: 'Criticality must be Critical, High, Medium, or Low'
    }
  },
  operating_system: {
    type: String,
    trim: true
  },
  software_version: {
    type: String,
    trim: true
  },
  last_scan_date: {
    type: Date,
    default: null
  },
  vulnerabilities_count: {
    type: Number,
    default: 0,
    min: [0, 'Vulnerabilities count cannot be negative']
  },
  patch_level: {
    type: String,
    enum: ['Up to Date', 'Minor Updates Available', 'Critical Updates Required', 'Unknown'],
    default: 'Unknown'
  },
  backup_status: {
    type: String,
    enum: ['Current', 'Outdated', 'Failed', 'Not Configured'],
    default: 'Not Configured'
  },
  compliance_status: {
    type: String,
    enum: ['Compliant', 'Non-Compliant', 'Under Review'],
    default: 'Under Review'
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

// Remove duplicate indexes
// assetSchema.index({ asset_id: 1 }); // REMOVE - already unique
assetSchema.index({ owner_id: 1 });
assetSchema.index({ asset_type: 1 });
assetSchema.index({ status: 1, criticality: 1 });
assetSchema.index({ ip_address: 1 });
assetSchema.index({ location: 1 });

// Virtual for security score
assetSchema.virtual('security_score').get(function() {
  let score = 100;
  
  score -= this.vulnerabilities_count * 5;
  
  const patchPenalty = {
    'Up to Date': 0,
    'Minor Updates Available': 10,
    'Critical Updates Required': 30,
    'Unknown': 20
  };
  score -= patchPenalty[this.patch_level] || 0;
  
  const backupPenalty = {
    'Current': 0,
    'Outdated': 15,
    'Failed': 25,
    'Not Configured': 35
  };
  score -= backupPenalty[this.backup_status] || 0;
  
  return Math.max(0, Math.min(100, score));
});

module.exports = mongoose.model('Asset', assetSchema);
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Department = require('../models/Department');
const Incident = require('../models/Incident');
const Asset = require('../models/Asset');
const IncidentAsset = require('../models/IncidentAsset');

// Connect to database
const connectDB = async () => {
  try {
    // Use MONGO_URI or fallback to MONGODB_URI or default
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/cybersecure_db';
    
    console.log('🔗 Connecting to MongoDB...');
    console.log('📍 Connection string:', mongoUri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials if any
    
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Clear all existing data
const clearData = async () => {
  try {
    await User.deleteMany({});
    await Department.deleteMany({});
    await Incident.deleteMany({});
    await Asset.deleteMany({});
    await IncidentAsset.deleteMany({});
    console.log('🗑️  Cleared existing data');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

// Sample Departments Data
const departmentsData = [
  {
    department_id: 'DEPT001',
    department_name: 'Information Technology',
    manager_id: 'U001',
    location: 'Building A, Floor 3',
    budget: 500000,
    description: 'Manages all IT infrastructure and security systems'
  },
  {
    department_id: 'DEPT002',
    department_name: 'Cybersecurity',
    manager_id: 'U002',
    location: 'Building A, Floor 2',
    budget: 300000,
    description: 'Dedicated cybersecurity team handling threats and incidents'
  },
  {
    department_id: 'DEPT003',
    department_name: 'Human Resources',
    manager_id: 'U010',
    location: 'Building B, Floor 1',
    budget: 150000,
    description: 'Human resources and employee management'
  },
  {
    department_id: 'DEPT004',
    department_name: 'Finance',
    manager_id: 'U015',
    location: 'Building B, Floor 2',
    budget: 200000,
    description: 'Financial operations and accounting'
  }
];

// Sample Users Data
const usersData = [
  // Admins
  {
    user_id: 'U001',
    username: 'admin',
    email: 'admin@cybersecure.com',
    password: 'Admin123!',
    first_name: 'John',
    last_name: 'Administrator',
    role: 'admin',
    department_id: 'DEPT001',
    status: 'active'
  },
  {
    user_id: 'U002',
    username: 'sarah.admin',
    email: 'sarah.johnson@cybersecure.com',
    password: 'SecurePass123!',
    first_name: 'Sarah',
    last_name: 'Johnson',
    role: 'admin',
    department_id: 'DEPT002',
    status: 'active'
  },
  
  // Security Analysts
  {
    user_id: 'U003',
    username: 'mike.analyst',
    email: 'mike.smith@cybersecure.com',
    password: 'Analyst123!',
    first_name: 'Mike',
    last_name: 'Smith',
    role: 'analyst',
    department_id: 'DEPT002',
    status: 'active'
  },
  {
    user_id: 'U004',
    username: 'lisa.chen',
    email: 'lisa.chen@cybersecure.com',
    password: 'Security123!',
    first_name: 'Lisa',
    last_name: 'Chen',
    role: 'analyst',
    department_id: 'DEPT002',
    status: 'active'
  },
  {
    user_id: 'U005',
    username: 'david.wilson',
    email: 'david.wilson@cybersecure.com',
    password: 'Analyst456!',
    first_name: 'David',
    last_name: 'Wilson',
    role: 'analyst',
    department_id: 'DEPT002',
    status: 'active'
  },
  
  // IT Staff (Viewers)
  {
    user_id: 'U006',
    username: 'tom.brown',
    email: 'tom.brown@cybersecure.com',
    password: 'Viewer123!',
    first_name: 'Tom',
    last_name: 'Brown',
    role: 'viewer',
    department_id: 'DEPT001',
    status: 'active'
  },
  {
    user_id: 'U007',
    username: 'jane.davis',
    email: 'jane.davis@cybersecure.com',
    password: 'View456!',
    first_name: 'Jane',
    last_name: 'Davis',
    role: 'viewer',
    department_id: 'DEPT001',
    status: 'active'
  },
  {
    user_id: 'U008',
    username: 'alex.garcia',
    email: 'alex.garcia@cybersecure.com',
    password: 'Secure789!',
    first_name: 'Alex',
    last_name: 'Garcia',
    role: 'viewer',
    department_id: 'DEPT001',
    status: 'active'
  },
  
  // Other Department Users
  {
    user_id: 'U010',
    username: 'mary.taylor',
    email: 'mary.taylor@cybersecure.com',
    password: 'HRPass123!',
    first_name: 'Mary',
    last_name: 'Taylor',
    role: 'viewer',
    department_id: 'DEPT003',
    status: 'active'
  },
  {
    user_id: 'U015',
    username: 'robert.lee',
    email: 'robert.lee@cybersecure.com',
    password: 'Finance123!',
    first_name: 'Robert',
    last_name: 'Lee',
    role: 'viewer',
    department_id: 'DEPT004',
    status: 'active'
  }
];

// Sample Assets Data
const assetsData = [
  // Servers
  {
    asset_id: 'AST001',
    asset_name: 'Web Server 01',
    asset_type: 'Server',
    ip_address: '192.168.1.10',
    mac_address: '00:11:22:33:44:55',
    location: 'Data Center - Rack A1',
    owner_id: 'U001',
    status: 'active',
    criticality: 'Critical',
    operating_system: 'Ubuntu 22.04 LTS',
    software_version: 'Apache 2.4.54',
    last_scan_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    vulnerabilities_count: 2,
    patch_level: 'Minor Updates Available',
    backup_status: 'Current',
    compliance_status: 'Compliant'
  },
  {
    asset_id: 'AST002',
    asset_name: 'Database Server',
    asset_type: 'Server',
    ip_address: '192.168.1.15',
    mac_address: '00:11:22:33:44:66',
    location: 'Data Center - Rack A2',
    owner_id: 'U001',
    status: 'active',
    criticality: 'Critical',
    operating_system: 'CentOS 8',
    software_version: 'MySQL 8.0.30',
    last_scan_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    vulnerabilities_count: 0,
    patch_level: 'Up to Date',
    backup_status: 'Current',
    compliance_status: 'Compliant'
  },
  {
    asset_id: 'AST003',
    asset_name: 'Mail Server',
    asset_type: 'Server',
    ip_address: '192.168.1.20',
    mac_address: '00:11:22:33:44:77',
    location: 'Data Center - Rack B1',
    owner_id: 'U003',
    status: 'compromised',
    criticality: 'High',
    operating_system: 'Windows Server 2019',
    software_version: 'Exchange 2019',
    last_scan_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    vulnerabilities_count: 8,
    patch_level: 'Critical Updates Required',
    backup_status: 'Failed',
    compliance_status: 'Non-Compliant'
  },
  
  // Workstations
  {
    asset_id: 'AST004',
    asset_name: 'CEO Workstation',
    asset_type: 'Workstation',
    ip_address: '192.168.2.50',
    mac_address: '00:AA:BB:CC:DD:EE',
    location: 'Executive Floor - Office 301',
    owner_id: 'U002',
    status: 'active',
    criticality: 'High',
    operating_system: 'Windows 11 Pro',
    software_version: 'Office 365',
    last_scan_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    vulnerabilities_count: 1,
    patch_level: 'Minor Updates Available',
    backup_status: 'Current',
    compliance_status: 'Compliant'
  },
  {
    asset_id: 'AST005',
    asset_name: 'HR Department PC',
    asset_type: 'Workstation',
    ip_address: '192.168.2.75',
    mac_address: '00:AA:BB:CC:DD:FF',
    location: 'Building B - HR Office',
    owner_id: 'U010',
    status: 'active',
    criticality: 'Medium',
    operating_system: 'Windows 10 Pro',
    software_version: 'Office 2019',
    last_scan_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    vulnerabilities_count: 3,
    patch_level: 'Minor Updates Available',
    backup_status: 'Outdated',
    compliance_status: 'Under Review'
  },
  
  // Network Devices
  {
    asset_id: 'AST006',
    asset_name: 'Core Router',
    asset_type: 'Network Device',
    ip_address: '192.168.1.1',
    mac_address: '00:CC:DD:EE:FF:00',
    location: 'Data Center - Network Rack',
    owner_id: 'U006',
    status: 'active',
    criticality: 'Critical',
    operating_system: 'Cisco IOS',
    software_version: '15.7(3)M4a',
    last_scan_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    vulnerabilities_count: 0,
    patch_level: 'Up to Date',
    backup_status: 'Current',
    compliance_status: 'Compliant'
  },
  {
    asset_id: 'AST007',
    asset_name: 'Firewall',
    asset_type: 'Network Device',
    ip_address: '192.168.1.254',
    mac_address: '00:CC:DD:EE:FF:11',
    location: 'Data Center - Security Rack',
    owner_id: 'U003',
    status: 'active',
    criticality: 'Critical',
    operating_system: 'FortiOS',
    software_version: '7.2.4',
    last_scan_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    vulnerabilities_count: 0,
    patch_level: 'Up to Date',
    backup_status: 'Current',
    compliance_status: 'Compliant'
  },
  
  // Mobile Devices
  {
    asset_id: 'AST008',
    asset_name: 'Company iPhone 13',
    asset_type: 'Mobile Device',
    location: 'Assigned to Sales Team',
    owner_id: 'U007',
    status: 'active',
    criticality: 'Medium',
    operating_system: 'iOS 16.3',
    last_scan_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    vulnerabilities_count: 0,
    patch_level: 'Up to Date',
    backup_status: 'Current',
    compliance_status: 'Compliant'
  }
];

// Sample Incidents Data
const incidentsData = [
  {
    incident_id: 'INC001',
    title: 'Malware Detected on Mail Server',
    description: 'Advanced persistent threat detected on the mail server. Multiple suspicious files found in the email attachments directory. Potential data exfiltration attempt.',
    severity: 'Critical',
    status: 'investigating',
    category: 'Malware',
    reporter_id: 'U003',
    assignee_id: 'U004',
    priority: 'Urgent',
    estimated_resolution_time: 24,
    tags: ['malware', 'apt', 'email', 'data-exfiltration'],
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
  },
  {
    incident_id: 'INC002',
    title: 'Phishing Email Campaign Targeting Employees',
    description: 'Large-scale phishing campaign detected. Multiple employees received emails claiming to be from IT department requesting password reset. 5 employees reported clicking the link.',
    severity: 'High',
    status: 'in-progress',
    category: 'Phishing',
    reporter_id: 'U006',
    assignee_id: 'U003',
    priority: 'High',
    estimated_resolution_time: 12,
    tags: ['phishing', 'social-engineering', 'credentials'],
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    incident_id: 'INC003',
    title: 'Unauthorized Access Attempt to Database',
    description: 'Multiple failed login attempts detected on the main database server from external IP address. Brute force attack suspected.',
    severity: 'High',
    status: 'resolved',
    category: 'Network Intrusion',
    reporter_id: 'U007',
    assignee_id: 'U005',
    priority: 'High',
    estimated_resolution_time: 8,
    actual_resolution_time: 6,
    resolved_at: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    resolution_notes: 'IP address blocked at firewall level. Database access logs reviewed. No successful breach detected.',
    tags: ['brute-force', 'database', 'external-threat'],
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  },
  {
    incident_id: 'INC004',
    title: 'Suspicious Network Traffic Detected',
    description: 'Anomalous outbound network traffic detected from CEO workstation. Large data transfer to unknown external server.',
    severity: 'Medium',
    status: 'open',
    category: 'Data Breach',
    reporter_id: 'U008',
    assignee_id: 'U004',
    priority: 'Normal',
    estimated_resolution_time: 16,
    tags: ['data-breach', 'network-traffic', 'workstation'],
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
  },
  {
    incident_id: 'INC005',
    title: 'DDoS Attack on Web Server',
    description: 'Distributed Denial of Service attack targeting the main web server. High volume of requests causing service degradation.',
    severity: 'Medium',
    status: 'resolved',
    category: 'Denial of Service',
    reporter_id: 'U006',
    assignee_id: 'U003',
    priority: 'Normal',
    estimated_resolution_time: 4,
    actual_resolution_time: 3,
    resolved_at: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
    resolution_notes: 'DDoS protection activated. Attack traffic successfully mitigated. Web service restored to normal operation.',
    tags: ['ddos', 'web-server', 'service-disruption'],
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  },
  {
    incident_id: 'INC006',
    title: 'Insider Threat - Unauthorized File Access',
    description: 'Employee from HR department accessed sensitive financial documents outside of normal working hours without business justification.',
    severity: 'High',
    status: 'investigating',
    category: 'Insider Threat',
    reporter_id: 'U015',
    assignee_id: 'U002',
    priority: 'High',
    estimated_resolution_time: 48,
    tags: ['insider-threat', 'data-access', 'hr'],
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000) // 8 hours ago
  }
];

// Sample Incident-Asset Relationships
const incidentAssetsData = [
  // INC001 - Malware on Mail Server
  {
    incident_id: 'INC001',
    asset_id: 'AST003',
    impact_level: 'Critical',
    affected_services: ['Email Service', 'Exchange Server'],
    discovery_method: 'Automated Scanning',
    notes: 'Primary infected system. Multiple malicious files detected.'
  },
  
  // INC002 - Phishing Campaign
  {
    incident_id: 'INC002',
    asset_id: 'AST004',
    impact_level: 'High',
    affected_services: ['Email Client'],
    discovery_method: 'User Report',
    notes: 'CEO workstation - user clicked phishing link'
  },
  {
    incident_id: 'INC002',
    asset_id: 'AST005',
    impact_level: 'Medium',
    affected_services: ['Email Client'],
    discovery_method: 'User Report',
    notes: 'HR workstation - user reported suspicious email'
  },
  
  // INC003 - Database Attack
  {
    incident_id: 'INC003',
    asset_id: 'AST002',
    impact_level: 'High',
    affected_services: ['Database Service', 'MySQL'],
    discovery_method: 'Log Analysis',
    notes: 'Target of brute force attack. No successful breach.'
  },
  {
    incident_id: 'INC003',
    asset_id: 'AST007',
    impact_level: 'Low',
    affected_services: ['Firewall'],
    discovery_method: 'Security Monitoring',
    notes: 'Used to block malicious IP addresses'
  },
  
  // INC004 - Suspicious Traffic
  {
    incident_id: 'INC004',
    asset_id: 'AST004',
    impact_level: 'High',
    affected_services: ['Network Interface'],
    discovery_method: 'Network Monitoring',
    notes: 'Source of suspicious outbound traffic'
  },
  {
    incident_id: 'INC004',
    asset_id: 'AST006',
    impact_level: 'Medium',
    affected_services: ['Network Routing'],
    discovery_method: 'Traffic Analysis',
    notes: 'Router logs show large data transfer'
  },
  
  // INC005 - DDoS Attack
  {
    incident_id: 'INC005',
    asset_id: 'AST001',
    impact_level: 'Critical',
    affected_services: ['Web Service', 'Apache'],
    discovery_method: 'Performance Monitoring',
    notes: 'Primary target of DDoS attack'
  },
  {
    incident_id: 'INC005',
    asset_id: 'AST007',
    impact_level: 'Medium',
    affected_services: ['DDoS Protection'],
    discovery_method: 'Security Monitoring',
    notes: 'Firewall activated DDoS protection'
  },
  
  // INC006 - Insider Threat
  {
    incident_id: 'INC006',
    asset_id: 'AST005',
    impact_level: 'High',
    affected_services: ['File System'],
    discovery_method: 'Access Log Review',
    notes: 'Unauthorized access to financial documents from HR workstation'
  }
];

// Seed Functions
const seedDepartments = async () => {
  try {
    await Department.insertMany(departmentsData);
    console.log('✅ Departments seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding departments:', error);
  }
};

const seedUsers = async () => {
  try {
    // Hash passwords before inserting
    const usersWithHashedPasswords = await Promise.all(
      usersData.map(async (user) => {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return {
          ...user,
          password: hashedPassword
        };
      })
    );
    
    await User.insertMany(usersWithHashedPasswords);
    console.log('✅ Users seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  }
};

const seedAssets = async () => {
  try {
    await Asset.insertMany(assetsData);
    console.log('✅ Assets seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding assets:', error);
  }
};

const seedIncidents = async () => {
  try {
    await Incident.insertMany(incidentsData);
    console.log('✅ Incidents seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding incidents:', error);
  }
};

const seedIncidentAssets = async () => {
  try {
    await IncidentAsset.insertMany(incidentAssetsData);
    console.log('✅ Incident-Asset relationships seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding incident-asset relationships:', error);
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...\n');
    
    // Clear existing data
    await clearData();
    
    // Seed data in correct order (dependencies)
    await seedDepartments();
    await seedUsers();
    await seedAssets();
    await seedIncidents();
    await seedIncidentAssets();
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Sample Data Summary:');
    console.log(`   👥 Users: ${usersData.length}`);
    console.log(`   🏢 Departments: ${departmentsData.length}`);
    console.log(`   💻 Assets: ${assetsData.length}`);
    console.log(`   🚨 Incidents: ${incidentsData.length}`);
    console.log(`   🔗 Relationships: ${incidentAssetsData.length}`);
    
    console.log('\n🔐 Test Accounts:');
    console.log('   Admin: admin / Admin123!');
    console.log('   Analyst: mike.analyst / Analyst123!');
    console.log('   Viewer: tom.brown / Viewer123!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = {
  seedDatabase,
  clearData,
  usersData,
  departmentsData,
  assetsData,
  incidentsData,
  incidentAssetsData
};
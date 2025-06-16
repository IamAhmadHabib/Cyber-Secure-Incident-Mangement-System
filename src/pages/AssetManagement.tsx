import React, { useState, useEffect } from 'react';
import { Plus, Search, Server, Smartphone, Laptop, Wifi, Shield, AlertTriangle, CheckCircle, Edit, Trash2 } from 'lucide-react';
import assetService, { AssetData } from '../services/assetService';

interface Asset {
  _id?: string;
  asset_id: string;
  name: string;
  type: 'Server' | 'Workstation' | 'Network Device' | 'Mobile Device' | 'Database' | 'Application' | 'Other';
  status: 'active' | 'inactive' | 'maintenance' | 'compromised' | 'decommissioned';
  criticality: 'Critical' | 'High' | 'Medium' | 'Low';
  owner: string;
  location: string;
  lastScan: string;
  vulnerabilities: number;
  ip_address?: string;
  created_at?: string;
  updated_at?: string;
}

// Fallback hardcoded data for when database is unavailable
const fallbackAssets: Asset[] = [
  {
    asset_id: 'WEB-001',
    name: 'Web Server Production',
    type: 'Server',
    status: 'active',
    criticality: 'Critical',
    owner: 'IT Operations',
    location: 'Data Center A',
    lastScan: '2024-01-15T08:00:00Z',
    vulnerabilities: 2,
    ip_address: '192.168.1.10'
  },
  {
    asset_id: 'DB-001',
    name: 'Customer Database',
    type: 'Database',
    status: 'active',
    criticality: 'Critical',
    owner: 'Database Team',
    location: 'Data Center A',
    lastScan: '2024-01-15T09:30:00Z',
    vulnerabilities: 0,
    ip_address: '192.168.1.20'
  },
  {
    asset_id: 'WS-045',
    name: 'Finance Workstation',
    type: 'Workstation',
    status: 'compromised',
    criticality: 'High',
    owner: 'Finance Department',
    location: 'Floor 3',
    lastScan: '2024-01-15T07:15:00Z',
    vulnerabilities: 5,
    ip_address: '192.168.2.45'
  },
  {
    asset_id: 'FW-001',
    name: 'Perimeter Firewall',
    type: 'Network Device',
    status: 'active',
    criticality: 'Critical',
    owner: 'Network Team',
    location: 'Data Center B',
    lastScan: '2024-01-15T10:00:00Z',
    vulnerabilities: 1,
    ip_address: '192.168.1.1'
  },
  {
    asset_id: 'RTR-001',
    name: 'Core Router',
    type: 'Network Device',
    status: 'maintenance',
    criticality: 'High',
    owner: 'Network Team',
    location: 'Data Center B',
    lastScan: '2024-01-14T16:00:00Z',
    vulnerabilities: 0,
    ip_address: '192.168.1.2'
  },
  {
    asset_id: 'MAIL-001',
    name: 'Email Server',
    type: 'Server',
    status: 'active',
    criticality: 'High',
    owner: 'IT Operations',
    location: 'Data Center A',
    lastScan: '2024-01-15T11:00:00Z',
    vulnerabilities: 1,
    ip_address: '192.168.1.25'
  },
  {
    asset_id: 'FILE-001',
    name: 'File Server',
    type: 'Server',
    status: 'active',
    criticality: 'Medium',
    owner: 'IT Operations',
    location: 'Data Center B',
    lastScan: '2024-01-15T13:00:00Z',
    vulnerabilities: 0,
    ip_address: '192.168.1.30'
  },
  {
    asset_id: 'MOB-001',
    name: 'CEO Mobile Device',
    type: 'Mobile Device',
    status: 'active',
    criticality: 'High',
    owner: 'Executive Team',
    location: 'Executive Floor',
    lastScan: '2024-01-15T15:00:00Z',
    vulnerabilities: 0,
    ip_address: '192.168.3.10'
  }
];

export const AssetManagement: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallbackData, setIsUsingFallbackData] = useState(false);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCriticality, setFilterCriticality] = useState('all');

  // Fetch assets from database
  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setIsLoading(true);
      setError('');
      setIsUsingFallbackData(false);
      
      console.log('Fetching assets from database...');
      
      const response = await assetService.getAssets({ limit: 100 });
      console.log('Assets API response:', response);
      
      if (response.success && response.data) {
        // Map backend data to frontend format
        const mappedAssets: Asset[] = response.data.map((asset: AssetData) => ({
          _id: asset._id,
          asset_id: asset.asset_id,
          name: asset.name,
          type: asset.type,
          status: asset.status,
          criticality: asset.criticality,
          owner: asset.owner,
          location: asset.location,
          lastScan: asset.last_scan || new Date().toISOString(),
          vulnerabilities: asset.vulnerabilities || 0,
          ip_address: asset.ip_address,
          created_at: asset.created_at,
          updated_at: asset.updated_at
        }));
        
        setAssets(mappedAssets);
        console.log('Successfully fetched assets from database:', mappedAssets.length);
        
        if (mappedAssets.length === 0) {
          console.log('No assets found in database, using fallback data');
          setError('No assets found in database, showing demo data');
          setIsUsingFallbackData(true);
          setAssets(fallbackAssets);
        }
      } else {
        console.warn('API returned no data, using fallback data');
        setError('Failed to fetch assets, showing demo data');
        setIsUsingFallbackData(true);
        setAssets(fallbackAssets);
      }
    } catch (err: any) {
      console.warn('Failed to fetch from database, using fallback data:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError('Database connection failed, showing demo data');
      setIsUsingFallbackData(true);
      setAssets(fallbackAssets);
    } finally {
      setIsLoading(false);
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'Server': return <Server className="h-5 w-5" />;
      case 'Workstation': return <Laptop className="h-5 w-5" />;
      case 'Mobile Device': return <Smartphone className="h-5 w-5" />;
      case 'Network Device': return <Wifi className="h-5 w-5" />;
      case 'Database': return <Server className="h-5 w-5" />;
      case 'Application': return <Shield className="h-5 w-5" />;
      default: return <Server className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success-400 bg-success-900/50 border-success-500';
      case 'inactive': return 'text-dark-400 bg-dark-700 border-dark-600';
      case 'maintenance': return 'text-warning-400 bg-warning-900/50 border-warning-500';
      case 'compromised': return 'text-error-400 bg-error-900/50 border-error-500';
      default: return 'text-dark-400 bg-dark-700 border-dark-600';
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'Critical': return 'text-error-400 bg-error-900/50 border-error-500';
      case 'High': return 'text-warning-400 bg-warning-900/50 border-warning-500';
      case 'Medium': return 'text-secondary-400 bg-secondary-900/50 border-secondary-500';
      case 'Low': return 'text-success-400 bg-success-900/50 border-success-500';
      default: return 'text-dark-400 bg-dark-700 border-dark-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-success-400" />;
      case 'compromised': return <AlertTriangle className="h-4 w-4 text-error-400" />;
      default: return <CheckCircle className="h-4 w-4 text-dark-400" />;
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = (asset.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (asset.asset_id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (asset.owner || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || asset.type === filterType;
    const matchesStatus = filterStatus === 'all' || asset.status === filterStatus;
    const matchesCriticality = filterCriticality === 'all' || asset.criticality === filterCriticality;
    
    return matchesSearch && matchesType && matchesStatus && matchesCriticality;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading assets...</div>
        </div>
      </div>
    );
  }

  // Only show error screen if not using fallback data
  if (error && !isUsingFallbackData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-error-400 text-lg mb-4">{error}</div>
          <button 
            onClick={fetchAssets}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Warning banner for fallback data */}
      {isUsingFallbackData && (
        <div className="bg-warning-900/30 border border-warning-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-warning-400" />
            <div>
              <p className="text-warning-200 font-medium">Using Demo Data</p>
              <p className="text-warning-300 text-sm">
                Database connection failed. Showing sample asset data for demonstration purposes.
                <button 
                  onClick={fetchAssets}
                  className="ml-2 text-warning-400 hover:text-warning-300 underline"
                >
                  Retry Connection
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Asset Management</h1>
          <p className="text-dark-300">Monitor and manage your organization's assets</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add Asset</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-dark-400" />
              <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
            >
              <option value="all">All Types</option>
              <option value="Server">Server</option>
              <option value="Workstation">Workstation</option>
              <option value="Network Device">Network Device</option>
              <option value="Mobile Device">Mobile Device</option>
              <option value="Database">Database</option>
              <option value="Application">Application</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
              <option value="compromised">Compromised</option>
            </select>
            <select
              value={filterCriticality}
              onChange={(e) => setFilterCriticality(e.target.value)}
              className="px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
            >
              <option value="all">All Criticality</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => (
          <div key={asset.asset_id} className="bg-dark-800 rounded-xl border border-dark-700 p-6 hover:border-primary-500 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-500/20 rounded-lg">
                  {getAssetIcon(asset.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{asset.name}</h3>
                  <p className="text-sm text-dark-400">{asset.asset_id}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-primary-400 hover:text-primary-300 hover:bg-primary-500/10 rounded-lg transition-colors">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-2 text-error-400 hover:text-error-300 hover:bg-error-500/10 rounded-lg transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-dark-400">Type:</span>
                <span className="text-sm text-white">{asset.type}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-dark-400">Status:</span>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(asset.status)}
                  <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(asset.status)}`}>
                    {asset.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-dark-400">Criticality:</span>
                <span className={`px-2 py-1 text-xs rounded-full border ${getCriticalityColor(asset.criticality)}`}>
                  {asset.criticality}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-dark-400">IP Address:</span>
                <span className="text-sm text-white font-mono">{asset.ip_address || 'N/A'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-dark-400">Owner:</span>
                <span className="text-sm text-white">{asset.owner}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-dark-400">Location:</span>
                <span className="text-sm text-white">{asset.location}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-dark-400">Last Scan:</span>
                <span className="text-sm text-white">{formatDate(asset.lastScan)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-dark-400">Vulnerabilities:</span>
                <span className={`text-sm font-medium ${asset.vulnerabilities > 0 ? 'text-error-400' : 'text-success-400'}`}>
                  {asset.vulnerabilities}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Total Assets</h3>
          <p className="text-3xl font-bold text-primary-400">{assets.length}</p>
        </div>
        <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Active</h3>
          <p className="text-3xl font-bold text-success-400">
            {assets.filter(a => a.status === 'active').length}
          </p>
        </div>
        <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Compromised</h3>
          <p className="text-3xl font-bold text-error-400">
            {assets.filter(a => a.status === 'compromised').length}
          </p>
        </div>
        <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Total Vulnerabilities</h3>
          <p className="text-3xl font-bold text-warning-400">
            {assets.reduce((sum, asset) => sum + asset.vulnerabilities, 0)}
          </p>
        </div>
      </div>
    </div>
  );
};
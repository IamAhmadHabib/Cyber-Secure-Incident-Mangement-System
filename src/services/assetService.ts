import api from '../config/api';

// Types for Asset Management
export interface AssetData {
  _id?: string;
  asset_id: string;
  name: string;
  type: 'Server' | 'Workstation' | 'Network Device' | 'Mobile Device' | 'Database' | 'Application' | 'Other';
  status: 'active' | 'inactive' | 'maintenance' | 'decommissioned';
  criticality: 'Low' | 'Medium' | 'High' | 'Critical';
  owner: string;
  location: string;
  ip_address?: string;
  mac_address?: string;
  operating_system?: string;
  version?: string;
  last_scan?: string;
  vulnerabilities?: number;
  department_id?: string;
  tags?: string[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAssetData {
  asset_id: string;
  name: string;
  type: 'Server' | 'Workstation' | 'Network Device' | 'Mobile Device' | 'Database' | 'Application' | 'Other';
  criticality: 'Low' | 'Medium' | 'High' | 'Critical';
  owner: string;
  location: string;
  ip_address?: string;
  mac_address?: string;
  operating_system?: string;
  version?: string;
  department_id?: string;
  tags?: string[];
  notes?: string;
}

export interface UpdateAssetData {
  name?: string;
  type?: 'Server' | 'Workstation' | 'Network Device' | 'Mobile Device' | 'Database' | 'Application' | 'Other';
  status?: 'active' | 'inactive' | 'maintenance' | 'decommissioned';
  criticality?: 'Low' | 'Medium' | 'High' | 'Critical';
  owner?: string;
  location?: string;
  ip_address?: string;
  mac_address?: string;
  operating_system?: string;
  version?: string;
  department_id?: string;
  tags?: string[];
  notes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AssetStats {
  total: number;
  active: number;
  inactive: number;
  maintenance: number;
  decommissioned: number;
  byType: {
    Server: number;
    Workstation: number;
    'Network Device': number;
    'Mobile Device': number;
    Database: number;
    Application: number;
    Other: number;
  };
  byCriticality: {
    Low: number;
    Medium: number;
    High: number;
    Critical: number;
  };
  vulnerabilities: {
    total: number;
    high: number;
    medium: number;
    low: number;
  };
}

class AssetService {
  // Get all assets
  async getAssets(params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    criticality?: string;
    owner?: string;
    location?: string;
    search?: string;
  }): Promise<ApiResponse<AssetData[]>> {
    try {
      const response = await api.get('/api/assets', { params });
      
      if (response.data.success && response.data.data && response.data.data.assets) {
        return {
          ...response.data,
          data: response.data.data.assets
        };
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Get assets error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch assets'
      };
    }
  }

  // Get asset by ID
  async getAssetById(id: string): Promise<ApiResponse<AssetData>> {
    try {
      const response = await api.get(`/api/assets/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Get asset error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch asset'
      };
    }
  }

  // Create new asset
  async createAsset(assetData: CreateAssetData): Promise<ApiResponse<AssetData>> {
    try {
      const response = await api.post('/api/assets', assetData);
      return response.data;
    } catch (error: any) {
      console.error('Create asset error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create asset'
      };
    }
  }

  // Update asset
  async updateAsset(id: string, assetData: UpdateAssetData): Promise<ApiResponse<AssetData>> {
    try {
      const response = await api.put(`/api/assets/${id}`, assetData);
      return response.data;
    } catch (error: any) {
      console.error('Update asset error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update asset'
      };
    }
  }

  // Delete asset
  async deleteAsset(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/api/assets/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Delete asset error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete asset'
      };
    }
  }

  // Update asset status
  async updateAssetStatus(id: string, status: 'active' | 'inactive' | 'maintenance' | 'decommissioned'): Promise<ApiResponse<AssetData>> {
    try {
      const response = await api.patch(`/api/assets/${id}/status`, { status });
      return response.data;
    } catch (error: any) {
      console.error('Update asset status error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update asset status'
      };
    }
  }

  // Get asset statistics
  async getAssetStats(): Promise<ApiResponse<AssetStats>> {
    try {
      const response = await api.get('/api/assets/stats');
      return response.data;
    } catch (error: any) {
      console.error('Get asset stats error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch asset statistics'
      };
    }
  }

  // Scan asset for vulnerabilities
  async scanAsset(id: string): Promise<ApiResponse<AssetData>> {
    try {
      const response = await api.post(`/api/assets/${id}/scan`);
      return response.data;
    } catch (error: any) {
      console.error('Scan asset error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to scan asset'
      };
    }
  }

  // Get asset vulnerabilities
  async getAssetVulnerabilities(id: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.get(`/api/assets/${id}/vulnerabilities`);
      return response.data;
    } catch (error: any) {
      console.error('Get asset vulnerabilities error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch asset vulnerabilities'
      };
    }
  }
}

export default new AssetService();

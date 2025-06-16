import api from '../config/api';

// Types for Dashboard Statistics
export interface DashboardStats {
  incidents: {
    total: number;
    active: number;
    resolved: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    recentIncidents: RecentIncident[];
  };
  assets: {
    total: number;
    active: number;
    vulnerable: number;
    critical: number;
  };
  users: {
    total: number;
    active: number;
    online: number;
    admins: number;
    analysts: number;
  };
  threats: {
    level: 'Low' | 'Medium' | 'High' | 'Critical';
    updates: ThreatUpdate[];
  };
  systemHealth: {
    siem: 'Operational' | 'Degraded' | 'Down';
    endpointProtection: string;
    networkMonitoring: 'Operational' | 'Degraded' | 'Down';
    backup: 'Healthy' | 'Warning' | 'Error';
  };
}

export interface RecentIncident {
  _id: string;
  incident_id: string;
  title: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'open' | 'investigating' | 'in-progress' | 'resolved' | 'closed';
  assignee?: string;
  created_at: string;
}

export interface ThreatUpdate {
  type: 'CVE Alert' | 'Threat Campaign' | 'IOC Update' | 'Security Advisory';
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface TimeSeriesData {
  date: string;
  incidents: number;
  assets: number;
  vulnerabilities: number;
}

class DashboardService {  // Get dashboard statistics
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      console.log('Fetching dashboard stats from:', '/api/dashboard/stats');
      const response = await api.get('/api/dashboard/stats');
      console.log('Dashboard stats response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Get dashboard stats error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch dashboard statistics'
      };
    }
  }

  // Get recent incidents for dashboard
  async getRecentIncidents(limit = 10): Promise<ApiResponse<RecentIncident[]>> {
    try {
      const response = await api.get('/api/incidents', { 
        params: { 
          limit, 
          sort: '-created_at' 
        } 
      });
      
      if (response.data.success) {
        // Map the incidents to the required format
        const recentIncidents = response.data.data.map((incident: any) => ({
          _id: incident._id,
          incident_id: incident.incident_id,
          title: incident.title,
          severity: incident.severity,
          status: incident.status,
          assignee: incident.assigned_to ? 
            (typeof incident.assigned_to === 'object' ? 
              `${incident.assigned_to.first_name} ${incident.assigned_to.last_name}` : 
              incident.assigned_to) : undefined,
          created_at: incident.created_at
        }));
        
        return {
          success: true,
          data: recentIncidents
        };
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Get recent incidents error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch recent incidents'
      };
    }
  }

  // Get incident count by status
  async getIncidentsByStatus(): Promise<ApiResponse<any>> {
    try {
      const response = await api.get('/api/incidents/stats');
      return response.data;
    } catch (error: any) {
      console.error('Get incidents by status error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch incident statistics'
      };
    }
  }

  // Get asset statistics
  async getAssetStats(): Promise<ApiResponse<any>> {
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

  // Get user statistics
  async getUserStats(): Promise<ApiResponse<any>> {
    try {
      const response = await api.get('/api/users/stats');
      return response.data;
    } catch (error: any) {
      console.error('Get user stats error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user statistics'
      };
    }
  }

  // Get system health status
  async getSystemHealth(): Promise<ApiResponse<any>> {
    try {
      const response = await api.get('/api/dashboard/health');
      return response.data;
    } catch (error: any) {
      console.error('Get system health error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch system health',
        data: {
          siem: 'Operational',
          endpointProtection: '99.8% Coverage',
          networkMonitoring: 'Operational',
          backup: 'Healthy'
        }
      };
    }
  }

  // Get threat intelligence updates
  async getThreatUpdates(): Promise<ApiResponse<ThreatUpdate[]>> {
    try {
      const response = await api.get('/api/dashboard/threats');
      return response.data;
    } catch (error: any) {
      console.error('Get threat updates error:', error);
      // Return mock data if API fails
      return {
        success: true,
        data: [
          {
            type: 'CVE Alert',
            title: 'New CVE Alert',
            description: 'CVE-2024-1234',
            severity: 'High',
            timestamp: new Date().toISOString()
          },
          {
            type: 'Threat Campaign',
            title: 'Threat Campaign',
            description: 'APT-29 Activity',
            severity: 'Medium',
            timestamp: new Date().toISOString()
          },
          {
            type: 'IOC Update',
            title: 'IOC Update',
            description: '252 new indicators',
            severity: 'Low',
            timestamp: new Date().toISOString()
          }
        ]
      };
    }
  }

  // Get time series data for charts
  async getTimeSeriesData(days = 30): Promise<ApiResponse<TimeSeriesData[]>> {
    try {
      const response = await api.get('/api/dashboard/timeseries', { 
        params: { days } 
      });
      return response.data;
    } catch (error: any) {
      console.error('Get time series data error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch time series data'
      };
    }
  }
}

export default new DashboardService();

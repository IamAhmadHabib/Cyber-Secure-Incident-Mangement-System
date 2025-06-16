import api from '../config/api';

// Types for Incident Management
export interface IncidentData {
  _id?: string;
  incident_id: string;
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'open' | 'investigating' | 'in-progress' | 'resolved' | 'closed';
  category: string;
  assigned_to?: string;
  reported_by: string;
  affected_assets?: string[];
  tags?: string[];
  created_at?: string;
  updated_at?: string;
  resolved_at?: string;
  assignee?: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
  reporter?: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
}

export interface CreateIncidentData {
  incident_id: string;
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  category: string;
  assigned_to?: string;
  affected_assets?: string[];
  tags?: string[];
}

export interface UpdateIncidentData {
  title?: string;
  description?: string;
  severity?: 'Low' | 'Medium' | 'High' | 'Critical';
  status?: 'open' | 'investigating' | 'in-progress' | 'resolved' | 'closed';
  category?: string;
  assigned_to?: string;
  affected_assets?: string[];
  tags?: string[];
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

export interface IncidentStats {
  total: number;
  open: number;
  investigating: number;
  inProgress: number;
  resolved: number;
  closed: number;
  bySeverity: {
    Low: number;
    Medium: number;
    High: number;
    Critical: number;
  };
}

// Helper function to map backend incident to frontend format
const mapBackendIncidentToFrontend = (backendIncident: any): IncidentData => {
  const incident = { ...backendIncident };
  
  // Map assignee and reporter if they exist
  if (incident.assigned_to && typeof incident.assigned_to === 'object') {
    incident.assignee = {
      _id: incident.assigned_to._id,
      firstName: incident.assigned_to.first_name,
      lastName: incident.assigned_to.last_name,
      username: incident.assigned_to.username,
    };
  }
  
  if (incident.reported_by && typeof incident.reported_by === 'object') {
    incident.reporter = {
      _id: incident.reported_by._id,
      firstName: incident.reported_by.first_name,
      lastName: incident.reported_by.last_name,
      username: incident.reported_by.username,
    };
  }
  
  return incident;
};

class IncidentService {
  // Get all incidents
  async getIncidents(params?: {
    page?: number;
    limit?: number;
    status?: string;
    severity?: string;
    category?: string;
    assigned_to?: string;
    search?: string;
  }): Promise<ApiResponse<IncidentData[]>> {
    try {
      const response = await api.get('/api/incidents', { params });
        if (response.data.success) {
        const mappedIncidents = response.data.data.incidents.map(mapBackendIncidentToFrontend);
        return {
          ...response.data,
          data: mappedIncidents
        };
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Get incidents error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch incidents'
      };
    }
  }

  // Get incident by ID
  async getIncidentById(id: string): Promise<ApiResponse<IncidentData>> {
    try {
      const response = await api.get(`/api/incidents/${id}`);
      
      if (response.data.success) {
        const mappedIncident = mapBackendIncidentToFrontend(response.data.data);
        return {
          ...response.data,
          data: mappedIncident
        };
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Get incident error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch incident'
      };
    }
  }

  // Create new incident
  async createIncident(incidentData: CreateIncidentData): Promise<ApiResponse<IncidentData>> {
    try {
      const response = await api.post('/api/incidents', incidentData);
      
      if (response.data.success) {
        const mappedIncident = mapBackendIncidentToFrontend(response.data.data);
        return {
          ...response.data,
          data: mappedIncident
        };
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Create incident error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create incident'
      };
    }
  }

  // Update incident
  async updateIncident(id: string, incidentData: UpdateIncidentData): Promise<ApiResponse<IncidentData>> {
    try {
      const response = await api.put(`/api/incidents/${id}`, incidentData);
      
      if (response.data.success) {
        const mappedIncident = mapBackendIncidentToFrontend(response.data.data);
        return {
          ...response.data,
          data: mappedIncident
        };
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Update incident error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update incident'
      };
    }
  }

  // Delete incident
  async deleteIncident(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/api/incidents/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Delete incident error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete incident'
      };
    }
  }

  // Update incident status
  async updateIncidentStatus(id: string, status: 'open' | 'investigating' | 'in-progress' | 'resolved' | 'closed'): Promise<ApiResponse<IncidentData>> {
    try {
      const response = await api.patch(`/api/incidents/${id}/status`, { status });
      
      if (response.data.success) {
        const mappedIncident = mapBackendIncidentToFrontend(response.data.data);
        return {
          ...response.data,
          data: mappedIncident
        };
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Update incident status error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update incident status'
      };
    }
  }

  // Get incident statistics
  async getIncidentStats(): Promise<ApiResponse<IncidentStats>> {
    try {
      const response = await api.get('/api/incidents/stats');
      return response.data;
    } catch (error: any) {
      console.error('Get incident stats error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch incident statistics'
      };
    }
  }

  // Assign incident to user
  async assignIncident(id: string, userId: string): Promise<ApiResponse<IncidentData>> {
    try {
      const response = await api.patch(`/api/incidents/${id}/assign`, { assigned_to: userId });
      
      if (response.data.success) {
        const mappedIncident = mapBackendIncidentToFrontend(response.data.data);
        return {
          ...response.data,
          data: mappedIncident
        };
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Assign incident error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to assign incident'
      };
    }
  }
}

export default new IncidentService();

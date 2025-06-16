import api from '../config/api';

// Types for Department Management
export interface DepartmentData {
  _id?: string;
  department_id: string;
  name: string;
  description?: string;
  head?: string;
  location?: string;
  budget?: number;
  user_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateDepartmentData {
  department_id: string;
  name: string;
  description?: string;
  head?: string;
  location?: string;
  budget?: number;
}

export interface UpdateDepartmentData {
  name?: string;
  description?: string;
  head?: string;
  location?: string;
  budget?: number;
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

class DepartmentService {
  // Get all departments
  async getDepartments(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<DepartmentData[]>> {
    try {
      const response = await api.get('/api/departments', { params });
      return response.data;
    } catch (error: any) {
      console.error('Get departments error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch departments'
      };
    }
  }

  // Get department by ID
  async getDepartmentById(id: string): Promise<ApiResponse<DepartmentData>> {
    try {
      const response = await api.get(`/api/departments/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Get department error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch department'
      };
    }
  }

  // Create new department
  async createDepartment(departmentData: CreateDepartmentData): Promise<ApiResponse<DepartmentData>> {
    try {
      const response = await api.post('/api/departments', departmentData);
      return response.data;
    } catch (error: any) {
      console.error('Create department error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create department'
      };
    }
  }

  // Update department
  async updateDepartment(id: string, departmentData: UpdateDepartmentData): Promise<ApiResponse<DepartmentData>> {
    try {
      const response = await api.put(`/api/departments/${id}`, departmentData);
      return response.data;
    } catch (error: any) {
      console.error('Update department error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update department'
      };
    }
  }

  // Delete department
  async deleteDepartment(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/api/departments/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Delete department error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete department'
      };
    }
  }

  // Get department users
  async getDepartmentUsers(id: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.get(`/api/departments/${id}/users`);
      return response.data;
    } catch (error: any) {
      console.error('Get department users error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch department users'
      };
    }
  }
}

export default new DepartmentService();

import api from '../config/api';

// Types for User Management
export interface UserData {
  _id?: string;
  user_id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'analyst' | 'viewer';
  department_id: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt?: string;
  lastLogin?: string;
}

export interface CreateUserData {
  user_id: string;
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'analyst' | 'viewer';
  department_id: string;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: 'admin' | 'analyst' | 'viewer';
  department_id?: string;
  status?: 'active' | 'inactive' | 'suspended';
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

// Helper function to map backend user to frontend format
const mapBackendUserToFrontend = (backendUser: any): UserData => {
  return {
    ...backendUser,
    firstName: backendUser.first_name,
    lastName: backendUser.last_name,
  };
};

class UserService {
  // Get all users
  async getUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<UserData[]>> {
    try {
      const response = await api.get('/api/users', { params });
      
      if (response.data.success) {
        const mappedUsers = response.data.data.map(mapBackendUserToFrontend);
        return {
          ...response.data,
          data: mappedUsers
        };
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Get users error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch users'
      };
    }
  }

  // Get user by ID
  async getUserById(id: string): Promise<ApiResponse<UserData>> {
    try {
      const response = await api.get(`/api/users/${id}`);
      
      if (response.data.success) {
        const mappedUser = mapBackendUserToFrontend(response.data.data);
        return {
          ...response.data,
          data: mappedUser
        };
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Get user error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user'
      };
    }
  }

  // Create new user
  async createUser(userData: CreateUserData): Promise<ApiResponse<UserData>> {
    try {
      const response = await api.post('/api/users', userData);
      
      if (response.data.success) {
        const mappedUser = mapBackendUserToFrontend(response.data.data);
        return {
          ...response.data,
          data: mappedUser
        };
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Create user error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create user'
      };
    }
  }

  // Update user
  async updateUser(id: string, userData: UpdateUserData): Promise<ApiResponse<UserData>> {
    try {
      const response = await api.put(`/api/users/${id}`, userData);
      
      if (response.data.success) {
        const mappedUser = mapBackendUserToFrontend(response.data.data);
        return {
          ...response.data,
          data: mappedUser
        };
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Update user error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update user'
      };
    }
  }

  // Delete user
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/api/users/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Delete user error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete user'
      };
    }
  }

  // Update user status
  async updateUserStatus(id: string, status: 'active' | 'inactive' | 'suspended'): Promise<ApiResponse<UserData>> {
    try {
      const response = await api.patch(`/api/users/${id}/status`, { status });
      
      if (response.data.success) {
        const mappedUser = mapBackendUserToFrontend(response.data.data);
        return {
          ...response.data,
          data: mappedUser
        };
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Update user status error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update user status'
      };
    }
  }
}

export default new UserService();

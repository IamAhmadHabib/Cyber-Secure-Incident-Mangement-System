import api from '../config/api';

// Types for authentication
export interface User {
  _id: string;
  user_id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'analyst' | 'viewer';
  department_id: string;
  status: 'active' | 'inactive' | 'suspended';
  fullName?: string;
}

interface BackendUser {
  _id: string;
  user_id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'analyst' | 'viewer';
  department_id: string;
  status: 'active' | 'inactive' | 'suspended';
}

// Helper function to map backend user to frontend user
const mapBackendUserToFrontend = (backendUser: BackendUser): User => {
  return {
    ...backendUser,
    firstName: backendUser.first_name,
    lastName: backendUser.last_name,
    fullName: `${backendUser.first_name} ${backendUser.last_name}`
  };
};

export interface SignupData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'analyst' | 'viewer';
  department_id?: string;
}

export interface SignupResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    token: string;
  };
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    token: string;
  };
}

class AuthService {
  // Signup user
  async signup(signupData: SignupData): Promise<SignupResponse> {
    try {
      console.log('📝 Attempting signup with:', { 
        username: signupData.username, 
        email: signupData.email,
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        role: signupData.role
      });
      
      const requestData = {
        username: signupData.username,
        email: signupData.email,
        password: signupData.password,
        first_name: signupData.firstName,
        last_name: signupData.lastName,
        role: signupData.role || 'analyst',
        department_id: signupData.department_id
      };
      
      const response = await api.post('/api/auth/register', requestData);
      console.log('✅ Signup response:', response.data);
      
      if (response.data.success) {
        const { user: backendUser, token } = response.data.data;
        
        // Map backend user to frontend user format
        const user = mapBackendUserToFrontend(backendUser);
        console.log('👤 Mapped user after signup:', user);
        
        // Store auth data
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return { success: true, data: { user, token } };
      }
      
      return { success: false, message: response.data.message };
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      console.error('❌ Error response:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed. Please try again.'
      };
    }
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      console.log('🔐 Attempting login with:', { username: credentials.username });
      const response = await api.post('/api/auth/login', credentials);
      console.log('✅ Login response:', response.data);
      
      if (response.data.success) {
        const { user: backendUser, token } = response.data.data;
        
        // Map backend user to frontend user format
        const user = mapBackendUserToFrontend(backendUser);
        console.log('👤 Mapped user:', user);
        
        // Store auth data
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return { success: true, data: { user, token } };
      }
      
      return { success: false, message: response.data.message };
    } catch (error: any) {
      console.error('❌ Login error:', error);
      console.error('❌ Error response:', error.response?.data);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  }

  // Logout user
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Get current user
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken');
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Get auth token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Check user role
  hasRole(requiredRoles: string | string[]): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(user.role);
    }
    
    return user.role === requiredRoles;
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  // Check if user is analyst or admin
  isAnalyst(): boolean {
    return this.hasRole(['admin', 'analyst']);
  }
}

export default new AuthService();

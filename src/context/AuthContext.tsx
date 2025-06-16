import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User, SignupData } from '../services/authService';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (userData: { username: string; email: string; password: string; firstName: string; lastName: string; role?: string }) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: string | string[]) => boolean;
  isAdmin: () => boolean;
  isAnalyst: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const currentUser = authService.getCurrentUser();
    if (currentUser && authService.isAuthenticated()) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    console.log('🔐 AuthContext login called with:', username);
    
    try {
      const result = await authService.login({ username, password });
      console.log('📊 AuthService result:', result);
      
      if (result.success && result.data) {
        console.log('👤 Setting user in AuthContext:', result.data.user);
        setUser(result.data.user);
        setLoading(false);
        return true;
      } else {
        console.error('❌ Login failed:', result.message);
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('💥 Login error:', error);
      setLoading(false);
      return false;
    }
  };

  const signup = async (userData: { username: string; email: string; password: string; firstName: string; lastName: string; role?: string }): Promise<boolean> => {
    setLoading(true);
    
    try {
      console.log('🔐 AuthContext signup called with:', userData);
      
      const result = await authService.signup({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: (userData.role as 'admin' | 'analyst' | 'viewer') || 'analyst'
      });
      
      console.log('📊 AuthService signup result:', result);
      
      if (result.success && result.data) {
        console.log('👤 Setting user in AuthContext after signup:', result.data.user);
        setUser(result.data.user);
        setLoading(false);
        return true;
      } else {
        console.error('❌ Signup failed:', result.message);
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('💥 Signup error:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const hasRole = (role: string | string[]): boolean => {
    return authService.hasRole(role);
  };

  const isAdmin = (): boolean => {
    return authService.isAdmin();
  };

  const isAnalyst = (): boolean => {
    return authService.isAnalyst();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      loading,
      isAuthenticated: !!user,
      hasRole,
      isAdmin,
      isAnalyst
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext }
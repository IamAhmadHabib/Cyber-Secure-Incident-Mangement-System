import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../config/api';

export const DebugPanel: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [apiError, setApiError] = useState<string>('');

  useEffect(() => {
    const checkAPI = async () => {
      try {
        // Try to ping the backend
        const response = await api.get('/api/auth/me');
        setApiStatus('connected');
      } catch (error: any) {
        setApiStatus('error');
        setApiError(error.response?.data?.message || error.message);
      }
    };

    if (isAuthenticated) {
      checkAPI();
    }
  }, [isAuthenticated]);

  const token = localStorage.getItem('authToken');
  const userData = localStorage.getItem('user');

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-lg p-4 mb-6">
      <h3 className="text-white font-semibold mb-3">Debug Information</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-dark-400">Authentication Status:</span>
          <span className={isAuthenticated ? 'text-success-400' : 'text-error-400'}>
            {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-dark-400">User Data:</span>
          <span className="text-white">
            {user ? `${user.first_name} ${user.last_name} (${user.role})` : 'No user data'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-dark-400">Auth Token:</span>
          <span className={token ? 'text-success-400' : 'text-error-400'}>
            {token ? `${token.substring(0, 20)}...` : 'No token'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-dark-400">API Status:</span>
          <span className={
            apiStatus === 'connected' ? 'text-success-400' : 
            apiStatus === 'error' ? 'text-error-400' : 'text-warning-400'
          }>
            {apiStatus === 'checking' ? 'Checking...' : 
             apiStatus === 'connected' ? 'Connected' : 'Error'}
          </span>
        </div>
        
        {apiError && (
          <div className="mt-2 p-2 bg-error-900/20 border border-error-500/30 rounded text-error-200 text-xs">
            API Error: {apiError}
          </div>
        )}
        
        <div className="mt-3 pt-3 border-t border-dark-700">
          <div className="text-dark-400 text-xs">
            <div>API Base URL: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}</div>
            <div>Current URL: {window.location.href}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

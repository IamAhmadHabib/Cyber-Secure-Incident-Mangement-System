import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const success = await login(username, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoUsername: string, demoPassword: string) => {
    setUsername(demoUsername);
    setPassword(demoPassword);
    setError('');
    setIsLoading(true);

    try {
      console.log('🔑 Demo login attempt:', demoUsername);
      const success = await login(demoUsername, demoPassword);
      console.log('📈 Login success result:', success);
      
      if (success) {
        console.log('✅ Navigating to dashboard...');
        navigate('/dashboard');
      } else {
        console.log('❌ Login failed, showing error');
        setError('Demo login failed. Please try again.');
      }
    } catch (err) {
      console.error('❌ Demo login exception:', err);
      setError('Demo login error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-dark-300">
            Sign in to your CyberSecure account
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
          <h3 className="text-sm font-medium text-dark-200 mb-3">Demo Credentials:</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-dark-400">Admin:</span>
              <span className="text-primary-400 font-mono">admin@cybersecure.com / Admin123!</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-400">Analyst:</span>
              <span className="text-secondary-400 font-mono">mike.smith@cybersecure.com / Analyst123!</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-error-900/50 border border-error-500 rounded-lg p-3 flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-error-400" />
              <span className="text-error-200 text-sm">{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-dark-200 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-dark-200 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white pr-10"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-dark-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Login Buttons */}
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-dark-900 text-dark-400">Quick Demo Access</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin@cybersecure.com', 'Admin123!')}
              disabled={isLoading}
              className="bg-primary-700/50 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm border border-primary-600"
            >
              Admin Demo
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('mike.smith@cybersecure.com', 'Analyst123!')}
              disabled={isLoading}
              className="bg-secondary-700/50 hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm border border-secondary-600"
            >
              Analyst Demo
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-dark-400 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium">
              Sign up
            </Link>
          </p>
          <Link to="/" className="text-dark-400 hover:text-dark-300 text-sm mt-2 inline-block">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
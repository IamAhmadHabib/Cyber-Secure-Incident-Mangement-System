import React, { useState, useEffect } from 'react';
import { AlertTriangle, Server, Users, TrendingUp, Shield, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import dashboardService, { DashboardStats, RecentIncident, ThreatUpdate } from '../services/dashboardService';
import { BarChart, DonutChart } from '../components/Charts';

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Critical': return 'text-error-400 bg-error-900/50 border-error-500';
    case 'High': return 'text-warning-400 bg-warning-900/50 border-warning-500';
    case 'Medium': return 'text-secondary-400 bg-secondary-900/50 border-secondary-500';
    case 'Low': return 'text-success-400 bg-success-900/50 border-success-500';
    default: return 'text-dark-400 bg-dark-800 border-dark-600';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'investigating': return <Clock className="h-4 w-4 text-warning-400" />;
    case 'in-progress': return <TrendingUp className="h-4 w-4 text-primary-400" />;
    case 'resolved': return <CheckCircle className="h-4 w-4 text-success-400" />;
    default: return <XCircle className="h-4 w-4 text-error-400" />;
  }
};

const getThreatSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Critical': return 'bg-error-900/30 border-error-500/30 text-error-200';
    case 'High': return 'bg-error-900/30 border-error-500/30 text-error-200';
    case 'Medium': return 'bg-warning-900/30 border-warning-500/30 text-warning-200';
    case 'Low': return 'bg-primary-900/30 border-primary-500/30 text-primary-200';
    default: return 'bg-dark-700 border-dark-600 text-dark-300';
  }
};

export const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      // Debug: Check if user is authenticated
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      console.log('Auth token exists:', !!token);
      console.log('User data exists:', !!user);
      console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
      
      const response = await dashboardService.getDashboardStats();
      
      if (response.success && response.data) {
        setDashboardData(response.data);
        setError('');
        setLastUpdated(new Date());
        console.log('Dashboard data loaded successfully:', response.data);
      } else {
        setError(response.message || 'Failed to load dashboard data');
        console.error('Dashboard API error:', response.message);
      }
    } catch (err) {
      setError('Error loading dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-error-400 text-lg mb-4">{error}</div>
          <button 
            onClick={() => fetchDashboardData()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-dark-400 text-lg">No dashboard data available</div>
      </div>
    );
  }

  const stats = [
    { 
      name: 'Active Incidents', 
      value: dashboardData.incidents?.active?.toString() || '0', 
      change: `${dashboardData.incidents?.total || 0} total`, 
      icon: AlertTriangle, 
      color: 'error' 
    },
    { 
      name: 'Monitored Assets', 
      value: dashboardData.assets?.total?.toString() || '0', 
      change: `${dashboardData.assets?.active || 0} active`, 
      icon: Server, 
      color: 'primary' 
    },
    { 
      name: 'Team Members', 
      value: dashboardData.users?.total?.toString() || '0', 
      change: `${dashboardData.users?.online || 0} online now`, 
      icon: Users, 
      color: 'secondary' 
    },
    { 
      name: 'Threat Level', 
      value: dashboardData.threats?.level || 'Unknown', 
      change: 'Current status', 
      icon: Shield, 
      color: dashboardData.threats?.level === 'Critical' ? 'error' : 
             dashboardData.threats?.level === 'High' ? 'warning' : 
             dashboardData.threats?.level === 'Medium' ? 'secondary' : 'primary'
    },
  ];
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Security Operations Dashboard</h1>
          <p className="text-dark-300">Monitor and manage your cybersecurity posture in real-time</p>
          {lastUpdated && (
            <p className="text-xs text-dark-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-primary-500 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${
                stat.color === 'error' ? 'bg-error-500/20' :
                stat.color === 'primary' ? 'bg-primary-500/20' :
                stat.color === 'secondary' ? 'bg-secondary-500/20' :
                'bg-warning-500/20'
              }`}>
                <stat.icon className={`h-6 w-6 ${
                  stat.color === 'error' ? 'text-error-400' :
                  stat.color === 'primary' ? 'text-primary-400' :
                  stat.color === 'secondary' ? 'text-secondary-400' :
                  'text-warning-400'
                }`} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-dark-400 mb-1">{stat.name}</p>
              <p className="text-xs text-dark-500">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={() => window.location.href = '/incidents/new'}
          className="bg-error-600 hover:bg-error-700 text-white p-4 rounded-lg transition-colors text-left"
        >
          <AlertTriangle className="h-6 w-6 mb-2" />
          <h3 className="font-semibold">Report Incident</h3>
          <p className="text-sm opacity-90">Create new security incident</p>
        </button>
        <button 
          onClick={() => window.location.href = '/assets/new'}
          className="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-lg transition-colors text-left"
        >
          <Server className="h-6 w-6 mb-2" />
          <h3 className="font-semibold">Add Asset</h3>
          <p className="text-sm opacity-90">Register new asset</p>
        </button>
        <button 
          onClick={() => window.location.href = '/users/new'}
          className="bg-secondary-600 hover:bg-secondary-700 text-white p-4 rounded-lg transition-colors text-left"
        >
          <Users className="h-6 w-6 mb-2" />
          <h3 className="font-semibold">Add User</h3>
          <p className="text-sm opacity-90">Create new user account</p>
        </button>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <BarChart 
          title="Incidents by Severity"
          data={[
            { label: 'Critical', value: dashboardData.incidents?.critical || 0, color: 'bg-error-500' },
            { label: 'High', value: dashboardData.incidents?.high || 0, color: 'bg-warning-500' },
            { label: 'Medium', value: dashboardData.incidents?.medium || 0, color: 'bg-secondary-500' },
            { label: 'Low', value: dashboardData.incidents?.low || 0, color: 'bg-success-500' }
          ]}
        />
        <DonutChart 
          title="Asset Distribution"
          centerText="Assets"
          data={[
            { label: 'Active', value: dashboardData.assets?.active || 0, color: 'text-success-500' },
            { label: 'Vulnerable', value: dashboardData.assets?.vulnerable || 0, color: 'text-warning-500' },
            { label: 'Critical', value: dashboardData.assets?.critical || 0, color: 'text-error-500' }
          ]}
        />
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Incidents */}
        <div className="lg:col-span-2 bg-dark-800 rounded-xl border border-dark-700">
          <div className="p-6 border-b border-dark-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Recent Incidents</h2>
              <button
                onClick={() => window.location.href = '/incidents'}
                className="text-primary-400 hover:text-primary-300 text-sm"
              >
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData.incidents?.recentIncidents?.map((incident: RecentIncident) => (
                <div 
                  key={incident._id} 
                  className="flex items-center justify-between p-4 bg-dark-700/50 rounded-lg hover:bg-dark-700 transition-colors cursor-pointer"
                  onClick={() => window.location.href = `/incidents/${incident._id}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(incident.status)}
                      <span className="text-sm text-dark-400 font-mono">{incident.incident_id}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{incident.title}</h3>
                      <p className="text-sm text-dark-400">
                        {incident.assignee ? `Assigned to ${incident.assignee}` : 'Unassigned'} • {' '}
                        {new Date(incident.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs rounded-full border ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                    <span className="text-xs text-dark-500 capitalize">{incident.status.replace('-', ' ')}</span>
                  </div>
                </div>
              )) || []}
              {(!dashboardData.incidents?.recentIncidents || dashboardData.incidents.recentIncidents.length === 0) && (
                <div className="text-center py-8 text-dark-400">
                  No recent incidents found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Threat Intelligence */}
        <div className="space-y-6">
          <div className="bg-dark-800 rounded-xl border border-dark-700">
            <div className="p-6 border-b border-dark-700">
              <h2 className="text-xl font-semibold text-white">Threat Intelligence</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.threats?.updates?.map((threat: ThreatUpdate, index: number) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg border ${getThreatSeverityColor(threat.severity)}`}>
                    <div>
                      <p className="text-sm font-medium">{threat.title}</p>
                      <p className="text-xs opacity-80">{threat.description}</p>
                    </div>
                    <span className="text-xs font-medium">{threat.severity}</span>
                  </div>
                )) || []}
                {(!dashboardData.threats?.updates || dashboardData.threats.updates.length === 0) && (
                  <div className="text-center py-4 text-dark-400">
                    No threat updates available
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-dark-800 rounded-xl border border-dark-700">
            <div className="p-6 border-b border-dark-700">
              <h2 className="text-xl font-semibold text-white">System Health</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark-300">SIEM Status</span>
                  <span className={`text-sm ${dashboardData.systemHealth?.siem === 'Operational' ? 'text-success-400' : 'text-warning-400'}`}>
                    {dashboardData.systemHealth?.siem || 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark-300">Endpoint Protection</span>
                  <span className="text-sm text-success-400">{dashboardData.systemHealth?.endpointProtection || 'Unknown'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark-300">Network Monitoring</span>
                  <span className={`text-sm ${dashboardData.systemHealth?.networkMonitoring === 'Operational' ? 'text-success-400' : 'text-warning-400'}`}>
                    {dashboardData.systemHealth?.networkMonitoring || 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark-300">Backup Systems</span>
                  <span className={`text-sm ${dashboardData.systemHealth?.backup === 'Healthy' ? 'text-success-400' : 'text-warning-400'}`}>
                    {dashboardData.systemHealth?.backup || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
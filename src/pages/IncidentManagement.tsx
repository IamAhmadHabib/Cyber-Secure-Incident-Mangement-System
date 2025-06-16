import React, { useState, useEffect } from 'react';
import { Plus, Search, AlertTriangle, Clock, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react';
import incidentService, { IncidentData } from '../services/incidentService';

interface Incident {
  _id?: string;
  incident_id: string;
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'open' | 'investigating' | 'in-progress' | 'resolved' | 'closed';
  assignee?: string;
  created_at: string;
  updated_at: string;
  affected_assets?: string[];
}

// Fallback hardcoded data for when database is unavailable
const fallbackIncidents: Incident[] = [
  {
    incident_id: 'INC-001',
    title: 'Suspicious Login Activity',
    description: 'Multiple failed login attempts detected from suspicious IP addresses',
    severity: 'High',
    status: 'investigating',
    assignee: 'Sarah Johnson',
    created_at: '2024-01-15T08:30:00Z',
    updated_at: '2024-01-15T10:15:00Z',
    affected_assets: ['WEB-001', 'DB-001']
  },
  {
    incident_id: 'INC-002',
    title: 'Malware Detection on Workstation',
    description: 'Trojan horse malware detected on employee workstation',
    severity: 'Critical',
    status: 'in-progress',
    assignee: 'Mike Chen',
    created_at: '2024-01-15T09:45:00Z',
    updated_at: '2024-01-15T11:30:00Z',
    affected_assets: ['WS-045', 'NET-001']
  },
  {
    incident_id: 'INC-003',
    title: 'Unusual Network Traffic',
    description: 'Abnormal network traffic patterns detected in DMZ',
    severity: 'Medium',
    status: 'resolved',
    assignee: 'Alex Rodriguez',
    created_at: '2024-01-14T14:20:00Z',
    updated_at: '2024-01-15T08:45:00Z',
    affected_assets: ['FW-001', 'RTR-001']
  },
  {
    incident_id: 'INC-004',
    title: 'Failed Authentication Attempts',
    description: 'Brute force attack detected on administrative accounts',
    severity: 'Low',
    status: 'investigating',
    assignee: 'Sarah Johnson',
    created_at: '2024-01-15T06:00:00Z',
    updated_at: '2024-01-15T06:30:00Z',
    affected_assets: ['AD-001', 'WEB-001']
  },
  {
    incident_id: 'INC-005',
    title: 'Data Exfiltration Attempt',
    description: 'Unusual data transfer patterns detected on file server',
    severity: 'Critical',
    status: 'open',
    assignee: 'Mike Chen',
    created_at: '2024-01-15T12:00:00Z',
    updated_at: '2024-01-15T12:30:00Z',
    affected_assets: ['FILE-001']
  },
  {
    incident_id: 'INC-006',
    title: 'Phishing Email Campaign',
    description: 'Multiple employees reported suspicious emails from external source',
    severity: 'Medium',
    status: 'investigating',
    assignee: 'Alex Rodriguez',
    created_at: '2024-01-15T14:00:00Z',
    updated_at: '2024-01-15T14:30:00Z',
    affected_assets: ['MAIL-001']
  }
];

export const IncidentManagement: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingFallbackData, setIsUsingFallbackData] = useState(false);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Fetch incidents from database
  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      setIsLoading(true);
      setError('');
      setIsUsingFallbackData(false);
      
      console.log('Fetching incidents from database...');
      
      const response = await incidentService.getIncidents({ limit: 100 });
      console.log('Incidents API response:', response);
      
      if (response.success && response.data) {
        // Map backend data to frontend format
        const mappedIncidents: Incident[] = response.data.map((incident: IncidentData) => ({
          _id: incident._id,
          incident_id: incident.incident_id,
          title: incident.title,
          description: incident.description,
          severity: incident.severity,
          status: incident.status,
          assignee: incident.assignee ? `${incident.assignee.firstName} ${incident.assignee.lastName}` : 'Unassigned',
          created_at: incident.created_at || new Date().toISOString(),
          updated_at: incident.updated_at || new Date().toISOString(),
          affected_assets: incident.affected_assets || []
        }));
        
        setIncidents(mappedIncidents);
        console.log('Successfully fetched incidents from database:', mappedIncidents.length);
        
        if (mappedIncidents.length === 0) {
          console.log('No incidents found in database, using fallback data');
          setError('No incidents found in database, showing demo data');
          setIsUsingFallbackData(true);
          setIncidents(fallbackIncidents);
        }
      } else {
        console.warn('API returned no data, using fallback data');
        setError('Failed to fetch incidents, showing demo data');
        setIsUsingFallbackData(true);
        setIncidents(fallbackIncidents);
      }
    } catch (err: any) {
      console.warn('Failed to fetch from database, using fallback data:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError('Database connection failed, showing demo data');
      setIsUsingFallbackData(true);
      setIncidents(fallbackIncidents);
    } finally {
      setIsLoading(false);
    }
  };

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
      case 'open': return <AlertTriangle className="h-4 w-4 text-error-400" />;
      case 'investigating': return <Clock className="h-4 w-4 text-warning-400" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-primary-400" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-success-400" />;
      case 'closed': return <XCircle className="h-4 w-4 text-dark-400" />;
      default: return <AlertTriangle className="h-4 w-4 text-error-400" />;
    }
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.incident_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || incident.status === filterStatus;
    const matchesSeverity = filterSeverity === 'all' || incident.severity === filterSeverity;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <div className="text-white text-lg">Loading incidents...</div>
        </div>
      </div>
    );
  }

  // Only show error screen if not using fallback data
  if (error && !isUsingFallbackData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-error-400 text-lg mb-4">{error}</div>
          <button 
            onClick={fetchIncidents}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Warning banner for fallback data */}
      {isUsingFallbackData && (
        <div className="bg-warning-900/30 border border-warning-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-warning-400" />
            <div>
              <p className="text-warning-200 font-medium">Using Demo Data</p>
              <p className="text-warning-300 text-sm">
                Database connection failed. Showing sample incident data for demonstration purposes.
                <button 
                  onClick={fetchIncidents}
                  className="ml-2 text-warning-400 hover:text-warning-300 underline"
                >
                  Retry Connection
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Incident Management</h1>
          <p className="text-dark-300">Track and manage security incidents</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Incident</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-dark-400" />
              <input
                type="text"
                placeholder="Search incidents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
            >
              <option value="all">All Severity</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-dark-300">Incident</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-dark-300">Severity</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-dark-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-dark-300">Assignee</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-dark-300">Created</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-dark-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {filteredIncidents.map((incident) => (
                <tr key={incident.incident_id} className="hover:bg-dark-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-white">{incident.incident_id}</span>
                      </div>
                      <h3 className="font-medium text-white mt-1">{incident.title}</h3>
                      <p className="text-sm text-dark-400 mt-1 max-w-md truncate">{incident.description}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full border ${getSeverityColor(incident.severity)}`}>
                      {incident.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(incident.status)}
                      <span className="text-sm text-dark-300 capitalize">{incident.status.replace('-', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-white">{incident.assignee}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-dark-300">{formatDate(incident.created_at)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedIncident(incident)}
                        className="p-2 text-primary-400 hover:text-primary-300 hover:bg-primary-500/10 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-error-400 hover:text-error-300 hover:bg-error-500/10 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Total Incidents</h3>
          <p className="text-3xl font-bold text-primary-400">{incidents.length}</p>
        </div>
        <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Open</h3>
          <p className="text-3xl font-bold text-error-400">
            {incidents.filter(i => i.status === 'open' || i.status === 'investigating').length}
          </p>
        </div>
        <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">In Progress</h3>
          <p className="text-3xl font-bold text-warning-400">
            {incidents.filter(i => i.status === 'in-progress').length}
          </p>
        </div>
        <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Resolved</h3>
          <p className="text-3xl font-bold text-success-400">
            {incidents.filter(i => i.status === 'resolved' || i.status === 'closed').length}
          </p>
        </div>
      </div>
    </div>
  );
};
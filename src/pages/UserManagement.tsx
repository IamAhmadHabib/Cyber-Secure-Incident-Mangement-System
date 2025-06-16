import React, { useState } from 'react';
import { Plus, Search, User, Shield, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'analyst';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  department: string;
  createdAt: string;
}

const initialUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@cybersecure.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-15T10:30:00Z',
    department: 'IT Security',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    username: 'sarah.johnson',
    email: 'sarah.johnson@cybersecure.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'analyst',
    status: 'active',
    lastLogin: '2024-01-15T09:15:00Z',
    department: 'SOC Team',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    username: 'mike.chen',
    email: 'mike.chen@cybersecure.com',
    firstName: 'Mike',
    lastName: 'Chen',
    role: 'analyst',
    status: 'active',
    lastLogin: '2024-01-15T08:45:00Z',
    department: 'Incident Response',
    createdAt: '2024-01-03T00:00:00Z'
  },
  {
    id: '4',
    username: 'alex.rodriguez',
    email: 'alex.rodriguez@cybersecure.com',
    firstName: 'Alex',
    lastName: 'Rodriguez',
    role: 'analyst',
    status: 'inactive',
    lastLogin: '2024-01-10T14:20:00Z',
    department: 'Threat Intelligence',
    createdAt: '2024-01-04T00:00:00Z'
  },
  {
    id: '5',
    username: 'lisa.wong',
    email: 'lisa.wong@cybersecure.com',
    firstName: 'Lisa',
    lastName: 'Wong',
    role: 'analyst',
    status: 'suspended',
    lastLogin: '2024-01-08T11:30:00Z',
    department: 'Forensics',
    createdAt: '2024-01-05T00:00:00Z'
  }
];

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-primary-400 bg-primary-900/50 border-primary-500';
      case 'analyst': return 'text-secondary-400 bg-secondary-900/50 border-secondary-500';
      default: return 'text-dark-400 bg-dark-700 border-dark-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success-400 bg-success-900/50 border-success-500';
      case 'inactive': return 'text-dark-400 bg-dark-700 border-dark-600';
      case 'suspended': return 'text-error-400 bg-error-900/50 border-error-500';
      default: return 'text-dark-400 bg-dark-700 border-dark-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-success-400" />;
      case 'inactive': return <XCircle className="h-4 w-4 text-dark-400" />;
      case 'suspended': return <XCircle className="h-4 w-4 text-error-400" />;
      default: return <XCircle className="h-4 w-4 text-dark-400" />;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
          <p className="text-dark-300">Manage user accounts and permissions</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add User</span>
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
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
            >
              <option value="all">All Roles</option>
              <option value="admin">Administrator</option>
              <option value="analyst">Analyst</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-dark-300">User</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-dark-300">Role</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-dark-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-dark-300">Department</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-dark-300">Last Login</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-dark-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-dark-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{user.firstName} {user.lastName}</h3>
                        <p className="text-sm text-dark-400">{user.email}</p>
                        <p className="text-sm text-dark-500">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-primary-400" />
                      <span className={`px-2 py-1 text-xs rounded-full border ${getRoleColor(user.role)}`}>
                        {user.role === 'admin' ? 'Administrator' : 'Analyst'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(user.status)}
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-white">{user.department}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-dark-300">{formatDate(user.lastLogin)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-primary-400 hover:text-primary-300 hover:bg-primary-500/10 rounded-lg transition-colors">
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
          <h3 className="text-lg font-semibold text-white mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-primary-400">{users.length}</p>
        </div>
        <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Active Users</h3>
          <p className="text-3xl font-bold text-success-400">
            {users.filter(u => u.status === 'active').length}
          </p>
        </div>
        <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Administrators</h3>
          <p className="text-3xl font-bold text-primary-400">
            {users.filter(u => u.role === 'admin').length}
          </p>
        </div>
        <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Analysts</h3>
          <p className="text-3xl font-bold text-secondary-400">
            {users.filter(u => u.role === 'analyst').length}
          </p>
        </div>
      </div>
    </div>
  );
};
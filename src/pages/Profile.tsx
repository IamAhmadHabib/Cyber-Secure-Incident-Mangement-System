import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Shield, Save, Camera } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Cybersecurity professional with 5+ years of experience in incident response and threat analysis.',
    department: 'Security Operations Center',
    title: 'Senior Security Analyst'
  });

  const handleSave = () => {
    // Handle save logic here
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
          <p className="text-dark-300">Manage your personal information and preferences</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex items-center space-x-2"
        >
          {isEditing ? <Save className="h-4 w-4" /> : <User className="h-4 w-4" />}
          <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 hover:bg-primary-700 rounded-full flex items-center justify-center transition-colors">
                <Camera className="h-4 w-4 text-white" />
              </button>
            </div>
            <h3 className="text-xl font-semibold text-white mb-1">
              {formData.firstName} {formData.lastName}
            </h3>
            <p className="text-dark-400 mb-2">{formData.title}</p>
            <p className="text-sm text-dark-500">{formData.department}</p>
            
            <div className="flex items-center justify-center space-x-2 mt-4">
              <Shield className="h-4 w-4 text-primary-400" />
              <span className="text-sm text-primary-400 capitalize">{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Personal Information</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white disabled:opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white disabled:opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white disabled:opacity-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white disabled:opacity-50"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white disabled:opacity-50"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white disabled:opacity-50 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Activity Summary</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-6 w-6 text-primary-400" />
                </div>
                <p className="text-2xl font-bold text-white">23</p>
                <p className="text-sm text-dark-400">Incidents Handled</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-secondary-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Calendar className="h-6 w-6 text-secondary-400" />
                </div>
                <p className="text-2xl font-bold text-white">156</p>
                <p className="text-sm text-dark-400">Days Active</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-success-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <User className="h-6 w-6 text-success-400" />
                </div>
                <p className="text-2xl font-bold text-white">98%</p>
                <p className="text-sm text-dark-400">Response Rate</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-dark-700/50 rounded-lg">
                <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">Resolved incident INC-001</p>
                  <p className="text-xs text-dark-400">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-dark-700/50 rounded-lg">
                <div className="w-2 h-2 bg-secondary-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">Updated asset WS-045 status</p>
                  <p className="text-xs text-dark-400">4 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-dark-700/50 rounded-lg">
                <div className="w-2 h-2 bg-success-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-white">Completed security assessment</p>
                  <p className="text-xs text-dark-400">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
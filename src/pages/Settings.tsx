import React, { useState } from 'react';
import { Bell, Shield, Moon, Sun, Globe, Database, Wifi, Lock, Save, Eye, EyeOff } from 'lucide-react';

export const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    incidents: true,
    assets: true,
    users: false,
    system: true,
    email: true,
    push: false
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    sessionTimeout: '30',
    passwordExpiry: '90'
  });

  const [preferences, setPreferences] = useState({
    theme: 'dark',
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY'
  });

  const [changePassword, setChangePassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleSecurityChange = (key: string, value: string | boolean) => {
    setSecurity(prev => ({ ...prev, [key]: value }));
  };

  const handlePreferenceChange = (key: string, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handlePasswordChange = (key: string, value: string) => {
    setChangePassword(prev => ({ ...prev, [key]: value }));
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-dark-300">Manage your account settings and preferences</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Bell className="h-5 w-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Incident Alerts</p>
                <p className="text-xs text-dark-400">Get notified about new incidents</p>
              </div>
              <button
                onClick={() => handleNotificationChange('incidents', !notifications.incidents)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.incidents ? 'bg-primary-600' : 'bg-dark-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.incidents ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Asset Updates</p>
                <p className="text-xs text-dark-400">Asset status changes</p>
              </div>
              <button
                onClick={() => handleNotificationChange('assets', !notifications.assets)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.assets ? 'bg-primary-600' : 'bg-dark-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.assets ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">User Activities</p>
                <p className="text-xs text-dark-400">New user registrations and activities</p>
              </div>
              <button
                onClick={() => handleNotificationChange('users', !notifications.users)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.users ? 'bg-primary-600' : 'bg-dark-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.users ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">System Alerts</p>
                <p className="text-xs text-dark-400">System maintenance and updates</p>
              </div>
              <button
                onClick={() => handleNotificationChange('system', !notifications.system)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.system ? 'bg-primary-600' : 'bg-dark-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.system ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Shield className="h-5 w-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">Security</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                <p className="text-xs text-dark-400">Add an extra layer of security</p>
              </div>
              <button
                onClick={() => handleSecurityChange('twoFactor', !security.twoFactor)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  security.twoFactor ? 'bg-primary-600' : 'bg-dark-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  security.twoFactor ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Session Timeout (minutes)
              </label>
              <select
                value={security.sessionTimeout}
                onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password Expiry (days)
              </label>
              <select
                value={security.passwordExpiry}
                onChange={(e) => handleSecurityChange('passwordExpiry', e.target.value)}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
              >
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="180">180 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Globe className="h-5 w-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">Preferences</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Theme
              </label>
              <select
                value={preferences.theme}
                onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Language
              </label>
              <select
                value={preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Timezone
              </label>
              <select
                value={preferences.timezone}
                onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
              >
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Date Format
              </label>
              <select
                value={preferences.dateFormat}
                onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Lock className="h-5 w-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">Change Password</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={changePassword.current}
                  onChange={(e) => handlePasswordChange('current', e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white pr-10"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-dark-200"
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={changePassword.new}
                  onChange={(e) => handlePasswordChange('new', e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white pr-10"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-dark-200"
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={changePassword.confirm}
                  onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white pr-10"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-dark-200"
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex items-center justify-center space-x-2">
              <Save className="h-4 w-4" />
              <span>Update Password</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save All Settings */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-success-600 hover:bg-success-700 rounded-lg transition-colors flex items-center space-x-2">
          <Save className="h-5 w-5" />
          <span>Save All Settings</span>
        </button>
      </div>
    </div>
  );
};
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Users, ArrowRight, CheckCircle } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-secondary-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full">
                <Shield className="h-16 w-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                CyberSecure
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-dark-300 mb-8 max-w-3xl mx-auto">
              Advanced Cybersecurity Incident Management System for Enterprise Security Operations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/signup"
                className="px-8 py-4 border border-primary-500 hover:bg-primary-500/10 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Security Management
            </h2>
            <p className="text-dark-300 text-lg max-w-2xl mx-auto">
              Streamline your security operations with our integrated platform for incident response, asset management, and threat intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-dark-800 rounded-xl p-8 border border-dark-700 hover:border-primary-500 transition-all duration-300 group">
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary-500/30 transition-colors">
                <Lock className="h-6 w-6 text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Incident Management</h3>
              <p className="text-dark-300">
                Track, investigate, and resolve security incidents with automated workflows and real-time collaboration tools.
              </p>
            </div>

            <div className="bg-dark-800 rounded-xl p-8 border border-dark-700 hover:border-secondary-500 transition-all duration-300 group">
              <div className="w-12 h-12 bg-secondary-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-secondary-500/30 transition-colors">
                <Eye className="h-6 w-6 text-secondary-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Asset Monitoring</h3>
              <p className="text-dark-300">
                Maintain comprehensive visibility of your digital assets with continuous monitoring and vulnerability assessment.
              </p>
            </div>

            <div className="bg-dark-800 rounded-xl p-8 border border-dark-700 hover:border-success-500 transition-all duration-300 group">
              <div className="w-12 h-12 bg-success-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-success-500/30 transition-colors">
                <Users className="h-6 w-6 text-success-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Team Collaboration</h3>
              <p className="text-dark-300">
                Enable seamless collaboration between security teams with role-based access and real-time communication.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Why Choose CyberSecure?
              </h2>
              <div className="space-y-6">
                {[
                  'Enterprise-grade security with end-to-end encryption',
                  'Real-time threat detection and automated response',
                  'Comprehensive audit trails and compliance reporting',
                  'Seamless integration with existing security tools',
                  '24/7 monitoring and professional support'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-success-400 mt-0.5 flex-shrink-0" />
                    <span className="text-dark-200">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-2xl p-8 border border-primary-500/20">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Demo Credentials</h3>
                <div className="space-y-4">
                  <div className="bg-dark-800 rounded-lg p-4">
                    <p className="text-sm text-dark-400 mb-1">Administrator</p>
                    <p className="font-mono text-primary-400">admin / admin123</p>
                  </div>
                  <div className="bg-dark-800 rounded-lg p-4">
                    <p className="text-sm text-dark-400 mb-1">Security Analyst</p>
                    <p className="font-mono text-secondary-400">analyst / analyst123</p>
                  </div>
                </div>
                <Link
                  to="/login"
                  className="mt-6 inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                >
                  <span>Try Demo</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark-800 border-t border-dark-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-primary-500" />
              <span className="text-lg font-bold">CyberSecure</span>
            </div>
            <p className="text-dark-400 text-sm">
              © 2024 CyberSecure. All rights reserved. Built for enterprise cybersecurity operations.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
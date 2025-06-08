import React from 'react';
import { X, Calendar, Star, Zap, Shield, Users } from 'lucide-react';

interface ChangelogProps {
  onClose: () => void;
}

export const Changelog: React.FC<ChangelogProps> = ({ onClose }) => {
  const changelogEntries = [
    {
      version: '2.1.0',
      date: '2024-01-15',
      title: 'Major Update - VIP Features & Device Comparison',
      features: [
        'Added comprehensive device comparison tool',
        'Introduced VIP membership with unlimited generations',
        'Dark/Light theme toggle for VIP users',
        'Enhanced sensitivity calculation algorithm',
        'Added device review and rating system',
        'Improved mobile responsiveness'
      ],
      type: 'major'
    },
    {
      version: '2.0.5',
      date: '2024-01-10',
      title: 'Performance & UI Improvements',
      features: [
        'Optimized sensitivity calculation performance',
        'Added loading animations and better UX',
        'Enhanced device auto-detection',
        'Fixed various UI bugs',
        'Added offline detection'
      ],
      type: 'update'
    },
    {
      version: '2.0.0',
      date: '2024-01-01',
      title: 'Complete Redesign',
      features: [
        'Brand new modern UI design',
        'User authentication system',
        'Admin dashboard for user management',
        'Device database with 500+ devices',
        'Advanced play style customization',
        'Export settings as images'
      ],
      type: 'major'
    },
    {
      version: '1.5.2',
      date: '2023-12-20',
      title: 'Bug Fixes & Stability',
      features: [
        'Fixed iPhone detection issues',
        'Improved Android device recognition',
        'Better error handling',
        'Performance optimizations'
      ],
      type: 'fix'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'major': return Star;
      case 'update': return Zap;
      case 'fix': return Shield;
      default: return Users;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'major': return 'text-yellow-400 bg-yellow-400/20';
      case 'update': return 'text-blue-400 bg-blue-400/20';
      case 'fix': return 'text-green-400 bg-green-400/20';
      default: return 'text-purple-400 bg-purple-400/20';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">What's New</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          <div className="p-6 space-y-6">
            {changelogEntries.map((entry, index) => {
              const Icon = getIcon(entry.type);
              const colorClass = getColor(entry.type);
              
              return (
                <div key={index} className="border border-gray-700 rounded-lg p-6 bg-gray-800">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-white">{entry.title}</h3>
                        <span className="text-purple-400 font-mono text-sm">v{entry.version}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-400 text-sm mb-4">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(entry.date).toLocaleDateString()}
                      </div>
                      
                      <ul className="space-y-2">
                        {entry.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-start text-gray-300">
                            <span className="text-green-400 mr-2 mt-1">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 bg-gray-800/50">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Stay tuned for more updates! Follow us on social media for the latest news.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
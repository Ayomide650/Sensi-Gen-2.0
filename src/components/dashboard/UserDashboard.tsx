import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { DeviceSelectionForm } from '../device/DeviceSelectionForm';
import { ResultsPanel } from '../results/ResultsPanel';
import { ComparisonModal } from '../device/ComparisonModal';
import { ReviewModal } from '../reviews/ReviewModal';
import { Changelog } from '../changelog/Changelog';
import { Settings, Target, Crown, Calendar, BarChart3, MessageCircle, Clock } from 'lucide-react';
import { DeviceInfo, SensitivitySettings } from '../../types';
import { LoadingIndicator } from '../ui/LoadingIndicator';
import { calculateSensitivity } from '../../utils/sensitivityCalculator';

export const UserDashboard: React.FC = () => {
  const { user, theme, toggleTheme } = useAuth();
  const [currentDevice, setCurrentDevice] = useState<DeviceInfo | null>(null);
  const [sensitivitySettings, setSensitivitySettings] = useState<SensitivitySettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'settings' | 'analytics'>('generate');

  const canGenerate = () => {
    if (user?.role === 'vip' || user?.role === 'admin') return true;
    
    const today = new Date().toISOString().split('T')[0];
    const lastGenDate = user?.lastGenerationDate;
    
    if (lastGenDate !== today) return true;
    return (user?.generationsToday || 0) < 5;
  };

  const handleGenerateSettings = async (device: DeviceInfo, playStyle: string, experienceLevel: string) => {
    if (!canGenerate()) {
      alert('Daily generation limit reached. Upgrade to VIP for unlimited generations!');
      return;
    }

    setLoading(true);
    try {
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const settings = calculateSensitivity(device, playStyle, experienceLevel);
      setCurrentDevice(device);
      setSensitivitySettings(settings);
      
      // Update generation count (in real app, this would be done via API)
      // For demo purposes, we'll just show the results
    } catch (error) {
      console.error('Error generating sensitivity:', error);
      alert('Failed to generate sensitivity settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRemainingGenerations = () => {
    if (user?.role === 'vip' || user?.role === 'admin') return '∞';
    
    const today = new Date().toISOString().split('T')[0];
    const lastGenDate = user?.lastGenerationDate;
    
    if (lastGenDate !== today) return '5';
    return Math.max(0, 5 - (user?.generationsToday || 0)).toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center">
              <Target className="w-8 h-8 text-green-400 mr-3" />
              <div>
                <p className="text-white/60 text-sm">Generations Left</p>
                <p className="text-white text-2xl font-bold">{getRemainingGenerations()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center">
              <Crown className="w-8 h-8 text-yellow-400 mr-3" />
              <div>
                <p className="text-white/60 text-sm">Account Type</p>
                <p className="text-white text-lg font-bold capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-400 mr-3" />
              <div>
                <p className="text-white/60 text-sm">Member Since</p>
                <p className="text-white text-lg font-bold">
                  {new Date(user?.createdAt || '').toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-purple-400 mr-3" />
              <div>
                <p className="text-white/60 text-sm">Last Active</p>
                <p className="text-white text-lg font-bold">Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowComparison(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
          >
            Compare Devices
          </button>
          
          <button
            onClick={() => setShowChangelog(true)}
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
          >
            What's New
          </button>
          
          <button
            onClick={() => setShowReview(true)}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
          >
            Submit Review
          </button>

          {(user?.role === 'vip' || user?.role === 'admin') && (
            <button
              onClick={toggleTheme}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
            >
              Toggle Theme
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Device Selection */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Generate Sensitivity</h2>
            {loading ? (
              <LoadingIndicator />
            ) : (
              <DeviceSelectionForm onGenerate={handleGenerateSettings} />
            )}
          </div>

          {/* Results */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">Your Settings</h2>
            {sensitivitySettings && currentDevice ? (
              <ResultsPanel
                settings={sensitivitySettings}
                device={currentDevice}
                onExport={() => {}}
              />
            ) : (
              <div className="text-center text-white/60 py-12">
                <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Generate your first sensitivity settings to see results here</p>
              </div>
            )}
          </div>
        </div>

        {/* Upgrade Banner for Free Users */}
        {user?.role === 'user' && (
          <div className="mt-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Upgrade to VIP</h3>
                <p className="text-white/80">Get unlimited generations, theme toggle, priority support, and more!</p>
              </div>
              <button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105">
                Upgrade Now
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showComparison && (
        <ComparisonModal onClose={() => setShowComparison(false)} />
      )}
      
      {showReview && currentDevice && (
        <ReviewModal
          device={currentDevice}
          onClose={() => setShowReview(false)}
        />
      )}
      
      {showChangelog && (
        <Changelog onClose={() => setShowChangelog(false)} />
      )}
    </div>
  );
};
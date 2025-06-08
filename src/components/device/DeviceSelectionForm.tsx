import React, { useState, useEffect } from 'react';
import { DeviceInfo } from '../../types';
import { detectDevice, searchDevices } from '../../utils/deviceDetection';
import { Smartphone, Search, Zap, Users, Monitor } from 'lucide-react';

interface DeviceSelectionFormProps {
  onGenerate: (device: DeviceInfo, playStyle: string, experienceLevel: string) => void;
}

export const DeviceSelectionForm: React.FC<DeviceSelectionFormProps> = ({ onGenerate }) => {
  const [selectedDevice, setSelectedDevice] = useState<DeviceInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DeviceInfo[]>([]);
  const [playStyle, setPlayStyle] = useState('balanced');
  const [experienceLevel, setExperienceLevel] = useState('intermediate');
  const [detectionMethod, setDetectionMethod] = useState<'auto' | 'search' | 'manual'>('auto');

  useEffect(() => {
    // Try auto-detection on component mount
    const detected = detectDevice();
    if (detected) {
      setSelectedDevice(detected);
    }
  }, []);

  useEffect(() => {
    if (searchQuery.length > 2) {
      const results = searchDevices(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleDeviceSelect = (device: DeviceInfo) => {
    setSelectedDevice(device);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDevice) {
      onGenerate(selectedDevice, playStyle, experienceLevel);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Device Selection */}
      <div>
        <label className="block text-white font-medium mb-3">Select Your Device</label>
        
        {/* Detection Method Tabs */}
        <div className="flex space-x-2 mb-4">
          <button
            type="button"
            onClick={() => setDetectionMethod('auto')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              detectionMethod === 'auto'
                ? 'bg-purple-500 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            Auto Detect
          </button>
          <button
            type="button"
            onClick={() => setDetectionMethod('search')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              detectionMethod === 'search'
                ? 'bg-purple-500 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setDetectionMethod('manual')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              detectionMethod === 'manual'
                ? 'bg-purple-500 text-white'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            Manual
          </button>
        </div>

        {/* Auto Detection */}
        {detectionMethod === 'auto' && (
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            {selectedDevice ? (
              <div className="flex items-center space-x-3">
                <Smartphone className="w-6 h-6 text-green-400" />
                <div>
                  <p className="text-white font-medium">{selectedDevice.name}</p>
                  <p className="text-white/60 text-sm">
                    {selectedDevice.screenSize}" • {selectedDevice.refreshRate}Hz
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Smartphone className="w-8 h-8 text-white/40 mx-auto mb-2" />
                <p className="text-white/60">Unable to auto-detect device</p>
                <p className="text-white/40 text-sm">Try search or manual entry</p>
              </div>
            )}
          </div>
        )}

        {/* Search */}
        {detectionMethod === 'search' && (
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for your device..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((device, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDeviceSelect(device)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-700 flex items-center space-x-3"
                  >
                    <Smartphone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-white font-medium">{device.name}</p>
                      <p className="text-gray-400 text-sm">
                        {device.screenSize}" • {device.refreshRate}Hz • {device.releaseYear}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Selected Device Display */}
        {selectedDevice && detectionMethod === 'search' && (
          <div className="mt-4 bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-white font-medium">{selectedDevice.name}</p>
                <p className="text-white/60 text-sm">
                  {selectedDevice.screenSize}" • {selectedDevice.refreshRate}Hz • RAM: {selectedDevice.ram || 'Unknown'}GB
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Play Style */}
      <div>
        <label className="block text-white font-medium mb-3">Play Style</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'aggressive', label: 'Aggressive', icon: Zap, desc: 'Fast-paced, rushing' },
            { value: 'balanced', label: 'Balanced', icon: Users, desc: 'Versatile gameplay' },
            { value: 'precise', label: 'Precise', icon: Monitor, desc: 'Accurate, strategic' }
          ].map((style) => (
            <button
              key={style.value}
              type="button"
              onClick={() => setPlayStyle(style.value)}
              className={`p-4 rounded-lg border text-center transition-all ${
                playStyle === style.value
                  ? 'bg-purple-500/20 border-purple-500 text-white'
                  : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'
              }`}
            >
              <style.icon className="w-6 h-6 mx-auto mb-2" />
              <p className="font-medium">{style.label}</p>
              <p className="text-xs opacity-60">{style.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <label className="block text-white font-medium mb-3">Experience Level</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'beginner', label: 'Beginner', desc: 'New to the game' },
            { value: 'intermediate', label: 'Intermediate', desc: 'Some experience' },
            { value: 'advanced', label: 'Advanced', desc: 'Veteran player' }
          ].map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => setExperienceLevel(level.value)}
              className={`p-4 rounded-lg border text-center transition-all ${
                experienceLevel === level.value
                  ? 'bg-blue-500/20 border-blue-500 text-white'
                  : 'bg-white/5 border-white/20 text-white/80 hover:bg-white/10'
              }`}
            >
              <p className="font-medium">{level.label}</p>
              <p className="text-xs opacity-60">{level.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        type="submit"
        disabled={!selectedDevice}
        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
      >
        Generate Optimal Settings
      </button>
    </form>
  );
};
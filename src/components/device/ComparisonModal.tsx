import React, { useState } from 'react';
import { DeviceInfo } from '../../types';
import { searchDevices } from '../../utils/deviceDetection';
import { X, Search, Smartphone, Monitor, Cpu, Zap } from 'lucide-react';

interface ComparisonModalProps {
  onClose: () => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ onClose }) => {
  const [device1, setDevice1] = useState<DeviceInfo | null>(null);
  const [device2, setDevice2] = useState<DeviceInfo | null>(null);
  const [searchQuery1, setSearchQuery1] = useState('');
  const [searchQuery2, setSearchQuery2] = useState('');
  const [searchResults1, setSearchResults1] = useState<DeviceInfo[]>([]);
  const [searchResults2, setSearchResults2] = useState<DeviceInfo[]>([]);

  const handleSearch1 = (query: string) => {
    setSearchQuery1(query);
    if (query.length > 2) {
      setSearchResults1(searchDevices(query));
    } else {
      setSearchResults1([]);
    }
  };

  const handleSearch2 = (query: string) => {
    setSearchQuery2(query);
    if (query.length > 2) {
      setSearchResults2(searchDevices(query));
    } else {
      setSearchResults2([]);
    }
  };

  const calculateDeviceScore = (device: DeviceInfo): number => {
    const screenScore = Math.min(100, (device.screenSize / 7) * 100);
    const refreshScore = Math.min(100, (device.refreshRate / 120) * 100);
    const touchScore = Math.min(100, (device.touchSamplingRate / 240) * 100);
    const processorScore = device.processorScore;
    const gpuScore = device.gpuScore;
    const ageScore = Math.max(0, 100 - (2024 - device.releaseYear) * 5);
    
    return Math.round((screenScore + refreshScore + touchScore + processorScore + gpuScore + ageScore) / 6);
  };

  const getComparisonData = () => {
    if (!device1 || !device2) return null;

    const score1 = calculateDeviceScore(device1);
    const score2 = calculateDeviceScore(device2);

    return {
      device1: { ...device1, score: score1 },
      device2: { ...device2, score: score2 },
      winner: score1 > score2 ? 'device1' : score1 < score2 ? 'device2' : 'tie'
    };
  };

  const comparison = getComparisonData();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Device Comparison</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Device Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Device 1 */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Device 1</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery1}
                  onChange={(e) => handleSearch1(e.target.value)}
                  placeholder="Search for first device..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                
                {searchResults1.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-gray-800 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {searchResults1.map((device, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setDevice1(device);
                          setSearchResults1([]);
                          setSearchQuery1(device.name);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white"
                      >
                        {device.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {device1 && (
                <div className="mt-3 p-3 bg-gray-800 rounded-lg">
                  <p className="text-white font-medium">{device1.name}</p>
                  <p className="text-gray-400 text-sm">{device1.screenSize}" • {device1.refreshRate}Hz</p>
                </div>
              )}
            </div>

            {/* Device 2 */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Device 2</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery2}
                  onChange={(e) => handleSearch2(e.target.value)}
                  placeholder="Search for second device..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                
                {searchResults2.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-gray-800 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {searchResults2.map((device, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setDevice2(device);
                          setSearchResults2([]);
                          setSearchQuery2(device.name);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-700 text-white"
                      >
                        {device.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {device2 && (
                <div className="mt-3 p-3 bg-gray-800 rounded-lg">
                  <p className="text-white font-medium">{device2.name}</p>
                  <p className="text-gray-400 text-sm">{device2.screenSize}" • {device2.refreshRate}Hz</p>
                </div>
              )}
            </div>
          </div>

          {/* Comparison Results */}
          {comparison && (
            <div className="space-y-6">
              {/* Overall Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-6 rounded-xl ${comparison.winner === 'device1' ? 'bg-green-500/20 border border-green-500/30' : 'bg-gray-800'}`}>
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-white">{comparison.device1.name}</h4>
                    <div className="text-2xl font-bold text-white">{comparison.device1.score}</div>
                  </div>
                  {comparison.winner === 'device1' && (
                    <p className="text-green-400 text-sm mt-2">🏆 Winner</p>
                  )}
                </div>
                
                <div className={`p-6 rounded-xl ${comparison.winner === 'device2' ? 'bg-green-500/20 border border-green-500/30' : 'bg-gray-800'}`}>
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-white">{comparison.device2.name}</h4>
                    <div className="text-2xl font-bold text-white">{comparison.device2.score}</div>
                  </div>
                  {comparison.winner === 'device2' && (
                    <p className="text-green-400 text-sm mt-2">🏆 Winner</p>
                  )}
                </div>
              </div>

              {/* Detailed Comparison */}
              <div className="space-y-4">
                {[
                  { label: 'Screen Size', icon: Monitor, key: 'screenSize', unit: '"' },
                  { label: 'Refresh Rate', icon: Zap, key: 'refreshRate', unit: 'Hz' },
                  { label: 'Touch Sampling', icon: Smartphone, key: 'touchSamplingRate', unit: 'Hz' },
                  { label: 'Processor', icon: Cpu, key: 'processorScore', unit: '/100' },
                  { label: 'GPU', icon: Cpu, key: 'gpuScore', unit: '/100' },
                ].map((spec) => (
                  <div key={spec.key} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <spec.icon className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-white font-medium">{spec.label}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-300 text-sm">{comparison.device1.name}</span>
                          <span className="text-white font-medium">
                            {comparison.device1[spec.key as keyof DeviceInfo]}{spec.unit}
                          </span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ 
                              width: `${Math.min(100, (Number(comparison.device1[spec.key as keyof DeviceInfo]) / 200) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-300 text-sm">{comparison.device2.name}</span>
                          <span className="text-white font-medium">
                            {comparison.device2[spec.key as keyof DeviceInfo]}{spec.unit}
                          </span>
                        </div>
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ 
                              width: `${Math.min(100, (Number(comparison.device2[spec.key as keyof DeviceInfo]) / 200) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
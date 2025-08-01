import React from 'react';
import { SensitivitySettings, DeviceInfo } from '../../types';
import { Download, Share2, Copy, Check } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ResultsPanelProps {
  settings: SensitivitySettings;
  device: DeviceInfo;
  onExport: () => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ settings, device, onExport }) => {
  const [copied, setCopied] = React.useState(false);

  const sensitivityData = [
    { label: 'General', value: settings.general, color: 'bg-blue-500' },
    { label: 'Red Dot', value: settings.redDot, color: 'bg-red-500' },
    { label: '2x Scope', value: settings.scope2x, color: 'bg-green-500' },
    { label: '4x Scope', value: settings.scope4x, color: 'bg-yellow-500' },
    { label: 'Sniper', value: settings.sniperScope, color: 'bg-purple-500' },
    { label: 'Free Look', value: settings.freeLook, color: 'bg-pink-500' },
  ];

  const copyToClipboard = async () => {
    const text = sensitivityData
      .map(item => `${item.label}: ${item.value}`)
      .join('\n');
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const exportAsImage = async () => {
    const element = document.getElementById('sensitivity-results');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#1a1b23',
        scale: 2,
        logging: false,
      });
      
      const link = document.createElement('a');
      link.download = `sensi-gen-${device.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div id="sensitivity-results" className="bg-gray-900 rounded-xl p-6 border border-gray-700">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">Optimal Settings</h3>
          <p className="text-gray-400">Generated for {device.name}</p>
          <div className="flex items-center justify-center mt-2 space-x-4 text-sm text-gray-500">
            <span>{device.screenSize}" • {device.refreshRate}Hz</span>
            <span>•</span>
            <span>{device.processorScore}/100 CPU</span>
          </div>
        </div>

        {/* Sensitivity Grid */}
        <div className="grid grid-cols-2 gap-4">
          {sensitivityData.map((item, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 font-medium">{item.label}</span>
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              </div>
              <div className="text-2xl font-bold text-white">{item.value}</div>
              <div className="w-full bg-gray-600 rounded-full h-1.5 mt-2">
                <div 
                  className={`h-1.5 rounded-full ${item.color}`}
                  style={{ width: `${(item.value / 200) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Watermark */}
        <div className="text-center mt-6 pt-4 border-t border-gray-700">
          <p className="text-gray-500 text-sm">Generated by Sensi-Gen • Free Fire Sensitivity Optimizer</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={copyToClipboard}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-3 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
        >
          {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          <span>{copied ? 'Copied!' : 'Copy Values'}</span>
        </button>
        
        <button
          onClick={exportAsImage}
          className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-4 py-3 rounded-lg font-medium transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>Export PNG</span>
        </button>
        
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'My Free Fire Sensitivity Settings',
                text: `Check out my optimal sensitivity settings generated by Sensi-Gen for ${device.name}!`
              });
            }
          }}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Tips */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <h4 className="text-blue-300 font-medium mb-2">💡 Pro Tips</h4>
        <ul className="text-blue-200 text-sm space-y-1">
          <li>• Start with these settings and fine-tune based on your preference</li>
          <li>• Practice in training mode before using in ranked matches</li>
          <li>• Adjust gyroscope settings separately for better control</li>
          <li>• Consider your grip style and finger positioning</li>
        </ul>
      </div>
    </div>
  );
};
import { DeviceInfo } from '../types';
import { deviceDatabase } from '../data/deviceDatabase';

export const detectDevice = (): DeviceInfo | null => {
  try {
    const userAgent = navigator.userAgent;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const pixelRatio = window.devicePixelRatio || 1;
    
    // Calculate screen size in inches (rough estimation)
    const screenDiagonal = Math.sqrt(Math.pow(screenWidth, 2) + Math.pow(screenHeight, 2)) / (pixelRatio * 160);
    
    // Try to detect iPhone
    if (/iPhone/.test(userAgent)) {
      const match = userAgent.match(/iPhone OS (\d+)_(\d+)/);
      const iosVersion = match ? parseInt(match[1]) : 14;
      
      // Try to identify specific iPhone model based on screen dimensions
      const deviceKey = Object.keys(deviceDatabase).find(key => 
        key.toLowerCase().includes('iphone') && 
        Math.abs(deviceDatabase[key].screenSize - screenDiagonal) < 0.5
      );
      
      if (deviceKey) {
        return {
          name: deviceKey,
          ...deviceDatabase[deviceKey],
          detectionMethod: 'auto'
        };
      }
      
      // Fallback iPhone detection
      return {
        name: `iPhone (iOS ${iosVersion})`,
        screenSize: screenDiagonal,
        refreshRate: 60,
        touchSamplingRate: 120,
        processorScore: 85,
        gpuScore: 82,
        releaseYear: 2020,
        brand: 'Apple',
        detectionMethod: 'auto'
      };
    }
    
    // Try to detect Android device
    if (/Android/.test(userAgent)) {
      const match = userAgent.match(/Android (\d+)/);
      const androidVersion = match ? parseInt(match[1]) : 11;
      
      // Try to identify specific Android model
      const deviceKey = Object.keys(deviceDatabase).find(key => {
        const device = deviceDatabase[key];
        return Math.abs(device.screenSize - screenDiagonal) < 0.5 && 
               device.brand?.toLowerCase() !== 'apple';
      });
      
      if (deviceKey) {
        return {
          name: deviceKey,
          ...deviceDatabase[deviceKey],
          detectionMethod: 'auto'
        };
      }
      
      // Fallback Android detection
      return {
        name: `Android Device (API ${androidVersion})`,
        screenSize: screenDiagonal,
        refreshRate: 60,
        touchSamplingRate: 120,
        processorScore: 75,
        gpuScore: 70,
        releaseYear: 2021,
        brand: 'Unknown',
        detectionMethod: 'auto'
      };
    }
    
    return null;
  } catch (error) {
    console.error('Device detection failed:', error);
    return null;
  }
};

export const searchDevices = (query: string): DeviceInfo[] => {
  const normalizedQuery = query.toLowerCase().trim();
  
  return Object.entries(deviceDatabase)
    .filter(([name]) => name.toLowerCase().includes(normalizedQuery))
    .map(([name, specs]) => ({
      name,
      ...specs,
      detectionMethod: 'search'
    }))
    .slice(0, 10); // Limit to 10 results
};

export const getDevicesByBrand = (brand: string): DeviceInfo[] => {
  return Object.entries(deviceDatabase)
    .filter(([, specs]) => specs.brand?.toLowerCase() === brand.toLowerCase())
    .map(([name, specs]) => ({
      name,
      ...specs,
      detectionMethod: 'brand'
    }));
};
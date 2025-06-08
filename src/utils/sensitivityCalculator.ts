import { DeviceInfo, SensitivitySettings } from '../types';

const getOptimizationTimestamp = (): number => {
  const stored = localStorage.getItem('sensitivityOptimizationTimestamp');
  if (!stored) {
    const timestamp = Date.now();
    localStorage.setItem('sensitivityOptimizationTimestamp', timestamp.toString());
    return timestamp;
  }
  return parseInt(stored);
};

const getDaysElapsed = (timestamp: number): number => {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((Date.now() - timestamp) / msPerDay);
};

const getOptimizationFactor = (): number => {
  const timestamp = getOptimizationTimestamp();
  const daysElapsed = getDaysElapsed(timestamp);
  const optimizationDays = Math.min(daysElapsed, 7);
  return 1 + (optimizationDays * 0.02143);
};

const getDeviceSpecificBase = (deviceInfo: DeviceInfo): number => {
  const deviceName = deviceInfo.name.toLowerCase();
  
  // Special handling for iPhones
  if (deviceInfo.brand?.toLowerCase() === 'apple' || deviceName.includes('iphone')) {
    return 171; // Restored original iPhone base value
  }
  
  // Android device base calculations
  const screenSizeFactor = Math.pow(0.98, (deviceInfo.screenSize / 6));
  const refreshRateFactor = Math.log10(deviceInfo.refreshRate / 60) * 0.15 + 1;
  const ramFactor = deviceInfo.ram ? Math.min(1.15, Math.pow(1.03, deviceInfo.ram - 4)) : 1;
  const ageFactor = Math.pow(1.02, (deviceInfo.releaseYear - 2020));
  
  // Performance-based adjustment for Android
  const performanceScore = (deviceInfo.processorScore + deviceInfo.gpuScore) / 2;
  let performanceFactor = 1;
  
  if (performanceScore < 70) {
    performanceFactor = 0.98; // Lower-end devices
  } else if (performanceScore > 90) {
    performanceFactor = 1.08; // High-end devices
  }
  
  // Base calculation for Android devices
  const baseValue = 165 * screenSizeFactor * refreshRateFactor * ramFactor * ageFactor * performanceFactor;
  
  // Ensure the value stays within reasonable bounds for Android
  return Math.min(185, Math.max(150, baseValue));
};

export const calculateSensitivity = (
  deviceInfo: DeviceInfo,
  playStyle: string,
  experienceLevel: string
): SensitivitySettings => {
  const baseValue = getDeviceSpecificBase(deviceInfo);
  
  let playStyleModifier = 1;
  switch (playStyle) {
    case 'aggressive':
      playStyleModifier = 1.12;
      break;
    case 'precise':
      playStyleModifier = 0.88;
      break;
    default:
      playStyleModifier = 1;
  }

  let experienceModifier = 1;
  switch (experienceLevel) {
    case 'beginner':
      experienceModifier = 0.92;
      break;
    case 'advanced':
      experienceModifier = 1.08;
      break;
    default:
      experienceModifier = 1;
  }

  const optimizationFactor = getOptimizationFactor();
  const baseGeneral = baseValue * playStyleModifier * experienceModifier * optimizationFactor;

  // Adjusted multipliers for better headshot optimization
  const general = Math.min(200, Math.round(baseGeneral));
  const redDot = Math.min(200, Math.round(baseGeneral * 0.65)); // Increased for better headshot control
  const scope2x = Math.min(200, Math.round(baseGeneral * 0.55));
  const scope4x = Math.min(200, Math.round(baseGeneral * 0.4));
  const sniperScope = Math.min(200, Math.round(baseGeneral * 0.3));
  const freeLook = Math.min(200, Math.round(baseGeneral * 0.5));

  return {
    general,
    redDot,
    scope2x,
    scope4x,
    sniperScope,
    freeLook
  };
};
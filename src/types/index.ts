export interface DeviceInfo {
  name: string;
  screenSize: number;
  refreshRate: number;
  touchSamplingRate: number;
  processorScore: number;
  gpuScore: number;
  releaseYear: number;
  ram?: number;
  brand?: string;
  detectionMethod?: string;
}

export interface DeviceDatabase {
  [key: string]: Omit<DeviceInfo, 'name' | 'detectionMethod'>;
}

export interface SensitivitySettings {
  general: number;
  redDot: number;
  scope2x: number;
  scope4x: number;
  sniperScope: number;
  freeLook: number;
}

export interface User {
  id: string;
  username: string;
  role: 'user' | 'vip' | 'admin';
  generationsToday: number;
  lastGenerationDate: string;
  createdAt: string;
  vipExpiresAt?: string;
}

export interface Review {
  id: string;
  userId: string;
  deviceName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ChangelogEntry {
  id: string;
  version: string;
  title: string;
  description: string;
  features: string[];
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  updateUserRole: (role: 'user' | 'vip' | 'admin') => void;
}
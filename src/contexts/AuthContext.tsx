import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, User } from '../types';
import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  const login = async (username: string, password: string) => {
    try {
      const { data, error } = await supabase
        .from('user_credentials')
        .select('*')
        .eq('username', username)
        .single();

      if (error || !data) {
        throw new Error('Invalid username or password');
      }

      const isValid = await bcrypt.compare(password, data.password_hash);
      if (!isValid) {
        throw new Error('Invalid username or password');
      }

      const userData: User = {
        id: data.user_id,
        username: data.username,
        role: data.role || 'user',
        generationsToday: data.generations_today || 0,
        lastGenerationDate: data.last_generation_date || '',
        createdAt: data.created_at,
        vipExpiresAt: data.vip_expires_at
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      throw error;
    }
  };

  const register = async (username: string, password: string) => {
    try {
      // Check if username already exists
      const { data: existingUser } = await supabase
        .from('user_credentials')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        throw new Error('Username already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = crypto.randomUUID();

      const { error } = await supabase
        .from('user_credentials')
        .insert({
          user_id: userId,
          username,
          password_hash: hashedPassword,
          role: 'user',
          generations_today: 0,
          last_generation_date: new Date().toISOString().split('T')[0]
        });

      if (error) {
        throw new Error('Registration failed');
      }

      // Auto-login after registration
      await login(username, password);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const toggleTheme = () => {
    if (user?.role === 'vip' || user?.role === 'admin') {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    }
  };

  const updateUserRole = (newRole: 'user' | 'vip' | 'admin') => {
    if (user) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    theme,
    toggleTheme,
    updateUserRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
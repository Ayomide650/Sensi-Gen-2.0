import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Crown, Shield, Calendar, Settings, Key } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { User } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    vipUsers: 0,
    newUsersToday: 0,
    activeUsers: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_credentials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const userList: User[] = data.map(u => ({
        id: u.user_id,
        username: u.username,
        role: u.role || 'user',
        generationsToday: u.generations_today || 0,
        lastGenerationDate: u.last_generation_date || '',
        createdAt: u.created_at,
        vipExpiresAt: u.vip_expires_at
      }));

      setUsers(userList);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const totalUsers = userList.length;
      const vipUsers = userList.filter(u => u.role === 'vip').length;
      const newUsersToday = userList.filter(u => 
        u.createdAt.startsWith(today)
      ).length;
      const activeUsers = userList.filter(u => 
        u.lastGenerationDate === today
      ).length;

      setStats({ totalUsers, vipUsers, newUsersToday, activeUsers });
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'user' | 'vip' | 'admin') => {
    try {
      const { error } = await supabase
        .from('user_credentials')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      // Update local state
      setUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Shield className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p>This area is restricted to administrators only.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-white/60">Manage users and system settings</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-400 mr-3" />
              <div>
                <p className="text-white/60 text-sm">Total Users</p>
                <p className="text-white text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center">
              <Crown className="w-8 h-8 text-yellow-400 mr-3" />
              <div>
                <p className="text-white/60 text-sm">VIP Users</p>
                <p className="text-white text-2xl font-bold">{stats.vipUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-green-400 mr-3" />
              <div>
                <p className="text-white/60 text-sm">New Today</p>
                <p className="text-white text-2xl font-bold">{stats.newUsersToday}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center">
              <Settings className="w-8 h-8 text-purple-400 mr-3" />
              <div>
                <p className="text-white/60 text-sm">Active Today</p>
                <p className="text-white text-2xl font-bold">{stats.activeUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">User Management</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4 text-white font-medium">Username</th>
                    <th className="text-left py-3 px-4 text-white font-medium">Role</th>
                    <th className="text-left py-3 px-4 text-white font-medium">Generations</th>
                    <th className="text-left py-3 px-4 text-white font-medium">Joined</th>
                    <th className="text-left py-3 px-4 text-white font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-3 px-4 text-white">{u.username}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.role === 'admin' ? 'bg-red-500/20 text-red-300' :
                          u.role === 'vip' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-gray-500/20 text-gray-300'
                        }`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white/80">{u.generationsToday}</td>
                      <td className="py-3 px-4 text-white/80">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => updateUserRole(u.id, e.target.value as any)}
                          className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                        >
                          <option value="user">User</option>
                          <option value="vip">VIP</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg font-medium transition-all">
                Export User Data
              </button>
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-all">
                Send Notification
              </button>
              <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all">
                System Maintenance
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">System Info</h3>
            <div className="space-y-3 text-white/80">
              <div className="flex justify-between">
                <span>Database Status</span>
                <span className="text-green-400">Online</span>
              </div>
              <div className="flex justify-between">
                <span>API Status</span>
                <span className="text-green-400">Operational</span>
              </div>
              <div className="flex justify-between">
                <span>Cache Status</span>
                <span className="text-green-400">Active</span>
              </div>
              <div className="flex justify-between">
                <span>Last Backup</span>
                <span>2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { X, Key, Crown, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface RoleUpgradeModalProps {
  onClose: () => void;
}

export const RoleUpgradeModal: React.FC<RoleUpgradeModalProps> = ({ onClose }) => {
  const { user, updateUserRole } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      let newRole: 'user' | 'vip' | 'admin' = 'user';

      // Check password and determine role
      if (password === 'VIPAHMED') {
        newRole = 'vip';
      } else if (password === 'ahmed@ibmk') {
        newRole = 'admin';
      } else {
        throw new Error('Invalid password');
      }

      // Update role in database
      const { error } = await supabase
        .from('user_credentials')
        .update({ role: newRole })
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local user state
      updateUserRole(newRole);
      
      alert(`Successfully upgraded to ${newRole.toUpperCase()}!`);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upgrade role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Key className="w-6 h-6 mr-2 text-yellow-400" />
            Role Upgrade
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-300 mb-4">
              Enter the password to upgrade your account role:
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                <Crown className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-yellow-300 font-medium">VIP Access</p>
                  <p className="text-yellow-200 text-sm">Unlimited generations, theme toggle, priority support</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-red-500/10 rounded-lg border border-red-500/30">
                <Shield className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-red-300 font-medium">Admin Access</p>
                  <p className="text-red-200 text-sm">Full system control, user management, analytics</p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleRoleUpgrade} className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Role Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
                  placeholder="Enter role password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !password}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-500 disabled:to-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-all disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Upgrading...
                  </div>
                ) : (
                  'Upgrade Role'
                )}
              </button>
            </div>
          </form>

          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p className="text-blue-300 text-sm">
              💡 <strong>Tip:</strong> Contact the admin if you need access to VIP or Admin features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
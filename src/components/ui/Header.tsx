import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, LogOut, Sun, Moon, MessageCircle, Youtube, Play, Key } from 'lucide-react';
import { RoleUpgradeModal } from './RoleUpgradeModal';

export const Header: React.FC = () => {
  const { user, logout, theme, toggleTheme } = useAuth();
  const [showRoleUpgrade, setShowRoleUpgrade] = useState(false);

  const socialLinks = [
    { 
      icon: Youtube, 
      href: 'https://youtube.com/@firekidffx?si=xiM5a_ZRnk6ecSlM', 
      label: 'YouTube',
      color: 'text-red-400 hover:text-red-300'
    },
    { 
      icon: Play, 
      href: 'https://www.tiktok.com/@firekid846?_t=ZM-8vTQwM6EpQz&_r=1', 
      label: 'TikTok',
      color: 'text-pink-400 hover:text-pink-300'
    },
    { 
      icon: MessageCircle, 
      href: 'https://whatsapp.com/channel/0029VaT1YDxFsn0oKfK81n2R', 
      label: 'WhatsApp',
      color: 'text-green-400 hover:text-green-300'
    },
  ];

  return (
    <>
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-purple-400 mr-3" />
              <h1 className="text-xl font-bold text-white">Sensi-Gen</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Social Links */}
              <div className="hidden md:flex items-center space-x-2">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 transition-colors rounded-lg hover:bg-white/10 ${link.color}`}
                    title={link.label}
                  >
                    <link.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>

              {/* Role Upgrade Button */}
              {user && user.role !== 'admin' && (
                <button
                  onClick={() => setShowRoleUpgrade(true)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium transition-all transform hover:scale-105"
                >
                  <Key className="w-4 h-4" />
                  <span>Login to Role</span>
                </button>
              )}

              {/* VIP Support */}
              {(user?.role === 'vip' || user?.role === 'admin') && (
                <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium hover:from-yellow-600 hover:to-orange-600 transition-all">
                  Support
                </button>
              )}

              {/* Theme Toggle (VIP only) */}
              {(user?.role === 'vip' || user?.role === 'admin') && (
                <button
                  onClick={toggleTheme}
                  className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              )}

              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-white font-medium">{user?.username}</p>
                  <p className={`text-xs ${
                    user?.role === 'admin' ? 'text-red-400' :
                    user?.role === 'vip' ? 'text-yellow-400' : 'text-gray-400'
                  }`}>
                    {user?.role?.toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-white/60 hover:text-red-400 transition-colors rounded-lg hover:bg-white/10"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Role Upgrade Modal */}
      {showRoleUpgrade && (
        <RoleUpgradeModal onClose={() => setShowRoleUpgrade(false)} />
      )}
    </>
  );
};
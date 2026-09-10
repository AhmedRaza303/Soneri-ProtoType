/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, Grid, Bell, User } from 'lucide-react';
import { ScreenId } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface BottomNavProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  unreadCount = 0,
}) => {
  const { isDark } = useTheme();

  const navItems = [
    {
      id: 'dashboard' as ScreenId,
      label: 'Home',
      icon: Home,
    },
    {
      id: 'modules' as ScreenId,
      label: 'Modules',
      icon: Grid,
      matches: (s: ScreenId) =>
        s === 'modules' ||
        s.startsWith('admin') ||
        s.startsWith('module_') ||
        s === 'static_preview',
    },
    {
      id: 'notifications' as ScreenId,
      label: 'Alerts',
      icon: Bell,
      badge: unreadCount,
    },
    {
      id: 'profile' as ScreenId,
      label: 'Profile',
      icon: User,
    },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      className={`fixed bottom-0 left-0 right-0 z-30 backdrop-blur-md transition-colors duration-200 border-t ${
        isDark
          ? 'bg-[#0b101e]/95 border-slate-800/80'
          : 'bg-white/95 border-slate-200/90 shadow-lg shadow-slate-900/5'
      }`}
      aria-label="Main Navigation"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 px-2 py-1.5">
        {navItems.map((item) => {
          const isActive = item.matches
            ? item.matches(currentScreen)
            : currentScreen === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-150 active:scale-95 cursor-pointer ${
                isActive
                  ? isDark
                    ? 'text-indigo-400 font-bold'
                    : 'text-slate-950 font-bold'
                  : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? 'scale-110 stroke-[2.25]' : 'stroke-[1.75]'
                  }`}
                />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-[9px] font-black text-white flex items-center justify-center border-2 border-slate-900">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                ) : null}
              </div>
              <span
                className={`text-[10px] sm:text-[11px] mt-0.5 tracking-tight transition-colors ${
                  isActive
                    ? isDark
                      ? 'text-indigo-300 font-bold'
                      : 'text-slate-950 font-bold'
                    : isDark
                    ? 'text-slate-400'
                    : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span
                  className={`absolute bottom-0 w-1.5 h-1.5 rounded-full ${
                    isDark ? 'bg-indigo-400 shadow-xs shadow-indigo-400' : 'bg-slate-900'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

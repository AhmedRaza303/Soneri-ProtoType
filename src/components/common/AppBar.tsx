/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Menu, ArrowLeft, Bell, Sun, Moon } from 'lucide-react';
import { ScreenId } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface AppBarProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  onMenuClick?: () => void;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
  unreadCount?: number;
  rightAction?: React.ReactNode;
  currentScreen?: ScreenId;
  showThemeToggle?: boolean;
}

export const AppBar: React.FC<AppBarProps> = ({
  title = 'SONERI ERP',
  subtitle,
  showBack = false,
  onBack,
  onMenuClick,
  onNotificationsClick,
  onProfileClick,
  unreadCount = 0,
  rightAction,
  showThemeToggle = true,
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header
      className={`sticky top-0 z-30 w-full backdrop-blur-md px-3.5 py-2.5 sm:px-4 sm:py-3 select-none transition-colors duration-200 border-b ${
        isDark
          ? 'bg-[#0b101e]/95 border-slate-800/80 text-white'
          : 'bg-white/95 border-slate-200/90 text-slate-900 shadow-2xs'
      }`}
    >
      <div className="flex items-center justify-between gap-2 max-w-5xl mx-auto">
        {/* Left Side: Back button or Menu toggle */}
        <div className="flex items-center gap-2.5 min-w-0">
          {showBack ? (
            <button
              id="appbar-back-button"
              type="button"
              onClick={onBack}
              className={`p-2 -ml-1.5 rounded-xl transition-all active:scale-95 cursor-pointer ${
                isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/80 active:bg-slate-800'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 active:bg-slate-200'
              }`}
              aria-label="Navigate Back"
            >
              <ArrowLeft className="w-4.5 h-4.5" />
            </button>
          ) : (
            <button
              id="appbar-menu-button"
              type="button"
              onClick={onMenuClick}
              className={`p-2 -ml-1.5 rounded-xl transition-all active:scale-95 cursor-pointer ${
                isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/80 active:bg-slate-800'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 active:bg-slate-200'
              }`}
              aria-label="Open Navigation Drawer"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>
          )}

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              {!showBack && (
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs shadow-xs shrink-0 ${
                    isDark
                      ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-indigo-950/40'
                      : 'bg-slate-900 text-white'
                  }`}
                >
                  S
                </div>
              )}
              <h1
                className={`text-sm sm:text-base font-bold tracking-tight truncate leading-tight ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                }`}
              >
                {title}
              </h1>
            </div>
            {subtitle && (
              <span
                className={`text-[10px] sm:text-[11px] font-medium tracking-wide truncate ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {subtitle}
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Custom action, Theme toggle, Notification & Profile */}
        <div className="flex items-center gap-1.5 shrink-0">
          {rightAction}

          {showThemeToggle && (
            <button
              id="appbar-theme-toggle-btn"
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all active:scale-90 cursor-pointer ${
                isDark
                  ? 'text-amber-400 hover:bg-slate-800/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
            >
              {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5 text-indigo-600" />}
            </button>
          )}

          {onNotificationsClick && (
            <button
              id="appbar-notifications-button"
              type="button"
              onClick={onNotificationsClick}
              className={`relative p-2 rounded-xl transition-all active:scale-95 cursor-pointer ${
                isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              aria-label="View Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-[9px] font-black text-white flex items-center justify-center border-2 border-slate-900">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          )}

          {onProfileClick && (
            <button
              id="appbar-profile-button"
              type="button"
              onClick={onProfileClick}
              className="p-1 rounded-full active:scale-95 transition-all cursor-pointer"
              aria-label="User Profile"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ring-2 ${
                  isDark
                    ? 'bg-indigo-600/90 text-white ring-indigo-500/30'
                    : 'bg-slate-800 text-white ring-slate-200'
                }`}
              >
                AR
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

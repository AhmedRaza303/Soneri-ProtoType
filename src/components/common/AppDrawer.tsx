/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Home,
  Grid,
  ShieldCheck,
  Landmark,
  Ship,
  ShoppingBag,
  TrendingUp,
  BarChart3,
  Megaphone,
  Layers,
  Bell,
  User,
  LogOut,
  ChevronRight,
  Users as UsersIcon,
  Sliders,
  Sun,
  Moon,
} from 'lucide-react';
import { ScreenId } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenId) => void;
  onLogoutClick: () => void;
  currentScreen: ScreenId;
}

export const AppDrawer: React.FC<AppDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onLogoutClick,
  currentScreen,
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  const handleNav = (screen: ScreenId) => {
    onNavigate(screen);
    onClose();
  };

  const navGroups = [
    {
      label: 'Main',
      items: [
        {
          id: 'dashboard' as ScreenId,
          label: 'Dashboard',
          icon: Home,
          subItems: [
            { id: 'dashboard' as ScreenId, label: 'Overview', icon: BarChart3 },
            { id: 'dashboard_export' as ScreenId, label: 'Export Dashboard', icon: Ship },
            { id: 'dashboard_purchase' as ScreenId, label: 'Purchase Dashboard', icon: ShoppingBag },
            { id: 'dashboard_marketing' as ScreenId, label: 'Marketing Dashboard', icon: Megaphone },
            { id: 'dashboard_finance' as ScreenId, label: 'Finance Dashboard', icon: Landmark },
          ],
        },
        { id: 'modules' as ScreenId, label: 'All Modules', icon: Grid },
      ],
    },
    {
      label: 'Core ERP',
      items: [
        {
          id: 'admin' as ScreenId,
          label: 'Administrator',
          icon: ShieldCheck,
          subItems: [
            { id: 'admin_users' as ScreenId, label: 'Users', icon: UsersIcon },
            { id: 'admin_values' as ScreenId, label: 'Manage Values', icon: Sliders },
          ],
        },
        { id: 'module_finance' as ScreenId, label: 'Finance', icon: Landmark },
        { id: 'module_export' as ScreenId, label: 'Export', icon: Ship },
        { id: 'module_purchase' as ScreenId, label: 'Purchase', icon: ShoppingBag },
        { id: 'module_sales' as ScreenId, label: 'Sales', icon: TrendingUp },
        { id: 'module_reports' as ScreenId, label: 'Reports', icon: BarChart3 },
        { id: 'module_marketing' as ScreenId, label: 'Marketing & Exhibitions', icon: Megaphone },
        { id: 'module_catalog' as ScreenId, label: 'Catalog', icon: Layers },
      ],
    },
    {
      label: 'Preferences',
      items: [
        { id: 'notifications' as ScreenId, label: 'Notifications', icon: Bell },
        { id: 'profile' as ScreenId, label: 'My Profile & Settings', icon: User },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Sheet */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={`relative w-4/5 max-w-xs h-full shadow-2xl flex flex-col z-10 transition-colors ${
              isDark ? 'bg-[#0d1322] text-slate-100' : 'bg-white text-slate-900'
            }`}
          >
            {/* Drawer Header */}
            <div
              className={`p-5 flex flex-col justify-between relative transition-colors ${
                isDark
                  ? 'bg-[#090d16] text-white border-b border-slate-800'
                  : 'bg-slate-900 text-white'
              }`}
            >
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close navigation drawer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-xl font-black text-lg flex items-center justify-center shadow-md ${
                    isDark
                      ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white'
                      : 'bg-white text-slate-950'
                  }`}
                >
                  S
                </div>
                <div>
                  <h2 className="text-base font-extrabold tracking-tight">SONERI ERP</h2>
                  <p className="text-[11px] text-slate-400 font-medium">Business Management System</p>
                </div>
              </div>

              {/* User Card */}
              <div
                onClick={() => handleNav('profile')}
                className="flex items-center gap-3 pt-3 border-t border-slate-800/80 cursor-pointer hover:opacity-90 transition-opacity"
              >
                <div className="w-9 h-9 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold ring-2 ring-white/10">
                  AR
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold truncate">Ahmed Raza</p>
                  <p className="text-[10px] text-slate-400 truncate">Administrator</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>

            {/* Scrollable Navigation List */}
            <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
              {/* Quick Theme Toggle Row */}
              <div
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                  isDark
                    ? 'bg-[#12192c] border-slate-800 text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isDark ? (
                    <Moon className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-500" />
                  )}
                  <span className="text-xs font-semibold">
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all active:scale-95 cursor-pointer ${
                    isDark
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  Switch
                </button>
              </div>

              {navGroups.map((group) => (
                <div key={group.label} className="space-y-1">
                  <h3
                    className={`px-3 text-[10px] font-bold uppercase tracking-wider ${
                      isDark ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    {group.label}
                  </h3>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentScreen === item.id;

                    return (
                      <div key={item.id} className="space-y-1">
                        <button
                          type="button"
                          onClick={() => handleNav(item.id)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isActive
                              ? isDark
                                ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-950/40'
                                : 'bg-slate-900 text-white shadow-xs'
                              : isDark
                              ? 'text-slate-300 hover:bg-[#162035]'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon
                              className={`w-4 h-4 shrink-0 ${
                                isActive
                                  ? 'text-white'
                                  : isDark
                                  ? 'text-slate-400'
                                  : 'text-slate-500'
                              }`}
                            />
                            <span className="truncate">{item.label}</span>
                          </div>
                          <ChevronRight
                            className={`w-3.5 h-3.5 ${
                              isActive
                                ? 'text-white/80'
                                : isDark
                                ? 'text-slate-500'
                                : 'text-slate-400'
                            }`}
                          />
                        </button>

                        {item.subItems && (
                          <div
                            className={`pl-6 pr-1 space-y-0.5 border-l ml-4 py-1 ${
                              isDark ? 'border-slate-800' : 'border-slate-200'
                            }`}
                          >
                            {item.subItems.map((sub) => {
                              const SubIcon = sub.icon;
                              const isSubActive = currentScreen === sub.id;
                              return (
                                <button
                                  key={sub.id}
                                  type="button"
                                  onClick={() => handleNav(sub.id)}
                                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                    isSubActive
                                      ? isDark
                                        ? 'bg-indigo-500/20 text-indigo-300 font-semibold'
                                        : 'bg-slate-100 text-slate-900 font-semibold'
                                      : isDark
                                      ? 'text-slate-400 hover:text-slate-200 hover:bg-[#151d30]'
                                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                  }`}
                                >
                                  <SubIcon
                                    className={`w-3.5 h-3.5 ${
                                      isSubActive
                                        ? isDark
                                          ? 'text-indigo-400'
                                          : 'text-slate-900'
                                        : isDark
                                        ? 'text-slate-500'
                                        : 'text-slate-400'
                                    }`}
                                  />
                                  <span className="truncate">{sub.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Drawer Footer: Logout */}
            <div
              className={`p-3 border-t transition-colors ${
                isDark
                  ? 'border-slate-800 bg-[#090d16]'
                  : 'border-slate-200/90 bg-slate-50'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogoutClick();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 active:bg-rose-500/20 transition-colors cursor-pointer`}
              >
                <div className="flex items-center gap-2.5">
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-rose-400" />
              </button>
              <p
                className={`text-[10px] text-center mt-2 font-mono ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                SONERI ERP v1.0.0 (Mobile Prototype)
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

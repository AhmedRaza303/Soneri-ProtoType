/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Edit3, Power, PowerOff, Mail, Shield, Eye, Building2 } from 'lucide-react';
import { User, SystemValue } from '../../types';
import { StatusBadge } from './StatusBadge';
import { useTheme } from '../../context/ThemeContext';

interface UserCardProps {
  user: User;
  onModify: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onView?: (user: User) => void;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onModify,
  onToggleStatus,
  onView,
}) => {
  const { isDark } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const isActive = user.status === 'Active';

  return (
    <div
      id={`user-card-${user.id}`}
      className={`rounded-2xl p-3.5 sm:p-4 border transition-all relative flex flex-col justify-between select-none ${
        isDark
          ? 'bg-[#111726] border-slate-800/80 shadow-xs'
          : 'bg-white border-slate-200/90 shadow-2xs hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* User Info */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl shrink-0 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-xs ${
              user.avatarColor || (isDark ? 'bg-indigo-600' : 'bg-slate-800')
            }`}
          >
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <h4
              className={`text-xs sm:text-sm font-bold leading-tight truncate ${
                isDark ? 'text-slate-100' : 'text-slate-900'
              }`}
            >
              {user.fullName}
            </h4>

            <p className="text-[10px] sm:text-[11px] font-mono text-slate-400 mt-0.5 truncate">
              @{user.username}
            </p>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
              <Mail className="w-3 h-3 shrink-0 text-slate-400" />
              <span className="truncate">{user.email}</span>
            </div>
          </div>
        </div>

        {/* 3-dots Menu Button */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            id={`user-menu-btn-${user.id}`}
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
            }`}
            aria-label="User actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div
              className={`absolute right-0 top-8 z-30 w-36 rounded-xl shadow-xl border py-1 text-xs select-none ${
                isDark
                  ? 'bg-[#151c2f] border-slate-750 text-slate-200 shadow-slate-950/60'
                  : 'bg-white border-slate-200/90 text-slate-700'
              }`}
            >
              {onView && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onView(user);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-left cursor-pointer ${
                    isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>View</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onModify(user);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left cursor-pointer ${
                  isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onToggleStatus(user);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left cursor-pointer ${
                  isActive
                    ? 'text-rose-500 hover:bg-rose-500/10'
                    : 'text-emerald-500 hover:bg-emerald-500/10'
                }`}
              >
                {isActive ? (
                  <>
                    <PowerOff className="w-3.5 h-3.5" />
                    <span>Deactivate</span>
                  </>
                ) : (
                  <>
                    <Power className="w-3.5 h-3.5" />
                    <span>Activate</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Badges */}
      <div
        className={`mt-3 pt-2.5 border-t flex flex-wrap items-center justify-between gap-2 ${
          isDark ? 'border-slate-800/80' : 'border-slate-100'
        }`}
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <div
            className={`flex items-center gap-1 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-lg border ${
              isDark
                ? 'bg-slate-800/60 text-slate-300 border-slate-750'
                : 'bg-slate-100/90 text-slate-700 border-slate-200/60'
            }`}
          >
            <Shield className="w-3 h-3 text-slate-400" />
            <span>{user.role}</span>
          </div>

          {user.department && (
            <div
              className={`flex items-center gap-1 text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-lg border ${
                isDark
                  ? 'bg-slate-900/60 text-slate-400 border-slate-800'
                  : 'bg-slate-50 text-slate-600 border-slate-200/60'
              }`}
            >
              <Building2 className="w-3 h-3 text-slate-400" />
              <span>{user.department}</span>
            </div>
          )}
        </div>

        <StatusBadge status={user.status} size="sm" />
      </div>
    </div>
  );
};

interface ValueCardProps {
  systemValue: SystemValue;
  onModify: (val: SystemValue) => void;
  onToggleStatus: (val: SystemValue) => void;
}

export const ValueCard: React.FC<ValueCardProps> = ({
  systemValue,
  onModify,
  onToggleStatus,
}) => {
  const { isDark } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const isActive = systemValue.status === 'Active';

  return (
    <div
      id={`value-card-${systemValue.id}`}
      className={`rounded-2xl p-3.5 sm:p-4 border transition-all relative select-none ${
        isDark
          ? 'bg-[#111726] border-slate-800/80 shadow-xs'
          : 'bg-white border-slate-200/90 shadow-2xs hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md border ${
                isDark
                  ? 'bg-slate-800/80 text-indigo-300 border-slate-700/60'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {systemValue.category}
            </span>
          </div>

          <h4
            className={`text-xs sm:text-sm font-bold leading-tight truncate ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}
          >
            {systemValue.name}
          </h4>
          <p
            className={`text-[11px] sm:text-xs mt-1 line-clamp-2 leading-relaxed ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {systemValue.description}
          </p>
        </div>

        {/* 3-dots Menu Button */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            id={`value-menu-btn-${systemValue.id}`}
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isDark
                ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
            }`}
            aria-label="Value actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div
              className={`absolute right-0 top-8 z-20 w-36 rounded-xl shadow-xl border py-1 text-xs select-none ${
                isDark
                  ? 'bg-[#151c2f] border-slate-750 text-slate-200'
                  : 'bg-white border-slate-200/90 text-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onModify(systemValue);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left cursor-pointer ${
                  isDark ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                <span>Modify</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onToggleStatus(systemValue);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left cursor-pointer ${
                  isActive
                    ? 'text-rose-500 hover:bg-rose-500/10'
                    : 'text-emerald-500 hover:bg-emerald-500/10'
                }`}
              >
                {isActive ? (
                  <>
                    <PowerOff className="w-3.5 h-3.5" />
                    <span>Deactivate</span>
                  </>
                ) : (
                  <>
                    <Power className="w-3.5 h-3.5" />
                    <span>Activate</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className={`mt-3 pt-2.5 border-t flex items-center justify-between ${
          isDark ? 'border-slate-800/80' : 'border-slate-100'
        }`}
      >
        <span className="text-[10px] text-slate-400 font-mono">
          {systemValue.updatedAt ? `Updated ${systemValue.updatedAt}` : 'Master Record'}
        </span>
        <StatusBadge status={systemValue.status} size="sm" />
      </div>
    </div>
  );
};

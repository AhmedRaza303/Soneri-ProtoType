/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserStatus, ValueStatus } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface StatusBadgeProps {
  status: UserStatus | ValueStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const { isDark } = useTheme();
  const isActive = (status ?? '').toLowerCase() === 'active';

  return (
    <span
      id={`badge-status-${status.toLowerCase()}`}
      className={`inline-flex items-center gap-1.5 font-bold rounded-full tracking-wide uppercase transition-colors select-none ${
        size === 'sm' ? 'text-[9px] px-2 py-0.5' : 'text-[11px] px-2.5 py-0.5'
      } ${
        isActive
          ? isDark
            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 ring-1 ring-emerald-500/20'
            : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 ring-1 ring-emerald-500/10'
          : isDark
          ? 'bg-slate-800/80 text-slate-400 border border-slate-700/60 ring-1 ring-slate-700/20'
          : 'bg-slate-100 text-slate-600 border border-slate-200 ring-1 ring-slate-400/10'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isActive
            ? isDark
              ? 'bg-emerald-400 shadow-xs shadow-emerald-400 animate-pulse'
              : 'bg-emerald-500 animate-pulse'
            : isDark
            ? 'bg-slate-500'
            : 'bg-slate-400'
        }`}
      />
      {status}
    </span>
  );
};

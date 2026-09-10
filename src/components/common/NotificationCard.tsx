/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bell, CheckCheck, Clock } from 'lucide-react';
import { NotificationItem } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface NotificationCardProps {
  notification: NotificationItem;
  onMarkRead?: (id: string) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onMarkRead,
}) => {
  const { isDark } = useTheme();

  return (
    <div
      id={`notif-card-${notification.id}`}
      onClick={() => onMarkRead?.(notification.id)}
      className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer select-none relative ${
        notification.isRead
          ? isDark
            ? 'bg-[#111726]/60 border-slate-800/80 hover:border-slate-700'
            : 'bg-white border-slate-200/80 hover:border-slate-300'
          : isDark
          ? 'bg-[#162035] border-indigo-500/40 shadow-xs ring-1 ring-indigo-500/20'
          : 'bg-slate-50/90 border-slate-300 shadow-xs'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-xl shrink-0 ${
            notification.priority === 'high'
              ? isDark
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-rose-50 text-rose-600 border border-rose-200/60'
              : notification.isRead
              ? isDark
                ? 'bg-slate-800 text-slate-400'
                : 'bg-slate-100 text-slate-500'
              : isDark
              ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-950/50'
              : 'bg-slate-900 text-white shadow-xs'
          }`}
        >
          <Bell className="w-4 h-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span
              className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                isDark
                  ? 'bg-slate-800 text-indigo-300 border border-slate-700'
                  : 'bg-slate-200/70 text-slate-700'
              }`}
            >
              {notification.category}
            </span>
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-400">
              <Clock className="w-3 h-3" />
              <span>{notification.timeAgo}</span>
            </div>
          </div>

          <h4
            className={`text-xs sm:text-sm leading-snug truncate ${
              notification.isRead
                ? isDark
                  ? 'font-medium text-slate-300'
                  : 'font-medium text-slate-800'
                : isDark
                ? 'font-bold text-white'
                : 'font-bold text-slate-950'
            }`}
          >
            {notification.title}
          </h4>

          <p
            className={`text-[11px] sm:text-xs mt-1 line-clamp-2 leading-relaxed ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {notification.description}
          </p>

          {!notification.isRead && (
            <div
              className={`mt-2.5 flex items-center justify-between text-[10px] sm:text-[11px] font-semibold ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Unread
              </span>
              <span
                className={`flex items-center gap-1 ${
                  isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Tap to mark read
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

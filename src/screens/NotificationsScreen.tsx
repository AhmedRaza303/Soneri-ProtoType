/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bell, CheckCheck, Filter } from 'lucide-react';
import { AppBar } from '../components/common/AppBar';
import { NotificationCard } from '../components/common/NotificationCard';
import { EmptyState } from '../components/common/SearchField';
import { NotificationItem } from '../types';

interface NotificationsScreenProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onOpenDrawer: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onOpenDrawer,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  return (
    <div className="min-h-full pb-24 bg-slate-50/60">
      <AppBar
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread alerts` : 'All alerts caught up'}
        onMenuClick={onOpenDrawer}
        unreadCount={unreadCount}
      />

      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4">
        {/* Top Controls */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === 'unread'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="text-xs font-semibold text-slate-800 hover:text-slate-950 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notif) => (
              <NotificationCard
                key={notif.id}
                notification={notif}
                onMarkRead={onMarkRead}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Bell className="w-8 h-8 text-slate-400" />}
            title="No Notifications"
            description={
              filter === 'unread'
                ? 'You have read all pending enterprise alerts.'
                : 'No notification records in system.'
            }
          />
        )}
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Landmark,
  Ship,
  ShoppingBag,
  TrendingUp,
  BarChart3,
  Megaphone,
  Layers,
  ChevronRight,
  Search,
} from 'lucide-react';
import { AppBar } from '../components/common/AppBar';
import { SearchField } from '../components/common/SearchField';
import { ERP_MODULES } from '../data/mockData';
import { ScreenId } from '../types';

interface ModulesScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenDrawer: () => void;
  unreadNotificationsCount: number;
}

const ICON_MAP = {
  ShieldCheck,
  Landmark,
  Ship,
  ShoppingBag,
  TrendingUp,
  BarChart3,
  Megaphone,
  Layers,
};

export const ModulesScreen: React.FC<ModulesScreenProps> = ({
  onNavigate,
  onOpenDrawer,
  unreadNotificationsCount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredModules = ERP_MODULES.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-full pb-24 bg-slate-50/60">
      <AppBar
        title="All Modules"
        subtitle="Enterprise Management Suites"
        onMenuClick={onOpenDrawer}
        onNotificationsClick={() => onNavigate('notifications')}
        onProfileClick={() => onNavigate('profile')}
        unreadCount={unreadNotificationsCount}
      />

      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-4">
        {/* Search */}
        <SearchField
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Filter modules by name or function..."
        />

        {/* Modules List */}
        <div className="space-y-3">
          {filteredModules.map((module) => {
            const IconComponent =
              ICON_MAP[module.iconName as keyof typeof ICON_MAP] || Layers;
            const targetScreen: ScreenId =
              module.id === 'admin'
                ? 'admin'
                : (`module_${module.id}` as ScreenId);

            return (
              <div
                key={module.id}
                id={`all-module-item-${module.id}`}
                onClick={() => onNavigate(targetScreen)}
                className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:border-slate-300 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:bg-slate-800 transition-colors">
                    <IconComponent className="w-6 h-6 stroke-[2]" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 leading-tight truncate group-hover:text-slate-950">
                        {module.name}
                      </h3>
                      {module.badge && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {module.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1 leading-relaxed">
                      {module.description}
                    </p>
                    {module.items && (
                      <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                        {module.items.length} Workstreams
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-2 rounded-full text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all shrink-0">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  ChevronRight,
  ShieldCheck,
  Landmark,
  Ship,
  ShoppingBag,
  TrendingUp,
  BarChart3,
  Megaphone,
  Layers,
  LucideIcon,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck,
  Landmark,
  Ship,
  ShoppingBag,
  TrendingUp,
  BarChart3,
  Megaphone,
  Layers,
};

interface ModuleCardProps {
  id: string;
  name: string;
  description: string;
  iconName: string;
  badge?: string;
  onClick: () => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  id,
  name,
  description,
  iconName,
  badge,
  onClick,
}) => {
  const { isDark } = useTheme();
  const IconComponent = ICON_MAP[iconName] || Layers;

  return (
    <button
      id={`module-card-${id}`}
      type="button"
      onClick={onClick}
      className={`group text-left p-3.5 sm:p-4 rounded-2xl border active:scale-[0.98] transition-all duration-150 flex flex-col justify-between cursor-pointer w-full select-none ${
        isDark
          ? 'bg-[#111726] border-slate-800/80 hover:bg-[#161f33] hover:border-slate-700 shadow-xs'
          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-sm shadow-2xs'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-xs transition-colors ${
              isDark
                ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-indigo-950/40'
                : 'bg-slate-900 text-white group-hover:bg-slate-800'
            }`}
          >
            <IconComponent className="w-5 h-5 stroke-[2]" />
          </div>
          {badge ? (
            <span
              className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                isDark
                  ? 'bg-slate-800/80 text-indigo-300 border-slate-700'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {badge}
            </span>
          ) : (
            <div
              className={`p-1 rounded-full group-hover:translate-x-0.5 transition-all ${
                isDark ? 'text-slate-500 group-hover:text-slate-200' : 'text-slate-400 group-hover:text-slate-900'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </div>
          )}
        </div>

        <h3
          className={`text-xs sm:text-sm font-bold leading-snug truncate ${
            isDark ? 'text-slate-100' : 'text-slate-900'
          }`}
        >
          {name}
        </h3>
        <p
          className={`text-[11px] sm:text-xs mt-1 line-clamp-2 leading-relaxed ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          {description}
        </p>
      </div>

      <div
        className={`mt-3 pt-2 border-t flex items-center justify-between text-[10px] sm:text-[11px] font-semibold transition-colors ${
          isDark
            ? 'border-slate-800/80 text-slate-400 group-hover:text-indigo-400'
            : 'border-slate-100 text-slate-500 group-hover:text-slate-900'
        }`}
      >
        <span>Open Module</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </div>
    </button>
  );
};

interface MenuTileProps {
  id?: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string;
  onClick: () => void;
  destructive?: boolean;
}

export const MenuTile: React.FC<MenuTileProps> = ({
  id,
  title,
  subtitle,
  icon,
  badge,
  onClick,
  destructive = false,
}) => {
  const { isDark } = useTheme();

  return (
    <button
      id={id || `menu-tile-${title.toLowerCase().replace(/\s+/g, '-')}`}
      type="button"
      onClick={onClick}
      className={`w-full text-left p-3.5 rounded-2xl border active:scale-[0.99] transition-all flex items-center justify-between gap-3 cursor-pointer select-none shadow-2xs ${
        destructive
          ? isDark
            ? 'bg-[#1a131b] border-rose-950/60 hover:bg-rose-950/30'
            : 'bg-white border-slate-200/80 hover:bg-rose-50/50 hover:border-rose-200'
          : isDark
          ? 'bg-[#111726] border-slate-800/80 hover:bg-[#161f33]'
          : 'bg-white border-slate-200/80 hover:bg-slate-50/70 hover:border-slate-300'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <div
            className={`p-2 rounded-xl shrink-0 ${
              destructive
                ? isDark
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                  : 'bg-rose-50 text-rose-600'
                : isDark
                ? 'bg-slate-800 text-slate-300 border border-slate-700/60'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <p
            className={`text-xs sm:text-sm font-bold truncate ${
              destructive
                ? isDark
                  ? 'text-rose-400'
                  : 'text-rose-600'
                : isDark
                ? 'text-slate-100'
                : 'text-slate-900'
            }`}
          >
            {title}
          </p>
          {subtitle && (
            <p
              className={`text-[11px] truncate mt-0.5 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {badge && (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isDark
                ? 'bg-slate-800 text-indigo-300 border-slate-700'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {badge}
          </span>
        )}
        <ChevronRight
          className={`w-4 h-4 ${
            destructive
              ? 'text-rose-400'
              : isDark
              ? 'text-slate-500'
              : 'text-slate-400'
          }`}
        />
      </div>
    </button>
  );
};

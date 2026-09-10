/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SearchFieldProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFilterClick?: () => void;
  showFilterButton?: boolean;
  filterActive?: boolean;
}

export const SearchField: React.FC<SearchFieldProps> = ({
  id = 'search-input',
  value,
  onChange,
  placeholder = 'Search...',
  onFilterClick,
  showFilterButton = false,
  filterActive = false,
}) => {
  const { isDark } = useTheme();

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="relative flex-1 rounded-xl shadow-2xs">
        <div
          className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
            isDark ? 'text-slate-400' : 'text-slate-400'
          }`}
        >
          <Search className="w-4 h-4" />
        </div>
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`block w-full pl-9 pr-8 py-2 rounded-xl text-xs sm:text-sm transition-all border ${
            isDark
              ? 'bg-[#131929] text-slate-100 placeholder:text-slate-500 border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
              : 'bg-white text-slate-900 placeholder:text-slate-400 border-slate-200 hover:border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/15'
          }`}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className={`absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-600'
            }`}
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {showFilterButton && (
        <button
          type="button"
          onClick={onFilterClick}
          className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center shrink-0 active:scale-95 ${
            filterActive
              ? isDark
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-xs shadow-indigo-950/40'
                : 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : isDark
              ? 'bg-[#131929] text-slate-300 border-slate-800 hover:bg-[#182136]'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
          aria-label="Filter"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  const { isDark } = useTheme();

  return (
    <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3.5 ${
          isDark ? 'bg-[#131929] text-slate-400 border border-slate-800' : 'bg-slate-100 text-slate-500'
        }`}
      >
        {icon || <Search className="w-6 h-6" />}
      </div>
      <h3 className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
        {title}
      </h3>
      <p className={`text-xs max-w-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className={`mt-4 px-4 py-2 text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer ${
            isDark
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-950/40'
              : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
          }`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SummaryCardProps {
  id?: string;
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  subtext?: string;
  icon?: React.ReactNode;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  id,
  label,
  value,
  change,
  isPositive,
  subtext,
  icon,
}) => {
  const { isDark } = useTheme();

  return (
    <div
      id={id || `summary-card-${label.toLowerCase().replace(/\s+/g, '-')}`}
      className={`rounded-2xl p-3.5 sm:p-4 border transition-all flex flex-col justify-between select-none ${
        isDark
          ? 'bg-[#111726] border-slate-800/80 shadow-xs'
          : 'bg-white border-slate-200/90 shadow-2xs hover:border-slate-300'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-[11px] font-bold uppercase tracking-wider truncate ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}
        >
          {label}
        </span>
        {icon && (
          <div
            className={`p-1.5 rounded-xl border ${
              isDark
                ? 'bg-[#161f33] text-indigo-400 border-slate-800'
                : 'bg-slate-50 text-slate-700 border-slate-100'
            }`}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="mt-2">
        <div
          className={`text-lg sm:text-xl font-black tracking-tight ${
            isDark ? 'text-slate-100' : 'text-slate-900'
          }`}
        >
          {value}
        </div>

        {(change || subtext) && (
          <div className="mt-1 flex items-center justify-between text-[11px]">
            {subtext && (
              <span
                className={`truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
              >
                {subtext}
              </span>
            )}
            {change && (
              <span
                className={`inline-flex items-center text-[10px] sm:text-[11px] font-bold shrink-0 ml-1.5 ${
                  isPositive === true
                    ? isDark
                      ? 'text-emerald-400'
                      : 'text-emerald-600'
                    : isPositive === false
                    ? isDark
                      ? 'text-rose-400'
                      : 'text-rose-600'
                    : isDark
                    ? 'text-slate-400'
                    : 'text-slate-500'
                }`}
              >
                {isPositive === true ? (
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                ) : isPositive === false ? (
                  <ArrowDownRight className="w-3 h-3 mr-0.5" />
                ) : (
                  <Minus className="w-3 h-3 mr-0.5" />
                )}
                {change}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

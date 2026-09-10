/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Attractive mobile-first page chrome for the Flutter ERP prototype.
 */

import React from 'react';
import { ChevronLeft, Printer, Pencil, ImageOff } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { StatusPill } from './DataListShell';

export const MobilePage: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const { isDark } = useTheme();
  return (
    <div
      className={`min-h-full pb-28 ${
        isDark
          ? 'bg-[#070d14] text-slate-100'
          : 'bg-[linear-gradient(180deg,#eef6f8_0%,#f5f7fa_28%,#f8fafc_100%)] text-slate-900'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const MobileHeader: React.FC<{
  title: string;
  subtitle?: string;
  status?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
}> = ({ title, subtitle, status, onBack, actions }) => {
  const { isDark } = useTheme();
  return (
    <div
      className={`sticky top-0 z-20 border-b backdrop-blur-xl ${
        isDark
          ? 'bg-[#0b1420]/92 border-slate-800/80'
          : 'bg-white/90 border-slate-200/70 shadow-[0_1px_0_rgba(15,43,60,0.04)]'
      }`}
    >
      <div className="px-3.5 sm:px-5 py-3 flex items-start gap-2.5">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className={`mt-0.5 p-2 rounded-xl shrink-0 cursor-pointer transition-colors ${
              isDark
                ? 'bg-slate-800/80 text-slate-200 hover:bg-slate-700'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1
              className={`text-base sm:text-lg font-extrabold tracking-tight truncate ${
                isDark ? 'text-white' : 'text-[#0f2b3c]'
              }`}
            >
              {title}
            </h1>
            {status && <StatusPill status={status} />}
          </div>
          {subtitle && (
            <p className={`text-[11px] sm:text-xs mt-0.5 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-1.5 shrink-0">{actions}</div>}
      </div>
    </div>
  );
};

export const HeaderIconBtn: React.FC<{
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'soft';
  icon?: 'print' | 'edit';
}> = ({ label, onClick, variant = 'primary', icon }) => {
  const { isDark } = useTheme();
  const Icon = icon === 'edit' ? Pencil : Printer;
  const base =
    'inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-[11px] font-bold cursor-pointer transition-all active:scale-[0.98]';
  const styles =
    variant === 'primary'
      ? isDark
        ? 'bg-teal-600 text-white hover:bg-teal-500 shadow-sm shadow-teal-950/40'
        : 'bg-[#0f2b3c] text-white hover:bg-[#163a50] shadow-sm shadow-slate-900/10'
      : variant === 'soft'
      ? isDark
        ? 'bg-slate-800 text-slate-200 border border-slate-700'
        : 'bg-white text-slate-700 border border-slate-200'
      : isDark
      ? 'text-slate-300 hover:bg-slate-800'
      : 'text-slate-600 hover:bg-slate-100';

  return (
    <button type="button" onClick={onClick} className={`${base} ${styles}`} title={label}>
      <Icon className="w-3.5 h-3.5" />
      <span className="hidden xs:inline sm:inline">{label}</span>
    </button>
  );
};

export const SoftCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}> = ({ children, className = '', padding = true }) => {
  const { isDark } = useTheme();
  return (
    <div
      className={`rounded-2xl sm:rounded-3xl border overflow-hidden ${
        isDark
          ? 'bg-[#101a27] border-slate-800/90 shadow-[0_8px_30px_rgba(0,0,0,0.25)]'
          : 'bg-white/95 border-white shadow-[0_10px_40px_rgba(15,43,60,0.06)]'
      } ${padding ? 'p-4 sm:p-5' : ''} ${className}`}
    >
      {children}
    </div>
  );
};

export const SectionBand: React.FC<{
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
  emptyText?: string;
}> = ({ title, children, action, emptyText }) => {
  const { isDark } = useTheme();
  return (
    <SoftCard padding={false}>
      <div
        className={`px-4 py-2.5 flex items-center justify-between gap-2 ${
          isDark
            ? 'bg-gradient-to-r from-teal-950/50 to-slate-900/40 border-b border-slate-800'
            : 'bg-gradient-to-r from-[#d9eef3] to-[#eef6f8] border-b border-slate-100'
        }`}
      >
        <h3
          className={`text-[11px] font-extrabold uppercase tracking-[0.14em] ${
            isDark ? 'text-teal-200' : 'text-[#0f2b3c]'
          }`}
        >
          {title}
        </h3>
        {action}
      </div>
      <div className="p-4 sm:p-5">
        {emptyText ? (
          <p className={`text-center text-xs py-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {emptyText}
          </p>
        ) : (
          children
        )}
      </div>
    </SoftCard>
  );
};

export const MobileFieldGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
    {children}
  </div>
);

export const DocPlaceholder: React.FC<{ label?: string }> = ({ label = 'No Document Available' }) => {
  const { isDark } = useTheme();
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed px-3 py-5 ${
        isDark ? 'border-slate-700 bg-slate-900/40 text-slate-500' : 'border-slate-200 bg-slate-50 text-slate-400'
      }`}
    >
      <ImageOff className="w-5 h-5 opacity-70" />
      <span className="text-[10px] font-semibold text-center">{label}</span>
    </div>
  );
};

export const MobileContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="px-3.5 sm:px-5 py-4 sm:py-5 max-w-5xl mx-auto space-y-3.5 sm:space-y-4 w-full">
    {children}
  </div>
);

export const StickyBottomBar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDark } = useTheme();
  return (
    <div
      className={`fixed bottom-[64px] sm:bottom-16 inset-x-0 z-30 px-3.5 pb-2 pointer-events-none`}
    >
      <div
        className={`pointer-events-auto max-w-lg mx-auto rounded-2xl border p-2.5 flex gap-2 shadow-xl ${
          isDark
            ? 'bg-[#101a27]/95 border-slate-700 backdrop-blur-xl'
            : 'bg-white/95 border-slate-200 backdrop-blur-xl shadow-slate-900/10'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export const PrimaryBtn: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit';
}> = ({ children, onClick, className = '', type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-extrabold text-white bg-[#0f2b3c] hover:bg-[#163a50] active:scale-[0.99] transition-all cursor-pointer shadow-sm ${className}`}
  >
    {children}
  </button>
);

export const FormInput: React.FC<{
  label: string;
  required?: boolean;
  value?: string | number;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: string;
  prefix?: string;
  as?: 'input' | 'select' | 'textarea';
  options?: { value: string; label: string }[];
}> = ({
  label,
  required,
  value,
  onChange,
  placeholder,
  type = 'text',
  prefix,
  as = 'input',
  options = [],
}) => {
  const { isDark } = useTheme();
  const control = `w-full rounded-xl border px-3 py-2.5 text-xs font-semibold outline-none transition-shadow focus:ring-2 ${
    isDark
      ? 'bg-[#0b1320] border-slate-700 text-slate-100 focus:ring-teal-500/25 focus:border-teal-500'
      : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-teal-600/15 focus:border-teal-600 focus:bg-white'
  }`;

  return (
    <label className="block space-y-1.5 min-w-0">
      <span className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
        {label}
        {required && <span className="text-rose-500 ml-0.5">*</span>}
      </span>
      <div className="relative">
        {prefix && (
          <span
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold ${
              isDark ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            {prefix}
          </span>
        )}
        {as === 'select' ? (
          <select
            className={`${control} ${prefix ? 'pl-8' : ''}`}
            value={value ?? ''}
            onChange={(e) => onChange?.(e.target.value)}
          >
            <option value="">{placeholder || 'Select…'}</option>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : as === 'textarea' ? (
          <textarea
            className={`${control} min-h-[88px] resize-y`}
            value={value ?? ''}
            placeholder={placeholder}
            onChange={(e) => onChange?.(e.target.value)}
          />
        ) : (
          <input
            type={type}
            className={`${control} ${prefix ? 'pl-8' : ''}`}
            value={value ?? ''}
            placeholder={placeholder}
            onChange={(e) => onChange?.(e.target.value)}
          />
        )}
      </div>
    </label>
  );
};

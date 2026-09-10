/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  isPassword?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  icon,
  isPassword = false,
  type = 'text',
  className = '',
  id,
  ...props
}) => {
  const { isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const inputId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="w-full space-y-1">
      <label
        htmlFor={inputId}
        className={`block text-[11px] font-bold tracking-wider uppercase ${
          isDark ? 'text-slate-300' : 'text-slate-700'
        }`}
      >
        {label}
      </label>
      <div className="relative rounded-xl shadow-2xs">
        {icon && (
          <div
            className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
              isDark ? 'text-slate-400' : 'text-slate-400'
            }`}
          >
            {icon}
          </div>
        )}
        <input
          id={inputId}
          type={inputType}
          {...props}
          className={`block w-full rounded-xl border text-xs sm:text-sm transition-colors py-2.5 ${
            icon ? 'pl-9' : 'pl-3.5'
          } ${isPassword ? 'pr-10' : 'pr-3.5'} ${
            isDark
              ? 'bg-[#131929] text-slate-100 placeholder:text-slate-500 border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
              : 'bg-white text-slate-900 placeholder:text-slate-400 border-slate-200 hover:border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/15'
          } ${
            error
              ? isDark
                ? 'border-rose-500 ring-1 ring-rose-500/30'
                : 'border-rose-300 ring-1 ring-rose-300 focus:border-rose-500'
              : ''
          } ${className}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className={`absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-600'
            }`}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error ? (
        <p className="text-[11px] text-rose-500 font-medium pl-0.5">{error}</p>
      ) : helperText ? (
        <p className={`text-[11px] pl-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: DropdownOption[] | string[];
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const DropdownField: React.FC<DropdownFieldProps> = ({
  label,
  options,
  error,
  helperText,
  icon,
  className = '',
  id,
  ...props
}) => {
  const { isDark } = useTheme();
  const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="w-full space-y-1">
      <label
        htmlFor={selectId}
        className={`block text-[11px] font-bold tracking-wider uppercase ${
          isDark ? 'text-slate-300' : 'text-slate-700'
        }`}
      >
        {label}
      </label>
      <div className="relative rounded-xl shadow-2xs">
        {icon && (
          <div
            className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
              isDark ? 'text-slate-400' : 'text-slate-400'
            }`}
          >
            {icon}
          </div>
        )}
        <select
          id={selectId}
          {...props}
          className={`block w-full rounded-xl border text-xs sm:text-sm transition-colors py-2.5 pr-9 appearance-none cursor-pointer ${
            icon ? 'pl-9' : 'pl-3.5'
          } ${
            isDark
              ? 'bg-[#131929] text-slate-100 border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
              : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/15'
          } ${
            error
              ? isDark
                ? 'border-rose-500 ring-1 ring-rose-500/30'
                : 'border-rose-300 ring-1 ring-rose-300 focus:border-rose-500'
              : ''
          } ${className}`}
        >
          {options.map((opt) => {
            const val = typeof opt === 'string' ? opt : opt.value;
            const text = typeof opt === 'string' ? opt : opt.label;
            return (
              <option
                key={val}
                value={val}
                className={isDark ? 'bg-[#131929] text-slate-100' : 'bg-white text-slate-900'}
              >
                {text}
              </option>
            );
          })}
        </select>
        <div
          className={`absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none ${
            isDark ? 'text-slate-400' : 'text-slate-400'
          }`}
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
      {error ? (
        <p className="text-[11px] text-rose-500 font-medium pl-0.5">{error}</p>
      ) : helperText ? (
        <p className={`text-[11px] pl-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
};

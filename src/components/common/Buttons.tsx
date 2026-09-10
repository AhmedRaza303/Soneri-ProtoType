/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'danger';
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  children,
  icon,
  fullWidth = true,
  size = 'md',
  variant = 'primary',
  className = '',
  disabled,
  ...props
}) => {
  const { isDark } = useTheme();

  const sizeClasses = {
    sm: 'py-2 px-3.5 text-xs rounded-lg',
    md: 'py-2.5 px-4 text-xs sm:text-sm rounded-xl',
    lg: 'py-3 px-5 text-sm sm:text-base rounded-xl',
  }[size];

  const variantClasses =
    variant === 'danger'
      ? 'bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white shadow-sm shadow-rose-950/30'
      : isDark
      ? 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-sm shadow-indigo-950/40'
      : 'bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white shadow-sm shadow-slate-900/15';

  return (
    <button
      {...props}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-bold tracking-tight transition-all duration-150 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 select-none ${
        fullWidth ? 'w-full' : 'w-auto'
      } ${sizeClasses} ${variantClasses} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export const SecondaryButton: React.FC<ButtonProps> = ({
  children,
  icon,
  fullWidth = false,
  size = 'md',
  className = '',
  disabled,
  ...props
}) => {
  const { isDark } = useTheme();

  const sizeClasses = {
    sm: 'py-2 px-3 text-xs rounded-lg',
    md: 'py-2 px-3.5 text-xs sm:text-sm rounded-xl',
    lg: 'py-2.5 px-4 text-sm sm:text-base rounded-xl',
  }[size];

  const themeClasses = isDark
    ? 'text-slate-200 bg-[#131929] hover:bg-[#1a233a] active:bg-[#202b47] border border-slate-800 shadow-2xs'
    : 'text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200/90 shadow-2xs';

  return (
    <button
      {...props}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-semibold tracking-tight transition-all duration-150 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none ${
        fullWidth ? 'w-full' : 'w-auto'
      } ${sizeClasses} ${themeClasses} ${className}`}
    >
      {icon && (
        <span className={`shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {icon}
        </span>
      )}
      <span>{children}</span>
    </button>
  );
};

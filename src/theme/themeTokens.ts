/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Mobile Design System Theme Tokens
 * Defines consistent visual styling for Light and Dark modes across all mobile components.
 */

export const getThemeClasses = (isDark: boolean) => ({
  // Screen and canvas backgrounds
  bgCanvas: isDark ? 'bg-[#090d16]' : 'bg-[#f8fafc]',
  bgCanvasSubtle: isDark ? 'bg-[#0e1424]' : 'bg-[#f1f5f9]',

  // Surface containers (Cards, Sheets, Panels)
  surface: isDark
    ? 'bg-[#111726] border-slate-800/80 text-slate-100'
    : 'bg-white border-slate-200/90 text-slate-900',
  surfaceHover: isDark
    ? 'hover:bg-[#161f33] hover:border-slate-700/80'
    : 'hover:bg-slate-50 hover:border-slate-300',
  surfaceActive: isDark ? 'active:bg-[#1a253d]' : 'active:bg-slate-100',
  surfaceSubtle: isDark
    ? 'bg-[#0d1322] border-slate-800/60'
    : 'bg-slate-50/80 border-slate-100',

  // App Bar & Bottom Navigation
  navHeader: isDark
    ? 'bg-[#0e1424]/95 border-slate-800/80 text-white'
    : 'bg-white/95 border-slate-200/80 text-slate-900',
  navBottom: isDark
    ? 'bg-[#0e1424]/95 border-slate-800/80 text-slate-400'
    : 'bg-white/95 border-slate-200/80 text-slate-500',

  // Typography
  textPrimary: isDark ? 'text-slate-100' : 'text-slate-900',
  textSecondary: isDark ? 'text-slate-400' : 'text-slate-500',
  textMuted: isDark ? 'text-slate-500' : 'text-slate-400',
  textAccent: isDark ? 'text-indigo-400' : 'text-blue-600',

  // Borders & Dividers
  border: isDark ? 'border-slate-800/80' : 'border-slate-200/80',
  borderSubtle: isDark ? 'border-slate-800/50' : 'border-slate-100',
  divide: isDark ? 'divide-slate-800/60' : 'divide-slate-100',

  // Inputs, Dropdowns & Controls
  input: isDark
    ? 'bg-[#131929] border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20'
    : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-slate-900/15',
  inputSubtle: isDark
    ? 'bg-[#0b101e] border-slate-800 text-slate-100 placeholder:text-slate-500'
    : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400',

  // Buttons
  btnPrimary: isDark
    ? 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-sm shadow-indigo-950/40'
    : 'bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white shadow-sm shadow-slate-900/10',
  btnSecondary: isDark
    ? 'bg-[#111726] hover:bg-[#182136] active:bg-[#1f2a45] text-slate-200 border-slate-800 shadow-2xs'
    : 'bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs',
  btnGhost: isDark
    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 active:bg-slate-800'
    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 active:bg-slate-200',

  // Chips & Badges
  chipActive: isDark
    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
    : 'bg-blue-50 text-blue-700 border border-blue-200',
  chipDefault: isDark
    ? 'bg-slate-800/60 text-slate-300 border border-slate-700/60 hover:bg-slate-800'
    : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200',
});

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Smartphone, Tablet, Monitor, Wifi, Battery, Signal, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export type DeviceMode = 'phone' | 'tablet' | 'fluid';

interface DeviceFrameToggleProps {
  deviceMode: DeviceMode;
  onModeChange: (mode: DeviceMode) => void;
}

export const DeviceFrameToggle: React.FC<DeviceFrameToggleProps> = ({
  deviceMode,
  onModeChange,
}) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <div
      className={`py-1.5 px-3 border-b flex items-center justify-between text-xs select-none shadow-xs z-50 transition-colors ${
        isDark
          ? 'bg-slate-900 text-slate-200 border-slate-800'
          : 'bg-white text-slate-700 border-slate-200'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>SONERI Mobile ERP</span>
        <span className={isDark ? 'hidden sm:inline text-slate-600' : 'hidden sm:inline text-slate-300'}>|</span>
        <span className={`hidden sm:inline font-mono text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Modern Executive UI</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Switcher Button */}
        <button
          type="button"
          onClick={toggleTheme}
          id="theme-mode-toggle-btn"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer text-[11px] font-semibold ${
            isDark
              ? 'bg-slate-800/90 hover:bg-slate-750 text-slate-200 border-slate-700/70'
              : 'bg-slate-100 hover:bg-slate-200/80 text-slate-800 border-slate-200 shadow-2xs'
          }`}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        >
          {isDark ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-indigo-600" />
              <span>Dark</span>
            </>
          )}
        </button>

        {/* Device Mode Switcher */}
        <div className={`flex items-center gap-1 p-0.5 rounded-lg border ${
          isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            type="button"
            onClick={() => onModeChange('phone')}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
              deviceMode === 'phone'
                ? isDark
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-bold'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Phone view (390px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Phone</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange('tablet')}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
              deviceMode === 'tablet'
                ? isDark
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-bold'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Tablet view (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Tablet</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange('fluid')}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
              deviceMode === 'fluid'
                ? isDark
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-bold'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Fluid view"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Full</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const MobileStatusBar: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div
      className={`w-full px-5 pt-2 pb-1.5 flex items-center justify-between text-[11px] font-semibold tracking-wider select-none shrink-0 transition-colors ${
        isDark
          ? 'bg-[#090d16] text-white border-b border-slate-800/60'
          : 'bg-white text-slate-800 border-b border-slate-200/60'
      }`}
    >
      <span className="font-bold">9:41</span>
      <div className="flex items-center gap-2">
        <Signal className={`w-3 h-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
        <span className={`text-[10px] font-mono font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          5G
        </span>
        <Wifi className={`w-3.5 h-3.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
        <Battery className={`w-4 h-4 stroke-[2.5] ${isDark ? 'text-slate-200' : 'text-slate-700'}`} />
      </div>
    </div>
  );
};


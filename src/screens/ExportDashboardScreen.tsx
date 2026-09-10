/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileSearch,
  Send,
  FileCheck2,
  Package,
  Ship,
  Receipt,
  FileSignature,
  ShoppingCart,
  BellRing,
  Truck,
  MoreVertical,
  Info,
  ChevronDown,
  Users,
} from 'lucide-react';
import {
  EXPORT_FOLLOW_UPS,
  EXPORT_TASKS,
  MARKETING_PERSONNEL_OPTIONS,
  ExportTaskItem,
} from '../data/exportDashboardData';
import { useTheme } from '../context/ThemeContext';

interface ExportDashboardScreenProps {
  onBack?: () => void;
}

export const ExportDashboardScreen: React.FC<ExportDashboardScreenProps> = () => {
  const { isDark } = useTheme();
  const [selectedPersonnel, setSelectedPersonnel] = useState(
    MARKETING_PERSONNEL_OPTIONS[0]
  );
  const [activeTooltipId, setActiveTooltipId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Render task icons with modern styles
  const renderTaskIcon = (type: ExportTaskItem['icon']) => {
    switch (type) {
      case 'booking':
        return <FileCheck2 className="w-5 h-5 text-sky-600" />;
      case 'loading':
        return <Package className="w-5 h-5 text-amber-600" />;
      case 'shipment':
        return <Ship className="w-5 h-5 text-indigo-600" />;
      case 'invoice':
        return <Receipt className="w-5 h-5 text-emerald-600" />;
      case 'switch_bl':
        return <FileSignature className="w-5 h-5 text-purple-600" />;
      case 'purchase_invoice':
        return <ShoppingCart className="w-5 h-5 text-rose-600" />;
      case 'eta':
        return <BellRing className="w-5 h-5 text-orange-600" />;
      case 'uncouriered':
        return <Truck className="w-5 h-5 text-teal-600" />;
      default:
        return <Package className="w-5 h-5 text-slate-600" />;
    }
  };

  const getTaskIconBg = (type: ExportTaskItem['icon']) => {
    switch (type) {
      case 'booking':
        return 'bg-sky-50 border-sky-100';
      case 'loading':
        return 'bg-amber-50 border-amber-100';
      case 'shipment':
        return 'bg-indigo-50 border-indigo-100';
      case 'invoice':
        return 'bg-emerald-50 border-emerald-100';
      case 'switch_bl':
        return 'bg-purple-50 border-purple-100';
      case 'purchase_invoice':
        return 'bg-rose-50 border-rose-100';
      case 'eta':
        return 'bg-orange-50 border-orange-100';
      case 'uncouriered':
        return 'bg-teal-50 border-teal-100';
      default:
        return 'bg-slate-50 border-slate-100';
    }
  };

  return (
    <div>
      {/* ========================================================================= */}
      {/* 1. MOBILE EXPERIENCE (md:hidden) - Modern Executive Mobile App             */}
      {/* ========================================================================= */}
      <div className="md:hidden space-y-3.5">
        {/* SMART COMPONENT 1: Executive Command Hub */}
        {/* Unifies Header, Personnel Selector, and Follow-ups Pipeline into ONE sleek card */}
        <div
          className={`rounded-3xl p-4 border relative overflow-hidden transition-colors ${
            isDark
              ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white shadow-xl border-slate-800/80'
              : 'bg-white text-slate-900 shadow-xs border-slate-200/90'
          }`}
        >
          {/* Ambient glow accent (only in dark mode) */}
          {isDark && (
            <div className="absolute -top-12 -right-12 w-44 h-44 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          )}

          {/* Header Row */}
          <div className={`relative z-10 flex items-center justify-between pb-3 mb-3 border-b ${
            isDark ? 'border-white/10' : 'border-slate-100'
          }`}>
            <div>
              <span className={`text-[10px] font-black tracking-widest uppercase block ${
                isDark ? 'text-emerald-400' : 'text-emerald-600'
              }`}>
                EXPORT PIPELINE
              </span>
              <h1 className={`text-lg font-black tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Export Dashboard
              </h1>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
              isDark
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              Total 18 Follow-ups
            </span>
          </div>

          {/* Marketing Personnel Selector */}
          <div className="relative z-10 mb-3.5">
            <div className={`relative rounded-2xl px-3 py-2 shadow-xs flex items-center border transition-colors ${
              isDark
                ? 'bg-white/10 hover:bg-white/15 border-white/15 backdrop-blur-md'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
            }`}>
              <Users className={`w-3.5 h-3.5 mr-2 shrink-0 pointer-events-none ${
                isDark ? 'text-slate-300' : 'text-slate-500'
              }`} />
              <select
                value={selectedPersonnel}
                onChange={(e) => setSelectedPersonnel(e.target.value)}
                className={`w-full appearance-none bg-transparent text-xs font-bold pr-5 focus:outline-none cursor-pointer ${
                  isDark ? 'text-slate-100' : 'text-slate-800'
                }`}
              >
                {MARKETING_PERSONNEL_OPTIONS.map((person) => (
                  <option key={person} value={person} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                    {person}
                  </option>
                ))}
              </select>
              <ChevronDown className={`w-3.5 h-3.5 absolute right-2.5 pointer-events-none ${
                isDark ? 'text-slate-300' : 'text-slate-400'
              }`} />
            </div>
          </div>

          {/* Follow-ups Pipeline */}
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Follow-ups Pipeline</h2>
              </div>
              <span className={`text-[10px] font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>
                Total 18 Active
              </span>
            </div>

            <div className="space-y-2">
              {EXPORT_FOLLOW_UPS.map((item, idx) => {
                const isEnquiry = item.icon === 'enquiry';
                const hasPending = Number(item.value) > 0;

                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-colors ${
                      isDark
                        ? 'bg-white/5 border-white/10'
                        : 'bg-slate-50/90 hover:bg-slate-100/80 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${
                          isEnquiry
                            ? isDark
                              ? 'bg-emerald-400/20 border-emerald-400/30 text-emerald-300'
                              : 'bg-emerald-100 border-emerald-200 text-emerald-700'
                            : isDark
                            ? 'bg-indigo-400/20 border-indigo-400/30 text-indigo-300'
                            : 'bg-indigo-100 border-indigo-200 text-indigo-700'
                        }`}
                      >
                        {isEnquiry ? (
                          <FileSearch className="w-4 h-4" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold leading-tight ${
                            isDark ? 'text-slate-100' : 'text-slate-800'
                          }`}>
                            {item.title}
                          </span>
                          <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded-full ${
                            isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-200 text-slate-600'
                          }`}>
                            Stage {idx + 1}
                          </span>
                        </div>
                        <span className={`text-[10px] block leading-tight mt-0.5 ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          {item.subtitle}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-xl text-xs font-black ${
                          hasPending
                            ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                            : isDark
                            ? 'bg-white/10 text-slate-300'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {item.value} Pending
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SMART COMPONENT 2: Operational Tasks Monitor */}
        <section className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Operational Tasks
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
              Total 0
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {EXPORT_TASKS.map((task) => {
              const hasTooltip = Boolean(task.infoTooltip);
              const isTooltipActive = activeTooltipId === task.id;

              return (
                <div
                  key={task.id}
                  className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${getTaskIconBg(
                        task.icon
                      )}`}
                    >
                      {renderTaskIcon(task.icon)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800 leading-tight">
                          {task.title}
                        </span>
                        {hasTooltip && (
                          <button
                            type="button"
                            onClick={() =>
                              setActiveTooltipId(isTooltipActive ? null : task.id)
                            }
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <Info className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block leading-tight mt-0.5 truncate">
                        {task.subtitle}
                      </span>
                      {isTooltipActive && (
                        <div className="mt-1 p-2 text-[10px] font-medium text-white bg-slate-900 rounded-xl shadow-md">
                          {task.infoTooltip}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-block px-2 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-600">
                      Queue 0
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* 2. WEB / DESKTOP EXPERIENCE (hidden md:block) - Spacious Multi-Column     */}
      {/* ========================================================================= */}
      <div className="hidden md:block space-y-6">
        {/* Header with Title and Marketing Personal Filter (matching Image 3) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider text-slate-400 uppercase block">
              OVERVIEW
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1e293b] tracking-tight">
              Export Dashboard
            </h1>
          </div>

        {/* Marketing Personal Filter Dropdown */}
        <div className="relative w-full sm:w-64">
          <label
            htmlFor="export-marketing-personal-select"
            className="sr-only"
          >
            Marketing Personal
          </label>
          <div className="relative flex items-center">
            <Users className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <select
              id="export-marketing-personal-select"
              value={selectedPersonnel}
              onChange={(e) => setSelectedPersonnel(e.target.value)}
              className="w-full appearance-none bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 py-2.5 pl-9 pr-8 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-all"
            >
              {MARKETING_PERSONNEL_OPTIONS.map((person) => (
                <option key={person} value={person}>
                  {person}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Section 1: Follow-ups Pipeline Hub */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Follow-ups
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200/80">
              Total 18
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">Export Dispatch Pipeline</span>
        </div>

        {/* Cohesive Pipeline Progress Bar & Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {EXPORT_FOLLOW_UPS.map((item, idx) => {
            const isEnquiry = item.icon === 'enquiry';
            const accent = isEnquiry
              ? { border: 'border-emerald-200/90', bg: 'bg-emerald-50/20', iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200', bar: 'bg-emerald-600', pill: 'bg-emerald-50 text-emerald-700' }
              : { border: 'border-indigo-200/90', bg: 'bg-indigo-50/20', iconBg: 'bg-indigo-50 text-indigo-700 border-indigo-200', bar: 'bg-indigo-600', pill: 'bg-indigo-50 text-indigo-700' };

            return (
              <div
                key={item.id}
                id={`follow-up-${item.id}`}
                className={`relative rounded-2xl border ${accent.border} ${accent.bg} bg-white p-4 sm:p-5 transition-all hover:shadow-xs flex items-center justify-between overflow-hidden`}
              >
                <div className={`absolute top-0 left-0 right-0 h-1 ${accent.bar}`} />

                <div className="flex items-center gap-3.5 min-w-0 pr-2 pt-1">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 shadow-2xs ${accent.iconBg}`}>
                    {isEnquiry ? (
                      <FileSearch className="w-5 h-5" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${accent.pill}`}>
                      Stage {idx + 1}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 truncate">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2 pt-1">
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {item.value}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 2: Tasks Matrix */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Tasks
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
              Total 0
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">Operational Monitor</span>
        </div>

        {/* Structured Task Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {EXPORT_TASKS.map((task) => {
            const hasTooltip = Boolean(task.infoTooltip);
            const isTooltipActive = activeTooltipId === task.id;
            const isMenuActive = activeMenuId === task.id;

            return (
              <div
                key={task.id}
                id={`task-${task.id}`}
                className="relative rounded-2xl border border-slate-200/80 bg-white p-4 flex flex-col justify-between transition-all hover:border-slate-300 hover:shadow-xs overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-slate-300" />

                <div className="pt-1">
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    {/* Icon Container */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${getTaskIconBg(
                        task.icon
                      )}`}
                    >
                      {renderTaskIcon(task.icon)}
                    </div>

                    {/* Menu Button (...) */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuId(isMenuActive ? null : task.id)
                        }
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {isMenuActive && (
                        <div
                          className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-20 text-xs font-medium text-slate-700"
                          onMouseLeave={() => setActiveMenuId(null)}
                        >
                          <button
                            type="button"
                            onClick={() => setActiveMenuId(null)}
                            className="w-full text-left px-3 py-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            View Details
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveMenuId(null)}
                            className="w-full text-left px-3 py-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            Refresh
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Title with Info Icon */}
                  <div className="flex items-center gap-1.5 mb-1">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight leading-snug">
                      {task.title}
                    </h3>
                    {hasTooltip && (
                      <div className="relative inline-flex items-center">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveTooltipId(isTooltipActive ? null : task.id)
                          }
                          onMouseEnter={() => setActiveTooltipId(task.id)}
                          onMouseLeave={() => setActiveTooltipId(null)}
                          className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                        {isTooltipActive && (
                          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 z-30 px-2.5 py-1 text-[11px] font-medium text-white bg-slate-900 rounded-lg shadow-md whitespace-nowrap">
                            {task.infoTooltip}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Subtitle */}
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {task.subtitle}
                  </p>
                </div>

                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-400">Queue</span>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                    0
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      </div>
    </div>
  );
};

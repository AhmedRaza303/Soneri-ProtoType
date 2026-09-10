/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  FileBadge2,
  ClipboardList,
  ShoppingCart,
  Receipt,
  CheckCircle2,
  Clock,
  Edit3,
  FileSpreadsheet,
  Info,
  ChevronDown,
  ChevronRight,
  Filter,
  Columns as ColumnsIcon,
  Search,
  ChevronLeft,
  X,
} from 'lucide-react';
import {
  PURCHASE_TASKS,
  CURRENT_MONTH_PERFORMANCE,
  NEXT_MONTH_SUMMARY,
  DELAYED_ORDERS,
  DELAYED_ORDERS_TOOLTIP,
  PurchaseTaskItem,
  DelayedOrderItem,
} from '../data/purchaseDashboardData';
import { useTheme } from '../context/ThemeContext';

interface PurchaseDashboardScreenProps {
  onBack?: () => void;
}

export const PurchaseDashboardScreen: React.FC<PurchaseDashboardScreenProps> = () => {
  const { isDark } = useTheme();
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({
    'pi-809': true, // Default expanded as in reference image
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [croFilter, setCroFilter] = useState<string>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState('10');
  const [mobileMonthTab, setMobileMonthTab] = useState<'current' | 'next'>('current');

  // Toggle row expansion
  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filtered delayed orders
  const filteredOrders = useMemo(() => {
    return DELAYED_ORDERS.filter((order) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        order.proformaCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.marketingPersonal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.portOfDischarge.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCro = croFilter === 'All' || order.croType === croFilter;

      return matchesSearch && matchesCro;
    });
  }, [searchQuery, croFilter]);

  // Render CRO badge matching reference image colors
  const renderCroBadge = (type: DelayedOrderItem['croType']) => {
    switch (type) {
      case 'Applied':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Applied
          </span>
        );
      case 'Received':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Received
          </span>
        );
      case 'Not Applied':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Not Applied
          </span>
        );
    }
  };

  // Render task icons
  const renderTaskIcon = (icon: PurchaseTaskItem['icon']) => {
    switch (icon) {
      case 'ticket':
        return <MessageSquare className="w-5 h-5 text-emerald-600" />;
      case 'artwork':
        return <FileBadge2 className="w-5 h-5 text-rose-600" />;
      case 'requisition':
        return <ClipboardList className="w-5 h-5 text-purple-600" />;
      case 'order':
        return <ShoppingCart className="w-5 h-5 text-blue-600" />;
      case 'invoice':
        return <Receipt className="w-5 h-5 text-amber-600" />;
    }
  };

  const getTaskIconBg = (icon: PurchaseTaskItem['icon']) => {
    switch (icon) {
      case 'ticket':
        return 'bg-emerald-50 border-emerald-100';
      case 'artwork':
        return 'bg-rose-50 border-rose-100';
      case 'requisition':
        return 'bg-purple-50 border-purple-100';
      case 'order':
        return 'bg-blue-50 border-blue-100';
      case 'invoice':
        return 'bg-amber-50 border-amber-100';
    }
  };

  return (
    <div>
      {/* ========================================================================= */}
      {/* 1. MOBILE EXPERIENCE (md:hidden) - Modern Executive Mobile App             */}
      {/* ========================================================================= */}
      <div className="md:hidden space-y-3.5">
        {/* SMART COMPONENT 1: Executive Procurement Command Hub */}
        <div
          className={`rounded-3xl p-4 border relative overflow-hidden transition-colors ${
            isDark
              ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-xl border-slate-800/80'
              : 'bg-white text-slate-900 shadow-xs border-slate-200/90'
          }`}
        >
          {/* Ambient glow accent (only in dark mode) */}
          {isDark && (
            <div className="absolute -top-12 -right-12 w-44 h-44 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          )}

          {/* Header Row */}
          <div className={`relative z-10 flex items-center justify-between pb-3 mb-3 border-b ${
            isDark ? 'border-white/10' : 'border-slate-100'
          }`}>
            <div>
              <span className={`text-[10px] font-black tracking-widest uppercase block ${
                isDark ? 'text-indigo-400' : 'text-indigo-600'
              }`}>
                PURCHASE & PROCUREMENT
              </span>
              <h1 className={`text-lg font-black tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Purchase Dashboard
              </h1>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
              isDark
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}>
              Total 75 Tasks
            </span>
          </div>

          {/* Procurement Pipeline Items */}
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <h2 className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Procurement Pipeline</h2>
              </div>
              <span className={`text-[10px] font-bold ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>
                5 Operations Active
              </span>
            </div>

            <div className="space-y-2">
              {PURCHASE_TASKS.map((task) => {
                const hasTooltip = Boolean(task.infoTooltip);
                const isTooltipActive = activeTooltip === task.id;
                const hasActiveItems = Number(task.value) > 0;

                return (
                  <div
                    key={task.id}
                    className={`p-2.5 rounded-2xl border flex items-center justify-between gap-3 transition-colors ${
                      isDark
                        ? 'bg-white/5 border-white/10'
                        : 'bg-slate-50/90 hover:bg-slate-100/80 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${
                          task.icon === 'ticket'
                            ? isDark
                              ? 'bg-emerald-400/20 border-emerald-400/30 text-emerald-300'
                              : 'bg-emerald-100 border-emerald-200 text-emerald-700'
                            : task.icon === 'artwork'
                            ? isDark
                              ? 'bg-rose-400/20 border-rose-400/30 text-rose-300'
                              : 'bg-rose-100 border-rose-200 text-rose-700'
                            : task.icon === 'requisition'
                            ? isDark
                              ? 'bg-purple-400/20 border-purple-400/30 text-purple-300'
                              : 'bg-purple-100 border-purple-200 text-purple-700'
                            : task.icon === 'order'
                            ? isDark
                              ? 'bg-blue-400/20 border-blue-400/30 text-blue-300'
                              : 'bg-blue-100 border-blue-200 text-blue-700'
                            : isDark
                            ? 'bg-amber-400/20 border-amber-400/30 text-amber-300'
                            : 'bg-amber-100 border-amber-200 text-amber-700'
                        }`}
                      >
                        {renderTaskIcon(task.icon)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold leading-tight ${
                            isDark ? 'text-slate-100' : 'text-slate-800'
                          }`}>
                            {task.label}
                          </span>
                          {hasTooltip && (
                            <button
                              type="button"
                              onClick={() =>
                                setActiveTooltip(isTooltipActive ? null : task.id)
                              }
                              className={`cursor-pointer ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                              <Info className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <span className={`text-[10px] block leading-tight mt-0.5 ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          {task.subtitle}
                        </span>
                        {isTooltipActive && (
                          <div className={`mt-1.5 p-2 text-[10px] font-medium rounded-xl shadow-lg border ${
                            isDark
                              ? 'text-white bg-slate-900 border-slate-700'
                              : 'text-slate-800 bg-white border-slate-200'
                          }`}>
                            {task.infoTooltip}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-xl text-xs font-black ${
                          hasActiveItems
                            ? 'bg-indigo-600 text-white font-black shadow-xs'
                            : isDark
                            ? 'bg-white/10 text-slate-300'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {task.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SMART COMPONENT 2: Performance & Schedule Command Hub (Current & Next Month with Segmented Switcher) */}
        <section className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 space-y-3">
          {/* Section Header & Segmented Pill Switcher */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Operational Performance
              </h2>
              <span className="text-[10px] text-slate-400">
                {mobileMonthTab === 'current' ? 'Month-to-date status' : 'Projected schedule'}
              </span>
            </div>
            {/* Interactive Month Segmented Switcher */}
            <div className="flex p-0.5 bg-slate-100 rounded-xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => setMobileMonthTab('current')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  mobileMonthTab === 'current'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Current (240)
              </button>
              <button
                type="button"
                onClick={() => setMobileMonthTab('next')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  mobileMonthTab === 'next'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Next (81)
              </button>
            </div>
          </div>

          {/* Tab Content: Current Month */}
          {mobileMonthTab === 'current' && (
            <div className="space-y-3 animate-fadeIn">
              {/* 1. Expected Readiness */}
              <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 block leading-tight">
                      {CURRENT_MONTH_PERFORMANCE.expectedReadiness.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                      {CURRENT_MONTH_PERFORMANCE.expectedReadiness.subtitle}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xl font-black text-slate-900">
                    {CURRENT_MONTH_PERFORMANCE.expectedReadiness.value}
                  </span>
                </div>
              </div>

              {/* 2. CRO Status */}
              <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block leading-tight">
                      {CURRENT_MONTH_PERFORMANCE.croStatus.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block leading-tight">
                      {CURRENT_MONTH_PERFORMANCE.croStatus.subtitle}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="bg-amber-50/80 border border-amber-200 rounded-xl px-2 py-1.5 text-center">
                    <span className="text-[10px] font-bold text-amber-700 block">Applied</span>
                    <span className="text-xs font-black text-amber-900">
                      {CURRENT_MONTH_PERFORMANCE.croStatus.applied}
                    </span>
                  </div>
                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl px-2 py-1.5 text-center">
                    <span className="text-[10px] font-bold text-emerald-700 block">Received</span>
                    <span className="text-xs font-black text-emerald-900">
                      {CURRENT_MONTH_PERFORMANCE.croStatus.received}
                    </span>
                  </div>
                  <div className="bg-rose-50/80 border border-rose-200 rounded-xl px-2 py-1.5 text-center">
                    <span className="text-[10px] font-bold text-rose-700 block">Not Applied</span>
                    <span className="text-xs font-black text-rose-900">
                      {CURRENT_MONTH_PERFORMANCE.croStatus.notApplied}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Pending Readiness & Survey (Compact 2-col) */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 bg-slate-50/70 border border-slate-100 rounded-2xl">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-lg font-black text-slate-900">
                      {CURRENT_MONTH_PERFORMANCE.pendingReadiness.value}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 block truncate">
                    {CURRENT_MONTH_PERFORMANCE.pendingReadiness.label}
                  </span>
                  <span className="text-[9.5px] text-slate-400 block truncate">
                    {CURRENT_MONTH_PERFORMANCE.pendingReadiness.subtitle}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50/70 border border-slate-100 rounded-2xl">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-7 h-7 rounded-lg bg-pink-50 text-pink-600 border border-pink-200 flex items-center justify-center">
                      <Edit3 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-lg font-black text-slate-900">
                      {CURRENT_MONTH_PERFORMANCE.pendingSurvey.value}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 block truncate">
                    {CURRENT_MONTH_PERFORMANCE.pendingSurvey.label}
                  </span>
                  <span className="text-[9.5px] text-slate-400 block truncate">
                    {CURRENT_MONTH_PERFORMANCE.pendingSurvey.subtitle}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Next Month */}
          {mobileMonthTab === 'next' && (
            <div className="space-y-3 animate-fadeIn">
              {/* 1. Expected Readiness */}
              <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 block leading-tight">
                      {NEXT_MONTH_SUMMARY.expectedReadiness.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                      {NEXT_MONTH_SUMMARY.expectedReadiness.subtitle}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xl font-black text-slate-900">
                    {NEXT_MONTH_SUMMARY.expectedReadiness.value}
                  </span>
                </div>
              </div>

              {/* 2. CRO Status */}
              <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block leading-tight">
                      {NEXT_MONTH_SUMMARY.croStatus.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block leading-tight">
                      {NEXT_MONTH_SUMMARY.croStatus.subtitle}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="bg-amber-50/80 border border-amber-200 rounded-xl px-2 py-1.5 text-center">
                    <span className="text-[10px] font-bold text-amber-700 block">Applied</span>
                    <span className="text-xs font-black text-amber-900">
                      {NEXT_MONTH_SUMMARY.croStatus.applied}
                    </span>
                  </div>
                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl px-2 py-1.5 text-center">
                    <span className="text-[10px] font-bold text-emerald-700 block">Received</span>
                    <span className="text-xs font-black text-emerald-900">
                      {NEXT_MONTH_SUMMARY.croStatus.received}
                    </span>
                  </div>
                  <div className="bg-rose-50/80 border border-rose-200 rounded-xl px-2 py-1.5 text-center">
                    <span className="text-[10px] font-bold text-rose-700 block">Not Applied</span>
                    <span className="text-xs font-black text-rose-900">
                      {NEXT_MONTH_SUMMARY.croStatus.notApplied}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Pending Survey */}
              <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 border border-pink-200 flex items-center justify-center shrink-0">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 block leading-tight">
                      {NEXT_MONTH_SUMMARY.pendingSurvey.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                      {NEXT_MONTH_SUMMARY.pendingSurvey.subtitle}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xl font-black text-slate-900">
                    {NEXT_MONTH_SUMMARY.pendingSurvey.value}
                  </span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* SMART COMPONENT 3: Delayed Orders with CRO Status Hub */}
        <section className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Delayed Orders
              </h2>
              <span className="text-[10px] text-slate-400">With CRO Status Tracking</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {filteredOrders.length} records
            </span>
          </div>

          {/* Search & CRO Filter Chips */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search orders, clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* CRO Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {(['All', 'Applied', 'Received', 'Not Applied'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setCroFilter(status)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    croFilter === status
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Order Cards */}
          <div className="space-y-2.5 pt-1">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                No orders match your filter.
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isExpanded = Boolean(expandedRows[order.id]);
                return (
                  <div
                    key={order.id}
                    className="border border-slate-200/80 rounded-2xl p-3 bg-slate-50/50 space-y-2.5"
                  >
                    {/* Top Row: Code, CRO Badge & Toggle */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleRow(order.id)}
                          className="font-bold text-indigo-600 hover:underline text-xs"
                        >
                          {order.proformaCode}
                        </button>
                        {renderCroBadge(order.croType)}
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleRow(order.id)}
                        className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Customer & Destination */}
                    <div>
                      <div className="text-xs font-bold text-slate-900">{order.customerName}</div>
                      <div className="text-[10.5px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>Port: {order.portOfDischarge}</span>
                        <span>•</span>
                        <span>By: {order.marketingPersonal}</span>
                      </div>
                    </div>

                    {/* Date / Delivery Stats */}
                    <div className="grid grid-cols-2 gap-2 text-[10.5px] bg-white rounded-xl p-2.5 border border-slate-200/60 shadow-2xs">
                      <div>
                        <span className="text-slate-400 block text-[9.5px]">Delivery Month:</span>
                        <span className="font-bold text-slate-800">
                          {order.expectedDeliveryMonth}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9.5px]">Discharge Port:</span>
                        <span className="font-bold text-slate-800 truncate block">
                          {order.portOfDischarge}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9.5px]">Marketing Person:</span>
                        <span className="font-bold text-slate-800">
                          {order.marketingPersonal}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9.5px]">CRO Status:</span>
                        <span className="font-bold text-slate-800">{order.croType}</span>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="pt-2 border-t border-slate-200/80 space-y-2">
                        <div className="bg-white rounded-xl p-2.5 border border-slate-200/70 text-[11px] space-y-2">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Products ({order.expandedDetails.products.length})
                            </span>
                            <div className="space-y-1">
                              {order.expandedDetails.products.map((prod, pIdx) => (
                                <div key={pIdx} className="font-semibold text-indigo-600">
                                  {prod}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-1.5 border-t border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Requisitions & Suppliers
                            </span>
                            <div className="space-y-1">
                              {order.expandedDetails.requisitionsAndSuppliers.map((item, rIdx) => (
                                <div key={rIdx} className="text-[10.5px]">
                                  <span className="font-semibold text-indigo-600 block">
                                    {item.requisition}
                                  </span>
                                  <span className="text-slate-600 block">
                                    {item.supplier}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Mobile Pagination */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
            <span>Page {currentPage} of 5</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded-xl border border-slate-200 text-slate-700 disabled:opacity-40"
              >
                Prev
              </button>
              <button
                type="button"
                disabled={currentPage === 5}
                onClick={() => setCurrentPage((p) => Math.min(5, p + 1))}
                className="px-2.5 py-1 rounded-xl border border-slate-200 text-slate-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* 2. WEB / DESKTOP EXPERIENCE (hidden md:block) - Generous & Multi-column  */}
      {/* ========================================================================= */}
      <div className="hidden md:block space-y-6">
        {/* Header with Title (matching Image 1 & 2) */}
        <div className="pt-1">
          <span className="text-[10px] sm:text-xs font-bold tracking-wider text-slate-400 uppercase block">
            OVERVIEW
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1e293b] tracking-tight">
            Purchase Dashboard
          </h1>
        </div>

      {/* Section 1: Tasks Procurement Command Hub */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Tasks
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200/80">
              Total 75
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">Procurement Pipeline</span>
        </div>

        {/* 5 Task Segments in a cohesive responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {PURCHASE_TASKS.map((task) => {
            const hasTooltip = Boolean(task.infoTooltip);
            const isTooltipActive = activeTooltip === task.id;
            const hasActiveItems = Number(task.value) > 0;

            const styleConfig =
              task.icon === 'ticket'
                ? { bar: 'bg-emerald-600', iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
                : task.icon === 'artwork'
                ? { bar: 'bg-rose-600', iconBg: 'bg-rose-50 text-rose-700 border-rose-200' }
                : task.icon === 'requisition'
                ? { bar: 'bg-purple-600', iconBg: 'bg-purple-50 text-purple-700 border-purple-200' }
                : task.icon === 'order'
                ? { bar: 'bg-blue-600', iconBg: 'bg-blue-50 text-blue-700 border-blue-200' }
                : { bar: 'bg-amber-600', iconBg: 'bg-amber-50 text-amber-700 border-amber-200' };

            return (
              <div
                key={task.id}
                id={`purchase-task-${task.id}`}
                className={`relative rounded-2xl border p-4 flex flex-col justify-between transition-all overflow-hidden ${
                  hasActiveItems
                    ? 'border-blue-200/90 bg-white shadow-xs'
                    : 'border-slate-200/80 bg-white hover:border-slate-300'
                }`}
              >
                <div className={`absolute top-0 left-0 right-0 h-1 ${styleConfig.bar}`} />

                <div className="pt-1">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${styleConfig.iconBg}`}
                    >
                      {renderTaskIcon(task.icon)}
                    </div>

                    {hasTooltip && (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveTooltip(isTooltipActive ? null : task.id)
                          }
                          onMouseEnter={() => setActiveTooltip(task.id)}
                          onMouseLeave={() => setActiveTooltip(null)}
                          className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                        {isTooltipActive && (
                          <div className="absolute right-0 bottom-full mb-1.5 z-30 px-2.5 py-1 text-[11px] font-medium text-white bg-slate-900 rounded-lg shadow-md whitespace-nowrap">
                            {task.infoTooltip}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block truncate">
                    {task.label}
                  </span>

                  <div className="text-2xl sm:text-3xl font-black text-slate-900 my-1 tracking-tight">
                    {task.value}
                  </div>
                </div>

                <p className="text-[11px] font-medium text-slate-400 pt-2 border-t border-slate-100 truncate flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${styleConfig.bar}`} />
                  <span>{task.subtitle}</span>
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 2 & 3: Current Month Performance & Next Month Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Current Month Performance (Total 240) */}
        <section
          id="current-month-performance"
          className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Current Month Performance
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200/80">
              Total {CURRENT_MONTH_PERFORMANCE.total}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Expected Readiness */}
            <div className="relative bg-white border border-emerald-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-emerald-600" />
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block truncate">
                  {CURRENT_MONTH_PERFORMANCE.expectedReadiness.label}
                </span>
                <span className="text-2xl font-black text-slate-900 block tracking-tight">
                  {CURRENT_MONTH_PERFORMANCE.expectedReadiness.value}
                </span>
                <span className="text-[11px] text-slate-400 truncate block">
                  {CURRENT_MONTH_PERFORMANCE.expectedReadiness.subtitle}
                </span>
              </div>
            </div>

            {/* CRO Status Card */}
            <div className="relative bg-white border border-indigo-200/80 rounded-2xl p-4 space-y-2 shadow-xs overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-indigo-600" />
              <div className="flex items-center justify-between pl-1">
                <div className="flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    {CURRENT_MONTH_PERFORMANCE.croStatus.label}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-center text-xs pl-1">
                <div className="bg-amber-50/50 rounded-xl p-1.5 border border-amber-200/70">
                  <span className="text-[10px] font-bold text-amber-800 block">Applied</span>
                  <span className="text-sm font-black text-amber-900">
                    {CURRENT_MONTH_PERFORMANCE.croStatus.applied}
                  </span>
                </div>
                <div className="bg-emerald-50/50 rounded-xl p-1.5 border border-emerald-200/70">
                  <span className="text-[10px] font-bold text-emerald-800 block">Received</span>
                  <span className="text-sm font-black text-emerald-900">
                    {CURRENT_MONTH_PERFORMANCE.croStatus.received}
                  </span>
                </div>
                <div className="bg-rose-50/50 rounded-xl p-1.5 border border-rose-200/70">
                  <span className="text-[10px] font-bold text-rose-800 block">Not App.</span>
                  <span className="text-sm font-black text-rose-900">
                    {CURRENT_MONTH_PERFORMANCE.croStatus.notApplied}
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 block truncate pl-1">
                {CURRENT_MONTH_PERFORMANCE.croStatus.subtitle}
              </span>
            </div>

            {/* Pending Readiness */}
            <div className="relative bg-white border border-amber-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-amber-600" />
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block truncate">
                    {CURRENT_MONTH_PERFORMANCE.pendingReadiness.label}
                  </span>
                  <Info className="w-3 h-3 text-slate-400 shrink-0" />
                </div>
                <span className="text-2xl font-black text-slate-900 block tracking-tight">
                  {CURRENT_MONTH_PERFORMANCE.pendingReadiness.value}
                </span>
                <span className="text-[11px] text-slate-400 truncate block">
                  {CURRENT_MONTH_PERFORMANCE.pendingReadiness.subtitle}
                </span>
              </div>
            </div>

            {/* Pending Survey */}
            <div className="relative bg-white border border-pink-200/80 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-pink-600" />
              <div className="w-11 h-11 rounded-xl bg-pink-50 text-pink-600 border border-pink-200 flex items-center justify-center shrink-0">
                <Edit3 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block truncate">
                    {CURRENT_MONTH_PERFORMANCE.pendingSurvey.label}
                  </span>
                  <Info className="w-3 h-3 text-slate-400 shrink-0" />
                </div>
                <span className="text-2xl font-black text-slate-900 block tracking-tight">
                  {CURRENT_MONTH_PERFORMANCE.pendingSurvey.value}
                </span>
                <span className="text-[11px] text-slate-400 truncate block">
                  {CURRENT_MONTH_PERFORMANCE.pendingSurvey.subtitle}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Next Month Summary (Total 81) */}
        <section
          id="next-month-summary"
          className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Next Month Summary
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
              Total {NEXT_MONTH_SUMMARY.total}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Expected Readiness */}
            <div className="relative bg-white border border-emerald-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-xs overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600" />
              <div className="flex items-center gap-2 mb-2 pt-1">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block leading-tight">
                  {NEXT_MONTH_SUMMARY.expectedReadiness.label}
                </span>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 block tracking-tight">
                  {NEXT_MONTH_SUMMARY.expectedReadiness.value}
                </span>
                <span className="text-[11px] text-slate-400 block truncate">
                  {NEXT_MONTH_SUMMARY.expectedReadiness.subtitle}
                </span>
              </div>
            </div>

            {/* CRO Status Card */}
            <div className="relative bg-white border border-purple-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-xs overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-purple-600" />
              <div className="flex items-center gap-2 mb-1.5 pt-1">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block leading-tight">
                  {NEXT_MONTH_SUMMARY.croStatus.label}
                </span>
              </div>
              <div className="space-y-1 text-xs py-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-amber-700 font-medium">Applied</span>
                  <span className="font-black text-slate-800">
                    {NEXT_MONTH_SUMMARY.croStatus.applied}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-emerald-700 font-medium">Received</span>
                  <span className="font-black text-slate-800">
                    {NEXT_MONTH_SUMMARY.croStatus.received}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-rose-700 font-medium">Not Applied</span>
                  <span className="font-black text-slate-800">
                    {NEXT_MONTH_SUMMARY.croStatus.notApplied}
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 block truncate">
                {NEXT_MONTH_SUMMARY.croStatus.subtitle}
              </span>
            </div>

            {/* Pending Survey */}
            <div className="relative bg-white border border-pink-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-xs overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-pink-600" />
              <div className="flex items-center gap-2 mb-2 pt-1">
                <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 border border-pink-200 flex items-center justify-center shrink-0">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block leading-tight">
                    {NEXT_MONTH_SUMMARY.pendingSurvey.label}
                  </span>
                  <Info className="w-3 h-3 text-slate-400 shrink-0" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900 block tracking-tight">
                  {NEXT_MONTH_SUMMARY.pendingSurvey.value}
                </span>
                <span className="text-[11px] text-slate-400 block truncate">
                  {NEXT_MONTH_SUMMARY.pendingSurvey.subtitle}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Section 4: Delayed Orders (matching Image 2) */}
      <section
        id="delayed-orders-section"
        className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5 space-y-4"
      >
        {/* Section Header with Tooltip & Action Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-[#1e293b] tracking-tight">
              Delayed Orders
            </h2>
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setActiveTooltip(activeTooltip === 'delayed_orders' ? null : 'delayed_orders')
                }
                onMouseEnter={() => setActiveTooltip('delayed_orders')}
                onMouseLeave={() => setActiveTooltip(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title="Info"
              >
                <Info className="w-4 h-4" />
              </button>
              {activeTooltip === 'delayed_orders' && (
                <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 bottom-full mb-2 z-30 w-72 p-2.5 text-xs text-white bg-slate-900 rounded-xl shadow-xl leading-relaxed">
                  {DELAYED_ORDERS_TOOLTIP}
                </div>
              )}
            </div>
          </div>

          {/* Controls: Columns, Filters, Search */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Columns Toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsColumnsOpen(!isColumnsOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <ColumnsIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>Columns</span>
              </button>
              {isColumnsOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-20 text-xs space-y-1">
                  <div className="font-bold text-slate-800 px-2 py-1">Visible Columns</div>
                  <div className="px-2 py-1 text-slate-600 flex items-center gap-2">
                    <input type="checkbox" defaultChecked disabled />
                    <span>Proforma Code</span>
                  </div>
                  <div className="px-2 py-1 text-slate-600 flex items-center gap-2">
                    <input type="checkbox" defaultChecked disabled />
                    <span>Customer Name</span>
                  </div>
                  <div className="px-2 py-1 text-slate-600 flex items-center gap-2">
                    <input type="checkbox" defaultChecked disabled />
                    <span>Expected Delivery Month</span>
                  </div>
                  <div className="px-2 py-1 text-slate-600 flex items-center gap-2">
                    <input type="checkbox" defaultChecked disabled />
                    <span>Port of Discharge</span>
                  </div>
                  <div className="px-2 py-1 text-slate-600 flex items-center gap-2">
                    <input type="checkbox" defaultChecked disabled />
                    <span>CRO Type</span>
                  </div>
                  <div className="px-2 py-1 text-slate-600 flex items-center gap-2">
                    <input type="checkbox" defaultChecked disabled />
                    <span>Marketing Personal</span>
                  </div>
                </div>
              )}
            </div>

            {/* Filters Toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 border text-xs font-semibold rounded-xl shadow-2xs transition-colors cursor-pointer ${
                  croFilter !== 'All'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters {croFilter !== 'All' ? `(${croFilter})` : ''}</span>
              </button>
              {isFilterOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-20 text-xs space-y-1">
                  <div className="font-bold text-slate-800 px-2 py-1">Filter CRO Type</div>
                  {['All', 'Applied', 'Received', 'Not Applied'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setCroFilter(type);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                        croFilter === type
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Input */}
            <div className="relative flex items-center w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl py-1.5 pl-8 pr-7 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Responsive Table / Cards */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-xs text-left border-collapse min-w-[720px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-600">
                <th className="py-2.5 px-3 w-8 text-center" aria-label="Expand" />
                <th className="py-2.5 px-3 font-bold">Proforma Code</th>
                <th className="py-2.5 px-3 font-bold">Customer Name</th>
                <th className="py-2.5 px-3 font-bold">Expected Delivery Month</th>
                <th className="py-2.5 px-3 font-bold">Port of Discharge</th>
                <th className="py-2.5 px-3 font-bold">CRO Type</th>
                <th className="py-2.5 px-3 font-bold">Marketing Personal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No delayed orders found matching your search.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((row) => {
                  const isExpanded = Boolean(expandedRows[row.id]);

                  return (
                    <React.Fragment key={row.id}>
                      <tr
                        className={`hover:bg-slate-50/70 transition-colors ${
                          isExpanded ? 'bg-slate-50/40' : ''
                        }`}
                      >
                        {/* Expand/Collapse Toggle */}
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleRow(row.id)}
                            className="w-5 h-5 rounded-md flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>

                        {/* Proforma Code */}
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-blue-600 hover:underline cursor-pointer">
                            {row.proformaCode}
                          </span>
                        </td>

                        {/* Customer Name */}
                        <td className="py-2.5 px-3">
                          <span className="font-medium text-blue-600 hover:underline cursor-pointer">
                            {row.customerName}
                          </span>
                        </td>

                        {/* Expected Delivery Month */}
                        <td className="py-2.5 px-3 font-medium text-slate-600">
                          {row.expectedDeliveryMonth}
                        </td>

                        {/* Port of Discharge */}
                        <td className="py-2.5 px-3 text-slate-600">
                          {row.portOfDischarge}
                        </td>

                        {/* CRO Type Badge */}
                        <td className="py-2.5 px-3">
                          {renderCroBadge(row.croType)}
                        </td>

                        {/* Marketing Personal */}
                        <td className="py-2.5 px-3">
                          <span className="font-medium text-blue-600 hover:underline cursor-pointer">
                            {row.marketingPersonal}
                          </span>
                        </td>
                      </tr>

                      {/* Expanded Sub-row matching Image 2 */}
                      {isExpanded && (
                        <tr className="bg-slate-50/70 border-b border-slate-200/80">
                          <td className="py-3 px-3" />
                          <td colSpan={6} className="py-3 pr-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
                              {/* Product Name Column */}
                              <div>
                                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                                  Product Name
                                </span>
                                <div className="space-y-1">
                                  {row.expandedDetails.products.map((prod, idx) => (
                                    <div
                                      key={idx}
                                      className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                                    >
                                      {prod}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Requisition / Supplier Column */}
                              <div>
                                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                                  Requisition / Supplier
                                </span>
                                <div className="space-y-1.5">
                                  {row.expandedDetails.requisitionsAndSuppliers.map(
                                    (item, idx) => (
                                      <div key={idx} className="text-xs space-y-0.5">
                                        <span className="font-semibold text-blue-600 hover:underline cursor-pointer block">
                                          {item.requisition}
                                        </span>
                                        <span className="font-semibold text-blue-600 hover:underline cursor-pointer block">
                                          {item.supplier}
                                        </span>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer: Total Records & Pagination Controls (matching Image 2) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div>
            Total Records: <span className="font-bold text-slate-800">50</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Pagination numbers */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="w-7 h-7 rounded-lg flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {[1, 2, 3, 4, 5].map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === 5}
                onClick={() => setCurrentPage((p) => Math.min(5, p + 1))}
                className="w-7 h-7 rounded-lg flex items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Rows per page */}
            <div className="relative">
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(e.target.value)}
                className="appearance-none bg-white border border-slate-200 text-xs font-semibold text-slate-700 py-1.5 pl-2.5 pr-7 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="10">10 / page</option>
                <option value="20">20 / page</option>
                <option value="50">50 / page</option>
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

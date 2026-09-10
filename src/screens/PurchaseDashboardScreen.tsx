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
import { PurchaseDashboardJourney } from '../components/dashboard/DashboardJourneys';
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
      {/* Journey-style mobile dashboard */}
      <PurchaseDashboardJourney />

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

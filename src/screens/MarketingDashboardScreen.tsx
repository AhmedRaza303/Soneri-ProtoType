/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  Search,
  Palette,
  Layers,
  Info,
  ChevronDown,
  ChevronRight,
  Printer,
  Filter,
  Columns as ColumnsIcon,
  X,
  Building2,
  Ship,
  Box,
  TrendingUp,
} from 'lucide-react';
import {
  MARKETING_FOLLOW_UPS,
  MARKETING_TASKS,
  PERFORMANCE_SUMMARY,
  RECENT_DELIVERED_ORDERS,
  MARKETING_PERSONNEL_OPTIONS,
} from '../data/marketingDashboardData';
import { MarketingDashboardJourney } from '../components/dashboard/DashboardJourneys';
import { useTheme } from '../context/ThemeContext';

export const MarketingDashboardScreen: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedPersonnel, setSelectedPersonnel] = useState(MARKETING_PERSONNEL_OPTIONS[0]);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilterStatus, setActiveFilterStatus] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState('10');

  // Multi-level expansion states
  const [expandedCustomer, setExpandedCustomer] = useState<Record<string, boolean>>({
    'cu-045': true,
  });
  const [expandedProforma, setExpandedProforma] = useState<Record<string, boolean>>({
    'PI-601': true,
  });
  const [expandedInvoice, setExpandedInvoice] = useState<Record<string, boolean>>({
    'SI-379': true,
  });
  const [expandedShipment, setExpandedShipment] = useState<Record<string, boolean>>({
    'ES-352': true,
  });

  // Filter delivered orders
  const filteredOrders = useMemo(() => {
    return RECENT_DELIVERED_ORDERS.filter((order) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        order.customerName.toLowerCase().includes(q) ||
        order.gateOutDate.toLowerCase().includes(q) ||
        order.totalInvoiceAmount.toLowerCase().includes(q) ||
        order.proformas.some(
          (p) =>
            p.proformaCode.toLowerCase().includes(q) ||
            p.marketingPerson.toLowerCase().includes(q) ||
            p.portOfDischarge.toLowerCase().includes(q)
        )
      );
    });
  }, [searchQuery]);

  const toggleCustomer = (id: string) => {
    setExpandedCustomer((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleProforma = (id: string) => {
    setExpandedProforma((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleInvoice = (id: string) => {
    setExpandedInvoice((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleShipment = (id: string) => {
    setExpandedShipment((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      {/* Journey-style mobile dashboard */}
      <MarketingDashboardJourney />

      {/* ========================================================================= */}
      {/* 2. WEB / DESKTOP EXPERIENCE (hidden md:block) - Spacious Enterprise View   */}
      {/* ========================================================================= */}
      <div className="hidden md:block space-y-6">
        {/* Header with Title and Marketing Personal Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider text-slate-400 uppercase block">
              OVERVIEW
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1e293b] tracking-tight">
              Marketing Dashboard
            </h1>
          </div>

        {/* Marketing Personal Filter Dropdown */}
        <div className="relative w-full sm:w-64">
          <label htmlFor="marketing-personnel-select" className="sr-only">
            Marketing Personal
          </label>
          <div className="relative flex items-center">
            <Users className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <select
              id="marketing-personnel-select"
              value={selectedPersonnel}
              onChange={(e) => setSelectedPersonnel(e.target.value)}
              className="w-full appearance-none bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 py-2.5 pl-9 pr-8 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all"
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

      {/* Grouped Operations Panel: Combines Follow-ups & Tasks into 2 clean, cohesive enterprise sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Section 1: Follow-ups (Total 144) */}
        <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600" />
              <h2 className="text-base sm:text-lg font-black text-[#1e293b] tracking-tight">
                Follow-ups
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Total 144
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MARKETING_FOLLOW_UPS.map((item) => {
              const hasTooltip = Boolean(item.infoTooltip);
              const isTooltipActive = activeTooltip === item.id;

              // Distinct visual styles per marketing follow-up category
              const styleConfig =
                item.icon === 'orders'
                  ? { border: 'border-blue-200/80', bg: 'bg-blue-50/20', iconBg: 'bg-blue-50 text-blue-700 border-blue-100', bar: 'bg-blue-600' }
                  : item.icon === 'payments'
                  ? { border: 'border-emerald-200/80', bg: 'bg-emerald-50/20', iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-100', bar: 'bg-emerald-600' }
                  : item.icon === 'shipping'
                  ? { border: 'border-purple-200/80', bg: 'bg-purple-50/20', iconBg: 'bg-purple-50 text-purple-700 border-purple-100', bar: 'bg-purple-600' }
                  : { border: 'border-amber-200/80', bg: 'bg-amber-50/20', iconBg: 'bg-amber-50 text-amber-700 border-amber-100', bar: 'bg-amber-600' };

              return (
                <div
                  key={item.id}
                  id={`marketing-followup-${item.id}`}
                  className={`relative rounded-2xl border ${styleConfig.border} ${styleConfig.bg} bg-white p-4 flex flex-col justify-between transition-all hover:shadow-sm overflow-hidden`}
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 ${styleConfig.bar}`} />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${styleConfig.iconBg}`}>
                          {item.icon === 'orders' && <FileText className="w-4 h-4" />}
                          {item.icon === 'payments' && <Clock className="w-4 h-4" />}
                          {item.icon === 'shipping' && <CheckCircle2 className="w-4 h-4" />}
                          {item.icon === 'quotations' && <FileText className="w-4 h-4" />}
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 truncate">
                          {item.label}
                        </span>
                      </div>

                      {hasTooltip && (
                        <div className="relative shrink-0">
                          <button
                            type="button"
                            onClick={() => setActiveTooltip(isTooltipActive ? null : item.id)}
                            onMouseEnter={() => setActiveTooltip(item.id)}
                            onMouseLeave={() => setActiveTooltip(null)}
                            className="p-1 text-slate-400 hover:text-slate-600"
                            title="Information"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                          {isTooltipActive && (
                            <div className="absolute right-0 bottom-full mb-1.5 z-30 px-2.5 py-1 text-[11px] font-medium text-white bg-slate-900 rounded-lg shadow-md whitespace-nowrap">
                              {item.infoTooltip}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-baseline justify-between gap-2 pt-1">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {item.value}
                      </span>
                      {item.extraBadge && (
                        <div className="relative inline-flex items-center">
                          <span
                            onMouseEnter={() => setActiveTooltip(`${item.id}-badge`)}
                            onMouseLeave={() => setActiveTooltip(null)}
                            className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-purple-100 text-purple-800 border border-purple-200 cursor-help whitespace-nowrap"
                          >
                            {item.extraBadge.text}
                          </span>
                          {activeTooltip === `${item.id}-badge` && item.extraBadge.infoTooltip && (
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 z-30 px-2 py-1 text-[10px] font-medium text-white bg-slate-900 rounded-lg shadow-md whitespace-nowrap">
                              {item.extraBadge.infoTooltip}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] font-medium text-slate-400 pt-2 border-t border-slate-100 mt-2 truncate flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${styleConfig.bar}`} />
                    <span>{item.subtitle}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Tasks (Total 73) */}
        <section className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-600" />
              <h2 className="text-base sm:text-lg font-black text-[#1e293b] tracking-tight">
                Tasks
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Total 73
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {MARKETING_TASKS.map((task) => {
              const hasTooltip = Boolean(task.infoTooltip);
              const isTooltipActive = activeTooltip === task.id;

              const styleConfig =
                task.icon === 'ticket'
                  ? { border: 'border-emerald-200/80', bg: 'bg-emerald-50/20', iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-100', bar: 'bg-emerald-600' }
                  : task.icon === 'freight'
                  ? { border: 'border-sky-200/80', bg: 'bg-sky-50/20', iconBg: 'bg-sky-50 text-sky-700 border-sky-100', bar: 'bg-sky-600' }
                  : task.icon === 'artwork'
                  ? { border: 'border-rose-200/80', bg: 'bg-rose-50/20', iconBg: 'bg-rose-50 text-rose-700 border-rose-100', bar: 'bg-rose-600' }
                  : { border: 'border-teal-200/80', bg: 'bg-teal-50/20', iconBg: 'bg-teal-50 text-teal-700 border-teal-100', bar: 'bg-teal-600' };

              return (
                <div
                  key={task.id}
                  id={`marketing-task-${task.id}`}
                  className={`relative rounded-2xl border ${styleConfig.border} ${styleConfig.bg} bg-white p-4 flex flex-col justify-between transition-all hover:shadow-sm overflow-hidden`}
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 ${styleConfig.bar}`} />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${styleConfig.iconBg}`}>
                          {task.icon === 'ticket' && <MessageSquare className="w-4 h-4" />}
                          {task.icon === 'freight' && <Search className="w-4 h-4" />}
                          {task.icon === 'artwork' && <Palette className="w-4 h-4" />}
                          {task.icon === 'container' && <Layers className="w-4 h-4" />}
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 truncate">
                          {task.label}
                        </span>
                      </div>

                      {hasTooltip && (
                        <div className="relative shrink-0">
                          <button
                            type="button"
                            onClick={() => setActiveTooltip(isTooltipActive ? null : task.id)}
                            onMouseEnter={() => setActiveTooltip(task.id)}
                            onMouseLeave={() => setActiveTooltip(null)}
                            className="p-1 text-slate-400 hover:text-slate-600"
                            title="Information"
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

                    <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-1">
                      {task.value}
                    </div>
                  </div>

                  <p className="text-[11px] font-medium text-slate-400 pt-2 border-t border-slate-100 mt-2 truncate flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${styleConfig.bar}`} />
                    <span>{task.subtitle}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Section 3: Performance Summary */}
      <section
        id="marketing-performance-summary"
        className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <h2 className="text-base sm:text-lg font-black text-[#1e293b] tracking-tight">
              Performance Summary
            </h2>
          </div>
          <span className="sm:hidden text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md self-start">
            ← Scroll horizontally to view all metrics →
          </span>
        </div>

        {/* Responsive Performance Matrix Table */}
        <div className="overflow-x-auto -mx-5 sm:mx-0">
          <table className="w-full text-xs text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600">
                <th className="py-2.5 px-4 font-bold">Criteria</th>
                <th className="py-2.5 px-3 font-bold text-center">Current Month</th>
                <th className="py-2.5 px-3 font-bold text-center">SPLY</th>
                <th className="py-2.5 px-4 font-bold">%Age Change</th>
                <th className="py-2.5 px-3 font-bold text-center">Year to Date</th>
                <th className="py-2.5 px-3 font-bold text-center">SPLY</th>
                <th className="py-2.5 px-4 font-bold">%Age Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {PERFORMANCE_SUMMARY.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-1.5">
                    <span>{row.criteria}</span>
                    {row.infoTooltip && (
                      <div className="relative inline-flex items-center">
                        <button
                          type="button"
                          onMouseEnter={() => setActiveTooltip(`perf-${idx}`)}
                          onMouseLeave={() => setActiveTooltip(null)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                        {activeTooltip === `perf-${idx}` && (
                          <div className="absolute left-0 bottom-full mb-1 z-30 px-2 py-1 text-[10px] font-medium text-white bg-slate-900 rounded-md shadow-md whitespace-nowrap">
                            {row.infoTooltip}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center font-black text-slate-900">
                    {row.currentMonth}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-500 font-medium">
                    {row.splyMonth}
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1 max-w-[140px]">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">
                        {row.percentageChangeMonth}
                      </span>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full w-full" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center font-black text-slate-900">
                    {row.yearToDate}
                  </td>
                  <td className="py-3 px-3 text-center text-slate-500 font-medium">
                    {row.splyYtd}
                  </td>
                  <td className="py-3 px-4">
                    <div className="space-y-1 max-w-[140px]">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">
                        {row.percentageChangeYtd}
                      </span>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full w-full" />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 4: Recent Delivered Orders (30 Days) - Multi-Level Nested Drill-down */}
      <section
        id="recent-delivered-orders-section"
        className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5 space-y-4"
      >
        {/* Header with Search and Actions (Print, Filters, Columns) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#1e293b] tracking-tight">
              Recent Delivered Orders (30 Days)
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Print button */}
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print</span>
            </button>

            {/* Filters toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span>Filters</span>
              </button>
              {isFilterOpen && (
                <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg p-2 z-20 text-xs space-y-1">
                  <div className="font-bold text-slate-800 px-2 py-1">Filter by Status</div>
                  {['All', 'Delivered', 'In Transit'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setActiveFilterStatus(status);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                        activeFilterStatus === status
                          ? 'bg-blue-50 text-blue-700 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Columns toggle */}
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
                    <span>Customer Name</span>
                  </div>
                  <div className="px-2 py-1 text-slate-600 flex items-center gap-2">
                    <input type="checkbox" defaultChecked disabled />
                    <span>Gate Out Date</span>
                  </div>
                  <div className="px-2 py-1 text-slate-600 flex items-center gap-2">
                    <input type="checkbox" defaultChecked disabled />
                    <span>Total Invoice Amount</span>
                  </div>
                  <div className="px-2 py-1 text-slate-600 flex items-center gap-2">
                    <input type="checkbox" defaultChecked disabled />
                    <span>Total Remaining Amount</span>
                  </div>
                </div>
              )}
            </div>

            {/* Search Input */}
            <div className="relative flex items-center w-full sm:w-44">
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

        {/* Hierarchical Drill-down Table for Delivered Orders */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-xs text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600">
                <th className="py-2.5 px-3 w-8 text-center" aria-label="Toggle" />
                <th className="py-2.5 px-3 font-bold">Customer Name</th>
                <th className="py-2.5 px-3 font-bold">Gate Out Date</th>
                <th className="py-2.5 px-3 font-bold text-right">Total Invoice Amount</th>
                <th className="py-2.5 px-3 font-bold text-right">Total Sale Return Amount</th>
                <th className="py-2.5 px-3 font-bold text-right">Total JV Adj. Amount</th>
                <th className="py-2.5 px-3 font-bold text-right">Remaining Advance</th>
                <th className="py-2.5 px-3 font-bold text-right">Total Remaining Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No delivered orders found matching your search.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isCustExpanded = Boolean(expandedCustomer[order.id]);

                  return (
                    <React.Fragment key={order.id}>
                      {/* LEVEL 0: Customer Row */}
                      <tr className={`hover:bg-slate-50/70 transition-colors ${isCustExpanded ? 'bg-slate-50/40' : ''}`}>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleCustomer(order.id)}
                            className="w-5 h-5 rounded-md flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-slate-200/60 cursor-pointer"
                          >
                            {isCustExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                        <td className="py-2.5 px-3 font-bold text-blue-600 hover:underline cursor-pointer">
                          {order.customerName}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-600">{order.gateOutDate}</td>
                        <td className="py-2.5 px-3 text-right font-black text-slate-800">{order.totalInvoiceAmount}</td>
                        <td className="py-2.5 px-3 text-right text-slate-600">{order.totalSaleReturnAmount}</td>
                        <td className="py-2.5 px-3 text-right text-slate-600">{order.totalJvAdjAmount}</td>
                        <td className="py-2.5 px-3 text-right text-slate-600">{order.remainingAdvance}</td>
                        <td className="py-2.5 px-3 text-right font-black text-slate-900">{order.totalRemainingAmount}</td>
                      </tr>

                      {/* LEVEL 1: Proforma Information */}
                      {isCustExpanded &&
                        order.proformas.map((proforma) => {
                          const isProfExpanded = Boolean(expandedProforma[proforma.proformaCode]);

                          return (
                            <React.Fragment key={proforma.proformaCode}>
                              <tr className="bg-slate-100/60 border-y border-slate-200/70">
                                <td className="py-2 px-3 text-right pl-6">
                                  <button
                                    type="button"
                                    onClick={() => toggleProforma(proforma.proformaCode)}
                                    className="w-4 h-4 rounded flex items-center justify-center text-slate-500 hover:text-blue-600 cursor-pointer"
                                  >
                                    {isProfExpanded ? (
                                      <ChevronDown className="w-3 h-3" />
                                    ) : (
                                      <ChevronRight className="w-3 h-3" />
                                    )}
                                  </button>
                                </td>
                                <td colSpan={7} className="py-2 px-3">
                                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-[11px]">
                                    <div>
                                      <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Proforma Code</span>
                                      <span className="font-bold text-blue-600">{proforma.proformaCode}</span>
                                    </div>
                                    <div className="sm:col-span-2">
                                      <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Company</span>
                                      <span className="font-medium text-slate-700 truncate block">{proforma.company}</span>
                                    </div>
                                    <div>
                                      <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Marketing Person</span>
                                      <span className="font-medium text-blue-600">{proforma.marketingPerson}</span>
                                    </div>
                                    <div>
                                      <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Place of Delivery</span>
                                      <span className="font-medium text-blue-600">{proforma.placeOfDelivery}</span>
                                    </div>
                                    <div>
                                      <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Port of Discharge</span>
                                      <span className="font-medium text-slate-700">{proforma.portOfDischarge}</span>
                                    </div>
                                    <div>
                                      <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Advance</span>
                                      <span className="font-medium text-slate-700">{proforma.advance}</span>
                                    </div>
                                    <div>
                                      <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Total Paid Amount</span>
                                      <span className="font-black text-slate-800">{proforma.totalPaidAmount}</span>
                                    </div>
                                  </div>
                                </td>
                              </tr>

                              {/* LEVEL 2: Invoice & Inquiries */}
                              {isProfExpanded &&
                                proforma.invoices.map((inv) => {
                                  const isInvExpanded = Boolean(expandedInvoice[inv.invoiceCode]);

                                  return (
                                    <React.Fragment key={inv.invoiceCode}>
                                      <tr className="bg-blue-50/40 border-b border-blue-100/60">
                                        <td className="py-2 px-3 text-right pl-10">
                                          <button
                                            type="button"
                                            onClick={() => toggleInvoice(inv.invoiceCode)}
                                            className="w-4 h-4 rounded flex items-center justify-center text-blue-600 hover:text-blue-800 cursor-pointer"
                                          >
                                            {isInvExpanded ? (
                                              <ChevronDown className="w-3 h-3" />
                                            ) : (
                                              <ChevronRight className="w-3 h-3" />
                                            )}
                                          </button>
                                        </td>
                                        <td colSpan={7} className="py-2.5 px-3">
                                          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-[11px]">
                                            <div>
                                              <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Inquiry Code</span>
                                              <span className="font-bold text-blue-600">{inv.inquiryCode}</span>
                                            </div>
                                            <div>
                                              <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Invoice Code</span>
                                              <span className="font-bold text-blue-600">{inv.invoiceCode}</span>
                                            </div>
                                            <div>
                                              <span className="text-[9.5px] uppercase font-bold text-slate-400 block">No of Days</span>
                                              <span className="font-medium text-slate-700">{inv.noOfDays}</span>
                                            </div>
                                            <div>
                                              <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Invoice Amount</span>
                                              <span className="font-black text-slate-900">{inv.invoiceAmount}</span>
                                            </div>
                                            <div>
                                              <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Sale Return</span>
                                              <span className="font-medium text-slate-700 text-[10px] leading-tight block">
                                                {inv.saleReturn.total} | Other: {inv.saleReturn.otherPiAdj} | SR JV: {inv.saleReturn.srJvAdj}
                                              </span>
                                            </div>
                                            <div>
                                              <span className="text-[9.5px] uppercase font-bold text-slate-400 block">JV Adj. Amount</span>
                                              <span className="font-medium text-slate-700">{inv.jvAdjAmount}</span>
                                            </div>
                                            <div>
                                              <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Adj Advance</span>
                                              <span className="font-medium text-slate-700">{inv.adjAdvance}</span>
                                            </div>
                                            <div>
                                              <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Sale Invoice Doc</span>
                                              <span className="font-medium text-slate-400">{inv.saleInvoiceDocument}</span>
                                            </div>
                                          </div>
                                        </td>
                                      </tr>

                                      {/* LEVEL 3 & 4: Shipment and Container Details */}
                                      {isInvExpanded &&
                                        inv.shipments.map((shipment) => {
                                          const isShipExpanded = Boolean(expandedShipment[shipment.shipmentCode]);

                                          return (
                                            <React.Fragment key={shipment.shipmentCode}>
                                              <tr className="bg-slate-50/90 border-b border-slate-200/80">
                                                <td className="py-2 px-3 text-right pl-14">
                                                  <button
                                                    type="button"
                                                    onClick={() => toggleShipment(shipment.shipmentCode)}
                                                    className="w-4 h-4 rounded flex items-center justify-center text-slate-500 hover:text-blue-600 cursor-pointer"
                                                  >
                                                    {isShipExpanded ? (
                                                      <ChevronDown className="w-3 h-3" />
                                                    ) : (
                                                      <ChevronRight className="w-3 h-3" />
                                                    )}
                                                  </button>
                                                </td>
                                                <td colSpan={7} className="py-2 px-3">
                                                  <div className="flex flex-wrap items-center gap-4 text-[11px]">
                                                    <div className="flex items-center gap-1.5">
                                                      <Ship className="w-3.5 h-3.5 text-indigo-600" />
                                                      <span className="font-bold text-blue-600">{shipment.shipmentCode}</span>
                                                    </div>
                                                    <div>
                                                      <span className="text-[9.5px] uppercase font-bold text-slate-400 mr-1">Created:</span>
                                                      <span className="font-medium text-slate-700">{shipment.shipmentCreatedDate}</span>
                                                    </div>
                                                    <div>
                                                      <span className="text-[9.5px] uppercase font-bold text-slate-400 mr-1">Freight Invoice:</span>
                                                      <span className="font-medium text-slate-400">{shipment.freightInvoiceDocument}</span>
                                                    </div>
                                                    <div>
                                                      <span className="text-[9.5px] uppercase font-bold text-slate-400 mr-1">BL Copy:</span>
                                                      <span className="font-medium text-slate-400">{shipment.blCopyDocument}</span>
                                                    </div>
                                                  </div>
                                                </td>
                                              </tr>

                                              {/* LEVEL 4: Container specifications */}
                                              {isShipExpanded &&
                                                shipment.containers.map((container, cIdx) => (
                                                  <tr key={cIdx} className="bg-amber-50/30 border-b border-amber-100/60">
                                                    <td className="py-2 px-3" />
                                                    <td colSpan={7} className="py-2 px-4">
                                                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] bg-white p-2.5 rounded-lg border border-amber-200/50">
                                                        <div className="flex items-center gap-1.5">
                                                          <Box className="w-3.5 h-3.5 text-amber-600" />
                                                          <div>
                                                            <span className="text-[9px] uppercase font-bold text-slate-400 block">Container Type</span>
                                                            <span className="font-bold text-slate-800">{container.containerType}</span>
                                                          </div>
                                                        </div>
                                                        <div>
                                                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Container No</span>
                                                          <span className="font-semibold text-blue-600">{container.containerNo}</span>
                                                        </div>
                                                        <div>
                                                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Gate Out Date</span>
                                                          <span className="font-medium text-slate-700">{container.gateOutDate}</span>
                                                        </div>
                                                        <div>
                                                          <span className="text-[9px] uppercase font-bold text-slate-400 block">ETA Date</span>
                                                          <span className="font-medium text-slate-700">{container.etaDate}</span>
                                                        </div>
                                                        <div>
                                                          <span className="text-[9px] uppercase font-bold text-slate-400 block">BL Number</span>
                                                          <span className="font-semibold text-slate-800">{container.blNumber}</span>
                                                        </div>
                                                      </div>
                                                    </td>
                                                  </tr>
                                                ))}
                                            </React.Fragment>
                                          );
                                        })}
                                    </React.Fragment>
                                  );
                                })}
                            </React.Fragment>
                          );
                        })}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer: Pagination & Record Count */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <div>
            Showing <span className="font-bold text-slate-800">1</span> to <span className="font-bold text-slate-800">1</span> of <span className="font-bold text-slate-800">1</span> records
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                  currentPage === 1
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                1
              </button>
            </div>

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

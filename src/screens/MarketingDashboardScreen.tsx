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
      {/* ========================================================================= */}
      {/* 1. MOBILE EXPERIENCE (md:hidden) - Modern Executive Mobile App             */}
      {/* ========================================================================= */}
      <div className="md:hidden space-y-3.5">
        {/* SMART COMPONENT 1: Executive Marketing Command Hub */}
        <div
          className={`rounded-3xl p-4 border relative overflow-hidden transition-colors ${
            isDark
              ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white shadow-xl border-slate-800/80'
              : 'bg-white text-slate-900 shadow-xs border-slate-200/90'
          }`}
        >
          {/* Ambient glow accent (only in dark mode) */}
          {isDark && (
            <div className="absolute -top-12 -right-12 w-44 h-44 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          )}

          {/* Header Row */}
          <div className={`relative z-10 flex items-center justify-between pb-3 mb-3 border-b ${
            isDark ? 'border-white/10' : 'border-slate-100'
          }`}>
            <div>
              <span className={`text-[10px] font-black tracking-widest uppercase block ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`}>
                MARKETING & CLIENT PIPELINE
              </span>
              <h1 className={`text-lg font-black tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Marketing Dashboard
              </h1>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
              isDark
                ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              Total 144 Follow-ups
            </span>
          </div>

          {/* Marketing Personal Selector */}
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
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <h2 className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Follow-ups Pipeline</h2>
              </div>
              <span className={`text-[10px] font-bold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                4 Active Channels
              </span>
            </div>

            <div className="space-y-2">
              {MARKETING_FOLLOW_UPS.map((item) => {
                const hasTooltip = Boolean(item.infoTooltip);
                const isTooltipActive = activeTooltip === item.id;
                const iconBox =
                  item.icon === 'orders'
                    ? isDark
                      ? 'bg-blue-400/20 border-blue-400/30 text-blue-300'
                      : 'bg-blue-100 border-blue-200 text-blue-700'
                    : item.icon === 'payments'
                    ? isDark
                      ? 'bg-emerald-400/20 border-emerald-400/30 text-emerald-300'
                      : 'bg-emerald-100 border-emerald-200 text-emerald-700'
                    : item.icon === 'shipping'
                    ? isDark
                      ? 'bg-purple-400/20 border-purple-400/30 text-purple-300'
                      : 'bg-purple-100 border-purple-200 text-purple-700'
                    : isDark
                    ? 'bg-amber-400/20 border-amber-400/30 text-amber-300'
                    : 'bg-amber-100 border-amber-200 text-amber-700';

                return (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-2xl border flex items-center justify-between gap-3 transition-colors ${
                      isDark
                        ? 'bg-white/5 border-white/10'
                        : 'bg-slate-50/90 hover:bg-slate-100/80 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${iconBox}`}
                      >
                        {item.icon === 'orders' && <FileText className="w-4 h-4" />}
                        {item.icon === 'payments' && <Clock className="w-4 h-4" />}
                        {item.icon === 'shipping' && <CheckCircle2 className="w-4 h-4" />}
                        {item.icon === 'quotations' && <FileText className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-xs font-bold leading-tight ${
                            isDark ? 'text-slate-100' : 'text-slate-800'
                          }`}>
                            {item.label}
                          </span>
                          {item.extraBadge && (
                            <span className={`px-1.5 py-0.2 text-[9px] font-black rounded-full border ${
                              isDark
                                ? 'bg-purple-500/30 text-purple-200 border-purple-400/30'
                                : 'bg-purple-100 text-purple-700 border-purple-200'
                            }`}>
                              {item.extraBadge.text}
                            </span>
                          )}
                          {hasTooltip && (
                            <button
                              type="button"
                              onClick={() => setActiveTooltip(isTooltipActive ? null : item.id)}
                              className={`cursor-pointer ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                              <Info className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <span className={`text-[10px] block leading-tight mt-0.5 ${
                          isDark ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          {item.icon === 'orders' && 'Awaiting client sign-off'}
                          {item.icon === 'payments' && 'Receivables due'}
                          {item.icon === 'shipping' && 'Vessels in transit'}
                          {item.icon === 'quotations' && 'Pricing requests pending'}
                        </span>
                        {isTooltipActive && (
                          <div className={`mt-1.5 p-2 text-[10px] font-medium rounded-xl shadow-lg border ${
                            isDark
                              ? 'text-white bg-slate-900 border-slate-700'
                              : 'text-slate-800 bg-white border-slate-200'
                          }`}>
                            {item.infoTooltip}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`inline-block px-2.5 py-1 rounded-xl text-xs font-black shadow-xs ${
                        isDark ? 'bg-blue-500 text-slate-950' : 'bg-blue-600 text-white'
                      }`}>
                        {item.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SMART COMPONENT 2: Operational Tasks & Performance Overview */}
        <section className={`${isDark ? 'bg-[#111726] border-slate-800/80 shadow-xs' : 'bg-white border-slate-200/80 shadow-xs'} rounded-3xl border p-4 space-y-4`}>
          {/* Subsection A: Operational Tasks */}
          <div className="space-y-3">
            <div className={`flex items-center justify-between pb-2 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                <h2 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  Marketing Tasks
                </h2>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${isDark ? 'bg-slate-800/80 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                Total 73
              </span>
            </div>

            <div className={`divide-y ${isDark ? 'divide-slate-800/70' : 'divide-slate-100'}`}>
              {MARKETING_TASKS.map((task) => {
                const hasTooltip = Boolean(task.infoTooltip);
                const isTooltipActive = activeTooltip === task.id;
                const iconBox =
                  task.icon === 'ticket'
                    ? isDark ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : task.icon === 'freight'
                    ? isDark ? 'bg-purple-950/60 text-purple-300 border-purple-800/60' : 'bg-purple-50 text-purple-700 border-purple-200'
                    : task.icon === 'artwork'
                    ? isDark ? 'bg-rose-950/60 text-rose-300 border-rose-800/60' : 'bg-rose-50 text-rose-700 border-rose-200'
                    : isDark ? 'bg-blue-950/60 text-blue-300 border-blue-800/60' : 'bg-blue-50 text-blue-700 border-blue-200';

                return (
                  <div
                    key={task.id}
                    className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${iconBox}`}
                      >
                        {task.icon === 'ticket' && <MessageSquare className="w-4 h-4" />}
                        {task.icon === 'freight' && <Search className="w-4 h-4" />}
                        {task.icon === 'artwork' && <Palette className="w-4 h-4" />}
                        {task.icon === 'container' && <Layers className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold leading-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                            {task.label}
                          </span>
                          {hasTooltip && (
                            <button
                              type="button"
                              onClick={() => setActiveTooltip(isTooltipActive ? null : task.id)}
                              className="text-slate-400 hover:text-slate-300 cursor-pointer"
                            >
                              <Info className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block leading-tight mt-0.5 truncate">
                          {task.subtitle}
                        </span>
                        {isTooltipActive && (
                          <div className={`mt-1 p-2 text-[10px] font-medium rounded-xl shadow-md border ${isDark ? 'text-white bg-slate-900 border-slate-700' : 'text-white bg-slate-900 border-slate-800'}`}>
                            {task.infoTooltip}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-xl text-xs font-black ${
                          Number(task.value) > 0
                            ? 'bg-blue-600 text-white shadow-xs'
                            : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-700'
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

          {/* Subsection B: Performance Summary (Current vs SPLY) */}
          <div className={`pt-2 border-t space-y-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <h3 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  Performance Summary
                </h3>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Current vs SPLY</span>
            </div>

            <div className="space-y-2">
              {PERFORMANCE_SUMMARY.map((row, idx) => (
                <div
                  key={idx}
                  className={`border rounded-2xl p-2.5 space-y-1.5 ${isDark ? 'bg-[#141b2d] border-slate-800/90' : 'bg-slate-50/70 border-slate-200/80'}`}
                >
                  <div className={`flex items-center justify-between text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    <span>{row.criteria}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${isDark ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                      {row.percentageChangeMonth}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className={`rounded-xl p-2 border shadow-2xs ${isDark ? 'bg-[#0d1322] border-slate-800' : 'bg-white border-slate-200/60'}`}>
                      <span className="text-slate-400 block text-[9.5px]">Current Month</span>
                      <span className={`font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{row.currentMonth}</span>
                      <span className="text-slate-400 block text-[9px] mt-0.5">SPLY: {row.splyMonth}</span>
                    </div>
                    <div className={`rounded-xl p-2 border shadow-2xs ${isDark ? 'bg-[#0d1322] border-slate-800' : 'bg-white border-slate-200/60'}`}>
                      <span className="text-slate-400 block text-[9.5px]">Year to Date</span>
                      <span className={`font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{row.yearToDate}</span>
                      <span className="text-slate-400 block text-[9px] mt-0.5">SPLY: {row.splyYtd}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SMART COMPONENT 3: Recent Delivered Orders Hub */}
        <section className={`${isDark ? 'bg-[#111726] border-slate-800/80 shadow-xs' : 'bg-white border-slate-200/80 shadow-xs'} rounded-3xl border p-4 space-y-3.5`}>
          <div className={`flex items-center justify-between pb-2 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <h2 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  Recent Delivered Orders
                </h2>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">Past 30 Days Activity</span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isDark ? 'bg-slate-800/80 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
              {filteredOrders.length} records
            </span>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search customers, proformas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-8 pr-7 py-2 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border ${
                isDark ? 'bg-slate-900/80 border-slate-700 text-white' : 'bg-slate-50/90 border-slate-200 text-slate-800'
              }`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Order Mobile Cards */}
          <div className="space-y-2.5">
            {filteredOrders.map((order) => {
              const isCustExpanded = Boolean(expandedCustomer[order.id]);
              return (
                <div
                  key={order.id}
                  className={`border rounded-2xl p-3 space-y-2.5 transition-all ${
                    isDark ? 'border-slate-800 bg-[#141b2d]' : 'border-slate-200/80 bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${
                        isDark ? 'bg-blue-950/60 border-blue-800/60 text-blue-400' : 'bg-blue-50 border-blue-200/80 text-blue-600'
                      }`}>
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {order.customerName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{order.id}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleCustomer(order.id)}
                      className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                        isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {isCustExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className={`grid grid-cols-2 gap-2 text-[10.5px] rounded-xl p-2 border shadow-2xs ${
                    isDark ? 'bg-[#0d1322] border-slate-800' : 'bg-white border-slate-200/70'
                  }`}>
                    <div>
                      <span className="text-slate-400 block text-[9.5px]">Total Invoice:</span>
                      <span className={`font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{order.totalInvoiceAmount}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9.5px]">Gate Out Date:</span>
                      <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{order.gateOutDate}</span>
                    </div>
                  </div>

                  {isCustExpanded && (
                    <div className={`pt-2 border-t space-y-2 ${isDark ? 'border-slate-800' : 'border-slate-200/80'}`}>
                      {order.proformas.map((p) => (
                        <div
                          key={p.proformaCode}
                          className={`rounded-xl p-2.5 border text-[11px] space-y-2 shadow-2xs ${
                            isDark ? 'bg-[#0e1424] border-slate-800 text-slate-200' : 'bg-white border-slate-200/80 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span className="text-blue-500 font-black">{p.proformaCode}</span>
                            <span className={`font-mono font-black ${isDark ? 'text-emerald-400' : 'text-slate-900'}`}>{p.totalPaidAmount}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-400">
                            <div>Person: <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{p.marketingPerson}</span></div>
                            <div>Port: <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{p.portOfDischarge}</span></div>
                          </div>

                          {/* Invoices */}
                          <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
                            {p.invoices.map((inv) => (
                              <div
                                key={inv.invoiceCode}
                                className="bg-slate-50/80 rounded-lg p-2 text-[10.5px] space-y-1.5 border border-slate-200/60"
                              >
                                <div className="flex items-center justify-between font-bold text-slate-700">
                                  <span>Inv: {inv.invoiceCode}</span>
                                  <span className="text-emerald-700 font-mono font-black">{inv.invoiceAmount}</span>
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  Inquiry: {inv.inquiryCode} • {inv.noOfDays} Days
                                </div>

                                {inv.shipments.map((ship) => (
                                  <div
                                    key={ship.shipmentCode}
                                    className="bg-white rounded-lg p-2 border border-slate-200/60 text-[10px] text-slate-600 space-y-1"
                                  >
                                    <div className="flex items-center justify-between font-semibold">
                                      <span className="text-blue-600 font-bold">{ship.shipmentCode}</span>
                                      <span className="font-bold text-slate-700">{ship.containers.length} Containers</span>
                                    </div>
                                    {ship.containers.length > 0 && (
                                      <div className="text-[9.5px] text-slate-500 flex items-center justify-between pt-0.5 border-t border-slate-100">
                                        <span>No: <span className="font-mono font-semibold">{ship.containers[0].containerNo}</span></span>
                                        <span>Type: {ship.containers[0].containerType}</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile Pagination */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            <span>Showing 1 of 1</span>
            <span className="font-bold text-blue-600">Page 1</span>
          </div>
        </section>
      </div>

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

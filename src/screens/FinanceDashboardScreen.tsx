/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Clock,
  Receipt,
  FileCheck,
  CheckSquare,
  MessageSquare,
  FileText,
  Building,
  Landmark,
  Coins,
  Package,
  TrendingUp,
  UserCheck,
  Building2,
  ArrowRight,
  Eye,
  EyeOff,
  Info,
  ChevronDown,
  ChevronRight,
  Printer,
  Filter,
  Columns as ColumnsIcon,
  Search,
  X,
  Plus,
  Minus,
} from 'lucide-react';
import {
  FINANCE_TASKS,
  FINANCE_BALANCE_ITEMS,
  FINANCE_COMPANY_OPTIONS,
  CONTAINER_WISE_FORECAST_DATA,
  OPERATING_EXPENSE_DATA,
  PENDING_PAYMENTS_DATA,
} from '../data/financeDashboardData';
import { FinanceDashboardJourney } from '../components/dashboard/DashboardJourneys';
import { useTheme } from '../context/ThemeContext';

export const FinanceDashboardScreen: React.FC = () => {
  const { isDark } = useTheme();
  const [selectedCompany, setSelectedCompany] = useState(FINANCE_COMPANY_OPTIONS[0]);
  const [isAllBalancesMasked, setIsAllBalancesMasked] = useState(true);
  const [maskedItemsState, setMaskedItemsState] = useState<Record<string, boolean>>({
    banks: true,
    cash_in_hand: true,
    inventory_in_hand: true,
    advance_to_contractor: true,
    receivable_from_customer: true,
    accounts_payables: true,
  });
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const [hoveredBarMonth, setHoveredBarMonth] = useState<string | null>(null);
  const [forecastDuration, setForecastDuration] = useState('Current Year');
  const [expandedPaymentRows, setExpandedPaymentRows] = useState<Record<string, boolean>>({});
  const [mobileAnalyticsTab, setMobileAnalyticsTab] = useState<'forecast' | 'expense'>('forecast');

  const toggleItemMask = (id: string) => {
    setMaskedItemsState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAllMasks = () => {
    const nextState = !isAllBalancesMasked;
    setIsAllBalancesMasked(nextState);
    const updated: Record<string, boolean> = {};
    FINANCE_BALANCE_ITEMS.forEach((item) => {
      updated[item.id] = nextState;
    });
    setMaskedItemsState(updated);
  };

  const togglePaymentRow = (id: string) => {
    setExpandedPaymentRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter pending payments
  const filteredPayments = useMemo(() => {
    return PENDING_PAYMENTS_DATA.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        item.customerName.toLowerCase().includes(q) ||
        item.totalInvoiceAmount.toLowerCase().includes(q) ||
        item.totalRemainingAmount.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  return (
    <div>
      {/* Journey-style mobile dashboard */}
      <FinanceDashboardJourney />

      {/* ========================================================================= */}
      {/* 2. WEB / DESKTOP EXPERIENCE (hidden md:block) - Multi-Column ERP View     */}
      {/* ========================================================================= */}
      <div className="hidden md:block space-y-6">
      {/* 1. Header Banner / Finance Overview Tasks (Hero Section) */}
      <section
        id="finance-overview-banner"
        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#1e3a8a] via-[#1e40af] to-[#2563eb] text-white p-5 sm:p-7 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-blue-400/30">
          <div>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider text-blue-200 uppercase block mb-0.5">
              FINANCE OVERVIEW
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Your finance tasks, all in one place
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
              Track confirmations, vouchers, documents and approvals at a glance.
            </p>
          </div>

          <div className="self-start sm:self-auto">
            <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-blue-500/40 text-white border border-blue-300/40 shadow-xs">
              Total 39
            </span>
          </div>
        </div>

        {/* Unified Finance Tasks Grid - Mobile-First Responsive Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3 pt-5">
          {FINANCE_TASKS.map((task, idx) => {
            const hasTooltip = Boolean(task.infoTooltip);
            const isTooltipActive = activeTooltip === task.id;
            const isLastOddOnMobile = idx === FINANCE_TASKS.length - 1;

            return (
              <div
                key={task.id}
                id={`finance-task-${task.id}`}
                className={`bg-white/15 hover:bg-white/20 backdrop-blur-md border border-white/25 rounded-2xl p-3.5 flex flex-col justify-between transition-all shadow-xs ${
                  isLastOddOnMobile ? 'col-span-2 sm:col-span-1' : 'col-span-1'
                }`}
              >
                <div className="flex items-start justify-between gap-1.5">
                  <div className="w-8 h-8 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0 shadow-2xs">
                    {task.icon === 'payment_confirmations' && <CreditCard className="w-4 h-4 text-white" />}
                    {task.icon === 'awaiting_confirmations' && <Clock className="w-4 h-4 text-white" />}
                    {task.icon === 'receipt_vouchers' && <Receipt className="w-4 h-4 text-white" />}
                    {task.icon === 'purchase_approval' && <FileCheck className="w-4 h-4 text-white" />}
                    {task.icon === 'sale_approval' && <CheckSquare className="w-4 h-4 text-white" />}
                    {task.icon === 'open_ticket' && <MessageSquare className="w-4 h-4 text-white" />}
                    {task.icon === 'awaiting_documents' && <FileText className="w-4 h-4 text-white" />}
                  </div>

                  {hasTooltip && (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setActiveTooltip(isTooltipActive ? null : task.id)}
                        onMouseEnter={() => setActiveTooltip(task.id)}
                        onMouseLeave={() => setActiveTooltip(null)}
                        className="p-1 text-white/70 hover:text-white"
                        title="Information"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                      {isTooltipActive && (
                        <div className="absolute right-0 bottom-full mb-1.5 z-30 px-2.5 py-1 text-[10px] font-medium text-slate-900 bg-white rounded-lg shadow-md whitespace-nowrap">
                          {task.infoTooltip}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <div className="text-2xl sm:text-3xl font-black text-white leading-none tracking-tight">
                    {task.value}
                  </div>
                  <div className="text-[11px] font-bold text-blue-100 uppercase tracking-tight mt-1.5 line-clamp-2">
                    {task.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Balance Summary Section */}
      <section
        id="finance-balance-summary"
        className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] sm:text-xs font-bold tracking-wider text-slate-400 uppercase block">
              FINANCE SNAPSHOT
            </span>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-[#1e293b] tracking-tight">
                Balance Summary
              </h2>
              <button
                type="button"
                onClick={toggleAllMasks}
                className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                title={isAllBalancesMasked ? 'Show all balances' : 'Hide all balances'}
              >
                {isAllBalancesMasked ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4 text-blue-600" />
                )}
              </button>
            </div>
          </div>

          {/* Company Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase shrink-0">Company</span>
            <div className="relative w-full sm:w-60">
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full appearance-none bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 py-1.5 pl-3 pr-8 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {FINANCE_COMPANY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 6 Balance Items - Modern Financial Card Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FINANCE_BALANCE_ITEMS.map((item) => {
            const isMasked = maskedItemsState[item.id] ?? true;

            const categoryStyle =
              item.icon === 'banks'
                ? { border: 'border-blue-200/80', iconBg: 'bg-blue-50 text-blue-600 border-blue-100', bar: 'bg-blue-600' }
                : item.icon === 'cash'
                ? { border: 'border-emerald-200/80', iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100', bar: 'bg-emerald-600' }
                : item.icon === 'inventory'
                ? { border: 'border-amber-200/80', iconBg: 'bg-amber-50 text-amber-600 border-amber-100', bar: 'bg-amber-600' }
                : item.icon === 'contractor'
                ? { border: 'border-purple-200/80', iconBg: 'bg-purple-50 text-purple-600 border-purple-100', bar: 'bg-purple-600' }
                : item.icon === 'receivable'
                ? { border: 'border-cyan-200/80', iconBg: 'bg-cyan-50 text-cyan-600 border-cyan-100', bar: 'bg-cyan-600' }
                : { border: 'border-rose-200/80', iconBg: 'bg-rose-50 text-rose-600 border-rose-100', bar: 'bg-rose-600' };

            return (
              <div
                key={item.id}
                id={`balance-${item.id}`}
                className={`group relative bg-white border ${categoryStyle.border} rounded-2xl p-4 flex items-center justify-between hover:shadow-sm transition-all overflow-hidden`}
              >
                <div className={`absolute top-0 left-0 bottom-0 w-1 ${categoryStyle.bar}`} />

                <div className="flex items-center gap-3.5 min-w-0 pl-1.5">
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs ${categoryStyle.iconBg}`}>
                    {item.icon === 'banks' && <Landmark className="w-5 h-5" />}
                    {item.icon === 'cash' && <Coins className="w-5 h-5" />}
                    {item.icon === 'inventory' && <Package className="w-5 h-5" />}
                    {item.icon === 'contractor' && <TrendingUp className="w-5 h-5" />}
                    {item.icon === 'receivable' && <Building className="w-5 h-5" />}
                    {item.icon === 'payables' && <Building2 className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate">
                        {item.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleItemMask(item.id)}
                        className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                        title={isMasked ? 'Reveal balance' : 'Hide balance'}
                      >
                        {isMasked ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5 text-blue-600" />
                        )}
                      </button>
                    </div>

                    <div className="text-base sm:text-lg font-black text-slate-900 mt-0.5 tracking-tight truncate">
                      {isMasked ? item.maskedValue : item.actualValue}
                    </div>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:bg-slate-50 transition-all shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Analytics Section: Container Wise Forecast & Operating Expense */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Container Wise Forecast */}
        <section
          id="container-wise-forecast-section"
          className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4 flex flex-col justify-between"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
                CONTAINER ANALYTICS
              </span>
              <h2 className="text-base sm:text-lg font-black text-[#1e293b] tracking-tight">
                Container Wise Forecast
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={forecastDuration}
                  onChange={(e) => setForecastDuration(e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 py-1 pl-2.5 pr-6 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="Current Year">Current Year</option>
                  <option value="Previous Year">Previous Year</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                type="button"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#3b82f6]" />
              <span className="font-semibold text-slate-600">Delivered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#10b981]" />
              <span className="font-semibold text-slate-600">Confirmed</span>
            </div>
          </div>

          {/* High Precision SVG Bar Chart */}
          <div className="relative h-56 w-full pt-4">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[80, 60, 40, 20, 0].map((val) => (
                <div key={val} className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                  <span className="w-5 text-right">{val}</span>
                  <div className="flex-1 border-b border-slate-100" />
                </div>
              ))}
            </div>

            {/* Bars */}
            <div className="absolute inset-x-7 bottom-5 top-2 flex items-end justify-between gap-1 sm:gap-2">
              {CONTAINER_WISE_FORECAST_DATA.map((item) => {
                const maxVal = 80;
                const deliveredHeight = Math.min(100, (item.delivered / maxVal) * 100);
                const confirmedHeight = Math.min(100, (item.confirmed / maxVal) * 100);
                const isHovered = hoveredBarMonth === item.month;

                return (
                  <div
                    key={item.month}
                    onMouseEnter={() => setHoveredBarMonth(item.month)}
                    onMouseLeave={() => setHoveredBarMonth(null)}
                    className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer relative"
                  >
                    {/* Hover Tooltip */}
                    {isHovered && (
                      <div className="absolute bottom-full mb-1 z-30 px-2 py-1 text-[10px] font-bold text-white bg-slate-900 rounded-md shadow-md whitespace-nowrap">
                        {item.month}: Delivered {item.delivered} | Confirmed {item.confirmed}
                      </div>
                    )}

                    <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-full">
                      {/* Delivered Bar */}
                      <div
                        style={{ height: `${deliveredHeight}%` }}
                        className="w-1/2 max-w-[12px] bg-[#3b82f6] rounded-t-xs transition-all group-hover:brightness-110"
                      />
                      {/* Confirmed Bar */}
                      <div
                        style={{ height: `${confirmedHeight}%` }}
                        className="w-1/2 max-w-[12px] bg-[#10b981] rounded-t-xs transition-all group-hover:brightness-110"
                      />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 mt-1 uppercase">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Chart 2: Operating Expense Intelligence */}
        <section
          id="operating-expense-section"
          className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
                EXPENSE INTELLIGENCE
              </span>
              <h2 className="text-base sm:text-lg font-black text-[#1e293b] tracking-tight">
                Operating Expense
              </h2>
            </div>

            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Year-over-year
            </span>
          </div>

          {/* Donut Chart and Metrics Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
            {/* Donut Chart SVG */}
            <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth="12"
                />
                {/* 2026 Ring: 8.88% of circumference (2 * pi * 38 = 238.76) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#2563eb"
                  strokeWidth="12"
                  strokeDasharray={`${(8.88 / 100) * 238.76} 238.76`}
                  strokeLinecap="round"
                />
                {/* 2025 Ring: 0.02% (subtle tick) */}
                <circle
                  cx="50"
                  cy="50"
                  r="28"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="6"
                  strokeDasharray={`${(0.02 / 100) * 175.93 + 1} 175.93`}
                  strokeLinecap="round"
                />
              </svg>

              {/* Donut Center Labels */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-slate-400">2026</span>
                <span className="text-base font-black text-slate-900">8.88%</span>
                <span className="text-[10px] text-slate-400">2025: 0.02%</span>
              </div>
            </div>

            {/* Metrics List */}
            <div className="space-y-3.5 w-full max-w-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
                    <span className="text-xs font-semibold text-slate-600">
                      {OPERATING_EXPENSE_DATA.currentYearLabel}
                    </span>
                  </div>
                  <span className="text-sm font-black text-slate-900">
                    {OPERATING_EXPENSE_DATA.currentYearValue}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                    <span className="text-xs font-semibold text-slate-600">
                      {OPERATING_EXPENSE_DATA.previousYearLabel}
                    </span>
                  </div>
                  <span className="text-sm font-black text-slate-900">
                    {OPERATING_EXPENSE_DATA.previousYearValue}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-200/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                  <span className="text-xs font-bold text-slate-700">
                    {OPERATING_EXPENSE_DATA.changeLabel}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-black bg-rose-100 text-rose-700">
                    {OPERATING_EXPENSE_DATA.changeTag}
                  </span>
                  <span className="text-xs font-bold text-rose-600">
                    {OPERATING_EXPENSE_DATA.changeValue}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 4. Section: Pending Payments */}
      <section
        id="finance-pending-payments-section"
        className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5 space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-[#1e293b] tracking-tight">
              Pending Payments
            </h2>
            <div className="relative inline-flex items-center">
              <button
                type="button"
                onMouseEnter={() => setActiveTooltip('pending-payments-info')}
                onMouseLeave={() => setActiveTooltip(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <Info className="w-4 h-4" />
              </button>
              {activeTooltip === 'pending-payments-info' && (
                <div className="absolute left-0 bottom-full mb-1 z-30 px-2 py-1 text-[10px] font-medium text-white bg-slate-900 rounded-md shadow-md whitespace-nowrap">
                  Outstanding receivables and payment follow-ups
                </div>
              )}
            </div>
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

            {/* Filters */}
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
                  <div className="font-bold text-slate-800 px-2 py-1">Quick Filters</div>
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50"
                  >
                    All Payments
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 font-medium"
                  >
                    Negative Balances
                  </button>
                </div>
              )}
            </div>

            {/* Columns */}
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

        {/* Pending Payments Table */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full text-xs text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600">
                <th className="py-2.5 px-3 w-8 text-center" aria-label="Toggle" />
                <th className="py-2.5 px-3 font-bold">Customer Name</th>
                <th className="py-2.5 px-3 font-bold text-right">Total Invoice Amount</th>
                <th className="py-2.5 px-3 font-bold text-right">Total Sale Return Amount</th>
                <th className="py-2.5 px-3 font-bold text-right">Total JV Adj. Amount</th>
                <th className="py-2.5 px-3 font-bold text-right">Remaining Advance</th>
                <th className="py-2.5 px-3 font-bold text-right">Total Remaining Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPayments.map((item) => {
                const isExpanded = Boolean(expandedPaymentRows[item.id]);

                return (
                  <React.Fragment key={item.id}>
                    <tr className={`hover:bg-slate-50/70 transition-colors ${isExpanded ? 'bg-slate-50/50' : ''}`}>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => togglePaymentRow(item.id)}
                          className="w-5 h-5 rounded-md flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-slate-200/60 cursor-pointer"
                        >
                          {isExpanded ? (
                            <Minus className="w-3.5 h-3.5" />
                          ) : (
                            <Plus className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-blue-600 hover:underline cursor-pointer">
                        {item.customerName}
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold text-slate-800">
                        {item.totalInvoiceAmount}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-600">
                        {item.totalSaleReturnAmount}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-600">
                        {item.totalJvAdjAmount}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-600">
                        {item.remainingAdvance}
                      </td>
                      <td
                        className={`py-2.5 px-3 text-right font-black ${
                          item.isNegative ? 'text-rose-600' : 'text-slate-900'
                        }`}
                      >
                        {item.totalRemainingAmount}
                      </td>
                    </tr>

                    {/* Accordion breakdown for customer details */}
                    {isExpanded && (
                      <tr className="bg-slate-50/90 border-y border-slate-200/70">
                        <td className="py-2 px-3" />
                        <td colSpan={6} className="py-2.5 px-3">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] bg-white p-2.5 rounded-lg border border-slate-200/60">
                            <div>
                              <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Status</span>
                              <span className={`font-bold ${item.isNegative ? 'text-rose-600' : 'text-emerald-600'}`}>
                                {item.isNegative ? 'Overpaid / Negative' : 'Pending Clearance'}
                              </span>
                            </div>
                            <div>
                              <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Currency</span>
                              <span className="font-semibold text-slate-700">USD</span>
                            </div>
                            <div>
                              <span className="text-[9.5px] uppercase font-bold text-slate-400 block">JV Adjustments</span>
                              <span className="font-semibold text-slate-700">{item.totalJvAdjAmount}</span>
                            </div>
                            <div>
                              <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Net Remaining</span>
                              <span className={`font-black ${item.isNegative ? 'text-rose-600' : 'text-slate-900'}`}>
                                {item.totalRemainingAmount}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      </div>
    </div>
  );
};

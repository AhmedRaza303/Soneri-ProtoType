/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  FileCheck,
  List,
  UserCheck,
  DollarSign,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  X,
  LayoutDashboard,
  Ship,
  ShoppingCart,
  TrendingUp,
  Landmark,
  Layers,
} from 'lucide-react';
import { AppBar } from '../components/common/AppBar';
import { ContainerDualAxisChart } from '../components/dashboard/ContainerDualAxisChart';
import {
  DASHBOARD_METRIC_CARDS,
  CASH_FLOW_DATA,
  FORECAST_CHART_DATA,
  CUSTOMER_CHART_DATA,
  SUPPLIER_CHART_DATA,
  DELIVERY_PLACE_CHART_DATA,
  MARKETING_PERSONAL_CHART_DATA,
  PRODUCT_CHART_DATA,
  FORECAST_WITHOUT_TRACKING_ROWS,
} from '../data/dashboardAnalyticsData';
import { ExportDashboardScreen } from './ExportDashboardScreen';
import { PurchaseDashboardScreen } from './PurchaseDashboardScreen';
import { MarketingDashboardScreen } from './MarketingDashboardScreen';
import { FinanceDashboardScreen } from './FinanceDashboardScreen';
import { ScreenId } from '../types';
import { useTheme } from '../context/ThemeContext';

export type DashboardTab = 'overview' | 'export' | 'purchase' | 'marketing' | 'finance';

interface DashboardScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenDrawer: () => void;
  unreadNotificationsCount: number;
  initialTab?: DashboardTab;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  onOpenDrawer,
  unreadNotificationsCount,
  initialTab = 'overview',
}) => {
  const { isDark } = useTheme();
  const [activeDashboardTab, setActiveDashboardTab] = useState<DashboardTab>(initialTab);
  const [duration, setDuration] = useState('Current Year');
  const [selectedMobileChart, setSelectedMobileChart] = useState<
    'forecast' | 'customer' | 'supplier' | 'delivery' | 'marketing' | 'product' | 'all'
  >('forecast');

  // Keep active tab in sync if initialTab prop updates from navigation
  React.useEffect(() => {
    if (initialTab) {
      setActiveDashboardTab(initialTab);
    }
  }, [initialTab]);
  const [isCashFlowMasked, setIsCashFlowMasked] = useState(true);
  const [followUpPeriod, setFollowUpPeriod] = useState('Week');
  const [isProformaFinanceExpanded, setIsProformaFinanceExpanded] = useState(true);
  const [isExpenseVoucherExpanded, setIsExpenseVoucherExpanded] = useState(false);

  // Render metric card icon matching reference image
  const renderMetricIcon = (iconName: string) => {
    switch (iconName) {
      case 'user':
        return <Users className="w-5 h-5 text-white" />;
      case 'file':
        return <FileCheck className="w-5 h-5 text-white" />;
      case 'list':
        return <List className="w-5 h-5 text-white" />;
      case 'supplier':
        return <UserCheck className="w-5 h-5 text-white" />;
      default:
        return <Users className="w-5 h-5 text-white" />;
    }
  };

  return (
    <div className={`min-h-full pb-24 ${isDark ? 'bg-[#090d16] text-slate-100' : 'bg-[#f8fafc] text-slate-800'}`}>
      {/* Global Navigation Top Bar */}
      <AppBar
        title="SONERI ERP"
        subtitle="Business Management System"
        onMenuClick={onOpenDrawer}
        onNotificationsClick={() => onNavigate('notifications')}
        onProfileClick={() => onNavigate('profile')}
        unreadCount={unreadNotificationsCount}
      />

      {/* ========================================================================= */}
      {/* 1. MOBILE TAB NAVIGATION (md:hidden) - Modern Floating Capsule Bar         */}
      {/* ========================================================================= */}
      <nav
        aria-label="Mobile Module Navigation"
        className={`md:hidden ${
          isDark
            ? 'bg-[#0b101e]/95 border-slate-800/90'
            : 'bg-white/95 border-slate-200/90 shadow-2xs'
        } backdrop-blur-md border-b px-2.5 py-2 sticky top-14 z-30 overflow-x-auto transition-colors`}
      >
        <div className="flex items-center gap-1.5 min-w-max">
          <button
            type="button"
            id="mobile-nav-overview"
            onClick={() => setActiveDashboardTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeDashboardTab === 'overview'
                ? 'bg-blue-600 text-white shadow-xs'
                : isDark
                ? 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/60'
                : 'bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200/80 border border-slate-200/80'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>
          <button
            type="button"
            id="mobile-nav-export"
            onClick={() => setActiveDashboardTab('export')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeDashboardTab === 'export'
                ? 'bg-blue-600 text-white shadow-xs'
                : isDark
                ? 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/60'
                : 'bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200/80 border border-slate-200/80'
            }`}
          >
            <Ship className="w-3.5 h-3.5" />
            <span>Export</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeDashboardTab === 'export'
                  ? 'bg-white text-blue-900'
                  : isDark
                  ? 'bg-slate-700 text-slate-200'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              18
            </span>
          </button>
          <button
            type="button"
            id="mobile-nav-purchase"
            onClick={() => setActiveDashboardTab('purchase')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeDashboardTab === 'purchase'
                ? 'bg-blue-600 text-white shadow-xs'
                : isDark
                ? 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/60'
                : 'bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200/80 border border-slate-200/80'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Purchase</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeDashboardTab === 'purchase'
                  ? 'bg-white text-blue-900'
                  : isDark
                  ? 'bg-slate-700 text-slate-200'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              75
            </span>
          </button>
          <button
            type="button"
            id="mobile-nav-marketing"
            onClick={() => setActiveDashboardTab('marketing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeDashboardTab === 'marketing'
                ? 'bg-blue-600 text-white shadow-xs'
                : isDark
                ? 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/60'
                : 'bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200/80 border border-slate-200/80'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Marketing</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeDashboardTab === 'marketing'
                  ? 'bg-white text-blue-900'
                  : isDark
                  ? 'bg-slate-700 text-slate-200'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              144
            </span>
          </button>
          <button
            type="button"
            id="mobile-nav-finance"
            onClick={() => setActiveDashboardTab('finance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeDashboardTab === 'finance'
                ? 'bg-blue-600 text-white shadow-xs'
                : isDark
                ? 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/60'
                : 'bg-slate-100 text-slate-700 hover:text-slate-950 hover:bg-slate-200/80 border border-slate-200/80'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Finance</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                activeDashboardTab === 'finance'
                  ? 'bg-white text-blue-900'
                  : isDark
                  ? 'bg-slate-700 text-slate-200'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              39
            </span>
          </button>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 2. DESKTOP TAB NAVIGATION (hidden md:block) - Spacious Enterprise Bar     */}
      {/* ========================================================================= */}
      <nav aria-label="Desktop Module Navigation" className={`hidden md:block border-b px-6 py-2.5 shadow-2xs sticky top-14 z-30 transition-colors ${
        isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white border-slate-200/80'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className={`flex items-center gap-2 p-1 rounded-xl border transition-colors ${
            isDark ? 'bg-slate-800/80 border-slate-700/60' : 'bg-slate-100/90 border-slate-200/70'
          }`}>
            <button
              type="button"
              id="dashboard-tab-overview"
              onClick={() => setActiveDashboardTab('overview')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                activeDashboardTab === 'overview'
                  ? isDark
                    ? 'bg-slate-700 text-white shadow-xs border border-slate-600'
                    : 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : isDark
                  ? 'text-slate-300 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              id="dashboard-tab-export"
              onClick={() => setActiveDashboardTab('export')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                activeDashboardTab === 'export'
                  ? isDark
                    ? 'bg-slate-700 text-white shadow-xs border border-slate-600'
                    : 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : isDark
                  ? 'text-slate-300 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Export</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold border ${
                isDark ? 'bg-blue-900/50 text-blue-300 border-blue-700/50' : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                18
              </span>
            </button>
            <button
              type="button"
              id="dashboard-tab-purchase"
              onClick={() => setActiveDashboardTab('purchase')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                activeDashboardTab === 'purchase'
                  ? isDark
                    ? 'bg-slate-700 text-white shadow-xs border border-slate-600'
                    : 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : isDark
                  ? 'text-slate-300 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Purchase</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold border ${
                isDark ? 'bg-blue-900/50 text-blue-300 border-blue-700/50' : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                75
              </span>
            </button>
            <button
              type="button"
              id="dashboard-tab-marketing"
              onClick={() => setActiveDashboardTab('marketing')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                activeDashboardTab === 'marketing'
                  ? isDark
                    ? 'bg-slate-700 text-white shadow-xs border border-slate-600'
                    : 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : isDark
                  ? 'text-slate-300 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Marketing</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold border ${
                isDark ? 'bg-blue-900/50 text-blue-300 border-blue-700/50' : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                144
              </span>
            </button>
            <button
              type="button"
              id="dashboard-tab-finance"
              onClick={() => setActiveDashboardTab('finance')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                activeDashboardTab === 'finance'
                  ? isDark
                    ? 'bg-slate-700 text-white shadow-xs border border-slate-600'
                    : 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : isDark
                  ? 'text-slate-300 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Finance</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold border ${
                isDark ? 'bg-blue-900/50 text-blue-300 border-blue-700/50' : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                39
              </span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-3 py-3 sm:px-6 sm:py-6 space-y-4 sm:space-y-6">
        {/* Render Tab 1: OVERVIEW DASHBOARD */}
        {activeDashboardTab === 'overview' && (
          <div>
            {/* ================================================================= */}
            {/* 1. MOBILE EXPERIENCE (md:hidden) - High-End Executive Mobile App  */}
            {/* ================================================================= */}
            <div className="md:hidden space-y-3.5">
              {/* SMART COMPONENT 1: Executive Command Hub */}
              {/* Unifies Header, Duration, Cash Flow & 4 Operational Metrics into ONE sleek, compact card */}
              <div
                className={`rounded-3xl p-4 border relative overflow-hidden transition-colors ${
                  isDark
                    ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-xl border-slate-800/80'
                    : 'bg-white text-slate-900 shadow-xs border-slate-200/90'
                }`}
              >
                {/* Ambient glow accent (only in dark mode) */}
                {isDark && (
                  <>
                    <div className="absolute -top-12 -right-12 w-44 h-44 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                  </>
                )}

                {/* Mobile Header Row with Duration Selector */}
                <div className={`relative z-10 flex items-center justify-between gap-2 pb-3 mb-3 border-b ${
                  isDark ? 'border-white/10' : 'border-slate-100'
                }`}>
                  <div>
                    <span className={`text-[10px] font-black tracking-widest uppercase block ${
                      isDark ? 'text-indigo-400' : 'text-indigo-600'
                    }`}>
                      OVERVIEW
                    </span>
                    <h1 className={`text-lg font-black tracking-tight ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      Dashboard
                    </h1>
                  </div>

                  {/* Duration Selector */}
                  <div className={`relative rounded-xl px-2.5 py-1.5 shadow-xs flex items-center border transition-colors ${
                    isDark
                      ? 'bg-white/10 hover:bg-white/15 border-white/15 backdrop-blur-md text-slate-100'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                  }`}>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className={`appearance-none bg-transparent text-xs font-bold pr-5 focus:outline-none cursor-pointer ${
                        isDark ? 'text-slate-100' : 'text-slate-800'
                      }`}
                    >
                      <option value="Current Year" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>Current Year</option>
                      <option value="Previous Year" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>Previous Year</option>
                      <option value="All Time" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>All Time</option>
                      <option value="Current Quarter" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>Current Quarter</option>
                      <option value="Current Month" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>Current Month</option>
                    </select>
                    <ChevronDown className={`w-3.5 h-3.5 absolute right-1.5 pointer-events-none ${
                      isDark ? 'text-slate-300' : 'text-slate-400'
                    }`} />
                  </div>
                </div>

                {/* Hero Cash Flow Section */}
                <div className={`relative z-10 rounded-2xl p-3 mb-3.5 border transition-colors ${
                  isDark
                    ? 'bg-white/5 border-white/10 backdrop-blur-sm'
                    : 'bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-white border-emerald-200/80'
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                        isDark
                          ? 'bg-emerald-400/20 border border-emerald-400/30 text-emerald-300'
                          : 'bg-emerald-100 border border-emerald-200 text-emerald-700'
                      }`}>
                        <DollarSign className="w-4 h-4" />
                      </div>
                      <div>
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${
                          isDark ? 'text-emerald-300' : 'text-emerald-700'
                        }`}>
                          Cash Flow
                        </span>
                        <span className={`text-[9.5px] ${isDark ? 'text-slate-400' : 'text-slate-500 font-medium'}`}>{duration}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsCashFlowMasked(!isCashFlowMasked)}
                      className={`p-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isDark
                          ? 'bg-white/10 hover:bg-white/20 border-white/15 text-slate-200'
                          : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-2xs'
                      }`}
                      title={isCashFlowMasked ? 'Reveal Cash Flow' : 'Mask Cash Flow'}
                    >
                      {isCashFlowMasked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className={`text-2xl font-black tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {isCashFlowMasked ? CASH_FLOW_DATA.maskedValue : CASH_FLOW_DATA.actualValue}
                  </div>
                </div>

                {/* Integrated Operational Volume 2x2 Grid */}
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      <h2 className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Operational Volume</h2>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                      isDark
                        ? 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      Live Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {DASHBOARD_METRIC_CARDS.map((card) => (
                      <div
                        key={card.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-colors ${
                          isDark
                            ? 'bg-white/5 border-white/10'
                            : 'bg-slate-50/90 hover:bg-slate-100/80 border-slate-200/80'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: card.color }}
                          >
                            {renderMetricIcon(card.iconName)}
                          </div>
                          <div className="min-w-0">
                            <span className={`text-[11px] font-bold block truncate leading-tight ${
                              isDark ? 'text-slate-200' : 'text-slate-700'
                            }`}>
                              {card.label}
                            </span>
                            <span className={`text-[9px] block leading-tight ${
                              isDark ? 'text-slate-400' : 'text-slate-400'
                            }`}>
                              Standard metric
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`text-sm font-black ${
                            isDark ? 'text-white' : 'text-slate-900'
                          }`}>
                            {card.value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SMART COMPONENT 2: Container Analytics Suite with Interactive Segmented Pill Tabs */}
              <div className={`${isDark ? 'bg-[#111726] border-slate-800/80 shadow-xs' : 'bg-white border-slate-200/80 shadow-xs'} rounded-3xl border p-3.5 space-y-3`}>
                <div className={`flex items-center justify-between pb-2 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    <h2 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                      Container Analytics
                    </h2>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isDark ? 'text-indigo-300 bg-indigo-950/60 border-indigo-800/60' : 'text-indigo-600 bg-indigo-50 border-indigo-100'}`}>
                    {selectedMobileChart === 'all' ? 'All 6 Charts' : '1 of 6 Active'}
                  </span>
                </div>

                {/* Sleek Horizontal Segmented Filter Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
                  {[
                    { id: 'forecast', label: 'Forecast' },
                    { id: 'customer', label: 'Customer' },
                    { id: 'supplier', label: 'Supplier' },
                    { id: 'delivery', label: 'Delivery' },
                    { id: 'marketing', label: 'Marketing' },
                    { id: 'product', label: 'Product' },
                    { id: 'all', label: 'All 6' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedMobileChart(tab.id as typeof selectedMobileChart)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                        selectedMobileChart === tab.id
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : isDark
                          ? 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/60'
                          : 'bg-slate-100/80 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 border border-slate-200/50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Active Chart Presentation */}
                <div className="space-y-3.5 pt-1">
                  {(selectedMobileChart === 'forecast' || selectedMobileChart === 'all') && (
                    <ContainerDualAxisChart
                      id="mobile-chart-forecast"
                      title="Container Wise Forecast"
                      data={FORECAST_CHART_DATA}
                      maxLeft={80}
                      maxRight={500000}
                      onViewAll={() => {}}
                    />
                  )}
                  {(selectedMobileChart === 'customer' || selectedMobileChart === 'all') && (
                    <ContainerDualAxisChart
                      id="mobile-chart-customer"
                      title="Customer Wise Container"
                      data={CUSTOMER_CHART_DATA}
                      maxLeft={60}
                      maxRight={500000}
                      onViewAll={() => {}}
                    />
                  )}
                  {(selectedMobileChart === 'supplier' || selectedMobileChart === 'all') && (
                    <ContainerDualAxisChart
                      id="mobile-chart-supplier"
                      title="Supplier Wise Container"
                      data={SUPPLIER_CHART_DATA}
                      maxLeft={200}
                      maxRight={1000000}
                      onViewAll={() => {}}
                    />
                  )}
                  {(selectedMobileChart === 'delivery' || selectedMobileChart === 'all') && (
                    <ContainerDualAxisChart
                      id="mobile-chart-delivery-place"
                      title="Place of Delivery Wise Container"
                      data={DELIVERY_PLACE_CHART_DATA}
                      maxLeft={60}
                      maxRight={600000}
                      onViewAll={() => {}}
                    />
                  )}
                  {(selectedMobileChart === 'marketing' || selectedMobileChart === 'all') && (
                    <ContainerDualAxisChart
                      id="mobile-chart-marketing-personal"
                      title="Marketing Personal Wise Container"
                      data={MARKETING_PERSONAL_CHART_DATA}
                      maxLeft={250}
                      maxRight={2000000}
                      onViewAll={() => {}}
                    />
                  )}
                  {(selectedMobileChart === 'product' || selectedMobileChart === 'all') && (
                    <ContainerDualAxisChart
                      id="mobile-chart-product"
                      title="Product Wise Container"
                      data={PRODUCT_CHART_DATA}
                      maxLeft={70}
                      maxRight={350000}
                      onViewAll={() => {}}
                    />
                  )}
                </div>
              </div>

              {/* SMART COMPONENT 3: Operations & Pipeline Hub (Follow-Up & Forecast Without Tracking Unified) */}
              <div className={`${isDark ? 'bg-[#111726] border-slate-800/80 shadow-xs' : 'bg-white border-slate-200/80 shadow-xs'} rounded-3xl border p-4 space-y-4`}>
                {/* Follow Up Sub-Module */}
                <div className="space-y-2.5">
                  <div className={`flex items-center justify-between pb-2 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      <h2 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                        Follow Up
                      </h2>
                    </div>
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold shadow-2xs border ${
                      isDark ? 'bg-slate-800/80 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200/80 text-slate-700'
                    }`}>
                      <span>{followUpPeriod}</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className={`border rounded-2xl overflow-hidden ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200/70 bg-slate-50/50'}`}>
                      <button
                        type="button"
                        onClick={() => setIsProformaFinanceExpanded(!isProformaFinanceExpanded)}
                        className={`w-full px-3 py-2.5 flex items-center justify-between text-left transition-colors ${
                          isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-100/60'
                        }`}
                      >
                        <span className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          <span>Proforma Finance</span>
                          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                            isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
                          }`}>0</span>
                        </span>
                        {isProformaFinanceExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </button>
                      {isProformaFinanceExpanded && (
                        <div className={`p-3 text-center text-xs border-t ${
                          isDark ? 'text-slate-400 bg-[#0d1322] border-slate-800' : 'text-slate-400 bg-white border-slate-200/60'
                        }`}>
                          No follow-ups scheduled for this reference yet.
                        </div>
                      )}
                    </div>

                    <div className={`border rounded-2xl overflow-hidden ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200/70 bg-slate-50/50'}`}>
                      <button
                        type="button"
                        onClick={() => setIsExpenseVoucherExpanded(!isExpenseVoucherExpanded)}
                        className={`w-full px-3 py-2.5 flex items-center justify-between text-left transition-colors ${
                          isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-100/60'
                        }`}
                      >
                        <span className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                          <span>Expense Voucher</span>
                          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                            isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
                          }`}>0</span>
                        </span>
                        {isExpenseVoucherExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </button>
                      {isExpenseVoucherExpanded && (
                        <div className={`p-3 text-center text-xs border-t ${
                          isDark ? 'text-slate-400 bg-[#0d1322] border-slate-800' : 'text-slate-400 bg-white border-slate-200/60'
                        }`}>
                          No follow-ups scheduled for this reference yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Forecast Without Tracking Sub-Module (Grouped Modern Rows) */}
                <div className={`pt-2 border-t space-y-2.5 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <h2 className={`text-xs font-black uppercase tracking-wider leading-tight ${
                        isDark ? 'text-slate-100' : 'text-slate-900'
                      }`}>
                        Forecast Without Tracking
                      </h2>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isDark ? 'text-slate-300 bg-slate-800/80 border-slate-700' : 'text-slate-600 bg-slate-100 border-slate-200'
                    }`}>
                      {FORECAST_WITHOUT_TRACKING_ROWS.length} Months
                    </span>
                  </div>

                  <div className="space-y-2">
                    {FORECAST_WITHOUT_TRACKING_ROWS.map((row, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-2xl border space-y-2 transition-all ${
                          isDark
                            ? 'bg-[#141b2d] border-slate-800/90 hover:bg-[#182137]'
                            : 'bg-slate-50/70 border-slate-200/70 hover:bg-white hover:shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{row.shipmentMonths}</span>
                          <span className={`font-mono text-xs font-black px-2 py-0.5 rounded-lg border ${
                            isDark
                              ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60'
                              : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                          }`}>
                            {row.projectedProfit}
                          </span>
                        </div>
                        <div className={`grid grid-cols-3 gap-2 text-[10.5px] pt-1.5 border-t ${
                          isDark ? 'border-slate-800' : 'border-slate-200/60'
                        }`}>
                          <div className={`rounded-lg p-1.5 border ${
                            isDark ? 'bg-[#0e1422] border-slate-800/70' : 'bg-white/80 border-slate-200/50'
                          }`}>
                            <span className="text-slate-400 block text-[9.5px]">Total</span>
                            <span className="font-black text-blue-500">{row.totalNoContainers}</span>
                          </div>
                          <div className={`rounded-lg p-1.5 border ${
                            isDark ? 'bg-[#0e1422] border-slate-800/70' : 'bg-white/80 border-slate-200/50'
                          }`}>
                            <span className="text-slate-400 block text-[9.5px]">Delivered</span>
                            <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{row.deliveredContainers}</span>
                          </div>
                          <div className={`rounded-lg p-1.5 border ${
                            isDark ? 'bg-[#0e1422] border-slate-800/70' : 'bg-white/80 border-slate-200/50'
                          }`}>
                            <span className="text-slate-400 block text-[9.5px]">Confirmed</span>
                            <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{row.confirmedUndelivered}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ================================================================= */}
            {/* 2. WEB / DESKTOP EXPERIENCE (hidden md:block)                     */}
            {/* ================================================================= */}
            <div className="hidden md:block space-y-6">
            {/* Header & Duration Selector Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div>
                <span className="text-[10px] sm:text-xs font-bold tracking-wider text-slate-400 uppercase block">
                  OVERVIEW
                </span>
                <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Dashboard
                </h1>
              </div>

              {/* Duration Selector */}
              <div className={`flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 rounded-xl border shadow-2xs transition-colors ${
                isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80'
              }`}>
                <span className="text-xs font-semibold text-slate-400">Duration:</span>
                <div className="relative">
                  <select
                    id="dashboard-duration-select"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className={`appearance-none bg-transparent text-xs sm:text-sm font-bold pr-6 focus:outline-none cursor-pointer ${
                      isDark ? 'text-slate-100' : 'text-slate-800'
                    }`}
                  >
                    <option value="Current Year" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>Current Year</option>
                    <option value="Previous Year" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>Previous Year</option>
                    <option value="All Time" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>All Time</option>
                    <option value="Current Quarter" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>Current Quarter</option>
                    <option value="Current Month" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>Current Month</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* EXECUTIVE METRICS & CASH FLOW HUB - Modern Cards */}
            <div className="space-y-3 sm:space-y-4">
              {/* Row 1: 4 Independent Operational Volume Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                {DASHBOARD_METRIC_CARDS.map((card) => (
                  <div
                    key={card.id}
                    id={`metric-${card.id}`}
                    className={`rounded-2xl border shadow-xs p-3.5 sm:p-5 relative overflow-hidden transition-all flex flex-col justify-between ${
                      isDark
                        ? 'bg-slate-900/90 border-slate-800/80 hover:border-slate-700'
                        : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    {/* Top colored accent indicator */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{ backgroundColor: card.accentColor }}
                    />

                    <div className="flex items-start justify-between gap-1.5 mb-2 sm:mb-3">
                      <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider line-clamp-1">
                        {card.label}
                      </span>
                      <div
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                        style={{ backgroundColor: card.color }}
                      >
                        {renderMetricIcon(card.iconName)}
                      </div>
                    </div>

                    <div>
                      <div className={`text-xl sm:text-3xl font-black tracking-tight ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {card.value}
                      </div>
                      <div className={`flex items-center gap-1 mt-1.5 pt-1.5 border-t ${
                        isDark ? 'border-slate-800' : 'border-slate-100'
                      }`}>
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: card.accentColor }}
                        />
                        <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 truncate">
                          Live Active
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Row 2: CASH FLOW Financial Hub - Featured Executive Card */}
              <div
                id="metric-cash-flow"
                className={`rounded-2xl border shadow-xs p-4 sm:p-5 relative overflow-hidden transition-colors ${
                  isDark
                    ? 'bg-slate-900/90 border-emerald-900/40'
                    : 'bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-white bg-white border-emerald-200/80'
                }`}
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs border ${
                      isDark
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                        : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                    }`}>
                      <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          {CASH_FLOW_DATA.label}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          isDark
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          Verified
                        </span>
                      </div>
                      <div className={`text-xl sm:text-2xl font-black tracking-tight mt-0.5 ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}>
                        {isCashFlowMasked ? CASH_FLOW_DATA.maskedValue : CASH_FLOW_DATA.actualValue}
                      </div>
                    </div>
                  </div>

                  <div className={`flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 ${
                    isDark ? 'border-slate-800' : 'border-slate-100'
                  }`}>
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-semibold text-slate-400 block">Period</span>
                      <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{duration}</span>
                    </div>
                    <button
                      type="button"
                      title={isCashFlowMasked ? 'Show cash flow' : 'Hide cash flow'}
                      onClick={() => setIsCashFlowMasked(!isCashFlowMasked)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer min-h-[40px] border ${
                        isDark
                          ? 'bg-slate-800/90 border-slate-700 text-slate-200 hover:bg-slate-700'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {isCashFlowMasked ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                          <span>Show Value</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Hide Value</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* CONTAINER ANALYTICS - Charts Suite */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
                    ANALYTICS SUITE
                  </span>
                  <h2 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Container Analytics
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Chart 1: Container Wise Forecast */}
                <ContainerDualAxisChart
                  id="chart-forecast"
                  title="Container Wise Forecast"
                  data={FORECAST_CHART_DATA}
                  maxLeft={80}
                  maxRight={500000}
                  onViewAll={() => {}}
                />

                {/* Chart 2: Customer Wise Container */}
                <ContainerDualAxisChart
                  id="chart-customer"
                  title="Customer Wise Container"
                  data={CUSTOMER_CHART_DATA}
                  maxLeft={60}
                  maxRight={500000}
                  onViewAll={() => {}}
                />

                {/* Chart 3: Supplier Wise Container */}
                <ContainerDualAxisChart
                  id="chart-supplier"
                  title="Supplier Wise Container"
                  data={SUPPLIER_CHART_DATA}
                  maxLeft={200}
                  maxRight={1000000}
                  onViewAll={() => {}}
                />

                {/* Chart 4: Place of Delivery Wise Container */}
                <ContainerDualAxisChart
                  id="chart-delivery-place"
                  title="Place of Delivery Wise Container"
                  data={DELIVERY_PLACE_CHART_DATA}
                  maxLeft={60}
                  maxRight={600000}
                  onViewAll={() => {}}
                />

                {/* Chart 5: Marketing Personal Wise Container */}
                <ContainerDualAxisChart
                  id="chart-marketing-personal"
                  title="Marketing Personal Wise Container"
                  data={MARKETING_PERSONAL_CHART_DATA}
                  maxLeft={250}
                  maxRight={2000000}
                  onViewAll={() => {}}
                />

                {/* Chart 6: Product Wise Container */}
                <ContainerDualAxisChart
                  id="chart-product"
                  title="Product Wise Container"
                  data={PRODUCT_CHART_DATA}
                  maxLeft={70}
                  maxRight={350000}
                  onViewAll={() => {}}
                />
              </div>
            </div>

            {/* LOWER SECTION: Follow Up & Container Wise Forecast Without Tracking */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Left Panel: Follow Up */}
              <div
                id="card-follow-up"
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Header: Title & Week Filter Dropdown */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      Follow Up
                    </h3>
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs">
                      <span>{followUpPeriod}</span>
                      <button
                        type="button"
                        onClick={() => setFollowUpPeriod('Week')}
                        className="text-slate-400 hover:text-slate-600 ml-1 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Accordion 1: Proforma Finance(0) */}
                  <div className="border border-slate-200/80 rounded-xl overflow-hidden transition-colors">
                    <button
                      type="button"
                      onClick={() => setIsProformaFinanceExpanded(!isProformaFinanceExpanded)}
                      className="w-full px-4 py-3 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 transition-colors text-left cursor-pointer"
                    >
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        Proforma Finance<sup className="text-[10px] text-slate-400 ml-0.5">(0)</sup>
                      </span>
                      {isProformaFinanceExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                    {isProformaFinanceExpanded && (
                      <div className="p-5 text-center text-xs text-slate-400 bg-white">
                        No follow-ups scheduled for this reference yet.
                      </div>
                    )}
                  </div>

                  {/* Accordion 2: Expense Voucher(0) */}
                  <div className="border border-slate-200/80 rounded-xl overflow-hidden transition-colors">
                    <button
                      type="button"
                      onClick={() => setIsExpenseVoucherExpanded(!isExpenseVoucherExpanded)}
                      className="w-full px-4 py-3 flex items-center justify-between bg-slate-50/70 hover:bg-slate-100/70 transition-colors text-left cursor-pointer"
                    >
                      <span className="text-xs sm:text-sm font-bold text-slate-800">
                        Expense Voucher<sup className="text-[10px] text-slate-400 ml-0.5">(0)</sup>
                      </span>
                      {isExpenseVoucherExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                    {isExpenseVoucherExpanded && (
                      <div className="p-5 text-center text-xs text-slate-400 bg-white">
                        No follow-ups scheduled for this reference yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom View All link */}
                <div className="pt-4 text-center border-t border-slate-100 mt-4">
                  <button
                    type="button"
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Panel: Container Wise Forecast Without Tracking Table */}
              <div
                id="card-forecast-table"
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Header */}
                  <div className="pb-3 border-b border-slate-100">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      Container Wise Forecast Without Tracking
                    </h3>
                  </div>

                  {/* Responsive Table */}
                  <div className="overflow-x-auto mt-3 -mx-2 sm:mx-0">
                    <table className="w-full text-xs text-left border-collapse min-w-[480px]">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700">
                          <th className="py-2.5 px-3 font-bold">Shipment Months</th>
                          <th className="py-2.5 px-3 font-bold text-center">Total No. Containers</th>
                          <th className="py-2.5 px-3 font-bold text-center">Delivered Containers</th>
                          <th className="py-2.5 px-3 font-bold text-center">
                            Confirmed / Un-delivered Containers
                          </th>
                          <th className="py-2.5 px-3 font-bold text-right">Projected Profit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {FORECAST_WITHOUT_TRACKING_ROWS.map((row, index) => (
                          <tr key={index} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-2.5 px-3 font-bold text-slate-800">
                              {row.shipmentMonths}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button
                                type="button"
                                className="font-bold text-blue-600 hover:underline cursor-pointer"
                              >
                                {row.totalNoContainers}
                              </button>
                            </td>
                            <td className="py-2.5 px-3 text-center font-medium">
                              {row.deliveredContainers}
                            </td>
                            <td className="py-2.5 px-3 text-center font-medium">
                              {row.confirmedUndelivered}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                              {row.projectedProfit}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Bottom View All link */}
                <div className="pt-4 text-center border-t border-slate-100 mt-4">
                  <button
                    type="button"
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
            </div>
          </div>
        )}

        {/* Render Tab 2: EXPORT DASHBOARD PAGE */}
        {activeDashboardTab === 'export' && <ExportDashboardScreen />}

        {/* Render Tab 3: PURCHASE DASHBOARD PAGE */}
        {activeDashboardTab === 'purchase' && <PurchaseDashboardScreen />}

        {/* Render Tab 4: MARKETING DASHBOARD PAGE */}
        {activeDashboardTab === 'marketing' && <MarketingDashboardScreen />}

        {/* Render Tab 5: FINANCE DASHBOARD PAGE */}
        {activeDashboardTab === 'finance' && <FinanceDashboardScreen />}
      </main>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Attractive mobile journey dashboards for Overview / Export / Purchase / Marketing / Finance
 */

import React, { useMemo, useState } from 'react';
import {
  BellRing,
  Building2,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock,
  Coins,
  CreditCard,
  Eye,
  EyeOff,
  FileBadge2,
  FileCheck,
  FileCheck2,
  FileSearch,
  FileSignature,
  FileText,
  Filter,
  Info,
  Landmark,
  Layers,
  List,
  MessageSquare,
  Package,
  Palette,
  Receipt,
  Search,
  Send,
  Ship,
  ShoppingCart,
  TrendingUp,
  Truck,
  UserCheck,
  Users,
  X,
  BarChart3,
  Table2,
} from 'lucide-react';
import {
  DashHero,
  DashKpi,
  DashListCard,
  DashMetricCard,
  DashMetricGrid,
  DashPill,
  DashScrollRow,
  DashSection,
  DashShell,
  DashTaskTile,
  DashCriteriaTip,
} from './DashboardChrome';
import { ContainerDualAxisChart } from './ContainerDualAxisChart';
import {
  CASH_FLOW_DATA,
  CUSTOMER_CHART_DATA,
  DASHBOARD_METRIC_CARDS,
  DELIVERY_PLACE_CHART_DATA,
  FORECAST_CHART_DATA,
  FORECAST_WITHOUT_TRACKING_ROWS,
  MARKETING_PERSONAL_CHART_DATA,
  PRODUCT_CHART_DATA,
  SUPPLIER_CHART_DATA,
} from '../../data/dashboardAnalyticsData';
import {
  EXPORT_FOLLOW_UPS,
  EXPORT_TASKS,
  MARKETING_PERSONNEL_OPTIONS,
} from '../../data/exportDashboardData';
import {
  CURRENT_MONTH_PERFORMANCE,
  DELAYED_ORDERS,
  DELAYED_ORDERS_CRITERIA,
  NEXT_MONTH_SUMMARY,
  PURCHASE_TASKS,
  type PurchaseCriteria,
} from '../../data/purchaseDashboardData';
import {
  MARKETING_FOLLOW_UPS,
  MARKETING_PERSONNEL_OPTIONS as MARKETING_DASH_PERSONNEL_OPTIONS,
  MARKETING_TASKS,
  PERFORMANCE_SUMMARY,
  RECENT_DELIVERED_ORDERS,
} from '../../data/marketingDashboardData';
import {
  CONTAINER_WISE_FORECAST_DATA,
  FINANCE_BALANCE_ITEMS,
  FINANCE_TASKS,
  OPERATING_EXPENSE_DATA,
  PENDING_PAYMENTS_CRITERIA,
  PENDING_PAYMENTS_DATA,
} from '../../data/financeDashboardData';

/* ------------------------------------------------------------------ */
/* Overview                                                             */
/* ------------------------------------------------------------------ */

export const OverviewDashboardJourney: React.FC = () => {
  const [cashMasked, setCashMasked] = useState(true);
  const [followPeriod, setFollowPeriod] = useState<'Week' | 'Month'>('Week');
  const [selectedChart, setSelectedChart] = useState<
    'forecast' | 'customer' | 'supplier' | 'delivery' | 'marketing' | 'product'
  >('forecast');

  const chartTabs = [
    { id: 'forecast' as const, label: 'Forecast' },
    { id: 'customer' as const, label: 'Customer' },
    { id: 'supplier' as const, label: 'Supplier' },
    { id: 'delivery' as const, label: 'Delivery' },
    { id: 'marketing' as const, label: 'Marketing' },
    { id: 'product' as const, label: 'Product' },
  ];

  const overviewCharts = [
    {
      id: 'forecast' as const,
      title: 'Container Wise Forecast',
      data: FORECAST_CHART_DATA,
      maxLeft: 80,
      maxRight: 500000,
    },
    {
      id: 'customer' as const,
      title: 'Customer Wise Container',
      data: CUSTOMER_CHART_DATA,
      maxLeft: 60,
      maxRight: 500000,
    },
    {
      id: 'supplier' as const,
      title: 'Supplier Wise Container',
      data: SUPPLIER_CHART_DATA,
      maxLeft: 200,
      maxRight: 1000000,
    },
    {
      id: 'delivery' as const,
      title: 'Place of Delivery Wise Container',
      data: DELIVERY_PLACE_CHART_DATA,
      maxLeft: 60,
      maxRight: 600000,
    },
    {
      id: 'marketing' as const,
      title: 'Marketing Personal Wise Container',
      data: MARKETING_PERSONAL_CHART_DATA,
      maxLeft: 250,
      maxRight: 2000000,
    },
    {
      id: 'product' as const,
      title: 'Product Wise Container',
      data: PRODUCT_CHART_DATA,
      maxLeft: 70,
      maxRight: 350000,
    },
  ];

  const visibleCharts = overviewCharts.filter((c) => c.id === selectedChart);
  const untrackedForecastSummary = FORECAST_WITHOUT_TRACKING_ROWS.reduce(
    (summary, row) => ({
      total: summary.total + row.totalNoContainers,
      delivered: summary.delivered + row.deliveredContainers,
      confirmed: summary.confirmed + row.confirmedUndelivered,
      profit:
        summary.profit +
        Number(row.projectedProfit.replace(/[^0-9.-]+/g, '')),
    }),
    { total: 0, delivered: 0, confirmed: 0, profit: 0 }
  );

  return (
    <DashShell>
      <DashMetricGrid>
        {DASHBOARD_METRIC_CARDS.slice(0, 4).map((c) => {
          const iconMap = {
            user: <Users className="w-4 h-4" />,
            file: <FileCheck className="w-4 h-4" />,
            list: <List className="w-4 h-4" />,
            supplier: <UserCheck className="w-4 h-4" />,
            cash: <Coins className="w-4 h-4" />,
          };
          return (
            <DashMetricCard
              key={c.id}
              label={c.label}
              value={c.value}
              color={c.color}
              accentColor={c.accentColor}
              icon={iconMap[c.iconName]}
            />
          );
        })}
      </DashMetricGrid>

      <DashSection
        title="Cash Flow"
        action={
          <button
            type="button"
            onClick={() => setCashMasked((v) => !v)}
            className="inline-flex items-center gap-1 text-label font-bold text-teal-700 cursor-pointer"
          >
            {cashMasked ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {cashMasked ? 'Reveal' : 'Hide'}
          </button>
        }
      >
        {(() => {
          const display = cashMasked ? CASH_FLOW_DATA.maskedValue : CASH_FLOW_DATA.actualValue;
          const [currency, ...rest] = display.split(' ');
          const amountPart = rest.join(' ') || display;
          return (
            <div className="relative overflow-hidden bg-white rounded-2xl border border-emerald-200 p-3 shadow-sm">
              <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
              <div className="absolute -right-4 top-2 w-20 h-20 rounded-full bg-emerald-400/15 blur-md" />
              <div className="relative flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-micro font-bold uppercase tracking-wider text-emerald-600/80">
                    {CASH_FLOW_DATA.label}
                  </p>
                  <div className="mt-2 inline-flex items-baseline gap-1 px-2.5 py-1.5 rounded-xl border border-emerald-100 bg-emerald-50 font-mono text-emerald-900">
                    <span className="text-micro font-bold uppercase opacity-60">{currency}</span>
                    <span className="text-metric font-black tabular-nums tracking-tight">{amountPart}</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                  <Coins className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          );
        })()}
      </DashSection>

      <DashSection title="Container Analytics">
        <DashScrollRow contentClassName="pb-1">
          {chartTabs.map((tab) => (
            <DashPill
              key={tab.id}
              active={selectedChart === tab.id}
              onClick={() => setSelectedChart(tab.id)}
            >
              {tab.label}
            </DashPill>
          ))}
        </DashScrollRow>
        <div className="space-y-3">
          {visibleCharts.map((chart) => (
            <ContainerDualAxisChart
              key={chart.id}
              id={`mobile-chart-${chart.id}`}
              title={chart.title}
              data={chart.data}
              maxLeft={chart.maxLeft}
              maxRight={chart.maxRight}
              onViewAll={() => {}}
            />
          ))}
        </div>
      </DashSection>

      <DashSection title="Container Wise Forecast Without Tracking">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-[#0f2b3c] to-[#17465a] px-3 py-3 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-micro font-bold uppercase tracking-[0.14em] text-white/60">
                  Untracked pipeline
                </p>
                <p className="mt-0.5 text-body-sm font-extrabold">
                  {FORECAST_WITHOUT_TRACKING_ROWS.length} forecast months
                </p>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 px-2.5 py-1.5 text-right">
                <p className="text-micro font-semibold text-white/60">Projected profit</p>
                <p className="text-label font-black tabular-nums">
                  ${untrackedForecastSummary.profit.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>

            <div className="mt-2.5 grid grid-cols-3 gap-1.5">
              {[
                { label: 'Total', value: untrackedForecastSummary.total, tone: 'text-sky-200' },
                {
                  label: 'Delivered',
                  value: untrackedForecastSummary.delivered,
                  tone: 'text-emerald-200',
                },
                {
                  label: 'Confirmed',
                  value: untrackedForecastSummary.confirmed,
                  tone: 'text-amber-200',
                },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-lg border border-white/10 bg-white/[0.07] px-2 py-1.5"
                >
                  <p className="text-micro font-semibold text-white/55">{metric.label}</p>
                  <p className={`text-body font-black tabular-nums ${metric.tone}`}>
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto px-2 pt-2">
            <table className="w-full table-fixed border-separate border-spacing-y-1 text-left text-caption">
              <colgroup>
                <col className="w-[22%]" />
                <col className="w-[14%]" />
                <col className="w-[16%]" />
                <col className="w-[16%]" />
                <col className="w-[32%]" />
              </colgroup>
              <thead>
                <tr className="text-micro uppercase tracking-wide text-slate-400">
                  <th className="px-1.5 py-1 font-bold">Month</th>
                  <th className="px-0.5 py-1 text-center font-bold">Total</th>
                  <th className="px-0.5 py-1 text-center font-bold">Del.</th>
                  <th className="px-0.5 py-1 text-center font-bold">Conf.</th>
                  <th className="px-1.5 py-1 text-right font-bold">Profit</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {FORECAST_WITHOUT_TRACKING_ROWS.map((row) => (
                  <tr key={row.shipmentMonths} className="bg-slate-50/80">
                    <td className="rounded-l-lg px-1.5 py-2">
                      <span className="inline-flex rounded-md bg-white px-1.5 py-0.5 font-extrabold text-[#0f2b3c] shadow-xs">
                        {row.shipmentMonths}
                      </span>
                    </td>
                    <td className="px-0.5 py-2 text-center">
                      <button
                        type="button"
                        className="inline-flex min-w-5 justify-center rounded-md bg-blue-50 px-1.5 py-0.5 font-black text-blue-700 cursor-pointer"
                      >
                        {row.totalNoContainers}
                      </button>
                    </td>
                    <td className="px-0.5 py-2 text-center font-bold tabular-nums text-emerald-700">
                      {row.deliveredContainers}
                    </td>
                    <td className="px-0.5 py-2 text-center font-bold tabular-nums text-amber-700">
                      {row.confirmedUndelivered}
                    </td>
                    <td className="rounded-r-lg px-1.5 py-2 text-right text-micro font-mono font-bold tabular-nums text-[#0f2b3c] whitespace-nowrap">
                      {row.projectedProfit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 bg-white py-2.5 text-center">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-label font-extrabold text-blue-600 transition-colors hover:bg-blue-50 cursor-pointer"
            >
              <span>View all forecasts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </DashSection>

      <DashSection
        title="Follow-ups"
        action={
          <div className="flex gap-1">
            {(['Week', 'Month'] as const).map((p) => (
              <DashPill key={p} active={followPeriod === p} onClick={() => setFollowPeriod(p)}>
                {p}
              </DashPill>
            ))}
          </div>
        }
      >
        <div className="space-y-2">
          {[
            { t: 'Proforma Finance Status', v: 12, s: `${followPeriod} pending reviews`, icon: <FileCheck className="w-4 h-4 text-sky-600" />, bg: 'bg-sky-50' },
            { t: 'Expense Vouchers', v: 5, s: 'Awaiting finance action', icon: <Receipt className="w-4 h-4 text-amber-600" />, bg: 'bg-amber-50' },
          ].map((x) => (
            <DashTaskTile key={x.t} title={x.t} subtitle={x.s} value={x.v} icon={x.icon} iconBg={x.bg} />
          ))}
        </div>
      </DashSection>
    </DashShell>
  );
};

/* ------------------------------------------------------------------ */
/* Export                                                               */
/* ------------------------------------------------------------------ */

export const ExportDashboardJourney: React.FC = () => {
  const [marketingPersonal, setMarketingPersonal] = useState(MARKETING_PERSONNEL_OPTIONS[0]);
  const taskTotal = EXPORT_TASKS.reduce((s, t) => s + t.value, 0);

  const iconFor = (type: string, white = false) => {
    const cls = white ? 'w-4 h-4' : 'w-4 h-4 text-sky-600';
    const map: Record<string, React.ReactNode> = {
      enquiry: <FileSearch className={white ? 'w-4 h-4' : 'w-4 h-4 text-sky-600'} />,
      freight: <Send className={white ? 'w-4 h-4' : 'w-4 h-4 text-amber-600'} />,
      booking: <FileCheck2 className={white ? 'w-4 h-4' : 'w-4 h-4 text-sky-600'} />,
      loading: <Package className={white ? 'w-4 h-4' : 'w-4 h-4 text-amber-600'} />,
      shipment: <Ship className={white ? 'w-4 h-4' : 'w-4 h-4 text-indigo-600'} />,
      invoice: <Receipt className={white ? 'w-4 h-4' : 'w-4 h-4 text-emerald-600'} />,
      switch_bl: <FileSignature className={white ? 'w-4 h-4' : 'w-4 h-4 text-violet-600'} />,
      purchase_invoice: <ShoppingCart className={white ? 'w-4 h-4' : 'w-4 h-4 text-rose-600'} />,
      eta: <BellRing className={white ? 'w-4 h-4' : 'w-4 h-4 text-orange-600'} />,
      uncouriered: <Truck className={white ? 'w-4 h-4' : 'w-4 h-4 text-teal-600'} />,
    };
    return map[type] ?? <Package className={cls} />;
  };

  const toneFor = (type: string) => {
    const map: Record<string, { bg: string; accent: string; chip: string }> = {
      enquiry: { bg: 'bg-sky-50', accent: '#0ea5e9', chip: 'bg-sky-100 text-sky-700' },
      freight: { bg: 'bg-amber-50', accent: '#f59e0b', chip: 'bg-amber-100 text-amber-700' },
      booking: { bg: 'bg-sky-50', accent: '#0284c7', chip: 'bg-sky-100 text-sky-700' },
      loading: { bg: 'bg-amber-50', accent: '#d97706', chip: 'bg-amber-100 text-amber-800' },
      shipment: { bg: 'bg-indigo-50', accent: '#6366f1', chip: 'bg-indigo-100 text-indigo-700' },
      invoice: { bg: 'bg-emerald-50', accent: '#10b981', chip: 'bg-emerald-100 text-emerald-700' },
      switch_bl: { bg: 'bg-violet-50', accent: '#8b5cf6', chip: 'bg-violet-100 text-violet-700' },
      purchase_invoice: { bg: 'bg-rose-50', accent: '#f43f5e', chip: 'bg-rose-100 text-rose-700' },
      eta: { bg: 'bg-orange-50', accent: '#f97316', chip: 'bg-orange-100 text-orange-700' },
      uncouriered: { bg: 'bg-teal-50', accent: '#14b8a6', chip: 'bg-teal-100 text-teal-700' },
    };
    return map[type] ?? { bg: 'bg-slate-50', accent: '#64748b', chip: 'bg-slate-100 text-slate-700' };
  };

  return (
    <DashShell>
      <div className="relative">
        <label htmlFor="export-mobile-marketing-personal" className="sr-only">
          Marketing Personal
        </label>
        <div className="relative flex items-center">
          <Users className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <select
            id="export-mobile-marketing-personal"
            value={marketingPersonal}
            onChange={(e) => setMarketingPersonal(e.target.value)}
            className="w-full appearance-none bg-white border border-slate-200 text-body font-semibold text-slate-700 py-2.5 pl-9 pr-9 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0f2b3c]/15 cursor-pointer"
          >
            {MARKETING_PERSONNEL_OPTIONS.map((person) => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
        </div>
      </div>

      <DashSection
        title="Export Task Board"
        action={
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0f2b3c] text-white text-caption font-bold">
            {taskTotal} open
          </span>
        }
      >
        <DashMetricGrid className="gap-2.5">
          {EXPORT_TASKS.map((t) => {
            const tone = toneFor(t.icon);
            return (
              <DashMetricCard
                key={t.id}
                label={t.title}
                value={t.value}
                subtitle={t.subtitle}
                color={tone.accent}
                icon={iconFor(t.icon, true)}
                criteria={t.criteria}
                onClick={() => {}}
              />
            );
          })}
        </DashMetricGrid>
      </DashSection>

      <DashSection title="Priority Follow-ups">
        <div className="space-y-2">
          {EXPORT_FOLLOW_UPS.map((f) => {
            const tone = toneFor(f.icon);
            return (
              <button
                key={f.id}
                type="button"
                className="w-full text-left relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-3 shadow-sm active:scale-[0.99] transition-transform cursor-pointer"
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ backgroundColor: tone.accent }}
                />
                <div className="flex items-center gap-3 pl-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tone.bg}`}>
                    {iconFor(f.icon)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-label font-extrabold text-[#0f2b3c] leading-snug line-clamp-1">
                      {f.title}
                    </p>
                    <p className="text-label text-slate-500 mt-0.5 line-clamp-1">{f.subtitle}</p>
                  </div>
                  <span className={`min-w-[2rem] text-center px-2.5 py-1 rounded-xl text-metric font-black tabular-nums ${tone.chip}`}>
                    {f.value}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </DashSection>
    </DashShell>
  );
};

/* ------------------------------------------------------------------ */
/* Purchase                                                             */
/* ------------------------------------------------------------------ */

export const PurchaseDashboardJourney: React.FC = () => {
  const [monthTab, setMonthTab] = useState<'current' | 'next'>('current');
  const [delayedViewMode, setDelayedViewMode] = useState<'cards' | 'table'>('cards');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'pi-809': true });
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [croFilter, setCroFilter] = useState<'All' | 'Applied' | 'Received' | 'Not Applied'>('All');
  const [customerFilter, setCustomerFilter] = useState('All');
  const [marketingFilter, setMarketingFilter] = useState('All');
  const [portFilter, setPortFilter] = useState('All');
  const [supplierFilter, setSupplierFilter] = useState('All');

  const customerOptions = useMemo(
    () => ['All', ...Array.from(new Set(DELAYED_ORDERS.map((o) => o.customerName)))],
    []
  );
  const marketingOptions = useMemo(
    () => ['All', ...Array.from(new Set(DELAYED_ORDERS.map((o) => o.marketingPersonal)))],
    []
  );
  const portOptions = useMemo(
    () => ['All', ...Array.from(new Set(DELAYED_ORDERS.map((o) => o.portOfDischarge)))],
    []
  );
  const supplierOptions = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(
          DELAYED_ORDERS.flatMap((o) =>
            o.lineItems.map((l) => l.supplier).filter((s): s is string => Boolean(s))
          )
        )
      ),
    ],
    []
  );

  const activeFilterCount = [
    croFilter !== 'All',
    customerFilter !== 'All',
    marketingFilter !== 'All',
    portFilter !== 'All',
    supplierFilter !== 'All',
    searchQuery.trim() !== '',
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchQuery('');
    setCroFilter('All');
    setCustomerFilter('All');
    setMarketingFilter('All');
    setPortFilter('All');
    setSupplierFilter('All');
  };

  const delayed = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return DELAYED_ORDERS.filter((o) => {
      const matchesSearch =
        q === '' ||
        o.proformaCode.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.marketingPersonal.toLowerCase().includes(q) ||
        o.portOfDischarge.toLowerCase().includes(q) ||
        o.lineItems.some(
          (l) =>
            l.product.toLowerCase().includes(q) ||
            (l.requisition?.toLowerCase().includes(q) ?? false) ||
            (l.supplier?.toLowerCase().includes(q) ?? false)
        );

      const matchesCro = croFilter === 'All' || o.croType === croFilter;
      const matchesCustomer = customerFilter === 'All' || o.customerName === customerFilter;
      const matchesMarketing = marketingFilter === 'All' || o.marketingPersonal === marketingFilter;
      const matchesPort = portFilter === 'All' || o.portOfDischarge === portFilter;
      const matchesSupplier =
        supplierFilter === 'All' || o.lineItems.some((l) => l.supplier === supplierFilter);

      return (
        matchesSearch &&
        matchesCro &&
        matchesCustomer &&
        matchesMarketing &&
        matchesPort &&
        matchesSupplier
      );
    });
  }, [searchQuery, croFilter, customerFilter, marketingFilter, portFilter, supplierFilter]);

  const croBadge = (type: string) => {
    const map: Record<string, string> = {
      Applied: 'bg-amber-50 text-amber-700 border-amber-200',
      Received: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Not Applied': 'bg-rose-50 text-rose-700 border-rose-200',
    };
    const dot: Record<string, string> = {
      Applied: 'bg-amber-500',
      Received: 'bg-emerald-500',
      'Not Applied': 'bg-rose-500',
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-caption font-bold border ${
          map[type] ?? 'bg-slate-100'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dot[type] ?? 'bg-slate-400'}`} />
        {type}
      </span>
    );
  };

  const taskIcon = (icon: string) => {
    const map: Record<string, React.ReactNode> = {
      ticket: <MessageSquare className="w-4 h-4 text-emerald-600" />,
      artwork: <FileBadge2 className="w-4 h-4 text-rose-600" />,
      requisition: <ClipboardList className="w-4 h-4 text-violet-600" />,
      order: <ShoppingCart className="w-4 h-4 text-sky-600" />,
      invoice: <Receipt className="w-4 h-4 text-amber-600" />,
    };
    return map[icon] ?? <List className="w-4 h-4" />;
  };

  const taskTone = (icon: string) => {
    const map: Record<string, { bg: string; accent: string; chip: string }> = {
      ticket: { bg: 'bg-emerald-50', accent: '#10b981', chip: 'bg-emerald-100 text-emerald-800' },
      artwork: { bg: 'bg-rose-50', accent: '#f43f5e', chip: 'bg-rose-100 text-rose-700' },
      requisition: { bg: 'bg-violet-50', accent: '#8b5cf6', chip: 'bg-violet-100 text-violet-700' },
      order: { bg: 'bg-sky-50', accent: '#0ea5e9', chip: 'bg-sky-100 text-sky-700' },
      invoice: { bg: 'bg-amber-50', accent: '#f59e0b', chip: 'bg-amber-100 text-amber-800' },
    };
    return map[icon] ?? { bg: 'bg-slate-50', accent: '#64748b', chip: 'bg-slate-100 text-slate-700' };
  };

  const taskTotal = PURCHASE_TASKS.reduce((s, t) => s + t.value, 0);

  const selectClass =
    'w-full appearance-none rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-label font-semibold text-[#0f2b3c] focus:outline-none focus:ring-2 focus:ring-[#0f2b3c]/15';

  const perf = monthTab === 'current' ? CURRENT_MONTH_PERFORMANCE : NEXT_MONTH_SUMMARY;

  return (
    <DashShell>
      <DashSection
        title="Task Queue"
        action={
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0f2b3c] text-white text-caption font-bold">
            {taskTotal} open
          </span>
        }
      >
        <DashMetricGrid>
          {PURCHASE_TASKS.map((t, index) => {
            const tone = taskTone(t.icon);
            const isLastOdd = index === PURCHASE_TASKS.length - 1 && PURCHASE_TASKS.length % 2 === 1;
            return (
              <DashMetricCard
                key={t.id}
                label={t.label}
                value={t.value}
                subtitle={t.subtitle}
                color={tone.accent}
                icon={taskIcon(t.icon)}
                criteria={t.criteria}
                className={isLastOdd ? 'col-span-2' : ''}
                valueClassName={t.value === 0 ? 'text-slate-300' : undefined}
                onClick={() => {}}
              />
            );
          })}
        </DashMetricGrid>
      </DashSection>

      <DashSection
        title="Readiness Snapshot"
        action={
          <div className="flex gap-1">
            <DashPill active={monthTab === 'current'} onClick={() => setMonthTab('current')}>
              Current
            </DashPill>
            <DashPill active={monthTab === 'next'} onClick={() => setMonthTab('next')}>
              Next
            </DashPill>
          </div>
        }
      >
        <DashMetricGrid>
          {[
            {
              key: 'expected',
              label: perf.expectedReadiness.label,
              value: perf.expectedReadiness.value,
              hint: perf.expectedReadiness.subtitle,
              icon: <CheckCircle2 className="w-4 h-4" />,
              accent: '#14b8a6',
              cro: false,
              criteria: undefined as PurchaseCriteria | undefined,
            },
            {
              key: 'cro',
              label: perf.croStatus.label,
              value: perf.croStatus.applied + perf.croStatus.received + perf.croStatus.notApplied,
              hint: null as string | null,
              icon: <FileCheck className="w-4 h-4" />,
              accent: '#f59e0b',
              cro: true,
              criteria: undefined as PurchaseCriteria | undefined,
            },
            monthTab === 'current'
              ? {
                  key: 'pending',
                  label: CURRENT_MONTH_PERFORMANCE.pendingReadiness.label,
                  value: CURRENT_MONTH_PERFORMANCE.pendingReadiness.value,
                  hint: CURRENT_MONTH_PERFORMANCE.pendingReadiness.subtitle,
                  icon: <Clock className="w-4 h-4" />,
                  accent: '#d97706',
                  cro: false,
                  criteria: CURRENT_MONTH_PERFORMANCE.pendingReadiness.criteria as PurchaseCriteria | undefined,
                }
              : {
                  key: 'month-total',
                  label: 'Month Total',
                  value: NEXT_MONTH_SUMMARY.total,
                  hint: 'Next month pipeline',
                  icon: <Package className="w-4 h-4" />,
                  accent: '#0ea5e9',
                  cro: false,
                  criteria: undefined as PurchaseCriteria | undefined,
                },
            {
              key: 'survey',
              label: perf.pendingSurvey.label,
              value: perf.pendingSurvey.value,
              hint: perf.pendingSurvey.subtitle,
              icon: <ClipboardList className="w-4 h-4" />,
              accent: '#db2777',
              cro: false,
              criteria: perf.pendingSurvey.criteria as PurchaseCriteria | undefined,
            },
          ].map((card) => (
            <DashMetricCard
              key={card.key}
              label={card.label}
              value={card.value}
              color={card.accent}
              icon={card.icon}
              criteria={card.criteria}
              subtitle={
                card.cro ? (
                  <div className="flex flex-wrap gap-1">
                    <span className="px-1.5 py-0.5 rounded-md text-caption font-bold bg-amber-50 text-amber-700 border border-amber-100">
                      A {perf.croStatus.applied}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md text-caption font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      R {perf.croStatus.received}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-md text-caption font-bold bg-rose-50 text-rose-700 border border-rose-100">
                      N {perf.croStatus.notApplied}
                    </span>
                  </div>
                ) : (
                  card.hint ?? undefined
                )
              }
            />
          ))}
        </DashMetricGrid>
      </DashSection>

      <DashSection
        title="Delayed Orders"
        action={
          <div className="flex items-center gap-2">
            <DashCriteriaTip criteria={DELAYED_ORDERS_CRITERIA} accentColor="#d97706" />
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0f2b3c] text-white text-caption font-bold">
              {delayed.length} found
            </span>
          </div>
        }
      >
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PI, customer, port..."
                className="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-2 text-body-sm font-semibold text-[#0f2b3c] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f2b3c]/15"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-label font-bold border cursor-pointer transition-colors ${
                showFilters || activeFilterCount > 0
                  ? 'bg-[#0f2b3c] text-white border-[#0f2b3c]'
                  : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="min-w-[1.1rem] h-4 px-1 rounded-full bg-white/20 text-caption flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-1 shadow-xs">
            <span className="pl-2 text-micro font-bold uppercase tracking-wider text-slate-400">
              Display
            </span>
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5">
              <button
                type="button"
                onClick={() => setDelayedViewMode('cards')}
                className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-caption font-bold transition-colors cursor-pointer ${
                  delayedViewMode === 'cards'
                    ? 'bg-[#0f2b3c] text-white shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                <List className="h-3.5 w-3.5" />
                Cards
              </button>
              <button
                type="button"
                onClick={() => setDelayedViewMode('table')}
                className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-caption font-bold transition-colors cursor-pointer ${
                  delayedViewMode === 'table'
                    ? 'bg-[#0f2b3c] text-white shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                <Table2 className="h-3.5 w-3.5" />
                Table
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <p className="text-label font-extrabold uppercase tracking-wider text-[#0f2b3c]">
                  Filter Orders
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 text-label font-bold text-rose-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <label className="space-y-1">
                  <span className="text-micro font-bold uppercase tracking-wider text-slate-400 block">
                    Customer
                  </span>
                  <select
                    value={customerFilter}
                    onChange={(e) => setCustomerFilter(e.target.value)}
                    className={selectClass}
                  >
                    {customerOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === 'All' ? 'All Customers' : opt}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="text-micro font-bold uppercase tracking-wider text-slate-400 block">
                    Marketing
                  </span>
                  <select
                    value={marketingFilter}
                    onChange={(e) => setMarketingFilter(e.target.value)}
                    className={selectClass}
                  >
                    {marketingOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === 'All' ? 'All Marketing' : opt}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="text-micro font-bold uppercase tracking-wider text-slate-400 block">
                    Port
                  </span>
                  <select
                    value={portFilter}
                    onChange={(e) => setPortFilter(e.target.value)}
                    className={selectClass}
                  >
                    {portOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === 'All' ? 'All Ports' : opt}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="text-micro font-bold uppercase tracking-wider text-slate-400 block">
                    Supplier
                  </span>
                  <select
                    value={supplierFilter}
                    onChange={(e) => setSupplierFilter(e.target.value)}
                    className={selectClass}
                  >
                    {supplierOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === 'All' ? 'All Suppliers' : opt}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="space-y-1">
                <span className="text-micro font-bold uppercase tracking-wider text-slate-400 block">
                  CRO Type
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(['All', 'Applied', 'Received', 'Not Applied'] as const).map((c) => (
                    <DashPill key={c} active={croFilter === c} onClick={() => setCroFilter(c)}>
                      {c}
                    </DashPill>
                  ))}
                </div>
              </div>
            </div>
          )}

          {delayed.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-6 text-center">
              <p className="text-body-sm font-bold text-slate-500">No delayed orders match filters</p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-2 text-label font-bold text-blue-600 cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : delayedViewMode === 'table' ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-[760px] w-full border-collapse text-left text-caption">
                  <thead className="bg-[#0f2b3c] text-white">
                    <tr>
                      <th className="px-3 py-2.5 font-bold">Proforma</th>
                      <th className="px-3 py-2.5 font-bold">Customer</th>
                      <th className="px-3 py-2.5 font-bold">Expected</th>
                      <th className="px-3 py-2.5 font-bold">CRO Status</th>
                      <th className="px-3 py-2.5 font-bold">Marketing</th>
                      <th className="px-3 py-2.5 font-bold">Destination</th>
                      <th className="px-3 py-2.5 text-center font-bold">Products</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {delayed.map((order) => {
                      const isOpen = !!expanded[order.id];
                      return (
                        <React.Fragment key={order.id}>
                          <tr
                            className={`transition-colors ${
                              isOpen ? 'bg-blue-50/50' : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="px-3 py-2.5">
                              <button
                                type="button"
                                onClick={() =>
                                  setExpanded((current) => ({
                                    ...current,
                                    [order.id]: !current[order.id],
                                  }))
                                }
                                className="inline-flex items-center gap-1.5 cursor-pointer"
                                aria-expanded={isOpen}
                              >
                                <span
                                  className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                                    isOpen
                                      ? 'border-[#0f2b3c] bg-[#0f2b3c] text-white'
                                      : 'border-slate-200 bg-white text-slate-500'
                                  }`}
                                >
                                  {isOpen ? (
                                    <ChevronDown className="h-3 w-3" />
                                  ) : (
                                    <span className="text-label font-black leading-none">+</span>
                                  )}
                                </span>
                                <span className="rounded-md bg-blue-50 px-2 py-1 font-extrabold text-blue-700">
                                  {order.proformaCode}
                                </span>
                              </button>
                            </td>
                            <td className="max-w-[210px] px-3 py-2.5 font-semibold text-[#0f2b3c]">
                              {order.customerName}
                            </td>
                            <td className="px-3 py-2.5 font-bold text-amber-700 whitespace-nowrap">
                              {order.expectedDeliveryMonth}
                            </td>
                            <td className="px-3 py-2.5">{croBadge(order.croType)}</td>
                            <td className="px-3 py-2.5 font-semibold text-blue-700 whitespace-nowrap">
                              {order.marketingPersonal}
                            </td>
                            <td className="max-w-[180px] px-3 py-2.5 font-semibold text-slate-600">
                              {order.portOfDischarge}
                            </td>
                            <td className="px-3 py-2.5 text-center">
                              <span className="inline-flex min-w-6 justify-center rounded-full bg-slate-100 px-2 py-1 font-black text-slate-700">
                                {order.lineItems.length}
                              </span>
                            </td>
                          </tr>

                          {isOpen && (
                            <tr className="bg-slate-50/70">
                              <td colSpan={7} className="px-3 py-3">
                                <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
                                  <div className="mb-2.5 flex items-center justify-between">
                                    <div>
                                      <p className="text-micro font-bold uppercase tracking-wider text-slate-400">
                                        Nested order details
                                      </p>
                                      <p className="text-label font-extrabold text-[#0f2b3c]">
                                        Products, requisitions and suppliers
                                      </p>
                                    </div>
                                    <span className="rounded-full bg-[#0f2b3c] px-2 py-1 text-micro font-bold text-white">
                                      {order.lineItems.length} items
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                    {order.lineItems.map((item, index) => (
                                      <div
                                        key={`${order.id}-table-item-${index}`}
                                        className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50/60 p-2.5"
                                      >
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#0f2b3c] text-micro font-black text-white">
                                          {index + 1}
                                        </span>
                                        <div className="min-w-0">
                                          <p className="text-label font-extrabold leading-snug text-blue-700">
                                            {item.product}
                                          </p>
                                          {item.requisition ? (
                                            <div className="mt-1.5">
                                              <span className="inline-flex rounded-md bg-sky-100 px-1.5 py-0.5 text-micro font-bold text-sky-700">
                                                {item.requisition}
                                              </span>
                                              {item.supplier && (
                                                <p className="mt-1 text-caption font-semibold leading-snug text-slate-500">
                                                  {item.supplier}
                                                </p>
                                              )}
                                            </div>
                                          ) : (
                                            <span className="mt-1.5 inline-flex rounded-md bg-slate-200 px-1.5 py-0.5 text-micro font-bold text-slate-600">
                                              Direct product
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ))}
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
              <p className="border-t border-slate-100 bg-slate-50 px-3 py-2 text-center text-micro font-semibold text-slate-400">
                Swipe horizontally to view all columns
              </p>
            </div>
          ) : (
            delayed.map((o) => {
              const isOpen = !!expanded[o.id];
              const rqCount = o.lineItems.filter((l) => l.requisition).length;
              const directCount = o.lineItems.length - rqCount;
              const accentClass =
                o.croType === 'Applied'
                  ? 'bg-amber-500'
                  : o.croType === 'Received'
                    ? 'bg-emerald-500'
                    : 'bg-rose-500';
              return (
                <div
                  key={o.id}
                  className={`relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all ${
                    isOpen ? 'border-[#0f2b3c]/35 shadow-md' : 'border-slate-200'
                  }`}
                >
                  <div className={`absolute inset-y-0 left-0 w-1 ${accentClass}`} />
                  <button
                    type="button"
                    onClick={() => setExpanded((e) => ({ ...e, [o.id]: !e[o.id] }))}
                    className="w-full cursor-pointer p-3 pl-3.5 text-left active:bg-slate-50/80"
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                          isOpen
                            ? 'border-[#0f2b3c] bg-[#0f2b3c] text-white shadow-sm'
                            : 'border-slate-200 bg-slate-50 text-slate-500'
                        }`}
                      >
                        {isOpen ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <span className="text-md font-bold leading-none">+</span>
                        )}
                      </span>
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-micro font-bold uppercase tracking-wider text-slate-400">
                                Proforma
                              </span>
                              <span className="rounded-md bg-blue-50 px-1.5 py-0.5 text-label font-black text-blue-700">
                                {o.proformaCode}
                              </span>
                            </div>
                            <p className="mt-1 text-label font-extrabold leading-snug text-[#0f2b3c] line-clamp-2">
                              {o.customerName}
                            </p>
                          </div>
                          {croBadge(o.croType)}
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <div className="rounded-xl border border-amber-100 bg-amber-50/60 px-2 py-1.5">
                            <p className="text-micro font-bold uppercase tracking-wider text-slate-400">
                              Expected
                            </p>
                            <p className="mt-0.5 text-label font-extrabold text-amber-800">
                              {o.expectedDeliveryMonth}
                            </p>
                          </div>
                          <div className="rounded-xl border border-sky-100 bg-sky-50/60 px-2 py-1.5">
                            <p className="text-micro font-bold uppercase tracking-wider text-slate-400">
                              Destination
                            </p>
                            <p className="mt-0.5 text-label font-extrabold text-sky-800 line-clamp-1">
                              {o.portOfDischarge}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
                          <div className="min-w-0">
                            <p className="text-micro font-bold uppercase tracking-wider text-slate-400">
                              Marketing personal
                            </p>
                            <p className="truncate text-label font-extrabold text-blue-700">
                              {o.marketingPersonal}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {rqCount > 0 && (
                              <span className="px-1.5 py-0.5 rounded-md text-micro font-bold bg-sky-50 text-sky-700 border border-sky-100">
                                RQ {rqCount}
                              </span>
                            )}
                            {directCount > 0 && (
                              <span className="px-1.5 py-0.5 rounded-md text-micro font-bold bg-slate-50 text-slate-600 border border-slate-200">
                                Direct {directCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 bg-gradient-to-b from-slate-50 to-white p-3">
                      <div className="mb-2.5 flex items-center justify-between px-0.5">
                        <p className="text-micro font-extrabold uppercase tracking-[0.12em] text-[#0f2b3c]">
                          Order items
                        </p>
                        <span className="rounded-full bg-slate-200/70 px-2 py-0.5 text-micro font-bold text-slate-600">
                          {o.lineItems.length} products
                        </span>
                      </div>
                      <div className="space-y-2">
                        {o.lineItems.map((item, idx) => (
                          <div
                            key={`${o.id}-line-${idx}`}
                            className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm"
                          >
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#0f2b3c] text-micro font-black text-white">
                              {idx + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                              <button
                                type="button"
                                className="block cursor-pointer text-left text-label font-extrabold leading-snug text-blue-700"
                              >
                                {item.product}
                              </button>
                              {item.requisition ? (
                                <div className="mt-1.5 rounded-lg border border-sky-100 bg-sky-50/60 px-2 py-1.5">
                                  <button
                                    type="button"
                                    className="block cursor-pointer text-caption font-extrabold text-sky-700"
                                  >
                                    Requisition · {item.requisition}
                                  </button>
                                  {item.supplier && (
                                    <button
                                      type="button"
                                      className="mt-0.5 block cursor-pointer text-left text-caption font-semibold leading-snug text-slate-500"
                                    >
                                      {item.supplier}
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <span className="mt-1.5 inline-flex rounded-md bg-slate-100 px-1.5 py-0.5 text-caption font-bold text-slate-500">
                                  Direct product
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </DashSection>
    </DashShell>
  );
};

/* ------------------------------------------------------------------ */
/* Marketing                                                            */
/* ------------------------------------------------------------------ */

export const MarketingDashboardJourney: React.FC = () => {
  const [marketingPersonal, setMarketingPersonal] = useState(MARKETING_DASH_PERSONNEL_OPTIONS[0]);
  const [deliveryViewMode, setDeliveryViewMode] = useState<'cards' | 'table'>('cards');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'cu-057': true });
  const [expandedProforma, setExpandedProforma] = useState<Record<string, boolean>>({ 'PI-175': true });
  const [expandedInvoice, setExpandedInvoice] = useState<Record<string, boolean>>({ 'SI-187': true });
  const [expandedShipment, setExpandedShipment] = useState<Record<string, boolean>>({ 'ES-170': true });
  const [activeTip, setActiveTip] = useState<string | null>(null);
  const [showDeliveryFilters, setShowDeliveryFilters] = useState(false);
  const [deliverySearch, setDeliverySearch] = useState('');
  const [marketingPersonFilter, setMarketingPersonFilter] = useState('All');
  const [portFilter, setPortFilter] = useState('All');

  const toggleKey = (
    setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
    key: string
  ) => setter((prev) => ({ ...prev, [key]: !prev[key] }));

  const isNegativeAmount = (value: string) => value.includes('(') || value.includes('-');

  const marketingPersonOptions = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(RECENT_DELIVERED_ORDERS.flatMap((o) => o.proformas.map((p) => p.marketingPerson)))
      ),
    ],
    []
  );

  const portOptions = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(RECENT_DELIVERED_ORDERS.flatMap((o) => o.proformas.map((p) => p.portOfDischarge)))
      ),
    ],
    []
  );

  const deliveryFilterCount = [
    deliverySearch.trim() !== '',
    marketingPersonFilter !== 'All',
    portFilter !== 'All',
  ].filter(Boolean).length;

  const clearDeliveryFilters = () => {
    setDeliverySearch('');
    setMarketingPersonFilter('All');
    setPortFilter('All');
  };

  const filteredDeliveries = useMemo(() => {
    const q = deliverySearch.trim().toLowerCase();
    return RECENT_DELIVERED_ORDERS.filter((order) => {
      const matchesSearch =
        q === '' ||
        order.customerName.toLowerCase().includes(q) ||
        order.gateOutDate.toLowerCase().includes(q) ||
        order.proformas.some(
          (p) =>
            p.proformaCode.toLowerCase().includes(q) ||
            p.marketingPerson.toLowerCase().includes(q) ||
            p.portOfDischarge.toLowerCase().includes(q) ||
            p.placeOfDelivery.toLowerCase().includes(q) ||
            p.invoices.some(
              (inv) =>
                inv.invoiceCode.toLowerCase().includes(q) ||
                inv.inquiryCode.toLowerCase().includes(q) ||
                inv.shipments.some(
                  (s) =>
                    s.shipmentCode.toLowerCase().includes(q) ||
                    s.containers.some(
                      (c) =>
                        c.containerNo.toLowerCase().includes(q) ||
                        c.blNumber.toLowerCase().includes(q)
                    )
                )
            )
        );

      const matchesMarketing =
        marketingPersonFilter === 'All' ||
        order.proformas.some((p) => p.marketingPerson === marketingPersonFilter);

      const matchesPort =
        portFilter === 'All' || order.proformas.some((p) => p.portOfDischarge === portFilter);

      return matchesSearch && matchesMarketing && matchesPort;
    });
  }, [deliverySearch, marketingPersonFilter, portFilter]);

  const followTone = (icon: string) => {
    const map: Record<string, { accent: string; blob: string; iconBg: string }> = {
      orders: { accent: '#2563eb', blob: 'bg-blue-400/20', iconBg: 'bg-blue-600' },
      payments: { accent: '#0d9488', blob: 'bg-teal-400/20', iconBg: 'bg-teal-600' },
      shipping: { accent: '#7c3aed', blob: 'bg-violet-400/20', iconBg: 'bg-violet-600' },
      quotations: { accent: '#ea580c', blob: 'bg-orange-400/20', iconBg: 'bg-orange-600' },
    };
    return map[icon] ?? { accent: '#64748b', blob: 'bg-slate-400/20', iconBg: 'bg-slate-600' };
  };

  const followIconWhite = (icon: string) => {
    const map: Record<string, React.ReactNode> = {
      orders: <List className="w-4 h-4 text-white" />,
      payments: <Clock className="w-4 h-4 text-white" />,
      shipping: <CheckCircle2 className="w-4 h-4 text-white" />,
      quotations: <FileCheck className="w-4 h-4 text-white" />,
    };
    return map[icon] ?? <FileText className="w-4 h-4 text-white" />;
  };

  const taskTone = (icon: string) => {
    const map: Record<string, { accent: string; blob: string; iconBg: string }> = {
      ticket: { accent: '#10b981', blob: 'bg-emerald-400/20', iconBg: 'bg-emerald-600' },
      freight: { accent: '#f59e0b', blob: 'bg-amber-400/20', iconBg: 'bg-amber-600' },
      artwork: { accent: '#f43f5e', blob: 'bg-rose-400/20', iconBg: 'bg-rose-600' },
      container: { accent: '#8b5cf6', blob: 'bg-violet-400/20', iconBg: 'bg-violet-600' },
    };
    return map[icon] ?? { accent: '#64748b', blob: 'bg-slate-400/20', iconBg: 'bg-slate-600' };
  };

  const taskIconWhite = (icon: string) => {
    const map: Record<string, React.ReactNode> = {
      ticket: <MessageSquare className="w-4 h-4 text-white" />,
      freight: <Send className="w-4 h-4 text-white" />,
      artwork: <Palette className="w-4 h-4 text-white" />,
      container: <Layers className="w-4 h-4 text-white" />,
    };
    return map[icon] ?? <FileText className="w-4 h-4 text-white" />;
  };

  const followTotal = MARKETING_FOLLOW_UPS.length;
  const taskTotal = MARKETING_TASKS.reduce((s, t) => s + t.value, 0);

  const amountClass = (value: string) =>
    isNegativeAmount(value) ? 'text-rose-600' : 'text-[#0f2b3c]';

  const expandBtn = (open: boolean) => (
    <span
      className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${
        open
          ? 'bg-[#0f2b3c] border-[#0f2b3c] text-white'
          : 'bg-slate-50 border-slate-200 text-slate-500'
      }`}
    >
      {open ? <ChevronDown className="w-3.5 h-3.5" /> : <span className="text-md font-bold leading-none">+</span>}
    </span>
  );

  const selectClass =
    'w-full appearance-none rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-label font-semibold text-[#0f2b3c] focus:outline-none focus:ring-2 focus:ring-[#0f2b3c]/15';

  return (
    <DashShell>
      <div className="relative">
        <label htmlFor="marketing-mobile-marketing-personal" className="sr-only">
          Marketing Personal
        </label>
        <div className="relative flex items-center">
          <Users className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <select
            id="marketing-mobile-marketing-personal"
            value={marketingPersonal}
            onChange={(e) => setMarketingPersonal(e.target.value)}
            className="w-full appearance-none bg-white border border-slate-200 text-body font-semibold text-slate-700 py-2.5 pl-9 pr-9 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0f2b3c]/15 cursor-pointer"
          >
            {MARKETING_DASH_PERSONNEL_OPTIONS.map((person) => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
        </div>
      </div>

      <DashSection
        title="Tasks"
        action={
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0f2b3c] text-white text-caption font-bold">
            {taskTotal} open
          </span>
        }
      >
        <DashMetricGrid>
          {MARKETING_TASKS.map((t) => {
            const tone = taskTone(t.icon);
            return (
              <DashMetricCard
                key={t.id}
                label={t.label}
                value={t.value}
                subtitle={t.subtitle}
                color={tone.accent}
                icon={taskIconWhite(t.icon)}
                criteria={t.criteria}
                valueClassName={t.value === 0 ? 'text-slate-300' : undefined}
                onClick={() => {}}
              />
            );
          })}
        </DashMetricGrid>
      </DashSection>

      <DashSection
        title="Follow-ups"
        action={
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-caption font-bold">
            Total {followTotal}
          </span>
        }
      >
        <DashMetricGrid>
          {MARKETING_FOLLOW_UPS.map((f) => {
            const tone = followTone(f.icon);
            return (
              <DashMetricCard
                key={f.id}
                label={f.label}
                value={f.value}
                color={tone.accent}
                icon={followIconWhite(f.icon)}
                criteria={f.criteria}
                subtitle={
                  f.extraBadge ? (
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-micro text-slate-500 leading-[1.35] break-words">
                        {f.subtitle}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 text-caption font-extrabold rounded-full bg-purple-100 text-purple-800 border border-purple-200 whitespace-nowrap">
                          {f.extraBadge.text}
                        </span>
                        {f.extraBadge.criteria && (
                          <DashCriteriaTip criteria={f.extraBadge.criteria} accentColor={tone.accent} />
                        )}
                      </div>
                    </div>
                  ) : (
                    f.subtitle
                  )
                }
                onClick={() => {}}
              />
            );
          })}
        </DashMetricGrid>
      </DashSection>

      <DashSection title="Performance Snapshot">
        <div className="space-y-2">
          {PERFORMANCE_SUMMARY.slice(0, 4).map((p) => (
            <div key={p.criteria} className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 min-w-0">
                  <p className="text-label font-extrabold text-[#0f2b3c]">{p.criteria}</p>
                  {p.tip && <DashCriteriaTip criteria={p.tip} accentColor="#64748b" />}
                </div>
                <span
                  className={`text-label font-black px-2 py-0.5 rounded-full ${
                    p.percentageChangeMonth.startsWith('-')
                      ? 'bg-rose-50 text-rose-700'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {p.percentageChangeMonth}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <DashKpi label="This Month" value={p.currentMonth} />
                <DashKpi label="YTD" value={p.yearToDate} tone="teal" />
              </div>
            </div>
          ))}
        </div>
      </DashSection>

      <DashSection
        title="Recent Delivered Orders"
        action={
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0f2b3c] text-white text-caption font-bold">
            {filteredDeliveries.length} found
          </span>
        }
      >
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={deliverySearch}
                onChange={(e) => setDeliverySearch(e.target.value)}
                placeholder="Search customer, PI, invoice..."
                className="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-2 text-body-sm font-semibold text-[#0f2b3c] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f2b3c]/15"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowDeliveryFilters((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-label font-bold border cursor-pointer transition-colors ${
                showDeliveryFilters || deliveryFilterCount > 0
                  ? 'bg-[#0f2b3c] text-white border-[#0f2b3c]'
                  : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              Filters
              {deliveryFilterCount > 0 && (
                <span className="min-w-[1.1rem] h-4 px-1 rounded-full bg-white/20 text-caption flex items-center justify-center">
                  {deliveryFilterCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-1 shadow-xs">
            <span className="pl-2 text-micro font-bold uppercase tracking-wider text-slate-400">
              Display
            </span>
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5">
              <button
                type="button"
                onClick={() => setDeliveryViewMode('cards')}
                className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-caption font-bold cursor-pointer ${
                  deliveryViewMode === 'cards'
                    ? 'bg-[#0f2b3c] text-white shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                <List className="h-3.5 w-3.5" />
                Cards
              </button>
              <button
                type="button"
                onClick={() => setDeliveryViewMode('table')}
                className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-caption font-bold cursor-pointer ${
                  deliveryViewMode === 'table'
                    ? 'bg-[#0f2b3c] text-white shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                <Table2 className="h-3.5 w-3.5" />
                Table
              </button>
            </div>
          </div>

          {showDeliveryFilters && (
            <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <p className="text-label font-extrabold uppercase tracking-wider text-[#0f2b3c]">
                  Filter Deliveries
                </p>
                <button
                  type="button"
                  onClick={clearDeliveryFilters}
                  className="inline-flex items-center gap-1 text-label font-bold text-rose-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="space-y-1">
                  <span className="text-micro font-bold uppercase tracking-wider text-slate-400 block">
                    Marketing
                  </span>
                  <select
                    value={marketingPersonFilter}
                    onChange={(e) => setMarketingPersonFilter(e.target.value)}
                    className={selectClass}
                  >
                    {marketingPersonOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === 'All' ? 'All Marketing' : opt}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-micro font-bold uppercase tracking-wider text-slate-400 block">
                    Port
                  </span>
                  <select
                    value={portFilter}
                    onChange={(e) => setPortFilter(e.target.value)}
                    className={selectClass}
                  >
                    {portOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === 'All' ? 'All Ports' : opt}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          )}

          {filteredDeliveries.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-6 text-center">
              <p className="text-body-sm font-bold text-slate-500">No delivered orders match filters</p>
              <button
                type="button"
                onClick={clearDeliveryFilters}
                className="mt-2 text-label font-bold text-blue-600 cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : deliveryViewMode === 'table' ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse text-left text-caption">
                  <thead className="bg-[#0f2b3c] text-white">
                    <tr>
                      <th className="px-3 py-2.5 font-bold">Customer</th>
                      <th className="px-3 py-2.5 font-bold">Gate Out</th>
                      <th className="px-3 py-2.5 text-right font-bold">Invoice</th>
                      <th className="px-3 py-2.5 text-right font-bold">Remaining</th>
                      <th className="px-3 py-2.5 text-center font-bold">Proformas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDeliveries.map((order) => {
                      const isOpen = !!expanded[order.id];
                      return (
                        <React.Fragment key={order.id}>
                          <tr className={isOpen ? 'bg-blue-50/50' : 'hover:bg-slate-50'}>
                            <td className="max-w-[250px] px-3 py-2.5">
                              <button
                                type="button"
                                onClick={() => toggleKey(setExpanded, order.id)}
                                className="flex items-center gap-2 text-left font-extrabold text-blue-700 cursor-pointer"
                                aria-expanded={isOpen}
                              >
                                {expandBtn(isOpen)}
                                <span>{order.customerName}</span>
                              </button>
                            </td>
                            <td className="px-3 py-2.5 font-semibold text-slate-600 whitespace-nowrap">
                              {order.gateOutDate}
                            </td>
                            <td className="px-3 py-2.5 text-right font-bold tabular-nums text-[#0f2b3c]">
                              {order.totalInvoiceAmount}
                            </td>
                            <td className={`px-3 py-2.5 text-right font-black tabular-nums ${amountClass(order.totalRemainingAmount)}`}>
                              {order.totalRemainingAmount}
                            </td>
                            <td className="px-3 py-2.5 text-center">
                              <span className="rounded-full bg-slate-100 px-2 py-1 font-black text-slate-700">
                                {order.proformas.length}
                              </span>
                            </td>
                          </tr>
                          {isOpen && (
                            <tr className="bg-slate-50/70">
                              <td colSpan={5} className="p-3">
                                <div className="space-y-2">
                                  {order.proformas.map((pf) => (
                                    <div
                                      key={`${order.id}-table-${pf.proformaCode}`}
                                      className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs"
                                    >
                                      <div className="flex items-start gap-2">
                                        <span className="rounded-lg bg-blue-600 px-2 py-1 font-black text-white">
                                          PI
                                        </span>
                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-start justify-between gap-3">
                                            <div>
                                              <p className="font-extrabold text-blue-700">{pf.proformaCode}</p>
                                              <p className="mt-0.5 text-caption font-semibold text-slate-500">
                                                {pf.company}
                                              </p>
                                            </div>
                                            <span className={`font-black tabular-nums ${amountClass(pf.totalRemainingAmount)}`}>
                                              {pf.totalRemainingAmount}
                                            </span>
                                          </div>
                                          <div className="mt-2 grid grid-cols-4 gap-1.5 text-micro">
                                            <p><span className="block font-bold text-slate-400">Marketing</span>{pf.marketingPerson}</p>
                                            <p><span className="block font-bold text-slate-400">Delivery</span>{pf.placeOfDelivery}</p>
                                            <p><span className="block font-bold text-slate-400">Port</span>{pf.portOfDischarge}</p>
                                            <p><span className="block font-bold text-slate-400">Paid</span>{pf.totalPaidAmount}</p>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="ml-4 mt-2 space-y-2 border-l-2 border-violet-200 pl-3">
                                        {pf.invoices.map((invoice) => (
                                          <div key={invoice.invoiceCode} className="rounded-lg border border-violet-100 bg-violet-50/40 p-2.5">
                                            <div className="flex items-start justify-between gap-3">
                                              <div>
                                                <p className="text-micro font-bold uppercase text-violet-500">Invoice</p>
                                                <p className="font-extrabold text-violet-700">
                                                  {invoice.inquiryCode} · {invoice.invoiceCode}
                                                </p>
                                              </div>
                                              <span className="font-black tabular-nums">{invoice.invoiceAmount}</span>
                                            </div>
                                            <div className="mt-2 grid grid-cols-5 gap-1 text-micro text-slate-600">
                                              <p><span className="block font-bold text-slate-400">Days</span>{invoice.noOfDays}</p>
                                              <p><span className="block font-bold text-slate-400">Sale Return</span>{invoice.saleReturn.total}</p>
                                              <p><span className="block font-bold text-slate-400">Other PI</span>{invoice.saleReturn.otherPiAdj}</p>
                                              <p><span className="block font-bold text-slate-400">SR JV</span>{invoice.saleReturn.srJvAdj}</p>
                                              <p><span className="block font-bold text-slate-400">JV Adj</span>{invoice.jvAdjAmount}</p>
                                            </div>

                                            <div className="ml-4 mt-2 space-y-2 border-l-2 border-sky-200 pl-3">
                                              {invoice.shipments.map((shipment) => (
                                                <div key={shipment.shipmentCode} className="rounded-lg border border-sky-100 bg-white p-2.5">
                                                  <div className="flex justify-between gap-3">
                                                    <div>
                                                      <p className="text-micro font-bold uppercase text-sky-500">Shipment</p>
                                                      <p className="font-extrabold text-sky-700">{shipment.shipmentCode}</p>
                                                    </div>
                                                    <p className="text-micro font-semibold text-slate-500">
                                                      Created · {shipment.shipmentCreatedDate}
                                                    </p>
                                                  </div>
                                                  <div className="ml-4 mt-2 grid grid-cols-1 gap-1.5 border-l-2 border-rose-200 pl-3 sm:grid-cols-2">
                                                    {shipment.containers.map((container) => (
                                                      <div key={container.containerNo} className="rounded-lg border border-rose-100 bg-rose-50/50 p-2">
                                                        <p className="text-micro font-bold uppercase text-rose-500">Container</p>
                                                        <p className="font-extrabold text-[#0f2b3c]">
                                                          {container.containerType} · {container.containerNo}
                                                        </p>
                                                        <p className="mt-1 text-micro text-slate-500">
                                                          BL {container.blNumber} · Gate {container.gateOutDate} · ETA {container.etaDate}
                                                        </p>
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
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
              <p className="border-t border-slate-100 bg-slate-50 px-3 py-2 text-center text-micro font-semibold text-slate-400">
                Tap a customer to view nested delivery details
              </p>
            </div>
          ) : (
            filteredDeliveries.map((order) => {
              const custOpen = !!expanded[order.id];
              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
                    custOpen ? 'border-[#0f2b3c]/25' : 'border-slate-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleKey(setExpanded, order.id)}
                    className="w-full text-left p-3 cursor-pointer active:bg-slate-50/80"
                  >
                    <div className="flex items-start gap-2.5">
                      {expandBtn(custOpen)}
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-body-sm font-extrabold text-blue-600 leading-snug line-clamp-2">
                              {order.customerName}
                            </p>
                            <p className="text-caption font-semibold text-slate-400 mt-0.5">
                              Gate Out · {order.gateOutDate}
                            </p>
                          </div>
                          <span className={`text-label font-black tabular-nums shrink-0 ${amountClass(order.totalRemainingAmount)}`}>
                            {order.totalRemainingAmount}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            ['Invoice', order.totalInvoiceAmount],
                            ['Sale Return', order.totalSaleReturnAmount],
                            ['JV Adj', order.totalJvAdjAmount],
                            ['Advance', order.remainingAdvance],
                          ].map(([label, value]) => (
                            <div
                              key={label}
                              className="rounded-lg bg-slate-50 border border-slate-100 px-2 py-1.5"
                            >
                              <p className="text-micro font-bold uppercase tracking-wider text-slate-400">
                                {label}
                              </p>
                              <p className={`text-label font-bold tabular-nums mt-0.5 ${amountClass(String(value))}`}>
                                {value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>

                  {custOpen && (
                    <div className="border-t border-slate-100 bg-slate-50/70 p-2.5 space-y-2">
                      {order.proformas.map((pf) => {
                        const pfOpen = !!expandedProforma[pf.proformaCode];
                        return (
                          <div
                            key={pf.proformaCode}
                            className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                          >
                            <button
                              type="button"
                              onClick={() => toggleKey(setExpandedProforma, pf.proformaCode)}
                              className="w-full text-left p-2.5 cursor-pointer"
                            >
                              <div className="flex items-start gap-2">
                                {expandBtn(pfOpen)}
                                <div className="min-w-0 flex-1 space-y-1.5">
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="text-label font-extrabold text-blue-600">
                                      {pf.proformaCode}
                                    </p>
                                    <p className={`text-label font-black tabular-nums ${amountClass(pf.totalRemainingAmount)}`}>
                                      {pf.totalRemainingAmount}
                                    </p>
                                  </div>
                                  <p className="text-caption text-slate-500 line-clamp-1">{pf.company}</p>
                                  <div className="grid grid-cols-2 gap-1.5 text-caption">
                                    <p>
                                      <span className="text-slate-400 font-bold uppercase text-micro block">
                                        Marketing
                                      </span>
                                      <span className="font-bold text-blue-600">{pf.marketingPerson}</span>
                                    </p>
                                    <p>
                                      <span className="text-slate-400 font-bold uppercase text-micro block">
                                        Port
                                      </span>
                                      <span className="font-semibold text-slate-700 line-clamp-1">
                                        {pf.portOfDischarge}
                                      </span>
                                    </p>
                                    <p>
                                      <span className="text-slate-400 font-bold uppercase text-micro block">
                                        Delivery
                                      </span>
                                      <span className="font-semibold text-slate-700">{pf.placeOfDelivery}</span>
                                    </p>
                                    <p>
                                      <span className="text-slate-400 font-bold uppercase text-micro block">
                                        Paid
                                      </span>
                                      <span className="font-bold text-[#0f2b3c]">{pf.totalPaidAmount}</span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </button>

                            {pfOpen && (
                              <div className="border-t border-slate-100 bg-slate-50/80 p-2 space-y-2">
                                {pf.invoices.map((inv) => {
                                  const invOpen = !!expandedInvoice[inv.invoiceCode];
                                  return (
                                    <div
                                      key={inv.invoiceCode}
                                      className="bg-white rounded-lg border border-slate-200 overflow-hidden"
                                    >
                                      <button
                                        type="button"
                                        onClick={() => toggleKey(setExpandedInvoice, inv.invoiceCode)}
                                        className="w-full text-left p-2 cursor-pointer"
                                      >
                                        <div className="flex items-start gap-2">
                                          {expandBtn(invOpen)}
                                          <div className="min-w-0 flex-1 space-y-1">
                                            <div className="flex items-center justify-between gap-2">
                                              <p className="text-label font-extrabold text-blue-600">
                                                {inv.inquiryCode} · {inv.invoiceCode}
                                              </p>
                                              <p className="text-label font-black text-[#0f2b3c] tabular-nums">
                                                {inv.invoiceAmount}
                                              </p>
                                            </div>
                                            <div className="grid grid-cols-3 gap-1 text-micro">
                                              <p className="font-semibold text-slate-600">
                                                Days <span className="font-black text-[#0f2b3c]">{inv.noOfDays}</span>
                                              </p>
                                              <p className="font-semibold text-slate-600">
                                                SR <span className="font-black text-[#0f2b3c]">{inv.saleReturn.total}</span>
                                              </p>
                                              <p className="font-semibold text-slate-600">
                                                JV <span className="font-black text-[#0f2b3c]">{inv.jvAdjAmount}</span>
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </button>

                                      {invOpen && (
                                        <div className="border-t border-slate-100 bg-slate-50 p-2 space-y-2">
                                          {inv.shipments.map((ship) => {
                                            const shipOpen = !!expandedShipment[ship.shipmentCode];
                                            return (
                                              <div
                                                key={ship.shipmentCode}
                                                className="bg-white rounded-lg border border-slate-200 overflow-hidden"
                                              >
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    toggleKey(setExpandedShipment, ship.shipmentCode)
                                                  }
                                                  className="w-full text-left p-2 cursor-pointer"
                                                >
                                                  <div className="flex items-start gap-2">
                                                    {expandBtn(shipOpen)}
                                                    <div className="min-w-0 flex-1">
                                                      <p className="text-label font-extrabold text-blue-600">
                                                        {ship.shipmentCode}
                                                      </p>
                                                      <p className="text-caption text-slate-500 mt-0.5">
                                                        Created · {ship.shipmentCreatedDate}
                                                      </p>
                                                    </div>
                                                  </div>
                                                </button>

                                                {shipOpen && (
                                                  <div className="border-t border-rose-100 bg-rose-50/60 p-2 space-y-1.5">
                                                    <p className="text-micro font-bold uppercase tracking-wider text-rose-400 px-0.5">
                                                      Containers
                                                    </p>
                                                    {ship.containers.map((c) => (
                                                      <div
                                                        key={c.containerNo}
                                                        className="bg-white rounded-lg border border-rose-100 p-2 space-y-1"
                                                      >
                                                        <p className="text-label font-extrabold text-[#0f2b3c]">
                                                          {c.containerType}
                                                        </p>
                                                        <div className="grid grid-cols-2 gap-1 text-caption">
                                                          <p>
                                                            <span className="text-slate-400 font-bold uppercase text-micro block">
                                                              Container No
                                                            </span>
                                                            <span className="font-bold text-blue-600">
                                                              {c.containerNo}
                                                            </span>
                                                          </p>
                                                          <p>
                                                            <span className="text-slate-400 font-bold uppercase text-micro block">
                                                              BL Number
                                                            </span>
                                                            <span className="font-bold text-slate-700">
                                                              {c.blNumber}
                                                            </span>
                                                          </p>
                                                          <p>
                                                            <span className="text-slate-400 font-bold uppercase text-micro block">
                                                              Gate Out
                                                            </span>
                                                            <span className="font-semibold text-slate-700">
                                                              {c.gateOutDate}
                                                            </span>
                                                          </p>
                                                          <p>
                                                            <span className="text-slate-400 font-bold uppercase text-micro block">
                                                              ETA
                                                            </span>
                                                            <span className="font-semibold text-slate-700">
                                                              {c.etaDate}
                                                            </span>
                                                          </p>
                                                        </div>
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </DashSection>
    </DashShell>
  );
};

/* ------------------------------------------------------------------ */
/* Finance                                                              */
/* ------------------------------------------------------------------ */

export const FinanceDashboardJourney: React.FC = () => {
  const [masked, setMasked] = useState(true);
  const [forecastViewMode, setForecastViewMode] = useState<'chart' | 'table'>('chart');
  const [expenseViewMode, setExpenseViewMode] = useState<'chart' | 'table'>('chart');
  const [paymentViewMode, setPaymentViewMode] = useState<'cards' | 'table'>('cards');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'cu-057': true });
  const [expandedProforma, setExpandedProforma] = useState<Record<string, boolean>>({ 'PI-175': true });
  const [expandedInvoice, setExpandedInvoice] = useState<Record<string, boolean>>({ 'SI-187': true });
  const [expandedShipment, setExpandedShipment] = useState<Record<string, boolean>>({ 'ES-170': true });
  const [showPayFilters, setShowPayFilters] = useState(false);
  const [paySearch, setPaySearch] = useState('');
  const [customerFilter, setCustomerFilter] = useState('All');
  const [companyFilter, setCompanyFilter] = useState('All');
  const [marketingFilter, setMarketingFilter] = useState('All');
  const [deliveryFilter, setDeliveryFilter] = useState('All');
  const [portFilter, setPortFilter] = useState('All');

  const toggleKey = (
    setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
    key: string
  ) => setter((prev) => ({ ...prev, [key]: !prev[key] }));

  const isNegativeAmount = (value: string) =>
    value.includes('(') || /\$-/.test(value) || value.includes('-');

  const customerOptions = useMemo(
    () => ['All', ...Array.from(new Set(PENDING_PAYMENTS_DATA.map((p) => p.customerName)))],
    []
  );
  const companyOptions = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(PENDING_PAYMENTS_DATA.flatMap((p) => p.proformas.map((pf) => pf.company)))
      ),
    ],
    []
  );
  const marketingOptions = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(PENDING_PAYMENTS_DATA.flatMap((p) => p.proformas.map((pf) => pf.marketingPersonal)))
      ),
    ],
    []
  );
  const deliveryOptions = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(PENDING_PAYMENTS_DATA.flatMap((p) => p.proformas.map((pf) => pf.placeOfDelivery)))
      ),
    ],
    []
  );
  const portOptions = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(PENDING_PAYMENTS_DATA.flatMap((p) => p.proformas.map((pf) => pf.portOfDischarge)))
      ),
    ],
    []
  );

  const payFilterCount = [
    paySearch.trim() !== '',
    customerFilter !== 'All',
    companyFilter !== 'All',
    marketingFilter !== 'All',
    deliveryFilter !== 'All',
    portFilter !== 'All',
  ].filter(Boolean).length;

  const clearPayFilters = () => {
    setPaySearch('');
    setCustomerFilter('All');
    setCompanyFilter('All');
    setMarketingFilter('All');
    setDeliveryFilter('All');
    setPortFilter('All');
  };

  const filteredPayments = useMemo(() => {
    const q = paySearch.trim().toLowerCase();
    return PENDING_PAYMENTS_DATA.filter((item) => {
      const matchesSearch =
        q === '' ||
        item.customerName.toLowerCase().includes(q) ||
        item.proformas.some(
          (pf) =>
            pf.proformaCode.toLowerCase().includes(q) ||
            pf.company.toLowerCase().includes(q) ||
            pf.marketingPersonal.toLowerCase().includes(q) ||
            pf.placeOfDelivery.toLowerCase().includes(q) ||
            pf.portOfDischarge.toLowerCase().includes(q) ||
            pf.invoices.some(
              (inv) =>
                inv.inquiryCode.toLowerCase().includes(q) ||
                inv.invoiceCode.toLowerCase().includes(q) ||
                inv.shipments.some(
                  (s) =>
                    s.shipmentCode.toLowerCase().includes(q) ||
                    s.containers.some(
                      (c) =>
                        c.containerNo.toLowerCase().includes(q) ||
                        c.blNumber.toLowerCase().includes(q)
                    )
                )
            )
        );

      const matchesCustomer = customerFilter === 'All' || item.customerName === customerFilter;
      const matchesCompany =
        companyFilter === 'All' || item.proformas.some((pf) => pf.company === companyFilter);
      const matchesMarketing =
        marketingFilter === 'All' ||
        item.proformas.some((pf) => pf.marketingPersonal === marketingFilter);
      const matchesDelivery =
        deliveryFilter === 'All' ||
        item.proformas.some((pf) => pf.placeOfDelivery === deliveryFilter);
      const matchesPort =
        portFilter === 'All' || item.proformas.some((pf) => pf.portOfDischarge === portFilter);

      return (
        matchesSearch &&
        matchesCustomer &&
        matchesCompany &&
        matchesMarketing &&
        matchesDelivery &&
        matchesPort
      );
    });
  }, [paySearch, customerFilter, companyFilter, marketingFilter, deliveryFilter, portFilter]);

  const taskTone = (icon: string) => {
    const map: Record<string, { accent: string; blob: string; iconBg: string }> = {
      payment_confirmations: { accent: '#0284c7', blob: 'bg-sky-400/20', iconBg: 'bg-sky-600' },
      awaiting_confirmations: { accent: '#f59e0b', blob: 'bg-amber-400/20', iconBg: 'bg-amber-600' },
      receipt_vouchers: { accent: '#10b981', blob: 'bg-emerald-400/20', iconBg: 'bg-emerald-600' },
      purchase_approval: { accent: '#8b5cf6', blob: 'bg-violet-400/20', iconBg: 'bg-violet-600' },
      sale_approval: { accent: '#14b8a6', blob: 'bg-teal-400/20', iconBg: 'bg-teal-600' },
      open_ticket: { accent: '#f43f5e', blob: 'bg-rose-400/20', iconBg: 'bg-rose-600' },
      awaiting_documents: { accent: '#6366f1', blob: 'bg-indigo-400/20', iconBg: 'bg-indigo-600' },
    };
    return map[icon] ?? { accent: '#64748b', blob: 'bg-slate-400/20', iconBg: 'bg-slate-600' };
  };

  const taskIconWhite = (icon: string) => {
    const map: Record<string, React.ReactNode> = {
      payment_confirmations: <CreditCard className="w-4 h-4 text-white" />,
      awaiting_confirmations: <Clock className="w-4 h-4 text-white" />,
      receipt_vouchers: <Receipt className="w-4 h-4 text-white" />,
      purchase_approval: <FileCheck className="w-4 h-4 text-white" />,
      sale_approval: <CheckCircle2 className="w-4 h-4 text-white" />,
      open_ticket: <MessageSquare className="w-4 h-4 text-white" />,
      awaiting_documents: <FileText className="w-4 h-4 text-white" />,
    };
    return map[icon] ?? <Landmark className="w-4 h-4 text-white" />;
  };

  const balanceIcon = (icon: string) => {
    const map: Record<string, React.ReactNode> = {
      banks: <Landmark className="w-4 h-4 text-sky-600" />,
      cash: <Coins className="w-4 h-4 text-emerald-600" />,
      inventory: <Package className="w-4 h-4 text-amber-600" />,
      contractor: <Building2 className="w-4 h-4 text-violet-600" />,
      receivable: <UserCheck className="w-4 h-4 text-teal-600" />,
      payables: <CreditCard className="w-4 h-4 text-rose-600" />,
    };
    return map[icon] ?? <Coins className="w-4 h-4" />;
  };

  const taskSum = FINANCE_TASKS.reduce((s, t) => s + t.value, 0);

  const amountClass = (value: string) =>
    isNegativeAmount(value) ? 'text-rose-600' : 'text-[#0f2b3c]';

  const expandBtn = (open: boolean) => (
    <span
      className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${
        open
          ? 'bg-[#0f2b3c] border-[#0f2b3c] text-white'
          : 'bg-slate-50 border-slate-200 text-slate-500'
      }`}
    >
      {open ? <ChevronDown className="w-3.5 h-3.5" /> : <span className="text-md font-bold leading-none">+</span>}
    </span>
  );

  const selectClass =
    'w-full appearance-none rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-label font-semibold text-[#0f2b3c] focus:outline-none focus:ring-2 focus:ring-[#0f2b3c]/15';

  return (
    <DashShell>
      <DashSection
        title="Finance Tasks"
        action={
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0f2b3c] text-white text-caption font-bold">
            {taskSum} open
          </span>
        }
      >
        <DashMetricGrid>
          {FINANCE_TASKS.map((t, index) => {
            const tone = taskTone(t.icon);
            const isLastOdd = index === FINANCE_TASKS.length - 1 && FINANCE_TASKS.length % 2 === 1;
            return (
              <DashMetricCard
                key={t.id}
                label={t.label}
                value={t.value}
                color={tone.accent}
                icon={taskIconWhite(t.icon)}
                criteria={t.criteria}
                className={isLastOdd ? 'col-span-2' : ''}
                valueClassName={t.value === 0 ? 'text-slate-300' : undefined}
                onClick={() => {}}
              />
            );
          })}
        </DashMetricGrid>
      </DashSection>

      <DashSection
        title="Balance Sheet Pulse"
        action={
          <button
            type="button"
            onClick={() => setMasked((v) => !v)}
            className="inline-flex items-center gap-1 text-label font-bold text-teal-700 cursor-pointer"
          >
            {masked ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {masked ? 'Reveal' : 'Hide'}
          </button>
        }
      >
        <div className="grid grid-cols-2 gap-2.5">
          {FINANCE_BALANCE_ITEMS.map((b) => {
            const toneMap: Record<string, { accent: string; chip: string; iconBg: string }> = {
              banks: { accent: '#0284c7', chip: 'bg-sky-50 text-sky-800 border-sky-100', iconBg: 'bg-sky-50' },
              cash: { accent: '#10b981', chip: 'bg-emerald-50 text-emerald-800 border-emerald-100', iconBg: 'bg-emerald-50' },
              inventory: { accent: '#f59e0b', chip: 'bg-amber-50 text-amber-800 border-amber-100', iconBg: 'bg-amber-50' },
              contractor: { accent: '#8b5cf6', chip: 'bg-violet-50 text-violet-800 border-violet-100', iconBg: 'bg-violet-50' },
              receivable: { accent: '#14b8a6', chip: 'bg-teal-50 text-teal-800 border-teal-100', iconBg: 'bg-teal-50' },
              payables: { accent: '#f43f5e', chip: 'bg-rose-50 text-rose-800 border-rose-100', iconBg: 'bg-rose-50' },
            };
            const tone = toneMap[b.icon] ?? {
              accent: '#64748b',
              chip: 'bg-slate-50 text-slate-700 border-slate-200',
              iconBg: 'bg-slate-50',
            };
            const display = masked ? b.maskedValue : b.actualValue;
            const [currency, ...rest] = display.split(' ');
            const amountPart = rest.join(' ') || display;

            return (
              <div
                key={b.id}
                className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-2.5 shadow-sm"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: tone.accent }}
                />
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${tone.iconBg}`}>
                    {balanceIcon(b.icon)}
                  </div>
                  <p className="text-micro font-bold uppercase tracking-wider text-slate-400 leading-tight line-clamp-2">
                    {b.label}
                  </p>
                </div>
                <div
                  className={`inline-flex items-baseline gap-1 px-2 py-1 rounded-lg border font-mono ${tone.chip}`}
                >
                  <span className="text-micro font-bold uppercase opacity-60">{currency}</span>
                  <span className="text-body-sm font-black tabular-nums tracking-tight">{amountPart}</span>
                </div>
              </div>
            );
          })}
        </div>
      </DashSection>

      <DashSection
        title="Container Forecast"
        action={
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-0.5">
            <button
              type="button"
              onClick={() => setForecastViewMode('chart')}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-caption font-bold cursor-pointer ${
                forecastViewMode === 'chart' ? 'bg-[#0f2b3c] text-white' : 'text-slate-500'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Chart
            </button>
            <button
              type="button"
              onClick={() => setForecastViewMode('table')}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-caption font-bold cursor-pointer ${
                forecastViewMode === 'table' ? 'bg-[#0f2b3c] text-white' : 'text-slate-500'
              }`}
            >
              <Table2 className="w-3.5 h-3.5" />
              Table
            </button>
          </div>
        }
      >
        <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm space-y-2.5">
          {forecastViewMode === 'table' ? (
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-caption text-left border-collapse min-w-[280px]">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200 text-slate-600">
                    <th className="py-1.5 px-2 font-bold">Mo</th>
                    <th className="py-1.5 px-2 font-bold text-right">Del</th>
                    <th className="py-1.5 px-2 font-bold text-right">Conf</th>
                    <th className="py-1.5 px-2 font-bold text-right">Tot</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {CONTAINER_WISE_FORECAST_DATA.map((item) => (
                    <tr key={item.month}>
                      <td className="py-1.5 px-2 font-bold text-[#0f2b3c]">{item.month}</td>
                      <td className="py-1.5 px-2 text-right font-semibold text-blue-700 tabular-nums">
                        {item.delivered}
                      </td>
                      <td className="py-1.5 px-2 text-right font-semibold text-emerald-700 tabular-nums">
                        {item.confirmed}
                      </td>
                      <td className="py-1.5 px-2 text-right font-black tabular-nums">
                        {item.delivered + item.confirmed}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-3 text-caption font-semibold text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-[#3b82f6]" /> Delivered
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm bg-[#10b981]" /> Confirmed
                </span>
              </div>
              <div className="flex items-end justify-between gap-0.5 h-28 px-0.5">
                {CONTAINER_WISE_FORECAST_DATA.map((item) => {
                  const maxVal = 80;
                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center justify-end h-full gap-0.5">
                      <div className="w-full flex items-end justify-center gap-px h-[calc(100%-1rem)]">
                        <div
                          className="w-[45%] max-w-[6px] bg-[#3b82f6] rounded-t-sm"
                          style={{ height: `${Math.min(100, (item.delivered / maxVal) * 100)}%` }}
                        />
                        <div
                          className="w-[45%] max-w-[6px] bg-[#10b981] rounded-t-sm"
                          style={{ height: `${Math.min(100, (item.confirmed / maxVal) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase leading-none">
                        {item.month.slice(0, 1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </DashSection>

      <DashSection
        title="Operating Expense"
        action={
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-0.5">
            <button
              type="button"
              onClick={() => setExpenseViewMode('chart')}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-caption font-bold cursor-pointer ${
                expenseViewMode === 'chart' ? 'bg-[#0f2b3c] text-white' : 'text-slate-500'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Chart
            </button>
            <button
              type="button"
              onClick={() => setExpenseViewMode('table')}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-caption font-bold cursor-pointer ${
                expenseViewMode === 'table' ? 'bg-[#0f2b3c] text-white' : 'text-slate-500'
              }`}
            >
              <Table2 className="w-3.5 h-3.5" />
              Table
            </button>
          </div>
        }
      >
        <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
          {expenseViewMode === 'table' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 px-3 py-2">
                <span className="text-label font-semibold text-slate-600">
                  {OPERATING_EXPENSE_DATA.currentYearLabel}
                </span>
                <span className="text-body font-black text-[#0f2b3c]">
                  {OPERATING_EXPENSE_DATA.currentYearValue}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 px-3 py-2">
                <span className="text-label font-semibold text-slate-600">
                  {OPERATING_EXPENSE_DATA.previousYearLabel}
                </span>
                <span className="text-body font-black text-[#0f2b3c]">
                  {OPERATING_EXPENSE_DATA.previousYearValue}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-rose-50 border border-rose-100 px-3 py-2">
                <span className="text-label font-bold text-slate-700">
                  {OPERATING_EXPENSE_DATA.changeLabel}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded-md text-caption font-black bg-rose-100 text-rose-700">
                    {OPERATING_EXPENSE_DATA.changeTag}
                  </span>
                  <span className="text-label font-bold text-rose-600">
                    {OPERATING_EXPENSE_DATA.changeValue}
                  </span>
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="relative w-24 h-24 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="36" fill="transparent" stroke="#f1f5f9" strokeWidth="10" />
                  <circle
                    cx="50"
                    cy="50"
                    r="36"
                    fill="transparent"
                    stroke="#2563eb"
                    strokeWidth="10"
                    strokeDasharray={`${(OPERATING_EXPENSE_DATA.currentYearPercent / 100) * 226.08} 226.08`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-caption font-bold text-slate-400">2026</span>
                  <span className="text-body font-black text-[#0f2b3c]">
                    {OPERATING_EXPENSE_DATA.currentYearValue}
                  </span>
                </div>
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-caption font-semibold text-slate-500 truncate">2026</span>
                  <span className="text-label font-black text-blue-700">
                    {OPERATING_EXPENSE_DATA.currentYearValue}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-caption font-semibold text-slate-500 truncate">2025</span>
                  <span className="text-label font-black text-emerald-700">
                    {OPERATING_EXPENSE_DATA.previousYearValue}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-caption font-bold text-slate-600 truncate">vs 2025</span>
                  <span className="text-caption font-black text-rose-600">
                    {OPERATING_EXPENSE_DATA.changeTag}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashSection>

      <DashSection
        title="Pending Payments"
        action={
          <div className="flex items-center gap-2">
            <DashCriteriaTip criteria={PENDING_PAYMENTS_CRITERIA} accentColor="#d97706" />
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0f2b3c] text-white text-caption font-bold">
              {filteredPayments.length} found
            </span>
          </div>
        }
      >
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={paySearch}
                onChange={(e) => setPaySearch(e.target.value)}
                placeholder="Search customer, PI, invoice..."
                className="w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3 py-2 text-body-sm font-semibold text-[#0f2b3c] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f2b3c]/15"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowPayFilters((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-label font-bold border cursor-pointer transition-colors ${
                showPayFilters || payFilterCount > 0
                  ? 'bg-[#0f2b3c] text-white border-[#0f2b3c]'
                  : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              Filters
              {payFilterCount > 0 && (
                <span className="min-w-[1.1rem] h-4 px-1 rounded-full bg-white/20 text-caption flex items-center justify-center">
                  {payFilterCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-1 shadow-xs">
            <span className="pl-2 text-micro font-bold uppercase tracking-wider text-slate-400">
              Display
            </span>
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5">
              <button
                type="button"
                onClick={() => setPaymentViewMode('cards')}
                className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-caption font-bold cursor-pointer ${
                  paymentViewMode === 'cards'
                    ? 'bg-[#0f2b3c] text-white shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                <List className="h-3.5 w-3.5" />
                Cards
              </button>
              <button
                type="button"
                onClick={() => setPaymentViewMode('table')}
                className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-caption font-bold cursor-pointer ${
                  paymentViewMode === 'table'
                    ? 'bg-[#0f2b3c] text-white shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                <Table2 className="h-3.5 w-3.5" />
                Table
              </button>
            </div>
          </div>

          {showPayFilters && (
            <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <p className="text-label font-extrabold uppercase tracking-wider text-[#0f2b3c]">
                  Filter Payments
                </p>
                <button
                  type="button"
                  onClick={clearPayFilters}
                  className="inline-flex items-center gap-1 text-label font-bold text-rose-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="space-y-1 col-span-2">
                  <span className="text-micro font-bold uppercase tracking-wider text-slate-400 block">
                    Customer
                  </span>
                  <select
                    value={customerFilter}
                    onChange={(e) => setCustomerFilter(e.target.value)}
                    className={selectClass}
                  >
                    {customerOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === 'All' ? 'All Customers' : opt}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1 col-span-2">
                  <span className="text-micro font-bold uppercase tracking-wider text-slate-400 block">
                    Company
                  </span>
                  <select
                    value={companyFilter}
                    onChange={(e) => setCompanyFilter(e.target.value)}
                    className={selectClass}
                  >
                    {companyOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === 'All' ? 'All Companies' : opt}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-micro font-bold uppercase tracking-wider text-slate-400 block">
                    Marketing
                  </span>
                  <select
                    value={marketingFilter}
                    onChange={(e) => setMarketingFilter(e.target.value)}
                    className={selectClass}
                  >
                    {marketingOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === 'All' ? 'All Marketing' : opt}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-micro font-bold uppercase tracking-wider text-slate-400 block">
                    Place of Delivery
                  </span>
                  <select
                    value={deliveryFilter}
                    onChange={(e) => setDeliveryFilter(e.target.value)}
                    className={selectClass}
                  >
                    {deliveryOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === 'All' ? 'All Places' : opt}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1 col-span-2">
                  <span className="text-micro font-bold uppercase tracking-wider text-slate-400 block">
                    Port of Discharge
                  </span>
                  <select
                    value={portFilter}
                    onChange={(e) => setPortFilter(e.target.value)}
                    className={selectClass}
                  >
                    {portOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt === 'All' ? 'All Ports' : opt}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          )}

          {filteredPayments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-6 text-center">
              <p className="text-body-sm font-bold text-slate-500">No pending payments match filters</p>
              <button
                type="button"
                onClick={clearPayFilters}
                className="mt-2 text-label font-bold text-blue-600 cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          ) : paymentViewMode === 'table' ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-left text-caption">
                  <thead className="bg-[#0f2b3c] text-white">
                    <tr>
                      <th className="px-3 py-2.5 font-bold">Customer</th>
                      <th className="px-3 py-2.5 text-right font-bold">Invoice</th>
                      <th className="px-3 py-2.5 text-right font-bold">Received</th>
                      <th className="px-3 py-2.5 text-right font-bold">Remaining</th>
                      <th className="px-3 py-2.5 font-bold">Gate Out</th>
                      <th className="px-3 py-2.5 text-center font-bold">Proformas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPayments.map((item) => {
                      const isOpen = !!expanded[item.id];
                      return (
                        <React.Fragment key={item.id}>
                          <tr className={isOpen ? 'bg-blue-50/50' : 'hover:bg-slate-50'}>
                            <td className="max-w-[250px] px-3 py-2.5">
                              <button
                                type="button"
                                onClick={() => toggleKey(setExpanded, item.id)}
                                className="flex items-center gap-2 text-left font-extrabold text-blue-700 cursor-pointer"
                                aria-expanded={isOpen}
                              >
                                {expandBtn(isOpen)}
                                <span>{item.customerName}</span>
                              </button>
                            </td>
                            <td className="px-3 py-2.5 text-right font-bold tabular-nums text-[#0f2b3c]">
                              {item.totalInvoiceAmount}
                            </td>
                            <td className="px-3 py-2.5 text-right font-bold tabular-nums text-emerald-700">
                              {item.totalReceivedAmount}
                            </td>
                            <td className={`px-3 py-2.5 text-right font-black tabular-nums ${amountClass(item.totalRemainingAmount)}`}>
                              {item.totalRemainingAmount}
                            </td>
                            <td className="px-3 py-2.5 font-semibold text-slate-600 whitespace-nowrap">
                              {item.gateOutDate}
                            </td>
                            <td className="px-3 py-2.5 text-center">
                              <span className="rounded-full bg-slate-100 px-2 py-1 font-black text-slate-700">
                                {item.proformas.length}
                              </span>
                            </td>
                          </tr>
                          {isOpen && (
                            <tr className="bg-slate-50/70">
                              <td colSpan={6} className="p-3">
                                <div className="space-y-2">
                                  {item.proformas.map((pf) => (
                                    <div
                                      key={`${item.id}-table-${pf.proformaCode}`}
                                      className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs"
                                    >
                                      <div className="flex items-start gap-2">
                                        <span className="rounded-lg bg-blue-600 px-2 py-1 font-black text-white">
                                          PI
                                        </span>
                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-start justify-between gap-3">
                                            <div>
                                              <p className="font-extrabold text-blue-700">{pf.proformaCode}</p>
                                              <p className="mt-0.5 text-caption font-semibold text-slate-500">
                                                {pf.company}
                                              </p>
                                            </div>
                                            <span className={`font-black tabular-nums ${amountClass(pf.totalRemainingAmount)}`}>
                                              {pf.totalRemainingAmount}
                                            </span>
                                          </div>
                                          <div className="mt-2 grid grid-cols-4 gap-1.5 text-micro">
                                            <p><span className="block font-bold text-slate-400">Marketing</span>{pf.marketingPersonal}</p>
                                            <p><span className="block font-bold text-slate-400">Delivery</span>{pf.placeOfDelivery}</p>
                                            <p><span className="block font-bold text-slate-400">Port</span>{pf.portOfDischarge}</p>
                                            <p><span className="block font-bold text-slate-400">Paid</span>{pf.totalPaidAmount}</p>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="ml-4 mt-2 space-y-2 border-l-2 border-violet-200 pl-3">
                                        {pf.invoices.map((invoice) => (
                                          <div
                                            key={invoice.invoiceCode}
                                            className="rounded-lg border border-violet-100 bg-violet-50/40 p-2.5"
                                          >
                                            <div className="flex items-start justify-between gap-3">
                                              <div>
                                                <p className="text-micro font-bold uppercase text-violet-500">Invoice</p>
                                                <p className="font-extrabold text-violet-700">
                                                  {invoice.inquiryCode} · {invoice.invoiceCode}
                                                </p>
                                              </div>
                                              <span className="font-black tabular-nums">{invoice.invoiceAmount}</span>
                                            </div>
                                            <div className="mt-2 grid grid-cols-5 gap-1 text-micro text-slate-600">
                                              <p><span className="block font-bold text-slate-400">Days</span>{invoice.noOfDays}</p>
                                              <p><span className="block font-bold text-slate-400">Sale Return</span>{invoice.saleReturn.total}</p>
                                              <p><span className="block font-bold text-slate-400">Other PI</span>{invoice.saleReturn.otherPiAdj}</p>
                                              <p><span className="block font-bold text-slate-400">SR JV</span>{invoice.saleReturn.srJvAdj}</p>
                                              <p><span className="block font-bold text-slate-400">JV Adj</span>{invoice.jvAdjAmount}</p>
                                            </div>

                                            <div className="ml-4 mt-2 space-y-2 border-l-2 border-sky-200 pl-3">
                                              {invoice.shipments.map((shipment) => (
                                                <div key={shipment.shipmentCode} className="rounded-lg border border-sky-100 bg-white p-2.5">
                                                  <div className="flex justify-between gap-3">
                                                    <div>
                                                      <p className="text-micro font-bold uppercase text-sky-500">Shipment</p>
                                                      <p className="font-extrabold text-sky-700">{shipment.shipmentCode}</p>
                                                    </div>
                                                    <p className="text-micro font-semibold text-slate-500">
                                                      Created · {shipment.shipmentCreatedDate}
                                                    </p>
                                                  </div>
                                                  <div className="ml-4 mt-2 grid grid-cols-1 gap-1.5 border-l-2 border-rose-200 pl-3 sm:grid-cols-2">
                                                    {shipment.containers.map((container) => (
                                                      <div key={container.containerNo} className="rounded-lg border border-rose-100 bg-rose-50/50 p-2">
                                                        <p className="text-micro font-bold uppercase text-rose-500">Container</p>
                                                        <p className="font-extrabold text-[#0f2b3c]">
                                                          {container.containerType} · {container.containerNo}
                                                        </p>
                                                        <p className="mt-1 text-micro text-slate-500">
                                                          BL {container.blNumber} · Gate {container.gateOutDate} · ETA {container.etaDate}
                                                        </p>
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
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
              <p className="border-t border-slate-100 bg-slate-50 px-3 py-2 text-center text-micro font-semibold text-slate-400">
                Tap a customer to view nested payment details
              </p>
            </div>
          ) : (
            filteredPayments.map((item) => {
              const custOpen = !!expanded[item.id];
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
                    custOpen ? 'border-[#0f2b3c]/25' : 'border-slate-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleKey(setExpanded, item.id)}
                    className="w-full text-left p-3 cursor-pointer active:bg-slate-50/80"
                  >
                    <div className="flex items-start gap-2.5">
                      {expandBtn(custOpen)}
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-body-sm font-extrabold text-blue-600 leading-snug line-clamp-2">
                            {item.customerName}
                          </p>
                          <span className={`text-label font-black tabular-nums shrink-0 ${amountClass(item.totalRemainingAmount)}`}>
                            {item.totalRemainingAmount}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            ['Invoice', item.totalInvoiceAmount],
                            ['Sale Return', item.totalSaleReturnAmount],
                            ['JV Adj', item.totalJvAdjAmount],
                            ['Advance', item.remainingAdvance],
                          ].map(([label, value]) => (
                            <div
                              key={label}
                              className="rounded-lg bg-slate-50 border border-slate-100 px-2 py-1.5"
                            >
                              <p className="text-micro font-bold uppercase tracking-wider text-slate-400">
                                {label}
                              </p>
                              <p className={`text-label font-bold tabular-nums mt-0.5 ${amountClass(String(value))}`}>
                                {value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>

                  {custOpen && (
                    <div className="border-t border-slate-100 bg-slate-50/70 p-2.5 space-y-2">
                      {item.proformas.map((pf) => {
                        const pfOpen = !!expandedProforma[pf.proformaCode];
                        return (
                          <div
                            key={pf.proformaCode}
                            className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                          >
                            <button
                              type="button"
                              onClick={() => toggleKey(setExpandedProforma, pf.proformaCode)}
                              className="w-full text-left p-2.5 cursor-pointer"
                            >
                              <div className="flex items-start gap-2">
                                {expandBtn(pfOpen)}
                                <div className="min-w-0 flex-1 space-y-1.5">
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="text-label font-extrabold text-blue-600">
                                      {pf.proformaCode}
                                    </p>
                                    <p className={`text-label font-black tabular-nums ${amountClass(pf.totalRemainingAmount)}`}>
                                      {pf.totalRemainingAmount}
                                    </p>
                                  </div>
                                  <p className="text-caption text-slate-500 line-clamp-1">{pf.company}</p>
                                  <div className="grid grid-cols-2 gap-1.5 text-caption">
                                    <p>
                                      <span className="text-slate-400 font-bold uppercase text-micro block">
                                        Marketing
                                      </span>
                                      <span className="font-bold text-blue-600">{pf.marketingPersonal}</span>
                                    </p>
                                    <p>
                                      <span className="text-slate-400 font-bold uppercase text-micro block">
                                        Delivery
                                      </span>
                                      <span className="font-semibold text-slate-700">{pf.placeOfDelivery}</span>
                                    </p>
                                    <p>
                                      <span className="text-slate-400 font-bold uppercase text-micro block">
                                        Port
                                      </span>
                                      <span className="font-semibold text-slate-700 line-clamp-1">
                                        {pf.portOfDischarge}
                                      </span>
                                    </p>
                                    <p>
                                      <span className="text-slate-400 font-bold uppercase text-micro block">
                                        Paid
                                      </span>
                                      <span className="font-bold text-[#0f2b3c]">{pf.totalPaidAmount}</span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </button>

                            {pfOpen && (
                              <div className="border-t border-slate-100 bg-slate-50/80 p-2 space-y-2">
                                {pf.invoices.map((inv) => {
                                  const invOpen = !!expandedInvoice[inv.invoiceCode];
                                  return (
                                    <div
                                      key={inv.invoiceCode}
                                      className="bg-white rounded-lg border border-slate-200 overflow-hidden"
                                    >
                                      <button
                                        type="button"
                                        onClick={() => toggleKey(setExpandedInvoice, inv.invoiceCode)}
                                        className="w-full text-left p-2 cursor-pointer"
                                      >
                                        <div className="flex items-start gap-2">
                                          {expandBtn(invOpen)}
                                          <div className="min-w-0 flex-1 space-y-1">
                                            <div className="flex items-center justify-between gap-2">
                                              <p className="text-label font-extrabold text-blue-600">
                                                {inv.inquiryCode} · {inv.invoiceCode}
                                              </p>
                                              <p className="text-label font-black text-[#0f2b3c] tabular-nums">
                                                {inv.invoiceAmount}
                                              </p>
                                            </div>
                                            <div className="grid grid-cols-3 gap-1 text-micro">
                                              <p className="font-semibold text-slate-600">
                                                Days <span className="font-black text-[#0f2b3c]">{inv.noOfDays}</span>
                                              </p>
                                              <p className="font-semibold text-slate-600">
                                                SR <span className="font-black text-[#0f2b3c]">{inv.saleReturn.total}</span>
                                              </p>
                                              <p className="font-semibold text-slate-600">
                                                Adj Adv <span className="font-black text-[#0f2b3c]">{inv.adjAdvance}</span>
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </button>

                                      {invOpen && (
                                        <div className="border-t border-slate-100 bg-slate-50 p-2 space-y-2">
                                          <div className="grid grid-cols-3 gap-1 text-micro px-1">
                                            <p>
                                              <span className="text-slate-400 font-bold uppercase block">Other PI Adj</span>
                                              <span className="font-bold text-slate-700">{inv.saleReturn.otherPiAdj}</span>
                                            </p>
                                            <p>
                                              <span className="text-slate-400 font-bold uppercase block">SR JV Adj</span>
                                              <span className="font-bold text-slate-700">{inv.saleReturn.srJvAdj}</span>
                                            </p>
                                            <p>
                                              <span className="text-slate-400 font-bold uppercase block">JV Adj</span>
                                              <span className="font-bold text-slate-700">{inv.jvAdjAmount}</span>
                                            </p>
                                          </div>
                                          {inv.shipments.map((ship) => {
                                            const shipOpen = !!expandedShipment[ship.shipmentCode];
                                            return (
                                              <div
                                                key={ship.shipmentCode}
                                                className="bg-white rounded-lg border border-slate-200 overflow-hidden"
                                              >
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    toggleKey(setExpandedShipment, ship.shipmentCode)
                                                  }
                                                  className="w-full text-left p-2 cursor-pointer"
                                                >
                                                  <div className="flex items-start gap-2">
                                                    {expandBtn(shipOpen)}
                                                    <div className="min-w-0 flex-1">
                                                      <p className="text-label font-extrabold text-blue-600">
                                                        {ship.shipmentCode}
                                                      </p>
                                                      <p className="text-caption text-slate-500 mt-0.5">
                                                        Created · {ship.shipmentCreatedDate}
                                                      </p>
                                                    </div>
                                                  </div>
                                                </button>

                                                {shipOpen && (
                                                  <div className="border-t border-rose-100 bg-rose-50/60 p-2 space-y-1.5">
                                                    <p className="text-micro font-bold uppercase tracking-wider text-rose-400 px-0.5">
                                                      Containers
                                                    </p>
                                                    {ship.containers.map((c) => (
                                                      <div
                                                        key={c.containerNo}
                                                        className="bg-white rounded-lg border border-rose-100 p-2 space-y-1"
                                                      >
                                                        <p className="text-label font-extrabold text-[#0f2b3c]">
                                                          {c.containerType}
                                                        </p>
                                                        <div className="grid grid-cols-2 gap-1 text-caption">
                                                          <p>
                                                            <span className="text-slate-400 font-bold uppercase text-micro block">
                                                              Container No
                                                            </span>
                                                            <span className="font-bold text-blue-600">
                                                              {c.containerNo}
                                                            </span>
                                                          </p>
                                                          <p>
                                                            <span className="text-slate-400 font-bold uppercase text-micro block">
                                                              BL Number
                                                            </span>
                                                            <span className="font-bold text-slate-700">
                                                              {c.blNumber}
                                                            </span>
                                                          </p>
                                                          <p>
                                                            <span className="text-slate-400 font-bold uppercase text-micro block">
                                                              Gate Out
                                                            </span>
                                                            <span className="font-semibold text-slate-700">
                                                              {c.gateOutDate}
                                                            </span>
                                                          </p>
                                                          <p>
                                                            <span className="text-slate-400 font-bold uppercase text-micro block">
                                                              ETA
                                                            </span>
                                                            <span className="font-semibold text-slate-700">
                                                              {c.etaDate}
                                                            </span>
                                                          </p>
                                                        </div>
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </DashSection>
    </DashShell>
  );
};

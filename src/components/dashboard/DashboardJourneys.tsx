/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Attractive mobile journey dashboards for Overview / Export / Purchase / Marketing / Finance
 */

import React, { useMemo, useState } from 'react';
import {
  BellRing,
  Building2,
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
  Landmark,
  Layers,
  List,
  MessageSquare,
  Package,
  Palette,
  Receipt,
  Send,
  Ship,
  ShoppingCart,
  TrendingUp,
  Truck,
  UserCheck,
  Users,
} from 'lucide-react';
import {
  DashHero,
  DashKpi,
  DashListCard,
  DashPill,
  DashSection,
  DashShell,
  DashTaskTile,
} from './DashboardChrome';
import {
  CASH_FLOW_DATA,
  DASHBOARD_METRIC_CARDS,
  FORECAST_WITHOUT_TRACKING_ROWS,
} from '../../data/dashboardAnalyticsData';
import {
  EXPORT_FOLLOW_UPS,
  EXPORT_TASKS,
} from '../../data/exportDashboardData';
import {
  CURRENT_MONTH_PERFORMANCE,
  DELAYED_ORDERS,
  NEXT_MONTH_SUMMARY,
  PURCHASE_TASKS,
} from '../../data/purchaseDashboardData';
import {
  MARKETING_FOLLOW_UPS,
  MARKETING_TASKS,
  PERFORMANCE_SUMMARY,
  RECENT_DELIVERED_ORDERS,
} from '../../data/marketingDashboardData';
import {
  FINANCE_BALANCE_ITEMS,
  FINANCE_TASKS,
  PENDING_PAYMENTS_DATA,
} from '../../data/financeDashboardData';

/* ------------------------------------------------------------------ */
/* Overview                                                             */
/* ------------------------------------------------------------------ */

export const OverviewDashboardJourney: React.FC = () => {
  const [cashMasked, setCashMasked] = useState(true);
  const [followPeriod, setFollowPeriod] = useState<'Week' | 'Month'>('Week');

  return (
    <DashShell>
      <DashHero
        eyebrow="Executive Overview"
        title="Command Center"
        subtitle="Customers, orders & cash pulse in one glance"
        accent="navy"
      >
        <div className="grid grid-cols-2 gap-2">
          {DASHBOARD_METRIC_CARDS.slice(0, 4).map((c) => (
            <div key={c.id} className="rounded-xl bg-white/10 border border-white/10 p-2.5">
              <p className="text-[9px] font-bold uppercase text-white/50 truncate">{c.label}</p>
              <p className="text-lg font-black tabular-nums mt-0.5">{c.value}</p>
            </div>
          ))}
        </div>
      </DashHero>

      <DashSection
        title="Cash Flow"
        action={
          <button
            type="button"
            onClick={() => setCashMasked((v) => !v)}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 cursor-pointer"
          >
            {cashMasked ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {cashMasked ? 'Reveal' : 'Hide'}
          </button>
        }
      >
        <div className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">{CASH_FLOW_DATA.label}</p>
              <p className="text-xl font-black text-[#0f2b3c] tabular-nums mt-1">
                {cashMasked ? CASH_FLOW_DATA.maskedValue : CASH_FLOW_DATA.actualValue}
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Coins className="w-5 h-5 text-emerald-600" />
            </div>
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

      <DashSection title="Forecast Without Tracking">
        <div className="space-y-2">
          {FORECAST_WITHOUT_TRACKING_ROWS.slice(0, 4).map((r) => (
            <div key={r.shipmentMonths} className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
              <div className="flex justify-between gap-2">
                <p className="text-[11px] font-extrabold text-[#0f2b3c]">{r.shipmentMonths}</p>
                <p className="text-[11px] font-black text-teal-700 tabular-nums">{r.projectedProfit}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <DashKpi label="Total" value={r.totalNoContainers} />
                <DashKpi label="Delivered" value={r.deliveredContainers} tone="teal" />
                <DashKpi label="Confirmed" value={r.confirmedUndelivered} tone="amber" />
              </div>
            </div>
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
  const totalTasks = EXPORT_TASKS.length;
  const followTotal = EXPORT_FOLLOW_UPS.reduce((s, f) => s + f.value, 0);

  const iconFor = (type: string) => {
    const map: Record<string, React.ReactNode> = {
      enquiry: <FileSearch className="w-4 h-4 text-sky-600" />,
      freight: <Send className="w-4 h-4 text-amber-600" />,
      booking: <FileCheck2 className="w-4 h-4 text-sky-600" />,
      loading: <Package className="w-4 h-4 text-amber-600" />,
      shipment: <Ship className="w-4 h-4 text-indigo-600" />,
      invoice: <Receipt className="w-4 h-4 text-emerald-600" />,
      switch_bl: <FileSignature className="w-4 h-4 text-violet-600" />,
      purchase_invoice: <ShoppingCart className="w-4 h-4 text-rose-600" />,
      eta: <BellRing className="w-4 h-4 text-orange-600" />,
      uncouriered: <Truck className="w-4 h-4 text-teal-600" />,
    };
    return map[type] ?? <Package className="w-4 h-4 text-slate-600" />;
  };

  const bgFor = (type: string) => {
    const map: Record<string, string> = {
      enquiry: 'bg-sky-50',
      freight: 'bg-amber-50',
      booking: 'bg-sky-50',
      loading: 'bg-amber-50',
      shipment: 'bg-indigo-50',
      invoice: 'bg-emerald-50',
      switch_bl: 'bg-violet-50',
      purchase_invoice: 'bg-rose-50',
      eta: 'bg-orange-50',
      uncouriered: 'bg-teal-50',
    };
    return map[type] ?? 'bg-slate-50';
  };

  return (
    <DashShell>
      <DashHero
        eyebrow="Export Operations"
        title="Shipping Pulse"
        subtitle="Enquiries, bookings & containers on the move"
        accent="sky"
      >
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-white/10 border border-white/10 p-2.5">
            <p className="text-[9px] font-bold uppercase text-white/50">Follow-ups</p>
            <p className="text-lg font-black tabular-nums">{followTotal}</p>
          </div>
          <div className="rounded-xl bg-white/10 border border-white/10 p-2.5">
            <p className="text-[9px] font-bold uppercase text-white/50">Task lanes</p>
            <p className="text-lg font-black tabular-nums">{totalTasks}</p>
          </div>
        </div>
      </DashHero>

      <DashSection title="Priority Follow-ups">
        <div className="space-y-2">
          {EXPORT_FOLLOW_UPS.map((f) => (
            <DashTaskTile
              key={f.id}
              title={f.title}
              subtitle={f.subtitle}
              value={f.value}
              icon={iconFor(f.icon)}
              iconBg={bgFor(f.icon)}
            />
          ))}
        </div>
      </DashSection>

      <DashSection title="Export Task Board">
        <div className="grid grid-cols-1 gap-2">
          {EXPORT_TASKS.map((t) => (
            <DashTaskTile
              key={t.id}
              title={t.title}
              subtitle={t.subtitle}
              icon={iconFor(t.icon)}
              iconBg={bgFor(t.icon)}
            />
          ))}
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
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'pi-809': true });
  const [croFilter, setCroFilter] = useState<'All' | 'Applied' | 'Received' | 'Not Applied'>('All');

  const taskTotal = PURCHASE_TASKS.reduce((s, t) => s + t.value, 0);
  const delayed = useMemo(
    () => DELAYED_ORDERS.filter((o) => croFilter === 'All' || o.croType === croFilter),
    [croFilter]
  );

  const croBadge = (type: string) => {
    const map: Record<string, string> = {
      Applied: 'bg-amber-50 text-amber-700 border-amber-200',
      Received: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Not Applied': 'bg-rose-50 text-rose-700 border-rose-200',
    };
    return (
      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border ${map[type] ?? 'bg-slate-100'}`}>
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

  const perf = monthTab === 'current' ? CURRENT_MONTH_PERFORMANCE : NEXT_MONTH_SUMMARY;

  return (
    <DashShell>
      <DashHero
        eyebrow="Purchase Command"
        title="Procurement Hub"
        subtitle="Tickets, artwork & delayed orders at a glance"
        accent="amber"
      >
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-white/10 border border-white/10 p-2.5">
            <p className="text-[9px] font-bold uppercase text-white/50">Open tasks</p>
            <p className="text-lg font-black tabular-nums">{taskTotal}</p>
          </div>
          <div className="rounded-xl bg-white/10 border border-white/10 p-2.5">
            <p className="text-[9px] font-bold uppercase text-white/50">Delayed</p>
            <p className="text-lg font-black tabular-nums">{DELAYED_ORDERS.length}</p>
          </div>
        </div>
      </DashHero>

      <DashSection title="Task Queue">
        <div className="space-y-2">
          {PURCHASE_TASKS.map((t) => (
            <DashTaskTile
              key={t.id}
              title={t.label}
              subtitle={t.subtitle}
              value={t.value}
              icon={taskIcon(t.icon)}
              iconBg={
                t.icon === 'ticket'
                  ? 'bg-emerald-50'
                  : t.icon === 'artwork'
                  ? 'bg-rose-50'
                  : t.icon === 'requisition'
                  ? 'bg-violet-50'
                  : t.icon === 'order'
                  ? 'bg-sky-50'
                  : 'bg-amber-50'
              }
            />
          ))}
        </div>
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
        <div className="grid grid-cols-2 gap-2">
          <DashKpi label={perf.expectedReadiness.label} value={perf.expectedReadiness.value} hint={perf.expectedReadiness.subtitle} tone="teal" />
          <DashKpi
            label={perf.croStatus.label}
            value={perf.croStatus.applied + perf.croStatus.received + perf.croStatus.notApplied}
            hint={`A ${perf.croStatus.applied} · R ${perf.croStatus.received} · N ${perf.croStatus.notApplied}`}
            tone="amber"
          />
          {monthTab === 'current' ? (
            <DashKpi
              label={CURRENT_MONTH_PERFORMANCE.pendingReadiness.label}
              value={CURRENT_MONTH_PERFORMANCE.pendingReadiness.value}
              hint={CURRENT_MONTH_PERFORMANCE.pendingReadiness.subtitle}
            />
          ) : (
            <DashKpi label="Month Total" value={NEXT_MONTH_SUMMARY.total} hint="Next month pipeline" tone="sky" />
          )}
          <DashKpi label={perf.pendingSurvey.label} value={perf.pendingSurvey.value} hint={perf.pendingSurvey.subtitle} tone="sky" />
        </div>
      </DashSection>

      <DashSection
        title="Delayed Orders"
        action={
          <div className="flex gap-1 overflow-x-auto max-w-[180px]">
            {(['All', 'Applied', 'Received', 'Not Applied'] as const).map((c) => (
              <DashPill key={c} active={croFilter === c} onClick={() => setCroFilter(c)}>
                {c === 'Not Applied' ? 'N/A' : c}
              </DashPill>
            ))}
          </div>
        }
      >
        <div className="space-y-2">
          {delayed.map((o) => (
            <DashListCard
              key={o.id}
              title={o.proformaCode}
              subtitle={o.customerName}
              badge={croBadge(o.croType)}
              open={!!expanded[o.id]}
              onClick={() => setExpanded((e) => ({ ...e, [o.id]: !e[o.id] }))}
              meta={
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-[10px] text-slate-500">
                    <span className="font-bold text-slate-400 uppercase text-[8px] block">Month</span>
                    {o.expectedDeliveryMonth}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    <span className="font-bold text-slate-400 uppercase text-[8px] block">Port</span>
                    {o.portOfDischarge}
                  </p>
                </div>
              }
            >
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                <span>Marketing · {o.marketingPersonal}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded[o.id] ? 'rotate-180' : ''}`} />
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-2.5 space-y-1.5">
                <p className="text-[9px] font-bold uppercase text-teal-700">Products</p>
                {o.expandedDetails.products.map((p, i) => (
                  <p key={i} className="text-[10px] font-semibold text-slate-700 leading-snug">
                    {p}
                  </p>
                ))}
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-2.5 space-y-1">
                <p className="text-[9px] font-bold uppercase text-teal-700">Requisitions</p>
                {o.expandedDetails.requisitionsAndSuppliers.map((r, i) => (
                  <p key={i} className="text-[10px] text-slate-600">
                    <span className="font-bold text-[#0f2b3c]">{r.requisition}</span> · {r.supplier}
                  </p>
                ))}
              </div>
            </DashListCard>
          ))}
        </div>
      </DashSection>
    </DashShell>
  );
};

/* ------------------------------------------------------------------ */
/* Marketing                                                            */
/* ------------------------------------------------------------------ */

export const MarketingDashboardJourney: React.FC = () => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ 'cu-045': true });

  const followIcon = (icon: string) => {
    const map: Record<string, React.ReactNode> = {
      orders: <TrendingUp className="w-4 h-4 text-sky-600" />,
      payments: <CreditCard className="w-4 h-4 text-emerald-600" />,
      shipping: <Ship className="w-4 h-4 text-indigo-600" />,
      quotations: <FileText className="w-4 h-4 text-amber-600" />,
    };
    return map[icon] ?? <Users className="w-4 h-4" />;
  };

  const taskIcon = (icon: string) => {
    const map: Record<string, React.ReactNode> = {
      ticket: <MessageSquare className="w-4 h-4 text-emerald-600" />,
      freight: <Send className="w-4 h-4 text-amber-600" />,
      artwork: <Palette className="w-4 h-4 text-rose-600" />,
      container: <Layers className="w-4 h-4 text-violet-600" />,
    };
    return map[icon] ?? <FileText className="w-4 h-4" />;
  };

  return (
    <DashShell>
      <DashHero
        eyebrow="Marketing Desk"
        title="Growth Radar"
        subtitle="Follow-ups, performance & recent deliveries"
        accent="violet"
      >
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-white/10 border border-white/10 p-2.5">
            <p className="text-[9px] font-bold uppercase text-white/50">Follow-ups</p>
            <p className="text-lg font-black tabular-nums">{MARKETING_FOLLOW_UPS.length}</p>
          </div>
          <div className="rounded-xl bg-white/10 border border-white/10 p-2.5">
            <p className="text-[9px] font-bold uppercase text-white/50">Task items</p>
            <p className="text-lg font-black tabular-nums">{MARKETING_TASKS.reduce((s, t) => s + t.value, 0)}</p>
          </div>
        </div>
      </DashHero>

      <DashSection title="Follow-up Pulse">
        <div className="space-y-2">
          {MARKETING_FOLLOW_UPS.map((f) => (
            <DashTaskTile
              key={f.id}
              title={f.label}
              subtitle={f.subtitle}
              value={f.value}
              icon={followIcon(f.icon)}
              iconBg="bg-violet-50"
            />
          ))}
        </div>
      </DashSection>

      <DashSection title="Marketing Tasks">
        <div className="space-y-2">
          {MARKETING_TASKS.map((t) => (
            <DashTaskTile
              key={t.id}
              title={t.label}
              subtitle={t.subtitle}
              value={t.value}
              icon={taskIcon(t.icon)}
              iconBg="bg-slate-50"
            />
          ))}
        </div>
      </DashSection>

      <DashSection title="Performance Snapshot">
        <div className="space-y-2">
          {PERFORMANCE_SUMMARY.slice(0, 4).map((p) => (
            <div key={p.criteria} className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-extrabold text-[#0f2b3c]">{p.criteria}</p>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
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

      <DashSection title="Recent Deliveries">
        <div className="space-y-2">
          {RECENT_DELIVERED_ORDERS.slice(0, 3).map((o) => (
            <DashListCard
              key={o.id}
              title={o.customerName}
              subtitle={`Gate out ${o.gateOutDate}`}
              badge={
                <span className="text-[10px] font-black text-teal-700 tabular-nums">{o.totalInvoiceAmount}</span>
              }
              open={!!expanded[o.id]}
              onClick={() => setExpanded((e) => ({ ...e, [o.id]: !e[o.id] }))}
            >
              {o.proformas.slice(0, 2).map((pf) => (
                <div key={pf.proformaCode} className="bg-white rounded-xl border border-slate-200 p-2.5">
                  <p className="text-[11px] font-bold text-[#0f2b3c]">{pf.proformaCode}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {pf.marketingPerson} · {pf.portOfDischarge}
                  </p>
                </div>
              ))}
            </DashListCard>
          ))}
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
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const taskIcon = (icon: string) => {
    const map: Record<string, React.ReactNode> = {
      payment_confirmations: <CreditCard className="w-4 h-4 text-sky-600" />,
      awaiting_confirmations: <Clock className="w-4 h-4 text-amber-600" />,
      receipt_vouchers: <Receipt className="w-4 h-4 text-emerald-600" />,
      purchase_approval: <FileCheck className="w-4 h-4 text-violet-600" />,
      sale_approval: <CheckCircle2 className="w-4 h-4 text-teal-600" />,
      open_ticket: <MessageSquare className="w-4 h-4 text-rose-600" />,
      awaiting_documents: <FileText className="w-4 h-4 text-indigo-600" />,
    };
    return map[icon] ?? <Landmark className="w-4 h-4" />;
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

  return (
    <DashShell>
      <DashHero
        eyebrow="Finance Overview"
        title="Money Desk"
        subtitle="Balances, approvals & pending collections"
        accent="teal"
      >
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-white/10 border border-white/10 p-2.5">
            <p className="text-[9px] font-bold uppercase text-white/50">Open tasks</p>
            <p className="text-lg font-black tabular-nums">{taskSum}</p>
          </div>
          <div className="rounded-xl bg-white/10 border border-white/10 p-2.5">
            <p className="text-[9px] font-bold uppercase text-white/50">Pending pays</p>
            <p className="text-lg font-black tabular-nums">{PENDING_PAYMENTS_DATA.length}</p>
          </div>
        </div>
      </DashHero>

      <DashSection title="Finance Tasks">
        <div className="space-y-2">
          {FINANCE_TASKS.map((t) => (
            <DashTaskTile
              key={t.id}
              title={t.label}
              value={t.value}
              icon={taskIcon(t.icon)}
              iconBg="bg-teal-50"
            />
          ))}
        </div>
      </DashSection>

      <DashSection
        title="Balance Sheet Pulse"
        action={
          <button
            type="button"
            onClick={() => setMasked((v) => !v)}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 cursor-pointer"
          >
            {masked ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {masked ? 'Reveal' : 'Hide'}
          </button>
        }
      >
        <div className="grid grid-cols-2 gap-2">
          {FINANCE_BALANCE_ITEMS.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">{balanceIcon(b.icon)}</div>
                <p className="text-[10px] font-bold text-slate-500 leading-tight">{b.label}</p>
              </div>
              <p className="text-sm font-black text-[#0f2b3c] tabular-nums">
                {masked ? b.maskedValue : b.actualValue}
              </p>
            </div>
          ))}
        </div>
      </DashSection>

      <DashSection title="Pending Payments">
        <div className="space-y-2">
          {PENDING_PAYMENTS_DATA.slice(0, 4).map((p) => (
            <DashListCard
              key={p.id}
              title={p.customerName}
              subtitle={p.marketingPersonal}
              badge={
                <span className={`text-[10px] font-black tabular-nums ${p.isNegative ? 'text-rose-600' : 'text-teal-700'}`}>
                  {p.totalRemainingAmount}
                </span>
              }
              open={!!expanded[p.id]}
              onClick={() => setExpanded((e) => ({ ...e, [p.id]: !e[p.id] }))}
              meta={
                <div className="grid grid-cols-2 gap-2">
                  <p className="text-[10px] text-slate-500">
                    <span className="font-bold text-slate-400 uppercase text-[8px] block">Invoice</span>
                    {p.totalInvoiceAmount}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    <span className="font-bold text-slate-400 uppercase text-[8px] block">Received</span>
                    {p.totalReceivedAmount}
                  </p>
                </div>
              }
            >
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <p><span className="text-slate-400 font-bold uppercase text-[8px] block">Port</span>{p.portOfDischarge}</p>
                <p><span className="text-slate-400 font-bold uppercase text-[8px] block">Gate Out</span>{p.gateOutDate}</p>
                <p><span className="text-slate-400 font-bold uppercase text-[8px] block">Sale Return</span>{p.totalSaleReturnAmount}</p>
                <p><span className="text-slate-400 font-bold uppercase text-[8px] block">Advance</span>{p.remainingAdvance}</p>
              </div>
            </DashListCard>
          ))}
        </div>
      </DashSection>
    </DashShell>
  );
};

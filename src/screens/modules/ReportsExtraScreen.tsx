/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Extra reports — mobile cards, image field parity, filter drawer
 */

import React, { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  Columns3,
  Filter,
  FileSpreadsheet,
  Package,
  Printer,
  Search,
  X,
} from 'lucide-react';
import {
  CASH_FLOW_LEFT,
  CASH_FLOW_RIGHT,
  CUSTOMER_AGING,
  INVENTORY,
  OVERALL_PNL,
  PARTY_WISE,
  PAYABLE_ROWS,
  RECEIVABLE_ROWS,
  SALES_SUMMARY,
  SUPPLIER_AGING,
  TRIAL_BALANCE,
  type TrialNode,
} from '../../data/reportsExtraData';

export type ExtraReportId =
  | 'supplier_aging'
  | 'customer_aging'
  | 'payable'
  | 'receivable'
  | 'overall_pnl'
  | 'cashflow'
  | 'trial'
  | 'inventory'
  | 'party'
  | 'sales_summary';

const TITLES: Record<ExtraReportId, string> = {
  supplier_aging: 'Supplier Aging Report',
  customer_aging: 'Customer Aging Report',
  payable: 'Payable Report',
  receivable: 'Receivable Report',
  overall_pnl: 'Overall P&L',
  cashflow: 'Cash Flow Report',
  trial: 'Trial Balance Report',
  inventory: 'Real Time Inventory',
  party: 'Party Wise Report',
  sales_summary: 'Sales Summary Report',
};

const Money: React.FC<{ value: string; neg?: boolean }> = ({ value, neg }) => (
  <span className={neg || value.includes('(') || value.includes('-') ? 'text-rose-600 font-bold' : 'text-slate-800 font-semibold'}>
    {value}
  </span>
);

const Field: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="min-w-0">
    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
    <p className="text-[11px] font-semibold text-slate-800 break-words">{value}</p>
  </div>
);

const SelectField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}> = ({ label, value, onChange, options }) => (
  <label className="block space-y-1">
    <span className="text-[11px] font-bold text-slate-600">{label}</span>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold outline-none focus:border-teal-600 focus:bg-white"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  </label>
);

const AmtRow: React.FC<{ label: string; amount: string; highlight?: boolean; red?: boolean }> = ({
  label,
  amount,
  highlight,
  red,
}) => (
  <div className={`flex items-center justify-between gap-3 py-2.5 px-3 rounded-xl ${highlight ? 'bg-rose-50/80' : 'bg-white'}`}>
    <p className={`text-[11px] font-bold ${highlight || red ? 'text-rose-700' : 'text-slate-700'}`}>{label}</p>
    <p className={`text-[11px] font-extrabold tabular-nums shrink-0 ${highlight || red ? 'text-rose-700' : 'text-slate-900'}`}>
      {amount}
    </p>
  </div>
);

const SectionHeading: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="flex items-end justify-between gap-2 px-0.5">
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{subtitle ?? 'Insights'}</p>
      <h3 className="text-sm font-extrabold text-[#0f2b3c]">{title}</h3>
    </div>
  </div>
);

const KpiCard: React.FC<{ label: string; value: string; tone?: 'default' | 'rose' | 'teal' }> = ({
  label,
  value,
  tone = 'default',
}) => (
  <div
    className={`rounded-xl border p-2.5 ${
      tone === 'rose'
        ? 'bg-rose-50 border-rose-200'
        : tone === 'teal'
          ? 'bg-teal-50 border-teal-200'
          : 'bg-white border-slate-200'
    }`}
  >
    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
    <p
      className={`text-[12px] font-black mt-1 ${
        tone === 'rose' ? 'text-rose-700' : tone === 'teal' ? 'text-teal-700' : 'text-[#0f2b3c]'
      }`}
    >
      {value}
    </p>
  </div>
);

interface Props {
  reportId: ExtraReportId;
  onBack: () => void;
  onShowSnackBar?: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const ReportsExtraScreen: React.FC<Props> = ({ reportId, onBack, onShowSnackBar }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'tb-assets': true,
    'tb-income': true,
  });
  const [balanceMode, setBalanceMode] = useState<'Both' | 'With Balance' | 'Without Balance'>('With Balance');
  const [approveMode, setApproveMode] = useState<'Both' | 'With Approved Data' | 'All Approved Data'>('Both');
  const [filters, setFilters] = useState({
    fromDate: '2026-01-01',
    toDate: '2026-09-09',
    company: 'Select Company',
    vendor: 'Select Vendor',
    customer: 'Select Customer',
    currency: 'United States Dollar (USD)',
    account: 'All Accounts',
    reference: 'All References',
    duration: 'Previous Month',
    placeDelivery: 'Select Place of Delivery',
    product: 'Select Product',
    date: '2026-09-09',
  });

  const toggle = (id: string) => setExpanded((e) => ({ ...e, [id]: !e[id] }));
  const snack = (m: string) => onShowSnackBar?.(m, 'info');
  const q = search.toLowerCase();

  const inventoryData = useMemo(
    () =>
      INVENTORY.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.variation.toLowerCase().includes(q) ||
          r.invoiceCode.toLowerCase().includes(q)
      ),
    [q]
  );

  const payableData = useMemo(
    () => PAYABLE_ROWS.filter((r) => r.vendor.toLowerCase().includes(q)),
    [q]
  );

  const receivableData = useMemo(
    () => RECEIVABLE_ROWS.filter((r) => r.customer.toLowerCase().includes(q)),
    [q]
  );

  const salesData = useMemo(
    () =>
      SALES_SUMMARY.filter(
        (g) =>
          g.country.toLowerCase().includes(q) ||
          g.customer.toLowerCase().includes(q) ||
          g.rows.some((r) => r.product.toLowerCase().includes(q))
      ),
    [q]
  );

  const filterFields = () => {
    switch (reportId) {
      case 'payable':
      case 'receivable':
        return (
          <>
            <label className="block space-y-1">
              <span className="text-[11px] font-bold text-slate-600">From Date</span>
              <input type="date" value={filters.fromDate} onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold outline-none focus:border-teal-600" />
            </label>
            <label className="block space-y-1">
              <span className="text-[11px] font-bold text-slate-600">To Date</span>
              <input type="date" value={filters.toDate} onChange={(e) => setFilters({ ...filters, toDate: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold outline-none focus:border-teal-600" />
            </label>
            <SelectField label="Company" value={filters.company} onChange={(v) => setFilters({ ...filters, company: v })} options={['Select Company', 'Soneri International', 'Soneri Foods']} />
            {reportId === 'payable' ? (
              <SelectField label="Vendor" value={filters.vendor} onChange={(v) => setFilters({ ...filters, vendor: v })} options={['Select Vendor', 'AL-AZIZ INDUSTRIES', 'INDUS DYES']} />
            ) : (
              <SelectField label="Customer" value={filters.customer} onChange={(v) => setFilters({ ...filters, customer: v })} options={['Select Customer', 'HIMPEX SARL', 'ADE KOMPANI']} />
            )}
            <SelectField label="Currency" value={filters.currency} onChange={(v) => setFilters({ ...filters, currency: v })} options={['United States Dollar (USD)', 'Pakistani Rupee (PKR)', 'Euro (EUR)']} />
            <div className="space-y-2 pt-1">
              <p className="text-[11px] font-bold text-slate-600">Balance View</p>
              {(['Both', 'Without Balance', 'With Balance'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setBalanceMode(m)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold border cursor-pointer ${balanceMode === m ? 'bg-[#0f2b3c] text-white border-[#0f2b3c]' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </>
        );
      case 'overall_pnl':
      case 'trial':
        return (
          <>
            <label className="block space-y-1">
              <span className="text-[11px] font-bold text-slate-600">From Date *</span>
              <input type="date" value={filters.fromDate} onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold outline-none focus:border-teal-600" />
            </label>
            <label className="block space-y-1">
              <span className="text-[11px] font-bold text-slate-600">To Date *</span>
              <input type="date" value={filters.toDate} onChange={(e) => setFilters({ ...filters, toDate: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold outline-none focus:border-teal-600" />
            </label>
            <SelectField label="Company" value={filters.company} onChange={(v) => setFilters({ ...filters, company: v })} options={['Select Company', 'Soneri International', 'Soneri Foods']} />
            {reportId === 'trial' && (
              <SelectField label="Account" value={filters.account} onChange={(v) => setFilters({ ...filters, account: v })} options={['All Accounts', 'Assets', 'Liabilities', 'Equity', 'Income', 'Expenses']} />
            )}
            <SelectField label="Currency *" value={filters.currency} onChange={(v) => setFilters({ ...filters, currency: v })} options={['United States Dollar (USD)', 'Pakistani Rupee (PKR)']} />
          </>
        );
      case 'cashflow':
        return (
          <>
            <label className="block space-y-1">
              <span className="text-[11px] font-bold text-slate-600">Date</span>
              <input type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold outline-none focus:border-teal-600" />
            </label>
            <SelectField label="Company" value={filters.company} onChange={(v) => setFilters({ ...filters, company: v })} options={['Select Company', 'Soneri International']} />
            <SelectField label="Currency" value={filters.currency} onChange={(v) => setFilters({ ...filters, currency: v })} options={['United States Dollar (USD)', 'Pakistani Rupee (PKR)']} />
          </>
        );
      case 'inventory':
        return (
          <>
            <SelectField label="Reference" value={filters.reference} onChange={(v) => setFilters({ ...filters, reference: v })} options={['All References', 'PO', 'SO', 'RI']} />
            <SelectField label="Duration" value={filters.duration} onChange={(v) => setFilters({ ...filters, duration: v })} options={['Previous Month', 'Current Month', 'Current Year']} />
          </>
        );
      case 'sales_summary':
        return (
          <>
            <SelectField label="Customer" value={filters.customer} onChange={(v) => setFilters({ ...filters, customer: v })} options={['Select Customer', 'HIMPEX SARL', 'ARIDIM', 'ZARA TRADING']} />
            <SelectField label="Place Of Delivery" value={filters.placeDelivery} onChange={(v) => setFilters({ ...filters, placeDelivery: v })} options={['Select Place of Delivery', "Côte d'Ivoire", 'Senegal', 'Somalia']} />
            <SelectField label="Company" value={filters.company} onChange={(v) => setFilters({ ...filters, company: v })} options={['Select Company', 'Soneri Foods']} />
            <SelectField label="Product" value={filters.product} onChange={(v) => setFilters({ ...filters, product: v })} options={['Select Product', 'Candy', 'Lollipop']} />
            <SelectField label="Duration" value={filters.duration} onChange={(v) => setFilters({ ...filters, duration: v })} options={['Previous Month', 'Current Month', 'Current Year']} />
          </>
        );
      default:
        return (
          <>
            <SelectField label="Company" value={filters.company} onChange={(v) => setFilters({ ...filters, company: v })} options={['Select Company', 'Soneri International']} />
            <SelectField label="Customer" value={filters.customer} onChange={(v) => setFilters({ ...filters, customer: v })} options={['Select Customer', 'All']} />
            <SelectField label="Duration" value={filters.duration} onChange={(v) => setFilters({ ...filters, duration: v })} options={['Previous Month', 'Current Month', 'Current Year']} />
          </>
        );
    }
  };

  const renderTree = (
    nodes: Array<{ id: string; label: string; amount: string; level?: number; neg?: boolean; children?: any[] }>,
    depth = 0
  ) =>
    nodes.map((n) => {
      const hasKids = !!n.children?.length;
      const open = expanded[n.id];
      return (
        <div key={n.id} className="space-y-1">
          <button
            type="button"
            onClick={() => (hasKids ? toggle(n.id) : undefined)}
            className={`w-full flex items-center justify-between gap-2 py-2.5 px-3 rounded-xl border border-slate-100 ${depth === 0 ? 'bg-[#0f2b3c]/[0.04]' : 'bg-white'} ${hasKids ? 'cursor-pointer' : 'cursor-default'}`}
            style={{ paddingLeft: 12 + depth * 10 }}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              {hasKids && <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />}
              <p className={`text-[11px] font-bold truncate ${depth === 0 ? 'text-[#0f2b3c]' : 'text-slate-700'}`}>{n.label}</p>
            </div>
            <Money value={n.amount} neg={n.neg} />
          </button>
          {hasKids && open && <div className="space-y-1">{renderTree(n.children!, depth + 1)}</div>}
        </div>
      );
    });

  const renderTrialTree = (nodes: TrialNode[], depth = 0): React.ReactNode =>
    nodes.map((n) => {
      const hasKids = !!n.children?.length;
      const open = !!expanded[n.id];
      const isRoot = depth === 0;
      return (
        <div key={n.id} className={isRoot ? 'bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden' : ''}>
          <button
            type="button"
            onClick={() => (hasKids ? toggle(n.id) : undefined)}
            className={`w-full text-left cursor-pointer transition-colors ${
              isRoot
                ? 'px-3.5 py-3 bg-gradient-to-r from-[#0f2b3c] to-[#1a4458] text-white'
                : depth === 1
                  ? 'px-3 py-2.5 bg-slate-50 border-t border-slate-100'
                  : 'px-3 py-2 border-t border-slate-50 bg-white hover:bg-slate-50/80'
            }`}
            style={!isRoot ? { paddingLeft: 12 + depth * 12 } : undefined}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                {hasKids ? (
                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 rounded-md shrink-0 ${
                      isRoot ? 'bg-white/15' : 'bg-slate-200/80'
                    }`}
                  >
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''} ${isRoot ? 'text-white' : 'text-slate-600'}`}
                    />
                  </span>
                ) : (
                  <span className="w-5 h-5 inline-flex items-center justify-center shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  </span>
                )}
                <p
                  className={`text-[11px] leading-snug break-words ${
                    isRoot ? 'font-extrabold text-white' : depth === 1 ? 'font-extrabold text-[#0f2b3c]' : 'font-bold text-slate-700'
                  }`}
                >
                  {n.title}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-[9px] font-bold uppercase tracking-wider ${isRoot ? 'text-white/50' : 'text-slate-400'}`}>Closing</p>
                <p className={`text-[11px] font-black tabular-nums ${isRoot ? 'text-teal-200' : n.neg ? 'text-rose-600' : 'text-slate-900'}`}>
                  {n.closing}
                </p>
              </div>
            </div>
            <div className={`grid grid-cols-3 gap-1.5 mt-2.5 ${isRoot ? '' : ''}`}>
              {[
                ['Opening', n.opening],
                ['Debit', n.debit],
                ['Credit', n.credit],
              ].map(([label, val]) => (
                <div
                  key={label}
                  className={`rounded-lg px-2 py-1.5 ${isRoot ? 'bg-white/10' : 'bg-slate-50 border border-slate-100'}`}
                >
                  <p className={`text-[8px] font-bold uppercase tracking-wider ${isRoot ? 'text-white/50' : 'text-slate-400'}`}>{label}</p>
                  <p className={`text-[10px] font-bold tabular-nums mt-0.5 ${isRoot ? 'text-white' : n.neg && label === 'Opening' ? 'text-rose-600' : 'text-slate-800'}`}>
                    {val}
                  </p>
                </div>
              ))}
            </div>
          </button>
          {hasKids && open && (
            <div className={isRoot ? 'bg-white' : ''}>
              {renderTrialTree(n.children!, depth + 1)}
            </div>
          )}
        </div>
      );
    });

  const inventoryTotal = inventoryData.reduce((s, r) => s + r.qty, 0);
  const salesTotal = salesData.reduce((s, g) => s + g.rows.reduce((a, r) => a + r.qty, 0), 0);

  return (
    <div className="min-h-full pb-24 bg-[#f3f6f8] text-slate-900">
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200 px-3 py-2.5 space-y-2.5">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onBack} className="p-2 rounded-xl bg-slate-100 cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-extrabold text-[#0f2b3c] truncate">{TITLES[reportId]}</h1>
            <p className="text-[10px] font-semibold text-slate-400">Mobile report view</p>
          </div>
          {reportId === 'party' && (
            <button type="button" onClick={() => setSummaryOpen(true)} className="px-2.5 py-1.5 rounded-xl text-[10px] font-bold bg-slate-100 text-slate-700 cursor-pointer">
              Summary
            </button>
          )}
          {reportId === 'cashflow' && (
            <button type="button" onClick={() => snack('Template saved')} className="px-2.5 py-1.5 rounded-xl text-[10px] font-bold bg-sky-600 text-white cursor-pointer">
              Save
            </button>
          )}
          <button type="button" onClick={() => setDrawerOpen(true)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-bold bg-[#0f2b3c] text-white cursor-pointer">
            <Filter className="w-3.5 h-3.5" />
            Filters
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => snack('Preparing print…')} className="p-2 rounded-xl border border-slate-200 bg-white cursor-pointer">
            <Printer className="w-4 h-4 text-slate-600" />
          </button>
          {(reportId === 'payable' || reportId === 'receivable' || reportId === 'sales_summary' || reportId === 'trial') && (
            <button type="button" onClick={() => snack('Export started')} className="p-2 rounded-xl border border-slate-200 bg-white cursor-pointer">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            </button>
          )}
          <button type="button" onClick={() => snack('Column picker')} className="p-2 rounded-xl border border-slate-200 bg-white cursor-pointer">
            <Columns3 className="w-4 h-4 text-slate-600" />
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none focus:bg-white focus:border-teal-600"
            />
          </div>
        </div>

        {(reportId === 'payable' || reportId === 'receivable') && (
          <div className="flex gap-1.5 overflow-x-auto pb-0.5">
            {(['Both', 'Without Balance', 'With Balance'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setBalanceMode(m)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold cursor-pointer ${balanceMode === m ? 'bg-[#0f2b3c] text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                {m}
              </button>
            ))}
          </div>
        )}

        {reportId === 'sales_summary' && (
          <div className="flex gap-1.5 overflow-x-auto pb-0.5">
            {(['Both', 'With Approved Data', 'All Approved Data'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setApproveMode(m)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold cursor-pointer ${approveMode === m ? 'bg-[#0f2b3c] text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                {m}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 space-y-3">
        {/* SUPPLIER AGING */}
        {reportId === 'supplier_aging' &&
          SUPPLIER_AGING.map((s) => (
            <div key={s.id} className="space-y-2.5">
              <SectionHeading title="Supplier Position" subtitle="Aging Overview" />
              <div className="grid grid-cols-2 gap-2">
                <KpiCard label="Total Invoice" value={s.totalInvoice} />
                <KpiCard label="Total Paid" value={s.totalPaid} tone="teal" />
                <KpiCard label="JV Adj." value={s.totalJv} />
                <KpiCard label="Remaining" value={s.totalRemaining} tone="rose" />
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <button type="button" onClick={() => toggle(s.id)} className="w-full text-left p-3.5 cursor-pointer">
                <div className="flex justify-between gap-2">
                  <p className="text-xs font-extrabold text-[#0f2b3c] leading-snug">{s.supplier}</p>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 ${expanded[s.id] ? 'rotate-180' : ''}`} />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <Field label="Total Invoice Amount" value={s.totalInvoice} />
                  <Field label="Total JV Adj. Amount" value={s.totalJv} />
                  <Field label="Total Paid Amount" value={s.totalPaid} />
                  <Field label="Total Remaining Amount" value={<span className="text-rose-600 font-bold">{s.totalRemaining}</span>} />
                </div>
              </button>
              {expanded[s.id] &&
                s.rows.map((row) => (
                  <div key={row.proforma} className="border-t border-slate-100 bg-slate-50/70 p-3 space-y-2">
                    <p className="text-[10px] font-bold uppercase text-teal-700">Proforma {row.proforma}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Customer" value={<span className="text-sky-700">{row.customer}</span>} />
                      <Field label="Company" value={row.company} />
                      <Field label="Marketing Person" value={row.marketing} />
                      <Field label="Place of Delivery" value={row.placeDelivery} />
                      <Field label="Port of Discharge" value={row.portDischarge} />
                      <Field label="Action" value={<span className="text-sky-700">edit · logs</span>} />
                    </div>
                    {row.invoices.map((inv) => {
                      const iid = `${s.id}-${inv.inquiry}`;
                      return (
                        <div key={inv.inquiry} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                          <button type="button" onClick={() => toggle(iid)} className="w-full text-left p-2.5 cursor-pointer">
                            <div className="flex justify-between">
                              <p className="text-[11px] font-bold text-[#0f2b3c]">Invoice {inv.purchaseInvoice}</p>
                              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 ${expanded[iid] ? 'rotate-180' : ''}`} />
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <Field label="Inquiry Code" value={<span className="text-sky-700">{inv.inquiry}</span>} />
                              <Field label="CI Number" value={inv.ciNumber} />
                              <Field label="CI Date" value={inv.ciDate} />
                              <Field label="No. of Days" value={inv.days} />
                              <Field label="Invoice Amount" value={inv.invoiceAmount} />
                              <Field label="JV Adj. Amount" value={inv.jvAdj} />
                              <Field label="Paid Amount" value={inv.paid} />
                              <Field label="Remaining Amount" value={<span className="text-rose-600">{inv.remaining}</span>} />
                              <Field label="Purchase Invoice Doc" value={<span className="text-sky-700">view</span>} />
                            </div>
                          </button>
                          {expanded[iid] &&
                            inv.shipments.map((sh) => (
                              <div key={sh.code} className="border-t border-slate-100 bg-rose-50/40 p-2.5 space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                  <Field label="Shipment Code" value={<span className="text-sky-700">{sh.code}</span>} />
                                  <Field label="Shipment Creation Date" value={sh.created} />
                                  <Field label="Freight Invoice Doc" value={<span className="text-sky-700">view</span>} />
                                  <Field label="BL Copy Document" value={<span className="text-sky-700">view</span>} />
                                  <Field label="Container Type" value={sh.containerType} />
                                  <Field label="Container No" value={sh.containerNo} />
                                  <Field label="Gate Out Date" value={sh.gateOut} />
                                  <Field label="ETA Date" value={sh.eta} />
                                  <Field label="BL Number" value={sh.blNumber} />
                                </div>
                              </div>
                            ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ))}

        {/* CUSTOMER AGING */}
        {reportId === 'customer_aging' &&
          CUSTOMER_AGING.map((c) => (
            <div key={c.id} className="space-y-2.5">
              <SectionHeading title="Customer Aging" subtitle="Receivable Maturity" />
              <div className="grid grid-cols-2 gap-2">
                <KpiCard label="Total Days" value={String(c.totalDays)} />
                <KpiCard label="Total Invoice" value={c.totalInvoice} />
                <KpiCard label="Sale Return" value={c.totalSaleReturn} />
                <KpiCard label="Remaining" value={c.totalRemaining} tone="rose" />
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <button type="button" onClick={() => toggle(c.id)} className="w-full text-left p-3.5 cursor-pointer">
                <div className="flex justify-between gap-2">
                  <p className="text-xs font-extrabold text-sky-700 leading-snug">{c.customer}</p>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 ${expanded[c.id] ? 'rotate-180' : ''}`} />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <Field label="Total No of Days" value={c.totalDays} />
                  <Field label="Total Invoice Amount" value={c.totalInvoice} />
                  <Field label="Total Sale Return Amount" value={c.totalSaleReturn} />
                  <Field label="Total JV Adj Amount" value={c.totalJvAdj} />
                  <Field label="Remaining Advance" value={c.remainingAdvance} />
                  <Field label="Total Remaining Amount" value={<span className="text-rose-600 font-bold">{c.totalRemaining}</span>} />
                </div>
              </button>
              {expanded[c.id] &&
                c.proformas.map((pf) => {
                  const pid = `${c.id}-${pf.code}`;
                  return (
                    <div key={pf.code} className="border-t border-slate-100 bg-slate-50/70 p-3 space-y-2">
                      <button type="button" onClick={() => toggle(pid)} className="w-full text-left cursor-pointer">
                        <div className="flex justify-between">
                          <p className="text-[11px] font-bold text-[#0f2b3c]">Proforma {pf.code}</p>
                          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 ${expanded[pid] ? 'rotate-180' : ''}`} />
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <Field label="Company" value={pf.company} />
                          <Field label="Marketing Person" value={pf.marketing} />
                          <Field label="Place of Delivery" value={pf.placeDelivery} />
                          <Field label="Port of Discharge" value={pf.portDischarge} />
                          <Field label="Advance" value={pf.advance} />
                          <Field label="Total Paid Amount" value={pf.totalPaid} />
                          <Field label="Total Remaining Amount" value={pf.totalRemaining} />
                        </div>
                      </button>
                      {expanded[pid] &&
                        pf.inquiries.map((inq) => {
                          const iid = `${pid}-${inq.inquiry}`;
                          return (
                            <div key={inq.inquiry} className="bg-white rounded-xl border border-slate-200 p-2.5 space-y-2">
                              <button type="button" onClick={() => toggle(iid)} className="w-full text-left cursor-pointer">
                                <div className="flex justify-between">
                                  <p className="text-[11px] font-bold">Inquiry {inq.inquiry}</p>
                                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 ${expanded[iid] ? 'rotate-180' : ''}`} />
                                </div>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  <Field label="Invoice Code" value={<span className="text-sky-700">{inq.invoice}</span>} />
                                  <Field label="No of Days" value={inq.days} />
                                  <Field label="Invoice Amount" value={inq.invoiceAmount} />
                                  <Field label="Sale Return" value={inq.saleReturn} />
                                  <Field label="JV Adj Amount" value={inq.jvAdj} />
                                  <Field label="Adj Advance" value={inq.adjAdvance} />
                                  <Field label="Sub Invoice Document" value={<span className="text-sky-700">View</span>} />
                                </div>
                              </button>
                              {expanded[iid] &&
                                inq.shipments.map((sh) => (
                                  <div key={sh.code} className="rounded-lg bg-rose-50/50 border border-rose-100 p-2.5">
                                    <div className="grid grid-cols-2 gap-2">
                                      <Field label="Shipment Code" value={<span className="text-sky-700">{sh.code}</span>} />
                                      <Field label="Shipment Creation Date" value={sh.created} />
                                      <Field label="Freight Invoice Document" value={<span className="text-sky-700">view</span>} />
                                      <Field label="BL Copy Document" value={<span className="text-sky-700">view</span>} />
                                      <Field label="Container Type" value={sh.containerType} />
                                      <Field label="Container No" value={sh.containerNo} />
                                      <Field label="Gate Out Date" value={sh.gateOut} />
                                      <Field label="ETA Date" value={sh.eta} />
                                      <Field label="BL Number" value={sh.blNumber} />
                                    </div>
                                  </div>
                                ))}
                            </div>
                          );
                        })}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

        {/* PAYABLE */}
        {reportId === 'payable' && (
          <>
            <SectionHeading title="Vendor Balances" subtitle="Payable Ledger" />
            {payableData.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <p className="text-xs font-extrabold text-[#0f2b3c] leading-snug">{r.vendor}</p>
                  <Money value={r.closing} neg={r.negative} />
                </div>
                <p className="text-[9px] font-bold uppercase text-slate-400 mb-2">Closing Balance</p>
                <div className="grid grid-cols-2 gap-2.5">
                  <Field label="Opening Balance" value={<Money value={r.opening} />} />
                  <Field label="Debit" value={r.debit} />
                  <Field label="Credit" value={r.credit} />
                  <Field label="Closing Balance" value={<Money value={r.closing} neg={r.negative} />} />
                </div>
              </div>
            ))}
            <div className="bg-[#0f2b3c] text-white rounded-2xl p-3.5 space-y-2 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">Totals</p>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
                <span>Opening USD (6,350.00)</span>
                <span>Debit USD 11,200.00</span>
                <span>Credit USD 5,100.00</span>
                <span className="text-rose-300">Closing USD (350.00)</span>
              </div>
              <div className="border-t border-white/15 pt-2 text-[11px] font-extrabold">Difference · USD 0.00</div>
            </div>
          </>
        )}

        {/* RECEIVABLE */}
        {reportId === 'receivable' && (
          <>
            <SectionHeading title="Customer Balances" subtitle="Receivable Ledger" />
            {receivableData.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <p className="text-xs font-extrabold text-[#0f2b3c] leading-snug">{r.customer}</p>
                  <Money value={r.closing} />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <Field label="Advance" value={<Money value={r.advance} />} />
                  <Field label="Opening Balance" value={<Money value={r.opening} />} />
                  <Field label="Debit" value={r.debit} />
                  <Field label="Credit" value={r.credit} />
                  <Field label="Closing Balance" value={<Money value={r.closing} />} />
                </div>
              </div>
            ))}
            <div className="bg-[#0f2b3c] text-white rounded-2xl p-3.5 space-y-2 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">Totals</p>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
                <span>Advance USD 1,900.00</span>
                <span>Opening USD 22,099.15</span>
                <span>Debit USD 10,700.00</span>
                <span>Credit USD 12,800.00</span>
                <span className="col-span-2 text-teal-300">Closing USD 19,999.15</span>
              </div>
              <div className="border-t border-white/15 pt-2 text-[11px] font-extrabold">Difference · USD 0.00</div>
            </div>
          </>
        )}

        {/* OVERALL P&L */}
        {reportId === 'overall_pnl' && (
          <div className="space-y-3">
            <SectionHeading title="Profit & Loss Statement" subtitle="Financial Snapshot" />
            <div className="grid grid-cols-2 gap-2">
              <KpiCard label="Gross Profit" value={OVERALL_PNL.grossProfit} tone="teal" />
              <KpiCard label="Net Profit" value={OVERALL_PNL.netProfit} tone="rose" />
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-3.5 py-2.5 bg-[#0f2b3c] text-white text-xs font-extrabold">Revenue</div>
              <div className="p-2 space-y-1">
                {OVERALL_PNL.revenue.map((r) => (
                  <AmtRow key={r.label} label={r.label} amount={r.amount} highlight={r.highlight} />
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-3.5 py-2.5 bg-[#0f2b3c] text-white text-xs font-extrabold">Cost of Goods Sold (COGS)</div>
              <div className="p-2 space-y-1">
                {OVERALL_PNL.cogs.map((r) => (
                  <AmtRow key={r.label} label={r.label} amount={r.amount} highlight={r.highlight} />
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 flex justify-between items-center">
              <p className="text-xs font-extrabold text-rose-700">GROSS PROFIT</p>
              <p className="text-sm font-black text-rose-700">{OVERALL_PNL.grossProfit}</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-3.5 py-2.5 bg-[#0f2b3c] text-white text-xs font-extrabold">Operating Expenditures</div>
              <div className="p-2 space-y-1">
                {OVERALL_PNL.expenditures.map((r) => (
                  <AmtRow key={r.label} label={r.label} amount={r.amount} highlight={r.highlight} />
                ))}
              </div>
            </div>
            <div className="rounded-2xl border-2 border-[#0f2b3c] bg-white p-3.5 flex justify-between items-center gap-3">
              <p className="text-xs font-extrabold text-sky-700">Net Profit / (Loss) of the Year</p>
              <p className="text-sm font-black text-rose-700 tabular-nums">{OVERALL_PNL.netProfit}</p>
            </div>
          </div>
        )}

        {/* CASH FLOW */}
        {reportId === 'cashflow' && (
          <>
            <SectionHeading title="Cash Movement Panels" subtitle="Operational Flow" />
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 space-y-2">
              <div className="flex items-center justify-between px-1">
                <p className="text-xs font-extrabold text-[#0f2b3c]">Details · Panel A</p>
                <p className="text-[11px] font-black text-emerald-700">USD 11,885,035.30</p>
              </div>
              {renderTree(CASH_FLOW_LEFT)}
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 space-y-2">
              <div className="flex items-center justify-between px-1">
                <p className="text-xs font-extrabold text-[#0f2b3c]">Details · Panel B</p>
                <p className="text-[11px] font-black text-rose-600">USD (1,748,013.92)</p>
              </div>
              {renderTree(CASH_FLOW_RIGHT)}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => snack('Template saved')} className="flex-1 py-3 rounded-xl bg-sky-600 text-white text-xs font-extrabold cursor-pointer">
                Save Template
              </button>
              <button type="button" onClick={() => snack('Filters reset')} className="flex-1 py-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-extrabold cursor-pointer">
                Reset
              </button>
            </div>
          </>
        )}

        {/* TRIAL BALANCE — expandable account tree */}
        {reportId === 'trial' && (
          <>
            <div className="flex items-center justify-between px-0.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Account hierarchy</p>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const all: Record<string, boolean> = {};
                    const walk = (nodes: TrialNode[]) => {
                      nodes.forEach((n) => {
                        if (n.children?.length) {
                          all[n.id] = true;
                          walk(n.children);
                        }
                      });
                    };
                    walk(TRIAL_BALANCE);
                    setExpanded((e) => ({ ...e, ...all }));
                  }}
                  className="px-2.5 py-1 rounded-lg text-[9px] font-bold bg-slate-100 text-slate-600 cursor-pointer"
                >
                  Expand all
                </button>
                <button
                  type="button"
                  onClick={() => setExpanded({})}
                  className="px-2.5 py-1 rounded-lg text-[9px] font-bold bg-slate-100 text-slate-600 cursor-pointer"
                >
                  Collapse
                </button>
              </div>
            </div>
            <div className="space-y-2.5">{renderTrialTree(TRIAL_BALANCE)}</div>
            <div className="bg-[#0f2b3c] text-white rounded-2xl p-3.5 space-y-2 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">Total</p>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-bold">
                <span>Opening 2,710,000.00</span>
                <span>Debit 384,200.00</span>
                <span>Credit 855,500.00</span>
                <span>Closing 2,238,700.00</span>
              </div>
              <div className="border-t border-white/15 pt-2 text-[11px] font-extrabold text-teal-300">Difference · 0.00</div>
            </div>
          </>
        )}

        {/* INVENTORY */}
        {reportId === 'inventory' && (
          <>
            <SectionHeading title="Live Stock Position" subtitle="Warehouse Snapshot" />
            {inventoryData.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-3.5 flex gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shrink-0">
                    <Package className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-extrabold text-[#0f2b3c] leading-snug">{r.name}</p>
                    <div className="flex items-center justify-between mt-2 gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800">{r.variation}</span>
                      <span className="text-sm font-black text-[#0f2b3c] tabular-nums">{r.qty.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <button type="button" onClick={() => toggle(r.id)} className="w-full border-t border-slate-100 px-3.5 py-2 flex items-center justify-between text-[10px] font-bold text-slate-500 cursor-pointer">
                  Invoice / Reference codes
                  <ChevronDown className={`w-3.5 h-3.5 ${expanded[r.id] ? 'rotate-180' : ''}`} />
                </button>
                {expanded[r.id] && (
                  <div className="px-3.5 pb-3.5">
                    <p className="text-[10px] font-semibold text-slate-600 leading-relaxed break-words bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                      {r.invoiceCode}
                    </p>
                  </div>
                )}
              </div>
            ))}
            <div className="sticky bottom-3 bg-[#0f2b3c] text-white rounded-2xl px-4 py-3 flex justify-between items-center shadow-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">Total Quantity</span>
              <span className="text-lg font-black tabular-nums">{inventoryTotal.toLocaleString()}</span>
            </div>
          </>
        )}

        {/* PARTY WISE */}
        {reportId === 'party' &&
          PARTY_WISE.map((p) => (
            <div key={p.id} className="space-y-2.5">
              <SectionHeading title="Party Drill Down" subtitle="Shipment Profitability" />
              <div className="grid grid-cols-2 gap-2">
                <KpiCard label="Delivery Month" value={p.details.deliveryMonth} />
                <KpiCard label="Delivered" value={String(p.details.deliveredContainers)} tone="teal" />
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <button type="button" onClick={() => toggle(p.id)} className="w-full text-left p-3.5 cursor-pointer">
                <div className="flex justify-between gap-2">
                  <p className="text-xs font-extrabold text-[#0f2b3c]">{p.customer}</p>
                  <ChevronDown className={`w-4 h-4 text-slate-400 ${expanded[p.id] ? 'rotate-180' : ''}`} />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <Field label="Company" value={p.details.company} />
                  <Field label="Port of Loading" value={p.details.portLoading} />
                  <Field label="Port of Discharge" value={p.details.portDischarge} />
                  <Field label="Delivery Month" value={p.details.deliveryMonth} />
                  <Field label="Voyager" value={p.details.voyager} />
                  <Field label="Container" value={p.details.container} />
                  <Field label="Delivered Containers" value={p.details.deliveredContainers} />
                </div>
              </button>
              {expanded[p.id] && (
                <div className="border-t border-slate-100 bg-slate-50/70 p-3 space-y-3">
                  <div className="bg-white rounded-xl border border-slate-200 p-2.5">
                    <p className="text-[10px] font-bold uppercase text-teal-700 mb-2">Transaction</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Inquiry Code" value={<span className="text-sky-700">{p.tx.inquiry}</span>} />
                      <Field label="Pay Days" value={p.tx.payDays} />
                      <Field label="Sale Invoice Code" value={<span className="text-sky-700">{p.tx.saleInvoice}</span>} />
                      <Field label="Transaction Date" value={p.tx.txDate} />
                      <Field label="Total Invoice Amount" value={p.tx.totalInvoice} />
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-2.5">
                    <p className="text-[10px] font-bold uppercase text-teal-700 mb-2">Shipment & Logistics</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Shipment Code" value={<span className="text-sky-700">{p.shipment.code}</span>} />
                      <Field label="Shipment Date" value={p.shipment.date} />
                      <Field label="Location" value={p.shipment.location} />
                      <Field label="BL Number" value={p.shipment.blNumber} />
                      <Field label="ETA Date" value={p.shipment.eta} />
                      <Field label="DO No." value={p.shipment.doNo} />
                      <Field label="Orig BL Received" value={p.shipment.origBl} />
                      <Field label="Gate Out Date" value={p.shipment.gateOut} />
                      <Field label="Voyage No." value={p.shipment.voyageNo} />
                      <Field label="Vessel No." value={p.shipment.vesselNo} />
                    </div>
                  </div>
                  {p.products.map((pr, i) => (
                    <div key={i} className="bg-rose-50/50 rounded-xl border border-rose-100 p-2.5">
                      <p className="text-[11px] font-bold text-[#0f2b3c]">{pr.name}</p>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <Field label="Variation" value={pr.variation} />
                        <Field label="Quantity" value={pr.qty} />
                        <Field label="U. Price" value={pr.uPrice} />
                        <Field label="S. Price" value={pr.sPrice} />
                        <Field label="Amount" value={pr.amount} />
                        <Field label="Destination" value={pr.destination} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              </div>
            </div>
          ))}

        {/* SALES SUMMARY */}
        {reportId === 'sales_summary' && (
          <>
            <SectionHeading title="Regional Sales Mix" subtitle="Approved Product Volume" />
            {salesData.map((g) => (
              <div key={g.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <button type="button" onClick={() => toggle(g.id)} className="w-full text-left p-3.5 cursor-pointer">
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700">{g.country}</p>
                      <p className="text-xs font-extrabold text-[#0f2b3c] mt-0.5">{g.customer}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 ${expanded[g.id] ? 'rotate-180' : ''}`} />
                  </div>
                  <p className="text-[10px] font-semibold text-slate-400 mt-2">
                    {g.rows.length} products · Qty {g.rows.reduce((a, r) => a + r.qty, 0).toLocaleString()}
                  </p>
                </button>
                {expanded[g.id] && (
                  <div className="border-t border-slate-100 bg-slate-50/60 p-3 space-y-2">
                    {g.rows.map((r, i) => (
                      <div key={i} className="bg-white rounded-xl border border-slate-200 p-2.5">
                        <div className="flex justify-between gap-2 mb-2">
                          <Field label="Approved Date" value={r.approvedDate} />
                          <p className="text-sm font-black text-[#0f2b3c] tabular-nums">{r.qty.toLocaleString()}</p>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-700 leading-snug">{r.product}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="bg-[#0f2b3c] text-white rounded-2xl px-4 py-3 flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">TOTAL QTY</span>
              <span className="text-lg font-black tabular-nums">{salesTotal.toLocaleString()}</span>
            </div>
          </>
        )}
      </div>

      {/* Filter drawer */}
      <div className={`fixed inset-0 z-50 ${drawerOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <button type="button" aria-label="Close" onClick={() => setDrawerOpen(false)} className={`absolute inset-0 bg-slate-900/40 transition-opacity ${drawerOpen ? 'opacity-100' : 'opacity-0'}`} />
        <aside className={`absolute top-0 right-0 h-full w-[min(92vw,340px)] bg-white shadow-2xl flex flex-col transition-transform duration-300 rounded-l-3xl ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Filters</p>
              <p className="text-sm font-extrabold text-[#0f2b3c]">{TITLES[reportId]}</p>
            </div>
            <button type="button" onClick={() => setDrawerOpen(false)} className="p-2 rounded-xl bg-slate-100 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">{filterFields()}</div>
          <div className="p-4 border-t border-slate-100 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setDrawerOpen(false);
                snack('Filters cleared');
              }}
              className="flex-1 py-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-extrabold cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => {
                setDrawerOpen(false);
                snack('Filters applied');
              }}
              className="flex-1 py-3 rounded-xl bg-[#0f2b3c] text-white text-xs font-extrabold cursor-pointer"
            >
              Apply
            </button>
          </div>
        </aside>
      </div>

      {/* Party summary sheet */}
      {summaryOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
          <button type="button" className="absolute inset-0 bg-slate-900/40" onClick={() => setSummaryOpen(false)} />
          <div className="relative bg-white w-full sm:max-w-md max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#0f2b3c]">Summary</h3>
              <button type="button" onClick={() => setSummaryOpen(false)} className="p-1.5 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            {[
              { supplier: 'AMBER NUTRITION', overall: [12, 4, 8], marketing: [12, 3, 9], status: [12, 5, 7] },
              { supplier: 'INDUS DYES', overall: [8, 2, 6], marketing: [8, 1, 7], status: [8, 2, 6] },
            ].map((row) => (
              <div key={row.supplier} className="rounded-xl border border-slate-200 p-3 space-y-2">
                <p className="text-xs font-extrabold text-[#0f2b3c]">{row.supplier}</p>
                {[
                  ['Overall', row.overall],
                  ['Marketing', row.marketing],
                  ['Supplier Status', row.status],
                ].map(([label, vals]) => (
                  <div key={label as string} className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-slate-500">{label as string}</span>
                    <span className="tabular-nums text-slate-800">
                      T {(vals as number[])[0]} · P {(vals as number[])[1]} · R {(vals as number[])[2]}
                    </span>
                  </div>
                ))}
              </div>
            ))}
            <div className="rounded-xl bg-[#0f2b3c] text-white p-3 text-[11px] font-extrabold flex justify-between">
              <span>Total</span>
              <span>T 20 · P 6 · R 14</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

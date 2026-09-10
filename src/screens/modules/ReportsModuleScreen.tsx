/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Mobile Reports — app-style cards, same fields as ERP report images
 */

import React, { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Filter,
  FileSpreadsheet,
  Printer,
  Search,
  X,
} from 'lucide-react';

export type ReportId =
  | 'purchase_summary'
  | 'pl_container'
  | 'export_document'
  | 'shipment_pnl'
  | 'order_report'
  | 'unconfirmed_order';

const TITLES: Record<ReportId, string> = {
  purchase_summary: 'Purchase Summary',
  pl_container: 'PL Container Report',
  export_document: 'Export Document',
  shipment_pnl: 'Shipment P&L',
  order_report: 'Order Report',
  unconfirmed_order: 'Unconfirmed Order',
};

/* -------------------- mock data (image fields) -------------------- */

const PURCHASE_SUMMARY = [
  {
    id: 'ps1',
    orderNo: 'PO-2401',
    billNo: 'INV-8812',
    date: '12/08/2026',
    portLoading: 'Port Qasim',
    portDischarge: 'Jebel Ali',
    placeDelivery: 'Dubai',
    party: 'Indus Dyes Ltd',
    products: [
      { name: 'Reactive Blue Dye Grade A', qty: '500 Kg', rate: '1,800', amount: '900,000' },
      { name: 'Fixing Auxiliary Agent', qty: '250 Ltr', rate: '1,000', amount: '250,000' },
    ],
    totalQty: '750',
    totalAmount: '1,150,000',
  },
  {
    id: 'ps2',
    orderNo: 'PO-2398',
    billNo: 'INV-8790',
    date: '05/08/2026',
    portLoading: 'Karachi',
    portDischarge: 'Jeddah',
    placeDelivery: 'Saudi Arabia',
    party: 'Pak Poly Packaging',
    products: [
      { name: 'PE Liner Bags 40x48', qty: '8,000 Pcs', rate: '55', amount: '440,000' },
    ],
    totalQty: '8,000',
    totalAmount: '440,000',
  },
];

const PL_CONTAINER = [
  { id: 'c1', month: 'JAN 24', containers: 12, delivered: 11, unpaid: 1, cost: '$48,200', sale: '$62,400', purchase: '$41,100', gp: '$21,300', expenses: '$4,200', np: '$17,100' },
  { id: 'c2', month: 'FEB 24', containers: 9, delivered: 9, unpaid: 0, cost: '$36,800', sale: '$49,100', purchase: '$31,400', gp: '$17,700', expenses: '$3,100', np: '$14,600' },
  { id: 'c3', month: 'MAR 24', containers: 15, delivered: 14, unpaid: 2, cost: '$58,900', sale: '$78,200', purchase: '$52,000', gp: '$26,200', expenses: '$5,400', np: '$20,800' },
  { id: 'c4', month: 'APR 24', containers: 11, delivered: 10, unpaid: 1, cost: '$44,100', sale: '$59,800', purchase: '$39,200', gp: '$20,600', expenses: '$3,900', np: '$16,700' },
  { id: 'c5', month: 'MAY 24', containers: 13, delivered: 13, unpaid: 0, cost: '$51,400', sale: '$68,900', purchase: '$45,600', gp: '$23,300', expenses: '$4,500', np: '$18,800' },
];

const EXPORT_DOCS = [
  {
    id: 'ed1',
    customer: 'CU-001 - ABID & SONS',
    marketing: 'BILAL',
    placeDelivery: 'SOHAR',
    totalContainers: 3,
    deliveredContainers: 2,
    companies: [
      {
        company: 'CO-001 - Soneri Foods Pvt. Ltd.',
        portDischarge: 'PK TQ - Port Qasim',
        deliveryMonth: 'March 2024',
        container: '20 Ft HD x 1',
        delivered: 1,
        inquiries: [
          {
            inquiry: 'IN-0001',
            freeDays: 7,
            invoiceAmount: '30,000.00',
            shipments: [
              {
                code: 'SH-001',
                created: '05/07/2023',
                location: 'KHI',
                mbl: 'MAEU123456',
                blReceived: 'Yes',
                containerNo: 'MSKU1234567',
                containerType: '40 Ft HD',
                eta: '20/03/2024',
                blNumber: 'HBL-9912',
              },
            ],
          },
        ],
      },
    ],
  },
];

const SHIPMENT_PNL = [
  { id: 'sp1', proforma: 'PI-7804', inquiry: 'EI-563', customer: 'CU-072 - MARUBENI SALMAN & SONS', marketing: 'BILAL', sale: '$42,800', gp: '$9,420', expenses: '$1,850', np: '$7,570' },
  { id: 'sp2', proforma: 'PI-7791', inquiry: 'EI-550', customer: 'CU-061 - HIMPEX SARL', marketing: 'ANUM KHAN', sale: '$28,400', gp: '$6,100', expenses: '$980', np: '$5,120' },
  { id: 'sp3', proforma: 'PI-7750', inquiry: 'EI-541', customer: 'CU-093 - TURK FOOD SWEDEN', marketing: 'AYAZ', sale: '$51,200', gp: '$11,300', expenses: '$2,100', np: '$9,200' },
];

const ORDER_REPORT = [
  {
    id: 'or1',
    customer: 'AJMAN UNITED SEAFOOD LLC',
    placeDelivery: 'RAK',
    marketing: 'SAIRA',
    totalContainers: 2,
    avgMargin: '22.40%',
    totalGp: '$12,480',
    orders: [
      {
        crm: 'CRM-441',
        confirmDate: '10/08/2026',
        deliveryMonth: 'Sep 2026',
        company: 'Soneri International',
        portDischarge: 'PT-RAK',
        container: '40 ft HC x 1',
        type: 'FCL',
        advance: 'Yes',
        piApproved: 'Yes',
        cro: 'Applied',
        cutoff: '18/09/2026',
        margin: '22.40%',
        gp: '$12,480',
        status: 'Customer Accepted',
        supplier: 'Savera Foods',
        products: [
          { name: 'BINGO LOLLIPOP 18G', variation: 'Mixed', cost: '$0.08', qty: '2,000 Ctn', price: '$0.12', total: '$240', margin: '33%', gp: '$80' },
        ],
      },
    ],
  },
];

const UNCONFIRMED = [
  {
    id: 'uc1',
    customer: 'GLOBAL AMAZON SALES CO. LTD',
    placeDelivery: 'SALE PACHO',
    marketing: 'SAIRA',
    totalContainers: 1,
    avgMargin: '20.83%',
    totalGp: '$5,473.00',
    groups: [
      {
        productCode: 'PI-127',
        company: 'Soneri International General Trading LLC',
        portDischarge: 'PT BDE - Banten',
        mode: 'FOB',
        deliveryMonth: 'September, 2024',
        container: '40 ft HC x 1',
        type: 'FCL',
        advance: 'No',
        margin: '20.83%',
        gp: '$5,473.00',
        status: 'Initial',
        products: [
          { name: 'PRO-PAL-BONSH', variation: 'Raspberry', cost: '$1.8000', qty: '438 Carton', price: '$3.0000', total: '$1,314.00', margin: '30.83%', gp: '$1,085.00' },
          { name: 'PRO-PAL-BONSH', variation: 'Strong Mint', cost: '$1.8000', qty: '400 Carton', price: '$3.0000', total: '$1,200.00', margin: '28.10%', gp: '$980.00' },
        ],
      },
    ],
  },
];

/* -------------------- shared UI -------------------- */

const Chip: React.FC<{ children: React.ReactNode; tone?: 'ok' | 'no' | 'warn' | 'info' }> = ({
  children,
  tone = 'info',
}) => {
  const map = {
    ok: 'bg-emerald-50 text-emerald-700',
    no: 'bg-rose-50 text-rose-700',
    warn: 'bg-amber-50 text-amber-800',
    info: 'bg-sky-50 text-sky-700',
  };
  return (
    <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full ${map[tone]}`}>
      {children}
    </span>
  );
};

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

interface Props {
  reportId: ReportId;
  onBack: () => void;
  onShowSnackBar?: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const ReportsModuleScreen: React.FC<Props> = ({ reportId, onBack, onShowSnackBar }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = useState({
    supplier: 'Select Supplier',
    company: 'Select Company',
    product: 'Select Product',
    duration: 'Previous Month',
    placeDelivery: 'Select Place of Delivery',
    portLoading: 'Select Port of Loading',
    portDischarge: 'Select Port of Discharge',
    customer: 'Select Customer',
    marketing: 'Select Marketing Personal',
    dateType: 'Auction Date',
    yearDuration: 'Current Year',
  });

  const toggle = (id: string) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  const snack = (m: string) => onShowSnackBar?.(m, 'info');

  const q = search.toLowerCase();

  const purchaseData = useMemo(
    () =>
      PURCHASE_SUMMARY.filter(
        (r) =>
          r.orderNo.toLowerCase().includes(q) ||
          r.party.toLowerCase().includes(q) ||
          r.billNo.toLowerCase().includes(q)
      ),
    [q]
  );

  const pnlData = useMemo(
    () =>
      SHIPMENT_PNL.filter(
        (r) =>
          r.proforma.toLowerCase().includes(q) ||
          r.customer.toLowerCase().includes(q) ||
          r.marketing.toLowerCase().includes(q)
      ),
    [q]
  );

  const filterFields = () => {
    switch (reportId) {
      case 'purchase_summary':
        return (
          <>
            <SelectField label="Supplier" value={filters.supplier} onChange={(v) => setFilters({ ...filters, supplier: v })} options={['Select Supplier', 'Indus Dyes Ltd', 'Pak Poly Packaging']} />
            <SelectField label="Company" value={filters.company} onChange={(v) => setFilters({ ...filters, company: v })} options={['Select Company', 'Soneri Foods', 'Soneri Care']} />
            <SelectField label="Product" value={filters.product} onChange={(v) => setFilters({ ...filters, product: v })} options={['Select Product', 'Reactive Dye', 'PE Liner']} />
            <SelectField label="Duration" value={filters.duration} onChange={(v) => setFilters({ ...filters, duration: v })} options={['Previous Month', 'Current Month', 'Current Year']} />
            <SelectField label="Place of Delivery" value={filters.placeDelivery} onChange={(v) => setFilters({ ...filters, placeDelivery: v })} options={['Select Place of Delivery', 'Dubai', 'Saudi Arabia']} />
            <SelectField label="Port of Loading" value={filters.portLoading} onChange={(v) => setFilters({ ...filters, portLoading: v })} options={['Select Port of Loading', 'Port Qasim', 'Karachi']} />
            <SelectField label="Port of Discharge" value={filters.portDischarge} onChange={(v) => setFilters({ ...filters, portDischarge: v })} options={['Select Port of Discharge', 'Jebel Ali', 'Jeddah']} />
          </>
        );
      case 'pl_container':
        return (
          <>
            <SelectField label="Date Filter Type" value={filters.dateType} onChange={(v) => setFilters({ ...filters, dateType: v })} options={['Auction Date', 'Shipment Date', 'Invoice Date']} />
            <SelectField label="Duration" value={filters.yearDuration} onChange={(v) => setFilters({ ...filters, yearDuration: v })} options={['Current Year', 'Previous Year', 'Last 6 Months']} />
          </>
        );
      case 'shipment_pnl':
        return (
          <>
            <SelectField label="Customer" value={filters.customer} onChange={(v) => setFilters({ ...filters, customer: v })} options={['Select Customer', 'MARUBENI SALMAN', 'HIMPEX SARL']} />
            <SelectField label="Company" value={filters.company} onChange={(v) => setFilters({ ...filters, company: v })} options={['Select Company', 'Soneri International']} />
            <SelectField label="Marketing Personal" value={filters.marketing} onChange={(v) => setFilters({ ...filters, marketing: v })} options={['Select Marketing Personal', 'BILAL', 'ANUM KHAN', 'AYAZ']} />
            <SelectField label="Duration" value={filters.duration} onChange={(v) => setFilters({ ...filters, duration: v })} options={['This Month', 'Previous Month', 'Current Year']} />
          </>
        );
      default:
        return (
          <>
            <SelectField label="Customer" value={filters.customer} onChange={(v) => setFilters({ ...filters, customer: v })} options={['Select Customer', 'All Customers']} />
            <SelectField label="Company" value={filters.company} onChange={(v) => setFilters({ ...filters, company: v })} options={['Select Company', 'Soneri International']} />
            <SelectField label="Marketing Personal" value={filters.marketing} onChange={(v) => setFilters({ ...filters, marketing: v })} options={['Select Marketing Personal', 'BILAL', 'SAIRA']} />
            <SelectField label="Duration" value={filters.duration} onChange={(v) => setFilters({ ...filters, duration: v })} options={['Current Month', 'Previous Month', 'Current Year']} />
          </>
        );
    }
  };

  return (
    <div className="min-h-full pb-24 bg-[#f3f6f8] text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200 px-3 py-2.5 space-y-2.5">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onBack} className="p-2 rounded-xl bg-slate-100 cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-extrabold text-[#0f2b3c] truncate">{TITLES[reportId]}</h1>
            <p className="text-[10px] font-semibold text-slate-400">Mobile report view</p>
          </div>
          {(reportId === 'order_report' || reportId === 'unconfirmed_order') && (
            <button
              type="button"
              onClick={() => setSummaryOpen(true)}
              className="px-2.5 py-1.5 rounded-xl text-[10px] font-bold bg-slate-100 text-slate-700 cursor-pointer"
            >
              Summary
            </button>
          )}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-bold bg-[#0f2b3c] text-white cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => snack('Preparing print…')} className="p-2 rounded-xl border border-slate-200 bg-white cursor-pointer">
            <Printer className="w-4 h-4 text-slate-600" />
          </button>
          {reportId === 'purchase_summary' && (
            <button type="button" onClick={() => snack('Excel export started')} className="p-2 rounded-xl border border-slate-200 bg-white cursor-pointer">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            </button>
          )}
          {(reportId === 'export_document' || reportId === 'pl_container') && (
            <button type="button" onClick={() => snack('PDF export started')} className="px-2 py-1.5 rounded-xl border border-slate-200 bg-white text-[10px] font-bold cursor-pointer">
              PDF
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
      </div>

      <div className="p-3 sm:p-4 space-y-3">
        {/* PURCHASE SUMMARY */}
        {reportId === 'purchase_summary' &&
          purchaseData.map((row) => (
            <div key={row.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <button type="button" onClick={() => toggle(row.id)} className="w-full text-left p-3.5 cursor-pointer">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-extrabold text-[#0f2b3c]">{row.orderNo}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Bill {row.billNo} · {row.date}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expanded[row.id] ? 'rotate-180' : ''}`} />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <Field label="Party" value={row.party} />
                  <Field label="Place of Delivery" value={row.placeDelivery} />
                  <Field label="Port of Loading" value={row.portLoading} />
                  <Field label="Port of Discharge" value={row.portDischarge} />
                </div>
                <div className="mt-3 flex justify-between text-[11px] font-bold border-t border-slate-100 pt-2">
                  <span className="text-slate-500">Total Qty {row.totalQty}</span>
                  <span className="text-emerald-700">{row.totalAmount}</span>
                </div>
              </button>
              {expanded[row.id] && (
                <div className="px-3.5 pb-3.5 space-y-2 border-t border-slate-100 bg-slate-50/60">
                  <p className="text-[10px] font-bold uppercase text-slate-400 pt-3">Products</p>
                  {row.products.map((p, i) => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 p-2.5">
                      <p className="text-[11px] font-bold text-slate-800 leading-snug">{p.name}</p>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <Field label="Qty" value={p.qty} />
                        <Field label="Rate" value={p.rate} />
                        <Field label="Amount" value={p.amount} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

        {/* PL CONTAINER */}
        {reportId === 'pl_container' && (
          <>
            {PL_CONTAINER.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-extrabold text-[#0f2b3c]">{r.month}</p>
                  <Chip tone="info">{r.containers} containers</Chip>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <Field label="Delivered" value={r.delivered} />
                  <Field label="Unpaid" value={r.unpaid} />
                  <Field label="Total Cost" value={r.cost} />
                  <Field label="Sale Invoice Amount" value={r.sale} />
                  <Field label="Purchase Invoice Amount" value={r.purchase} />
                  <Field label="Gross Profit" value={r.gp} />
                  <Field label="Expenses" value={r.expenses} />
                  <Field label="Net Profit" value={<span className="text-emerald-700">{r.np}</span>} />
                </div>
              </div>
            ))}
            <div className="bg-[#0f2b3c] text-white rounded-2xl p-3.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal-200/80">Total</p>
              <p className="text-lg font-black mt-1">60 containers · NP $87,999</p>
            </div>
          </>
        )}

        {/* EXPORT DOCUMENT */}
        {reportId === 'export_document' &&
          EXPORT_DOCS.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <button type="button" onClick={() => toggle(c.id)} className="w-full text-left p-3.5 cursor-pointer">
                <div className="flex justify-between gap-2">
                  <p className="text-xs font-extrabold text-[#0f2b3c]">{c.customer}</p>
                  <ChevronDown className={`w-4 h-4 shrink-0 text-slate-400 ${expanded[c.id] ? 'rotate-180' : ''}`} />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <Field label="Marketing Person" value={c.marketing} />
                  <Field label="Place of Delivery" value={c.placeDelivery} />
                  <Field label="Total Containers" value={c.totalContainers} />
                  <Field label="Delivered Containers" value={c.deliveredContainers} />
                </div>
              </button>
              {expanded[c.id] &&
                c.companies.map((co, ci) => (
                  <div key={ci} className="border-t border-slate-100 bg-slate-50/70 p-3.5 space-y-2">
                    <Field label="Company" value={co.company} />
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Port of Discharge" value={co.portDischarge} />
                      <Field label="Delivery Month" value={co.deliveryMonth} />
                      <Field label="Container" value={co.container} />
                      <Field label="Delivered" value={co.delivered} />
                    </div>
                    {co.inquiries.map((inq) => (
                      <div key={inq.inquiry} className="bg-white rounded-xl border border-slate-200 p-2.5 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Field label="Inquiry Code" value={inq.inquiry} />
                          <Field label="Free Days" value={inq.freeDays} />
                          <Field label="Total Invoice Amount" value={inq.invoiceAmount} />
                        </div>
                        {inq.shipments.map((sh) => (
                          <div key={sh.code} className="rounded-lg bg-slate-50 border border-slate-100 p-2 space-y-1.5">
                            <Field label="Shipment Code" value={sh.code} />
                            <div className="grid grid-cols-2 gap-2">
                              <Field label="Created Date" value={sh.created} />
                              <Field label="Location" value={sh.location} />
                              <Field label="MBL NO." value={sh.mbl} />
                              <Field label="Original B/L" value={sh.blReceived} />
                              <Field label="Container Type" value={sh.containerType} />
                              <Field label="Container No" value={sh.containerNo} />
                              <Field label="ETA Date" value={sh.eta} />
                              <Field label="BL Number" value={sh.blNumber} />
                            </div>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {['View Job', 'Commercial Invoice', 'Packing List', 'CBM', 'Sales'].map((a) => (
                                <button key={a} type="button" onClick={() => snack(a)} className="text-[9px] font-bold px-2 py-1 rounded-lg bg-[#0f2b3c] text-white cursor-pointer">
                                  {a}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          ))}

        {/* SHIPMENT P&L */}
        {reportId === 'shipment_pnl' &&
          pnlData.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <button type="button" onClick={() => snack(r.proforma)} className="text-xs font-extrabold text-teal-700 cursor-pointer">
                    {r.proforma}
                  </button>
                  <p className="text-[11px] text-slate-500 mt-0.5">{r.inquiry}</p>
                </div>
                <Chip tone="ok">{r.np}</Chip>
              </div>
              <p className="text-[11px] font-bold text-slate-800 mt-2">{r.customer}</p>
              <div className="grid grid-cols-2 gap-2.5 mt-3">
                <Field label="Marketing Personal" value={r.marketing} />
                <Field label="Sale Invoice Amount" value={r.sale} />
                <Field label="Gross Profit" value={r.gp} />
                <Field label="Expenses" value={r.expenses} />
                <Field label="Net Profit" value={<span className="text-emerald-700 font-bold">{r.np}</span>} />
              </div>
            </div>
          ))}

        {/* ORDER REPORT */}
        {reportId === 'order_report' &&
          ORDER_REPORT.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <button type="button" onClick={() => toggle(c.id)} className="w-full text-left p-3.5 cursor-pointer">
                <div className="flex justify-between gap-2">
                  <p className="text-xs font-extrabold text-[#0f2b3c]">{c.customer}</p>
                  <ChevronDown className={`w-4 h-4 text-slate-400 ${expanded[c.id] ? 'rotate-180' : ''}`} />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <Field label="Place of Delivery" value={c.placeDelivery} />
                  <Field label="Marketing Person" value={c.marketing} />
                  <Field label="Total Containers" value={c.totalContainers} />
                  <Field label="Avg Margin %" value={c.avgMargin} />
                  <Field label="Total Gross Profit" value={c.totalGp} />
                </div>
              </button>
              {expanded[c.id] &&
                c.orders.map((o) => (
                  <div key={o.crm} className="border-t border-slate-100 bg-slate-50/70 p-3.5 space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      <Chip tone="ok">{o.type}</Chip>
                      <Chip tone={o.advance === 'Yes' ? 'ok' : 'no'}>Advance {o.advance}</Chip>
                      <Chip tone="ok">PI {o.piApproved}</Chip>
                      <Chip tone="warn">CRO {o.cro}</Chip>
                      <Chip>{o.status}</Chip>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Internal CRM" value={o.crm} />
                      <Field label="Confirmation Date" value={o.confirmDate} />
                      <Field label="Delivery Month" value={o.deliveryMonth} />
                      <Field label="Company" value={o.company} />
                      <Field label="Port of Discharge" value={o.portDischarge} />
                      <Field label="Container" value={o.container} />
                      <Field label="Cutoff Date" value={o.cutoff} />
                      <Field label="Supplier" value={o.supplier} />
                      <Field label="Margin %" value={o.margin} />
                      <Field label="Gross Profit" value={o.gp} />
                    </div>
                    {o.products.map((p, i) => (
                      <div key={i} className="bg-white rounded-xl border border-slate-200 p-2.5">
                        <p className="text-[11px] font-bold">{p.name}</p>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <Field label="Variation" value={p.variation} />
                          <Field label="Cost Price" value={p.cost} />
                          <Field label="Qty" value={p.qty} />
                          <Field label="Price" value={p.price} />
                          <Field label="Total" value={p.total} />
                          <Field label="Margin %" value={p.margin} />
                          <Field label="Gross Profit" value={p.gp} />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          ))}

        {/* UNCONFIRMED ORDER */}
        {reportId === 'unconfirmed_order' &&
          UNCONFIRMED.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <button type="button" onClick={() => toggle(c.id)} className="w-full text-left p-3.5 cursor-pointer">
                <div className="flex justify-between gap-2">
                  <p className="text-xs font-extrabold text-[#0f2b3c]">{c.customer}</p>
                  <ChevronDown className={`w-4 h-4 text-slate-400 ${expanded[c.id] ? 'rotate-180' : ''}`} />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <Field label="Place of Delivery" value={c.placeDelivery} />
                  <Field label="Marketing Person" value={c.marketing} />
                  <Field label="Total Containers" value={c.totalContainers} />
                  <Field label="Avg Margin %" value={c.avgMargin} />
                  <Field label="Total Gross Profit" value={c.totalGp} />
                </div>
              </button>
              {expanded[c.id] &&
                c.groups.map((g) => (
                  <div key={g.productCode} className="border-t border-slate-100 bg-slate-50/70 p-3.5 space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      <Chip tone="ok">{g.type}</Chip>
                      <Chip tone="no">Advance {g.advance}</Chip>
                      <Chip tone="warn">{g.status}</Chip>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Products code" value={g.productCode} />
                      <Field label="Company" value={g.company} />
                      <Field label="Port of discharge" value={g.portDischarge} />
                      <Field label="Mode" value={g.mode} />
                      <Field label="Delivery Month" value={g.deliveryMonth} />
                      <Field label="Container" value={g.container} />
                      <Field label="Margin %" value={g.margin} />
                      <Field label="Gross Profit" value={g.gp} />
                    </div>
                    {g.products.map((p, i) => (
                      <div key={i} className="bg-white rounded-xl border border-slate-200 p-2.5">
                        <p className="text-[11px] font-bold">{p.name}</p>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <Field label="Variation" value={p.variation} />
                          <Field label="Cost Price" value={p.cost} />
                          <Field label="Qty" value={p.qty} />
                          <Field label="Price" value={p.price} />
                          <Field label="Total" value={p.total} />
                          <Field label="Margin %" value={p.margin} />
                          <Field label="Gross Profit" value={p.gp} />
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          ))}
      </div>

      {/* Filter side drawer */}
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

      {/* Summary sheet */}
      {summaryOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
          <button type="button" className="absolute inset-0 bg-slate-900/40" onClick={() => setSummaryOpen(false)} />
          <div className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#0f2b3c]">Summary</h3>
              <button type="button" onClick={() => setSummaryOpen(false)} className="p-1.5 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2 text-[11px] font-bold">
              <span className="px-3 py-1.5 rounded-lg bg-[#0f2b3c] text-white">Overall</span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600">Marketing</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['20 ft', '14'],
                ['40 ft', '2'],
                ['40 ft HC', '129'],
                ['40 ft reefer', '1'],
                ['LCL', '3'],
                ['Total', '150'],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-slate-50 border border-slate-200 p-2.5">
                  <p className="text-[10px] text-slate-400 font-bold">{k}</p>
                  <p className="text-sm font-black text-[#0f2b3c]">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

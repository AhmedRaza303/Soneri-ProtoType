/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Supplier Tracking Report — journey-style mobile tracking (not a table clone)
 */

import React, { useMemo, useState } from 'react';
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  Filter,
  Package,
  Radar,
  Search,
  Ship,
  Sparkles,
  Timer,
  X,
} from 'lucide-react';
import {
  StageTone,
  SUPPLIER_TRACKING,
  TRACK_STAGES,
  TrackingProduct,
  SupplierTrackingOrder,
  TrackStage,
} from '../../data/supplierTrackingData';

interface Props {
  onBack: () => void;
  onShowSnackBar?: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const toneBg: Record<StageTone, string> = {
  done: 'bg-emerald-500',
  active: 'bg-sky-500',
  warn: 'bg-amber-500',
  pending: 'bg-slate-300',
  blocked: 'bg-rose-500',
};

const toneText: Record<StageTone, string> = {
  done: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  active: 'text-sky-700 bg-sky-50 border-sky-200',
  warn: 'text-amber-800 bg-amber-50 border-amber-200',
  pending: 'text-slate-600 bg-slate-100 border-slate-200',
  blocked: 'text-rose-700 bg-rose-50 border-rose-200',
};

function productStageTone(p: TrackingProduct, stage: TrackStage, croTone: StageTone): StageTone {
  switch (stage) {
    case 'packaging':
      return p.packagingTone;
    case 'design':
      return p.designTone;
    case 'material': {
      if (p.materials.every((m) => m.tone === 'done')) return 'done';
      if (p.materials.some((m) => m.tone === 'active' || m.tone === 'warn')) return 'active';
      return 'pending';
    }
    case 'production':
      return p.productionTone;
    case 'qa':
      return p.qaTone;
    case 'cro':
      return croTone;
  }
}

function orderPipeline(order: SupplierTrackingOrder): StageTone[] {
  return TRACK_STAGES.map(({ key }) => {
    const tones = order.products.map((p) => productStageTone(p, key, order.croTone));
    if (tones.every((t) => t === 'done')) return 'done';
    if (tones.some((t) => t === 'blocked')) return 'blocked';
    if (tones.some((t) => t === 'warn')) return 'warn';
    if (tones.some((t) => t === 'active')) return 'active';
    return 'pending';
  });
}

function agingTone(days: number) {
  if (days >= 21) return 'from-rose-600 to-rose-500';
  if (days >= 10) return 'from-amber-500 to-orange-500';
  return 'from-teal-600 to-emerald-500';
}

const MiniField: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="min-w-0">
    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
    <p className="text-[11px] font-semibold text-slate-800 break-words mt-0.5">{value}</p>
  </div>
);

export const SupplierTrackingScreen: React.FC<Props> = ({ onBack, onShowSnackBar }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ st1: true });
  const [productOpen, setProductOpen] = useState<Record<string, boolean>>({});
  const [urgency, setUrgency] = useState<'all' | 'hot' | 'watch' | 'fresh'>('all');
  const [filters, setFilters] = useState({
    supplier: 'All Suppliers',
    marketing: 'All Marketing',
    cro: 'All CRO',
    shipment: 'All Types',
  });

  const snack = (m: string) => onShowSnackBar?.(m, 'info');
  const toggle = (id: string) => setExpanded((e) => ({ ...e, [id]: !e[id] }));
  const toggleProduct = (id: string) => setProductOpen((e) => ({ ...e, [id]: !e[id] }));

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return SUPPLIER_TRACKING.filter((o) => {
      if (urgency === 'hot' && o.agingDays < 21) return false;
      if (urgency === 'watch' && (o.agingDays < 10 || o.agingDays >= 21)) return false;
      if (urgency === 'fresh' && o.agingDays >= 10) return false;
      if (filters.supplier !== 'All Suppliers' && !o.supplier.includes(filters.supplier)) return false;
      if (filters.marketing !== 'All Marketing' && o.marketing !== filters.marketing) return false;
      if (filters.cro === 'Applied' && o.croStatus !== 'Applied') return false;
      if (filters.cro === 'Not Applied' && o.croStatus === 'Applied') return false;
      if (filters.shipment !== 'All Types' && o.shipmentType !== filters.shipment) return false;
      if (!q) return true;
      return (
        o.po.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.supplier.toLowerCase().includes(q) ||
        o.port.toLowerCase().includes(q) ||
        o.products.some((p) => p.name.toLowerCase().includes(q) || p.variation.toLowerCase().includes(q))
      );
    });
  }, [search, urgency, filters]);

  const totals = useMemo(() => {
    let productQty = 0;
    let containerQty = 0;
    filtered.forEach((o) => {
      containerQty += o.containerQty;
      o.products.forEach((p) => {
        const n = parseInt(p.qty.replace(/[^\d]/g, ''), 10);
        if (!Number.isNaN(n)) productQty += n;
      });
    });
    return { productQty, containerQty, orders: filtered.length };
  }, [filtered]);

  return (
    <div className="min-h-full pb-28 bg-[linear-gradient(180deg,#e8f4f7_0%,#f3f6f8_40%,#f8fafc_100%)] text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200 px-3 py-2.5 space-y-2.5">
        <div className="flex items-center gap-2">
          <button type="button" onClick={onBack} className="p-2 rounded-xl bg-slate-100 cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <Radar className="w-4 h-4 text-teal-600" />
              <h1 className="text-base font-extrabold text-[#0f2b3c] truncate">Supplier Tracking</h1>
            </div>
            <p className="text-[10px] font-semibold text-slate-400">Live fulfillment journey · not a grid</p>
          </div>
          <button
            type="button"
            onClick={() => snack('View saved')}
            className="px-2.5 py-1.5 rounded-xl text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200 cursor-pointer"
          >
            Save View
          </button>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-bold bg-[#0f2b3c] text-white cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search PO, customer, product…"
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs outline-none focus:bg-white focus:border-teal-600"
          />
        </div>

        {/* Urgency chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {(
            [
              ['all', 'All lanes'],
              ['hot', '🔥 Hot 21+'],
              ['watch', '⏱ Watch 10+'],
              ['fresh', '✨ Fresh'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setUrgency(id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold cursor-pointer ${
                urgency === id ? 'bg-[#0f2b3c] text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 sm:p-4 space-y-3">
        {/* Mission control strip */}
        <div className="rounded-2xl bg-gradient-to-br from-[#0f2b3c] via-[#163a50] to-[#1a4d5c] p-3.5 text-white shadow-lg overflow-hidden relative">
          <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-teal-400/10 blur-2xl" />
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-teal-300" />
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-200/90">Mission Control</p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-white/10 border border-white/10 p-2.5">
              <p className="text-[9px] font-bold uppercase text-white/50">Orders</p>
              <p className="text-lg font-black tabular-nums">{totals.orders}</p>
            </div>
            <div className="rounded-xl bg-white/10 border border-white/10 p-2.5">
              <p className="text-[9px] font-bold uppercase text-white/50">Product Qty</p>
              <p className="text-lg font-black tabular-nums">{totals.productQty.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-white/10 border border-white/10 p-2.5">
              <p className="text-[9px] font-bold uppercase text-white/50">Containers</p>
              <p className="text-lg font-black tabular-nums">{totals.containerQty}</p>
            </div>
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center">
            <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-500">No shipments match this lane</p>
          </div>
        )}

        {filtered.map((order) => {
          const pipe = orderPipeline(order);
          const open = !!expanded[order.id];
          return (
            <div key={order.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_10px_30px_rgba(15,43,60,0.06)] overflow-hidden">
              {/* Aging ribbon */}
              <div className={`h-1.5 bg-gradient-to-r ${agingTone(order.agingDays)}`} />

              <button type="button" onClick={() => toggle(order.id)} className="w-full text-left p-3.5 cursor-pointer">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-black text-[#0f2b3c] font-mono">{order.po}</p>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-600">
                        <Ship className="w-3 h-3" />
                        {order.shipmentType}
                      </span>
                      {order.readiness && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                          <CalendarDays className="w-3 h-3" />
                          Ready
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-semibold text-slate-600 mt-1 truncate">{order.customer}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">{order.supplier}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-extrabold text-white bg-gradient-to-r ${agingTone(order.agingDays)}`}
                    >
                      <Timer className="w-3 h-3" />
                      {order.agingLabel}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 ml-auto mt-2 transition-transform ${open ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Journey pipeline */}
                <div className="mt-3.5 px-0.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Fulfillment journey</p>
                    <p className="text-[9px] font-bold text-slate-400">{order.deliveryMonth}</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {TRACK_STAGES.map((s, i) => (
                      <React.Fragment key={s.key}>
                        <div className="flex flex-col items-center gap-1 min-w-0 flex-1">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black text-white shadow-sm ${toneBg[pipe[i]]}`}
                          >
                            {i + 1}
                          </div>
                          <span className="text-[8px] font-bold text-slate-500 truncate w-full text-center">{s.label}</span>
                        </div>
                        {i < TRACK_STAGES.length - 1 && (
                          <div className={`h-0.5 flex-1 mb-4 rounded-full ${pipe[i] === 'done' ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3">
                  <MiniField label="Port" value={order.port} />
                  <MiniField label="Container" value={`${order.containerType} × ${order.containerQty}`} />
                  <MiniField
                    label="CRO"
                    value={
                      <span className={`inline-flex px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${toneText[order.croTone]}`}>
                        {order.croStatus}
                      </span>
                    }
                  />
                </div>
              </button>

              {open && (
                <div className="border-t border-slate-100 bg-slate-50/70 p-3 space-y-2.5">
                  <div className="grid grid-cols-2 gap-2 rounded-xl bg-white border border-slate-200 p-2.5">
                    <MiniField label="Confirm Date" value={order.confirmDate} />
                    <MiniField label="Cut-off Date" value={order.cutoffDate} />
                    <MiniField label="Company" value={order.company} />
                    <MiniField label="Marketing" value={order.marketing} />
                    <MiniField label="EP#" value={order.epNumber} />
                    <MiniField label="Last Update" value={<span className="text-[10px]">{order.lastUpdate}</span>} />
                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-teal-700 px-0.5">
                    Products · {order.products.length}
                  </p>

                  {order.products.map((p) => {
                    const pid = `${order.id}-${p.id}`;
                    const popen = !!productOpen[pid];
                    return (
                      <div key={p.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleProduct(pid)}
                          className="w-full text-left p-3 cursor-pointer"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-[11px] font-extrabold text-[#0f2b3c] leading-snug">{p.name}</p>
                              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                <span className="px-2 py-0.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-[9px] font-bold">
                                  {p.variation}
                                </span>
                                <span className="text-[10px] font-bold text-slate-600 font-mono">{p.qty}</span>
                              </div>
                            </div>
                            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 ${popen ? 'rotate-180' : ''}`} />
                          </div>
                        </button>

                        {popen && (
                          <div className="border-t border-slate-100 px-3 pb-3 space-y-2.5">
                            <div className="grid grid-cols-2 gap-2 pt-2.5">
                              <MiniField
                                label="Packaging Status"
                                value={
                                  <span className={`inline-flex px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${toneText[p.packagingTone]}`}>
                                    {p.packaging}
                                  </span>
                                }
                              />
                              <MiniField
                                label="Design Status"
                                value={
                                  <span className={`inline-flex px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${toneText[p.designTone]}`}>
                                    {p.design}
                                  </span>
                                }
                              />
                              <MiniField label="Design Approval" value={p.designApproval} />
                              <MiniField
                                label="Production"
                                value={
                                  <span className={`inline-flex px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${toneText[p.productionTone]}`}>
                                    {p.production}
                                  </span>
                                }
                              />
                              <MiniField label="Production Sample" value={p.productionSample} />
                              <MiniField label="Purchase Surveyor" value={p.surveyor} />
                              <MiniField
                                label="QA Approval"
                                value={
                                  <span className={`inline-flex px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${toneText[p.qaTone]}`}>
                                    {p.qa}
                                  </span>
                                }
                              />
                            </div>

                            {/* Material status chips */}
                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Material Status</p>
                              <div className="flex flex-wrap gap-1.5">
                                {p.materials.map((m) => (
                                  <span
                                    key={m.label}
                                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border ${toneText[m.tone]}`}
                                  >
                                    <span className={`w-1.5 h-1.5 rounded-full ${toneBg[m.tone]}`} />
                                    {m.label}: {m.status}
                                  </span>
                                ))}
                              </div>
                            </div>
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

        {/* Sticky totals footer */}
        <div className="sticky bottom-3 rounded-2xl bg-[#0f2b3c] text-white px-4 py-3 flex items-center justify-between shadow-xl">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-white/50">Grand Total</p>
            <p className="text-[11px] font-bold text-teal-200">
              Qty {totals.productQty.toLocaleString()} · Ctr {totals.containerQty}
            </p>
          </div>
          <p className="text-sm font-black tabular-nums">{totals.orders} POs</p>
        </div>
      </div>

      {/* Filter drawer */}
      <div className={`fixed inset-0 z-50 ${drawerOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <button
          type="button"
          aria-label="Close"
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 bg-slate-900/40 transition-opacity ${drawerOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside
          className={`absolute top-0 right-0 h-full w-[min(92vw,340px)] bg-white shadow-2xl flex flex-col transition-transform duration-300 rounded-l-3xl ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Filters</p>
              <p className="text-sm font-extrabold text-[#0f2b3c]">Supplier Tracking</p>
            </div>
            <button type="button" onClick={() => setDrawerOpen(false)} className="p-2 rounded-xl bg-slate-100 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {(
              [
                ['supplier', 'Supplier', ['All Suppliers', 'SKINCARE', 'ISMAIL', 'VOLKA']],
                ['marketing', 'Marketing Person', ['All Marketing', 'BILAL', 'PERVAIZ MORANI', 'AYAZ']],
                ['cro', 'CRO Status', ['All CRO', 'Applied', 'Not Applied']],
                ['shipment', 'Shipment Type', ['All Types', 'FCL', 'LCL']],
              ] as const
            ).map(([key, label, options]) => (
              <label key={key} className="block space-y-1">
                <span className="text-[11px] font-bold text-slate-600">{label}</span>
                <select
                  value={filters[key]}
                  onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold outline-none focus:border-teal-600"
                >
                  {options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <div className="p-4 border-t border-slate-100 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setFilters({ supplier: 'All Suppliers', marketing: 'All Marketing', cro: 'All CRO', shipment: 'All Types' });
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
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Mobile Readiness Calendar — matches ERP mobile UI
 */

import React, { useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Menu,
  X,
} from 'lucide-react';

type CalView = 'day' | 'week' | 'month';
type ModuleKey = 'cro_received' | 'cro_applied' | 'cro_not' | 'fcl' | 'console';
type ShipType = 'FCL' | 'Console';

interface ReadyItem {
  id: string;
  code: string;
  title: string;
  day: number;
  month: number; // 0-index
  year: number;
  module: ModuleKey;
  shipType: ShipType;
  proforma: string;
  requisition: string;
}

const MODULES: {
  key: ModuleKey;
  label: string;
  dot: string;
  pillBg: string;
  pillText: string;
}[] = [
  { key: 'cro_received', label: 'CRO Received', dot: 'bg-emerald-500', pillBg: 'bg-emerald-50', pillText: 'text-emerald-700' },
  { key: 'cro_applied', label: 'CRO Applied', dot: 'bg-orange-400', pillBg: 'bg-orange-50', pillText: 'text-orange-700' },
  { key: 'cro_not', label: 'CRO Not Applied', dot: 'bg-rose-400', pillBg: 'bg-rose-50', pillText: 'text-rose-700' },
  { key: 'fcl', label: 'FCL', dot: 'bg-sky-400', pillBg: 'bg-sky-50', pillText: 'text-sky-700' },
  { key: 'console', label: 'Console', dot: 'bg-violet-400', pillBg: 'bg-violet-50', pillText: 'text-violet-700' },
];

const ITEMS: ReadyItem[] = [
  { id: '1', code: 'PI-898', title: 'SUNTRADE FOODS', day: 30, month: 7, year: 2026, module: 'cro_not', shipType: 'FCL', proforma: 'PI-898', requisition: 'RQ-901' },
  { id: '2', code: 'PI-835', title: 'EUROPA INDUSTRIES', day: 31, month: 7, year: 2026, module: 'cro_not', shipType: 'Console', proforma: 'PI-835', requisition: 'RQ-991' },
  { id: '3', code: 'PI-840', title: 'GATE FOODS LLC', day: 31, month: 7, year: 2026, module: 'cro_not', shipType: 'FCL', proforma: 'PI-840', requisition: 'RQ-980' },
  { id: '4', code: 'PI-841', title: 'EURO MART', day: 31, month: 7, year: 2026, module: 'cro_applied', shipType: 'Console', proforma: 'PI-841', requisition: 'RQ-970' },
  { id: '5', code: 'PI-852', title: 'SILVER GATE', day: 1, month: 8, year: 2026, module: 'cro_not', shipType: 'FCL', proforma: 'PI-852', requisition: 'RQ-960' },
  { id: '6', code: 'PI-860', title: 'TURK FOOD', day: 5, month: 8, year: 2026, module: 'cro_received', shipType: 'Console', proforma: 'PI-860', requisition: 'RQ-955' },
  { id: '7', code: 'PI-865', title: 'DSG GROUP', day: 5, month: 8, year: 2026, module: 'cro_not', shipType: 'FCL', proforma: 'PI-865', requisition: 'RQ-950' },
  { id: '8', code: 'CRO-112', title: 'ADE KOMPANI', day: 8, month: 8, year: 2026, module: 'cro_received', shipType: 'Console', proforma: 'PI-870', requisition: 'RQ-940' },
  { id: '9', code: 'PI-877', title: 'HIMPEX SARL', day: 9, month: 8, year: 2026, module: 'fcl', shipType: 'FCL', proforma: 'PI-877', requisition: 'RQ-930' },
  { id: '10', code: 'PI-880', title: 'SUN FOODS', day: 9, month: 8, year: 2026, module: 'console', shipType: 'Console', proforma: 'PI-880', requisition: 'RQ-920' },
  { id: '11', code: 'PI-888', title: 'AL MASRAF', day: 14, month: 8, year: 2026, module: 'cro_not', shipType: 'FCL', proforma: 'PI-888', requisition: 'RQ-910' },
  { id: '12', code: 'PI-901', title: 'AL ABBAS', day: 15, month: 8, year: 2026, module: 'cro_applied', shipType: 'Console', proforma: 'PI-901', requisition: 'RQ-900' },
  { id: '13', code: 'PI-905', title: 'ARIDIM', day: 15, month: 8, year: 2026, module: 'cro_not', shipType: 'FCL', proforma: 'PI-905', requisition: 'RQ-890' },
  { id: '14', code: 'PI-910', title: 'GOLDEN GATE', day: 18, month: 8, year: 2026, module: 'fcl', shipType: 'FCL', proforma: 'PI-910', requisition: 'RQ-880' },
  { id: '15', code: 'CRO-118', title: 'AHA TRADING', day: 19, month: 8, year: 2026, module: 'cro_applied', shipType: 'Console', proforma: 'PI-915', requisition: 'RQ-870' },
  { id: '16', code: 'PI-920', title: 'ZARA TRADING', day: 22, month: 8, year: 2026, module: 'cro_not', shipType: 'FCL', proforma: 'PI-920', requisition: 'RQ-860' },
  { id: '17', code: 'PI-925', title: 'THAER EST', day: 25, month: 8, year: 2026, module: 'console', shipType: 'Console', proforma: 'PI-925', requisition: 'RQ-850' },
  { id: '18', code: 'CRO-125', title: 'AL-HASHIM', day: 28, month: 8, year: 2026, module: 'cro_not', shipType: 'FCL', proforma: 'PI-930', requisition: 'RQ-840' },
  { id: '19', code: 'PI-935', title: 'AL-MOSHRAA', day: 29, month: 8, year: 2026, module: 'fcl', shipType: 'FCL', proforma: 'PI-935', requisition: 'RQ-830' },
  { id: '20', code: 'PI-842', title: 'NILE TRADING', day: 31, month: 7, year: 2026, module: 'cro_not', shipType: 'Console', proforma: 'PI-842', requisition: 'RQ-992' },
  { id: '21', code: 'PI-850', title: 'EURO SILVER', day: 6, month: 8, year: 2026, module: 'cro_not', shipType: 'FCL', proforma: 'PI-850', requisition: 'RQ-945' },
];

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const WEEKDAYS_S = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const ALL_ON: Record<ModuleKey, boolean> = {
  cro_received: true,
  cro_applied: true,
  cro_not: true,
  fcl: true,
  console: true,
};

function modOf(key: ModuleKey) {
  return MODULES.find((m) => m.key === key)!;
}

function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}

function startWeekday(y: number, m: number) {
  return new Date(y, m, 1).getDay();
}

function weekdayName(y: number, m: number, d: number) {
  return new Date(y, m, d).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

interface Props {
  onBack: () => void;
  onShowSnackBar?: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const ReadinessCalendarScreen: React.FC<Props> = ({ onBack, onShowSnackBar }) => {
  const [view, setView] = useState<CalView>('month');
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(8); // Sep
  const [selectedDay, setSelectedDay] = useState(9);
  const [filters, setFilters] = useState(ALL_ON);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [daySheetOpen, setDaySheetOpen] = useState(false);
  const [sheetModule, setSheetModule] = useState<ModuleKey | 'all'>('all');

  const totalDays = daysInMonth(year, month);
  const offset = startWeekday(year, month);
  const prevDays = daysInMonth(year, month === 0 ? 11 : month - 1);

  const visible = useMemo(() => ITEMS.filter((i) => filters[i.module]), [filters]);

  const monthItems = useMemo(
    () => visible.filter((i) => i.year === year && i.month === month),
    [visible, year, month]
  );

  const byDay = useMemo(() => {
    const map: Record<number, ReadyItem[]> = {};
    monthItems.forEach((i) => {
      (map[i.day] ||= []).push(i);
    });
    return map;
  }, [monthItems]);

  // also include adjacent month spill for mini cal dots (current month focus)
  const dayItems = useMemo(() => {
    return visible.filter(
      (i) => i.year === year && i.month === month && i.day === selectedDay
    );
  }, [visible, year, month, selectedDay]);

  const sheetItems = useMemo(() => {
    if (sheetModule === 'all') return dayItems;
    return dayItems.filter((i) => i.module === sheetModule);
  }, [dayItems, sheetModule]);

  const allSelected = MODULES.every((m) => filters[m.key]);

  const shiftMonth = (dir: -1 | 1) => {
    let m = month + dir;
    let y = year;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setMonth(m);
    setYear(y);
    setSelectedDay(1);
  };

  const openDay = (d: number, m = month, y = year) => {
    if (m !== month || y !== year) {
      setMonth(m);
      setYear(y);
    }
    setSelectedDay(d);
    setView('day');
    setSheetModule('all');
    setDaySheetOpen(true);
    setDrawerOpen(false);
  };

  const EventPill = ({ item }: { item: ReadyItem }) => {
    const s = modOf(item.module);
    return (
      <div
        className={`flex items-center gap-1 rounded-md px-1 py-0.5 truncate ${s.pillBg} ${s.pillText}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
        <span className="text-[8px] sm:text-[9px] font-bold truncate">
          {item.code} - {item.title.slice(0, 6)}…
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-full pb-24 bg-[#f4f6f8] text-slate-900">
      {/* Top bar — Filters + Day/Week/Month */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200/80 px-3 py-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl hover:bg-slate-100 cursor-pointer text-slate-500"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-100 cursor-pointer text-slate-600"
            aria-label="Open quick dates and filters"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold bg-[#0f2b3c] text-white cursor-default opacity-90"
            aria-hidden
            tabIndex={-1}
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
          </button>

          <div className="ml-auto inline-flex rounded-xl bg-white border border-slate-200 p-0.5 shadow-sm">
            {(['day', 'week', 'month'] as CalView[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  setView(v);
                  if (v === 'day') setDaySheetOpen(true);
                }}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-lg capitalize cursor-pointer ${
                  view === v
                    ? 'bg-[#dbeaf2] text-[#0f2b3c]'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-2 text-[11px] font-semibold text-slate-500 px-1">
          {monthItems.length} scheduled readiness items visible
        </p>
      </div>

      <div className="p-3 sm:p-4 space-y-3">
        {/* MONTH GRID */}
        {view === 'month' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-7 border-b border-slate-100">
              {WEEKDAYS.map((d) => (
                <div
                  key={d}
                  className="py-2 text-center text-[9px] font-bold tracking-wide text-slate-400"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {/* prev month spill */}
              {Array.from({ length: offset }).map((_, i) => {
                const d = prevDays - offset + i + 1;
                return (
                  <div
                    key={`p-${i}`}
                    className="min-h-[78px] sm:min-h-[92px] p-1 border-b border-r border-slate-100 bg-slate-50/50"
                  >
                    <div className="text-right text-[10px] font-semibold text-slate-300 pr-0.5">
                      {String(d).padStart(2, '0')}
                    </div>
                  </div>
                );
              })}

              {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => {
                const items = byDay[d] || [];
                const isSel = d === selectedDay;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => openDay(d)}
                    className={`min-h-[78px] sm:min-h-[92px] p-1 border-b border-r border-slate-100 text-left align-top cursor-pointer transition-colors ${
                      isSel ? 'bg-[#eef6fa] ring-1 ring-inset ring-[#0f2b3c]' : 'bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-0.5 mb-0.5">
                      {items.length > 0 ? (
                        <span className="w-4 h-4 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                          <Eye className="w-2.5 h-2.5" />
                        </span>
                      ) : (
                        <span />
                      )}
                      <span
                        className={`text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                          isSel ? 'bg-[#0f2b3c] text-white' : 'text-slate-500'
                        }`}
                      >
                        {String(d).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      {items.slice(0, 2).map((it) => (
                        <EventPill key={it.id} item={it} />
                      ))}
                      {items.length > 2 && (
                        <span className="text-[8px] font-bold text-slate-400 pl-0.5">
                          +{items.length - 2}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* WEEK */}
        {view === 'week' && (
          <div className="space-y-2">
            {Array.from({ length: 7 }, (_, i) => {
              const start = Math.max(1, selectedDay - ((selectedDay - 1) % 7));
              const d = start + i;
              if (d > totalDays) return null;
              const items = byDay[d] || [];
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => openDay(d)}
                  className="w-full text-left bg-white rounded-2xl border border-slate-200 p-3 shadow-sm cursor-pointer"
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-extrabold text-[#0f2b3c]">
                      {String(d).padStart(2, '0')} {MONTH_NAMES[month].slice(0, 3)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{items.length}</span>
                  </div>
                  <div className="space-y-1">
                    {items.slice(0, 3).map((it) => (
                      <EventPill key={it.id} item={it} />
                    ))}
                    {items.length === 0 && (
                      <p className="text-[10px] text-slate-400">No items</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* DAY list inline hint when day selected without sheet — sheet handles detail */}
        {view === 'day' && !daySheetOpen && (
          <button
            type="button"
            onClick={() => setDaySheetOpen(true)}
            className="w-full py-3 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#0f2b3c] cursor-pointer"
          >
            Open readiness for {String(selectedDay).padStart(2, '0')} {MONTH_NAMES[month]}
          </button>
        )}
      </div>

      {/* ========== SIDE DRAWER: Quick Dates + Filters ========== */}
      <div
        className={`fixed inset-0 z-50 ${drawerOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 bg-slate-900/40 transition-opacity duration-300 cursor-pointer ${
            drawerOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <aside
          className={`absolute top-0 left-0 h-full w-[min(92vw,340px)] bg-[#f7f8fa] shadow-2xl flex flex-col transition-transform duration-300 ease-out rounded-r-3xl overflow-hidden ${
            drawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
            {/* Quick Dates card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Quick Dates
                </span>
                <span className="text-xs font-bold text-[#3b6ea5]">
                  {MONTH_NAMES[month].slice(0, 3)} {year}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-extrabold text-[#0f2b3c]">
                  {MONTH_NAMES[month]} {year}
                </h3>
                <div className="flex gap-0.5">
                  <button
                    type="button"
                    onClick={() => shiftMonth(-1)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-500" />
                  </button>
                  <button
                    type="button"
                    onClick={() => shiftMonth(1)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 text-center mb-1">
                {WEEKDAYS_S.map((d, i) => (
                  <span key={`${d}-${i}`} className="text-[10px] font-bold text-slate-400 py-1">
                    {d}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-1">
                {Array.from({ length: offset }).map((_, i) => {
                  const d = prevDays - offset + i + 1;
                  return (
                    <span
                      key={`pd-${i}`}
                      className="text-[11px] font-semibold text-slate-300 py-1.5 text-center"
                    >
                      {d}
                    </span>
                  );
                })}
                {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => {
                  const dots = (byDay[d] || []).slice(0, 3);
                  const sel = d === selectedDay;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setSelectedDay(d);
                      }}
                      className="relative flex flex-col items-center py-0.5 cursor-pointer"
                    >
                      <span
                        className={`w-7 h-7 flex items-center justify-center text-[11px] font-bold rounded-lg ${
                          sel
                            ? 'border-2 border-[#0f2b3c] text-[#0f2b3c]'
                            : 'text-slate-700'
                        }`}
                      >
                        {d}
                      </span>
                      {dots.length > 0 && (
                        <span className="flex gap-0.5 mt-0.5">
                          {dots.map((it) => (
                            <span
                              key={it.id}
                              className={`w-1 h-1 rounded-full ${modOf(it.module).dot}`}
                            />
                          ))}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filters card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Filters
                  </p>
                  <p className="text-sm font-extrabold text-[#0f2b3c]">Modules</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFilters(
                      allSelected
                        ? {
                            cro_received: false,
                            cro_applied: false,
                            cro_not: false,
                            fcl: false,
                            console: false,
                          }
                        : ALL_ON
                    )
                  }
                  className="text-[11px] font-semibold text-slate-600 cursor-pointer"
                >
                  {allSelected ? 'Unselect all' : 'Select all'}
                </button>
              </div>

              <div className="space-y-2 max-h-[42vh] overflow-y-auto pr-0.5">
                {MODULES.map((m) => {
                  const count = ITEMS.filter((i) => i.module === m.key).length;
                  return (
                    <label
                      key={m.key}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer"
                    >
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${m.dot}`} />
                      <span className="text-xs font-semibold text-slate-800 flex-1">
                        {m.label}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-200/70 text-slate-600">
                        {count}
                      </span>
                      <input
                        type="checkbox"
                        checked={filters[m.key]}
                        onChange={() =>
                          setFilters((f) => ({ ...f, [m.key]: !f[m.key] }))
                        }
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-3.5 border-t border-slate-200 bg-white shrink-0">
            <button
              type="button"
              onClick={() => {
                setDrawerOpen(false);
                onShowSnackBar?.('Filters applied', 'success');
              }}
              className="w-full py-3 rounded-xl bg-[#0f2b3c] text-white text-xs font-extrabold cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </aside>
      </div>

      {/* ========== DAY DETAIL SHEET (Readiness cards) ========== */}
      <div
        className={`fixed inset-0 z-[60] ${daySheetOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        <button
          type="button"
          aria-label="Close readiness"
          onClick={() => {
            setDaySheetOpen(false);
            setView('month');
          }}
          className={`absolute inset-0 bg-slate-900/35 transition-opacity duration-300 cursor-pointer ${
            daySheetOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute inset-x-0 bottom-0 max-h-[88vh] bg-[#f4f6f8] rounded-t-3xl shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
            daySheetOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="px-4 pt-4 pb-2 flex items-start gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setDaySheetOpen(false);
                setView('month');
              }}
              className="p-1.5 rounded-lg hover:bg-slate-200/60 cursor-pointer text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Readiness
              </p>
              <h2 className="text-base font-extrabold text-[#0f2b3c] leading-snug">
                {weekdayName(year, month, selectedDay)}
              </h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-4">
            {sheetItems.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-400">
                No readiness items for this day
              </div>
            ) : (
              (() => {
                // group by module for section headers like image
                const groups = MODULES.map((m) => ({
                  ...m,
                  items: sheetItems.filter((i) => i.module === m.key),
                })).filter((g) => g.items.length > 0);

                return groups.map((g) => (
                  <div
                    key={g.key}
                    className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {g.label}
                      </p>
                      <span className="w-5 h-5 rounded-full bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {g.items.length}
                      </span>
                    </div>

                    <div className="relative pl-4 space-y-3">
                      <div className="absolute left-[5px] top-2 bottom-2 w-px bg-slate-200" />
                      {g.items.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            onShowSnackBar?.(`${item.code} · ${item.title}`, 'info')
                          }
                          className="relative w-full text-left cursor-pointer"
                        >
                          <span
                            className={`absolute -left-4 top-2 w-2.5 h-2.5 rounded-full border-2 bg-white ${
                              item.module === 'cro_not'
                                ? 'border-rose-400'
                                : item.module === 'cro_applied'
                                ? 'border-orange-400'
                                : item.module === 'cro_received'
                                ? 'border-emerald-500'
                                : 'border-sky-400'
                            }`}
                          />
                          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-[0_1px_4px_rgba(15,43,60,0.04)]">
                            <p className="text-xs font-extrabold text-slate-900">
                              {item.code} - {item.title}
                            </p>
                            <span
                              className={`inline-flex mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${g.pillBg} ${g.pillText}`}
                            >
                              {g.label}
                            </span>
                            <p className="mt-2 text-[11px] text-slate-500">
                              Proforma: {item.proforma}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              Requisition: {item.requisition}
                            </p>
                            <span className="inline-flex items-center gap-1.5 mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {item.shipType}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ));
              })()
            )}

            {dayItems.length > 3 && sheetModule === 'all' && (
              <button
                type="button"
                onClick={() => onShowSnackBar?.('Showing all readiness items', 'info')}
                className="mx-auto block px-3 py-1.5 rounded-lg bg-slate-900 text-white text-[10px] font-bold cursor-pointer"
              >
                Show all
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  LayoutGrid,
  Rows3,
  Filter,
  Settings2,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  Pencil,
  Printer,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export type ListViewMode = 'grid' | 'card';

/* ------------------------------------------------------------------ */
/* Status Pill                                                         */
/* ------------------------------------------------------------------ */

type PillTone = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'muted';

const TONE_MAP: Record<PillTone, { light: string; dark: string; dot: string }> = {
  success: {
    light: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dark: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    dot: 'bg-emerald-500',
  },
  danger: {
    light: 'bg-rose-50 text-rose-700 border-rose-200/80',
    dark: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    dot: 'bg-rose-500',
  },
  warning: {
    light: 'bg-amber-50 text-amber-800 border-amber-200/80',
    dark: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    dot: 'bg-amber-500',
  },
  info: {
    light: 'bg-sky-50 text-sky-700 border-sky-200/80',
    dark: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    dot: 'bg-sky-500',
  },
  neutral: {
    light: 'bg-slate-100 text-slate-700 border-slate-200',
    dark: 'bg-slate-800/80 text-slate-300 border-slate-700',
    dot: 'bg-slate-400',
  },
  muted: {
    light: 'bg-violet-50 text-violet-700 border-violet-200/80',
    dark: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    dot: 'bg-violet-400',
  },
};

export function resolveStatusTone(status: string): PillTone {
  const s = (status ?? '').toLowerCase();
  if (
    ['active', 'approved', 'confirmed', 'posted', 'approved / posted', 'yes', 'fully settled', 'accepted', 'paid'].some(
      (k) => s.includes(k)
    )
  )
    return 'success';
  if (['inactive', 'rejected', 'no', 'cancelled', 'discontinued'].some((k) => s.includes(k)))
    return 'danger';
  if (['pending', 'awaiting', 'under review', 'draft', 'low stock'].some((k) => s.includes(k)))
    return 'warning';
  if (['initiated', 'in process', 'r&d', 'sent', 'partial'].some((k) => s.includes(k))) return 'info';
  return 'neutral';
}

export const StatusPill: React.FC<{ status: string; className?: string }> = ({
  status,
  className = '',
}) => {
  const { isDark } = useTheme();
  const tone = resolveStatusTone(status);
  const colors = TONE_MAP[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${
        isDark ? colors.dark : colors.light
      } ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`} />
      {status || '—'}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Field helpers                                                       */
/* ------------------------------------------------------------------ */

export const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isDark } = useTheme();
  return (
    <span
      className={`text-[10px] font-semibold uppercase tracking-wider ${
        isDark ? 'text-slate-500' : 'text-slate-400'
      }`}
    >
      {children}
    </span>
  );
};

export const FieldValue: React.FC<{ children: React.ReactNode; mono?: boolean; accent?: boolean }> = ({
  children,
  mono,
  accent,
}) => {
  const { isDark } = useTheme();
  return (
    <span
      className={`text-xs sm:text-sm font-semibold break-words ${mono ? 'font-mono' : ''} ${
        accent
          ? isDark
            ? 'text-teal-300'
            : 'text-teal-700'
          : isDark
          ? 'text-slate-100'
          : 'text-slate-900'
      }`}
    >
      {children ?? '—'}
    </span>
  );
};

export const InfoField: React.FC<{
  label: string;
  value?: React.ReactNode;
  mono?: boolean;
  accent?: boolean;
}> = ({ label, value, mono, accent }) => (
  <div className="min-w-0 space-y-0.5">
    <FieldLabel>{label}</FieldLabel>
    <div>
      {typeof value === 'string' || typeof value === 'number' || value == null ? (
        <FieldValue mono={mono} accent={accent}>
          {value === '' || value == null ? '—' : value}
        </FieldValue>
      ) : (
        value
      )}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* View mode toggle                                                    */
/* ------------------------------------------------------------------ */

export const ViewModeToggle: React.FC<{
  viewMode: ListViewMode;
  onChange: (mode: ListViewMode) => void;
}> = ({ viewMode, onChange }) => {
  const { isDark } = useTheme();
  return (
    <div
      className={`inline-flex rounded-xl p-0.5 border ${
        isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-slate-100 border-slate-200'
      }`}
    >
      <button
        type="button"
        onClick={() => onChange('grid')}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
          viewMode === 'grid'
            ? isDark
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-white text-slate-900 shadow-sm'
            : isDark
            ? 'text-slate-400 hover:text-slate-200'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Rows3 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Grid</span>
      </button>
      <button
        type="button"
        onClick={() => onChange('card')}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
          viewMode === 'card'
            ? isDark
              ? 'bg-teal-600 text-white shadow-sm'
              : 'bg-white text-slate-900 shadow-sm'
            : isDark
            ? 'text-slate-400 hover:text-slate-200'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Card</span>
      </button>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* List toolbar                                                        */
/* ------------------------------------------------------------------ */

export const ListToolbar: React.FC<{
  viewMode: ListViewMode;
  onViewModeChange: (mode: ListViewMode) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchPlaceholder?: string;
  onFilterClick?: () => void;
  onColumnsClick?: () => void;
  trailing?: React.ReactNode;
}> = ({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search records…',
  onFilterClick,
  onColumnsClick,
  trailing,
}) => {
  const { isDark } = useTheme();
  const btn =
    isDark
      ? 'bg-[#111726] border-slate-700 text-slate-200 hover:bg-slate-800'
      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <ViewModeToggle viewMode={viewMode} onChange={onViewModeChange} />
        <button
          type="button"
          onClick={onFilterClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-xl border transition-colors cursor-pointer ${
            isDark
              ? 'bg-teal-600 border-teal-500 text-white hover:bg-teal-500'
              : 'bg-[#0f2b3c] border-[#0f2b3c] text-white hover:bg-[#163a50]'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          Filters
        </button>
        <button
          type="button"
          onClick={onColumnsClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-xl border transition-colors cursor-pointer ${btn}`}
        >
          <Settings2 className="w-3.5 h-3.5" />
          Columns
        </button>
        {trailing}
      </div>

      <div className="relative flex-1 min-w-[160px]">
        <Search
          className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`}
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none transition-shadow focus:ring-2 ${
            isDark
              ? 'bg-[#0d1322] border-slate-700 text-slate-100 placeholder:text-slate-500 focus:ring-teal-500/30 focus:border-teal-500'
              : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-teal-600/15 focus:border-teal-600'
          }`}
        />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Pagination                                                          */
/* ------------------------------------------------------------------ */

export const ListPagination: React.FC<{
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}> = ({ page, pageSize, total, onPageChange, onPageSizeChange }) => {
  const { isDark } = useTheme();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const pages = useMemo(() => {
    const items: (number | '…')[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
      return items;
    }
    items.push(1);
    if (page > 3) items.push('…');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      items.push(i);
    }
    if (page < totalPages - 2) items.push('…');
    items.push(totalPages);
    return items;
  }, [page, totalPages]);

  const chip = isDark
    ? 'bg-[#111726] border-slate-700 text-slate-300 hover:bg-slate-800'
    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50';
  const active = isDark
    ? 'bg-teal-600 border-teal-500 text-white'
    : 'bg-[#0f2b3c] border-[#0f2b3c] text-white';

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t ${
        isDark ? 'border-slate-800' : 'border-slate-100'
      }`}
    >
      <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        Showing {from} to {to} of {total} records
      </p>
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={`p-1.5 rounded-lg border disabled:opacity-40 cursor-pointer ${chip}`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pages.map((p, idx) =>
          p === '…' ? (
            <span key={`e-${idx}`} className="px-1 text-xs text-slate-400">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`min-w-8 h-8 px-2 rounded-lg border text-xs font-bold cursor-pointer ${
                p === page ? active : chip
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={`p-1.5 rounded-lg border disabled:opacity-40 cursor-pointer ${chip}`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className={`ml-1 text-[11px] font-semibold rounded-lg border px-2 py-1.5 cursor-pointer outline-none ${chip}`}
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Record Card                                                         */
/* ------------------------------------------------------------------ */

export const RecordCard: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  code?: string;
  status?: string;
  badges?: React.ReactNode;
  fields?: { label: string; value: React.ReactNode }[];
  footer?: React.ReactNode;
  onClick?: () => void;
  actions?: { label: string; onClick: () => void; icon?: 'view' | 'edit' | 'print' }[];
}> = ({ title, subtitle, code, status, badges, fields, footer, onClick, actions }) => {
  const { isDark } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl sm:rounded-3xl border p-4 transition-all cursor-pointer select-none active:scale-[0.99] ${
        isDark
          ? 'bg-[#101a27] border-slate-800/90 hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-950/20'
          : 'bg-white border-white shadow-[0_8px_28px_rgba(15,43,60,0.06)] hover:shadow-[0_12px_36px_rgba(15,43,60,0.1)] hover:border-teal-200/60'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            {code && (
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                  isDark ? 'bg-teal-500/15 text-teal-300' : 'bg-teal-50 text-teal-800'
                }`}
              >
                {code}
              </span>
            )}
            {status && <StatusPill status={status} />}
            {badges}
          </div>
          <h3
            className={`text-sm font-bold leading-snug line-clamp-2 ${
              isDark ? 'text-slate-100' : 'text-slate-900'
            }`}
          >
            {title}
          </h3>
          {subtitle && (
            <p className={`text-[11px] line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {subtitle}
            </p>
          )}
        </div>

        {actions && actions.length > 0 && (
          <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className={`p-1.5 rounded-lg cursor-pointer ${
                isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-400'
              }`}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {menuOpen && (
              <div
                className={`absolute right-0 top-8 z-20 w-36 rounded-xl border shadow-xl py-1 text-xs ${
                  isDark
                    ? 'bg-[#151c2f] border-slate-700 text-slate-200'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                {actions.map((a) => (
                  <button
                    key={a.label}
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      a.onClick();
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-left cursor-pointer ${
                      isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'
                    }`}
                  >
                    {a.icon === 'edit' ? (
                      <Pencil className="w-3.5 h-3.5 text-slate-400" />
                    ) : a.icon === 'print' ? (
                      <Printer className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <Eye className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    {a.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {fields && fields.length > 0 && (
        <div
          className={`grid grid-cols-2 gap-x-3 gap-y-2.5 pt-3 border-t ${
            isDark ? 'border-slate-800' : 'border-slate-100'
          }`}
        >
          {fields.map((f) => (
            <InfoField key={f.label} label={f.label} value={f.value} />
          ))}
        </div>
      )}

      {footer && (
        <div
          className={`mt-3 pt-2.5 border-t text-[11px] ${
            isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
          }`}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Responsive card grid                                                */
/* ------------------------------------------------------------------ */

export const CardGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">{children}</div>
);

/* ------------------------------------------------------------------ */
/* Data table (grid view)                                              */
/* ------------------------------------------------------------------ */

export const DataTable: React.FC<{
  headers: string[];
  children: React.ReactNode;
}> = ({ headers, children }) => {
  const { isDark } = useTheme();
  return (
    <div
      className={`rounded-2xl border overflow-hidden ${
        isDark ? 'border-slate-800 bg-[#0d1322]' : 'border-slate-200 bg-white'
      }`}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr
              className={`border-b ${
                isDark ? 'border-slate-800 bg-[#111726]' : 'border-slate-100 bg-slate-50/80'
              }`}
            >
              {headers.map((h) => (
                <th
                  key={h}
                  className={`px-3.5 py-3 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={isDark ? 'divide-y divide-slate-800/80' : 'divide-y divide-slate-100'}>
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const DataRow: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ children, onClick }) => {
  const { isDark } = useTheme();
  return (
    <tr
      onClick={onClick}
      className={`cursor-pointer transition-colors ${
        isDark ? 'hover:bg-slate-800/40' : 'hover:bg-teal-50/40'
      }`}
    >
      {children}
    </tr>
  );
};

export const Td: React.FC<{
  children: React.ReactNode;
  mono?: boolean;
  accent?: boolean;
  className?: string;
}> = ({ children, mono, accent, className = '' }) => {
  const { isDark } = useTheme();
  return (
    <td
      className={`px-3.5 py-3 text-xs align-middle ${mono ? 'font-mono' : ''} ${
        accent
          ? isDark
            ? 'text-teal-300 font-semibold'
            : 'text-teal-700 font-semibold'
          : isDark
          ? 'text-slate-200'
          : 'text-slate-700'
      } ${className}`}
    >
      {children}
    </td>
  );
};

/* ------------------------------------------------------------------ */
/* Detail section shell                                                */
/* ------------------------------------------------------------------ */

export const DetailSection: React.FC<{
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}> = ({ title, children, action }) => {
  const { isDark } = useTheme();
  return (
    <div
      className={`rounded-2xl border overflow-hidden ${
        isDark ? 'border-slate-800 bg-[#111726]' : 'border-slate-200 bg-white'
      }`}
    >
      <div
        className={`px-4 py-2.5 flex items-center justify-between border-b ${
          isDark
            ? 'bg-teal-950/40 border-slate-800 text-teal-200'
            : 'bg-[#e8f4f7] border-slate-100 text-[#0f2b3c]'
        }`}
      >
        <h3 className="text-xs font-bold tracking-wide uppercase">{title}</h3>
        {action}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
};

export const DetailFieldGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{children}</div>
);

/* ------------------------------------------------------------------ */
/* Pagination helper hook                                              */
/* ------------------------------------------------------------------ */

export function usePagedList<T>(items: T[], initialPageSize = 10) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const setSize = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const resetPage = () => setPage(1);

  return { page, setPage, pageSize, setPageSize: setSize, paged, total: items.length, resetPage };
}

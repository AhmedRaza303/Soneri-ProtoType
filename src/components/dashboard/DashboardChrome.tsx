/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Shared mobile dashboard chrome — Soneri navy / teal
 */

import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';

export type DashCriteria = {
  /** Optional line above the title (e.g. quotations age note) */
  eyebrow?: string;
  /** Header label — default "Criteria" */
  title?: string;
  items?: string[];
  description?: string;
  /** Dark slate bubble (e.g. Delayed Orders) vs white/tinted card */
  variant?: 'card' | 'dark';
  /** Optional soft background tint on card variant */
  tintClassName?: string;
};

/** Criteria / status disclaimer popover triggered by the (i) icon */
export const DashCriteriaTip: React.FC<{
  criteria: DashCriteria;
  accentColor?: string;
  className?: string;
}> = ({ criteria, accentColor = '#0f2b3c', className = '' }) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const tipId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDark = criteria.variant === 'dark';
  const title = criteria.title ?? (isDark ? undefined : 'Criteria');
  const items = criteria.items ?? [];

  const clearClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    clearClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  const updatePosition = useCallback(() => {
    const btn = wrapRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const tipH = tipRef.current?.offsetHeight ?? 120;
    const tipW = tipRef.current?.offsetWidth ?? 260;
    const gap = 10;
    let top = rect.top - tipH - gap;
    let left = rect.left + rect.width / 2 - tipW / 2;
    const pad = 8;
    left = Math.max(pad, Math.min(left, window.innerWidth - tipW - pad));
    if (top < pad) top = rect.bottom + gap;
    setCoords({ top, left });
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }
    updatePosition();
    const id = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(id);
  }, [open, updatePosition, items.length, criteria.description, title]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node;
      if (wrapRef.current?.contains(t) || tipRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onReposition = () => updatePosition();
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('touchstart', onDoc);
    window.addEventListener('scroll', onReposition, true);
    window.addEventListener('resize', onReposition);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('touchstart', onDoc);
      window.removeEventListener('scroll', onReposition, true);
      window.removeEventListener('resize', onReposition);
    };
  }, [open, updatePosition]);

  useEffect(() => () => clearClose(), []);

  const tipBody =
    open && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={tipRef}
            id={tipId}
            role="tooltip"
            className={`fixed z-[9999] ${
              isDark ? 'w-[min(18rem,calc(100vw-1rem))]' : 'w-[min(16.5rem,calc(100vw-1rem))]'
            }`}
            style={{
              top: coords?.top ?? -9999,
              left: coords?.left ?? -9999,
              visibility: coords ? 'visible' : 'hidden',
            }}
            onMouseEnter={() => {
              clearClose();
              setOpen(true);
            }}
            onMouseLeave={scheduleClose}
          >
            {isDark ? (
              <div className="relative rounded-xl bg-slate-900 text-white shadow-xl px-3 py-2.5 text-left">
                <p className="text-caption leading-relaxed font-medium text-white/95">
                  {criteria.description}
                </p>
              </div>
            ) : (
              <div
                className={`relative rounded-xl border border-slate-200 shadow-lg px-3.5 py-3 text-left ${
                  criteria.tintClassName ?? 'bg-white'
                }`}
              >
                {criteria.eyebrow && (
                  <p className="text-body-sm font-extrabold text-[#0f2b3c] mb-1">
                    {criteria.eyebrow}
                  </p>
                )}
                {title && (
                  <p
                    className={`text-body-sm font-extrabold text-[#0f2b3c] ${
                      criteria.eyebrow ? 'mb-1.5' : 'mb-1.5'
                    }`}
                  >
                    {title}
                  </p>
                )}
                {items.length > 0 && (
                  <ul className={`space-y-1 ${criteria.description ? 'mb-2' : ''}`}>
                    {items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-body-sm font-medium text-slate-700"
                      >
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: accentColor }}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {criteria.description && (
                  <>
                    {items.length > 0 && <div className="border-t border-slate-200/80 mb-2" />}
                    <p className="text-caption text-slate-500 leading-snug italic">
                      {criteria.description}
                    </p>
                  </>
                )}
              </div>
            )}
          </div>,
          document.body
        )
      : null;

  return (
    <div
      ref={wrapRef}
      className={`relative inline-flex items-center shrink-0 ${className}`}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        aria-label={title ?? 'Info'}
        aria-expanded={open}
        aria-controls={tipId}
        onClick={() => {
          clearClose();
          setOpen((v) => !v);
        }}
        onMouseEnter={() => {
          clearClose();
          setOpen(true);
        }}
        onMouseLeave={scheduleClose}
        className="p-0.5 rounded-full transition-colors cursor-pointer"
        style={{ color: accentColor }}
      >
        <Info className="w-3.5 h-3.5" strokeWidth={2.25} />
      </button>
      {tipBody}
    </div>
  );
};

export const DashHero: React.FC<{
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  accent?: 'navy' | 'teal' | 'sky' | 'violet' | 'amber';
  children?: React.ReactNode;
}> = ({ eyebrow, title, subtitle, accent = 'navy', children }) => {
  const gradients = {
    navy: 'from-[#0f2b3c] via-[#163a50] to-[#1a4d5c]',
    teal: 'from-[#0f766e] via-[#0d9488] to-[#14b8a6]',
    sky: 'from-[#075985] via-[#0284c7] to-[#0ea5e9]',
    violet: 'from-[#4c1d95] via-[#6d28d9] to-[#7c3aed]',
    amber: 'from-[#92400e] via-[#b45309] to-[#d97706]',
  };
  const hasHeader = Boolean(eyebrow || title || subtitle);
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradients[accent]} p-4 text-white shadow-lg`}>
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -left-6 bottom-0 w-24 h-24 rounded-full bg-teal-300/10 blur-xl" />
      {eyebrow && (
        <p className="text-label font-bold uppercase tracking-[0.16em] text-white/60 relative">{eyebrow}</p>
      )}
      {title && <h2 className="text-xl font-black tracking-tight mt-1 relative">{title}</h2>}
      {subtitle && <p className="text-body-sm text-white/70 mt-1 relative leading-snug">{subtitle}</p>}
      {children && <div className={`${hasHeader ? 'mt-3' : ''} relative`}>{children}</div>}
    </div>
  );
};

export const DashKpi: React.FC<{
  label: string;
  value: string | number;
  hint?: string;
  tone?: 'default' | 'rose' | 'teal' | 'amber' | 'sky';
}> = ({ label, value, hint, tone = 'default' }) => {
  const tones = {
    default: { bar: '#0f2b3c', icon: '#0f2b3c' },
    rose: { bar: '#f43f5e', icon: '#e11d48' },
    teal: { bar: '#14b8a6', icon: '#0d9488' },
    amber: { bar: '#f59e0b', icon: '#d97706' },
    sky: { bar: '#0ea5e9', icon: '#0284c7' },
  };
  const t = tones[tone];
  return (
    <DashMetricCard
      label={label}
      value={value}
      subtitle={hint}
      color={t.icon}
      accentColor={t.bar}
      icon={<span className="w-2 h-2 rounded-full bg-white/90" />}
    />
  );
};

/** Overview-style metric card — use on every dashboard for a consistent look */
export const DashMetricCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  accentColor?: string;
  subtitle?: React.ReactNode;
  criteria?: DashCriteria;
  valueClassName?: string;
  className?: string;
  onClick?: () => void;
}> = ({
  label,
  value,
  icon,
  color,
  accentColor,
  subtitle,
  criteria,
  valueClassName,
  className = '',
  onClick,
}) => {
  const accent = accentColor ?? color;
  const shared = `group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition-all w-full ${className}`;
  const body = (
    <>
      <div
        className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl"
        style={{ backgroundColor: accent }}
      />
      <div
        className="pointer-events-none absolute -right-8 -top-10 h-24 w-24 rounded-full"
        style={{ backgroundColor: `${color}12` }}
      />
      <div
        className="pointer-events-none absolute -bottom-10 -right-7 h-20 w-20 rounded-full"
        style={{ backgroundColor: `${color}08` }}
      />
      <div
        className="absolute right-2.5 top-3 z-[1] flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md transition-transform group-active:scale-95 [&_svg]:!text-white"
        style={{
          backgroundColor: color,
          boxShadow: `0 5px 12px ${color}30`,
        }}
      >
        {icon}
      </div>
      <div className="relative z-[1] min-w-0 pr-10">
        <div className="flex items-start gap-1">
          <p className="text-[9px] font-extrabold leading-[1.3] text-[#0f2b3c] break-words [overflow-wrap:anywhere]">
            {label}
          </p>
          {criteria && (
            <DashCriteriaTip
              criteria={criteria}
              accentColor={accent}
              className="mt-px shrink-0"
            />
          )}
        </div>
        <p
          className={`mt-1.5 text-[15px] font-black leading-none tabular-nums text-[#0f2b3c] ${valueClassName ?? ''}`}
        >
          {value}
        </p>
      </div>
      {subtitle ? (
        typeof subtitle === 'string' ? (
          <p className="relative z-[1] mt-2 block border-t border-slate-100 pt-1.5 text-[8px] font-medium leading-[1.35] text-slate-500 break-words [overflow-wrap:anywhere]">
            {subtitle}
          </p>
        ) : (
          <div className="relative z-[1] mt-2 min-w-0 border-t border-slate-100 pt-1.5">
            {subtitle}
          </div>
        )
      ) : null}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${shared} active:scale-[0.98] active:shadow-xs cursor-pointer`}
      >
        {body}
      </button>
    );
  }

  return <div className={shared}>{body}</div>;
};

export const DashMetricGrid: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`grid grid-cols-2 gap-3 ${className}`}>{children}</div>;

export const DashSection: React.FC<{
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, action, children }) => (
  <section className="space-y-2.5">
    <div className="flex items-center justify-between gap-2 px-0.5">
      <h3 className="text-label font-extrabold uppercase tracking-[0.12em] text-[#0f2b3c]">{title}</h3>
      {action}
    </div>
    {children}
  </section>
);

export const DashTaskTile: React.FC<{
  title: string;
  subtitle?: string;
  value?: string | number;
  icon: React.ReactNode;
  iconBg?: string;
  onClick?: () => void;
}> = ({ title, subtitle, value, icon, iconBg = 'bg-slate-100', onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full text-left bg-white rounded-2xl border border-slate-200 p-3 shadow-sm active:scale-[0.99] transition-transform cursor-pointer"
  >
    <div className="flex items-start gap-3">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-white/60 ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-label font-extrabold text-[#0f2b3c] leading-snug line-clamp-2">{title}</p>
        {subtitle && <p className="text-caption text-slate-500 mt-0.5 line-clamp-1">{subtitle}</p>}
      </div>
      {value !== undefined && (
        <span className="text-metric font-black tabular-nums text-[#0f2b3c] shrink-0">{value}</span>
      )}
    </div>
  </button>
);

export const DashShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="dash-type md:hidden space-y-3.5 pb-2">{children}</div>
);

export const DashPill: React.FC<{
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}> = ({ children, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`shrink-0 px-3 py-1.5 rounded-full text-label font-bold cursor-pointer transition-colors ${
      active ? 'bg-[#0f2b3c] text-white' : 'bg-white text-slate-600 border border-slate-200'
    }`}
  >
    {children}
  </button>
);

export const DashListCard: React.FC<{
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  meta?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  open?: boolean;
}> = ({ title, subtitle, badge, meta, children, onClick, open }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
    <button type="button" onClick={onClick} className="w-full text-left p-3.5 cursor-pointer">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-body-sm font-extrabold text-[#0f2b3c] truncate">{title}</p>
          {subtitle && <p className="text-caption text-slate-500 mt-0.5 truncate">{subtitle}</p>}
        </div>
        {badge}
      </div>
      {meta && <div className="mt-2.5">{meta}</div>}
    </button>
    {open && children && <div className="border-t border-slate-100 bg-slate-50/70 p-3 space-y-2">{children}</div>}
  </div>
);

/** Horizontal scroll row with side arrows when more tabs exist */
export const DashScrollRow: React.FC<{
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  dark?: boolean;
}> = ({ children, className = '', contentClassName = '', dark = false }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(maxScroll > 4 && el.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateArrows) : null;
    ro?.observe(el);
    window.addEventListener('resize', updateArrows);
    return () => {
      el.removeEventListener('scroll', updateArrows);
      ro?.disconnect();
      window.removeEventListener('resize', updateArrows);
    };
  }, [updateArrows, children]);

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(120, el.clientWidth * 0.55), behavior: 'smooth' });
  };

  const arrowBtn = (side: 'left' | 'right', enabled: boolean) => (
    <button
      type="button"
      aria-label={side === 'left' ? 'Scroll tabs left' : 'Scroll tabs right'}
      disabled={!enabled}
      onClick={() => scrollBy(side === 'left' ? -1 : 1)}
      className={`absolute top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full flex items-center justify-center border shadow-sm transition-all cursor-pointer ${
        side === 'left' ? 'left-0' : 'right-0'
      } ${
        enabled
          ? dark
            ? 'bg-slate-800 border-slate-600 text-white hover:bg-slate-700'
            : 'bg-white border-slate-200 text-[#0f2b3c] hover:bg-slate-50'
          : 'opacity-0 pointer-events-none'
      }`}
    >
      {side === 'left' ? (
        <ChevronLeft className="w-4 h-4" />
      ) : (
        <ChevronRight className="w-4 h-4" />
      )}
    </button>
  );

  return (
    <div className={`relative ${className}`}>
      {arrowBtn('left', canLeft)}
      {arrowBtn('right', canRight)}
      {canLeft && (
        <div
          className={`pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-[5] ${
            dark
              ? 'bg-gradient-to-r from-[#0b101e] to-transparent'
              : 'bg-gradient-to-r from-white to-transparent'
          }`}
        />
      )}
      {canRight && (
        <div
          className={`pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-[5] ${
            dark
              ? 'bg-gradient-to-l from-[#0b101e] to-transparent'
              : 'bg-gradient-to-l from-white to-transparent'
          }`}
        />
      )}
      <div
        ref={scrollerRef}
        className={`flex items-center gap-1.5 overflow-x-auto scrollbar-none scroll-smooth px-7 ${contentClassName}`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </div>
  );
};


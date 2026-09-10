/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Shared mobile dashboard chrome — Soneri navy / teal
 */

import React from 'react';

export const DashHero: React.FC<{
  eyebrow: string;
  title: string;
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
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradients[accent]} p-4 text-white shadow-lg`}>
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -left-6 bottom-0 w-24 h-24 rounded-full bg-teal-300/10 blur-xl" />
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/60 relative">{eyebrow}</p>
      <h2 className="text-xl font-black tracking-tight mt-1 relative">{title}</h2>
      {subtitle && <p className="text-[11px] text-white/70 mt-1 relative leading-snug">{subtitle}</p>}
      {children && <div className="mt-3 relative">{children}</div>}
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
    default: 'bg-white border-slate-200 text-[#0f2b3c]',
    rose: 'bg-rose-50 border-rose-200 text-rose-700',
    teal: 'bg-teal-50 border-teal-200 text-teal-800',
    amber: 'bg-amber-50 border-amber-200 text-amber-800',
    sky: 'bg-sky-50 border-sky-200 text-sky-800',
  };
  return (
    <div className={`rounded-2xl border p-3 shadow-sm ${tones[tone]}`}>
      <p className="text-[9px] font-bold uppercase tracking-wider opacity-60">{label}</p>
      <p className="text-xl font-black tabular-nums mt-1 leading-none">{value}</p>
      {hint && <p className="text-[10px] font-semibold opacity-50 mt-1.5 line-clamp-1">{hint}</p>}
    </div>
  );
};

export const DashSection: React.FC<{
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, action, children }) => (
  <section className="space-y-2.5">
    <div className="flex items-center justify-between gap-2 px-0.5">
      <h3 className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#0f2b3c]">{title}</h3>
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
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/60 ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-extrabold text-[#0f2b3c] leading-snug line-clamp-2">{title}</p>
        {subtitle && <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{subtitle}</p>}
      </div>
      {value !== undefined && (
        <span className="text-lg font-black tabular-nums text-[#0f2b3c] shrink-0">{value}</span>
      )}
    </div>
  </button>
);

export const DashShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="md:hidden space-y-3.5 pb-2">{children}</div>
);

export const DashPill: React.FC<{
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}> = ({ children, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
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
          <p className="text-[12px] font-extrabold text-[#0f2b3c] truncate">{title}</p>
          {subtitle && <p className="text-[10px] text-slate-500 mt-0.5 truncate">{subtitle}</p>}
        </div>
        {badge}
      </div>
      {meta && <div className="mt-2.5">{meta}</div>}
    </button>
    {open && children && <div className="border-t border-slate-100 bg-slate-50/70 p-3 space-y-2">{children}</div>}
  </div>
);

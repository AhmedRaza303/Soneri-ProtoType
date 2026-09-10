/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Users,
  Sliders,
  ChevronRight,
  ShieldCheck,
  Shield,
  Coins,
  Network,
  Calculator,
  ArrowLeft,
} from 'lucide-react';
import { AppBar } from '../components/common/AppBar';
import { ScreenId } from '../types';

interface AdminModuleScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onBack: () => void;
  usersCount: number;
  valuesCount: number;
}

export const AdminModuleScreen: React.FC<AdminModuleScreenProps> = ({
  onNavigate,
  onBack,
  usersCount,
  valuesCount,
}) => {
  return (
    <div className="min-h-full pb-24 bg-slate-50/60">
      <AppBar
        title="Administrator"
        subtitle="Manage users and system values"
        showBack
        onBack={onBack}
      />

      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
        {/* Module Header Banner */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-snug">
              System Administration
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Configure enterprise access credentials and system-wide lookup masters.
            </p>
          </div>
        </div>

        {/* Section Heading */}
        <div className="space-y-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-0.5">
            Admin Workstreams
          </h3>
        </div>

        {/* Two Premium Functional Cards */}
        <div className="space-y-3.5">
          {/* 1. Users Card */}
          <div
            id="admin-card-users"
            onClick={() => onNavigate('admin_users')}
            className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:bg-slate-800 transition-colors">
                <Users className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900 leading-tight">
                    Users
                  </h4>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {usersCount} Accounts
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Add, modify and manage system users
                </p>
              </div>
            </div>

            <div className="p-2 rounded-full text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all shrink-0">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>

          {/* 2. Manage Values Card */}
          <div
            id="admin-card-values"
            onClick={() => onNavigate('admin_values')}
            className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:bg-slate-800 transition-colors">
                <Sliders className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900 leading-tight">
                    Manage Values
                  </h4>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {valuesCount} Masters
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Manage system master values
                </p>
              </div>
            </div>

            <div className="p-2 rounded-full text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all shrink-0">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>

          {/* 3. User Authorization Card */}
          <div
            id="admin-card-user-auth"
            onClick={() => onNavigate('admin_user_auth')}
            className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:bg-slate-800 transition-colors">
                <Shield className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900 leading-tight">
                    User Authorization
                  </h4>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    RBAC Matrix
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Module authorization and fine-grained permissions
                </p>
              </div>
            </div>

            <div className="p-2 rounded-full text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all shrink-0">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>

          {/* 4. Exchange Rate Card */}
          <div
            id="admin-card-exchange-rate"
            onClick={() => onNavigate('admin_exchange_rate')}
            className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:bg-slate-800 transition-colors">
                <Coins className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900 leading-tight">
                    Exchange Rate
                  </h4>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    SBP Live
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Daily forex buying, selling & interbank currency rates
                </p>
              </div>
            </div>

            <div className="p-2 rounded-full text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all shrink-0">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>

          {/* 5. IP Whitelist Card */}
          <div
            id="admin-card-ip-whitelist"
            onClick={() => onNavigate('admin_ip_whitelist')}
            className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:bg-slate-800 transition-colors">
                <Network className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900 leading-tight">
                    IP Whitelist
                  </h4>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    Firewall Rules
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Manage static IP subnets and geographic network boundaries
                </p>
              </div>
            </div>

            <div className="p-2 rounded-full text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all shrink-0">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>

          {/* 6. Price Calculator Card */}
          <div
            id="admin-card-price-calculator"
            onClick={() => onNavigate('admin_price_calculator')}
            className="group bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:bg-slate-800 transition-colors">
                <Calculator className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900 leading-tight">
                    Price Calculator
                  </h4>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                    Export Costing
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Raw cotton, spinning, weaving conversion & FOB calculation engine
                </p>
              </div>
            </div>

            <div className="p-2 rounded-full text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all shrink-0">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Security Info Card */}
        <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200/80 text-xs text-slate-600 flex items-center justify-between">
          <span className="font-medium">System Role Security: Strict RBAC</span>
          <span className="font-mono text-[11px] text-slate-500">v2.4 Audit Logged</span>
        </div>
      </div>
    </div>
  );
};

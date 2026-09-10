/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, Clock, Sparkles, Shield, ChevronRight } from 'lucide-react';
import { AppBar } from '../components/common/AppBar';
import { PrimaryButton, SecondaryButton } from '../components/common/Buttons';
import { StaticPreviewConfig } from '../types';

interface StaticPreviewScreenProps {
  config: StaticPreviewConfig;
  onBack: () => void;
}

export const StaticPreviewScreen: React.FC<StaticPreviewScreenProps> = ({
  config,
  onBack,
}) => {
  return (
    <div className="min-h-full pb-24 bg-slate-50/60">
      <AppBar
        title={config.featureTitle}
        subtitle={config.moduleName}
        showBack
        onBack={onBack}
      />

      <div className="p-4 sm:p-6 max-w-lg mx-auto mt-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4 ring-8 ring-slate-50">
            <Clock className="w-8 h-8 stroke-[1.75]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Prototype Preview</span>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
            Coming Soon
          </h2>

          <p className="text-sm font-semibold text-slate-800 mt-2 max-w-sm leading-snug">
            {config.featureTitle}
          </p>

          <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
            {config.moduleName} functionality will be available in a future version.
          </p>

          {/* Prototype Specs Box */}
          <div className="w-full mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Module Scope</span>
              <span className="font-semibold text-slate-800">{config.moduleName}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Target Framework</span>
              <span className="font-mono text-slate-800 font-semibold">Flutter / Dart Mobile</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Architecture Status</span>
              <span className="text-emerald-700 font-semibold">UI Spec Validated</span>
            </div>
          </div>

          <div className="w-full mt-6">
            <PrimaryButton onClick={onBack} size="md">
              Return to {config.moduleName}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};

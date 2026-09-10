/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Lock } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-full h-full flex flex-col justify-between items-center bg-slate-950 text-white p-8 select-none relative overflow-hidden">
      {/* Background radial gradient subtle accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 opacity-90" />

      <div className="w-full flex justify-end relative z-10">
        <button
          type="button"
          onClick={onComplete}
          className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
        >
          Skip Intro
        </button>
      </div>

      {/* Main Branding */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center text-center relative z-10 max-w-xs"
      >
        {/* Clean corporate logo mark */}
        <motion.div
          initial={{ scale: 0.85, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-20 h-20 rounded-3xl bg-white text-slate-950 font-black text-4xl flex items-center justify-center shadow-2xl ring-4 ring-white/10 mb-6"
        >
          S
        </motion.div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
          SONERI ERP
        </h1>
        <p className="text-xs sm:text-sm font-medium tracking-wide text-slate-400 uppercase">
          Business Management System
        </p>

        <div className="mt-8 flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>Enterprise Grade Security</span>
        </div>
      </motion.div>

      {/* Bottom Loading Progress */}
      <div className="w-full max-w-xs relative z-10 flex flex-col items-center gap-3">
        <div className="w-full h-1 bg-slate-800/80 rounded-full overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            className="w-1/2 h-full bg-slate-200 rounded-full"
          />
        </div>
        <p className="text-[11px] text-slate-500 font-mono">Initializing System Core...</p>
      </div>
    </div>
  );
};

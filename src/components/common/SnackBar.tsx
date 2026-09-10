/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { SnackBarMessage } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface SnackBarProps {
  message: SnackBarMessage | null;
  onDismiss: () => void;
}

export const SnackBar: React.FC<SnackBarProps> = ({ message, onDismiss }) => {
  const { isDark } = useTheme();

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 3200);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4 pointer-events-none">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl border ${
              isDark
                ? 'bg-[#151c2f] border-slate-750 text-white shadow-slate-950/80'
                : 'bg-slate-900 text-white border-slate-800/80'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {message.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              ) : message.type === 'info' ? (
                <Info className="w-4 h-4 text-sky-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span className="text-xs sm:text-sm font-semibold text-slate-100 truncate">
                {message.text}
              </span>
            </div>
            <button
              onClick={onDismiss}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              aria-label="Close message"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

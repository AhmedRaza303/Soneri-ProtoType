/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, HelpCircle } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './Buttons';
import { useTheme } from '../../context/ThemeContext';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  const { isDark } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative w-full max-w-sm overflow-hidden rounded-3xl p-5 sm:p-6 shadow-2xl border z-10 ${
              isDark
                ? 'bg-[#111726] border-slate-800 text-slate-100 shadow-slate-950/80'
                : 'bg-white border-slate-200/90 text-slate-900 ring-1 ring-slate-900/5'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2.5 rounded-2xl shrink-0 ${
                  isDestructive
                    ? isDark
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                      : 'bg-rose-50 text-rose-600'
                    : isDark
                    ? 'bg-slate-800 text-slate-300 border border-slate-700'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {isDestructive ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : (
                  <HelpCircle className="w-5 h-5" />
                )}
              </div>
              <div className="space-y-1">
                <h3
                  className={`text-sm sm:text-base font-bold leading-snug ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}
                >
                  {title}
                </h3>
                <p
                  className={`text-xs sm:text-sm leading-relaxed ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {message}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <SecondaryButton size="sm" onClick={onCancel}>
                {cancelLabel}
              </SecondaryButton>
              <PrimaryButton
                size="sm"
                fullWidth={false}
                variant={isDestructive ? 'danger' : 'primary'}
                onClick={onConfirm}
              >
                {confirmLabel}
              </PrimaryButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

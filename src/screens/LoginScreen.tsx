/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { FormField } from '../components/common/FormFields';
import { PrimaryButton } from '../components/common/Buttons';

interface LoginScreenProps {
  onLoginSuccess: (username: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('ahmed.raza');
  const [password, setPassword] = useState('Password@123');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both username/email and password to continue.');
      return;
    }
    setErrorMessage('');
    onLoginSuccess(username.trim());
  };

  const handleQuickDemoLogin = () => {
    setUsername('ahmed.raza');
    setPassword('Password@123');
    onLoginSuccess('ahmed.raza');
  };

  return (
    <div className="min-h-full bg-slate-50 flex flex-col justify-between p-6 sm:p-8 select-none">
      <div className="w-full max-w-sm mx-auto flex-1 flex flex-col justify-center">
        {/* Top Header Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-slate-900 text-white font-black text-2xl items-center justify-center shadow-lg shadow-slate-900/10 mb-4 ring-1 ring-slate-900/5">
            S
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">
            SONERI ERP
          </h1>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mt-0.5">
            Business Management System
          </p>

          <div className="mt-6">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Sign in to continue to your enterprise workspace
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700 leading-snug">
              {errorMessage}
            </div>
          )}

          <FormField
            id="login-username"
            label="Username / Email"
            type="text"
            placeholder="e.g. ahmed.raza or ahmed@example.com"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            icon={<Mail className="w-4 h-4" />}
          />

          <FormField
            id="login-password"
            label="Password"
            isPassword
            placeholder="Enter your corporate password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            icon={<Lock className="w-4 h-4" />}
          />

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
              <input
                id="login-remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/20 cursor-pointer accent-slate-900"
              />
              <span className="font-medium text-slate-700">Remember me</span>
            </label>

            <button
              type="button"
              onClick={() => {
                setForgotEmail(username);
                setForgotModalOpen(true);
                setForgotSubmitted(false);
              }}
              className="font-semibold text-slate-900 hover:underline cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          <div className="pt-2">
            <PrimaryButton
              id="login-submit-btn"
              type="submit"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              SIGN IN
            </PrimaryButton>
          </div>
        </form>

        {/* Quick Demo Assist */}
        <div className="mt-6 pt-5 border-t border-slate-200/80 text-center">
          <p className="text-[11px] text-slate-500 mb-2">Prototype Quick Access:</p>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fill & Sign In as Administrator</span>
          </button>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center pt-6">
        <p className="text-[10px] text-slate-400 font-medium">
          SONERI ERP © 2026 • Enterprise Business Management
        </p>
      </div>

      {/* Forgot Password Bottom Sheet / Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Reset Password</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your registered corporate email to receive a recovery link.
                </p>
              </div>
            </div>

            {forgotSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-emerald-900">Reset Link Dispatched</p>
                <p className="text-[11px] text-emerald-700">
                  Password instructions sent to {forgotEmail || 'your email'}.
                </p>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="mt-3 px-4 py-1.5 text-xs font-semibold bg-emerald-700 text-white rounded-lg cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <FormField
                  label="Registered Email"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@company.com"
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <PrimaryButton
                    size="sm"
                    fullWidth={false}
                    onClick={() => setForgotSubmitted(true)}
                  >
                    Send Link
                  </PrimaryButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

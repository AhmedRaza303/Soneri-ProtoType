/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  Settings,
  Info,
  LogOut,
  ChevronRight,
  Bell,
  Lock,
  Moon,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import { AppBar } from '../components/common/AppBar';
import { MenuTile } from '../components/common/ModuleCards';
import { PrimaryButton, SecondaryButton } from '../components/common/Buttons';

interface ProfileScreenProps {
  onLogoutClick: () => void;
  onOpenDrawer: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onLogoutClick,
  onOpenDrawer,
}) => {
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [biometrics, setBiometrics] = useState(true);

  return (
    <div className="min-h-full pb-28 bg-slate-50/60">
      <AppBar
        title="Profile"
        subtitle="Account & System Settings"
        onMenuClick={onOpenDrawer}
      />

      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-2xl shadow-md ring-4 ring-slate-100 shrink-0">
            AR
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Ahmed Raza</h2>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                    <Shield className="w-3 h-3" />
                    Administrator
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Head Office</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-xs text-slate-600">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>ahmed@example.com</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>+92 300 8472910</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Group */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            App Configuration
          </h3>

          <div className="space-y-2.5">
            <MenuTile
              title="Settings"
              subtitle="Preferences, security & notification controls"
              icon={<Settings className="w-4 h-4" />}
              onClick={() => setSettingsModalOpen(true)}
            />

            <MenuTile
              title="About SONERI ERP"
              subtitle="Version, mobile engine architecture & license"
              icon={<Info className="w-4 h-4" />}
              onClick={() => setAboutModalOpen(true)}
            />
          </div>
        </div>

        {/* Danger / Logout Zone */}
        <div className="space-y-2 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Session
          </h3>

          <MenuTile
            id="profile-logout-tile"
            title="Log Out"
            subtitle="Securely terminate session on this device"
            icon={<LogOut className="w-4 h-4" />}
            destructive
            onClick={onLogoutClick}
          />
        </div>
      </div>

      {/* Settings Bottom Sheet / Modal */}
      {settingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">App Preferences</h3>
                <p className="text-xs text-slate-500 mt-0.5">Mobile device runtime configuration</p>
              </div>
            </div>

            <div className="space-y-3 py-1">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-slate-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Push Notifications</p>
                    <p className="text-[11px] text-slate-500">Order approvals & status alerts</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={pushNotifs}
                  onChange={(e) => setPushNotifs(e.target.checked)}
                  className="w-4 h-4 accent-slate-900 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-slate-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Biometric Unlock</p>
                    <p className="text-[11px] text-slate-500">FaceID / Fingerprint authorization</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={biometrics}
                  onChange={(e) => setBiometrics(e.target.checked)}
                  className="w-4 h-4 accent-slate-900 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <PrimaryButton size="sm" fullWidth={false} onClick={() => setSettingsModalOpen(false)}>
                Done
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {aboutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-lg">
              S
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">SONERI ERP</h3>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-0.5">
                Business Management System
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Version:</span>
                <span className="font-mono font-bold text-slate-900">1.0.0 (Enterprise)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Architecture:</span>
                <span className="text-slate-900 font-semibold">Flutter Prototype Ref</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Environment:</span>
                <span className="text-emerald-700 font-semibold">Local Offline Mock</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Modules Active:</span>
                <span className="text-slate-900 font-semibold">8 Enterprise Suites</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Designed as a mobile-first reference prototype for iOS, Android & tablet deployment.
            </p>

            <PrimaryButton size="md" onClick={() => setAboutModalOpen(false)}>
              Close
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
};

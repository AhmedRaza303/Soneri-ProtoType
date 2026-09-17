/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Home,
  Grid,
  ShieldCheck,
  Landmark,
  Ship,
  ShoppingBag,
  TrendingUp,
  BarChart3,
  Megaphone,
  Layers,
  Bell,
  User,
  LogOut,
  ChevronRight,
  Users as UsersIcon,
  Sliders,
  Sun,
  Moon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ScreenId } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface AppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenId) => void;
  onLogoutClick: () => void;
  currentScreen: ScreenId;
}

interface DrawerNavItem {
  id: ScreenId;
  label: string;
  icon: LucideIcon;
  subItems?: DrawerNavItem[];
}

const getExpandableParent = (screen: ScreenId): ScreenId | null => {
  if (screen === 'dashboard' || screen.startsWith('dashboard_')) return 'dashboard';
  if (screen === 'admin' || screen.startsWith('admin_')) return 'admin';
  if (screen === 'module_finance' || screen.startsWith('finance_')) return 'module_finance';
  if (screen === 'module_export' || screen.startsWith('export_')) return 'module_export';
  if (screen === 'module_purchase' || screen.startsWith('purchase_')) return 'module_purchase';
  if (screen === 'module_sales' || screen.startsWith('sales_')) return 'module_sales';
  if (screen === 'module_reports' || screen.startsWith('report_')) return 'module_reports';
  if (screen === 'module_marketing' || screen.startsWith('marketing_')) return 'module_marketing';
  if (screen === 'module_catalog' || screen.startsWith('catalog_')) return 'module_catalog';
  return null;
};

export const AppDrawer: React.FC<AppDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onLogoutClick,
  currentScreen,
}) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    dashboard: currentScreen.startsWith('dashboard'),
    admin: currentScreen === 'admin' || currentScreen.startsWith('admin_'),
  });

  const handleNav = (screen: ScreenId) => {
    onNavigate(screen);
    onClose();
  };

  const toggleMenu = (id: ScreenId) => {
    setExpandedMenus((current) => ({ ...current, [id]: !current[id] }));
  };

  useEffect(() => {
    const parent = getExpandableParent(currentScreen);
    if (parent) {
      setExpandedMenus((current) => ({ ...current, [parent]: true }));
    }
  }, [currentScreen]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const navGroups: { label: string; items: DrawerNavItem[] }[] = [
    {
      label: 'Main',
      items: [
        {
          id: 'dashboard' as ScreenId,
          label: 'Dashboard',
          icon: Home,
          subItems: [
            { id: 'dashboard' as ScreenId, label: 'Overview', icon: BarChart3 },
            { id: 'dashboard_export' as ScreenId, label: 'Export Dashboard', icon: Ship },
            { id: 'dashboard_purchase' as ScreenId, label: 'Purchase Dashboard', icon: ShoppingBag },
            { id: 'dashboard_marketing' as ScreenId, label: 'Marketing Dashboard', icon: Megaphone },
            { id: 'dashboard_finance' as ScreenId, label: 'Finance Dashboard', icon: Landmark },
          ],
        },
      ],
    },
    {
      label: 'Core ERP',
      items: [
        {
          id: 'admin' as ScreenId,
          label: 'Administrator',
          icon: ShieldCheck,
          subItems: [
            { id: 'admin_users' as ScreenId, label: 'Users', icon: UsersIcon },
            { id: 'admin_values' as ScreenId, label: 'Manage Values', icon: Sliders },
          ],
        },
        {
          id: 'module_finance' as ScreenId,
          label: 'Finance',
          icon: Landmark,
          subItems: [
            { id: 'finance_po_approval' as ScreenId, label: 'PO Approval', icon: ShoppingBag },
            {
              id: 'finance_awaiting_confirmations' as ScreenId,
              label: 'Awaiting Confirmations',
              icon: Layers,
            },
            {
              id: 'finance_proforma_supplier' as ScreenId,
              label: 'Proforma Supplier',
              icon: BarChart3,
            },
          ],
        },
        {
          id: 'module_export' as ScreenId,
          label: 'Export',
          icon: Ship,
          subItems: [
            {
              id: 'export_container_tracking' as ScreenId,
              label: 'Container Tracking',
              icon: Layers,
            },
          ],
        },
        {
          id: 'module_purchase' as ScreenId,
          label: 'Purchase',
          icon: ShoppingBag,
          subItems: [
            { id: 'purchase_requisition' as ScreenId, label: 'Requisitions', icon: Sliders },
            { id: 'purchase_order' as ScreenId, label: 'Purchase Orders', icon: ShoppingBag },
            { id: 'purchase_invoice' as ScreenId, label: 'Purchase Invoices', icon: BarChart3 },
            { id: 'purchase_readiness' as ScreenId, label: 'Readiness Calendar', icon: Grid },
            {
              id: 'purchase_supplier_tracking' as ScreenId,
              label: 'Supplier Tracking',
              icon: Ship,
            },
          ],
        },
        {
          id: 'module_sales' as ScreenId,
          label: 'Sales',
          icon: TrendingUp,
          subItems: [
            {
              id: 'sales_proforma_invoice' as ScreenId,
              label: 'Proforma Invoices',
              icon: BarChart3,
            },
            { id: 'sales_invoice' as ScreenId, label: 'Sale Invoices', icon: ShoppingBag },
            {
              id: 'sales_customer_payment' as ScreenId,
              label: 'Customer Payments',
              icon: Landmark,
            },
          ],
        },
        {
          id: 'module_reports' as ScreenId,
          label: 'Reports',
          icon: BarChart3,
          subItems: [
            { id: 'report_purchase_summary' as ScreenId, label: 'Purchase Summary', icon: BarChart3 },
            { id: 'report_pl_container' as ScreenId, label: 'P&L by Container', icon: BarChart3 },
            { id: 'report_export_document' as ScreenId, label: 'Export Documents', icon: Ship },
            { id: 'report_shipment_pnl' as ScreenId, label: 'Shipment P&L', icon: TrendingUp },
            { id: 'report_order' as ScreenId, label: 'Order Report', icon: ShoppingBag },
            { id: 'report_unconfirmed' as ScreenId, label: 'Unconfirmed Orders', icon: ShoppingBag },
            { id: 'report_supplier_aging' as ScreenId, label: 'Supplier Aging', icon: BarChart3 },
            { id: 'report_customer_aging' as ScreenId, label: 'Customer Aging', icon: BarChart3 },
            { id: 'report_payable' as ScreenId, label: 'Payable Report', icon: Landmark },
            { id: 'report_receivable' as ScreenId, label: 'Receivable Report', icon: Landmark },
            { id: 'report_overall_pnl' as ScreenId, label: 'Overall P&L', icon: TrendingUp },
            { id: 'report_cashflow' as ScreenId, label: 'Cash Flow', icon: TrendingUp },
            { id: 'report_trial' as ScreenId, label: 'Trial Balance', icon: BarChart3 },
            { id: 'report_inventory' as ScreenId, label: 'Inventory Report', icon: Layers },
            { id: 'report_party' as ScreenId, label: 'Party Report', icon: UsersIcon },
            { id: 'report_sales_summary' as ScreenId, label: 'Sales Summary', icon: TrendingUp },
          ],
        },
        {
          id: 'module_marketing' as ScreenId,
          label: 'Marketing & Exhibitions',
          icon: Megaphone,
          subItems: [
            { id: 'marketing_exhibition' as ScreenId, label: 'Exhibitions', icon: Grid },
            { id: 'marketing_leads' as ScreenId, label: 'Leads', icon: UsersIcon },
            { id: 'marketing_quotation' as ScreenId, label: 'Quotations', icon: BarChart3 },
          ],
        },
        {
          id: 'module_catalog' as ScreenId,
          label: 'Catalog',
          icon: Layers,
          subItems: [
            { id: 'catalog_category' as ScreenId, label: 'Categories', icon: Grid },
            { id: 'catalog_brand' as ScreenId, label: 'Brands', icon: Megaphone },
            { id: 'catalog_collection' as ScreenId, label: 'Collections', icon: Layers },
            { id: 'catalog_products' as ScreenId, label: 'Products', icon: ShoppingBag },
          ],
        },
      ],
    },
    {
      label: 'Preferences',
      items: [
        { id: 'notifications' as ScreenId, label: 'Notifications', icon: Bell },
        { id: 'profile' as ScreenId, label: 'My Profile & Settings', icon: User },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Sheet */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className={`relative w-4/5 max-w-xs h-full shadow-2xl flex flex-col z-10 transition-colors ${
              isDark ? 'bg-[#0d1322] text-slate-100' : 'bg-white text-slate-900'
            }`}
          >
            {/* Drawer Header */}
            <div
              className={`p-5 flex flex-col justify-between relative transition-colors ${
                isDark
                  ? 'bg-[#090d16] text-white border-b border-slate-800'
                  : 'bg-slate-900 text-white'
              }`}
            >
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close navigation drawer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-xl font-black text-lg flex items-center justify-center shadow-md ${
                    isDark
                      ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white'
                      : 'bg-white text-slate-950'
                  }`}
                >
                  S
                </div>
                <div>
                  <h2 className="text-base font-extrabold tracking-tight">SONERI ERP</h2>
                  <p className="text-body-sm text-slate-400 font-medium">Business Management System</p>
                </div>
              </div>

              {/* User Card */}
              <div
                onClick={() => handleNav('profile')}
                className="flex items-center gap-3 pt-3 border-t border-slate-800/80 cursor-pointer hover:opacity-90 transition-opacity"
              >
                <div className="w-9 h-9 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold ring-2 ring-white/10">
                  AR
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold truncate">Ahmed Raza</p>
                  <p className="text-label text-slate-400 truncate">Administrator</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>

            {/* Scrollable Navigation List */}
            <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
              {/* Quick Theme Toggle Row */}
              <div
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                  isDark
                    ? 'bg-[#12192c] border-slate-800 text-slate-200'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isDark ? (
                    <Moon className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-500" />
                  )}
                  <span className="text-xs font-semibold">
                    {isDark ? 'Dark Mode' : 'Light Mode'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`px-2.5 py-1 rounded-lg text-body-sm font-bold transition-all active:scale-95 cursor-pointer ${
                    isDark
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                >
                  Switch
                </button>
              </div>

              {navGroups.map((group) => (
                <div key={group.label} className="space-y-1">
                  <h3
                    className={`px-3 text-label font-bold uppercase tracking-wider ${
                      isDark ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    {group.label}
                  </h3>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const hasSubItems = Boolean(item.subItems?.length);
                    const isExpanded = Boolean(expandedMenus[item.id]);
                    const isActive =
                      currentScreen === item.id ||
                      Boolean(item.subItems?.some((sub) => sub.id === currentScreen));

                    return (
                      <div key={item.id} className="space-y-1">
                        <button
                          type="button"
                          onClick={() =>
                            hasSubItems ? toggleMenu(item.id) : handleNav(item.id)
                          }
                          aria-expanded={hasSubItems ? isExpanded : undefined}
                          aria-controls={hasSubItems ? `drawer-submenu-${item.id}` : undefined}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isActive
                              ? isDark
                                ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-950/40'
                                : 'bg-slate-900 text-white shadow-xs'
                              : isDark
                              ? 'text-slate-300 hover:bg-[#162035]'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon
                              className={`w-4 h-4 shrink-0 ${
                                isActive
                                  ? 'text-white'
                                  : isDark
                                  ? 'text-slate-400'
                                  : 'text-slate-500'
                              }`}
                            />
                            <span className="truncate">{item.label}</span>
                          </div>
                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-transform duration-200 ${
                              hasSubItems && isExpanded ? 'rotate-90' : ''
                            } ${
                              isActive
                                ? 'text-white/80'
                                : isDark
                                ? 'text-slate-500'
                                : 'text-slate-400'
                            }`}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {item.subItems && isExpanded && (
                            <motion.div
                              id={`drawer-submenu-${item.id}`}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: 'easeOut' }}
                              className="overflow-hidden"
                            >
                              <div
                                className={`pl-6 pr-1 space-y-0.5 border-l ml-4 py-1 ${
                                  isDark ? 'border-slate-800' : 'border-slate-200'
                                }`}
                              >
                                {item.subItems.map((sub) => {
                                  const SubIcon = sub.icon;
                                  const isSubActive = currentScreen === sub.id;
                                  return (
                                    <button
                                      key={sub.id}
                                      type="button"
                                      onClick={() => handleNav(sub.id)}
                                      aria-current={isSubActive ? 'page' : undefined}
                                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                        isSubActive
                                          ? isDark
                                            ? 'bg-indigo-500/20 text-indigo-300 font-semibold'
                                            : 'bg-slate-100 text-slate-900 font-semibold'
                                          : isDark
                                          ? 'text-slate-400 hover:text-slate-200 hover:bg-[#151d30]'
                                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                      }`}
                                    >
                                      <SubIcon
                                        className={`w-3.5 h-3.5 shrink-0 ${
                                          isSubActive
                                            ? isDark
                                              ? 'text-indigo-400'
                                              : 'text-slate-900'
                                            : isDark
                                            ? 'text-slate-500'
                                            : 'text-slate-400'
                                        }`}
                                      />
                                      <span className="truncate">{sub.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Drawer Footer: Logout */}
            <div
              className={`p-3 border-t transition-colors ${
                isDark
                  ? 'border-slate-800 bg-[#090d16]'
                  : 'border-slate-200/90 bg-slate-50'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogoutClick();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 active:bg-rose-500/20 transition-colors cursor-pointer`}
              >
                <div className="flex items-center gap-2.5">
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-rose-400" />
              </button>
              <p
                className={`text-label text-center mt-2 font-mono ${
                  isDark ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                SONERI ERP v1.0.0 (Mobile Prototype)
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

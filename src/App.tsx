/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ScreenId,
  User,
  SystemValue,
  NotificationItem,
  StaticPreviewConfig,
  SnackBarMessage,
  ConfirmDialogState,
} from './types';
import {
  INITIAL_USERS,
  INITIAL_VALUES,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';

// Common Components
import { BottomNav } from './components/common/BottomNav';
import { AppDrawer } from './components/common/AppDrawer';
import { ConfirmationDialog } from './components/common/ConfirmationDialog';
import { SnackBar } from './components/common/SnackBar';
import { DeviceFrameToggle, MobileStatusBar, DeviceMode } from './components/common/DeviceFrame';
import { useTheme } from './context/ThemeContext';

// Screen Components
import { SplashScreen } from './screens/SplashScreen';
import { LoginScreen } from './screens/LoginScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { ModulesScreen } from './screens/ModulesScreen';
import { AdminModuleScreen } from './screens/AdminModuleScreen';
import { UsersScreen } from './screens/UsersScreen';
import { AddUserScreen } from './screens/AddUserScreen';
import { ModifyUserScreen } from './screens/ModifyUserScreen';
import { ManageValuesScreen } from './screens/ManageValuesScreen';
import { AddValueScreen } from './screens/AddValueScreen';
import { ModifyValueScreen } from './screens/ModifyValueScreen';
import { StaticModuleScreen } from './screens/StaticModuleScreen';
import { StaticPreviewScreen } from './screens/StaticPreviewScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { ProfileScreen } from './screens/ProfileScreen';

// Workstream Screens
import { FinanceModuleScreen } from './screens/modules/FinanceModuleScreen';
import { ExportModuleScreen } from './screens/modules/ExportModuleScreen';
import { PurchaseModuleScreen } from './screens/modules/PurchaseModuleScreen';
import { SupplierTrackingScreen } from './screens/modules/SupplierTrackingScreen';
import { ReadinessCalendarScreen } from './screens/modules/ReadinessCalendarScreen';
import { ReportsModuleScreen } from './screens/modules/ReportsModuleScreen';
import { ReportsExtraScreen } from './screens/modules/ReportsExtraScreen';
import { SalesModuleScreen } from './screens/modules/SalesModuleScreen';
import { MarketingModuleScreen } from './screens/modules/MarketingModuleScreen';
import { CatalogModuleScreen } from './screens/modules/CatalogModuleScreen';
import { AdminModuleWorkstreams } from './screens/modules/AdminModuleWorkstreams';

export default function App() {
  const { isDark } = useTheme();

  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('splash');
  const [navHistory, setNavHistory] = useState<ScreenId[]>([]);

  // Device framing toggle for testing (Phone 390px / Tablet 768px / Fluid full)
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('fluid');

  // Core Data Local State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [systemValues, setSystemValues] = useState<SystemValue[]>(INITIAL_VALUES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Selected Entities for Editing
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedValue, setSelectedValue] = useState<SystemValue | null>(null);
  const [staticPreviewConfig, setStaticPreviewConfig] = useState<StaticPreviewConfig | null>(null);

  // UI Interactive Overlays
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [snackBar, setSnackBar] = useState<SnackBarMessage | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    isDestructive: false,
    onConfirm: () => {},
  });

  // SnackBar helper
  const showSnackBar = (text: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setSnackBar({
      id: Date.now(),
      text,
      type,
    });
  };

  // Screen Navigation Handlers
  const navigateTo = (screen: ScreenId, replace = false) => {
    if (screen === currentScreen) return;
    if (!replace) {
      setNavHistory((prev) => [...prev, currentScreen]);
    }
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateBack = (fallbackScreen?: ScreenId) => {
    if (navHistory.length > 0) {
      const prevScreen = navHistory[navHistory.length - 1];
      setNavHistory((prev) => prev.slice(0, -1));
      setCurrentScreen(prevScreen);
    } else if (fallbackScreen) {
      setCurrentScreen(fallbackScreen);
    } else {
      // Default fallbacks based on hierarchy
      if (currentScreen === 'admin_add_user' || currentScreen === 'admin_modify_user') {
        setCurrentScreen('admin_users');
      } else if (currentScreen === 'admin_users' || currentScreen === 'admin_values') {
        setCurrentScreen('admin');
      } else if (currentScreen === 'admin_add_value' || currentScreen === 'admin_modify_value') {
        setCurrentScreen('admin_values');
      } else if (currentScreen === 'admin') {
        setCurrentScreen('modules');
      } else if (currentScreen.startsWith('module_')) {
        setCurrentScreen('modules');
      } else if (currentScreen === 'static_preview') {
        setCurrentScreen(staticPreviewConfig?.backScreen || 'modules');
      } else {
        setCurrentScreen('dashboard');
      }
    }
  };

  // Auth Handlers
  const handleLoginSuccess = (username: string) => {
    showSnackBar(`Signed in as ${username}`, 'success');
    setNavHistory([]);
    setCurrentScreen('dashboard');
  };

  const handleLogoutClick = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Log Out?',
      message: 'Are you sure you want to log out of SONERI ERP?',
      confirmLabel: 'Log Out',
      cancelLabel: 'Cancel',
      isDestructive: true,
      onConfirm: () => {
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        setNavHistory([]);
        setCurrentScreen('login');
        showSnackBar('You have logged out successfully', 'info');
      },
    });
  };

  // User Actions
  const handleAddUser = (newUserData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...newUserData,
      id: `usr_${Date.now().toString().slice(-4)}`,
    };
    setUsers((prev) => [newUser, ...prev]);
    showSnackBar('User added successfully', 'success');
    setCurrentScreen('admin_users');
  };

  const handleModifyUser = (user: User) => {
    setSelectedUser(user);
    navigateTo('admin_modify_user');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    showSnackBar('User updated successfully', 'success');
    setCurrentScreen('admin_users');
  };

  const handleToggleUserStatus = (user: User) => {
    const isActivating = user.status === 'Inactive';
    const actionText = isActivating ? 'activate' : 'deactivate';
    const titleText = isActivating ? 'Activate User?' : 'Deactivate User?';
    const messageText = `Are you sure you want to ${actionText} this user?`;

    setConfirmDialog({
      isOpen: true,
      title: titleText,
      message: messageText,
      confirmLabel: isActivating ? 'Activate' : 'Deactivate',
      cancelLabel: 'Cancel',
      isDestructive: !isActivating,
      onConfirm: () => {
        const nextStatus = isActivating ? 'Active' : 'Inactive';
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: nextStatus } : u))
        );
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        showSnackBar(
          isActivating ? 'User activated successfully' : 'User deactivated successfully',
          'success'
        );
      },
    });
  };

  // System Value Actions
  const handleAddValue = (newValueData: Omit<SystemValue, 'id'>) => {
    const newVal: SystemValue = {
      ...newValueData,
      id: `val_${Date.now().toString().slice(-4)}`,
    };
    setSystemValues((prev) => [newVal, ...prev]);
    showSnackBar('Value added successfully', 'success');
    setCurrentScreen('admin_values');
  };

  const handleModifyValue = (val: SystemValue) => {
    setSelectedValue(val);
    navigateTo('admin_modify_value');
  };

  const handleUpdateValue = (updatedVal: SystemValue) => {
    setSystemValues((prev) =>
      prev.map((v) => (v.id === updatedVal.id ? updatedVal : v))
    );
    showSnackBar('Value updated successfully', 'success');
    setCurrentScreen('admin_values');
  };

  const handleDeleteValue = (val: SystemValue) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Value?',
      message: `Are you sure you want to delete "${val.valueName || val.name}"?`,
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      isDestructive: true,
      onConfirm: () => {
        setSystemValues((prev) => prev.filter((v) => v.id !== val.id));
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        showSnackBar('Value deleted successfully', 'success');
      },
    });
  };

  const handleToggleValueStatus = (val: SystemValue) => {
    const isActivating = val.status === 'Inactive';
    const actionText = isActivating ? 'activate' : 'deactivate';
    const titleText = isActivating ? 'Activate Value?' : 'Deactivate Value?';
    const messageText = `Are you sure you want to ${actionText} "${val.name}"?`;

    setConfirmDialog({
      isOpen: true,
      title: titleText,
      message: messageText,
      confirmLabel: isActivating ? 'Activate' : 'Deactivate',
      cancelLabel: 'Cancel',
      isDestructive: !isActivating,
      onConfirm: () => {
        const nextStatus = isActivating ? 'Active' : 'Inactive';
        setSystemValues((prev) =>
          prev.map((v) => (v.id === val.id ? { ...v, status: nextStatus } : v))
        );
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        showSnackBar(
          isActivating ? 'Value activated successfully' : 'Value deactivated successfully',
          'success'
        );
      },
    });
  };

  // Notification Actions
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    showSnackBar('Notification marked as read', 'info');
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showSnackBar('All notifications marked as read', 'success');
  };

  // Open Static Preview
  const handleOpenStaticPreview = (config: StaticPreviewConfig) => {
    setStaticPreviewConfig(config);
    navigateTo('static_preview');
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Decide whether bottom navigation should be visible
  const showBottomNav =
    currentScreen !== 'splash' &&
    currentScreen !== 'login' &&
    currentScreen !== 'admin_add_user' &&
    currentScreen !== 'admin_modify_user' &&
    currentScreen !== 'admin_add_value' &&
    currentScreen !== 'admin_modify_value';

  // Render Current Screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onComplete={() => setCurrentScreen('login')} />;

      case 'login':
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />;

      case 'dashboard':
        return (
          <DashboardScreen
            key="dashboard-overview"
            onNavigate={navigateTo}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            unreadNotificationsCount={unreadCount}
          />
        );

      case 'dashboard_export':
        return (
          <DashboardScreen
            key="dashboard-export"
            onNavigate={navigateTo}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            unreadNotificationsCount={unreadCount}
            initialTab="export"
          />
        );

      case 'dashboard_purchase':
        return (
          <DashboardScreen
            key="dashboard-purchase"
            onNavigate={navigateTo}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            unreadNotificationsCount={unreadCount}
            initialTab="purchase"
          />
        );

      case 'dashboard_marketing':
        return (
          <DashboardScreen
            key="dashboard-marketing"
            onNavigate={navigateTo}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            unreadNotificationsCount={unreadCount}
            initialTab="marketing"
          />
        );

      case 'dashboard_finance':
        return (
          <DashboardScreen
            key="dashboard-finance"
            onNavigate={navigateTo}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            unreadNotificationsCount={unreadCount}
            initialTab="finance"
          />
        );

      case 'modules':
        return (
          <ModulesScreen
            onNavigate={navigateTo}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            unreadNotificationsCount={unreadCount}
          />
        );

      case 'admin':
        return (
          <AdminModuleScreen
            onNavigate={navigateTo}
            onBack={() => navigateBack('modules')}
            usersCount={users.length}
            valuesCount={systemValues.length}
          />
        );

      case 'admin_users':
        return (
          <UsersScreen
            users={users}
            onBack={() => navigateBack('admin')}
            onAddUserClick={() => navigateTo('admin_add_user')}
            onModifyUser={handleModifyUser}
            onToggleUserStatus={handleToggleUserStatus}
          />
        );

      case 'admin_add_user':
        return (
          <AddUserScreen
            onBack={() => navigateBack('admin_users')}
            onSaveUser={handleAddUser}
          />
        );

      case 'admin_modify_user':
        if (!selectedUser) {
          return (
            <UsersScreen
              users={users}
              onBack={() => navigateBack('admin')}
              onAddUserClick={() => navigateTo('admin_add_user')}
              onModifyUser={handleModifyUser}
              onToggleUserStatus={handleToggleUserStatus}
            />
          );
        }
        return (
          <ModifyUserScreen
            user={selectedUser}
            onBack={() => navigateBack('admin_users')}
            onUpdateUser={handleUpdateUser}
          />
        );

      case 'admin_values':
        return (
          <ManageValuesScreen
            systemValues={systemValues}
            onBack={() => navigateBack('admin')}
            onAddValueClick={() => navigateTo('admin_add_value')}
            onModifyValue={handleModifyValue}
            onDeleteValue={handleDeleteValue}
            onToggleValueStatus={handleToggleValueStatus}
          />
        );

      case 'admin_add_value':
        return (
          <AddValueScreen
            onBack={() => navigateBack('admin_values')}
            onSaveValue={handleAddValue}
          />
        );

      case 'admin_modify_value':
        if (!selectedValue) {
          return (
            <ManageValuesScreen
              systemValues={systemValues}
              onBack={() => navigateBack('admin')}
              onAddValueClick={() => navigateTo('admin_add_value')}
              onModifyValue={handleModifyValue}
              onDeleteValue={handleDeleteValue}
              onToggleValueStatus={handleToggleValueStatus}
            />
          );
        }
        return (
          <ModifyValueScreen
            systemValue={selectedValue}
            onBack={() => navigateBack('admin_values')}
            onUpdateValue={handleUpdateValue}
          />
        );

      // Static ERP Modules
      case 'module_finance':
        return (
          <StaticModuleScreen
            moduleId="finance"
            onBack={() => navigateBack('modules')}
            onOpenPreview={handleOpenStaticPreview}
            onNavigate={navigateTo}
          />
        );

      case 'module_export':
        return (
          <StaticModuleScreen
            moduleId="export"
            onBack={() => navigateBack('modules')}
            onOpenPreview={handleOpenStaticPreview}
            onNavigate={navigateTo}
          />
        );

      case 'module_purchase':
        return (
          <StaticModuleScreen
            moduleId="purchase"
            onBack={() => navigateBack('modules')}
            onOpenPreview={handleOpenStaticPreview}
            onNavigate={navigateTo}
          />
        );

      case 'module_sales':
        return (
          <StaticModuleScreen
            moduleId="sales"
            onBack={() => navigateBack('modules')}
            onOpenPreview={handleOpenStaticPreview}
            onNavigate={navigateTo}
          />
        );

      case 'module_reports':
        return (
          <StaticModuleScreen
            moduleId="reports"
            onBack={() => navigateBack('modules')}
            onOpenPreview={handleOpenStaticPreview}
            onNavigate={navigateTo}
          />
        );

      case 'module_marketing':
        return (
          <StaticModuleScreen
            moduleId="marketing"
            onBack={() => navigateBack('modules')}
            onOpenPreview={handleOpenStaticPreview}
            onNavigate={navigateTo}
          />
        );

      case 'module_catalog':
        return (
          <StaticModuleScreen
            moduleId="catalog"
            onBack={() => navigateBack('modules')}
            onOpenPreview={handleOpenStaticPreview}
            onNavigate={navigateTo}
          />
        );

      // ============================================
      // 1. Finance Workstreams
      // ============================================
      case 'finance_po_approval':
        return (
          <FinanceModuleScreen
            workstream="po_approval"
            onBack={() => navigateBack('module_finance')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'finance_proforma_supplier':
        return (
          <FinanceModuleScreen
            workstream="proforma_supplier"
            onBack={() => navigateBack('module_finance')}
            onShowSnackBar={showSnackBar}
          />
        );

      // ============================================
      // 2. Export Workstreams
      // ============================================
      case 'export_container_tracking':
        return (
          <ExportModuleScreen
            onBack={() => navigateBack('module_export')}
            onShowSnackBar={showSnackBar}
          />
        );

      // ============================================
      // 3. Purchase Workstreams
      // ============================================
      case 'purchase_readiness':
        return (
          <ReadinessCalendarScreen
            onBack={() => navigateBack('module_purchase')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'report_purchase_summary':
        return (
          <ReportsModuleScreen
            reportId="purchase_summary"
            onBack={() => navigateBack('module_reports')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'report_pl_container':
        return (
          <ReportsModuleScreen
            reportId="pl_container"
            onBack={() => navigateBack('module_reports')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'report_export_document':
        return (
          <ReportsModuleScreen
            reportId="export_document"
            onBack={() => navigateBack('module_reports')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'report_shipment_pnl':
        return (
          <ReportsModuleScreen
            reportId="shipment_pnl"
            onBack={() => navigateBack('module_reports')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'report_order':
        return (
          <ReportsModuleScreen
            reportId="order_report"
            onBack={() => navigateBack('module_reports')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'report_unconfirmed':
        return (
          <ReportsModuleScreen
            reportId="unconfirmed_order"
            onBack={() => navigateBack('module_reports')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'report_supplier_aging':
        return (
          <ReportsExtraScreen
            reportId="supplier_aging"
            onBack={() => navigateBack('module_reports')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'report_customer_aging':
        return (
          <ReportsExtraScreen
            reportId="customer_aging"
            onBack={() => navigateBack('module_reports')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'report_payable':
        return (
          <ReportsExtraScreen
            reportId="payable"
            onBack={() => navigateBack('module_reports')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'report_receivable':
        return (
          <ReportsExtraScreen
            reportId="receivable"
            onBack={() => navigateBack('module_reports')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'report_overall_pnl':
        return (
          <ReportsExtraScreen
            reportId="overall_pnl"
            onBack={() => navigateBack('module_reports')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'report_cashflow':
        return (
          <ReportsExtraScreen
            reportId="cashflow"
            onBack={() => navigateBack('module_reports')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'report_trial':
        return (
          <ReportsExtraScreen
            reportId="trial"
            onBack={() => navigateBack('module_reports')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'report_inventory':
        return (
          <ReportsExtraScreen
            reportId="inventory"
            onBack={() => navigateBack('module_reports')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'report_party':
        return (
          <ReportsExtraScreen
            reportId="party"
            onBack={() => navigateBack('module_reports')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'report_sales_summary':
        return (
          <ReportsExtraScreen
            reportId="sales_summary"
            onBack={() => navigateBack('module_reports')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'purchase_requisition':
        return (
          <PurchaseModuleScreen
            workstream="requisition"
            onBack={() => navigateBack('module_purchase')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'purchase_order':
        return (
          <PurchaseModuleScreen
            workstream="order"
            onBack={() => navigateBack('module_purchase')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'purchase_invoice':
        return (
          <PurchaseModuleScreen
            workstream="invoice"
            onBack={() => navigateBack('module_purchase')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'purchase_supplier_tracking':
        return (
          <SupplierTrackingScreen
            onBack={() => navigateBack('module_purchase')}
            onShowSnackBar={showSnackBar}
          />
        );

      // ============================================
      // 4. Sales Workstreams
      // ============================================
      case 'sales_proforma_invoice':
        return (
          <SalesModuleScreen
            workstream="proforma"
            onBack={() => navigateBack('module_sales')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'sales_invoice':
        return (
          <SalesModuleScreen
            workstream="invoice"
            onBack={() => navigateBack('module_sales')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'sales_customer_payment':
        return (
          <SalesModuleScreen
            workstream="payment"
            onBack={() => navigateBack('module_sales')}
            onShowSnackBar={showSnackBar}
          />
        );

      // ============================================
      // 5. Marketing & Exhibitions Workstreams
      // ============================================
      case 'marketing_exhibition':
        return (
          <MarketingModuleScreen
            workstream="exhibition"
            onBack={() => navigateBack('module_marketing')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'marketing_leads':
        return (
          <MarketingModuleScreen
            workstream="leads"
            onBack={() => navigateBack('module_marketing')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'marketing_quotation':
        return (
          <MarketingModuleScreen
            workstream="quotation"
            onBack={() => navigateBack('module_marketing')}
            onShowSnackBar={showSnackBar}
          />
        );

      // ============================================
      // 6. Catalog Workstreams
      // ============================================
      case 'catalog_category':
        return (
          <CatalogModuleScreen
            workstream="category"
            onBack={() => navigateBack('module_catalog')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'catalog_brand':
        return (
          <CatalogModuleScreen
            workstream="brand"
            onBack={() => navigateBack('module_catalog')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'catalog_collection':
        return (
          <CatalogModuleScreen
            workstream="collection"
            onBack={() => navigateBack('module_catalog')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'catalog_collection_brand':
        return (
          <CatalogModuleScreen
            workstream="brand"
            onBack={() => navigateBack('module_catalog')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'catalog_products':
        return (
          <CatalogModuleScreen
            workstream="products"
            onBack={() => navigateBack('module_catalog')}
            onShowSnackBar={showSnackBar}
          />
        );

      // ============================================
      // 7. Administrator Workstreams
      // ============================================
      case 'admin_user_auth':
        return (
          <AdminModuleWorkstreams
            workstream="user_auth"
            onBack={() => navigateBack('admin')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'admin_exchange_rate':
        return (
          <AdminModuleWorkstreams
            workstream="exchange_rate"
            onBack={() => navigateBack('admin')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'admin_ip_whitelist':
        return (
          <AdminModuleWorkstreams
            workstream="ip_whitelist"
            onBack={() => navigateBack('admin')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'admin_price_calculator':
        return (
          <AdminModuleWorkstreams
            workstream="price_calculator"
            onBack={() => navigateBack('admin')}
            onShowSnackBar={showSnackBar}
          />
        );

      case 'static_preview':
        if (!staticPreviewConfig) {
          return (
            <ModulesScreen
              onNavigate={navigateTo}
              onOpenDrawer={() => setIsDrawerOpen(true)}
              unreadNotificationsCount={unreadCount}
            />
          );
        }
        return (
          <StaticPreviewScreen
            config={staticPreviewConfig}
            onBack={() => navigateBack(staticPreviewConfig.backScreen)}
          />
        );

      case 'notifications':
        return (
          <NotificationsScreen
            notifications={notifications}
            onMarkRead={handleMarkNotificationRead}
            onMarkAllRead={handleMarkAllNotificationsRead}
            onOpenDrawer={() => setIsDrawerOpen(true)}
          />
        );

      case 'profile':
        return (
          <ProfileScreen
            onLogoutClick={handleLogoutClick}
            onOpenDrawer={() => setIsDrawerOpen(true)}
          />
        );

      default:
        return (
          <DashboardScreen
            onNavigate={navigateTo}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            unreadNotificationsCount={unreadCount}
          />
        );
    }
  };

  // Device mode container class
  const getContainerWidth = () => {
    switch (deviceMode) {
      case 'phone':
        return 'max-w-[420px] w-full my-4 rounded-[28px] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden';
      case 'tablet':
        return 'max-w-[820px] w-full my-4 rounded-[24px] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden';
      case 'fluid':
      default:
        return 'w-full min-h-screen';
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDark ? 'bg-[#090d16] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
      } flex flex-col items-center justify-start antialiased transition-colors`}
    >
      {/* Top Prototype Frame Switcher Bar */}
      <div className="w-full">
        <DeviceFrameToggle
          deviceMode={deviceMode}
          onModeChange={setDeviceMode}
        />
      </div>

      {/* Main Mobile/Tablet Device Container */}
      <div
        className={`flex-1 flex flex-col ${
          isDark ? 'bg-[#090d16] text-slate-100' : 'bg-[#f8fafc] text-slate-900'
        } transition-all duration-200 relative min-h-screen ${getContainerWidth()}`}
      >
        {/* Mobile Top Status Bar (9:41, 5G, Battery) */}
        {deviceMode !== 'fluid' && currentScreen !== 'splash' && <MobileStatusBar />}

        {/* Dynamic Screen View */}
        <main className="flex-1 flex flex-col relative overflow-x-hidden">
          {renderScreen()}
        </main>

        {/* Flutter-style Bottom Navigation Bar */}
        {showBottomNav && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={navigateTo}
            unreadCount={unreadCount}
          />
        )}

        {/* Simulated Home Indicator Bar for Phone Mode */}
        {deviceMode === 'phone' && (
          <div
            className={`w-full pb-1 pt-0.5 ${
              isDark ? 'bg-[#0e1424]' : 'bg-white'
            } flex justify-center shrink-0 z-30 transition-colors`}
          >
            <div
              className={`w-32 h-1 ${
                isDark ? 'bg-white/20' : 'bg-slate-900/40'
              } rounded-full`}
            />
          </div>
        )}
      </div>

      {/* Global Mobile Drawer */}
      <AppDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigate={navigateTo}
        onLogoutClick={handleLogoutClick}
        currentScreen={currentScreen}
      />

      {/* Global Confirmation Dialog (for Activate, Deactivate, Logout) */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel={confirmDialog.confirmLabel}
        cancelLabel={confirmDialog.cancelLabel}
        isDestructive={confirmDialog.isDestructive}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Global Bottom SnackBar Notifications */}
      <SnackBar
        message={snackBar}
        onDismiss={() => setSnackBar(null)}
      />
    </div>
  );
}

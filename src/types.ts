/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole =
  | 'Administrator'
  | 'Finance'
  | 'Purchase'
  | 'Sales'
  | 'Marketing'
  | 'Viewer'
  | string;

export type UserStatus = 'Active' | 'Inactive';

export interface BankAccount {
  id: string;
  currency: string;
  bankName: string;
  branchName?: string;
  accountType: string;
  accountTitle: string;
  accountNumber: string;
  ibanNumber?: string;
  swiftCode?: string;
  active: boolean;
  isPrimary: boolean;
}

export interface ProfessionalInfo {
  id: string;
  company: string;
  emailAddress: string;
  mobileNumber: string;
  landlineNumber?: string;
  emailSignature?: string;
  extensionNumber?: string;
}

export interface User {
  id: string;
  // Personal Information
  firstName: string;
  lastName?: string;
  fullName: string;
  username: string;
  email: string;
  gender?: string;
  dateOfBirth?: string;
  nationality?: string;
  taxClass?: string;
  identityNumber?: string;
  passportNumber?: string;
  department?: string;
  designation?: string;
  role: string;
  password?: string;
  confirmPassword?: string;
  passwordExpiryEnabled?: boolean;
  passwordExpiryDays?: string;
  chartOfAccount?: string;
  taxType?: string;
  taxNo?: string;
  enable2FA?: boolean;
  profilePhoto?: string;

  // Employee Info
  employmentType?: string;
  companyJoiningDate?: string;
  companyExitDateEnabled?: boolean;
  companyExitDate?: string;

  // Professional Information
  professionalInfos?: ProfessionalInfo[];

  // Bank Accounts
  bankAccounts?: BankAccount[];

  // Uploaded Documents
  documents?: { [key: string]: string };

  // Status & Metadata
  status: 'Active' | 'Inactive';
  phone?: string;
  avatarColor?: string;
  createdAt?: string;
}

export type ValueCategory =
  | 'Finance'
  | 'Export'
  | 'Purchase'
  | 'Sales'
  | 'General';

export type ValueStatus = 'Active' | 'Inactive';

export interface SystemValue {
  id: string;
  parentCode: string;
  valueName: string;
  displayOrder: number | string;
  description: string;
  // Compatibility fields
  name?: string;
  category?: ValueCategory | string;
  status?: ValueStatus;
  updatedAt?: string;
}

export interface ERPModuleItem {
  id: string;
  title: string;
  subtitle?: string;
  badge?: string;
}

export interface ERPModule {
  id: string;
  name: string;
  description: string;
  iconName: string;
  badge?: string;
  items?: ERPModuleItem[];
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  category: string;
  isRead: boolean;
  priority?: 'normal' | 'high';
}

export type ScreenId =
  | 'splash'
  | 'login'
  | 'dashboard'
  | 'dashboard_export'
  | 'dashboard_purchase'
  | 'dashboard_marketing'
  | 'dashboard_finance'
  | 'modules'
  | 'admin'
  | 'admin_users'
  | 'admin_add_user'
  | 'admin_modify_user'
  | 'admin_values'
  | 'admin_add_value'
  | 'admin_modify_value'
  | 'module_finance'
  | 'module_export'
  | 'module_purchase'
  | 'module_sales'
  | 'module_reports'
  | 'module_marketing'
  | 'module_catalog'
  | 'finance_po_approval'
  | 'finance_proforma_supplier'
  | 'export_container_tracking'
  | 'purchase_requisition'
  | 'purchase_order'
  | 'purchase_invoice'
  | 'purchase_readiness'
  | 'purchase_supplier_tracking'
  | 'report_purchase_summary'
  | 'report_pl_container'
  | 'report_export_document'
  | 'report_shipment_pnl'
  | 'report_order'
  | 'report_unconfirmed'
  | 'report_supplier_aging'
  | 'report_customer_aging'
  | 'report_payable'
  | 'report_receivable'
  | 'report_overall_pnl'
  | 'report_cashflow'
  | 'report_trial'
  | 'report_inventory'
  | 'report_party'
  | 'report_sales_summary'
  | 'sales_proforma_invoice'
  | 'sales_invoice'
  | 'sales_customer_payment'
  | 'marketing_exhibition'
  | 'marketing_leads'
  | 'marketing_quotation'
  | 'catalog_category'
  | 'catalog_brand'
  | 'catalog_collection'
  | 'catalog_collection_brand'
  | 'catalog_products'
  | 'admin_user_auth'
  | 'admin_exchange_rate'
  | 'admin_ip_whitelist'
  | 'admin_price_calculator'
  | 'static_preview'
  | 'notifications'
  | 'profile';

export interface StaticPreviewConfig {
  moduleName: string;
  featureTitle: string;
  description?: string;
  backScreen: ScreenId;
}

export interface SnackBarMessage {
  id: number;
  text: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

export interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FinanceTaskItem {
  id: string;
  label: string;
  value: number;
  infoTooltip?: string;
  icon:
    | 'payment_confirmations'
    | 'awaiting_confirmations'
    | 'receipt_vouchers'
    | 'purchase_approval'
    | 'sale_approval'
    | 'open_ticket'
    | 'awaiting_documents';
}

export interface BalanceSummaryItem {
  id: string;
  label: string;
  maskedValue: string;
  actualValue: string;
  icon: 'banks' | 'cash' | 'inventory' | 'contractor' | 'receivable' | 'payables';
}

export interface ContainerForecastMonth {
  month: string;
  delivered: number;
  confirmed: number;
}

export interface PendingPaymentItem {
  id: string;
  customerName: string;
  marketingPersonal: string;
  totalInvoiceAmount: string;
  totalReceivedAmount: string;
  totalSaleReturnAmount: string;
  totalJvAdjAmount: string;
  remainingAdvance: string;
  totalRemainingAmount: string;
  gateOutDate: string;
  portOfDischarge: string;
  isNegative?: boolean;
}

// 1. Finance Tasks (Total 39)
export const FINANCE_TASKS: FinanceTaskItem[] = [
  {
    id: 'payment_confirmations',
    label: 'PAYMENT CONFIRMATIONS',
    value: 2,
    infoTooltip: 'Payment confirmations pending review',
    icon: 'payment_confirmations',
  },
  {
    id: 'awaiting_confirmations',
    label: 'AWAITING CONFIRMATIONS',
    value: 0,
    infoTooltip: 'Transactions awaiting customer confirmation',
    icon: 'awaiting_confirmations',
  },
  {
    id: 'awaiting_receipt_vouchers',
    label: 'AWAITING RECEIPT VOUCHERS',
    value: 0,
    infoTooltip: 'Receipt vouchers pending creation',
    icon: 'receipt_vouchers',
  },
  {
    id: 'purchase_invoice_approval',
    label: 'PURCHASE INVOICE APPROVAL',
    value: 0,
    icon: 'purchase_approval',
  },
  {
    id: 'sale_invoice_approval',
    label: 'SALE INVOICE APPROVAL',
    value: 0,
    icon: 'sale_approval',
  },
  {
    id: 'open_ticket',
    label: 'OPEN TICKET',
    value: 37,
    infoTooltip: 'Open finance tickets awaiting resolution',
    icon: 'open_ticket',
  },
  {
    id: 'awaiting_documents',
    label: 'AWAITING DOCUMENTS',
    value: 0,
    icon: 'awaiting_documents',
  },
];

// 2. Balance Summary Items
export const FINANCE_BALANCE_ITEMS: BalanceSummaryItem[] = [
  {
    id: 'banks',
    label: 'BANKS',
    maskedValue: 'USD ••••••••',
    actualValue: 'USD 425,800.00',
    icon: 'banks',
  },
  {
    id: 'cash_in_hand',
    label: 'CASH IN HAND',
    maskedValue: 'USD ••••••••',
    actualValue: 'USD 78,450.00',
    icon: 'cash',
  },
  {
    id: 'inventory_in_hand',
    label: 'INVENTORY IN HAND',
    maskedValue: 'USD ••••••••',
    actualValue: 'USD 1,240,500.00',
    icon: 'inventory',
  },
  {
    id: 'advance_to_contractor',
    label: 'ADVANCE TO CONTRACTOR',
    maskedValue: 'USD ••••••••',
    actualValue: 'USD 115,200.00',
    icon: 'contractor',
  },
  {
    id: 'receivable_from_customer',
    label: 'RECEIVABLE FROM CUSTOMER',
    maskedValue: 'USD ••••••••',
    actualValue: 'USD 892,300.00',
    icon: 'receivable',
  },
  {
    id: 'accounts_payables',
    label: 'ACCOUNTS PAYABLES',
    maskedValue: 'USD ••••••••',
    actualValue: 'USD 340,150.00',
    icon: 'payables',
  },
];

export const FINANCE_COMPANY_OPTIONS = [
  'Select Company',
  'CO-001 - Soneri International General Trading LLC (SID)',
  'CO-002 - Soneri Food Industries LLC',
  'CO-003 - Soneri Logistics Ltd',
];

// 3. Container Wise Forecast Bar Chart Data (Jan - Dec)
export const CONTAINER_WISE_FORECAST_DATA: ContainerForecastMonth[] = [
  { month: 'JAN', delivered: 74, confirmed: 1 },
  { month: 'FEB', delivered: 71, confirmed: 4 },
  { month: 'MAR', delivered: 53, confirmed: 0 },
  { month: 'APR', delivered: 72, confirmed: 1 },
  { month: 'MAY', delivered: 73, confirmed: 2 },
  { month: 'JUN', delivered: 63, confirmed: 1 },
  { month: 'JUL', delivered: 65, confirmed: 3 },
  { month: 'AUG', delivered: 59, confirmed: 17 },
  { month: 'SEP', delivered: 3, confirmed: 53 },
  { month: 'OCT', delivered: 0, confirmed: 27 },
  { month: 'NOV', delivered: 0, confirmed: 10 },
  { month: 'DEC', delivered: 0, confirmed: 9 },
];

// 4. Operating Expense Intelligence
export const OPERATING_EXPENSE_DATA = {
  currentYearLabel: 'Current year 2026',
  currentYearValue: '8.88%',
  currentYearPercent: 8.88,
  previousYearLabel: 'Previous year 2025',
  previousYearValue: '0.02%',
  previousYearPercent: 0.02,
  changeLabel: 'Change vs 2025',
  changeTag: '+100.0%',
  changeValue: '8.86%',
};

// 5. Pending Payments Table
export const PENDING_PAYMENTS_DATA: PendingPaymentItem[] = [
  {
    id: 'cu-057',
    customerName: 'CU-057 - ADE KOMPANI DOOEL',
    marketingPersonal: 'BILAL',
    totalInvoiceAmount: '$ 30,303',
    totalReceivedAmount: '$ 25,303.8500',
    totalSaleReturnAmount: '$ 0',
    totalJvAdjAmount: '$ 0',
    remainingAdvance: '$ 0',
    totalRemainingAmount: '$ 4,999.1500',
    gateOutDate: '12/08/2026',
    portOfDischarge: 'Skopje',
    isNegative: false,
  },
  {
    id: 'cu-238',
    customerName: 'CU-238 - AHA TRADING',
    marketingPersonal: 'ANUM KHAN',
    totalInvoiceAmount: '$ 44,980',
    totalReceivedAmount: '$ 44,962.0000',
    totalSaleReturnAmount: '$ 0',
    totalJvAdjAmount: '$ 0',
    remainingAdvance: '$ 0',
    totalRemainingAmount: '$ 18.0000',
    gateOutDate: '05/09/2026',
    portOfDischarge: 'Jebel Ali',
    isNegative: false,
  },
  {
    id: 'cu-092',
    customerName: 'CU-092 - AL ABBAS FOR GENERAL TRADING',
    marketingPersonal: 'PERVAIZ MORANI',
    totalInvoiceAmount: '$ 108,906.25',
    totalReceivedAmount: '$ 63,438.5000',
    totalSaleReturnAmount: '$ 0',
    totalJvAdjAmount: '$ 736.5',
    remainingAdvance: '$ 29,797.48',
    totalRemainingAmount: '$ 15,670.2700',
    gateOutDate: '28/07/2026',
    portOfDischarge: 'Aqaba',
    isNegative: false,
  },
  {
    id: 'cu-121',
    customerName: 'CU-121 - AL MAGHALI COMPANY FOR TRADING & AGENCIES LTD',
    marketingPersonal: 'AYAZ',
    totalInvoiceAmount: '$ 38,580',
    totalReceivedAmount: '$ 0',
    totalSaleReturnAmount: '$ 0',
    totalJvAdjAmount: '$ 28,580',
    remainingAdvance: '$ 0',
    totalRemainingAmount: '$ 10,000.0000',
    gateOutDate: '18/08/2026',
    portOfDischarge: 'Aden',
    isNegative: false,
  },
  {
    id: 'cu-150',
    customerName: 'CU-150 - AL NAJAH GENERAL TRADING',
    marketingPersonal: 'TEHSEENA',
    totalInvoiceAmount: '$ 19,200',
    totalReceivedAmount: '$ 19,212.1125',
    totalSaleReturnAmount: '$ 0',
    totalJvAdjAmount: '$ 0',
    remainingAdvance: '$ 0',
    totalRemainingAmount: '$ (12.1125)',
    gateOutDate: '02/09/2026',
    portOfDischarge: 'Beirut',
    isNegative: true,
  },
  {
    id: 'cu-063',
    customerName: 'CU-063 - AL-HASHIM CO. FOR GENERAL TRADE & AGENCIES',
    marketingPersonal: 'BILAL',
    totalInvoiceAmount: '$ 41,975',
    totalReceivedAmount: '$ 41,975',
    totalSaleReturnAmount: '$ 0',
    totalJvAdjAmount: '$ 1,425',
    remainingAdvance: '$ 0',
    totalRemainingAmount: '$ (1,425.0000)',
    gateOutDate: '22/08/2026',
    portOfDischarge: 'Jeddah',
    isNegative: true,
  },
  {
    id: 'cu-048',
    customerName: 'CU-048 - AL-MOSHRAA COMPANY FOR TRADING & COOLING LTD',
    marketingPersonal: 'HASSAN KHANIA',
    totalInvoiceAmount: '$ 280,394.75',
    totalReceivedAmount: '$ 280,394.75',
    totalSaleReturnAmount: '$ 0',
    totalJvAdjAmount: '$ 6,250',
    remainingAdvance: '$ 24,680',
    totalRemainingAmount: '$ (6,250.0000)',
    gateOutDate: '15/07/2026',
    portOfDischarge: 'Tripoli',
    isNegative: true,
  },
];

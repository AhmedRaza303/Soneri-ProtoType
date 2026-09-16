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

export interface PendingPaymentContainer {
  containerType: string;
  containerNo: string;
  gateOutDate: string;
  etaDate: string;
  blNumber: string;
}

export interface PendingPaymentShipment {
  shipmentCode: string;
  shipmentCreatedDate: string;
  freightInvoiceDocument: string;
  blCopyDocument: string;
  containers: PendingPaymentContainer[];
}

export interface PendingPaymentInvoice {
  inquiryCode: string;
  invoiceCode: string;
  noOfDays: number;
  invoiceAmount: string;
  saleReturn: {
    total: string;
    otherPiAdj: string;
    srJvAdj: string;
  };
  jvAdjAmount: string;
  remainingAdvance: string;
  adjAdvance: string;
  saleInvoiceDocument: string;
  shipments: PendingPaymentShipment[];
}

export interface PendingPaymentProforma {
  proformaCode: string;
  company: string;
  marketingPersonal: string;
  placeOfDelivery: string;
  portOfDischarge: string;
  advance: string;
  totalInvoicedAmount: string;
  totalPaidAmount: string;
  totalRemainingAmount: string;
  invoices: PendingPaymentInvoice[];
}

export interface PendingPaymentItem {
  id: string;
  customerName: string;
  /** @deprecated prefer proformas[].marketingPersonal */
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
  proformas: PendingPaymentProforma[];
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

const SID = 'CO-001 - Soneri International General Trading LLC (SID)';

// 5. Pending Payments Table (nested: Customer → Proforma → Invoice → Shipment → Container)
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
    gateOutDate: '18/03/2026',
    portOfDischarge: 'PT-005 - Durres',
    isNegative: false,
    proformas: [
      {
        proformaCode: 'PI-175',
        company: SID,
        marketingPersonal: 'BILAL',
        placeOfDelivery: 'North Macedonia',
        portOfDischarge: 'PT-005 - Durres',
        advance: '$ 5,000',
        totalInvoicedAmount: '$ 30,303',
        totalPaidAmount: '$ 20,303.85',
        totalRemainingAmount: '$ 4,999.15',
        invoices: [
          {
            inquiryCode: 'EI-255',
            invoiceCode: 'SI-187',
            noOfDays: 291,
            invoiceAmount: '$ 30,303',
            saleReturn: { total: '$ 0', otherPiAdj: '$ 0', srJvAdj: '$ 0' },
            jvAdjAmount: '$ 0',
            remainingAdvance: '$ 0',
            adjAdvance: '$ 5,000',
            saleInvoiceDocument: '-',
            shipments: [
              {
                shipmentCode: 'ES-170',
                shipmentCreatedDate: '13/03/2026',
                freightInvoiceDocument: '-',
                blCopyDocument: '-',
                containers: [
                  {
                    containerType: 'Container A (40 ft HC)',
                    containerNo: 'MSNU9185923',
                    gateOutDate: '18/03/2026',
                    etaDate: '17/03/2026',
                    blNumber: 'EBKG14815923',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
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
    portOfDischarge: 'PT-401 - Jebel Ali',
    isNegative: false,
    proformas: [
      {
        proformaCode: 'PI-402',
        company: SID,
        marketingPersonal: 'ANUM KHAN',
        placeOfDelivery: 'United Arab Emirates',
        portOfDischarge: 'PT-401 - Jebel Ali',
        advance: '$ 0',
        totalInvoicedAmount: '$ 44,980',
        totalPaidAmount: '$ 44,962.0000',
        totalRemainingAmount: '$ 18.0000',
        invoices: [
          {
            inquiryCode: 'EI-310',
            invoiceCode: 'SI-290',
            noOfDays: 45,
            invoiceAmount: '$ 44,980',
            saleReturn: { total: '$ 0', otherPiAdj: '$ 0', srJvAdj: '$ 0' },
            jvAdjAmount: '$ 0',
            remainingAdvance: '$ 0',
            adjAdvance: '$ 0',
            saleInvoiceDocument: '-',
            shipments: [
              {
                shipmentCode: 'ES-288',
                shipmentCreatedDate: '20/08/2026',
                freightInvoiceDocument: '-',
                blCopyDocument: '-',
                containers: [
                  {
                    containerType: 'Container A (40 ft HC)',
                    containerNo: 'TCLU5512098',
                    gateOutDate: '05/09/2026',
                    etaDate: '01/09/2026',
                    blNumber: 'UAE8822101',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
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
    portOfDischarge: 'PT-824 - Aqaba',
    isNegative: false,
    proformas: [
      {
        proformaCode: 'PI-688',
        company: SID,
        marketingPersonal: 'PERVAIZ MORANI',
        placeOfDelivery: 'Jordan',
        portOfDischarge: 'PT-824 - Aqaba',
        advance: '$ 29,797.48',
        totalInvoicedAmount: '$ 108,906.25',
        totalPaidAmount: '$ 63,438.5000',
        totalRemainingAmount: '$ 15,670.2700',
        invoices: [
          {
            inquiryCode: 'EI-520',
            invoiceCode: 'SI-441',
            noOfDays: 120,
            invoiceAmount: '$ 108,906.25',
            saleReturn: { total: '$ 0', otherPiAdj: '$ 0', srJvAdj: '$ 0' },
            jvAdjAmount: '$ 736.5',
            remainingAdvance: '$ 29,797.48',
            adjAdvance: '$ 29,797.48',
            saleInvoiceDocument: '-',
            shipments: [
              {
                shipmentCode: 'ES-410',
                shipmentCreatedDate: '10/06/2026',
                freightInvoiceDocument: '-',
                blCopyDocument: '-',
                containers: [
                  {
                    containerType: 'Container A (40 ft HC)',
                    containerNo: 'MSCU2201988',
                    gateOutDate: '28/07/2026',
                    etaDate: '15/07/2026',
                    blNumber: 'AQB9910022',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
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
    portOfDischarge: 'PT-901 - Aden',
    isNegative: false,
    proformas: [
      {
        proformaCode: 'PI-755',
        company: SID,
        marketingPersonal: 'AYAZ',
        placeOfDelivery: 'Yemen',
        portOfDischarge: 'PT-901 - Aden',
        advance: '$ 0',
        totalInvoicedAmount: '$ 38,580',
        totalPaidAmount: '$ 0',
        totalRemainingAmount: '$ 10,000.0000',
        invoices: [
          {
            inquiryCode: 'EI-601',
            invoiceCode: 'SI-502',
            noOfDays: 88,
            invoiceAmount: '$ 38,580',
            saleReturn: { total: '$ 0', otherPiAdj: '$ 0', srJvAdj: '$ 0' },
            jvAdjAmount: '$ 28,580',
            remainingAdvance: '$ 0',
            adjAdvance: '$ 0',
            saleInvoiceDocument: '-',
            shipments: [
              {
                shipmentCode: 'ES-490',
                shipmentCreatedDate: '01/07/2026',
                freightInvoiceDocument: '-',
                blCopyDocument: '-',
                containers: [
                  {
                    containerType: 'Container A (20 ft)',
                    containerNo: 'HLCU4412099',
                    gateOutDate: '18/08/2026',
                    etaDate: '10/08/2026',
                    blNumber: 'ADN2201988',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
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
    portOfDischarge: 'PT-310 - Beirut',
    isNegative: true,
    proformas: [
      {
        proformaCode: 'PI-812',
        company: SID,
        marketingPersonal: 'TEHSEENA',
        placeOfDelivery: 'Lebanon',
        portOfDischarge: 'PT-310 - Beirut',
        advance: '$ 0',
        totalInvoicedAmount: '$ 19,200',
        totalPaidAmount: '$ 19,212.1125',
        totalRemainingAmount: '$ (12.1125)',
        invoices: [
          {
            inquiryCode: 'EI-670',
            invoiceCode: 'SI-555',
            noOfDays: 30,
            invoiceAmount: '$ 19,200',
            saleReturn: { total: '$ 0', otherPiAdj: '$ 0', srJvAdj: '$ 0' },
            jvAdjAmount: '$ 0',
            remainingAdvance: '$ 0',
            adjAdvance: '$ 0',
            saleInvoiceDocument: '-',
            shipments: [
              {
                shipmentCode: 'ES-530',
                shipmentCreatedDate: '12/08/2026',
                freightInvoiceDocument: '-',
                blCopyDocument: '-',
                containers: [
                  {
                    containerType: 'Container A (40 ft HC)',
                    containerNo: 'BEYU9910021',
                    gateOutDate: '02/09/2026',
                    etaDate: '28/08/2026',
                    blNumber: 'LBR4412090',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
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
    portOfDischarge: 'PT-120 - Jeddah',
    isNegative: true,
    proformas: [
      {
        proformaCode: 'PI-795',
        company: SID,
        marketingPersonal: 'BILAL',
        placeOfDelivery: 'Saudi Arabia',
        portOfDischarge: 'PT-120 - Jeddah',
        advance: '$ 0',
        totalInvoicedAmount: '$ 41,975',
        totalPaidAmount: '$ 41,975',
        totalRemainingAmount: '$ (1,425.0000)',
        invoices: [
          {
            inquiryCode: 'EI-640',
            invoiceCode: 'SI-530',
            noOfDays: 55,
            invoiceAmount: '$ 41,975',
            saleReturn: { total: '$ 0', otherPiAdj: '$ 0', srJvAdj: '$ 0' },
            jvAdjAmount: '$ 1,425',
            remainingAdvance: '$ 0',
            adjAdvance: '$ 0',
            saleInvoiceDocument: '-',
            shipments: [
              {
                shipmentCode: 'ES-505',
                shipmentCreatedDate: '01/08/2026',
                freightInvoiceDocument: '-',
                blCopyDocument: '-',
                containers: [
                  {
                    containerType: 'Container A (40 ft HC)',
                    containerNo: 'JEDU2201987',
                    gateOutDate: '22/08/2026',
                    etaDate: '18/08/2026',
                    blNumber: 'KSA9981200',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
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
    portOfDischarge: 'PT-880 - Tripoli',
    isNegative: true,
    proformas: [
      {
        proformaCode: 'PI-620',
        company: SID,
        marketingPersonal: 'HASSAN KHANIA',
        placeOfDelivery: 'Libya',
        portOfDischarge: 'PT-880 - Tripoli',
        advance: '$ 24,680',
        totalInvoicedAmount: '$ 280,394.75',
        totalPaidAmount: '$ 280,394.75',
        totalRemainingAmount: '$ (6,250.0000)',
        invoices: [
          {
            inquiryCode: 'EI-480',
            invoiceCode: 'SI-400',
            noOfDays: 150,
            invoiceAmount: '$ 280,394.75',
            saleReturn: { total: '$ 0', otherPiAdj: '$ 0', srJvAdj: '$ 0' },
            jvAdjAmount: '$ 6,250',
            remainingAdvance: '$ 24,680',
            adjAdvance: '$ 24,680',
            saleInvoiceDocument: '-',
            shipments: [
              {
                shipmentCode: 'ES-380',
                shipmentCreatedDate: '20/05/2026',
                freightInvoiceDocument: '-',
                blCopyDocument: '-',
                containers: [
                  {
                    containerType: 'Container A (40 ft HC)',
                    containerNo: 'TRPU1102988',
                    gateOutDate: '15/07/2026',
                    etaDate: '01/07/2026',
                    blNumber: 'LBY7712099',
                  },
                  {
                    containerType: 'Container B (40 ft HC)',
                    containerNo: 'TRPU1102999',
                    gateOutDate: '15/07/2026',
                    etaDate: '01/07/2026',
                    blNumber: 'LBY7712099',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

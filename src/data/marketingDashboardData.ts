/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MarketingFollowUpItem {
  id: string;
  label: string;
  value: string | number;
  subtitle: string;
  infoTooltip?: string;
  extraBadge?: {
    text: string;
    infoTooltip?: string;
  };
  icon: 'orders' | 'payments' | 'shipping' | 'quotations';
}

export interface MarketingTaskItem {
  id: string;
  label: string;
  value: number;
  subtitle: string;
  infoTooltip?: string;
  icon: 'ticket' | 'freight' | 'artwork' | 'container';
}

export interface PerformanceSummaryItem {
  criteria: string;
  infoTooltip?: string;
  currentMonth: number;
  splyMonth: number;
  percentageChangeMonth: string;
  yearToDate: number;
  splyYtd: number;
  percentageChangeYtd: string;
}

export interface ContainerDetail {
  containerType: string;
  containerNo: string;
  gateOutDate: string;
  etaDate: string;
  blNumber: string;
}

export interface ShipmentDetail {
  shipmentCode: string;
  shipmentCreatedDate: string;
  freightInvoiceDocument: string;
  blCopyDocument: string;
  containers: ContainerDetail[];
}

export interface InvoiceDetail {
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
  adjAdvance: string;
  saleInvoiceDocument: string;
  shipments: ShipmentDetail[];
}

export interface ProformaDetail {
  proformaCode: string;
  company: string;
  marketingPerson: string;
  placeOfDelivery: string;
  portOfDischarge: string;
  advance: string;
  totalPaidAmount: string;
  totalRemainingAmount: string;
  invoices: InvoiceDetail[];
}

export interface RecentDeliveredOrder {
  id: string;
  customerName: string;
  gateOutDate: string;
  totalInvoiceAmount: string;
  totalSaleReturnAmount: string;
  totalJvAdjAmount: string;
  remainingAdvance: string;
  totalRemainingAmount: string;
  proformas: ProformaDetail[];
}

export const MARKETING_PERSONNEL_OPTIONS = [
  'All Marketing Personal',
  'TEHSEENA .',
  'PERVAIZ MORANI',
  'ANUM KHAN',
  'BILAL',
];

// Follow-ups (Total 144)
export const MARKETING_FOLLOW_UPS: MarketingFollowUpItem[] = [
  {
    id: 'unconfirmed_orders',
    label: 'UNCONFIRMED ORDERS',
    value: 30,
    subtitle: 'Orders awaiting confirmation',
    icon: 'orders',
  },
  {
    id: 'pending_payments',
    label: 'PENDING PAYMENTS',
    value: '$ 951,635.031',
    subtitle: 'Payment follow-ups pending',
    infoTooltip: 'Payment follow-ups pending',
    icon: 'payments',
  },
  {
    id: 'pending_to_ship',
    label: 'PENDING TO SHIP',
    value: 104,
    extraBadge: {
      text: 'ALL 210',
      infoTooltip: 'All orders pending shipment',
    },
    subtitle: 'Orders pending shipment',
    infoTooltip: 'Orders pending shipment',
    icon: 'shipping',
  },
  {
    id: 'quotations',
    label: 'QUOTATIONS',
    value: 10,
    subtitle: 'Quotations pending proforma',
    infoTooltip: 'Quotations pending proforma',
    icon: 'quotations',
  },
];

// Tasks (Total 73)
export const MARKETING_TASKS: MarketingTaskItem[] = [
  {
    id: 'open_ticket',
    label: 'OPEN TICKET',
    value: 37,
    subtitle: 'Tickets still open',
    infoTooltip: 'Tickets still open',
    icon: 'ticket',
  },
  {
    id: 'pending_freight_confirmation',
    label: 'PENDING FREIGHT CONFIRMATION',
    value: 2,
    subtitle: 'Freight confirmation pending',
    icon: 'freight',
  },
  {
    id: 'pending_marketer_approval_artwork',
    label: 'PENDING MARKETER APPROVAL ARTWORK',
    value: 34,
    subtitle: 'Artwork approval pending',
    icon: 'artwork',
  },
  {
    id: 'pending_container_mapping',
    label: 'PENDING CONTAINER MAPPING',
    value: 0,
    subtitle: 'Container mapping pending',
    icon: 'container',
  },
];

// Performance Summary
export const PERFORMANCE_SUMMARY: PerformanceSummaryItem[] = [
  {
    criteria: 'Orders (Confirmed)',
    infoTooltip: 'Orders confirmed by sales/finance',
    currentMonth: 21,
    splyMonth: 0,
    percentageChangeMonth: '+100%',
    yearToDate: 677,
    splyYtd: 0,
    percentageChangeYtd: '+100%',
  },
  {
    criteria: 'Orders (Shipped)',
    infoTooltip: 'Orders shipped to destination',
    currentMonth: 17,
    splyMonth: 0,
    percentageChangeMonth: '+100%',
    yearToDate: 638,
    splyYtd: 0,
    percentageChangeYtd: '+100%',
  },
];

// Recent Delivered Orders (30 Days)
export const RECENT_DELIVERED_ORDERS: RecentDeliveredOrder[] = [
  {
    id: 'cu-045',
    customerName: 'CU-045 - Meeran ltd',
    gateOutDate: '09/08/2026',
    totalInvoiceAmount: '$ 11,271',
    totalSaleReturnAmount: '$ 0',
    totalJvAdjAmount: '$ 0',
    remainingAdvance: '$ 0',
    totalRemainingAmount: '$ 0.0000',
    proformas: [
      {
        proformaCode: 'PI-601',
        company: 'CO-001 - Soneri International General Trading LLC (SID)',
        marketingPerson: 'TEHSEENA .',
        placeOfDelivery: 'United Kingdom',
        portOfDischarge: 'PT-724 - London',
        advance: '$ 0',
        totalPaidAmount: '$ 11,271',
        totalRemainingAmount: '$ 0',
        invoices: [
          {
            inquiryCode: 'EI-456',
            invoiceCode: 'SI-379',
            noOfDays: 110,
            invoiceAmount: '$ 11,271',
            saleReturn: {
              total: '$ 0',
              otherPiAdj: '$ 0',
              srJvAdj: '$ 0',
            },
            jvAdjAmount: '$ 0',
            adjAdvance: '$ 0',
            saleInvoiceDocument: '-',
            shipments: [
              {
                shipmentCode: 'ES-352',
                shipmentCreatedDate: '20/05/2026',
                freightInvoiceDocument: '-',
                blCopyDocument: '-',
                containers: [
                  {
                    containerType: 'Container A (40 ft HC)',
                    containerNo: 'FFAU3332315',
                    gateOutDate: '09/08/2026',
                    etaDate: '07/07/2026',
                    blNumber: '2327978050',
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

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MarketingCriteria {
  eyebrow?: string;
  title?: string;
  items?: string[];
  description?: string;
  variant?: 'card' | 'dark';
  tintClassName?: string;
}

export interface MarketingFollowUpItem {
  id: string;
  label: string;
  value: string | number;
  subtitle: string;
  criteria?: MarketingCriteria;
  extraBadge?: {
    text: string;
    criteria?: MarketingCriteria;
  };
  icon: 'orders' | 'payments' | 'shipping' | 'quotations';
}

export interface MarketingTaskItem {
  id: string;
  label: string;
  value: number;
  subtitle: string;
  criteria?: MarketingCriteria;
  icon: 'ticket' | 'freight' | 'artwork' | 'container';
}

export interface PerformanceSummaryItem {
  criteria: string;
  tip?: MarketingCriteria;
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
    criteria: {
      title: 'Disclaimer',
      items: ['As per payment terms'],
      tintClassName: 'bg-cyan-50',
    },
    icon: 'payments',
  },
  {
    id: 'pending_to_ship',
    label: 'PENDING TO SHIP',
    value: 104,
    extraBadge: {
      text: 'ALL 210',
      criteria: {
        variant: 'dark',
        description: 'All orders pending shipment',
      },
    },
    subtitle: 'Orders pending shipment',
    criteria: {
      title: 'Disclaimer',
      items: ['All confirmed & shipped orders'],
      tintClassName: 'bg-violet-50',
    },
    icon: 'shipping',
  },
  {
    id: 'quotations',
    label: 'QUOTATIONS',
    value: 10,
    subtitle: 'Quotations pending proforma',
    criteria: {
      eyebrow: '(After 30 days of issuance)',
      title: 'Statuses not included:',
      items: [
        'Initiated',
        'Pending Customer Response',
        'Revision Needed',
        'Revision in Process',
      ],
      description: 'This count includes all quotation statuses except those listed above.',
      tintClassName: 'bg-orange-50',
    },
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
    criteria: {
      title: 'Statuses included:',
      items: ['Initiated'],
      description: 'This count includes all above statuses of tickets.',
      tintClassName: 'bg-emerald-50',
    },
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
    tip: {
      variant: 'dark',
      description: 'Includes proformas that are confirmed, based on their confirmation date.',
    },
    currentMonth: 21,
    splyMonth: 0,
    percentageChangeMonth: '+100%',
    yearToDate: 677,
    splyYtd: 0,
    percentageChangeYtd: '+100%',
  },
  {
    criteria: 'Orders (Shipped)',
    tip: {
      variant: 'dark',
      description: 'Includes orders based on their shipment created date.',
    },
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
  {
    id: 'cu-057',
    customerName: 'CU-057 - ADE KOMPANI DOOEL',
    gateOutDate: '12/08/2026',
    totalInvoiceAmount: '$ 148,957.75',
    totalSaleReturnAmount: '$ 0.0000',
    totalJvAdjAmount: '$ 0.0000',
    remainingAdvance: '$ 0.0000',
    totalRemainingAmount: '$(12.1125)',
    proformas: [
      {
        proformaCode: 'PI-175',
        company: 'CO-001 - Soneri International General Trading LLC (SID)',
        marketingPerson: 'BILAL',
        placeOfDelivery: 'North Macedonia',
        portOfDischarge: 'PT-510 - Skopje',
        advance: '$ 0.0000',
        totalPaidAmount: '$ 148,969.8625',
        totalRemainingAmount: '$(12.1125)',
        invoices: [
          {
            inquiryCode: 'EI-255',
            invoiceCode: 'SI-187',
            noOfDays: 85,
            invoiceAmount: '$ 148,957.75',
            saleReturn: {
              total: '$ 0.0000',
              otherPiAdj: '$ 0.0000',
              srJvAdj: '$ 0.0000',
            },
            jvAdjAmount: '$ 0.0000',
            adjAdvance: '$ 0.0000',
            saleInvoiceDocument: '-',
            shipments: [
              {
                shipmentCode: 'ES-170',
                shipmentCreatedDate: '18/05/2026',
                freightInvoiceDocument: '-',
                blCopyDocument: '-',
                containers: [
                  {
                    containerType: 'Container A (40 ft HC)',
                    containerNo: 'FFAU2109844',
                    gateOutDate: '12/08/2026',
                    etaDate: '01/07/2026',
                    blNumber: '2326401120',
                  },
                  {
                    containerType: 'Container B (40 ft HC)',
                    containerNo: 'TCKU7120041',
                    gateOutDate: '12/08/2026',
                    etaDate: '01/07/2026',
                    blNumber: '2326401120',
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
    id: 'cu-129',
    customerName: 'CU-129 - GLOBAL MARKET BUSINESS LIMITED',
    gateOutDate: '15/08/2026',
    totalInvoiceAmount: '$ 86,420.50',
    totalSaleReturnAmount: '$ 1,200.0000',
    totalJvAdjAmount: '$ 0.0000',
    remainingAdvance: '$ 500.0000',
    totalRemainingAmount: '$ 2,450.0000',
    proformas: [
      {
        proformaCode: 'PI-908',
        company: 'CO-001 - Soneri International General Trading LLC (SID)',
        marketingPerson: 'SARIM',
        placeOfDelivery: 'Guatemala',
        portOfDischarge: 'PT-829 - Puerto Quetzal',
        advance: '$ 500.0000',
        totalPaidAmount: '$ 83,470.50',
        totalRemainingAmount: '$ 2,450.0000',
        invoices: [
          {
            inquiryCode: 'EI-801',
            invoiceCode: 'SI-640',
            noOfDays: 42,
            invoiceAmount: '$ 86,420.50',
            saleReturn: {
              total: '$ 1,200.0000',
              otherPiAdj: '$ 0.0000',
              srJvAdj: '$ 0.0000',
            },
            jvAdjAmount: '$ 0.0000',
            adjAdvance: '$ 500.0000',
            saleInvoiceDocument: '-',
            shipments: [
              {
                shipmentCode: 'ES-610',
                shipmentCreatedDate: '02/07/2026',
                freightInvoiceDocument: '-',
                blCopyDocument: '-',
                containers: [
                  {
                    containerType: 'Container A (40 ft HC)',
                    containerNo: 'MSCU4488210',
                    gateOutDate: '15/08/2026',
                    etaDate: '28/07/2026',
                    blNumber: 'MEDU9981201',
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
    id: 'cu-061',
    customerName: 'CU-061 - HIMPEX Overseas Ltd',
    gateOutDate: '18/08/2026',
    totalInvoiceAmount: '$ 54,310.00',
    totalSaleReturnAmount: '$ 0.0000',
    totalJvAdjAmount: '$ 250.0000',
    remainingAdvance: '$ 0.0000',
    totalRemainingAmount: '$(1,425.0000)',
    proformas: [
      {
        proformaCode: 'PI-842',
        company: 'CO-001 - Soneri International General Trading LLC (SID)',
        marketingPerson: 'ANUM KHAN',
        placeOfDelivery: 'Senegal',
        portOfDischarge: 'PT-210 - Dakar',
        advance: '$ 0.0000',
        totalPaidAmount: '$ 55,735.00',
        totalRemainingAmount: '$(1,425.0000)',
        invoices: [
          {
            inquiryCode: 'EI-712',
            invoiceCode: 'SI-588',
            noOfDays: 60,
            invoiceAmount: '$ 54,310.00',
            saleReturn: {
              total: '$ 0.0000',
              otherPiAdj: '$ 0.0000',
              srJvAdj: '$ 0.0000',
            },
            jvAdjAmount: '$ 250.0000',
            adjAdvance: '$ 0.0000',
            saleInvoiceDocument: '-',
            shipments: [
              {
                shipmentCode: 'ES-540',
                shipmentCreatedDate: '10/06/2026',
                freightInvoiceDocument: '-',
                blCopyDocument: '-',
                containers: [
                  {
                    containerType: 'Container A (20 ft)',
                    containerNo: 'TCLU9901123',
                    gateOutDate: '18/08/2026',
                    etaDate: '05/08/2026',
                    blNumber: 'HLCU4421990',
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

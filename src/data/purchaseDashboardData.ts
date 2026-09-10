/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PurchaseTaskItem {
  id: string;
  label: string;
  value: number;
  subtitle: string;
  infoTooltip?: string;
  icon: 'ticket' | 'artwork' | 'requisition' | 'order' | 'invoice';
}

export interface CROStatusBreakdown {
  applied: number;
  received: number;
  notApplied: number;
}

export interface ReadinessCard {
  label: string;
  value: number;
  subtitle: string;
  infoTooltip?: string;
}

export interface DelayedOrderItem {
  id: string;
  proformaCode: string;
  customerName: string;
  expectedDeliveryMonth: string;
  portOfDischarge: string;
  croType: 'Applied' | 'Received' | 'Not Applied';
  marketingPersonal: string;
  expandedDetails: {
    products: string[];
    requisitionsAndSuppliers: Array<{
      requisition: string;
      supplier: string;
    }>;
  };
}

// 1. Tasks
export const PURCHASE_TASKS: PurchaseTaskItem[] = [
  {
    id: 'open_ticket',
    label: 'OPEN TICKET',
    value: 37,
    subtitle: 'Tickets still open',
    infoTooltip: 'Open tickets awaiting resolution',
    icon: 'ticket',
  },
  {
    id: 'pending_purchase_approval_artwork',
    label: 'PENDING PURCHASE APPROVAL ARTWORK',
    value: 10,
    subtitle: 'Artwork awaiting purchase approval',
    icon: 'artwork',
  },
  {
    id: 'pending_requisition',
    label: 'PENDING REQUISITION',
    value: 3,
    subtitle: 'Requisitions pending action',
    icon: 'requisition',
  },
  {
    id: 'pending_purchase_order',
    label: 'PENDING PURCHASE ORDER',
    value: 0,
    subtitle: 'Purchase orders pending',
    icon: 'order',
  },
  {
    id: 'pending_purchase_invoice',
    label: 'PENDING PURCHASE INVOICE',
    value: 25,
    subtitle: 'Purchase invoices pending follow-up',
    icon: 'invoice',
  },
];

// 2. Current Month Performance (Total 240)
export const CURRENT_MONTH_PERFORMANCE = {
  total: 240,
  expectedReadiness: {
    label: 'EXPECTED READINESS',
    value: 52,
    subtitle: 'Shipments expected to be ready',
  },
  croStatus: {
    label: 'CRO STATUS',
    applied: 20,
    received: 17,
    notApplied: 15,
    subtitle: 'CRO applied, received and not applied',
  },
  pendingReadiness: {
    label: 'PENDING READINESS',
    value: 93,
    subtitle: 'Shipments pending readiness',
    infoTooltip: 'Shipments pending readiness',
  },
  pendingSurvey: {
    label: 'PENDING SURVEY',
    value: 43,
    subtitle: 'Surveys still pending',
    infoTooltip: 'Surveys still pending',
  },
};

// 3. Next Month Summary (Total 81)
export const NEXT_MONTH_SUMMARY = {
  total: 81,
  expectedReadiness: {
    label: 'EXPECTED READINESS',
    value: 27,
    subtitle: 'Shipments expected to be ready',
  },
  croStatus: {
    label: 'CRO STATUS',
    applied: 5,
    received: 2,
    notApplied: 20,
    subtitle: 'CRO applied, received and not applied',
  },
  pendingSurvey: {
    label: 'PENDING SURVEY',
    value: 27,
    subtitle: 'Surveys still pending',
    infoTooltip: 'Surveys still pending',
  },
};

// 4. Delayed Orders
export const DELAYED_ORDERS_TOOLTIP =
  'Includes finance-confirmed proformas with no shipment created, where the expected delivery month is more than 15 days overdue.';

export const DELAYED_ORDERS: DelayedOrderItem[] = [
  {
    id: 'pi-809',
    proformaCode: 'PI-809',
    customerName: 'CU-062 - SANZI IMP & EXP - NAMIBIA',
    expectedDeliveryMonth: 'Jul 2026',
    portOfDischarge: 'PT-484 - Walvis Bay',
    croType: 'Applied',
    marketingPersonal: 'PERVAIZ MORANI',
    expandedDetails: {
      products: ['PRD-223 Magic Ball', 'PRD-1012 Fruita Bon'],
      requisitionsAndSuppliers: [
        {
          requisition: 'RQ-955',
          supplier: 'SP-042 - SILVER LAKE FOOD INDUSTRIES',
        },
      ],
    },
  },
  {
    id: 'pi-802',
    proformaCode: 'PI-802',
    customerName: 'CU-051 - FACTORIA IBRAHIM',
    expectedDeliveryMonth: 'Jul 2026',
    portOfDischarge: 'PT-197 - Bata',
    croType: 'Not Applied',
    marketingPersonal: 'ANUM KHAN',
    expandedDetails: {
      products: ['PRD-104 Choco Crunch', 'PRD-401 Mini Drops'],
      requisitionsAndSuppliers: [
        {
          requisition: 'RQ-951',
          supplier: 'SP-025 - BM CONFECTIONERY',
        },
      ],
    },
  },
  {
    id: 'pi-799',
    proformaCode: 'PI-799',
    customerName: 'CU-257 - AL YASMIN COMPANY',
    expectedDeliveryMonth: 'Jul 2026',
    portOfDischarge: 'PT-831 - Mersin',
    croType: 'Not Applied',
    marketingPersonal: 'PERVAIZ MORANI',
    expandedDetails: {
      products: ['PRD-310 Milky Roll'],
      requisitionsAndSuppliers: [
        {
          requisition: 'RQ-948',
          supplier: 'SP-024 - DANPAK FOOD INDUSTRIES',
        },
      ],
    },
  },
  {
    id: 'pi-795',
    proformaCode: 'PI-795',
    customerName: 'CU-063 - AL-HASHIM CO. FOR GENERAL TRADE & AGENCIES',
    expectedDeliveryMonth: 'Jul 2026',
    portOfDischarge: 'PT-824 - Salalah',
    croType: 'Applied',
    marketingPersonal: 'BILAL',
    expandedDetails: {
      products: ['PRD-032 Bisclik Chocolate Wafer'],
      requisitionsAndSuppliers: [
        {
          requisition: 'RQ-942',
          supplier: 'SP-038 - KMG EXPORT MILLS',
        },
      ],
    },
  },
  {
    id: 'pi-794',
    proformaCode: 'PI-794',
    customerName: 'CU-092 - AL ABBAS FOR GENERAL TRADING',
    expectedDeliveryMonth: 'Jul 2026',
    portOfDischarge: 'PT-824 - Salalah',
    croType: 'Received',
    marketingPersonal: 'BILAL',
    expandedDetails: {
      products: ['PRD-036 Cliker Pop Candy'],
      requisitionsAndSuppliers: [
        {
          requisition: 'RQ-940',
          supplier: 'SP-026 - SUNRISE COMMODITIES FZE',
        },
      ],
    },
  },
  {
    id: 'pi-763',
    proformaCode: 'PI-763',
    customerName: 'CU-135 - MUNDI GLOBALES S.A.',
    expectedDeliveryMonth: 'Jul 2026',
    portOfDischarge: 'PT-274 - Puerto Barrios',
    croType: 'Received',
    marketingPersonal: 'ANUM KHAN',
    expandedDetails: {
      products: ['PRD-211 Gummy Bear Assorted'],
      requisitionsAndSuppliers: [
        {
          requisition: 'RQ-932',
          supplier: 'SP-027 - EUROPA PACKAGING SYSTEMS',
        },
      ],
    },
  },
  {
    id: 'pi-755',
    proformaCode: 'PI-755',
    customerName: 'CU-066 - AMA BOM BOM SWEETS',
    expectedDeliveryMonth: 'Jul 2026',
    portOfDischarge: 'PT-626 - Durban',
    croType: 'Applied',
    marketingPersonal: 'PERVAIZ MORANI',
    expandedDetails: {
      products: ['PRD-275 Rofill Chocolate Roll'],
      requisitionsAndSuppliers: [
        {
          requisition: 'RQ-928',
          supplier: 'SP-045 - AMBER PAPER PRODUCTS',
        },
      ],
    },
  },
  {
    id: 'pi-744',
    proformaCode: 'PI-744',
    customerName: 'CU-045 - Meeran ltd',
    expectedDeliveryMonth: 'Jul 2026',
    portOfDischarge: 'PT-724 - London',
    croType: 'Applied',
    marketingPersonal: 'TEHSEENA .',
    expandedDetails: {
      products: ['PRD-451 Picard Toffee Cream'],
      requisitionsAndSuppliers: [
        {
          requisition: 'RQ-921',
          supplier: 'SP-024 - DANPAK FOOD INDUSTRIES',
        },
      ],
    },
  },
  {
    id: 'pi-743',
    proformaCode: 'PI-743',
    customerName: 'CU-045 - Meeran ltd',
    expectedDeliveryMonth: 'Jul 2026',
    portOfDischarge: 'PT-724 - London',
    croType: 'Applied',
    marketingPersonal: 'TEHSEENA .',
    expandedDetails: {
      products: ['PRD-342 Conito Sweet Cone'],
      requisitionsAndSuppliers: [
        {
          requisition: 'RQ-919',
          supplier: 'SP-025 - BM CONFECTIONERY',
        },
      ],
    },
  },
  {
    id: 'pi-731',
    proformaCode: 'PI-731',
    customerName: 'CU-045 - Meeran ltd',
    expectedDeliveryMonth: 'Jul 2026',
    portOfDischarge: 'PT-724 - London',
    croType: 'Not Applied',
    marketingPersonal: 'TEHSEENA .',
    expandedDetails: {
      products: ['PRD-001 Boom Bubble Gum'],
      requisitionsAndSuppliers: [
        {
          requisition: 'RQ-912',
          supplier: 'SP-038 - KMG EXPORT MILLS',
        },
      ],
    },
  },
];

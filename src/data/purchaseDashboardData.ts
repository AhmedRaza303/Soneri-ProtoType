/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PurchaseCriteria {
  title?: string;
  items?: string[];
  description?: string;
  variant?: 'card' | 'dark';
  tintClassName?: string;
}

export interface PurchaseTaskItem {
  id: string;
  label: string;
  value: number;
  subtitle: string;
  criteria?: PurchaseCriteria;
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
  criteria?: PurchaseCriteria;
}

export interface DelayedOrderLineItem {
  product: string;
  /** Present when a requisition exists for this product */
  requisition?: string;
  supplier?: string;
}

export interface DelayedOrderItem {
  id: string;
  proformaCode: string;
  customerName: string;
  expectedDeliveryMonth: string;
  portOfDischarge: string;
  croType: 'Applied' | 'Received' | 'Not Applied';
  marketingPersonal: string;
  lineItems: DelayedOrderLineItem[];
}

// 1. Tasks
export const PURCHASE_TASKS: PurchaseTaskItem[] = [
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
    criteria: {
      items: ['Overall, finance confirmed order & rediness not added'],
      tintClassName: 'bg-amber-50',
    },
  },
  pendingSurvey: {
    label: 'PENDING SURVEY',
    value: 43,
    subtitle: 'Surveys still pending',
    criteria: {
      items: ['CRO Applied', 'Survey Pending'],
      description: 'Includes orders where CRO is applied and the survey is still pending.',
      tintClassName: 'bg-pink-50',
    },
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
    criteria: {
      items: ['CRO Applied', 'Survey Pending'],
      description: 'Includes orders where CRO is applied and the survey is still pending.',
      tintClassName: 'bg-pink-50',
    },
  },
};

// 4. Delayed Orders
export const DELAYED_ORDERS_CRITERIA: PurchaseCriteria = {
  variant: 'dark',
  description:
    'Includes finance-confirmed proformas with no shipment created, where the expected delivery month is more than 15 days overdue.',
};

/** @deprecated use DELAYED_ORDERS_CRITERIA.description */
export const DELAYED_ORDERS_TOOLTIP = DELAYED_ORDERS_CRITERIA.description!;

export const DELAYED_ORDERS: DelayedOrderItem[] = [
  {
    id: 'pi-809',
    proformaCode: 'PI-809',
    customerName: 'CU-062 - SANZI IMP & EXP - NAMIBIA',
    expectedDeliveryMonth: 'Jul 2026',
    portOfDischarge: 'PT-484 - Walvis Bay',
    croType: 'Applied',
    marketingPersonal: 'PERVAIZ MORANI',
    lineItems: [
      { product: 'PRD-223 Magic Ball' },
      {
        product: 'PRD-1012 Fruita Bon',
        requisition: 'RQ-955',
        supplier: 'SP-042 - SILVER LAKE FOOD INDUSTRIES',
      },
    ],
  },
  {
    id: 'pi-802',
    proformaCode: 'PI-802',
    customerName: 'CU-051 - FACTORIA IBRAHIM',
    expectedDeliveryMonth: 'Jul 2026',
    portOfDischarge: 'PT-197 - Bata',
    croType: 'Not Applied',
    marketingPersonal: 'ANUM KHAN',
    lineItems: [
      {
        product: 'PRD-104 Choco Crunch',
        requisition: 'RQ-951',
        supplier: 'SP-025 - BM CONFECTIONERY',
      },
      { product: 'PRD-401 Mini Drops' },
    ],
  },
  {
    id: 'pi-799',
    proformaCode: 'PI-799',
    customerName: 'CU-257 - AL YASMIN COMPANY',
    expectedDeliveryMonth: 'Jul 2026',
    portOfDischarge: 'PT-831 - Mersin',
    croType: 'Not Applied',
    marketingPersonal: 'PERVAIZ MORANI',
    lineItems: [
      {
        product: 'PRD-310 Milky Roll',
        requisition: 'RQ-948',
        supplier: 'SP-024 - DANPAK FOOD INDUSTRIES',
      },
    ],
  },
  {
    id: 'pi-795',
    proformaCode: 'PI-795',
    customerName: 'CU-063 - AL-HASHIM CO. FOR GENERAL TRADE & AGENCIES',
    expectedDeliveryMonth: 'Jul 2026',
    portOfDischarge: 'PT-824 - Salalah',
    croType: 'Applied',
    marketingPersonal: 'BILAL',
    lineItems: [
      { product: 'PRD-032 Bisclik Chocolate Wafer' },
      { product: 'PRD-033 Bisclik Vanilla Wafer' },
      {
        product: 'PRD-036 Cliker Pop Candy',
        requisition: 'RQ-942',
        supplier: 'SP-038 - KMG EXPORT MILLS',
      },
    ],
  },
  {
    id: 'pi-794',
    proformaCode: 'PI-794',
    customerName: 'CU-092 - AL ABBAS FOR GENERAL TRADING',
    expectedDeliveryMonth: 'Jul 2026',
    portOfDischarge: 'PT-824 - Salalah',
    croType: 'Received',
    marketingPersonal: 'BILAL',
    lineItems: [
      {
        product: 'PRD-036 Cliker Pop Candy',
        requisition: 'RQ-940',
        supplier: 'SP-026 - SUNRISE COMMODITIES FZE',
      },
    ],
  },
  {
    id: 'pi-763',
    proformaCode: 'PI-763',
    customerName: 'CU-135 - MUNDI GLOBALES S.A.',
    expectedDeliveryMonth: 'Jul 2026',
    portOfDischarge: 'PT-274 - Puerto Barrios',
    croType: 'Received',
    marketingPersonal: 'ANUM KHAN',
    lineItems: [
      { product: 'PRD-211 Gummy Bear Assorted' },
      {
        product: 'PRD-275 Rofill Chocolate Roll',
        requisition: 'RQ-932',
        supplier: 'SP-027 - EUROPA PACKAGING SYSTEMS',
      },
      { product: 'PRD-451 Picard Toffee Cream' },
    ],
  },
  {
    id: 'pi-755',
    proformaCode: 'PI-755',
    customerName: 'CU-066 - AMA BOM BOM SWEETS',
    expectedDeliveryMonth: 'Jul 2026',
    portOfDischarge: 'PT-626 - Durban',
    croType: 'Applied',
    marketingPersonal: 'PERVAIZ MORANI',
    lineItems: [
      {
        product: 'PRD-275 Rofill Chocolate Roll',
        requisition: 'RQ-928',
        supplier: 'SP-045 - AMBER PAPER PRODUCTS',
      },
    ],
  },
  {
    id: 'pi-744',
    proformaCode: 'PI-744',
    customerName: 'CU-045 - Meeran ltd',
    expectedDeliveryMonth: 'Jul 2026',
    portOfDischarge: 'PT-724 - London',
    croType: 'Applied',
    marketingPersonal: 'TEHSEENA .',
    lineItems: [
      { product: 'PRD-451 Picard Toffee Cream' },
      { product: 'PRD-499 Picard Butter Toffee' },
    ],
  },
  {
    id: 'pi-743',
    proformaCode: 'PI-743',
    customerName: 'CU-045 - Meeran ltd',
    expectedDeliveryMonth: 'Jul 2026',
    portOfDischarge: 'PT-724 - London',
    croType: 'Applied',
    marketingPersonal: 'TEHSEENA .',
    lineItems: [
      {
        product: 'PRD-342 Conito Sweet Cone',
        requisition: 'RQ-919',
        supplier: 'SP-025 - BM CONFECTIONERY',
      },
    ],
  },
  {
    id: 'pi-731',
    proformaCode: 'PI-731',
    customerName: 'CU-045 - Meeran ltd',
    expectedDeliveryMonth: 'Jul 2026',
    portOfDischarge: 'PT-724 - London',
    croType: 'Not Applied',
    marketingPersonal: 'TEHSEENA .',
    lineItems: [
      { product: 'PRD-001 Boom Bubble Gum' },
      { product: 'PRD-021 Boom Bubble Gum Blueberry' },
    ],
  },
];

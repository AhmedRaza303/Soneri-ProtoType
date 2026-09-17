/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ExportFollowUpItem {
  id: string;
  title: string;
  subtitle: string;
  value: number;
  icon: 'enquiry' | 'freight';
}

export interface ExportTaskCriteria {
  items: string[];
  description: string;
}

export interface ExportTaskItem {
  id: string;
  title: string;
  subtitle: string;
  value: number;
  /** Structured Criteria disclaimer shown on the info (i) icon */
  criteria?: ExportTaskCriteria;
  icon:
    | 'booking'
    | 'loading'
    | 'shipment'
    | 'invoice'
    | 'switch_bl'
    | 'purchase_invoice'
    | 'eta'
    | 'uncouriered';
}

export const EXPORT_FOLLOW_UPS: ExportFollowUpItem[] = [
  {
    id: 'pending_export_enquiries',
    title: 'Pending Export Enquiries',
    subtitle: 'Open enquiries awaiting export action',
    value: 16,
    icon: 'enquiry',
  },
  {
    id: 'pending_freight_confirmation',
    title: 'Pending Freight Confirmation',
    subtitle: 'Marketer freight confirmation pending',
    value: 2,
    icon: 'freight',
  },
];

export const EXPORT_TASKS: ExportTaskItem[] = [
  {
    id: 'booking_issuance',
    title: 'Booking Issuance',
    subtitle: 'Pending booking · marketer approved',
    value: 7,
    criteria: {
      items: ['Pending Booking', 'Marketer Approved'],
      description: 'Count of pending bookings that are marketer approved.',
    },
    icon: 'booking',
  },
  {
    id: 'pending_container_loading',
    title: 'Pending Container Loading',
    subtitle: 'Containers awaiting loading',
    value: 12,
    icon: 'loading',
  },
  {
    id: 'pending_export_shipment',
    title: 'Pending Export Shipment',
    subtitle: 'Shipments still pending creation',
    value: 9,
    icon: 'shipment',
  },
  {
    id: 'pending_sale_invoice',
    title: 'Pending Sale Invoice',
    subtitle: 'Sale invoices awaiting creation',
    value: 5,
    icon: 'invoice',
  },
  {
    id: 'pending_switch_bl',
    title: 'Pending Switch BL',
    subtitle: 'Switch Shipment Count',
    value: 3,
    criteria: {
      items: ['Shipment Created', 'Switch BL not checked'],
      description: 'Includes shipments created where Switch BL is still unchecked.',
    },
    icon: 'switch_bl',
  },
  {
    id: 'pending_purchase_invoice',
    title: 'Pending Purchase Invoice',
    subtitle: 'Booking created · purchase invoice missing',
    value: 4,
    criteria: {
      items: ['Booking Created', 'Purchase Invoice Not Created'],
      description: 'Includes bookings where the purchase invoice is still not created.',
    },
    icon: 'purchase_invoice',
  },
  {
    id: 'eta_alert',
    title: 'ETA Alert',
    subtitle: 'Active ETA alerts on tracking',
    value: 6,
    icon: 'eta',
  },
  {
    id: 'uncouriered_shipments',
    title: 'Uncouriered Shipments',
    subtitle: 'Shipment Count',
    value: 8,
    criteria: {
      items: ['Shipment Created', 'Doc Couriered not checked'],
      description: 'Includes created shipments that are still unchecked and not couriered.',
    },
    icon: 'uncouriered',
  },
];

export const MARKETING_PERSONNEL_OPTIONS = [
  'All Marketing Personal',
  'BILAL',
  'PERVAIZ MORANI',
  'TEHSEENA .',
  'ANUM KHAN',
  'SARIM',
  'AZHAR',
  'SHAMSUNISSA',
  'AATIKA',
  'AYAZ',
];

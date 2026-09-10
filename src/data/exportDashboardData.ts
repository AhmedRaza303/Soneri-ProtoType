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

export interface ExportTaskItem {
  id: string;
  title: string;
  subtitle: string;
  infoTooltip?: string;
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
    infoTooltip: 'Pending booking · marketer approved',
    icon: 'booking',
  },
  {
    id: 'pending_container_loading',
    title: 'Pending Container Loading',
    subtitle: 'Containers awaiting loading',
    icon: 'loading',
  },
  {
    id: 'pending_export_shipment',
    title: 'Pending Export Shipment',
    subtitle: 'Shipments still pending creation',
    icon: 'shipment',
  },
  {
    id: 'pending_sale_invoice',
    title: 'Pending Sale Invoice',
    subtitle: 'Sale invoices awaiting creation',
    icon: 'invoice',
  },
  {
    id: 'pending_switch_bl',
    title: 'Pending Switch BL',
    subtitle: 'Switch Shipment Count',
    infoTooltip: 'Switch Shipment Count',
    icon: 'switch_bl',
  },
  {
    id: 'pending_purchase_invoice',
    title: 'Pending Purchase Invoice',
    subtitle: 'Booking created · purchase invoice missing',
    infoTooltip: 'Booking created · purchase invoice missing',
    icon: 'purchase_invoice',
  },
  {
    id: 'eta_alert',
    title: 'ETA Alert',
    subtitle: 'Active ETA alerts on tracking',
    icon: 'eta',
  },
  {
    id: 'uncouriered_shipments',
    title: 'Uncouriered Shipments',
    subtitle: 'Shipment Count',
    infoTooltip: 'Shipment Count',
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

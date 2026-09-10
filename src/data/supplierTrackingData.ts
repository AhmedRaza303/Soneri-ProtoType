/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Supplier Tracking Report — mock data (image field parity)
 */

export type TrackStage =
  | 'packaging'
  | 'design'
  | 'material'
  | 'production'
  | 'qa'
  | 'cro';

export type StageTone = 'done' | 'active' | 'warn' | 'pending' | 'blocked';

export interface MaterialItem {
  label: string;
  status: string;
  tone: StageTone;
}

export interface TrackingProduct {
  id: string;
  name: string;
  variation: string;
  qty: string;
  packaging: string;
  packagingTone: StageTone;
  design: string;
  designTone: StageTone;
  designApproval: string;
  materials: MaterialItem[];
  production: string;
  productionTone: StageTone;
  productionSample: string;
  surveyor: string;
  qa: string;
  qaTone: StageTone;
}

export interface SupplierTrackingOrder {
  id: string;
  po: string;
  confirmDate: string;
  cutoffDate: string;
  agingDays: number;
  agingLabel: string;
  readiness: boolean;
  deliveryMonth: string;
  customer: string;
  company: string;
  port: string;
  marketing: string;
  containerType: string;
  containerQty: number;
  supplier: string;
  shipmentType: string;
  croStatus: string;
  croTone: StageTone;
  epNumber: string;
  lastUpdate: string;
  products: TrackingProduct[];
}

export const SUPPLIER_TRACKING: SupplierTrackingOrder[] = [
  {
    id: 'st1',
    po: 'PO-879',
    confirmDate: '28/08/2024',
    cutoffDate: '12/09/2024',
    agingDays: 14,
    agingLabel: '14 days ago',
    readiness: true,
    deliveryMonth: 'Oct 2024',
    customer: 'CU-050 - AL HASHIM TRADING',
    company: 'Soneri International',
    port: 'PORT SULMAN',
    marketing: 'BILAL',
    containerType: '40 ft HC',
    containerQty: 1,
    supplier: 'SP-047 - SKINCARE COMPANY',
    shipmentType: 'FCL',
    croStatus: 'Not Applied',
    croTone: 'blocked',
    epNumber: 'EP-4412',
    lastUpdate: 'PC · TANVIR · 08/09/2024 02:14 PM',
    products: [
      {
        id: 'p1',
        name: 'PRO-625 CANDY WHITENING FACE WASH 100 ML',
        variation: 'Turmeric',
        qty: '420 Carton',
        packaging: 'Customer Accepted',
        packagingTone: 'done',
        design: 'Approved',
        designTone: 'done',
        designApproval: '02/09/2024',
        materials: [
          { label: 'Box', status: 'Ready', tone: 'done' },
          { label: 'Sticker', status: 'In Process', tone: 'active' },
          { label: 'Master Carton', status: 'Pending', tone: 'pending' },
        ],
        production: 'In Process',
        productionTone: 'active',
        productionSample: 'Received',
        surveyor: 'SGS · Assigned',
        qa: 'Awaiting',
        qaTone: 'pending',
      },
      {
        id: 'p2',
        name: 'PRO-626 CANDY WHITENING FACE WASH 100 ML',
        variation: 'Papaya',
        qty: '380 Carton',
        packaging: 'Console',
        packagingTone: 'done',
        design: 'Approved',
        designTone: 'done',
        designApproval: '01/09/2024',
        materials: [
          { label: 'Box', status: 'Ready', tone: 'done' },
          { label: 'Sticker', status: 'Ready', tone: 'done' },
          { label: 'Master Carton', status: 'Ready', tone: 'done' },
        ],
        production: 'Started',
        productionTone: 'active',
        productionSample: 'Pending',
        surveyor: 'Not Assigned',
        qa: 'Pending',
        qaTone: 'pending',
      },
    ],
  },
  {
    id: 'st2',
    po: 'PO-759',
    confirmDate: '15/08/2024',
    cutoffDate: '01/09/2024',
    agingDays: 28,
    agingLabel: '28 days ago',
    readiness: false,
    deliveryMonth: 'Sep 2024',
    customer: 'CU-061 - HIMPEX SARL',
    company: 'Soneri Foods',
    port: 'ABIDJAN',
    marketing: 'PERVAIZ MORANI',
    containerType: '20 ft',
    containerQty: 2,
    supplier: 'SP-028 - ISMAIL INDUSTRIES',
    shipmentType: 'FCL',
    croStatus: 'Applied',
    croTone: 'done',
    epNumber: 'EP-4390',
    lastUpdate: 'QC · HASSAN · 07/09/2024 11:40 AM',
    products: [
      {
        id: 'p3',
        name: 'PRD-896 DULCILITO ROPE CHEW 8G 50 PCS BAG',
        variation: 'Tutti Frutti',
        qty: '1040 Carton',
        packaging: 'Customer Accepted',
        packagingTone: 'done',
        design: 'Approved',
        designTone: 'done',
        designApproval: '20/08/2024',
        materials: [
          { label: 'Box', status: 'Ready', tone: 'done' },
          { label: 'Sticker', status: 'Ready', tone: 'done' },
          { label: 'Master Carton', status: 'Ready', tone: 'done' },
        ],
        production: 'Completed',
        productionTone: 'done',
        productionSample: 'Approved',
        surveyor: 'Bureau Veritas',
        qa: 'Approved',
        qaTone: 'done',
      },
    ],
  },
  {
    id: 'st3',
    po: 'PO-912',
    confirmDate: '02/09/2024',
    cutoffDate: '18/09/2024',
    agingDays: 5,
    agingLabel: '5 days ago',
    readiness: true,
    deliveryMonth: 'Nov 2024',
    customer: 'CU-076 - ARIDIM',
    company: 'Soneri International',
    port: 'DAKAR',
    marketing: 'AYAZ',
    containerType: '40 ft HC',
    containerQty: 1,
    supplier: 'SP-029 - VOLKA FOOD',
    shipmentType: 'FCL',
    croStatus: 'Not Applied',
    croTone: 'blocked',
    epNumber: '-',
    lastUpdate: 'PC · SAIRA · 09/09/2024 09:05 AM',
    products: [
      {
        id: 'p4',
        name: 'BINGO SINGLE TWIST LOLLIPOP 18G 48 PCS',
        variation: 'Assorted',
        qty: '640 Carton',
        packaging: 'Pending Review',
        packagingTone: 'warn',
        design: 'Under Review',
        designTone: 'active',
        designApproval: '-',
        materials: [
          { label: 'Box', status: 'Pending', tone: 'pending' },
          { label: 'Sticker', status: 'Pending', tone: 'pending' },
          { label: 'Master Carton', status: 'Pending', tone: 'pending' },
        ],
        production: 'Not Started',
        productionTone: 'pending',
        productionSample: 'Not Required',
        surveyor: '-',
        qa: 'Pending',
        qaTone: 'pending',
      },
      {
        id: 'p5',
        name: 'CHOCOMINTA CENTER FILLED CANDY JAR',
        variation: 'Mint',
        qty: '520 Carton',
        packaging: 'Console',
        packagingTone: 'done',
        design: 'Artwork Needed',
        designTone: 'warn',
        designApproval: '-',
        materials: [
          { label: 'Box', status: 'In Process', tone: 'active' },
          { label: 'Sticker', status: 'Pending', tone: 'pending' },
          { label: 'Master Carton', status: 'Pending', tone: 'pending' },
        ],
        production: 'Not Started',
        productionTone: 'pending',
        productionSample: 'Pending',
        surveyor: '-',
        qa: 'Pending',
        qaTone: 'pending',
      },
    ],
  },
];

export const TRACK_STAGES: { key: TrackStage; label: string }[] = [
  { key: 'packaging', label: 'Pack' },
  { key: 'design', label: 'Design' },
  { key: 'material', label: 'Material' },
  { key: 'production', label: 'Prod' },
  { key: 'qa', label: 'QA' },
  { key: 'cro', label: 'CRO' },
];

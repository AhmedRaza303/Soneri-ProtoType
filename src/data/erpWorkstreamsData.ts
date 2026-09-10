/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ==========================================
// 1. FINANCE WORKSTREAMS
// ==========================================

export interface POApprovalItem {
  id: string;
  poNumber: string;
  supplierName: string;
  department: string;
  requester: string;
  orderDate: string;
  deliveryDate: string;
  currency: string;
  totalAmount: number;
  taxAmount: number;
  netAmount: number;
  status: 'Pending Approval' | 'Approved' | 'Rejected' | 'Under Review';
  priority: 'High' | 'Normal' | 'Urgent';
  paymentTerms: string;
  notes: string;
  items: {
    itemCode: string;
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    total: number;
  }[];
  approvals: {
    role: string;
    name: string;
    status: 'Approved' | 'Pending' | 'Rejected';
    date?: string;
  }[];
}

export const MOCK_PO_APPROVALS: POApprovalItem[] = [
  {
    id: 'po_app_1',
    poNumber: 'PO-2025-0842',
    supplierName: 'Indus Dyes & Chemicals Ltd',
    department: 'Dyeing & Processing',
    requester: 'M. Tariq (Plant Manager)',
    orderDate: '2025-02-18',
    deliveryDate: '2025-02-28',
    currency: 'PKR',
    totalAmount: 1850000,
    taxAmount: 333000,
    netAmount: 2183000,
    status: 'Pending Approval',
    priority: 'Urgent',
    paymentTerms: '30 Days Net from GRN',
    notes: 'Critical reactive dyes for export batch #EXP-4402 destined for Hamburg client.',
    items: [
      { itemCode: 'DYE-REC-BLU', description: 'Reactive Blue Direct Dye Grade A', quantity: 500, unit: 'Kg', unitPrice: 1800, total: 900000 },
      { itemCode: 'DYE-REC-RED', description: 'Reactive Scarlet Red Fastness 4.5', quantity: 350, unit: 'Kg', unitPrice: 2000, total: 700000 },
      { itemCode: 'CHM-FIX-AG', description: 'Cationic Dye Fixing Auxiliary Agent', quantity: 250, unit: 'Ltr', unitPrice: 1000, total: 250000 },
    ],
    approvals: [
      { role: 'Department Head', name: 'M. Tariq', status: 'Approved', date: '2025-02-18 10:15' },
      { role: 'Purchase Manager', name: 'Rushan Ahmed', status: 'Approved', date: '2025-02-18 14:30' },
      { role: 'Finance Director', name: 'M. Uzair', status: 'Pending' },
      { role: 'Managing Director', name: 'MD Soneri', status: 'Pending' },
    ],
  },
  {
    id: 'po_app_2',
    poNumber: 'PO-2025-0841',
    supplierName: 'Pak Poly Packaging Solutions',
    department: 'Packaging & Warehouse',
    requester: 'Asim Raza',
    orderDate: '2025-02-17',
    deliveryDate: '2025-02-24',
    currency: 'PKR',
    totalAmount: 640000,
    taxAmount: 115200,
    netAmount: 755200,
    status: 'Approved',
    priority: 'Normal',
    paymentTerms: '15 Days Net',
    notes: 'Heavy duty polyethylene moisture barrier liner bags for yarn carton export.',
    items: [
      { itemCode: 'PKG-LIN-01', description: 'Export Grade PE Liner Bags (40x48)', quantity: 8000, unit: 'Pcs', unitPrice: 55, total: 440000 },
      { itemCode: 'PKG-STP-02', description: 'PET Heavy Duty Strapping Band Rolls', quantity: 40, unit: 'Rolls', unitPrice: 5000, total: 200000 },
    ],
    approvals: [
      { role: 'Department Head', name: 'Asim Raza', status: 'Approved', date: '2025-02-17 11:00' },
      { role: 'Purchase Manager', name: 'Rushan Ahmed', status: 'Approved', date: '2025-02-17 15:40' },
      { role: 'Finance Director', name: 'M. Uzair', status: 'Approved', date: '2025-02-18 09:30' },
      { role: 'Managing Director', name: 'MD Soneri', status: 'Approved', date: '2025-02-18 11:00' },
    ],
  },
  {
    id: 'po_app_3',
    poNumber: 'PO-2025-0839',
    supplierName: 'Atlas Copco Compressors PK',
    department: 'Maintenance & Power',
    requester: 'Engr. Jameel Akhtar',
    orderDate: '2025-02-14',
    deliveryDate: '2025-03-05',
    currency: 'PKR',
    totalAmount: 4200000,
    taxAmount: 756000,
    netAmount: 4956000,
    status: 'Under Review',
    priority: 'High',
    paymentTerms: '50% Advance, 50% Post Commissioning',
    notes: 'Air compressor overhaul overhaul parts kit for Spinning Unit 2 airjet looms.',
    items: [
      { itemCode: 'CMP-SCR-KIT', description: 'Rotary Screw Element Overhaul Kit GA-75', quantity: 2, unit: 'Set', unitPrice: 1600000, total: 3200000 },
      { itemCode: 'CMP-SEP-FLT', description: 'Oil Separator & Intake Air Filters Set', quantity: 4, unit: 'Set', unitPrice: 250000, total: 1000000 },
    ],
    approvals: [
      { role: 'Department Head', name: 'Engr. Jameel', status: 'Approved', date: '2025-02-14 16:20' },
      { role: 'Purchase Manager', name: 'Rushan Ahmed', status: 'Approved', date: '2025-02-15 11:30' },
      { role: 'Finance Director', name: 'M. Uzair', status: 'Pending' },
      { role: 'Managing Director', name: 'MD Soneri', status: 'Pending' },
    ],
  },
];

export interface ProformaSupplierItem {
  id: string;
  proformaNumber: string;
  supplierName: string;
  originCountry: string;
  issueDate: string;
  dueDate: string;
  lcNumber: string;
  currency: string;
  amount: number;
  advancePercentage: number;
  advanceAmount: number;
  status: 'Awaiting Advance' | 'Under Review' | 'Fully Settled' | 'Partially Paid';
  bankName: string;
  ibanNumber: string;
  swiftCode: string;
  purpose: string;
  items: {
    description: string;
    hsCode: string;
    quantity: number;
    unit: string;
    rate: number;
    amount: number;
  }[];
}

export const MOCK_PROFORMA_SUPPLIERS: ProformaSupplierItem[] = [
  {
    id: 'prof_sup_1',
    proformaNumber: 'PI-SUP-8910',
    supplierName: 'Rieter Machine Works Ltd',
    originCountry: 'Switzerland',
    issueDate: '2025-02-10',
    dueDate: '2025-03-10',
    lcNumber: 'LC-MEZ-99021',
    currency: 'EUR',
    amount: 145000,
    advancePercentage: 30,
    advanceAmount: 43500,
    status: 'Awaiting Advance',
    bankName: 'UBS Switzerland AG, Zurich',
    ibanNumber: 'CH9300240240182341001',
    swiftCode: 'UBSWCHZH80A',
    purpose: 'Import of precision spinning spindle spare units & rotor cups for G38 spinning frames.',
    items: [
      { description: 'High-Speed Spindle Rotor Cups Dia 32mm', hsCode: '8448.3300', quantity: 600, unit: 'Pcs', rate: 125, amount: 75000 },
      { description: 'Precision Drafting Ceramic Guides Set', hsCode: '8448.3900', quantity: 200, unit: 'Set', rate: 350, amount: 70000 },
    ],
  },
  {
    id: 'prof_sup_2',
    proformaNumber: 'PI-SUP-8908',
    supplierName: 'Zhejiang Hengyi Petrochemicals',
    originCountry: 'China',
    issueDate: '2025-02-05',
    dueDate: '2025-02-25',
    lcNumber: 'LC-HBL-77412',
    currency: 'USD',
    amount: 86400,
    advancePercentage: 100,
    advanceAmount: 86400,
    status: 'Fully Settled',
    bankName: 'Bank of China, Hangzhou Branch',
    ibanNumber: 'CN1043310001829472910',
    swiftCode: 'BKCHCNBJ920',
    purpose: 'Polyester Staple Fiber 1.4D x 38mm Semi-Dull for poly-cotton blended yarn spinning.',
    items: [
      { description: 'Polyester Staple Fiber (PSF) Semi Dull 1.4D', hsCode: '5503.2000', quantity: 80, unit: 'Metric Tons', rate: 1080, amount: 86400 },
    ],
  },
  {
    id: 'prof_sup_3',
    proformaNumber: 'PI-SUP-8902',
    supplierName: 'Archroma Singapore Pte Ltd',
    originCountry: 'Singapore',
    issueDate: '2025-01-28',
    dueDate: '2025-02-28',
    lcNumber: 'LC-MEZ-98841',
    currency: 'USD',
    amount: 52300,
    advancePercentage: 50,
    advanceAmount: 26150,
    status: 'Partially Paid',
    bankName: 'DBS Bank Ltd Singapore',
    ibanNumber: 'SG18DBSS003891028471',
    swiftCode: 'DBSSSGSG',
    purpose: 'Eco-certified sulfur indigo dyeing auxiliaries for denim continuous range.',
    items: [
      { description: 'Denisol Indigo 30 Liq Eco Reducer', hsCode: '3204.1500', quantity: 12000, unit: 'Kg', rate: 3.20, amount: 38400 },
      { description: 'Diresul Smart Black RDT Dye', hsCode: '3204.1900', quantity: 3500, unit: 'Kg', rate: 3.97, amount: 13900 },
    ],
  },
];

// ==========================================
// 2. EXPORT WORKSTREAMS
// ==========================================

export interface ContainerTrackingItem {
  id: string;
  containerNumber: string;
  sizeType: '40ft High Cube' | '20ft Standard' | '40ft Standard';
  shippingLine: 'Maersk' | 'CMA CGM' | 'Hapag-Lloyd' | 'MSC';
  blNumber: string;
  vesselName: string;
  voyageNumber: string;
  portOfLoading: string;
  portOfDischarge: string;
  departureDate: string;
  eta: string;
  status: 'At Sea' | 'Customs Cleared' | 'Port Gate In' | 'Berthing' | 'Discharged';
  currentMilestoneIndex: number;
  sealNumber: string;
  grossWeightKg: number;
  totalCartons: number;
  cargoDescription: string;
  customerName: string;
  milestones: {
    title: string;
    location: string;
    date: string;
    completed: boolean;
  }[];
}

export const MOCK_CONTAINER_TRACKING: ContainerTrackingItem[] = [
  {
    id: 'cnt_01',
    containerNumber: 'MSKU-9081244',
    sizeType: '40ft High Cube',
    shippingLine: 'Maersk',
    blNumber: 'MAEU-9928104',
    vesselName: 'Maersk Mc-Kinney Moller',
    voyageNumber: '2501W',
    portOfLoading: 'Port Qasim, Karachi (PKBQM)',
    portOfDischarge: 'Port of Hamburg, Germany (DEHAM)',
    departureDate: '2025-02-12',
    eta: '2025-03-08',
    status: 'At Sea',
    currentMilestoneIndex: 4,
    sealNumber: 'PK-QAS-88129',
    grossWeightKg: 24650,
    totalCartons: 1120,
    cargoDescription: '100% Combed Cotton Ring Spun Weaving Yarn Ne 30/1 On Cones',
    customerName: 'Hanseatic Spinning Mills GmbH',
    milestones: [
      { title: 'Empty Dispatched from Depot', location: 'Karachi Central Depot', date: '2025-02-08 09:00', completed: true },
      { title: 'Factory Loading & Sealing', location: 'Soneri Mill No. 1 Raiwind', date: '2025-02-09 17:30', completed: true },
      { title: 'Port Gate In & Weighbridge', location: 'Qasim International Terminal', date: '2025-02-10 14:00', completed: true },
      { title: 'Pakistan Customs Export Cleared', location: 'Customs Collectorate PKBQM', date: '2025-02-11 11:20', completed: true },
      { title: 'Loaded on Vessel & Departed', location: 'Vessel Maersk Moller', date: '2025-02-12 04:15', completed: true },
      { title: 'Suez Canal Transit Crossing', location: 'Port Said, Egypt', date: '2025-02-26 (Est)', completed: false },
      { title: 'Vessel Arrival & Discharge', location: 'CTA Terminal Hamburg', date: '2025-03-08 (Est)', completed: false },
    ],
  },
  {
    id: 'cnt_02',
    containerNumber: 'CMAU-7721890',
    sizeType: '40ft High Cube',
    shippingLine: 'CMA CGM',
    blNumber: 'CMA-PK-749102',
    vesselName: 'CMA CGM Jacques Saade',
    voyageNumber: '092FL',
    portOfLoading: 'Karachi Port Trust, Karachi (PKKHI)',
    portOfDischarge: 'Jebel Ali Port, Dubai (AEJEA)',
    departureDate: '2025-02-16',
    eta: '2025-02-20',
    status: 'Berthing',
    currentMilestoneIndex: 5,
    sealNumber: 'PK-KHI-40918',
    grossWeightKg: 26100,
    totalCartons: 950,
    cargoDescription: 'Indigo Dyed Denim Fabrics 11.5 Oz Slub Stretch Finished 58 Inch',
    customerName: 'Al-Madina Garments FZE Dubai',
    milestones: [
      { title: 'Empty Dispatched from Depot', location: 'Keamari Depot KHI', date: '2025-02-13 10:00', completed: true },
      { title: 'Factory Loading & Sealing', location: 'Soneri Denim Mill Karachi', date: '2025-02-14 16:00', completed: true },
      { title: 'Port Gate In & Weighbridge', location: 'SAPT Terminal KHI', date: '2025-02-15 08:30', completed: true },
      { title: 'Customs Form E Examination Cleared', location: 'KPT Customs House', date: '2025-02-15 15:45', completed: true },
      { title: 'Loaded on Vessel & Departed', location: 'Berth 16 SAPT', date: '2025-02-16 02:00', completed: true },
      { title: 'Vessel Berthing at Jebel Ali', location: 'Terminal 2 Jebel Ali', date: '2025-02-20 08:00', completed: true },
      { title: 'Discharged to Consignee Yard', location: 'Al Quoz Industrial Dubai', date: '2025-02-21 (Est)', completed: false },
    ],
  },
  {
    id: 'cnt_03',
    containerNumber: 'HLCU-4402198',
    sizeType: '20ft Standard',
    shippingLine: 'Hapag-Lloyd',
    blNumber: 'HLCU-KHI-88219',
    vesselName: 'Al Jmeliyah',
    voyageNumber: '2504E',
    portOfLoading: 'Port Qasim, Karachi (PKBQM)',
    portOfDischarge: 'Port of New York / New Jersey (USNYC)',
    departureDate: '2025-02-04',
    eta: '2025-03-12',
    status: 'At Sea',
    currentMilestoneIndex: 4,
    sealNumber: 'HL-QAS-22108',
    grossWeightKg: 18200,
    totalCartons: 540,
    cargoDescription: '100% Organic Cotton Terry Bath Sheets 650 GSM OEKO-TEX 100',
    customerName: 'Manhattan Home Living LLC',
    milestones: [
      { title: 'Empty Dispatched from Depot', location: 'Qasim Depot', date: '2025-01-31 10:00', completed: true },
      { title: 'Factory Loading & Sealing', location: 'Soneri Home Textile Lahore', date: '2025-02-01 18:00', completed: true },
      { title: 'Port Gate In & Weighbridge', location: 'DP World QICT Terminal', date: '2025-02-02 12:00', completed: true },
      { title: 'Customs & US CBP Security Filing', location: 'Customs House Karachi', date: '2025-02-03 14:00', completed: true },
      { title: 'Loaded on Vessel & Departed', location: 'Berth QICT 2', date: '2025-02-04 06:30', completed: true },
      { title: 'Transshipment Hub Tanger Med', location: 'Tanger Med Morocco', date: '2025-02-22 (Est)', completed: false },
      { title: 'Port Newark Arrival & Clearance', location: 'Maher Terminals NJ', date: '2025-03-12 (Est)', completed: false },
    ],
  },
];

// ==========================================
// 3. PURCHASE WORKSTREAMS (SONERI ERP)
// ==========================================

export interface PurchaseRequisitionItem {
  id: string;
  requisitionCode: string;
  proformaCode: string;
  ticketCode: string;
  marketingPersonal: string;
  supplier: string;
  company: string;
  paymentProfile: string;
  status: string;
  proformaStatus: string;
  created: string;

  // View fields
  requisitionInfo?: {
    requisitionCode: string;
    paymentProfile: string;
    portOfLoading: string;
    portOfDischarge: string;
    placeOfDelivery: string;
    expectedDeliveryMonth: string;
    createdBy: string;
  };
  companyInfo?: {
    code: string;
    name: string;
  };
  supplierInfo?: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    email: string;
    website: string;
  };
  proformaInfo?: {
    proformaCode: string;
    generatedDate: string;
    expiryDate: string;
    quote: string;
    currency: string;
    incoTerm: string;
    freight: string;
    portOfDischarge: string;
    marketingPersonal: string;
  };
  containerMapping?: {
    containerSize: string;
    containerName: string;
    items: {
      thumbnail: string;
      productName: string;
      variation: string;
      quantity: string;
    }[];
    total: string;
  };
  products?: {
    thumbnail: string;
    productName: string;
    variations: string;
    quantity: string;
    shelfLifeDuration: string;
    cbm: string;
    weight: string;
    supplierPrice: string;
    artworkNeeded: string;
    supplierRemarks: string;
    notes: string;
  }[];
  portOfDischargeInstructions?: string[];
  requisitionInstructions?: string[];
  collectionInstructions?: string;
  containerSummary?: string;
  designNotes?: string;
  financeStatus?: {
    status: string;
    nextFollowUpDate: string;
    followUpAction: string;
    comments: string;
  };
  proformaRemarks?: string;
}

export const MOCK_PURCHASE_REQUISITIONS: PurchaseRequisitionItem[] = [
  {
    id: 'pr_1109',
    requisitionCode: 'RQ-1109',
    proformaCode: 'PI-903 > CU-102 > EVEREST SARL',
    ticketCode: '-',
    marketingPersonal: 'PERVAIZ MORANI',
    supplier: 'SP-027 - EUROPA INDUSTRIES',
    company: 'CO-001 - Soneri International General Trading LLC (SID)',
    paymentProfile: 'AFTER SHIPPED ON BOARD',
    status: 'Supplier Accepted',
    proformaStatus: 'Customer Accepted',
    created: 'TANVIR 07/09/2026',
    requisitionInfo: {
      requisitionCode: 'RQ-1109',
      paymentProfile: 'AFTER SHIPPED ON BOARD',
      portOfLoading: 'Port Qasim',
      portOfDischarge: 'PT-149 - Abidjan',
      placeOfDelivery: "Cote D'Ivoire (Ivory Coast)",
      expectedDeliveryMonth: '2026-09-01',
      createdBy: 'TANVIR',
    },
    companyInfo: {
      code: 'CO-001',
      name: 'Soneri International General Trading LLC',
    },
    supplierInfo: {
      name: 'SP-027 - EUROPA INDUSTRIES',
      address: 'Plot # E-1-C, SITE Super Highway, Phase II, Malir Town',
      city: 'Karachi',
      state: 'Sindh',
      country: 'Pakistan',
      phone: '923219234088',
      email: 'imran@europaindustries.pk',
      website: 'www.europaindustries.com',
    },
    proformaInfo: {
      proformaCode: 'PI-903 > CU-102 > EVEREST SARL',
      generatedDate: '07/09/2026',
      expiryDate: '06/08/2026',
      quote: 'QT-139',
      currency: 'United States Dollar',
      incoTerm: 'CNF',
      freight: '5000',
      portOfDischarge: 'PT-149 - Abidjan',
      marketingPersonal: 'PERVAIZ MORANI',
    },
    containerMapping: {
      containerSize: '40 ft HC',
      containerName: 'Container A',
      items: [
        {
          thumbnail: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=80&q=80',
          productName: 'PRD-940 BISKEES CENTER FILLED BISCUIT 115 GRAM (G) PER CUP, 24 CUPS PER CARTON',
          variation: 'Chocolate',
          quantity: '2075',
        },
      ],
      total: '2,075',
    },
    products: [
      {
        thumbnail: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=80&q=80',
        productName: 'PRD-940 BISKEES CENTER FILLED BISCUIT 115 GRAM (G) PER CUP, 24 CUPS PER CARTON',
        variations: 'Biscuit Flavor: Chocolate',
        quantity: '2075 Carton',
        shelfLifeDuration: '18 Months',
        cbm: '47.31',
        weight: '7,760.5 KG',
        supplierPrice: '$ 8.7500',
        artworkNeeded: 'Yes',
        supplierRemarks: '-',
        notes: '',
      },
    ],
    portOfDischargeInstructions: ['REQUIRED COC FOR THIS ORDER.'],
    requisitionInstructions: [
      'EXPIRY REQUIRED FROM THE DATES OF PRODUCTION IN DD/MM/YYYY FORMAT.',
      'DATES, WEIGHTS & BATCH # REQUIRED ON EACH CUP & CARTON.',
      'WEIGHT & PRODUCT SHAPES SHOULD BE ACCRUATE',
      'FLAVORS TASTE SHOULD BE STRONG. (CENTER FILLING SHOULD BE PROPERLY FILLED) AND CHOCOLATE QUALITY SHOULD BE EXCELLENT.',
      'PRODUCT QUALITY SHOULD FINE WITH GOOD TASTE',
      'CARTON SHOULD BE STRONG.',
      'MUST USE SAME INGREDIENTS IN INSIDE THE PRODUCTS, WHICH ARE MENTIONED ON PACKAGING.',
      'PLEASE DO NOT USE E-151 AND E-155 IN THE PRODUCT. THESE COLOURS ARE STRICTLY BANNED AT THIS PORT',
      'LOAD 20 EMPTY CARTONS IN THE CONTAINER',
      'PLEASE DO NOT START ITS PROCESS BEFORE COORDINATING WITH US, BECAUSE WE WILL PREPARE IT ACCORDING TO OTHER GOODS READINESS.',
      'CONSOLIDATED SHIPMENT. PLEASE SEND YOU GOODS TO OUR PORT QASIM WAREHOUSE BY LOCAL TRANSPORT.',
      "KINDLY SET PRODUCT'S RECIPES PERFECTLY & IT SHOULD BE ACCORDING TO MENTIONED SHELF LIFE.",
      'PLEASE NOTE THAT THE PRODUCT WILL BE MADE AS PER ARTWORK. (IF "FORTIFIED" IS MENTIONED ON ARTWORK, THEN USE IN THE PRODUCT, IF NOT, THEN PROCEED WITHOUT "FORTIFIED".',
      "REQUIRED COMPLETE PRODUCT'S PICTURES AT THE TIME OF ITS STARTING PRODUCTION.",
      'REQUIRED COMPLETE LOADING PICTURES AT THE TIME OF ITS LOADING',
      'NEED SAMPLES WHEN PRODUCTION WILL START. IT SHOULD BE DISPATCHED AT THE TIME OF STARTING PRODUCTION.',
      'SPECIAL INSTRUCTION: PLEASE PACK THE CUPS INSIDE THE CARTONS SAME LIKE \'PI-835 PACKING". THIS IS VERY IMPORTANT. PLEASE CONSIDER.',
    ],
    collectionInstructions: 'No instructions found',
    containerSummary: '40 ft HC × 1',
    designNotes: 'REF. # PI-835',
    financeStatus: {
      status: 'Customer Accepted',
      nextFollowUpDate: '-',
      followUpAction: '-',
      comments: '-',
    },
    proformaRemarks: 'No remarks found',
  },
  {
    id: 'pr_1108',
    requisitionCode: 'RQ-1108',
    proformaCode: 'PI-903 > CU-102 > EVEREST SARL',
    ticketCode: '-',
    marketingPersonal: 'PERVAIZ MORANI',
    supplier: 'SP-029 - VOLKA FOOD INTERNATIONAL LIMITED',
    company: 'CO-001 - Soneri International General Trading LLC (SID)',
    paymentProfile: '60 DAYS FROM DATE OF LOADING',
    status: 'Supplier Accepted',
    proformaStatus: 'Customer Accepted',
    created: 'TANVIR 07/09/2026',
  },
  {
    id: 'pr_1107',
    requisitionCode: 'RQ-1107',
    proformaCode: 'PI-936 > CU-199 > DARSHAN KIRPA GENERAL TRADING LLC',
    ticketCode: '-',
    marketingPersonal: 'BILAL',
    supplier: 'SP-042 - SILVER LAKE FOOD INDUSTRIES',
    company: 'CO-001 - Soneri International General Trading LLC (SID)',
    paymentProfile: 'AFTER SHIPPED ON BOARD',
    status: 'Supplier Accepted',
    proformaStatus: 'Customer Accepted',
    created: 'TANVIR 07/09/2026',
  },
  {
    id: 'pr_1106',
    requisitionCode: 'RQ-1106',
    proformaCode: 'PI-982 > CU-068 > JOOSAB WHOLESALERS DISTRIBUTORS',
    ticketCode: '-',
    marketingPersonal: 'PERVAIZ MORANI',
    supplier: 'SP-028 - ISMAIL INDUSTRIES LIMITED',
    company: 'CO-001 - Soneri International General Trading LLC (SID)',
    paymentProfile: '90 DAYS AFTER SHIPPED ON BOARD',
    status: 'Supplier Accepted',
    proformaStatus: 'Customer Accepted',
    created: 'TANVIR 07/09/2026',
  },
  {
    id: 'pr_1105',
    requisitionCode: 'RQ-1105',
    proformaCode: 'PI-868 > CU-179 > AYUL INTERNATIONAL TRADING LLC',
    ticketCode: '-',
    marketingPersonal: 'BILAL',
    supplier: 'SP-047 - SKINCARE COMPANY USD',
    company: 'CO-002 - Soneri Care (S.C)',
    paymentProfile: 'AFTER SHIPPED ON BOARD',
    status: 'Supplier Accepted',
    proformaStatus: 'Customer Accepted',
    created: 'TANVIR 05/09/2026',
  },
];

export interface PurchaseOrderItem {
  id: string;
  code: string;
  requisitionCode: string;
  proformaCode: string;
  supplier: string;
  marketingPersonal: string;
  company: string;
  customer: string;
  proformaStatus: string;
  status: string;
  financeStatus: string;
  created: string;

  // View fields
  requisitionInfo?: {
    purchaseOrderCode: string;
    requisitionCode: string;
    proformaCode: string;
    currency: string;
    portOfLoading: string;
    portOfDischarge: string;
    placeOfDelivery: string;
    createdBy: string;
    marketingPersonal: string;
  };
  companyInfo?: {
    code: string;
    name: string;
    email: string;
    website: string;
  };
  supplierInfo?: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    email: string;
    website: string;
  };
  products?: {
    thumbnail: string;
    productName: string;
    variations: string;
    quantity: string;
    poPrice: string;
    total: string;
    shelfLifeDuration: string;
    cbm: string;
    weight: string;
    notes: string;
  }[];
  otherExpenses?: {
    expenseType: string;
    charges: string;
    remarks: string;
  }[];
  discounts?: {
    discountType: string;
    amount: string;
    remarks: string;
  }[];
  containerSummary?: string;
  summary?: {
    productsTotal: string;
    otherExpenses: string;
    discount: string;
    total: string;
  };
  portOfDischargeInstructions?: string[];
  requisitionInstructions?: string[];
  collectionInstructions?: string[];
  documents?: {
    documentType: string;
    file: string;
    createdTime: string;
  }[];
  remarks?: string;
}

export const MOCK_PURCHASE_ORDERS: PurchaseOrderItem[] = [
  {
    id: 'po_1114',
    code: 'PO-1114',
    requisitionCode: 'RQ-1109',
    proformaCode: 'PI-903',
    supplier: 'SP-027 - EUROPA INDUSTRIES',
    marketingPersonal: 'PERVAIZ MORANI',
    company: 'CO-001 - Soneri International General Trading LLC',
    customer: 'CU-102 - EVEREST SARL',
    proformaStatus: 'Customer Accepted',
    status: 'Draft',
    financeStatus: '-',
    created: 'TANVIR 07/09/2026, 05:59 PM',
    requisitionInfo: {
      purchaseOrderCode: 'PO-1114',
      requisitionCode: 'RQ-1109',
      proformaCode: 'PI-903',
      currency: 'United States Dollar',
      portOfLoading: 'Port Qasim',
      portOfDischarge: 'PT-149 - Abidjan',
      placeOfDelivery: "Cote D'Ivoire (Ivory Coast)",
      createdBy: 'TANVIR',
      marketingPersonal: 'PERVAIZ MORANI',
    },
    companyInfo: {
      code: 'CO-001',
      name: 'Soneri International General Trading LLC',
      email: 'info@soneriinternational.com',
      website: 'www.soneriinternational.com',
    },
    supplierInfo: {
      name: 'SP-027 - EUROPA INDUSTRIES',
      address: 'Plot # E-1-C, SITE Super Highway, Phase II, Malir Town',
      city: 'Karachi',
      state: 'Sindh',
      country: 'Pakistan',
      phone: '923219234088',
      email: 'imran@europaindustries.pk',
      website: 'www.europaindustries.com',
    },
    products: [
      {
        thumbnail: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=80&q=80',
        productName: 'PRD-940 BISKEES CENTER FILLED BISCUIT 115 GRAM (G) PER CUP, 24 CUPS PER CARTON',
        variations: 'Biscuit Flavor: Chocolate',
        quantity: '2075 Carton',
        poPrice: '$ 8.7500',
        total: '$ 18,156.2500',
        shelfLifeDuration: '18 Months',
        cbm: '47.3100',
        weight: '7760.5000 KG',
        notes: '-',
      },
    ],
    otherExpenses: [],
    discounts: [],
    containerSummary: '40 ft HC × 1',
    summary: {
      productsTotal: '$18156.2500',
      otherExpenses: '$0.0000',
      discount: '$0.0000',
      total: '$18156.2500',
    },
    portOfDischargeInstructions: ['REQUIRED COC FOR THIS ORDER.'],
    requisitionInstructions: [
      'EXPIRY REQUIRED FROM THE DATES OF PRODUCTION IN DD/MM/YYYY FORMAT.',
      'DATES, WEIGHTS & BATCH # REQUIRED ON EACH CUP & CARTON.',
      'WEIGHT & PRODUCT SHAPES SHOULD BE ACCRUATE',
      'FLAVORS TASTE SHOULD BE STRONG. (CENTER FILLING SHOULD BE PROPERLY FILLED) AND CHOCOLATE QUALITY SHOULD BE EXCELLENT.',
      'PRODUCT QUALITY SHOULD FINE WITH GOOD TASTE',
      'CARTON SHOULD BE STRONG.',
      'MUST USE SAME INGREDIENTS IN INSIDE THE PRODUCTS, WHICH ARE MENTIONED ON PACKAGING.',
      'PLEASE DO NOT USE E-151 AND E-155 IN THE PRODUCT. THESE COLOURS ARE STRICTLY BANNED AT THIS PORT',
      'LOAD 20 EMPTY CARTONS IN THE CONTAINER',
      'PLEASE DO NOT START ITS PROCESS BEFORE COORDINATING WITH US, BECAUSE WE WILL PREPARE IT ACCORDING TO OTHER GOODS READINESS.',
      'CONSOLIDATED SHIPMENT. PLEASE SEND YOU GOODS TO OUR PORT QASIM WAREHOUSE BY LOCAL TRANSPORT.',
      "KINDLY SET PRODUCT'S RECIPES PERFECTLY & IT SHOULD BE ACCORDING TO MENTIONED SHELF LIFE.",
      'PLEASE NOTE THAT THE PRODUCT WILL BE MADE AS PER ARTWORK. (IF "FORTIFIED" IS MENTIONED ON ARTWORK, THEN USE IN THE PRODUCT, IF NOT, THEN PROCEED WITHOUT "FORTIFIED".',
      "REQUIRED COMPLETE PRODUCT'S PICTURES AT THE TIME OF ITS STARTING PRODUCTION.",
      'REQUIRED COMPLETE LOADING PICTURES AT THE TIME OF ITS LOADING',
      'NEED SAMPLES WHEN PRODUCTION WILL START. IT SHOULD BE DISPATCHED AT THE TIME OF STARTING PRODUCTION.',
      'SPECIAL INSTRUCTION: PLEASE PACK THE CUPS INSIDE THE CARTONS SAME LIKE \'PI-835 PACKING". THIS IS VERY IMPORTANT. PLEASE CONSIDER.',
    ],
    collectionInstructions: [
      'CENTER FILLING SHOULD BE PROPERLY FILLED.',
      'BOXES AND TRAYS SHOULD BE CELLOPHANE WRAPPED.',
      'PLEASE NOTE THAT THE PRODUCTS WILL BE MADE AS PER ARTWORKS. (IF "FORTIFIED" IS MENTIONED ON ARTWORK, THEN USE IN THE PRODUCT, IF NOT, THEN PROCEED WITHOUT "FORTIFIED"',
      "KINDLY SET PRODUCT'S RECIPES PERFECTLY & IT SHOULD BE ACCORDING TO MENTIONED SHELF LIFE.",
    ],
    documents: [],
    remarks: '-',
  },
  {
    id: 'po_1113',
    code: 'PO-1113',
    requisitionCode: 'RQ-1108',
    proformaCode: 'PI-903',
    supplier: 'SP-029 - VOLKA FOOD INTERNATIONAL LIMITED',
    marketingPersonal: 'PERVAIZ MORANI',
    company: 'CO-001 - Soneri International General Trading LLC',
    customer: 'CU-102 - EVEREST SARL',
    proformaStatus: 'Customer Accepted',
    status: 'Draft',
    financeStatus: '-',
    created: 'TANVIR 07/09/2026, 05:51 PM',
  },
  {
    id: 'po_1112',
    code: 'PO-1112',
    requisitionCode: 'RQ-1107',
    proformaCode: 'PI-936',
    supplier: 'SP-042 - SILVER LAKE FOOD INDUSTRIES',
    marketingPersonal: 'BILAL',
    company: 'CO-001 - Soneri International General Trading LLC',
    customer: 'CU-199 - DARSHAN KIRPA GENERAL TRADING LLC',
    proformaStatus: 'Customer Accepted',
    status: 'Draft',
    financeStatus: '-',
    created: 'TANVIR 07/09/2026, 02:28 PM',
  },
  {
    id: 'po_1111',
    code: 'PO-1111',
    requisitionCode: 'RQ-1106',
    proformaCode: 'PI-982',
    supplier: 'SP-028 - ISMAIL INDUSTRIES LIMITED',
    marketingPersonal: 'PERVAIZ MORANI',
    company: 'CO-001 - Soneri International General Trading LLC',
    customer: 'CU-068 - JOOSAB WHOLESALERS DISTRIBUTORS',
    proformaStatus: 'Customer Accepted',
    status: 'Completed',
    financeStatus: 'Pending',
    created: 'TANVIR 05/09/2026, 06:38 PM',
  },
  {
    id: 'po_1110',
    code: 'PO-1110',
    requisitionCode: 'RQ-1105',
    proformaCode: 'PI-868',
    supplier: 'SP-047 - SKINCARE COMPANY USD',
    marketingPersonal: 'BILAL',
    company: 'CO-002 - Soneri Care',
    customer: 'CU-179 - AYUL INTERNATIONAL TRADING LLC',
    proformaStatus: 'Customer Accepted',
    status: 'Completed',
    financeStatus: '-',
    created: 'TANVIR 05/09/2026, 04:12 PM',
  },
];

export interface PurchaseInvoiceItem {
  id: string;
  code: string;
  proformaCode: string;
  marketingPersonal: string;
  customer: string;
  supplier: string;
  companyName: string;
  ciNumber: string;
  purchaseOrderCode: string;
  exportInquiryCode: string;
  amount: string;
  status: string;

  // View fields
  ciDate?: string;
  companyInfo?: {
    code: string;
    name: string;
    email: string;
    website: string;
  };
  supplierInfo?: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    phone: string;
    email: string;
    website: string;
  };
  financeStatus?: {
    status: string;
    nextFollowUpDate: string;
    followUpAction: string;
    comments: string;
  };
  products?: {
    thumbnail: string;
    productName: string;
    variation: string;
    quantity: string;
    price: string;
    total: string;
    cbm: string;
    weight: string;
    mfgDate: string;
    expiryDate: string;
    batchNo: string;
    notes: string;
  }[];
  transactionDetails?: {
    accountName: string;
    debit: string;
    credit: string;
  }[];
  otherExpenses?: {
    expenseType: string;
    charges: string;
    remarks: string;
  }[];
  discounts?: {
    discountType: string;
    charges: string;
    remarks: string;
  }[];
  containerSummary?: string;
  summary?: {
    productsTotal: string;
    otherExpenses: string;
    discounts: string;
    total: string;
  };
  documents?: {
    documentType: string;
    file: string;
    createdTime: string;
  }[];
  remarks?: string;
}

export const MOCK_PURCHASE_INVOICES: PurchaseInvoiceItem[] = [
  {
    id: 'poi_659',
    code: 'POI-659',
    proformaCode: 'PI-472',
    marketingPersonal: 'ANUM KHAN',
    customer: 'CU-134 - NIMES PRODUCTS S.A (NIPROSA)',
    supplier: 'SP-029 - VOLKA FOOD INTERNATIONAL LIMITED',
    companyName: 'CO-001 - Soneri International General Trading LLC(SID)',
    ciNumber: 'EXP-033-26-2027',
    purchaseOrderCode: 'PO-684',
    exportInquiryCode: 'EI-643',
    amount: '$ 32,764.0000',
    status: 'Approved / Posted',
    ciDate: '31/08/2026',
    companyInfo: {
      code: 'CO-001',
      name: 'Soneri International General Trading LLC',
      email: 'info@soneriinternational.com',
      website: 'www.soneriinternational.com',
    },
    supplierInfo: {
      name: 'SP-029 - VOLKA FOOD INTERNATIONAL LIMITED',
      address: '3-KM Bahawalpur Bypass, Bahawalpur Road',
      city: 'Multan',
      state: 'Punjab',
      country: 'Pakistan',
      phone: '920612001000',
      email: 'info@volkafood.com',
      website: 'https://volkafood.com/',
    },
    financeStatus: {
      status: 'Confirmed',
      nextFollowUpDate: '-',
      followUpAction: '-',
      comments: '-',
    },
    products: [
      {
        thumbnail: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=80&q=80',
        productName: 'PRD-896 DULCILITO ROPE CHEW WITH COLOR 8 GRAM (G) PER PIECE, 50 PIECES PER BAG/POUCH, 18 BAG/POUCHS PER CARTON',
        variation: 'Tutti Fruiti',
        quantity: '1040 Carton',
        price: '$ 13.1000',
        total: '$ 13624.0000',
        cbm: '27.2480',
        weight: '8632.0000 KG',
        mfgDate: '28/08/2026',
        expiryDate: '27/02/2028',
        batchNo: '08472',
        notes: '-',
      },
      {
        thumbnail: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=80&q=80',
        productName: 'PRD-955 ROVO (BLUE) COCOA WITH CREAM FILLED SANDWICH BISCUIT 18.900 GRAM (G) PER PIECE, 12 PIECES PER STRINGS, 24 STRINGS PER CARTON',
        variation: 'Vanilla Cream',
        quantity: '1040 Carton',
        price: '$ 11.5000',
        total: '$ 11960.0000',
        cbm: '40.0400',
        weight: '1040.0000 KG',
        mfgDate: '26/08/2026',
        expiryDate: '25/02/2028',
        batchNo: '08472',
        notes: '-',
      },
    ],
    transactionDetails: [
      { accountName: '1000109030 - FINISHED GOODS', debit: '$ 25,584.0000', credit: '-' },
      { accountName: '5000102010 - FREIGHT EXPENSE', debit: '$ 7,180.0000', credit: '-' },
      { accountName: '2000103020 - TRADE CREDITORS - IMPORT', debit: '-', credit: '$ 32,764.0000' },
    ],
    otherExpenses: [
      { expenseType: 'FREIGHT EXPENSE', charges: '$ 7,180.0000', remarks: '-' },
    ],
    discounts: [],
    containerSummary: '40 ft HC × 1',
    summary: {
      productsTotal: '$ 25584.0000',
      otherExpenses: '$ 7180.0000',
      discounts: '-',
      total: '$ 32764.0000',
    },
    documents: [
      { documentType: 'Commercial Invoice', file: 'View Document', createdTime: '08/09/2026' },
    ],
    remarks: '-',
  },
  {
    id: 'poi_658',
    code: 'POI-658',
    proformaCode: 'PI-712',
    marketingPersonal: 'PERVAIZ MORANI',
    customer: 'CU-076 - ARIDIM - SENGAL',
    supplier: 'SP-028 - ISMAIL INDUSTRIES LIMITED',
    companyName: 'CO-001 - Soneri International General Trading LLC(SID)',
    ciNumber: '2608067',
    purchaseOrderCode: 'PO-792',
    exportInquiryCode: 'EI-676',
    amount: '$ 10,395.0000',
    status: 'Approved / Posted',
  },
  {
    id: 'poi_657',
    code: 'POI-657',
    proformaCode: 'PI-887',
    marketingPersonal: 'BILAL',
    customer: 'CU-066 - AMA BOM BOM SWEETS',
    supplier: 'SP-045 - AMBER NUTRITION PVT. LTD.',
    companyName: 'CO-004 - Soneri Foods Pvt. Ltd.(S.F)',
    ciNumber: '1221/26-27',
    purchaseOrderCode: 'PO-994',
    exportInquiryCode: 'EI-616',
    amount: '$ 30,217.6000',
    status: 'Approved / Posted',
  },
  {
    id: 'poi_656',
    code: 'POI-656',
    proformaCode: 'PI-708',
    marketingPersonal: 'PERVAIZ MORANI',
    customer: 'CU-068 - JOOSAB WHOLESALERS DISTRIBUTORS',
    supplier: 'SP-028 - ISMAIL INDUSTRIES LIMITED',
    companyName: 'CO-001 - Soneri International General Trading LLC(SID)',
    ciNumber: 'BMC/SF/EXP/060/2026',
    purchaseOrderCode: 'PO-934',
    exportInquiryCode: 'EI-670',
    amount: '$ 18,880.0000',
    status: 'Approved / Posted',
  },
  {
    id: 'poi_655',
    code: 'POI-655',
    proformaCode: 'PI-832',
    marketingPersonal: 'BILAL',
    customer: 'CU-061 - HIMPEX SARL',
    supplier: 'SP-025 - BM CONFECTIONERY',
    companyName: 'CO-006 - Palm Overseas(PO)',
    ciNumber: 'EXP-032-26-2027',
    purchaseOrderCode: 'PO-920',
    exportInquiryCode: 'EI-633',
    amount: '$ 189,660.0000',
    status: 'Approved / Posted',
  },
  {
    id: 'poi_654',
    code: 'POI-654',
    proformaCode: 'PI-885',
    marketingPersonal: 'TEHSEENA .',
    customer: 'CU-163 - ATAYRAM SARL',
    supplier: 'SP-029 - VOLKA FOOD INTERNATIONAL LIMITED',
    companyName: 'CO-001 - Soneri International General Trading LLC(SID)',
    ciNumber: '2609090',
    purchaseOrderCode: 'PO-1016',
    exportInquiryCode: 'EI-653',
    amount: '$ 23,865.0000',
    status: 'Approved / Posted',
  },
];

// ==========================================
// 4. SALES WORKSTREAMS (SONERI ERP)
// ==========================================

export interface ProformaInvoiceItem {
  id: string;
  proformaCode: string;
  referenceProformaCode: string;
  saleReturnCode: string;
  ticketCode: string;
  quoteCode: string;
  customer: string;
  company: string;
  marketingPersonal: string;
  placeOfDelivery: string;
  marketingStatus: string;
  financeStatus: string;
  payment: string;

  // View fields
  companyInfo?: {
    code: string;
    name: string;
    email: string;
    website: string;
  };
  bankDetails?: {
    bankName: string;
    branch: string;
    accountType: string;
    beneficiary: string;
    accountNumber: string;
    iban: string;
  };
  customerInfo?: {
    code: string;
    name: string;
    address: string;
    country: string;
    phone: string;
    email: string;
  };
  incoTerm?: string;
  currency?: string;
  createdBy?: string;
  generatedDate?: string;
  expiryDate?: string;
  exhibitionYear?: string;
  buyerAndConsignee?: {
    billTo: string;
    shipTo: string;
    portOfLoading: string;
    portOfDischarge: string;
    placeOfDelivery: string;
    shipmentType: string;
    expectedDeliveryMonth: string;
    insurance: string;
  };
  products?: {
    thumbnail: string;
    productName: string;
    variation: string;
    quantity: string;
    price: string;
    total: string;
    shelfLifeDuration: string;
    cbm: string;
    weight: string;
    notes: string;
  }[];
  otherExpenses?: {
    expenseType: string;
    charges: string;
    remarks: string;
  }[];
  discounts?: {
    discountType: string;
    amount: string;
    remarks: string;
  }[];
  containerSummary?: string;
  summary?: {
    productsTotal: string;
    totalInsurance: string;
    otherExpenses: string;
    discount: string;
    total: string;
  };
  portOfDischargeInstructions?: string[];
  proformaInstructions?: string;
  collectionInstructions?: string[];
  customerRemarks?: string;
  remarks?: string;
  paymentTerms?: {
    title: string;
    description: string;
  };
}

export const MOCK_PROFORMA_INVOICES: ProformaInvoiceItem[] = [
  {
    id: 'pi_1004',
    proformaCode: 'PI-1004',
    referenceProformaCode: '-',
    saleReturnCode: '-',
    ticketCode: '-',
    quoteCode: 'QT-584',
    customer: 'CU-280 - DSG GROUP SARL',
    company: 'CO-001 - Soneri International General Trading LLC (SID)',
    marketingPersonal: 'TEHSEENA .',
    placeOfDelivery: 'Lebanon',
    marketingStatus: 'Draft',
    financeStatus: '-',
    payment: 'No',
    companyInfo: {
      code: 'CO-001',
      name: 'Soneri International General Trading LLC',
      email: 'info@soneriinternational.com',
      website: 'www.soneriinternational.com',
    },
    bankDetails: {
      bankName: 'EMIRATES NBD BANK PJSC - USD A/C',
      branch: 'DUBAI BRANCH',
      accountType: 'Business Account',
      beneficiary: 'SONERI INTERNATIONAL GENERAL TRADING LLC',
      accountNumber: '1025781691602',
      iban: 'AE080260001025781691602',
    },
    customerInfo: {
      code: 'CU-280',
      name: 'DSG GROUP SARL',
      address: 'GHAZIEH-AL JANOUB',
      country: 'Lebanon',
      phone: '96176790490',
      email: 'info@dsggrouplb.com',
    },
    incoTerm: 'FOB',
    currency: 'United States Dollar',
    createdBy: 'TEHSEENA .',
    generatedDate: '08/09/2026',
    expiryDate: '07/09/2026',
    exhibitionYear: '-',
    buyerAndConsignee: {
      billTo: '-',
      shipTo: '-',
      portOfLoading: 'Port Qasim',
      portOfDischarge: 'PT-405 - Beirut',
      placeOfDelivery: 'Lebanon',
      shipmentType: 'By Sea',
      expectedDeliveryMonth: 'October, 2026',
      insurance: '-',
    },
    products: [
      {
        thumbnail: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=80&q=80',
        productName: 'PRD-702 BISKEES BISCUIT CENTER FILLED BISCUIT 115 GRAM (G) PER CUP, 6 CUPS PER TRAY, 6 TRAYS PER CARTON',
        variation: 'Chocolate',
        quantity: '200 Carton',
        price: '$ 18.0000/= Carton',
        total: '$ 3,600.0000',
        shelfLifeDuration: '18 Months',
        cbm: '10.44',
        weight: '1,250 KG',
        notes: '-',
      },
      {
        thumbnail: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=80&q=80',
        productName: 'PRD-017 BISKEES BISCUIT CENTER FILLED BISCUIT 30 GRAM (G) PER BOX, 24 BOXES PER TRAY, 6 TRAYS PER CARTON',
        variation: 'Chocolate',
        quantity: '200 Carton',
        price: '$ 16.0000/= Carton',
        total: '$ 3,200.0000',
        shelfLifeDuration: '18 Months',
        cbm: '11.68',
        weight: '1,370 KG',
        notes: '-',
      },
      {
        thumbnail: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=80&q=80',
        productName: 'PRD-700 BISKEES BISCUIT CENTER FILLED BISCUIT 18 GRAM (G) PER PIECE, 24 PIECES PER BOX, 12 BOXES PER CARTON',
        variation: 'Chocolate',
        quantity: '200 Carton',
        price: '$ 16.0000/= Carton',
        total: '$ 3,200.0000',
        shelfLifeDuration: '18 Months',
        cbm: '7.76',
        weight: '1,370 KG',
        notes: '-',
      },
      {
        thumbnail: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=80&q=80',
        productName: 'PRD-063 TIP DIP CHOCOLATE SPREAD WITH BREAD STICKS BISCUIT 45 GRAM (G) PER CUP, 10 CUP PER TRAY, 12 TRAY PER CARTON',
        variation: 'Chocolate',
        quantity: '268 Carton',
        price: '$ 32.0000/= Carton',
        total: '$ 8,576.0000',
        shelfLifeDuration: '18 Months',
        cbm: '18.492',
        weight: '2,546 KG',
        notes: '-',
      },
      {
        thumbnail: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=80&q=80',
        productName: 'PRD-050 SALTIX BISCUIT 30 GRAM (G) PER PIECE, 24 PIECE PER TRAY, 6 TRAY PER CARTON',
        variation: 'Salted',
        quantity: '200 Carton',
        price: '$ 16.5000/= Carton',
        total: '$ 3,300.0000',
        shelfLifeDuration: '18 Months',
        cbm: '11.68',
        weight: '1,430 KG',
        notes: '-',
      },
      {
        thumbnail: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=80&q=80',
        productName: 'PRD-047 SALTIX BISCUIT 18 GRAM (G) PER PIECE, 24 PIECES PER BOX, 12 BOXES PER CARTON',
        variation: 'Salted',
        quantity: '200 Carton',
        price: '$ 14.0000/= Carton',
        total: '$ 2,800.0000',
        shelfLifeDuration: '18 Months',
        cbm: '8',
        weight: '1,350 KG',
        notes: '-',
      },
    ],
    otherExpenses: [],
    discounts: [],
    containerSummary: '40 ft HC × 1',
    summary: {
      productsTotal: '$24,676.0000',
      totalInsurance: '$0.0000',
      otherExpenses: '$0.0000',
      discount: '$0.0000',
      total: '$24,676.0000',
    },
    portOfDischargeInstructions: ['Banned Color: E-120, E-122, E-124, E-127'],
    proformaInstructions: 'No instructions found',
    collectionInstructions: [
      'CENTER FILLING SHOULD BE PROPERLY FILLED.',
      'BOXES AND TRAYS SHOULD BE CELLOPHANE WRAPPED.',
      'PLEASE NOTE THAT THE PRODUCTS WILL BE MADE AS PER ARTWORKS. (IF "FORTIFIED" IS MENTIONED ON ARTWORK, THEN USE IN THE PRODUCT, IF NOT, THEN PROCEED WITHOUT "FORTIFIED"',
      "KINDLY SET PRODUCT'S RECIPES PERFECTLY & IT SHOULD BE ACCORDING TO MENTIONED SHELF LIFE.",
      'CHOCOLATE QUALITY SHOULD BE EXCELLENT.',
      'BISCUITS (STICKS) SHAPES SHOULD BE ACCURATE.',
      'INNER JARS (PIECES) SHOULD BE PROPERLY SEALED.',
      'BOXES SHOULD BE CELLOPHINE WRAPPED.',
    ],
    customerRemarks: 'Auto-created from Lead (QuoteID: 587)',
    remarks: '-',
    paymentTerms: {
      title: '30% Advance & 70% on NN Copy of BL',
      description: 'Client will pay 30% advance and 70% on NN Copy of BL',
    },
  },
  {
    id: 'pi_1003',
    proformaCode: 'PI-1003',
    referenceProformaCode: 'PI-987',
    saleReturnCode: '-',
    ticketCode: '-',
    quoteCode: 'QT-584',
    customer: 'CU-279 - IBA CISSE LE NDIAMBOUR',
    company: 'CO-001 - Soneri International General Trading LLC (SID)',
    marketingPersonal: 'BILAL',
    placeOfDelivery: 'Senegal',
    marketingStatus: 'Customer Accepted',
    financeStatus: 'Confirmed',
    payment: 'No',
  },
  {
    id: 'pi_1002',
    proformaCode: 'PI-1002',
    referenceProformaCode: '-',
    saleReturnCode: '-',
    ticketCode: '-',
    quoteCode: 'QT-589',
    customer: 'CU-076 - ARIDIM - SENGAL',
    company: 'CO-001 - Soneri International General Trading LLC (SID)',
    marketingPersonal: 'PERVAIZ MORANI',
    placeOfDelivery: 'Senegal',
    marketingStatus: 'Customer Accepted',
    financeStatus: 'Confirmed',
    payment: 'No',
  },
  {
    id: 'pi_1001',
    proformaCode: 'PI-1001',
    referenceProformaCode: '-',
    saleReturnCode: '-',
    ticketCode: '-',
    quoteCode: 'QT-584',
    customer: 'CU-089 - KAMEL BROTHERS GENERAL TRADING',
    company: 'CO-001 - Soneri International General Trading LLC (SID)',
    marketingPersonal: 'PERVAIZ MORANI',
    placeOfDelivery: 'Yemen',
    marketingStatus: 'Draft',
    financeStatus: '-',
    payment: 'No',
  },
];

export interface SaleInvoiceItem {
  id: string;
  saleInvoiceCode: string;
  exportInquiryCode: string;
  proformaCode: string;
  saleReturnCode: string;
  company: string;
  portOfDischarge: string;
  amount: string;
  status: string;
  financeStatus: string;
  created: string;

  // View fields
  marketingPersonal?: string;
  transactionDate?: string;
  quote?: string;
  incoTerm?: string;
  freight?: string;
  bookingFreight?: string;
  currency?: string;
  createdBy?: string;
  generatedDate?: string;
  expiryDate?: string;
  paymentProfile?: string;
  companyInfo?: {
    code: string;
    name: string;
    email: string;
    website: string;
  };
  customerInfo?: {
    code: string;
    name: string;
  };
  products?: {
    thumbnail: string;
    productName: string;
    variation: string;
    quantity: string;
    price: string;
    total: string;
    cbm: string;
    weight: string;
    notes: string;
  }[];
  otherExpenses?: {
    expenseType: string;
    charges: string;
    remarks: string;
  }[];
  discounts?: {
    discountType: string;
    amount: string;
    remarks: string;
  }[];
  documents?: {
    documentType: string;
    file: string;
    createdTime: string;
  }[];
  remarks?: string;
  containerSummary?: string;
  summary?: {
    productsTotal: string;
    otherExpenses: string;
    discounts: string;
    totalAdvanceAmount: string;
    totalPaidAdvanceAmount: string;
    totalAdvance: string;
    remainingAdvanceAmount: string;
    total: string;
  };
}

export const MOCK_SALE_INVOICES: SaleInvoiceItem[] = [
  {
    id: 'si_609',
    saleInvoiceCode: 'SI-609',
    exportInquiryCode: 'EI-633',
    proformaCode: 'PI-832 > CU-061 > HIMPEX SARL',
    saleReturnCode: '-',
    company: 'CO-001 - Soneri International General Trading LLC(SID)',
    portOfDischarge: 'PT-149 - Abidjan',
    amount: '$ 205,800.0000',
    status: 'Pending Approval',
    financeStatus: '-',
    created: 'HASSAN KHANIA 08/09/2026, 01:19 PM',
    marketingPersonal: 'BILAL',
    transactionDate: '31/08/2026',
    quote: '-',
    incoTerm: 'CNF',
    freight: '18000',
    bookingFreight: '5430',
    currency: 'United States Dollar',
    createdBy: 'HASSAN KHANIA',
    generatedDate: '08/09/2026',
    expiryDate: '06/07/2026',
    paymentProfile: 'As per Mutual Understanding',
    companyInfo: {
      code: 'CO-001',
      name: 'Soneri International General Trading LLC',
      email: 'info@soneriinternational.com',
      website: 'www.soneriinternational.com',
    },
    customerInfo: {
      code: 'CU-061',
      name: 'HIMPEX SARL',
    },
    products: [
      {
        thumbnail: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=80&q=80',
        productName: 'PRD-1009 BISCLASS MOSAIC (COMPACT) CENTER FILLED BISCUIT 42 GRAM (G) PER PIECE, 24 PIECES PER BOX, 6 BOXES PER CARTON',
        variation: 'Chocolate',
        quantity: '8,400',
        price: '$ 12.2500',
        total: '$ 102900.0000',
        cbm: '206.64',
        weight: '61,488 KG',
        notes: '-',
      },
      {
        thumbnail: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=80&q=80',
        productName: 'PRD-1008 BISCLASS CLASSIC (COMPACT) CENTER FILLED BISCUIT 42 GRAM (G) PER PIECE, 24 PIECES PER BOX, 6 BOXES PER CARTON',
        variation: 'Chocolate',
        quantity: '8,400',
        price: '$ 12.2500',
        total: '$ 102900.0000',
        cbm: '206.64',
        weight: '61,488 KG',
        notes: '-',
      },
    ],
    otherExpenses: [],
    discounts: [],
    documents: [],
    remarks: 'No Remarks Found',
    containerSummary: '40 ft HC × 6',
    summary: {
      productsTotal: '$205,800.0000',
      otherExpenses: '-',
      discounts: '$0.0000',
      totalAdvanceAmount: '$118,453.0000',
      totalPaidAdvanceAmount: '$0.0000',
      totalAdvance: '$118,453.0000',
      remainingAdvanceAmount: '$0.0000',
      total: '$87,347.0000',
    },
  },
  {
    id: 'si_608',
    saleInvoiceCode: 'SI-608',
    exportInquiryCode: 'EI-643',
    proformaCode: 'PI-472 > CU-134 > NIMES PRODUCTS S.A (NIPROSA)',
    saleReturnCode: '-',
    company: 'CO-001 - Soneri International General Trading LLC(SID)',
    portOfDischarge: 'PT-281 - Port Au Prince',
    amount: '$ 42,680.0000',
    status: 'Approved / Posted',
    financeStatus: 'Confirmed',
    created: 'HASSAN KHANIA 08/09/2026, 01:04 PM',
  },
  {
    id: 'si_607',
    saleInvoiceCode: 'SI-607',
    exportInquiryCode: 'EI-616',
    proformaCode: 'PI-887 > CU-066 > AMA BOM BOM SWEETS',
    saleReturnCode: '-',
    company: 'CO-004 - Soneri Foods Pvt. Ltd.(S.F)',
    portOfDischarge: 'PT-625 - Cape Town',
    amount: '$ 37,064.5000',
    status: 'Approved / Posted',
    financeStatus: 'Confirmed',
    created: 'AYAZ 07/09/2026, 06:24 PM',
  },
  {
    id: 'si_606',
    saleInvoiceCode: 'SI-606',
    exportInquiryCode: 'EI-653',
    proformaCode: 'PI-885 > CU-163 > ATAYRAM SARL',
    saleReturnCode: '-',
    company: 'CO-001 - Soneri International General Trading LLC(SID)',
    portOfDischarge: 'PT-687 - Lome',
    amount: '$ 29,855.0000',
    status: 'Pending Approval',
    financeStatus: '-',
    created: 'HASSAN KHANIA 07/09/2026, 02:05 PM',
  },
  {
    id: 'si_605',
    saleInvoiceCode: 'SI-605',
    exportInquiryCode: 'EI-635',
    proformaCode: 'PI-811 > CU-058 > SATINA INTERNATIONAL LIMITED',
    saleReturnCode: '-',
    company: 'CO-006 - Palm Overseas(PO)',
    portOfDischarge: 'PT-239 - Banjul',
    amount: '$ 31,354.5000',
    status: 'Pending Approval',
    financeStatus: '-',
    created: 'HASSAN KHANIA 07/09/2026, 01:21 PM',
  },
  {
    id: 'si_604',
    saleInvoiceCode: 'SI-604',
    exportInquiryCode: 'EI-659',
    proformaCode: 'PI-756 > CU-156 > HELLO IMPORT EXPORT',
    saleReturnCode: '-',
    company: 'CO-001 - Soneri International General Trading LLC(SID)',
    portOfDischarge: 'PT-149 - Abidjan',
    amount: '$ 50,562.5000',
    status: 'Approved / Posted',
    financeStatus: 'Confirmed',
    created: 'HASSAN KHANIA 05/09/2026, 02:26 PM',
  },
];

export interface CustomerPaymentItem {
  id: string;
  paymentCode: string;
  proforma: string;
  customer: string;
  notifyPartyName: string;
  paymentAmount: string;
  paymentMethod: string;
  paymentDate: string;
  status: string;
  created: string;

  // View fields
  customerInfo?: {
    code: string;
    name: string;
  };
  paymentReference?: string;
  paymentDetails?: {
    proformaCode: string;
    bank: string;
    company: string;
    placeOfDelivery: string;
    paymentTerm: string;
    proformaAmount: string;
    invoiceAmount: {
      siAmount: string;
      jvAdj: string;
      netSaleInvoice: string;
      saleReturn: string;
      netCustomerRP: string;
    };
    previouslyPaid: string;
    currentAmount: string;
    exchangedAmount: string;
    advance: boolean;
    remainingBalance: string;
  }[];
  pendingPaymentDetails?: {
    proformaCode: string;
    proformaAmount: string;
    invoiceAmount: string;
    previouslyPaid: string;
    currentAmount: string;
    advance: string;
    remainingBalance: string;
  }[];
  customerRemarks?: string;
  documents?: {
    documentName: string;
    documentUrl: string;
  }[];
  remarks?: string;
}

export const MOCK_CUSTOMER_PAYMENTS: CustomerPaymentItem[] = [
  {
    id: 'cp_744',
    paymentCode: 'CP-744',
    proforma: 'PI-440, PI-957',
    customer: 'CU-092 - AL ABBAS FOR GENERAL TRADING',
    notifyPartyName: '-',
    paymentAmount: '$ 24,013.7000',
    paymentMethod: 'Bank Transfer',
    paymentDate: '08/09/2026',
    status: '-',
    created: 'BILAL 08/09/2026, 03:02 PM',
    customerInfo: {
      code: 'CU-092',
      name: 'AL ABBAS FOR GENERAL TRADING',
    },
    paymentReference: '-',
    paymentDetails: [
      {
        proformaCode: 'PI-440',
        bank: 'EMIRATES NBD BANK PJSC - USD A/C',
        company: 'CO-001 - Soneri International General Trading LLC',
        placeOfDelivery: 'Yemen',
        paymentTerm: '30% Advance & 70% on NN Copy of BL',
        proformaAmount: '$ 29,000.0000',
        invoiceAmount: {
          siAmount: '$ 32,425.0000',
          jvAdj: '-',
          netSaleInvoice: '$ 32,425.0000',
          saleReturn: '-',
          netCustomerRP: '$ 32,425.0000',
        },
        previouslyPaid: '$ 16,395.4800',
        currentAmount: '$ 16,029.5200',
        exchangedAmount: '$ 16,029.5200',
        advance: false,
        remainingBalance: '$ 16,029.5200',
      },
      {
        proformaCode: 'PI-957',
        bank: 'EMIRATES NBD BANK PJSC - USD A/C',
        company: 'CO-001 - Soneri International General Trading LLC',
        placeOfDelivery: 'Yemen',
        paymentTerm: '30% Advance & 70% on NN Copy of BL',
        proformaAmount: '$ 29,000.0000',
        invoiceAmount: {
          siAmount: '-',
          jvAdj: '-',
          netSaleInvoice: '-',
          saleReturn: '-',
          netCustomerRP: '-',
        },
        previouslyPaid: '$ 0.0000',
        currentAmount: '$ 7,984.1800',
        exchangedAmount: '$ 7,984.1800',
        advance: true,
        remainingBalance: '$ 29,000.0000',
      },
    ],
    pendingPaymentDetails: [
      {
        proformaCode: 'PI-215',
        proformaAmount: '$ 32,000.0000',
        invoiceAmount: '-',
        previouslyPaid: '$ 12,000.0000',
        currentAmount: '$ 0.0000',
        advance: 'No',
        remainingBalance: '$ 20,000.0000',
      },
      {
        proformaCode: 'PI-441',
        proformaAmount: '$ 38,400.0000',
        invoiceAmount: '-',
        previouslyPaid: '$ 18,400.0000',
        currentAmount: '$ 0.0000',
        advance: 'No',
        remainingBalance: '$ 20,000.0000',
      },
      {
        proformaCode: 'PI-794',
        proformaAmount: '$ 42,000.0000',
        invoiceAmount: '-',
        previouslyPaid: '$ 21,000.0000',
        currentAmount: '$ 0.0000',
        advance: 'No',
        remainingBalance: '$ 21,000.0000',
      },
      {
        proformaCode: 'PI-856',
        proformaAmount: '$ 35,487.5000',
        invoiceAmount: '-',
        previouslyPaid: '$ 14,407.7500',
        currentAmount: '$ 0.0000',
        advance: 'No',
        remainingBalance: '$ 21,079.7500',
      },
      {
        proformaCode: 'PI-858',
        proformaAmount: '$ 35,000.0000',
        invoiceAmount: '-',
        previouslyPaid: '$ 15,000.0000',
        currentAmount: '$ 0.0000',
        advance: 'No',
        remainingBalance: '$ 20,550.0000',
      },
    ],
    customerRemarks: 'Auto-created from Lead (QuoteID: 108)',
    documents: [
      { documentName: 'Swift Copy', documentUrl: 'View Document' },
    ],
    remarks: 'it will receive in export free zone.',
  },
  {
    id: 'cp_743',
    paymentCode: 'CP-743',
    proforma: 'PI-330, PI-331',
    customer: 'CU-106 - ETS DARYL',
    notifyPartyName: 'BLUE GATE TRADING',
    paymentAmount: '$ 74,676.0000',
    paymentMethod: 'Bank Transfer',
    paymentDate: '04/09/2026',
    status: 'Confirmed',
    created: 'BILAL 08/09/2026, 01:51 PM',
  },
  {
    id: 'cp_742',
    paymentCode: 'CP-742',
    proforma: 'PI-992',
    customer: 'CU-216 - BIN SHIBA',
    notifyPartyName: '-',
    paymentAmount: '$ 11,500.0000',
    paymentMethod: 'Bank Transfer',
    paymentDate: '02/09/2026',
    status: 'Confirmed',
    created: 'ANUM KHAN 08/09/2026, 01:46 PM',
  },
  {
    id: 'cp_741',
    paymentCode: 'CP-741',
    proforma: 'PI-517',
    customer: 'CU-093 - TURK FOOD SWEDEN AB',
    notifyPartyName: '-',
    paymentAmount: '$ 8,080.0000',
    paymentMethod: 'Adjustment',
    paymentDate: '03/09/2026',
    status: 'Confirmed',
    created: 'SARIM 08/09/2026, 12:14 PM',
  },
  {
    id: 'cp_740',
    paymentCode: 'CP-740',
    proforma: 'PI-293',
    customer: 'CU-111 - ZARA TRADING LDA',
    notifyPartyName: '-',
    paymentAmount: '$ 7,996.0000',
    paymentMethod: 'Bank Transfer',
    paymentDate: '02/09/2026',
    status: 'Confirmed',
    created: 'AYAZ 07/09/2026, 12:48 PM',
  },
  {
    id: 'cp_739',
    paymentCode: 'CP-739',
    proforma: 'PI-538',
    customer: 'CU-117 - THAER MOHD KHALAF OBEIDAT ESTABLISHMENT FOR TRADING',
    notifyPartyName: '-',
    paymentAmount: '$ 7,988.0000',
    paymentMethod: 'Bank Transfer',
    paymentDate: '03/09/2026',
    status: '-',
    created: 'AYAZ 03/09/2026, 05:19 PM',
  },
  {
    id: 'cp_738',
    paymentCode: 'CP-738',
    proforma: 'PI-370, PI-600',
    customer: 'CU-076 - ARIDIM - SENGAL',
    notifyPartyName: '-',
    paymentAmount: '$ 876.4000',
    paymentMethod: 'Bank Transfer',
    paymentDate: '03/09/2026',
    status: 'Confirmed',
    created: 'AATIKA 03/09/2026, 04:43 PM',
  },
];

// ==========================================
// 5. MARKETING & EXHIBITIONS WORKSTREAMS
// ==========================================

export interface ExhibitionItem {
  id: string;
  name: string;
  venueCity: string;
  city: string;
  venue: string;
  country: string;
  startDate: string;
  endDate: string;
  stallNumber: string;
  boothNumber: string;
  stallAreaSqm: number;
  totalBudgetPKR: number;
  budgetAllocated: number;
  actualExpensePKR: number;
  actualSpent: number;
  currency: string;
  leadsGenerated: number;
  potentialOrderUSD: number;
  status: 'Upcoming' | 'Active' | 'Completed';
  keyProductsDisplayed: string[];
  attendees: string[];
  delegates: string[];
}

export const MOCK_EXHIBITIONS: ExhibitionItem[] = [
  {
    id: 'exh_01',
    name: 'Heimtextil Frankfurt 2025',
    venueCity: 'Frankfurt am Main',
    city: 'Frankfurt',
    venue: 'Messe Frankfurt',
    country: 'Germany',
    startDate: '2025-01-14',
    endDate: '2025-01-17',
    stallNumber: 'Hall 4.2, Stand C-81',
    boothNumber: 'C-81',
    stallAreaSqm: 48,
    totalBudgetPKR: 8500000,
    budgetAllocated: 8500000,
    actualExpensePKR: 8120000,
    actualSpent: 8120000,
    currency: 'PKR',
    leadsGenerated: 38,
    potentialOrderUSD: 1450000,
    status: 'Completed',
    keyProductsDisplayed: ['Luxury Combed Ring Spun Yarns', 'Organic Bedlinen Fabrics', 'Jacquard Terry Towels'],
    attendees: ['BS (Senior Export Marketer)', 'Madam Gulnaz', 'MD Soneri'],
    delegates: ['BS (Senior Export Marketer)', 'Madam Gulnaz', 'MD Soneri'],
  },
  {
    id: 'exh_02',
    name: 'Texworld Evolution Paris',
    venueCity: 'Paris Le Bourget',
    city: 'Paris',
    venue: 'Paris Le Bourget Exhibition Centre',
    country: 'France',
    startDate: '2025-02-10',
    endDate: '2025-02-12',
    stallNumber: 'Hall 7, Booth F-14',
    boothNumber: 'F-14',
    stallAreaSqm: 36,
    totalBudgetPKR: 7200000,
    budgetAllocated: 7200000,
    actualExpensePKR: 6850000,
    actualSpent: 6850000,
    currency: 'PKR',
    leadsGenerated: 24,
    potentialOrderUSD: 980000,
    status: 'Completed',
    keyProductsDisplayed: ['Slub Denim Fabrics', 'Cotton-Spandex Stretch Weaves', 'Garment Dyed Shirting'],
    attendees: ['BS (Senior Export Marketer)', 'Farhan Wazir Ali'],
    delegates: ['BS (Senior Export Marketer)', 'Farhan Wazir Ali'],
  },
  {
    id: 'exh_03',
    name: 'Colombiatex de las Americas',
    venueCity: 'Medellin',
    city: 'Medellin',
    venue: 'Plaza Mayor Medellin',
    country: 'Colombia',
    startDate: '2025-05-20',
    endDate: '2025-05-22',
    stallNumber: 'Plaza Mayor Pavilion Azul 102',
    boothNumber: 'Azul-102',
    stallAreaSqm: 24,
    totalBudgetPKR: 5500000,
    budgetAllocated: 5500000,
    actualExpensePKR: 1200000,
    actualSpent: 1200000,
    currency: 'PKR',
    leadsGenerated: 0,
    potentialOrderUSD: 0,
    status: 'Upcoming',
    keyProductsDisplayed: ['Denim Fabrics for Latin American Market', 'Coarse Weaving Yarns Ne 10-16'],
    attendees: ['BS (Senior Export Marketer)'],
    delegates: ['BS (Senior Export Marketer)'],
  },
];

export interface LeadItem {
  id: string;
  leadCode: string;
  contactName: string;
  contactPerson: string;
  companyName: string;
  company: string;
  country: string;
  email: string;
  phone: string;
  sourceExhibition: string;
  source: string;
  productInterest: string;
  estimatedAnnualVolume: string;
  estimatedVolume: string;
  status: 'New' | 'Sample Dispatched' | 'Negotiation' | 'Converted to Client' | 'Disqualified';
  stage: string;
  assignedMarketer: string;
  assignedTo: string;
  dateAdded: string;
  createdDate: string;
  notes: string;
}

export const MOCK_LEADS: LeadItem[] = [
  {
    id: 'lead_01',
    leadCode: 'LEAD-8841',
    contactName: 'Thomas Müller (Sourcing Director)',
    contactPerson: 'Thomas Müller',
    companyName: 'Hanseatic Spinning Mills GmbH',
    company: 'Hanseatic Spinning Mills GmbH',
    country: 'Germany',
    email: 't.mueller@hanseatic-yarn.de',
    phone: '+49 40 8829100',
    sourceExhibition: 'Heimtextil Frankfurt 2025',
    source: 'Heimtextil Frankfurt 2025',
    productInterest: '100% Combed Cotton Ring Spun Weaving Yarn Ne 30/1',
    estimatedAnnualVolume: '500 Metric Tons / Year ($1.6M)',
    estimatedVolume: '500 MT / Year ($1.6M)',
    status: 'Converted to Client',
    stage: 'Converted to Client',
    assignedMarketer: 'BS',
    assignedTo: 'BS',
    dateAdded: '2025-01-15',
    createdDate: '2025-01-15',
    notes: 'Met at Frankfurt booth. Requested mill certificates and lab testing data for Uster CV%. Sample approved and PI #098 issued.',
  },
  {
    id: 'lead_02',
    leadCode: 'LEAD-8839',
    contactName: 'Rashid Al-Khatib',
    contactPerson: 'Rashid Al-Khatib',
    companyName: 'Al-Madina Garments FZE',
    company: 'Al-Madina Garments FZE',
    country: 'United Arab Emirates',
    email: 'sourcing@almadinafabrics.ae',
    phone: '+971 4 3982100',
    sourceExhibition: 'Direct Buyer Referral',
    source: 'Direct Buyer Referral',
    productInterest: 'Indigo Dyed Denim Fabric 11.5 Oz Stretch',
    estimatedAnnualVolume: '200,000 Meters / Year ($600K)',
    estimatedVolume: '200,000 Meters ($600K)',
    status: 'Converted to Client',
    stage: 'Converted to Client',
    assignedMarketer: 'Madam Gulnaz',
    assignedTo: 'Madam Gulnaz',
    dateAdded: '2025-01-22',
    createdDate: '2025-01-22',
    notes: 'Requires 4-point fabric inspection standard and shade continuity blanket test.',
  },
  {
    id: 'lead_03',
    leadCode: 'LEAD-8832',
    contactName: 'Sophie Dubois (Head of Procurement)',
    contactPerson: 'Sophie Dubois',
    companyName: 'Lyon Textile Sourcing SAS',
    company: 'Lyon Textile Sourcing SAS',
    country: 'France',
    email: 's.dubois@lyon-textile.fr',
    phone: '+33 4 7892104',
    sourceExhibition: 'Texworld Evolution Paris',
    source: 'Texworld Evolution Paris',
    productInterest: 'Organic Bedlinen Fabrics & Yarn-dyed Checks',
    estimatedAnnualVolume: '80,000 Meters ($280K)',
    estimatedVolume: '80,000 Meters ($280K)',
    status: 'Sample Dispatched',
    stage: 'Sample Dispatched',
    assignedMarketer: 'Farhan Wazir Ali',
    assignedTo: 'Farhan Wazir Ali',
    dateAdded: '2025-02-11',
    createdDate: '2025-02-11',
    notes: 'Dispatched 5-meter sample swatches via DHL tracking #22019941. Follow up scheduled for next Monday.',
  },
];

export interface QuotationItem {
  id: string;
  quotationNumber: string;
  customerOrLeadName: string;
  customerName: string;
  country: string;
  destinationPort: string;
  issueDate: string;
  date: string;
  validUntil: string;
  currency: string;
  subtotal: number;
  freightCost: number;
  totalQuoteAmount: number;
  totalAmount: number;
  status: 'Sent' | 'Accepted' | 'Under Revision' | 'Expired';
  incoterm: string;
  paymentTerms: string;
  items: {
    description: string;
    specs: string;
    quantity: number;
    unit: string;
    rate: number;
    amount: number;
  }[];
}

export const MOCK_QUOTATIONS: QuotationItem[] = [
  {
    id: 'qt_01',
    quotationNumber: 'QT-2025-0320',
    customerOrLeadName: 'Lyon Textile Sourcing SAS',
    customerName: 'Lyon Textile Sourcing SAS',
    country: 'France',
    destinationPort: 'Le Havre Port, France',
    issueDate: '2025-02-14',
    date: '2025-02-14',
    validUntil: '2025-03-02',
    currency: 'EUR',
    subtotal: 72000,
    freightCost: 4800,
    totalQuoteAmount: 76800,
    totalAmount: 76800,
    status: 'Sent',
    incoterm: 'CIF Le Havre Port, France',
    paymentTerms: 'LC at 60 Days Sight',
    items: [
      { description: 'Organic Cotton Percale 200TC Bedlinen Sheeting 108 Inch', specs: '100% GOTS Organic Cotton, 40sx40s / 110x90, Mercerized Bleached White', quantity: 20000, unit: 'Meters', rate: 3.60, amount: 72000 },
    ],
  },
  {
    id: 'qt_02',
    quotationNumber: 'QT-2025-0315',
    customerOrLeadName: 'Hanseatic Spinning Mills GmbH',
    customerName: 'Hanseatic Spinning Mills GmbH',
    country: 'Germany',
    destinationPort: 'Hamburg Port, Germany',
    issueDate: '2025-02-05',
    date: '2025-02-05',
    validUntil: '2025-02-19',
    currency: 'EUR',
    subtotal: 78000,
    freightCost: 6500,
    totalQuoteAmount: 84500,
    totalAmount: 84500,
    status: 'Accepted',
    incoterm: 'CIF Hamburg Port',
    paymentTerms: '100% LC at Sight',
    items: [
      { description: '100% Combed Cotton Ring Spun Weaving Yarn Ne 30/1', specs: 'Autoconed, Uster Tested, 1.89 Kg Paper Cones', quantity: 24000, unit: 'Kg', rate: 3.25, amount: 78000 },
    ],
  },
];

// Marketing Aliases for components
export type MarketingLeadItem = LeadItem;
export type MarketingQuotationItem = QuotationItem;
export const MOCK_MARKETING_LEADS = MOCK_LEADS;
export const MOCK_MARKETING_QUOTATIONS = MOCK_QUOTATIONS;

// ==========================================
// 6. CATALOG WORKSTREAMS
// ==========================================

export interface CategoryItem {
  id: string;
  code: string;
  name: string;
  parentCategory: string;
  division: string;
  totalProductsCount: number;
  productCount: number;
  status: 'Active' | 'Inactive';
  description: string;
  subCategories: string[];
}

export const MOCK_CATEGORIES: CategoryItem[] = [
  { id: 'cat_01', code: 'CAT-YARN', name: 'Cotton & Blended Yarn', parentCategory: 'Raw Fibers & Spinning', division: 'Spinning Division', totalProductsCount: 24, productCount: 24, status: 'Active', description: 'Combed, carded, compact and slub spinning yarns for weaving & knitting.', subCategories: ['Ring Spun Combed', 'Carded Weaving', 'Compact Siro Spun', 'Slub & Heather Melange'] },
  { id: 'cat_02', code: 'CAT-DENIM', name: 'Denim Fabrics', parentCategory: 'Woven Fabrics', division: 'Weaving & Dyeing', totalProductsCount: 18, productCount: 18, status: 'Active', description: 'Indigo, sulfur black, stretch and rigid twill denim textiles 9oz to 14oz.', subCategories: ['Stretch Denim', 'Rigid Vintage Twill', 'Cross-Hatch Slub', 'Ecru Unbleached'] },
  { id: 'cat_03', code: 'CAT-HOMETEX', name: 'Home Textiles', parentCategory: 'Finished Consumer Goods', division: 'Processing & Stitching', totalProductsCount: 32, productCount: 32, status: 'Active', description: 'Bed linens, duvets, terry towels, percale sheets and hospital drapery.', subCategories: ['Percale Sheetings', 'Sateen Weave', 'Waffle & Terry Toweling', 'Institutional Sheeting'] },
  { id: 'cat_04', code: 'CAT-CHM', name: 'Textile Processing Chemicals', parentCategory: 'Procurement Inputs', division: 'Chemical Procurement', totalProductsCount: 15, productCount: 15, status: 'Active', description: 'Dyes, auxiliaries, sizing binders, softeners and starch enzymes.', subCategories: ['Reactive Dyestuffs', 'Modified Starches', 'Silicone Softeners', 'Dispersing Agents'] },
];

export interface CollectionBrandItem {
  id: string;
  code: string;
  brandCode: string;
  brandName: string;
  collectionTitle: string;
  seasonYear: string;
  season: string;
  targetMarket: string;
  productsCount: number;
  totalProducts: number;
  status: 'Active' | 'Archived';
  brandBio: string;
  concept: string;
  featuredFabrics: string[];
}

export const MOCK_COLLECTION_BRANDS: CollectionBrandItem[] = [
  { id: 'cb_01', code: 'BRD-SNRYRN', brandCode: 'BRD-SNRYRN', brandName: 'Soneri Gold Spun', collectionTitle: 'Classic Export Combed Ring Spun Series', seasonYear: 'All Season 2025', season: 'All Season 2025', targetMarket: 'European & Far East Weaving Mills', productsCount: 12, totalProducts: 12, status: 'Active', brandBio: 'Premier staple fiber cotton ring spun yarn produced on Swiss Rieter machinery.', concept: 'Premier staple fiber cotton ring spun yarn produced on Swiss Rieter machinery.', featuredFabrics: ['Combed Cotton Ne 30/1', 'Compact Siro Ne 40/1', 'Organic Cotton Ring Spun'] },
  { id: 'cb_02', code: 'BRD-INDIGO', brandCode: 'BRD-INDIGO', brandName: 'Indigo Luxe Denim', collectionTitle: 'Authentic Heritage Slub Stretch Collection', seasonYear: 'Autumn / Winter 2025', season: 'Autumn / Winter 2025', targetMarket: 'High-Street Apparel Brands UK & USA', productsCount: 9, totalProducts: 9, status: 'Active', brandBio: 'Sustainable rope-dyed denim fabrics with clean washdown and eco-certified indigo.', concept: 'Sustainable rope-dyed denim fabrics with clean washdown and eco-certified indigo.', featuredFabrics: ['11.5 Oz Stretch Denim', '13.5 Oz Selvedge Rigid', '9.5 Oz Shirting Chambray'] },
  { id: 'cb_03', code: 'BRD-ECOPURE', brandCode: 'BRD-ECOPURE', brandName: 'EcoPure Organics', collectionTitle: 'GOTS Certified Bio Bedlinen Capsule', seasonYear: 'Spring / Summer 2025', season: 'Spring / Summer 2025', targetMarket: 'Hospitality & Luxury Home Boutiques EU', productsCount: 15, totalProducts: 15, status: 'Active', brandBio: '100% Organic combed cotton sheetings free from synthetic pesticides and harmful dyes.', concept: '100% Organic combed cotton sheetings free from synthetic pesticides and harmful dyes.', featuredFabrics: ['200TC Percale Sheeting', '300TC Sateen Sheeting', 'Organic Waffle Terry'] },
];

export interface ProductItem {
  id: string;
  sku: string;
  name: string;
  title: string;
  category: string;
  brand: string;
  unitOfMeasure: string;
  unit: string;
  standardCostPKR: number;
  exportPriceUSD: number;
  pricePerUnit: number;
  currency: string;
  inStockQty: number;
  stockAvailable: number;
  reorderLevel: number;
  composition: string;
  gsm: string;
  yarnCount: string;
  widthInch: string | number;
  status: 'Active' | 'Low Stock' | 'Discontinued';
  specifications: {
    composition: string;
    weaveOrCount: string;
    widthGsm: string;
    certification: string;
  };
}

export const MOCK_PRODUCTS: ProductItem[] = [
  {
    id: 'prd_01',
    sku: 'SKU-YRN-30-CMB',
    name: '100% Combed Cotton Weaving Yarn Ne 30/1',
    title: '100% Combed Cotton Weaving Yarn Ne 30/1',
    category: 'Cotton & Blended Yarn',
    brand: 'Soneri Gold Spun',
    unitOfMeasure: 'Kg',
    unit: 'Kg',
    standardCostPKR: 810,
    exportPriceUSD: 3.25,
    pricePerUnit: 3.25,
    currency: 'USD',
    inStockQty: 48000,
    stockAvailable: 48000,
    reorderLevel: 10000,
    composition: '100% Cotton',
    gsm: 'N/A',
    yarnCount: 'Ne 30/1',
    widthInch: 'Cones',
    status: 'Active',
    specifications: {
      composition: '100% Premium Pakistani Raw Cotton (MNH-886)',
      weaveOrCount: 'Ne 30/1 Ring Spun Weaving Twist',
      widthGsm: 'CSP 2850, Uster CV% 11.2',
      certification: 'OEKO-TEX Standard 100, BCI Cotton',
    },
  },
  {
    id: 'prd_02',
    sku: 'SKU-DNM-115-SLB',
    name: 'Indigo Slub Stretch Denim Fabric 11.5 Oz',
    title: 'Indigo Slub Stretch Denim Fabric 11.5 Oz',
    category: 'Denim Fabrics',
    brand: 'Indigo Luxe Denim',
    unitOfMeasure: 'Meters',
    unit: 'Meters',
    standardCostPKR: 690,
    exportPriceUSD: 2.80,
    pricePerUnit: 2.80,
    currency: 'USD',
    inStockQty: 32500,
    stockAvailable: 32500,
    reorderLevel: 8000,
    composition: '98% Cotton / 2% Lycra',
    gsm: '390 GSM',
    yarnCount: 'Slub x Ring',
    widthInch: '58/60',
    status: 'Active',
    specifications: {
      composition: '98% Cotton / 2% Lycra Spandex',
      weaveOrCount: '3/1 Right Hand Twill Ring x Slub',
      widthGsm: '58/60 Inch Cuttable Width, 390 GSM',
      certification: 'ZDHC Level 3, Cradle to Cradle Gold',
    },
  },
  {
    id: 'prd_03',
    sku: 'SKU-HOM-PER-200',
    name: 'Organic Cotton Percale 200TC Bedlinen Sheeting',
    title: 'Organic Cotton Percale 200TC Bedlinen Sheeting',
    category: 'Home Textiles',
    brand: 'EcoPure Organics',
    unitOfMeasure: 'Meters',
    unit: 'Meters',
    standardCostPKR: 890,
    exportPriceUSD: 3.60,
    pricePerUnit: 3.60,
    currency: 'USD',
    inStockQty: 6200,
    stockAvailable: 6200,
    reorderLevel: 7500,
    composition: '100% Organic Cotton',
    gsm: '125 GSM',
    yarnCount: '40s x 40s',
    widthInch: '108',
    status: 'Low Stock',
    specifications: {
      composition: '100% GOTS Certified Organic Cotton',
      weaveOrCount: 'Percale 1/1 Plain Weave 40s x 40s (110x90)',
      widthGsm: '108 Inch Wide Bleached White Finished, 125 GSM',
      certification: 'GOTS Organic, Fairtrade Cotton',
    },
  },
];

// Catalog Aliases for components
export type CatalogCategoryItem = CategoryItem;
export type CatalogProductItem = ProductItem;
export const MOCK_CATALOG_CATEGORIES = MOCK_CATEGORIES;
export const MOCK_CATALOG_PRODUCTS = MOCK_PRODUCTS;

// ==========================================
// 7. ADMINISTRATOR WORKSTREAMS
// ==========================================

export interface UserAuthorizationRole {
  roleId: string;
  roleName: string;
  description: string;
  usersCount: number;
  permissions: {
    module: string;
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    approve: boolean;
  }[];
}

export const MOCK_AUTH_ROLES: UserAuthorizationRole[] = [
  {
    roleId: 'role_admin',
    roleName: 'MasterAdmin',
    description: 'Full root enterprise access across all modules and audit configurations.',
    usersCount: 3,
    permissions: [
      { module: 'Administrator', view: true, create: true, edit: true, delete: true, approve: true },
      { module: 'Finance', view: true, create: true, edit: true, delete: true, approve: true },
      { module: 'Export', view: true, create: true, edit: true, delete: true, approve: true },
      { module: 'Purchase', view: true, create: true, edit: true, delete: true, approve: true },
      { module: 'Sales', view: true, create: true, edit: true, delete: true, approve: true },
      { module: 'Marketing', view: true, create: true, edit: true, delete: true, approve: true },
      { module: 'Catalog', view: true, create: true, edit: true, delete: true, approve: true },
    ],
  },
  {
    roleId: 'role_fin',
    roleName: 'Finance Manager',
    description: 'Financial ledger authority, PO authorization, payments, and supplier reconciliation.',
    usersCount: 2,
    permissions: [
      { module: 'Administrator', view: false, create: false, edit: false, delete: false, approve: false },
      { module: 'Finance', view: true, create: true, edit: true, delete: false, approve: true },
      { module: 'Export', view: true, create: false, edit: false, delete: false, approve: false },
      { module: 'Purchase', view: true, create: false, edit: false, delete: false, approve: true },
      { module: 'Sales', view: true, create: false, edit: true, delete: false, approve: true },
      { module: 'Marketing', view: true, create: false, edit: false, delete: false, approve: false },
      { module: 'Catalog', view: true, create: false, edit: false, delete: false, approve: false },
    ],
  },
  {
    roleId: 'role_pur',
    roleName: 'Purchase Incharge',
    description: 'Requisition processing, vendor PO generation, and goods receipt tracking.',
    usersCount: 4,
    permissions: [
      { module: 'Administrator', view: false, create: false, edit: false, delete: false, approve: false },
      { module: 'Finance', view: true, create: false, edit: false, delete: false, approve: false },
      { module: 'Export', view: false, create: false, edit: false, delete: false, approve: false },
      { module: 'Purchase', view: true, create: true, edit: true, delete: false, approve: false },
      { module: 'Sales', view: false, create: false, edit: false, delete: false, approve: false },
      { module: 'Marketing', view: false, create: false, edit: false, delete: false, approve: false },
      { module: 'Catalog', view: true, create: false, edit: false, delete: false, approve: false },
    ],
  },
  {
    roleId: 'role_mkt',
    roleName: 'Senior Marketer Export',
    description: 'Exhibition coordination, international lead development, and customer quotes.',
    usersCount: 5,
    permissions: [
      { module: 'Administrator', view: false, create: false, edit: false, delete: false, approve: false },
      { module: 'Finance', view: false, create: false, edit: false, delete: false, approve: false },
      { module: 'Export', view: true, create: false, edit: false, delete: false, approve: false },
      { module: 'Purchase', view: false, create: false, edit: false, delete: false, approve: false },
      { module: 'Sales', view: true, create: true, edit: true, delete: false, approve: false },
      { module: 'Marketing', view: true, create: true, edit: true, delete: false, approve: true },
      { module: 'Catalog', view: true, create: true, edit: false, delete: false, approve: false },
    ],
  },
];

export interface ExchangeRateItem {
  id: string;
  currencyCode: string;
  currencyName: string;
  symbol: string;
  interbankBuying: number;
  interbankSelling: number;
  openMarketBuying: number;
  openMarketSelling: number;
  effectiveDate: string;
  lastUpdated: string;
  isBaseCurrency?: boolean;
}

export const MOCK_EXCHANGE_RATES: ExchangeRateItem[] = [
  { id: 'rate_usd', currencyCode: 'USD', currencyName: 'US Dollar', symbol: '$', interbankBuying: 279.15, interbankSelling: 279.65, openMarketBuying: 280.20, openMarketSelling: 281.50, effectiveDate: '2025-02-18', lastUpdated: 'Today 09:30 AM' },
  { id: 'rate_eur', currencyCode: 'EUR', currencyName: 'Euro', symbol: '€', interbankBuying: 290.40, interbankSelling: 291.10, openMarketBuying: 291.80, openMarketSelling: 293.40, effectiveDate: '2025-02-18', lastUpdated: 'Today 09:30 AM' },
  { id: 'rate_gbp', currencyCode: 'GBP', currencyName: 'British Pound', symbol: '£', interbankBuying: 348.80, interbankSelling: 349.70, openMarketBuying: 350.50, openMarketSelling: 352.20, effectiveDate: '2025-02-18', lastUpdated: 'Today 09:30 AM' },
  { id: 'rate_aed', currencyCode: 'AED', currencyName: 'UAE Dirham', symbol: 'AED', interbankBuying: 76.00, interbankSelling: 76.25, openMarketBuying: 76.40, openMarketSelling: 76.90, effectiveDate: '2025-02-18', lastUpdated: 'Today 09:30 AM' },
  { id: 'rate_cny', currencyCode: 'CNY', currencyName: 'Chinese Yuan', symbol: '¥', interbankBuying: 38.45, interbankSelling: 38.65, openMarketBuying: 38.80, openMarketSelling: 39.20, effectiveDate: '2025-02-18', lastUpdated: 'Today 09:30 AM' },
];

export interface IPWhitelistItem {
  id: string;
  ipAddress: string;
  description: string;
  networkLocation: string;
  addedBy: string;
  dateAdded: string;
  status: 'Active' | 'Disabled';
}

export const MOCK_IP_WHITELIST: IPWhitelistItem[] = [
  { id: 'ip_1', ipAddress: '182.180.124.52/32', description: 'Head Office PTCL Dedicated Fiber Line', networkLocation: 'Lahore Head Office', addedBy: 'software.admin', dateAdded: '2025-01-10', status: 'Active' },
  { id: 'ip_2', ipAddress: '39.44.18.210/32', description: 'Spinning Mill No. 1 StormFiber Corporate Link', networkLocation: 'Raiwind Mill Site', addedBy: 'software.admin', dateAdded: '2025-01-12', status: 'Active' },
  { id: 'ip_3', ipAddress: '111.119.160.84/29', description: 'Dyeing & Bleaching Unit Static Subnet', networkLocation: 'Sheikhupura Plant', addedBy: 'software.admin', dateAdded: '2025-01-18', status: 'Active' },
  { id: 'ip_4', ipAddress: '175.107.198.14/32', description: 'Executive Remote Access WireGuard VPN', networkLocation: 'Cloud VPN Gateway', addedBy: 'md.soneri', dateAdded: '2025-02-01', status: 'Active' },
];

export interface UserAuthItem {
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
  isSuperAdmin: boolean;
  lastLogin: string;
  permissions: {
    module: string;
    canView: boolean;
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canApprove: boolean;
  }[];
}

export const MOCK_USER_AUTHORIZATIONS: UserAuthItem[] = [
  {
    userId: 'usr_001',
    userName: 'Software Admin',
    userEmail: 'software.admin@sonerigroup.com',
    role: 'MasterAdmin',
    isSuperAdmin: true,
    lastLogin: 'Today 09:15 AM',
    permissions: [
      { module: 'Finance', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
      { module: 'Export', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
      { module: 'Purchase', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
      { module: 'Sales', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
      { module: 'Marketing', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
      { module: 'Catalog', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
      { module: 'Administrator', canView: true, canCreate: true, canEdit: true, canDelete: true, canApprove: true },
    ],
  },
  {
    userId: 'usr_002',
    userName: 'M. Uzair',
    userEmail: 'accounts.pk@sonerigroup.com',
    role: 'Finance Manager',
    isSuperAdmin: false,
    lastLogin: 'Today 08:45 AM',
    permissions: [
      { module: 'Finance', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: true },
      { module: 'Purchase', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: true },
      { module: 'Sales', canView: true, canCreate: false, canEdit: true, canDelete: false, canApprove: true },
      { module: 'Export', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    ],
  },
  {
    userId: 'usr_003',
    userName: 'Rushan Ahmed',
    userEmail: 'rushan.ahmed@sonerigroup.com',
    role: 'Purchase Manager',
    isSuperAdmin: false,
    lastLogin: 'Yesterday 05:20 PM',
    permissions: [
      { module: 'Purchase', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: true },
      { module: 'Finance', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
      { module: 'Catalog', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    ],
  },
  {
    userId: 'usr_004',
    userName: 'BS (Senior Export Marketer)',
    userEmail: 'marketing.bs@sonerigroup.com',
    role: 'Senior Marketer Export',
    isSuperAdmin: false,
    lastLogin: 'Today 10:02 AM',
    permissions: [
      { module: 'Marketing', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: true },
      { module: 'Sales', canView: true, canCreate: true, canEdit: true, canDelete: false, canApprove: false },
      { module: 'Catalog', canView: true, canCreate: true, canEdit: false, canDelete: false, canApprove: false },
      { module: 'Export', canView: true, canCreate: false, canEdit: false, canDelete: false, canApprove: false },
    ],
  },
];

export interface IpWhitelistItem {
  id: string;
  ipAddress: string;
  description: string;
  location?: string;
  networkLocation?: string;
  status: 'Active' | 'Blocked' | 'Disabled';
  allowedRoles?: string[];
  addedDate?: string;
  dateAdded?: string;
  addedBy: string;
}

export const MOCK_IP_WHITELISTS: IpWhitelistItem[] = [
  {
    id: 'ip_1',
    ipAddress: '182.180.124.52/32',
    description: 'Head Office PTCL Dedicated Fiber Line',
    location: 'Lahore Corporate Head Office',
    networkLocation: 'Lahore Head Office',
    status: 'Active',
    allowedRoles: ['Super Admin', 'Finance Approver', 'Senior Marketer'],
    addedDate: '2025-01-10',
    dateAdded: '2025-01-10',
    addedBy: 'software.admin',
  },
  {
    id: 'ip_2',
    ipAddress: '39.44.18.210/32',
    description: 'Spinning Mill No. 1 StormFiber Link',
    location: 'Raiwind Mill Operations',
    networkLocation: 'Raiwind Mill Site',
    status: 'Active',
    allowedRoles: ['Super Admin', 'Plant Director'],
    addedDate: '2025-01-12',
    dateAdded: '2025-01-12',
    addedBy: 'software.admin',
  },
  {
    id: 'ip_3',
    ipAddress: '111.119.160.84/29',
    description: 'Dyeing & Bleaching Unit Static Subnet',
    location: 'Sheikhupura Plant Terminal',
    networkLocation: 'Sheikhupura Plant',
    status: 'Active',
    allowedRoles: ['Super Admin', 'Production Manager'],
    addedDate: '2025-01-18',
    dateAdded: '2025-01-18',
    addedBy: 'software.admin',
  },
  {
    id: 'ip_4',
    ipAddress: '175.107.198.14/32',
    description: 'Executive Remote Access WireGuard VPN',
    location: 'Encrypted Cloud Gateway',
    networkLocation: 'Cloud VPN Gateway',
    status: 'Active',
    allowedRoles: ['Super Admin'],
    addedDate: '2025-02-01',
    dateAdded: '2025-02-01',
    addedBy: 'md.soneri',
  },
];

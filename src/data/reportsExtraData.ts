/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Extra report mock data — image field parity
 */

export const SUPPLIER_AGING = [
  {
    id: 'sa1',
    supplier: 'SU-046 - AMBER NUTRITION PVT LTD',
    totalInvoice: '$48,200.00',
    totalJv: '$1,200.00',
    totalPaid: '$32,000.00',
    totalRemaining: '$17,400.00',
    rows: [
      {
        proforma: 'PI-2345',
        customer: 'CU-090 - RITA FOOD',
        company: 'Soneri International',
        marketing: 'BILAL',
        placeDelivery: 'Dubai',
        portDischarge: 'Jebel Ali',
        invoices: [
          {
            inquiry: 'EI-501',
            purchaseInvoice: 'PINV-881',
            ciNumber: 'CI-2201',
            ciDate: '20/03/2026',
            days: 42,
            invoiceAmount: '$18,400.00',
            jvAdj: '$400.00',
            paid: '$10,000.00',
            remaining: '$8,800.00',
            shipments: [
              {
                code: 'SH-441',
                created: '12/03/2026',
                containerType: '40 ft HC',
                containerNo: 'MSKU998877',
                gateOut: '18/03/2026',
                eta: '28/03/2026',
                blNumber: 'HBL-4412',
              },
            ],
          },
        ],
      },
    ],
  },
];

export const CUSTOMER_AGING = [
  {
    id: 'ca1',
    customer: 'CU-057 - ADE KOMPANI DOOEL',
    totalDays: 38,
    totalInvoice: '$30,303.00',
    totalSaleReturn: '$0.00',
    totalJvAdj: '$0.00',
    remainingAdvance: '$0.00',
    totalRemaining: '$4,999.15',
    proformas: [
      {
        code: 'PI-832',
        company: 'Soneri International',
        marketing: 'BILAL',
        placeDelivery: 'Skopje',
        portDischarge: 'PT-SKP',
        advance: '$0.00',
        totalPaid: '$25,303.85',
        totalRemaining: '$4,999.15',
        inquiries: [
          {
            inquiry: 'EI-633',
            invoice: 'SI-609',
            days: 38,
            invoiceAmount: '$30,303.00',
            saleReturn: '$0.00',
            jvAdj: '$0.00',
            adjAdvance: '$0.00',
            shipments: [
              {
                code: 'SH-902',
                created: '01/08/2026',
                containerType: '40 ft HC',
                containerNo: 'TGHU445566',
                gateOut: '05/08/2026',
                eta: '20/08/2026',
                blNumber: 'HBL-9021',
              },
            ],
          },
        ],
      },
    ],
  },
];

export const PAYABLE_ROWS = [
  { id: 'pay1', vendor: 'AL-AZIZ INDUSTRIES PAKISTAN', opening: 'USD (12,400.00)', debit: 'USD 8,200.00', credit: 'USD 3,100.00', closing: 'USD (7,300.00)', negative: true },
  { id: 'pay2', vendor: 'INDUS DYES & CHEMICALS LTD', opening: 'USD 4,800.00', debit: 'USD 2,100.00', credit: 'USD 1,400.00', closing: 'USD 5,500.00', negative: false },
  { id: 'pay3', vendor: 'PAK POLY PACKAGING', opening: 'USD 1,250.00', debit: 'USD 900.00', credit: 'USD 600.00', closing: 'USD 1,550.00', negative: false },
];

export const RECEIVABLE_ROWS = [
  { id: 'rec1', customer: 'HIMPEX SARL', advance: 'USD 2,400.00', opening: 'USD 18,200.00', debit: 'USD 6,100.00', credit: 'USD 9,800.00', closing: 'USD 14,500.00', negative: false },
  { id: 'rec2', customer: 'ADE KOMPANI DOOEL', advance: 'USD (500.00)', opening: 'USD 4,999.15', debit: 'USD 1,200.00', credit: 'USD 800.00', closing: 'USD 5,399.15', negative: false },
  { id: 'rec3', customer: 'TURK FOOD SWEDEN AB', advance: 'USD 0.00', opening: 'USD (1,100.00)', debit: 'USD 3,400.00', credit: 'USD 2,200.00', closing: 'USD 100.00', negative: false },
];

export const OVERALL_PNL = {
  revenue: [{ label: 'Total Revenue', amount: 'USD 1,245,800.0000', highlight: true }],
  cogs: [
    { label: 'Opening Stock', amount: 'USD 120,000.0000', highlight: false },
    { label: 'Add Purchase', amount: 'USD 640,500.0000', highlight: false },
    { label: 'Total Goods Available for sale', amount: 'USD 760,500.0000', highlight: true },
    { label: 'Less: Closing Stock', amount: 'USD 95,200.0000', highlight: false },
    { label: 'TOTAL COST OF GOOD SOLD (COGS)', amount: 'USD 665,300.0000', highlight: true },
  ],
  grossProfit: 'USD 580,500.0000',
  expenditures: [
    { label: 'GENERAL & ADMINISTRATIVE', amount: 'USD 84,200.0000', highlight: false },
    { label: 'Total Expenditures', amount: 'USD 84,200.0000', highlight: true },
  ],
  netProfit: 'USD 496,300.0000',
};

export const CASH_FLOW_LEFT = [
  { id: 'a1', label: 'Assets', amount: 'USD 11,885,035.30', level: 0, children: [
    { id: 'a2', label: 'CURRENT ASSETS', amount: 'USD 8,420,100.00', level: 1, children: [
      { id: 'a3', label: 'CASH IN HAND', amount: 'USD 420,800.00', level: 2 },
      { id: 'a4', label: 'INVENTORY IN HAND', amount: 'USD 1,850,000.00', level: 2 },
      { id: 'a5', label: 'RECEIVABLE - OTHERS', amount: 'USD 2,140,200.00', level: 2 },
      { id: 'a6', label: 'PREPAID EXPENSES', amount: 'USD 98,400.00', level: 2 },
    ]},
    { id: 'a7', label: 'FIXED ASSETS', amount: 'USD 3,100,000.00', level: 1 },
    { id: 'a8', label: 'INTANGIBLE ASSETS', amount: 'USD 364,935.30', level: 1 },
  ]},
  { id: 'l1', label: 'Liabilities', amount: 'USD 4,210,400.00', level: 0 },
];

export const CASH_FLOW_RIGHT = [
  { id: 'r1', label: 'Assets', amount: 'USD (1,120,400.50)', level: 0, neg: true, children: [
    { id: 'r2', label: 'CURRENT ASSETS', amount: 'USD (820,100.00)', level: 1, neg: true },
  ]},
  { id: 'r3', label: 'Liabilities', amount: 'USD (627,613.42)', level: 0, neg: true },
];

export type TrialNode = {
  id: string;
  title: string;
  opening: string;
  debit: string;
  credit: string;
  closing: string;
  neg?: boolean;
  children?: TrialNode[];
};

export const TRIAL_BALANCE: TrialNode[] = [
  {
    id: 'tb-assets',
    title: 'ASSETS',
    opening: '2,400,000.00',
    debit: '180,000.00',
    credit: '95,000.00',
    closing: '2,485,000.00',
    children: [
      {
        id: 'tb-current',
        title: 'CURRENT ASSETS',
        opening: '1,100,000.00',
        debit: '90,000.00',
        credit: '40,000.00',
        closing: '1,150,000.00',
        children: [
          {
            id: 'tb-cash',
            title: 'CASH IN HAND',
            opening: '220,000.00',
            debit: '45,000.00',
            credit: '12,000.00',
            closing: '253,000.00',
            children: [
              { id: 'tb-cash-petty', title: 'PETTY CASH', opening: '20,000.00', debit: '5,000.00', credit: '2,000.00', closing: '23,000.00' },
              { id: 'tb-cash-bank', title: 'BANK - CURRENT ACCOUNT', opening: '200,000.00', debit: '40,000.00', credit: '10,000.00', closing: '230,000.00' },
            ],
          },
          { id: 'tb-inv', title: 'INVENTORY IN HAND', opening: '480,000.00', debit: '25,000.00', credit: '18,000.00', closing: '487,000.00' },
          { id: 'tb-recv', title: 'RECEIVABLE - OTHERS', opening: '320,000.00', debit: '15,000.00', credit: '8,000.00', closing: '327,000.00' },
          { id: 'tb-prepaid', title: 'PREPAID EXPENSES', opening: '80,000.00', debit: '5,000.00', credit: '2,000.00', closing: '83,000.00' },
        ],
      },
      {
        id: 'tb-fixed',
        title: 'FIXED ASSETS',
        opening: '1,100,000.00',
        debit: '70,000.00',
        credit: '40,000.00',
        closing: '1,130,000.00',
        children: [
          { id: 'tb-plant', title: 'PLANT & MACHINERY', opening: '700,000.00', debit: '40,000.00', credit: '20,000.00', closing: '720,000.00' },
          { id: 'tb-vehicle', title: 'VEHICLES', opening: '400,000.00', debit: '30,000.00', credit: '20,000.00', closing: '410,000.00' },
        ],
      },
      { id: 'tb-intangible', title: 'INTANGIBLE ASSETS', opening: '200,000.00', debit: '20,000.00', credit: '15,000.00', closing: '205,000.00' },
    ],
  },
  {
    id: 'tb-liab',
    title: 'Liabilities',
    opening: '(890,000.00)',
    debit: '30,000.00',
    credit: '55,000.00',
    closing: '(915,000.00)',
    neg: true,
    children: [
      {
        id: 'tb-curr-liab',
        title: 'CURRENT LIABILITIES',
        opening: '(520,000.00)',
        debit: '20,000.00',
        credit: '35,000.00',
        closing: '(535,000.00)',
        neg: true,
        children: [
          { id: 'tb-pay', title: 'ACCOUNTS PAYABLE', opening: '(380,000.00)', debit: '15,000.00', credit: '25,000.00', closing: '(390,000.00)', neg: true },
          { id: 'tb-accrued', title: 'ACCRUED EXPENSES', opening: '(140,000.00)', debit: '5,000.00', credit: '10,000.00', closing: '(145,000.00)', neg: true },
        ],
      },
      { id: 'tb-long-liab', title: 'LONG TERM LIABILITIES', opening: '(370,000.00)', debit: '10,000.00', credit: '20,000.00', closing: '(380,000.00)', neg: true },
    ],
  },
  {
    id: 'tb-equity',
    title: 'Equity',
    opening: '1,200,000.00',
    debit: '0.00',
    credit: '25,000.00',
    closing: '1,225,000.00',
    children: [
      { id: 'tb-capital', title: 'SHARE CAPITAL', opening: '1,000,000.00', debit: '0.00', credit: '0.00', closing: '1,000,000.00' },
      { id: 'tb-retained', title: 'RETAINED EARNINGS', opening: '200,000.00', debit: '0.00', credit: '25,000.00', closing: '225,000.00' },
    ],
  },
  {
    id: 'tb-income',
    title: 'Income',
    opening: '0.00',
    debit: '0.00',
    credit: '640,500.00',
    closing: '(640,500.00)',
    neg: true,
    children: [
      {
        id: 'tb-sales-rev',
        title: 'SALES REVENUE',
        opening: '0.00',
        debit: '0.00',
        credit: '640,500.00',
        closing: '(640,500.00)',
        neg: true,
        children: [
          {
            id: 'tb-sales',
            title: 'SALES',
            opening: '0.00',
            debit: '0.00',
            credit: '610,000.00',
            closing: '(610,000.00)',
            neg: true,
            children: [
              { id: 'tb-sales-local', title: 'SALES - LOCAL', opening: '0.00', debit: '0.00', credit: '180,000.00', closing: '(180,000.00)', neg: true },
              { id: 'tb-sales-export', title: 'SALES - EXPORT', opening: '0.00', debit: '0.00', credit: '430,000.00', closing: '(430,000.00)', neg: true },
            ],
          },
          { id: 'tb-other-inc', title: 'OTHER INCOME', opening: '0.00', debit: '0.00', credit: '30,500.00', closing: '(30,500.00)', neg: true },
        ],
      },
    ],
  },
  {
    id: 'tb-exp',
    title: 'Expenses',
    opening: '0.00',
    debit: '84,200.00',
    credit: '0.00',
    closing: '84,200.00',
    children: [
      {
        id: 'tb-opex',
        title: 'OPERATING EXPENSES',
        opening: '0.00',
        debit: '84,200.00',
        credit: '0.00',
        closing: '84,200.00',
        children: [
          { id: 'tb-ga', title: 'GENERAL & ADMINISTRATIVE', opening: '0.00', debit: '52,400.00', credit: '0.00', closing: '52,400.00' },
          { id: 'tb-selling', title: 'SELLING & DISTRIBUTION', opening: '0.00', debit: '31,800.00', credit: '0.00', closing: '31,800.00' },
        ],
      },
    ],
  },
];

export const INVENTORY = [
  { id: 'inv1', name: 'DELUXO ROZA ROAD CONFECTIONARY 110 GRAM (12 GM POUCH) 12 BAGS PER CARTON', variation: 'Chocolate', qty: 2500, invoiceCode: 'PO-757 - SO-235 - RI-556 - CO-023 - Boran International - CU-090 - RITA FOOD' },
  { id: 'inv2', name: 'BINGO SINGLE TWIST LOLLIPOP 18 GRAM 48 PCS PER BAG', variation: 'Assorted', qty: 4300, invoiceCode: 'PO-760 - SO-240 - RI-560 - CO-001 - Soneri Foods - CU-061 - HIMPEX' },
  { id: 'inv3', name: 'CHOCOMINTA CENTER FILLED CANDY 3.8G JAR PACK', variation: 'Mint', qty: 5900, invoiceCode: 'PO-762 - SO-244 - RI-565 - CO-001 - Soneri Foods - CU-072 - MARUBENI' },
  { id: 'inv4', name: 'LOVSKIN BLEACH CREAM 50 ML JAR', variation: 'Day Night', qty: 1200, invoiceCode: 'PO-770 - SO-250 - RI-570 - CO-002 - Soneri Care - CU-150 - AL NAJAH' },
];

export const PARTY_WISE = [
  {
    id: 'pw1',
    customer: 'AL-BARAKA',
    details: {
      company: 'Soneri International',
      portLoading: 'Port Qasim',
      portDischarge: 'Jebel Ali',
      deliveryMonth: 'Aug 2026',
      voyager: 'MSC OSCAR',
      container: '40 ft HC x 2',
      deliveredContainers: 2,
    },
    tx: {
      inquiry: 'EI-701',
      payDays: 30,
      saleInvoice: 'SI-640',
      txDate: '14/08/2026',
      totalInvoice: '$41,200.00',
    },
    shipment: {
      code: 'SH-701',
      date: '16/08/2026',
      location: 'KHI',
      blNumber: 'HBL-7011',
      eta: '28/08/2026',
      doNo: 'DO-881',
      origBl: 'Yes',
      gateOut: '18/08/2026',
      voyageNo: 'V-441',
      vesselNo: 'MSC-998',
    },
    products: [
      { name: 'DESI GHEE 400GM', variation: 'Plain', qty: '400 Carton', uPrice: '$4.20', sPrice: '$5.80', amount: '$2,320.00', destination: 'Dubai' },
    ],
  },
];

export const SALES_SUMMARY = [
  {
    id: 'ss1',
    country: "Côte d'Ivoire",
    customer: 'CU-061 - HIMPEX SARL',
    rows: [
      { approvedDate: '02/08/2026', product: '70G-M316 CANDY FILLED FOIL WRAPPED MIXED FLAVOUR', qty: 1200 },
      { approvedDate: '05/08/2026', product: 'BINGO LOLLIPOP 18G 48 PCS BAG', qty: 800 },
    ],
  },
  {
    id: 'ss2',
    country: 'Senegal',
    customer: 'CU-076 - ARIDIM',
    rows: [
      { approvedDate: '08/08/2026', product: 'CHOCOLINA MILK CANDY FAMILY PACK 200G', qty: 640 },
    ],
  },
  {
    id: 'ss3',
    country: 'Somalia',
    customer: 'CU-111 - ZARA TRADING',
    rows: [
      { approvedDate: '11/08/2026', product: 'AMA BOM BOM CHILLI BOMBA ASSORTMENT', qty: 420 },
      { approvedDate: '12/08/2026', product: 'BRUSH POP LOLLIPOP NOVELTY PACK', qty: 310 },
    ],
  },
];

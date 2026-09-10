/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ChartDataPoint {
  label: string;
  fullName: string;
  delivered: number;
  confirmed: number;
  profit: number;
}

export interface MetricCardData {
  id: string;
  label: string;
  value: string | number;
  color: string;
  accentColor: string;
  iconName: 'user' | 'file' | 'list' | 'supplier' | 'cash';
}

export const DASHBOARD_METRIC_CARDS: MetricCardData[] = [
  {
    id: 'total_customer',
    label: 'TOTAL CUSTOMER',
    value: 140,
    color: '#2563eb',
    accentColor: '#3b82f6',
    iconName: 'user',
  },
  {
    id: 'total_proformas',
    label: 'TOTAL PROFORMAS',
    value: 675,
    color: '#0d9488',
    accentColor: '#14b8a6',
    iconName: 'file',
  },
  {
    id: 'total_sale_orders',
    label: 'TOTAL SALE ORDERS',
    value: 504,
    color: '#7c3aed',
    accentColor: '#8b5cf6',
    iconName: 'list',
  },
  {
    id: 'total_suppliers',
    label: 'TOTAL SUPPLIERS',
    value: 167,
    color: '#ea580c',
    accentColor: '#f97316',
    iconName: 'supplier',
  },
];

export const CASH_FLOW_DATA = {
  label: 'CASH FLOW',
  maskedValue: 'USD •••••••••',
  actualValue: 'USD 1,842,500.00',
  color: '#16a34a',
  accentColor: '#22c55e',
};

// 1. Container Wise Forecast (JAN - DEC)
export const FORECAST_CHART_DATA: ChartDataPoint[] = [
  { label: 'JAN', fullName: 'January 2026', delivered: 72, confirmed: 2, profit: 370000 },
  { label: 'FEB', fullName: 'February 2026', delivered: 70, confirmed: 3, profit: 360000 },
  { label: 'MAR', fullName: 'March 2026', delivered: 53, confirmed: 0, profit: 260000 },
  { label: 'APR', fullName: 'April 2026', delivered: 71, confirmed: 0, profit: 380000 },
  { label: 'MAY', fullName: 'May 2026', delivered: 72, confirmed: 2, profit: 410000 },
  { label: 'JUN', fullName: 'June 2026', delivered: 63, confirmed: 0, profit: 360000 },
  { label: 'JUL', fullName: 'July 2026', delivered: 65, confirmed: 3, profit: 340000 },
  { label: 'AUG', fullName: 'August 2026', delivered: 60, confirmed: 18, profit: 470000 },
  { label: 'SEP', fullName: 'September 2026', delivered: 2, confirmed: 56, profit: 400000 },
  { label: 'OCT', fullName: 'October 2026', delivered: 0, confirmed: 28, profit: 170000 },
  { label: 'NOV', fullName: 'November 2026', delivered: 0, confirmed: 11, profit: 45000 },
  { label: 'DEC', fullName: 'December 2026', delivered: 0, confirmed: 10, profit: 40000 },
];

// 2. Customer Wise Container
export const CUSTOMER_CHART_DATA: ChartDataPoint[] = [
  { label: 'CU-045 - Meera...', fullName: 'CU-045 - Meera Global Trading Ltd', delivered: 14, confirmed: 0, profit: 120000 },
  { label: 'CU-048 - AL-M...', fullName: 'CU-048 - AL-Madina General Merchandise', delivered: 18, confirmed: 0, profit: 75000 },
  { label: 'CU-050 - KEO S...', fullName: 'CU-050 - KEO Star Commercial Corp', delivered: 30, confirmed: 6, profit: 245000 },
  { label: 'CU-058 - SATIN...', fullName: 'CU-058 - SATIN International FZE', delivered: 16, confirmed: 1, profit: 95000 },
  { label: 'CU-061 - HIMP...', fullName: 'CU-061 - HIMPEX Overseas Ltd', delivered: 58, confirmed: 7, profit: 240000 },
  { label: 'CU-066 - AMA B...', fullName: 'CU-066 - AMA Bulk Carriers & Trading', delivered: 44, confirmed: 36, profit: 485000 },
  { label: 'CU-073 - SOCIE...', fullName: 'CU-073 - SOCIETE Africaine De Distribution', delivered: 22, confirmed: 0, profit: 185000 },
  { label: 'CU-076 - ARIDI...', fullName: 'CU-076 - ARIDIS Commercial Import Co', delivered: 38, confirmed: 3, profit: 180000 },
  { label: 'CU-109 - RAJA...', fullName: 'CU-109 - RAJAB Logistics & Commodities', delivered: 19, confirmed: 8, profit: 205000 },
  { label: 'CU-119 - ETS P...', fullName: 'CU-119 - ETS PAN-AFRIQUE SARL', delivered: 19, confirmed: 6, profit: 120000 },
];

// 3. Supplier Wise Container
export const SUPPLIER_CHART_DATA: ChartDataPoint[] = [
  { label: 'SP-024 - DANP...', fullName: 'SP-024 - DANPAK FOOD INDUSTRIES', delivered: 50, confirmed: 4, profit: 380000 },
  { label: 'SP-025 - BM C...', fullName: 'SP-025 - BM CONFECTIONERY', delivered: 30, confirmed: 4, profit: 284371.18 },
  { label: 'SP-026 - SUNRI...', fullName: 'SP-026 - SUNRISE COMMODITIES FZE', delivered: 118, confirmed: 21, profit: 740000 },
  { label: 'SP-027 - EURO...', fullName: 'SP-027 - EUROPA PACKAGING SYSTEMS', delivered: 48, confirmed: 6, profit: 400000 },
  { label: 'SP-028 - ...', fullName: 'SP-028 - AL-KHALEEJ TRADERS', delivered: 50, confirmed: 4, profit: 310000 },
  { label: 'SP-038 - KMG...', fullName: 'SP-038 - KMG EXPORT MILLS', delivered: 155, confirmed: 25, profit: 890000 },
  { label: 'SP-042 - ...', fullName: 'SP-042 - PREMIER TEXTILE CHEMICALS', delivered: 42, confirmed: 2, profit: 360000 },
  { label: 'SP-045 - AMBE...', fullName: 'SP-045 - AMBER PAPER PRODUCTS', delivered: 40, confirmed: 40, profit: 420000 },
  { label: 'SP-050 - NYRA ...', fullName: 'SP-050 - NYRA GLOBAL FREIGHT', delivered: 12, confirmed: 6, profit: 375000 },
];

// 4. Place of Delivery Wise Container
export const DELIVERY_PLACE_CHART_DATA: ChartDataPoint[] = [
  { label: "Cote D'Ivoire (Iv...", fullName: "Cote D'Ivoire (Ivory Coast) - Abidjan Port", delivered: 58, confirmed: 10, profit: 260000 },
  { label: 'Guinea', fullName: 'Guinea - Conakry Port', delivered: 20, confirmed: 1, profit: 75000 },
  { label: 'Mauritania', fullName: 'Mauritania - Nouakchott Port', delivered: 52, confirmed: 5, profit: 420000 },
  { label: 'Saudi Arabia', fullName: 'Saudi Arabia - Jeddah Islamic Port', delivered: 15, confirmed: 2, profit: 105000 },
  { label: 'Senegal', fullName: 'Senegal - Dakar Autonomous Port', delivered: 44, confirmed: 4, profit: 190000 },
  { label: 'South Africa', fullName: 'South Africa - Durban Port', delivered: 47, confirmed: 37, profit: 510000 },
  { label: 'South Sudan', fullName: 'South Sudan - Juba Inland Terminal', delivered: 20, confirmed: 8, profit: 165000 },
  { label: 'Uganda', fullName: 'Uganda - Kampala Dry Port', delivered: 22, confirmed: 6, profit: 160000 },
  { label: 'Vietnam', fullName: 'Vietnam - Ho Chi Minh Port', delivered: 30, confirmed: 1, profit: 220000 },
  { label: 'Yemen', fullName: 'Yemen - Hodeidah Port', delivered: 30, confirmed: 14, profit: 140000 },
];

// 5. Marketing Personal Wise Container
export const MARKETING_PERSONAL_CHART_DATA: ChartDataPoint[] = [
  { label: 'BILAL', fullName: 'BILAL - Senior Export Director', delivered: 240, confirmed: 44, profit: 1450000 },
  { label: 'PERVAIZ MOR...', fullName: 'PERVAIZ MORANI - Regional Lead', delivered: 116, confirmed: 56, profit: 960000 },
  { label: 'TEHSEENA .', fullName: 'TEHSEENA - Commercial Manager', delivered: 46, confirmed: 3, profit: 240000 },
  { label: 'ANUM KHAN', fullName: 'ANUM KHAN - Accounts Lead', delivered: 68, confirmed: 13, profit: 520000 },
  { label: 'SARIM', fullName: 'SARIM - Sales Executive', delivered: 40, confirmed: 8, profit: 340000 },
  { label: 'AZHAR', fullName: 'AZHAR - Trade Specialist', delivered: 3, confirmed: 1, profit: 40000 },
  { label: 'SHAMSUNISSA', fullName: 'SHAMSUNISSA - Export Coordinator', delivered: 10, confirmed: 3, profit: 95000 },
  { label: 'AATIKA', fullName: 'AATIKA - Client Representative', delivered: 2, confirmed: 0, profit: 15000 },
  { label: 'AYAZ', fullName: 'AYAZ - Territory Officer', delivered: 3, confirmed: 1, profit: 18077.50 },
];

// 6. Product Wise Container
export const PRODUCT_CHART_DATA: ChartDataPoint[] = [
  { label: 'PRD-001 BOOM...', fullName: 'PRD-001 BOOM BUBBLE GUM STRAWBERRY 5G', delivered: 23, confirmed: 4, profit: 125000 },
  { label: 'PRD-021 BOOM...', fullName: 'PRD-021 BOOM BUBBLE GUM BLUEBERRY 5G', delivered: 7, confirmed: 2, profit: 50000 },
  { label: 'PRD-032 BISCL...', fullName: 'PRD-032 BISCLIK CHOCOLATE WAFER 12G', delivered: 68, confirmed: 3, profit: 120000 },
  { label: 'PRD-033 BISCL...', fullName: 'PRD-033 BISCLIK VANILLA WAFER 12G', delivered: 65, confirmed: 3, profit: 105000 },
  { label: 'PRD-036 CLIKE...', fullName: 'PRD-036 CLIKER POP CANDY DISPLAY BOX', delivered: 24, confirmed: 4, profit: 60000 },
  { label: 'PRD-211 GUMM...', fullName: 'PRD-211 GUMMY BEAR ASSORTED 25G', delivered: 5, confirmed: 1, profit: 25000 },
  { label: 'PRD-275 ROFIL...', fullName: 'PRD-275 ROFILL CHOCOLATE ROLL 18G', delivered: 31, confirmed: 39, profit: 325000 },
  { label: 'PRD-342 CONI...', fullName: 'PRD-342 CONITO SWEET CONE SNACK', delivered: 13, confirmed: 2, profit: 65000 },
  { label: 'PRD-451 PICAR...', fullName: 'PRD-451 PICARD TOFFEE CREAM 10G', delivered: 5, confirmed: 1, profit: 20000 },
  { label: 'PRD-499 PICAR...', fullName: 'PRD-499 PICARD BUTTER TOFFEE 10G', delivered: 4, confirmed: 2, profit: 15000 },
];

// Table: Container Wise Forecast Without Tracking
export interface ForecastWithoutTrackingRow {
  shipmentMonths: string;
  totalNoContainers: number;
  deliveredContainers: number;
  confirmedUndelivered: number;
  projectedProfit: string;
}

export const FORECAST_WITHOUT_TRACKING_ROWS: ForecastWithoutTrackingRow[] = [
  {
    shipmentMonths: 'JAN 26',
    totalNoContainers: 5,
    deliveredContainers: 0,
    confirmedUndelivered: 5,
    projectedProfit: '$ 26,140.1000',
  },
  {
    shipmentMonths: 'FEB 26',
    totalNoContainers: 8,
    deliveredContainers: 0,
    confirmedUndelivered: 8,
    projectedProfit: '$ 41,205.1700',
  },
  {
    shipmentMonths: 'MAR 26',
    totalNoContainers: 10,
    deliveredContainers: 2,
    confirmedUndelivered: 8,
    projectedProfit: '$ 24,653.0000',
  },
  {
    shipmentMonths: 'APR 26',
    totalNoContainers: 2,
    deliveredContainers: 1,
    confirmedUndelivered: 1,
    projectedProfit: '$ 14,540.5000',
  },
  {
    shipmentMonths: 'JUN 26',
    totalNoContainers: 5,
    deliveredContainers: 0,
    confirmedUndelivered: 5,
    projectedProfit: '$ 37,852.6800',
  },
];

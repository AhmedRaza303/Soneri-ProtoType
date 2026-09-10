/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  Printer,
  Edit3,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Eye,
  LayoutGrid,
  CreditCard,
} from 'lucide-react';
import {
  MOCK_PROFORMA_INVOICES,
  MOCK_SALE_INVOICES,
  MOCK_CUSTOMER_PAYMENTS,
  ProformaInvoiceItem,
  SaleInvoiceItem,
  CustomerPaymentItem,
} from '../../data/erpWorkstreamsData';

interface SalesModuleScreenProps {
  workstream: 'proforma' | 'invoice' | 'payment';
  onBack: () => void;
  onShowSnackBar?: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const SalesModuleScreen: React.FC<SalesModuleScreenProps> = ({
  workstream,
  onBack,
  onShowSnackBar,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'card'>('grid');
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [containerMappingOpen, setContainerMappingOpen] = useState(true);

  // Selected item for View Page
  const [selectedPI, setSelectedPI] = useState<ProformaInvoiceItem | null>(null);
  const [selectedSINV, setSelectedSINV] = useState<SaleInvoiceItem | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<CustomerPaymentItem | null>(null);

  // Dropdown actions tracking
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  // ============================================================================
  // 1. VIEW: PROFORMA INVOICE DETAIL VIEW (PI-1004)
  // ============================================================================
  if (workstream === 'proforma' && selectedPI) {
    const pi = selectedPI;
    const compInfo = pi.companyInfo || {
      code: 'CO-001',
      name: 'Soneri International General Trading LLC',
      email: 'info@soneriinternational.com',
      website: 'www.soneriinternational.com',
    };
    const bnk = pi.bankDetails || {
      bankName: 'EMIRATES NBD BANK PJSC - USD A/C',
      branch: 'DUBAI BRANCH',
      accountType: 'Business Account',
      beneficiary: 'SONERI INTERNATIONAL GENERAL TRADING LLC',
      accountNumber: '1025781691602',
      iban: 'AE080260001025781691602',
    };
    const custInfo = pi.customerInfo || {
      code: 'CU-280',
      name: 'DSG GROUP SARL',
      address: 'GHAZIEH-AL JANOUB',
      country: 'Lebanon',
      phone: '96176790490',
      email: 'info@dsggrouplb.com',
    };
    const bnc = pi.buyerAndConsignee || {
      billTo: '-',
      shipTo: '-',
      portOfLoading: 'Port Qasim',
      portOfDischarge: 'PT-405 - Beirut',
      placeOfDelivery: 'Lebanon',
      shipmentType: 'By Sea',
      expectedDeliveryMonth: 'October, 2026',
      insurance: '-',
    };
    const prods = pi.products || [];
    const expenses = pi.otherExpenses || [];
    const discounts = pi.discounts || [];
    const sum = pi.summary || {
      productsTotal: '$24,676.0000',
      totalInsurance: '$0.0000',
      otherExpenses: '$0.0000',
      discount: '$0.0000',
      total: '$24,676.0000',
    };
    const podInstructions = pi.portOfDischargeInstructions || [];
    const profInstructions = pi.proformaInstructions || 'No instructions found';
    const colInstructions = pi.collectionInstructions || [];

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedPI(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back to List
            </button>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">View Proforma</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
              {pi.marketingStatus}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onShowSnackBar?.(`Editing Proforma ${pi.proformaCode}`, 'info')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" /> Edit
            </button>
            <button
              onClick={() => {
                window.print();
                onShowSnackBar?.(`Preparing ${pi.proformaCode} for printing...`, 'info');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
          {/* Top Info 3-Column Card (Company, Bank Details, Customer) */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Company */}
            <div className="space-y-2 border-r border-slate-100 pr-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Company</h3>
              <div className="space-y-1.5 text-xs">
                <div className="text-blue-600 font-semibold">{compInfo.code}</div>
                <div className="text-slate-900 font-medium">{compInfo.name}</div>
                {compInfo.email && <div className="text-slate-500">{compInfo.email}</div>}
                {compInfo.website && <div className="text-blue-500">{compInfo.website}</div>}
              </div>
            </div>

            {/* Column 2: Bank Details */}
            <div className="space-y-2 border-r border-slate-100 pr-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Bank Details</h3>
              <div className="space-y-1.5 text-xs">
                <div><span className="text-slate-500 font-medium">Bank:</span> <span className="text-slate-900 font-semibold">{bnk.bankName}</span></div>
                <div><span className="text-slate-500 font-medium">Branch:</span> <span className="text-slate-800">{bnk.branch}</span></div>
                <div><span className="text-slate-500 font-medium">Account Type:</span> <span className="text-slate-800">{bnk.accountType}</span></div>
                <div><span className="text-slate-500 font-medium">Beneficiary:</span> <span className="text-slate-800">{bnk.beneficiary}</span></div>
                <div><span className="text-slate-500 font-medium">Account #:</span> <span className="text-slate-800">{bnk.accountNumber}</span></div>
                <div><span className="text-slate-500 font-medium">IBAN:</span> <span className="text-slate-800">{bnk.iban}</span></div>
              </div>
            </div>

            {/* Column 3: Customer */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Customer</h3>
              <div className="space-y-1.5 text-xs">
                <div className="text-slate-900 font-semibold">{custInfo.code} - {custInfo.name}</div>
                {custInfo.address && <div className="text-slate-600 leading-relaxed">{custInfo.address}</div>}
                <div className="text-slate-600">{custInfo.country}</div>
                {custInfo.phone && <div className="text-slate-600">{custInfo.phone}</div>}
                {custInfo.email && <div className="text-slate-600">{custInfo.email}</div>}
              </div>
            </div>
          </div>

          {/* Details 2-Column Row (Proforma General Details & Buyer/Consignee) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Proforma Details</h3>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between"><span>Proforma Code:</span> <span className="font-semibold text-slate-900">{pi.proformaCode}</span></div>
                <div className="flex justify-between"><span>Quote Code:</span> <span className="text-blue-600 font-medium">{pi.quoteCode}</span></div>
                <div className="flex justify-between"><span>Inco Term:</span> <span>{pi.incoTerm || 'FOB'}</span></div>
                <div className="flex justify-between"><span>Currency:</span> <span>{pi.currency || 'United States Dollar'}</span></div>
                <div className="flex justify-between"><span>Created By:</span> <span>{pi.createdBy || pi.marketingPersonal}</span></div>
                <div className="flex justify-between"><span>Generated Date:</span> <span>{pi.generatedDate || '08/09/2026'}</span></div>
                <div className="flex justify-between"><span>Expiry Date:</span> <span>{pi.expiryDate || '07/09/2026'}</span></div>
                <div className="flex justify-between"><span>Exhibition Year:</span> <span>{pi.exhibitionYear || '-'}</span></div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Buyer & Consignee Details</h3>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between"><span>Bill To:</span> <span>{bnc.billTo}</span></div>
                <div className="flex justify-between"><span>Ship To:</span> <span>{bnc.shipTo}</span></div>
                <div className="flex justify-between"><span>Port Of Loading:</span> <span>{bnc.portOfLoading}</span></div>
                <div className="flex justify-between"><span>Port Of Discharge:</span> <span>{bnc.portOfDischarge}</span></div>
                <div className="flex justify-between"><span>Place Of Delivery:</span> <span>{bnc.placeOfDelivery}</span></div>
                <div className="flex justify-between"><span>Shipment Type:</span> <span>{bnc.shipmentType}</span></div>
                <div className="flex justify-between"><span>Expected Delivery Month:</span> <span>{bnc.expectedDeliveryMonth}</span></div>
                <div className="flex justify-between"><span>Insurance:</span> <span>{bnc.insurance}</span></div>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800">Products</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10.5px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Thumbnail</th>
                    <th className="py-3 px-3">Product Name</th>
                    <th className="py-3 px-3">Variation</th>
                    <th className="py-3 px-3 text-right">Quantity</th>
                    <th className="py-3 px-3 text-right">Price</th>
                    <th className="py-3 px-3 text-right">Total</th>
                    <th className="py-3 px-3">Shelf Life Duration</th>
                    <th className="py-3 px-3 text-right">CBM</th>
                    <th className="py-3 px-3 text-right">Weight</th>
                    <th className="py-3 px-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {prods.map((prod, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3">
                        <img src={prod.thumbnail} alt={prod.productName} className="w-10 h-10 object-cover rounded border border-slate-200" />
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-900 max-w-xs">{prod.productName}</td>
                      <td className="py-3 px-3 text-slate-600">{prod.variation}</td>
                      <td className="py-3 px-3 text-right font-semibold text-slate-900 whitespace-nowrap">{prod.quantity}</td>
                      <td className="py-3 px-3 text-right font-semibold text-slate-900">{prod.price}</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900">{prod.total}</td>
                      <td className="py-3 px-3 text-slate-600">{prod.shelfLifeDuration}</td>
                      <td className="py-3 px-3 text-right text-slate-700">{prod.cbm}</td>
                      <td className="py-3 px-3 text-right text-slate-700">{prod.weight}</td>
                      <td className="py-3 px-3 text-slate-500">{prod.notes || '-'}</td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="bg-slate-50 font-bold border-t border-slate-200 text-slate-900">
                    <td colSpan={3} className="py-3 px-3 text-right">Total</td>
                    <td className="py-3 px-3 text-right">1,268 Carton</td>
                    <td className="py-3 px-3 text-right">-</td>
                    <td className="py-3 px-3 text-right">$ 24,676.0000</td>
                    <td className="py-3 px-3 text-center">-</td>
                    <td className="py-3 px-3 text-right">68.052</td>
                    <td className="py-3 px-3 text-right">9,306 KG</td>
                    <td className="py-3 px-3 text-center">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Container & Summary 2-Column Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Container</h3>
              <p className="text-xs font-semibold text-slate-800">{pi.containerSummary || '40 ft HC × 1'}</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Summary</h3>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between"><span>Products Total:</span> <span className="font-semibold text-slate-900">{sum.productsTotal}</span></div>
                <div className="flex justify-between"><span>Total Insurance:</span> <span>{sum.totalInsurance}</span></div>
                <div className="flex justify-between"><span>Other Expenses:</span> <span>{sum.otherExpenses}</span></div>
                <div className="flex justify-between"><span>Discount:</span> <span>{sum.discount}</span></div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                  <span>Total:</span> <span>{sum.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Port Of Discharge Instructions */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Port Of Discharge Instructions</h3>
            {podInstructions.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No instructions found.</p>
            ) : (
              <div className="pt-1 flex flex-wrap gap-2">
                {podInstructions.map((pod, idx) => (
                  <span key={idx} className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {pod}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Proforma Instructions */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Proforma Instructions</h3>
            <p className="text-xs text-slate-500 italic">{profInstructions}</p>
          </div>

          {/* Collection Instructions */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Collection Instructions</h3>
            {colInstructions.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No instructions found.</p>
            ) : (
              <div className="space-y-1">
                {colInstructions.map((ci, idx) => (
                  <div key={idx} className="text-xs text-slate-700">{ci}</div>
                ))}
              </div>
            )}
          </div>

          {/* Customer Remarks & Remarks 2-Column Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Customer Remarks</h3>
              <p className="text-xs text-slate-500 italic">{pi.customerRemarks || 'No remarks found'}</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Remarks</h3>
              <p className="text-xs text-slate-500 italic">{pi.remarks || 'No remarks found'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. VIEW: SALE INVOICE DETAIL VIEW (SI-609)
  // ============================================================================
  if (workstream === 'invoice' && selectedSINV) {
    const si = selectedSINV;
    const compInfo = si.companyInfo || {
      code: 'CO-001',
      name: 'Soneri International General Trading LLC',
      email: 'info@soneriinternational.com',
      website: 'www.soneriinternational.com',
    };
    const custInfo = si.customerInfo || {
      code: 'CU-061',
      name: 'HIMPEX SARL',
    };
    const prods = si.products || [];
    const sum = si.summary || {
      productsTotal: '$205,800.0000',
      otherExpenses: '-',
      discounts: '$0.0000',
      totalAdvanceAmount: '$118,453.0000',
      totalPaidAdvanceAmount: '$0.0000',
      totalAdvance: '$118,453.0000',
      remainingAdvanceAmount: '$0.0000',
      total: '$87,347.0000',
    };

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedSINV(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back to List
            </button>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">View Sale Invoice</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              {si.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onShowSnackBar?.(`Editing Sale Invoice ${si.saleInvoiceCode}`, 'info')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" /> Edit
            </button>
            <button
              onClick={() => {
                window.print();
                onShowSnackBar?.(`Preparing ${si.saleInvoiceCode} for printing...`, 'info');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
          {/* Top Info 3-Column Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Invoice Details */}
            <div className="space-y-2 border-r border-slate-100 pr-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Invoice Details</h3>
              <div className="space-y-1.5 text-xs">
                <div><span className="text-slate-500 font-medium">Sale Invoice Code:</span> <span className="text-slate-900 font-semibold">{si.saleInvoiceCode}</span></div>
                <div><span className="text-slate-500 font-medium">Transaction Date:</span> <span className="text-slate-800">{si.transactionDate || '31/08/2026'}</span></div>
                <div><span className="text-slate-500 font-medium">Marketing Personal:</span> <span className="text-slate-800">{si.marketingPersonal || 'BILAL'}</span></div>
                <div><span className="text-slate-500 font-medium">Quote:</span> <span className="text-slate-800">{si.quote || '-'}</span></div>
                <div><span className="text-slate-500 font-medium">Inco Term:</span> <span className="text-slate-800">{si.incoTerm || 'CNF'}</span></div>
                <div><span className="text-slate-500 font-medium">Freight:</span> <span className="text-slate-800">{si.freight || '18000'}</span></div>
                <div><span className="text-slate-500 font-medium">Booking Freight:</span> <span className="text-slate-800">{si.bookingFreight || '5430'}</span></div>
                <div><span className="text-slate-500 font-medium">Port of Discharge:</span> <span className="text-slate-800">{si.portOfDischarge}</span></div>
                <div><span className="text-slate-500 font-medium">Currency:</span> <span className="text-slate-800">{si.currency || 'United States Dollar'}</span></div>
                <div><span className="text-slate-500 font-medium">Created By:</span> <span className="text-slate-900 font-semibold">{si.createdBy || 'HASSAN KHANIA'}</span></div>
                <div><span className="text-slate-500 font-medium">Generated Date:</span> <span className="text-slate-800">{si.generatedDate || '08/09/2026'}</span></div>
                <div><span className="text-slate-500 font-medium">Expiry Date:</span> <span className="text-slate-800">{si.expiryDate || '06/07/2026'}</span></div>
                <div><span className="text-slate-500 font-medium">Payment Profile:</span> <span className="text-slate-800">{si.paymentProfile || 'As per Mutual Understanding'}</span></div>
              </div>
            </div>

            {/* Column 2: Company */}
            <div className="space-y-2 border-r border-slate-100 pr-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Company</h3>
              <div className="space-y-1.5 text-xs">
                <div className="text-blue-600 font-semibold">{compInfo.code}</div>
                <div className="text-slate-900 font-medium">{compInfo.name}</div>
                {compInfo.email && <div className="text-slate-500">{compInfo.email}</div>}
                {compInfo.website && <div className="text-blue-500">{compInfo.website}</div>}
              </div>
            </div>

            {/* Column 3: Customer */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Customer</h3>
              <div className="space-y-1.5 text-xs">
                <div className="text-slate-900 font-semibold">{custInfo.code} - {custInfo.name}</div>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800">Products</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10.5px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Thumbnail</th>
                    <th className="py-3 px-3">Product Name</th>
                    <th className="py-3 px-3">Variation</th>
                    <th className="py-3 px-3 text-right">Quantity</th>
                    <th className="py-3 px-3 text-right">Price</th>
                    <th className="py-3 px-3 text-right">Total</th>
                    <th className="py-3 px-3 text-right">CBM</th>
                    <th className="py-3 px-3 text-right">Weight</th>
                    <th className="py-3 px-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {prods.map((prod, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3">
                        <img src={prod.thumbnail} alt={prod.productName} className="w-10 h-10 object-cover rounded border border-slate-200" />
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-900 max-w-xs">{prod.productName}</td>
                      <td className="py-3 px-3 text-slate-600">{prod.variation}</td>
                      <td className="py-3 px-3 text-right font-semibold text-slate-900 whitespace-nowrap">{prod.quantity}</td>
                      <td className="py-3 px-3 text-right font-semibold text-slate-900">{prod.price}</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900">{prod.total}</td>
                      <td className="py-3 px-3 text-right text-slate-700">{prod.cbm}</td>
                      <td className="py-3 px-3 text-right text-slate-700">{prod.weight}</td>
                      <td className="py-3 px-3 text-slate-500">{prod.notes || '-'}</td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="bg-slate-50 font-bold border-t border-slate-200 text-slate-900">
                    <td colSpan={3} className="py-3 px-3 text-right">Total</td>
                    <td className="py-3 px-3 text-right">16,800</td>
                    <td className="py-3 px-3 text-right">-</td>
                    <td className="py-3 px-3 text-right">$ 205,800.0000</td>
                    <td className="py-3 px-3 text-right">413.28</td>
                    <td className="py-3 px-3 text-right">122,976 KG</td>
                    <td className="py-3 px-3 text-center">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Container & Summary 2-Column Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Container</h3>
              <p className="text-xs font-semibold text-slate-800">{si.containerSummary || '40 ft HC × 6'}</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Summary</h3>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between"><span>Products Total:</span> <span className="font-semibold text-slate-900">{sum.productsTotal}</span></div>
                <div className="flex justify-between"><span>Other Expenses:</span> <span>{sum.otherExpenses}</span></div>
                <div className="flex justify-between"><span>Discounts:</span> <span>{sum.discounts}</span></div>
                <div className="flex justify-between"><span>Total Advance Amount:</span> <span>{sum.totalAdvanceAmount}</span></div>
                <div className="flex justify-between"><span>Total Paid Advance Amount:</span> <span>{sum.totalPaidAdvanceAmount}</span></div>
                <div className="flex justify-between"><span>Total Advance:</span> <span>{sum.totalAdvance}</span></div>
                <div className="flex justify-between"><span>Remaining Advance Amount:</span> <span>{sum.remainingAdvanceAmount}</span></div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                  <span>Total:</span> <span>{sum.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Documents & Remarks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Documents</h3>
              <p className="text-xs text-slate-500 italic">No documents available.</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Remarks</h3>
              <p className="text-xs text-slate-700">{si.remarks || 'No Remarks Found'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 3. VIEW: CUSTOMER PAYMENT DETAIL VIEW (CP-744)
  // ============================================================================
  if (workstream === 'payment' && selectedPayment) {
    const cp = selectedPayment;
    const custInfo = cp.customerInfo || {
      code: 'CU-092',
      name: 'AL ABBAS FOR GENERAL TRADING',
    };
    const paymentDetails = cp.paymentDetails || [];

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedPayment(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back to List
            </button>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">View Customer Payment</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onShowSnackBar?.(`Editing Payment ${cp.paymentCode}`, 'info')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" /> Edit
            </button>
            <button
              onClick={() => {
                window.print();
                onShowSnackBar?.(`Preparing ${cp.paymentCode} for printing...`, 'info');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
          {/* Top Info 3-Column Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Customer */}
            <div className="space-y-2 border-r border-slate-100 pr-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Customer</h3>
              <div className="space-y-1.5 text-xs">
                <div className="text-slate-900 font-semibold">{custInfo.code} - {custInfo.name}</div>
              </div>
            </div>

            {/* Column 2: Payment Reference */}
            <div className="space-y-2 border-r border-slate-100 pr-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Payment Reference</h3>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div>-</div>
              </div>
            </div>

            {/* Column 3: Payment Summary */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Payment Summary</h3>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between"><span>Payment Code:</span> <span className="font-semibold text-slate-900">{cp.paymentCode}</span></div>
                <div className="flex justify-between"><span>Payment Amount:</span> <span className="font-bold text-slate-900">{cp.paymentAmount}</span></div>
                <div className="flex justify-between"><span>Payment Method:</span> <span>{cp.paymentMethod}</span></div>
                <div className="flex justify-between"><span>Payment Date:</span> <span>{cp.paymentDate}</span></div>
              </div>
            </div>
          </div>

          {/* Payment Details Section */}
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Payment Details</h2>

            {paymentDetails.map((pd, idx) => (
              <div key={idx} className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4 border-b border-slate-100 text-xs">
                  <div><span className="text-slate-500 font-medium">Proforma Code:</span> <span className="text-blue-600 font-semibold">{pd.proformaCode}</span></div>
                  <div><span className="text-slate-500 font-medium">Bank:</span> <span className="text-slate-900 font-medium">{pd.bank}</span></div>
                  <div><span className="text-slate-500 font-medium">Company:</span> <span className="text-slate-800">{pd.company}</span></div>
                  <div><span className="text-slate-500 font-medium">Place Of Delivery:</span> <span className="text-slate-800">{pd.placeOfDelivery}</span></div>
                  <div className="col-span-2"><span className="text-slate-500 font-medium">Payment Term:</span> <span className="text-slate-800">{pd.paymentTerm}</span></div>
                </div>

                {/* Table for Invoice Breakdown */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 uppercase text-[10.5px] font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Proforma Amount</th>
                        <th className="py-2.5 px-3">SI Amount</th>
                        <th className="py-2.5 px-3">JV Adj</th>
                        <th className="py-2.5 px-3">Net Sale Invoice</th>
                        <th className="py-2.5 px-3">Sale Return</th>
                        <th className="py-2.5 px-3">Net Customer R/P</th>
                        <th className="py-2.5 px-3">Previously Paid</th>
                        <th className="py-2.5 px-3">Current Amount</th>
                        <th className="py-2.5 px-3">Exchanged Amount</th>
                        <th className="py-2.5 px-3">Advance</th>
                        <th className="py-2.5 px-3">Remaining Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{pd.proformaAmount}</td>
                        <td className="py-2.5 px-3 text-slate-800">{pd.invoiceAmount.siAmount}</td>
                        <td className="py-2.5 px-3 text-slate-500">{pd.invoiceAmount.jvAdj}</td>
                        <td className="py-2.5 px-3 text-slate-800">{pd.invoiceAmount.netSaleInvoice}</td>
                        <td className="py-2.5 px-3 text-slate-500">{pd.invoiceAmount.saleReturn}</td>
                        <td className="py-2.5 px-3 text-slate-800">{pd.invoiceAmount.netCustomerRP}</td>
                        <td className="py-2.5 px-3 text-slate-700">{pd.previouslyPaid}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{pd.currentAmount}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{pd.exchangedAmount}</td>
                        <td className="py-2.5 px-3">
                          <input type="checkbox" checked={pd.advance} readOnly className="rounded text-blue-600 cursor-default" />
                        </td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{pd.remainingBalance}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* Customer Remarks & Remarks 2-Column Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Customer Remarks</h3>
              <p className="text-xs text-slate-500 italic">No remarks found</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Remarks</h3>
              <p className="text-xs text-slate-500 italic">No remarks found</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 4. GRID: SALES WORKSTREAMS (Proforma, Sale Invoice, Payment)
  // ============================================================================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Title Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {workstream === 'proforma' && 'Manage Proforma Invoices'}
            {workstream === 'invoice' && 'Manage Sale Invoices'}
            {workstream === 'payment' && 'Manage Customer Payments'}
          </h1>
        </div>

        {/* Action Controls Top Right: View Mode Toggle, Filters, Columns, Search */}
        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="inline-flex rounded-md bg-slate-100 p-0.5 border border-slate-200 shadow-2xs">
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </button>
            <button
              onClick={() => setViewMode('card')}
              title="Card View"
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded transition-all cursor-pointer ${
                viewMode === 'card'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Card View</span>
            </button>
          </div>

          <button
            onClick={() => onShowSnackBar?.('Filter panel opened', 'info')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 shadow-xs cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-slate-500" /> Filters
          </button>
          <button
            onClick={() => onShowSnackBar?.('Column selection opened', 'info')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 shadow-xs cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" /> Columns
          </button>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-blue-500 w-48 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Tabs (for Proforma and Sale Invoice) */}
      {workstream === 'proforma' && (
        <div className="bg-white border-b border-slate-200 px-6 flex gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'ALL'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            All Proforma Invoices
          </button>
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'PENDING'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Proforma Invoices
          </button>
        </div>
      )}

      {/* Table Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            {/* ------------------------------------------------------------- */}
            {/* GRID: PROFORMA INVOICE                                        */}
            {/* ------------------------------------------------------------- */}
            {workstream === 'proforma' && (
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Proforma Code</th>
                    <th className="py-3 px-4">Ref. Proforma Code</th>
                    <th className="py-3 px-4">Sale Return Code</th>
                    <th className="py-3 px-4">Ticket Code</th>
                    <th className="py-3 px-4">Quote Code</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Marketing Personal</th>
                    <th className="py-3 px-4">Place Of Delivery</th>
                    <th className="py-3 px-4">Marketing Status</th>
                    <th className="py-3 px-4">Finance Status</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_PROFORMA_INVOICES.filter((p) =>
                    activeTab === 'PENDING' ? p.marketingStatus.toLowerCase().includes('draft') : true
                  )
                    .filter(
                      (p) =>
                        p.proformaCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.marketingPersonal.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setSelectedPI(item)}
                            className="text-blue-600 font-semibold hover:underline cursor-pointer"
                          >
                            {item.proformaCode}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-slate-500">{item.referenceProformaCode}</td>
                        <td className="py-3 px-4 text-slate-500">{item.saleReturnCode}</td>
                        <td className="py-3 px-4 text-slate-500">{item.ticketCode}</td>
                        <td className="py-3 px-4 text-blue-600 font-medium hover:underline cursor-pointer">
                          {item.quoteCode}
                        </td>
                        <td className="py-3 px-4 text-slate-800 max-w-xs truncate">{item.customer}</td>
                        <td className="py-3 px-4 text-slate-600">{item.company}</td>
                        <td className="py-3 px-4 font-medium text-slate-800">{item.marketingPersonal}</td>
                        <td className="py-3 px-4 text-slate-800">{item.placeOfDelivery}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                            {item.marketingStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500">{item.financeStatus}</td>
                        <td className="py-3 px-4 text-slate-600">{item.payment}</td>
                        <td className="py-3 px-4 text-center relative">
                          <button
                            onClick={() => setOpenActionId(openActionId === item.id ? null : item.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                          >
                            Actions <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                          {openActionId === item.id && (
                            <div className="absolute right-4 mt-1 w-32 bg-white border border-slate-200 rounded-md shadow-lg z-20 py-1 text-left text-xs">
                              <button
                                onClick={() => {
                                  setSelectedPI(item);
                                  setOpenActionId(null);
                                }}
                                className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5 text-slate-700"
                              >
                                <Eye className="w-3.5 h-3.5 text-blue-600" /> View
                              </button>
                              <button
                                onClick={() => {
                                  onShowSnackBar?.(`Editing ${item.proformaCode}`, 'info');
                                  setOpenActionId(null);
                                }}
                                className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5 text-slate-700"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-slate-500" /> Edit
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}

            {/* ------------------------------------------------------------- */}
            {/* GRID: SALE INVOICE                                            */}
            {/* ------------------------------------------------------------- */}
            {workstream === 'invoice' && (
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Sale Invoice Code</th>
                    <th className="py-3 px-4">Export Inquiry Code</th>
                    <th className="py-3 px-4">Proforma Code</th>
                    <th className="py-3 px-4">Sale Return Code</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Port Of Discharge</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Finance Status</th>
                    <th className="py-3 px-4">Created</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_SALE_INVOICES.filter(
                    (s) =>
                      s.saleInvoiceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      s.proformaCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      s.company.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setSelectedSINV(item)}
                          className="text-blue-600 font-semibold hover:underline cursor-pointer"
                        >
                          {item.saleInvoiceCode}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-blue-600 font-medium hover:underline cursor-pointer">
                        {item.exportInquiryCode}
                      </td>
                      <td className="py-3 px-4 text-blue-600 font-medium hover:underline cursor-pointer max-w-xs truncate">
                        {item.proformaCode}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{item.saleReturnCode}</td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{item.company}</td>
                      <td className="py-3 px-4 text-slate-800">{item.portOfDischarge}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">{item.amount}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          item.status.toLowerCase().includes('approved')
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            item.status.toLowerCase().includes('approved') ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}></span>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{item.financeStatus}</td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{item.created}</td>
                      <td className="py-3 px-4 text-center relative">
                        <button
                          onClick={() => setOpenActionId(openActionId === item.id ? null : item.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                        >
                          Actions <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                        {openActionId === item.id && (
                          <div className="absolute right-4 mt-1 w-32 bg-white border border-slate-200 rounded-md shadow-lg z-20 py-1 text-left text-xs">
                            <button
                              onClick={() => {
                                setSelectedSINV(item);
                                setOpenActionId(null);
                              }}
                              className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5 text-slate-700"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-600" /> View
                            </button>
                            <button
                              onClick={() => {
                                onShowSnackBar?.(`Editing ${item.saleInvoiceCode}`, 'info');
                                setOpenActionId(null);
                              }}
                              className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5 text-slate-700"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-slate-500" /> Edit
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* ------------------------------------------------------------- */}
            {/* GRID: CUSTOMER PAYMENT                                        */}
            {/* ------------------------------------------------------------- */}
            {workstream === 'payment' && (
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Payment Code</th>
                    <th className="py-3 px-4">Proforma</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Notify Party Name</th>
                    <th className="py-3 px-4 text-right">Payment Amount</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4">Payment Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Created</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_CUSTOMER_PAYMENTS.filter(
                    (p) =>
                      p.paymentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.proforma.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setSelectedPayment(item)}
                          className="text-blue-600 font-semibold hover:underline cursor-pointer"
                        >
                          {item.paymentCode}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-blue-600 hover:underline cursor-pointer font-medium">
                        {item.proforma}
                      </td>
                      <td className="py-3 px-4 text-slate-800 font-medium max-w-xs truncate">{item.customer}</td>
                      <td className="py-3 px-4 text-slate-500">{item.notifyPartyName}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">{item.paymentAmount}</td>
                      <td className="py-3 px-4 text-slate-700">{item.paymentMethod}</td>
                      <td className="py-3 px-4 text-slate-600">{item.paymentDate}</td>
                      <td className="py-3 px-4 text-slate-500">{item.status}</td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{item.created}</td>
                      <td className="py-3 px-4 text-center relative">
                        <button
                          onClick={() => setOpenActionId(openActionId === item.id ? null : item.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                        >
                          Actions <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                        {openActionId === item.id && (
                          <div className="absolute right-4 mt-1 w-32 bg-white border border-slate-200 rounded-md shadow-lg z-20 py-1 text-left text-xs">
                            <button
                              onClick={() => {
                                setSelectedPayment(item);
                                setOpenActionId(null);
                              }}
                              className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5 text-slate-700"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-600" /> View
                            </button>
                            <button
                              onClick={() => {
                                onShowSnackBar?.(`Editing ${item.paymentCode}`, 'info');
                                setOpenActionId(null);
                              }}
                              className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5 text-slate-700"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-slate-500" /> Edit
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
            <div>
              {workstream === 'proforma' && 'Showing 1 to 10 of 1004 records'}
              {workstream === 'invoice' && 'Showing 1 to 10 of 609 records'}
              {workstream === 'payment' && 'Showing 1 to 10 of 744 records'}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button className="px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-100 cursor-pointer">&lt;</button>
                <button className="px-2.5 py-1 rounded bg-blue-600 text-white font-semibold">1</button>
                <button className="px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-100 cursor-pointer">2</button>
                <button className="px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-100 cursor-pointer">3</button>
                <button className="px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-100 cursor-pointer">4</button>
                <button className="px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-100 cursor-pointer">5</button>
                <span className="px-1 text-slate-400">...</span>
                <button className="px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-100 cursor-pointer">
                  {workstream === 'proforma' ? '101' : workstream === 'invoice' ? '61' : '75'}
                </button>
                <button className="px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-100 cursor-pointer">&gt;</button>
              </div>
              <div className="relative">
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="px-2 py-1 rounded border border-slate-300 bg-white text-xs cursor-pointer focus:outline-hidden"
                >
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

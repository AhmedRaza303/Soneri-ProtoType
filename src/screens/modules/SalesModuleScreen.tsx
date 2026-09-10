/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  Edit3,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Eye,
} from 'lucide-react';
import {
  MOCK_PROFORMA_INVOICES,
  MOCK_SALE_INVOICES,
  MOCK_CUSTOMER_PAYMENTS,
  ProformaInvoiceItem,
  SaleInvoiceItem,
  CustomerPaymentItem,
} from '../../data/erpWorkstreamsData';
import {
  ListToolbar,
  ListPagination,
  usePagedList,
  StatusPill,
  RecordCard,
  CardGrid,
  DataTable,
  DataRow,
  Td,
  ListViewMode,
} from '../../components/common/DataListShell';
import {
  MobilePage,
  MobileHeader,
  SoftCard,
  MobileContent,
  HeaderIconBtn,
} from '../../components/common/MobileLayout';

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
  const [viewMode, setViewMode] = useState<ListViewMode>('card');
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [containerMappingOpen, setContainerMappingOpen] = useState(true);

  // Selected item for View Page
  const [selectedPI, setSelectedPI] = useState<ProformaInvoiceItem | null>(null);
  const [selectedSINV, setSelectedSINV] = useState<SaleInvoiceItem | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<CustomerPaymentItem | null>(null);

  // Dropdown actions tracking
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  const q = searchQuery.toLowerCase();

  const filteredPIs = useMemo(
    () =>
      MOCK_PROFORMA_INVOICES.filter((p) =>
        activeTab === 'PENDING' ? p.marketingStatus.toLowerCase().includes('draft') : true
      ).filter(
        (p) =>
          p.proformaCode.toLowerCase().includes(q) ||
          p.customer.toLowerCase().includes(q) ||
          p.marketingPersonal.toLowerCase().includes(q) ||
          p.company.toLowerCase().includes(q)
      ),
    [activeTab, q]
  );

  const filteredSINVs = useMemo(
    () =>
      MOCK_SALE_INVOICES.filter(
        (s) =>
          s.saleInvoiceCode.toLowerCase().includes(q) ||
          s.proformaCode.toLowerCase().includes(q) ||
          s.company.toLowerCase().includes(q)
      ),
    [q]
  );

  const filteredPayments = useMemo(
    () =>
      MOCK_CUSTOMER_PAYMENTS.filter(
        (p) =>
          p.paymentCode.toLowerCase().includes(q) ||
          p.customer.toLowerCase().includes(q) ||
          p.proforma.toLowerCase().includes(q)
      ),
    [q]
  );

  const piPaging = usePagedList(filteredPIs);
  const sinvPaging = usePagedList(filteredSINVs);
  const payPaging = usePagedList(filteredPayments);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    piPaging.resetPage();
    sinvPaging.resetPage();
    payPaging.resetPage();
  };

  const handleTabChange = (tab: 'ALL' | 'PENDING') => {
    setActiveTab(tab);
    piPaging.resetPage();
  };

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
      <MobilePage>
        <MobileHeader
          title="View Proforma"
          subtitle={pi.proformaCode}
          status={pi.marketingStatus}
          onBack={() => setSelectedPI(null)}
          actions={
            <>
              <HeaderIconBtn
                label="Edit"
                icon="edit"
                variant="soft"
                onClick={() => onShowSnackBar?.(`Editing Proforma ${pi.proformaCode}`, 'info')}
              />
              <HeaderIconBtn
                label="Print"
                icon="print"
                onClick={() => { window.print(); onShowSnackBar?.(`Preparing ${pi.proformaCode} for printing...`, 'info'); }}
              />
            </>
          }
        />
        <MobileContent>

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
            <div className="p-4 sm:px-6 sm:py-3 space-y-2.5">
              {prods.map((prod, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs">
                  <div className="flex items-start gap-3">
                    <img src={prod.thumbnail} alt={prod.productName} className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-extrabold text-[#0f2b3c] leading-snug">{prod.productName}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="inline-flex px-2 py-0.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold">
                          {prod.variation}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">{prod.shelfLifeDuration}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Qty</p>
                          <p className="text-[11px] font-bold text-slate-900 whitespace-nowrap">{prod.quantity}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Total</p>
                          <p className="text-[11px] font-black text-slate-900 font-mono tabular-nums">{prod.total}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Price</p>
                          <p className="text-[11px] font-semibold text-slate-900 font-mono">{prod.price}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">CBM</p>
                          <p className="text-[11px] font-semibold text-slate-700 tabular-nums">{prod.cbm}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Weight</p>
                          <p className="text-[11px] font-semibold text-slate-700 tabular-nums">{prod.weight}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Notes</p>
                          <p className="text-[11px] font-medium text-slate-600 break-words">{prod.notes || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl bg-[#0f2b3c] text-white p-3.5 flex items-center justify-between shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">Products Total</span>
                <span className="text-[12px] font-black font-mono tabular-nums">{sum.productsTotal}</span>
              </div>
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
        </MobileContent>
      </MobilePage>
    );
  }
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
      <MobilePage>
        <MobileHeader
          title="View Sale Invoice"
          subtitle={si.saleInvoiceCode}
          status={si.status}
          onBack={() => setSelectedSINV(null)}
          actions={
            <>
              <HeaderIconBtn
                label="Edit"
                icon="edit"
                variant="soft"
                onClick={() => onShowSnackBar?.(`Editing Sale Invoice ${si.saleInvoiceCode}`, 'info')}
              />
              <HeaderIconBtn
                label="Print"
                icon="print"
                onClick={() => { window.print(); onShowSnackBar?.(`Preparing ${si.saleInvoiceCode} for printing...`, 'info'); }}
              />
            </>
          }
        />
        <MobileContent>

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
            <div className="p-4 sm:px-6 sm:py-3 space-y-2.5">
              {prods.map((prod, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs">
                  <div className="flex items-start gap-3">
                    <img src={prod.thumbnail} alt={prod.productName} className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-extrabold text-[#0f2b3c] leading-snug">{prod.productName}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="inline-flex px-2 py-0.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-bold">
                          {prod.variation}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Qty</p>
                          <p className="text-[11px] font-bold text-slate-900 whitespace-nowrap">{prod.quantity}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Total</p>
                          <p className="text-[11px] font-black text-slate-900 font-mono tabular-nums">{prod.total}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Price</p>
                          <p className="text-[11px] font-semibold text-slate-900 font-mono">{prod.price}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">CBM</p>
                          <p className="text-[11px] font-semibold text-slate-700 tabular-nums">{prod.cbm}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Weight</p>
                          <p className="text-[11px] font-semibold text-slate-700 tabular-nums">{prod.weight}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Notes</p>
                          <p className="text-[11px] font-medium text-slate-600 break-words">{prod.notes || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl bg-[#0f2b3c] text-white p-3.5 flex items-center justify-between shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">Products Total</span>
                <span className="text-[12px] font-black font-mono tabular-nums">{sum.productsTotal}</span>
              </div>
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
        </MobileContent>
      </MobilePage>
    );
  }
  // ============================================================================
  if (workstream === 'payment' && selectedPayment) {
    const cp = selectedPayment;
    const custInfo = cp.customerInfo || {
      code: 'CU-092',
      name: 'AL ABBAS FOR GENERAL TRADING',
    };
    const paymentDetails = cp.paymentDetails || [];

    return (
      <MobilePage>
        <MobileHeader
          title="View Customer Payment"
          subtitle={cp.paymentCode}
          onBack={() => setSelectedPayment(null)}
          actions={
            <>
              <HeaderIconBtn
                label="Edit"
                icon="edit"
                variant="soft"
                onClick={() => onShowSnackBar?.(`Editing Payment ${cp.paymentCode}`, 'info')}
              />
              <HeaderIconBtn
                label="Print"
                icon="print"
                onClick={() => { window.print(); onShowSnackBar?.(`Preparing ${cp.paymentCode} for printing...`, 'info'); }}
              />
            </>
          }
        />
        <MobileContent>

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
                <div className="space-y-2">
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[11px] font-extrabold text-[#0f2b3c]">Invoice Breakdown</p>
                      <p className="text-[11px] font-black text-rose-700 font-mono">{pd.remainingBalance}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Proforma</p>
                        <p className="text-[11px] font-semibold text-slate-800 font-mono">{pd.proformaAmount}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">SI Amount</p>
                        <p className="text-[11px] font-semibold text-slate-800 font-mono">{pd.invoiceAmount.siAmount}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">JV Adj</p>
                        <p className="text-[11px] font-semibold text-slate-800 font-mono">{pd.invoiceAmount.jvAdj}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Net Sale Invoice</p>
                        <p className="text-[11px] font-semibold text-slate-800 font-mono">{pd.invoiceAmount.netSaleInvoice}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Sale Return</p>
                        <p className="text-[11px] font-semibold text-slate-800 font-mono">{pd.invoiceAmount.saleReturn}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Net Customer R/P</p>
                        <p className="text-[11px] font-semibold text-slate-800 font-mono">{pd.invoiceAmount.netCustomerRP}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Previously Paid</p>
                        <p className="text-[11px] font-semibold text-slate-800 font-mono">{pd.previouslyPaid}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Current Amount</p>
                        <p className="text-[11px] font-semibold text-slate-900 font-mono">{pd.currentAmount}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Exchanged Amount</p>
                        <p className="text-[11px] font-semibold text-slate-900 font-mono">{pd.exchangedAmount}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Advance</p>
                        <p className={`text-[11px] font-bold ${pd.advance ? 'text-emerald-700' : 'text-slate-600'}`}>
                          {pd.advance ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                  </div>
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
        </MobileContent>
      </MobilePage>
    );
  }
  // ============================================================================
  const paging =
    workstream === 'proforma' ? piPaging : workstream === 'invoice' ? sinvPaging : payPaging;

  return (
    <MobilePage>
      <MobileHeader
        title={
          workstream === 'proforma'
            ? 'Manage Proforma Invoices'
            : workstream === 'invoice'
            ? 'Manage Sale Invoices'
            : 'Manage Customer Payments'
        }
        onBack={onBack}
      />

      <MobileContent>
        <SoftCard>
          <ListToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            searchPlaceholder={
              workstream === 'proforma'
                ? 'Search proformas…'
                : workstream === 'invoice'
                ? 'Search invoices…'
                : 'Search payments…'
            }
            onFilterClick={() => onShowSnackBar?.('Filter panel opened', 'info')}
            onColumnsClick={() => onShowSnackBar?.('Column selection opened', 'info')}
          />
        </SoftCard>

        {workstream === 'proforma' && (
          <SoftCard padding={false}>
            <div className="px-4 sm:px-5 flex gap-6 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleTabChange('ALL')}
                className={`py-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'ALL'
                    ? 'border-[#0f2b3c] text-[#0f2b3c]'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                All Proforma Invoices
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('PENDING')}
                className={`py-3 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'PENDING'
                    ? 'border-[#0f2b3c] text-[#0f2b3c]'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending Proforma Invoices
              </button>
            </div>
          </SoftCard>
        )}


        {/* ---- Proforma ---- */}
        {workstream === 'proforma' &&
          (viewMode === 'grid' ? (
            <DataTable
              headers={[
                'Proforma Code',
                'Customer',
                'Company',
                'Place Of Delivery',
                'Marketing Status',
                'Finance Status',
                'Payment',
                'Actions',
              ]}
            >
              {piPaging.paged.map((item) => (
                <DataRow key={item.id} onClick={() => setSelectedPI(item)}>
                  <Td accent mono>
                    {item.proformaCode}
                  </Td>
                  <Td className="max-w-[180px] truncate">{item.customer}</Td>
                  <Td className="max-w-[160px] truncate">{item.company}</Td>
                  <Td>{item.placeOfDelivery}</Td>
                  <Td>
                    <StatusPill status={item.marketingStatus} />
                  </Td>
                  <Td>
                    <StatusPill status={item.financeStatus || '—'} />
                  </Td>
                  <Td>
                    <StatusPill status={item.payment} />
                  </Td>
                  <Td className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenActionId(openActionId === item.id ? null : item.id);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold cursor-pointer"
                    >
                      Actions <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                    {openActionId === item.id && (
                      <div className="absolute right-2 mt-1 w-32 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 text-left text-xs">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPI(item);
                            setOpenActionId(null);
                          }}
                          className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5 text-slate-700 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-teal-600" /> View
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onShowSnackBar?.(`Editing ${item.proformaCode}`, 'info');
                            setOpenActionId(null);
                          }}
                          className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5 text-slate-700 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-500" /> Edit
                        </button>
                      </div>
                    )}
                  </Td>
                </DataRow>
              ))}
            </DataTable>
          ) : (
            <CardGrid>
              {piPaging.paged.map((item) => (
                <RecordCard
                  key={item.id}
                  code={item.proformaCode}
                  title={item.customer}
                  subtitle={item.company}
                  status={item.marketingStatus}
                  badges={<StatusPill status={item.financeStatus || '—'} />}
                  fields={[
                    { label: 'Place of Delivery', value: item.placeOfDelivery },
                    { label: 'Payment', value: <StatusPill status={item.payment} /> },
                    { label: 'Marketing', value: item.marketingPersonal },
                    { label: 'Quote', value: item.quoteCode },
                  ]}
                  onClick={() => setSelectedPI(item)}
                  actions={[
                    { label: 'View', icon: 'view', onClick: () => setSelectedPI(item) },
                    {
                      label: 'Edit',
                      icon: 'edit',
                      onClick: () => onShowSnackBar?.(`Editing ${item.proformaCode}`, 'info'),
                    },
                  ]}
                />
              ))}
            </CardGrid>
          ))}

        {/* ---- Sale Invoice ---- */}
        {workstream === 'invoice' &&
          (viewMode === 'grid' ? (
            <DataTable
              headers={[
                'Sale Invoice Code',
                'Company',
                'Port Of Discharge',
                'Amount',
                'Status',
                'Finance Status',
                'Created',
                'Actions',
              ]}
            >
              {sinvPaging.paged.map((item) => (
                <DataRow key={item.id} onClick={() => setSelectedSINV(item)}>
                  <Td accent mono>
                    {item.saleInvoiceCode}
                  </Td>
                  <Td className="max-w-[180px] truncate">{item.company}</Td>
                  <Td>{item.portOfDischarge}</Td>
                  <Td className="font-bold">{item.amount}</Td>
                  <Td>
                    <StatusPill status={item.status} />
                  </Td>
                  <Td>
                    <StatusPill status={item.financeStatus || '—'} />
                  </Td>
                  <Td className="whitespace-nowrap">{item.created}</Td>
                  <Td className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenActionId(openActionId === item.id ? null : item.id);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold cursor-pointer"
                    >
                      Actions <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                    {openActionId === item.id && (
                      <div className="absolute right-2 mt-1 w-32 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 text-left text-xs">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSINV(item);
                            setOpenActionId(null);
                          }}
                          className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5 text-slate-700 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-teal-600" /> View
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onShowSnackBar?.(`Editing ${item.saleInvoiceCode}`, 'info');
                            setOpenActionId(null);
                          }}
                          className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5 text-slate-700 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-500" /> Edit
                        </button>
                      </div>
                    )}
                  </Td>
                </DataRow>
              ))}
            </DataTable>
          ) : (
            <CardGrid>
              {sinvPaging.paged.map((item) => (
                <RecordCard
                  key={item.id}
                  code={item.saleInvoiceCode}
                  title={item.company}
                  subtitle={item.portOfDischarge}
                  status={item.status}
                  badges={<StatusPill status={item.financeStatus || '—'} />}
                  fields={[
                    { label: 'Amount', value: item.amount },
                    { label: 'Created', value: item.created },
                    { label: 'Proforma', value: item.proformaCode },
                    { label: 'Export Inquiry', value: item.exportInquiryCode },
                  ]}
                  onClick={() => setSelectedSINV(item)}
                  actions={[
                    { label: 'View', icon: 'view', onClick: () => setSelectedSINV(item) },
                    {
                      label: 'Edit',
                      icon: 'edit',
                      onClick: () => onShowSnackBar?.(`Editing ${item.saleInvoiceCode}`, 'info'),
                    },
                  ]}
                />
              ))}
            </CardGrid>
          ))}

        {/* ---- Customer Payment ---- */}
        {workstream === 'payment' &&
          (viewMode === 'grid' ? (
            <DataTable
              headers={[
                'Payment Code',
                'Customer',
                'Amount',
                'Method',
                'Date',
                'Status',
                'Created',
                'Actions',
              ]}
            >
              {payPaging.paged.map((item) => (
                <DataRow key={item.id} onClick={() => setSelectedPayment(item)}>
                  <Td accent mono>
                    {item.paymentCode}
                  </Td>
                  <Td className="max-w-[180px] truncate">{item.customer}</Td>
                  <Td className="font-bold">{item.paymentAmount}</Td>
                  <Td>{item.paymentMethod}</Td>
                  <Td>{item.paymentDate}</Td>
                  <Td>
                    <StatusPill status={item.status || '—'} />
                  </Td>
                  <Td className="whitespace-nowrap">{item.created}</Td>
                  <Td className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenActionId(openActionId === item.id ? null : item.id);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold cursor-pointer"
                    >
                      Actions <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                    {openActionId === item.id && (
                      <div className="absolute right-2 mt-1 w-32 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 text-left text-xs">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPayment(item);
                            setOpenActionId(null);
                          }}
                          className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5 text-slate-700 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-teal-600" /> View
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onShowSnackBar?.(`Editing ${item.paymentCode}`, 'info');
                            setOpenActionId(null);
                          }}
                          className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5 text-slate-700 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-500" /> Edit
                        </button>
                      </div>
                    )}
                  </Td>
                </DataRow>
              ))}
            </DataTable>
          ) : (
            <CardGrid>
              {payPaging.paged.map((item) => (
                <RecordCard
                  key={item.id}
                  code={item.paymentCode}
                  title={item.customer}
                  subtitle={item.proforma}
                  status={item.status || '—'}
                  fields={[
                    { label: 'Amount', value: item.paymentAmount },
                    { label: 'Method', value: item.paymentMethod },
                    { label: 'Date', value: item.paymentDate },
                    { label: 'Created', value: item.created },
                  ]}
                  onClick={() => setSelectedPayment(item)}
                  actions={[
                    { label: 'View', icon: 'view', onClick: () => setSelectedPayment(item) },
                    {
                      label: 'Edit',
                      icon: 'edit',
                      onClick: () => onShowSnackBar?.(`Editing ${item.paymentCode}`, 'info'),
                    },
                  ]}
                />
              ))}
            </CardGrid>
          ))}

        <ListPagination
          page={paging.page}
          pageSize={paging.pageSize}
          total={paging.total}
          onPageChange={paging.setPage}
          onPageSizeChange={paging.setPageSize}
        />
      </MobileContent>
    </MobilePage>
  );
};

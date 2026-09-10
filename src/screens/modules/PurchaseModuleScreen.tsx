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
} from 'lucide-react';
import {
  MOCK_PURCHASE_REQUISITIONS,
  MOCK_PURCHASE_ORDERS,
  MOCK_PURCHASE_INVOICES,
  PurchaseRequisitionItem,
  PurchaseOrderItem,
  PurchaseInvoiceItem,
} from '../../data/erpWorkstreamsData';

interface PurchaseModuleScreenProps {
  workstream: 'requisition' | 'order' | 'invoice';
  onBack: () => void;
  onShowSnackBar?: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const PurchaseModuleScreen: React.FC<PurchaseModuleScreenProps> = ({
  workstream,
  onBack,
  onShowSnackBar,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [containerMappingOpen, setContainerMappingOpen] = useState(true);

  // Selected item for View Page
  const [selectedPR, setSelectedPR] = useState<PurchaseRequisitionItem | null>(null);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrderItem | null>(null);
  const [selectedPINV, setSelectedPINV] = useState<PurchaseInvoiceItem | null>(null);

  // Dropdown actions tracking
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  // ============================================================================
  // 1. VIEW: PURCHASE REQUISITION DETAIL VIEW (RQ-1109)
  // ============================================================================
  if (workstream === 'requisition' && selectedPR) {
    const pr = selectedPR;
    const reqInfo = pr.requisitionInfo || {
      requisitionCode: pr.requisitionCode,
      paymentProfile: pr.paymentProfile,
      portOfLoading: 'Port Qasim',
      portOfDischarge: 'PT-149 - Abidjan',
      placeOfDelivery: "Cote D'Ivoire (Ivory Coast)",
      expectedDeliveryMonth: '2026-09-01',
      createdBy: 'TANVIR',
    };
    const compInfo = pr.companyInfo || {
      code: 'CO-001',
      name: 'Soneri International General Trading LLC',
    };
    const suppInfo = pr.supplierInfo || {
      name: pr.supplier,
      address: 'Plot # E-1-C, SITE Super Highway, Phase II, Malir Town',
      city: 'Karachi',
      state: 'Sindh',
      country: 'Pakistan',
      phone: '923219234088',
      email: 'imran@europaindustries.pk',
      website: 'www.europaindustries.com',
    };
    const profInfo = pr.proformaInfo || {
      proformaCode: pr.proformaCode,
      generatedDate: '07/09/2026',
      expiryDate: '06/08/2026',
      quote: 'QT-139',
      currency: 'United States Dollar',
      incoTerm: 'CNF',
      freight: '5000',
      portOfDischarge: 'PT-149 - Abidjan',
      marketingPersonal: pr.marketingPersonal,
    };
    const cMap = pr.containerMapping;
    const prods = pr.products || [];
    const podInstructions = pr.portOfDischargeInstructions || ['REQUIRED COC FOR THIS ORDER.'];
    const reqInstructions = pr.requisitionInstructions || [];
    const finStatus = pr.financeStatus || {
      status: 'Customer Accepted',
      nextFollowUpDate: '-',
      followUpAction: '-',
      comments: '-',
    };

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedPR(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back to List
            </button>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">View Requisition</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {pr.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onShowSnackBar?.(`Editing Requisition ${pr.requisitionCode}`, 'info')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" /> Edit
            </button>
            <button
              onClick={() => {
                window.print();
                onShowSnackBar?.(`Preparing ${pr.requisitionCode} for printing...`, 'info');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
          {/* Top Info 4-Column Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Column 1: Requisition Info */}
            <div className="space-y-2 border-r border-slate-100 pr-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Requisition Info</h3>
              <div className="space-y-1.5 text-xs">
                <div><span className="text-slate-500 font-medium">Requisition Code:</span> <span className="text-slate-900 font-semibold">{reqInfo.requisitionCode}</span></div>
                <div><span className="text-slate-500 font-medium">Payment Profile:</span> <span className="text-slate-800">{reqInfo.paymentProfile}</span></div>
                <div><span className="text-slate-500 font-medium">Port Of Loading:</span> <span className="text-slate-800">{reqInfo.portOfLoading}</span></div>
                <div><span className="text-slate-500 font-medium">Port Of Discharge:</span> <span className="text-slate-800">{reqInfo.portOfDischarge}</span></div>
                <div><span className="text-slate-500 font-medium">Place Of Delivery:</span> <span className="text-slate-800">{reqInfo.placeOfDelivery}</span></div>
                <div><span className="text-slate-500 font-medium">Expected Delivery Month:</span> <span className="text-slate-800">{reqInfo.expectedDeliveryMonth}</span></div>
                <div><span className="text-slate-500 font-medium">Created By:</span> <span className="text-slate-900 font-semibold">{reqInfo.createdBy}</span></div>
              </div>
            </div>

            {/* Column 2: Company */}
            <div className="space-y-2 border-r border-slate-100 pr-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Company</h3>
              <div className="space-y-1.5 text-xs">
                <div className="text-blue-600 font-semibold">{compInfo.code}</div>
                <div className="text-slate-900 font-medium">{compInfo.name}</div>
              </div>
            </div>

            {/* Column 3: Supplier */}
            <div className="space-y-2 border-r border-slate-100 pr-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Supplier</h3>
              <div className="space-y-1.5 text-xs">
                <div className="text-slate-900 font-semibold">{suppInfo.name}</div>
                {suppInfo.address && <div className="text-slate-600 leading-relaxed">{suppInfo.address}</div>}
                <div className="text-slate-600">{[suppInfo.city, suppInfo.state, suppInfo.country].filter(Boolean).join(', ')}</div>
                {suppInfo.phone && <div className="text-slate-600">{suppInfo.phone}</div>}
                {suppInfo.email && <div className="text-slate-600">{suppInfo.email}</div>}
                {suppInfo.website && <div className="text-blue-600">{suppInfo.website}</div>}
              </div>
            </div>

            {/* Column 4: Proforma Info */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Proforma Info</h3>
              <div className="space-y-1.5 text-xs">
                <div><span className="text-slate-500 font-medium">Proforma Code:</span> <span className="text-blue-600 font-semibold">{profInfo.proformaCode}</span></div>
                <div><span className="text-slate-500 font-medium">Generated Date:</span> <span className="text-slate-800">{profInfo.generatedDate}</span></div>
                <div><span className="text-slate-500 font-medium">Expiry Date:</span> <span className="text-slate-800">{profInfo.expiryDate}</span></div>
                <div><span className="text-slate-500 font-medium">Quote:</span> <span className="text-slate-800">{profInfo.quote}</span></div>
                <div><span className="text-slate-500 font-medium">Currency:</span> <span className="text-slate-800">{profInfo.currency}</span></div>
                <div><span className="text-slate-500 font-medium">Inco Term:</span> <span className="text-slate-800">{profInfo.incoTerm}</span></div>
                <div><span className="text-slate-500 font-medium">Freight:</span> <span className="text-slate-800">{profInfo.freight}</span></div>
                <div><span className="text-slate-500 font-medium">Port Of Discharge:</span> <span className="text-slate-800">{profInfo.portOfDischarge}</span></div>
                <div><span className="text-slate-500 font-medium">Marketing Personal:</span> <span className="text-slate-800">{profInfo.marketingPersonal}</span></div>
              </div>
            </div>
          </div>

          {/* Container Mapping Section */}
          {cMap && (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
              <button
                onClick={() => setContainerMappingOpen(!containerMappingOpen)}
                className="w-full px-6 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-left cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">Container Mapping</span>
                </div>
                {containerMappingOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {containerMappingOpen && (
                <div className="p-6 space-y-4">
                  <div className="border border-slate-200 rounded-lg p-4">
                    <div className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-800 font-semibold">{cMap.containerSize}</span>
                      <span>|</span>
                      <span>{cMap.containerName}</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-y border-slate-200">
                          <tr>
                            <th className="py-2.5 px-3">Thumbnail</th>
                            <th className="py-2.5 px-3">Product Name</th>
                            <th className="py-2.5 px-3">Variation</th>
                            <th className="py-2.5 px-3 text-right">Quantity</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {cMap.items.map((p, pIdx) => (
                            <tr key={pIdx}>
                              <td className="py-2.5 px-3">
                                <img src={p.thumbnail} alt={p.productName} className="w-10 h-10 object-cover rounded border border-slate-200" />
                              </td>
                              <td className="py-2.5 px-3 font-medium text-slate-900">{p.productName}</td>
                              <td className="py-2.5 px-3 text-slate-600">{p.variation}</td>
                              <td className="py-2.5 px-3 text-right font-semibold text-slate-900">{p.quantity}</td>
                            </tr>
                          ))}
                          <tr className="bg-slate-50/80 font-bold border-t border-slate-200">
                            <td colSpan={3} className="py-2.5 px-3 text-right">Total</td>
                            <td className="py-2.5 px-3 text-right">{cMap.total}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

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
                    <th className="py-3 px-3">Variations</th>
                    <th className="py-3 px-3 text-right">Quantity</th>
                    <th className="py-3 px-3">Shelf Life Duration</th>
                    <th className="py-3 px-3 text-right">CBM</th>
                    <th className="py-3 px-3 text-right">Weight</th>
                    <th className="py-3 px-3 text-right">Supplier Price</th>
                    <th className="py-3 px-3 text-center">Artwork Needed</th>
                    <th className="py-3 px-3">Supplier Remarks</th>
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
                      <td className="py-3 px-3 text-slate-600">{prod.variations}</td>
                      <td className="py-3 px-3 text-right font-semibold text-slate-900 whitespace-nowrap">{prod.quantity}</td>
                      <td className="py-3 px-3 text-slate-600">{prod.shelfLifeDuration}</td>
                      <td className="py-3 px-3 text-right text-slate-700">{prod.cbm}</td>
                      <td className="py-3 px-3 text-right text-slate-700">{prod.weight}</td>
                      <td className="py-3 px-3 text-right font-semibold text-slate-900">{prod.supplierPrice}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${prod.artworkNeeded === 'Yes' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-600'}`}>
                          {prod.artworkNeeded}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500">{prod.supplierRemarks || '-'}</td>
                      <td className="py-3 px-3 text-slate-500">{prod.notes || '-'}</td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="bg-slate-50 font-bold border-t border-slate-200 text-slate-900">
                    <td colSpan={3} className="py-3 px-3 text-right">Total</td>
                    <td className="py-3 px-3 text-right">2,075</td>
                    <td className="py-3 px-3">-</td>
                    <td className="py-3 px-3 text-right">47.31</td>
                    <td className="py-3 px-3 text-right">7,760.5 KG</td>
                    <td colSpan={4}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Port Of Discharge Instructions */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Port Of Discharge Instructions</h3>
            <div className="pt-1 flex flex-wrap gap-2">
              {podInstructions.map((pod, idx) => (
                <span key={idx} className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {pod}
                </span>
              ))}
            </div>
          </div>

          {/* Requisition Instructions */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Requisition Instructions</h3>
            <div className="flex flex-wrap gap-2">
              {reqInstructions.map((instruction, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
                >
                  {instruction}
                </span>
              ))}
            </div>
          </div>

          {/* Collection Instructions */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Collection Instructions</h3>
            <p className="text-xs text-slate-500 italic">{pr.collectionInstructions || 'No instructions found.'}</p>
          </div>

          {/* Container & Design Notes 2-Column Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Container</h3>
              <p className="text-xs font-semibold text-slate-800">{pr.containerSummary || '40 ft HC × 1'}</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Design Notes</h3>
              <p className="text-xs text-slate-800">{pr.designNotes || 'REF. # PI-835'}</p>
            </div>
          </div>

          {/* Finance Status & Proforma Remarks 2-Column Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Finance Status</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {finStatus.status}
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div><span className="font-medium text-slate-500">Next Follow Up Date:</span> {finStatus.nextFollowUpDate}</div>
                <div><span className="font-medium text-slate-500">Follow Up Action:</span> {finStatus.followUpAction}</div>
                <div><span className="font-medium text-slate-500">Comments:</span> {finStatus.comments}</div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Proforma Remarks</h3>
              <p className="text-xs text-slate-500 italic">{pr.proformaRemarks || 'No remarks found'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. VIEW: PURCHASE ORDER DETAIL VIEW (PO-1114)
  // ============================================================================
  if (workstream === 'order' && selectedPO) {
    const po = selectedPO;
    const reqInfo = po.requisitionInfo || {
      purchaseOrderCode: po.code,
      requisitionCode: po.requisitionCode,
      proformaCode: po.proformaCode,
      currency: 'United States Dollar',
      portOfLoading: 'Port Qasim',
      portOfDischarge: 'PT-149 - Abidjan',
      placeOfDelivery: "Cote D'Ivoire (Ivory Coast)",
      createdBy: 'TANVIR',
      marketingPersonal: po.marketingPersonal,
    };
    const compInfo = po.companyInfo || {
      code: 'CO-001',
      name: 'Soneri International General Trading LLC',
      email: 'info@soneriinternational.com',
      website: 'www.soneriinternational.com',
    };
    const suppInfo = po.supplierInfo || {
      name: po.supplier,
      address: 'Plot # E-1-C, SITE Super Highway, Phase II, Malir Town',
      city: 'Karachi',
      state: 'Sindh',
      country: 'Pakistan',
      phone: '923219234088',
      email: 'imran@europaindustries.pk',
      website: 'www.europaindustries.com',
    };
    const prods = po.products || [];
    const expenses = po.otherExpenses || [];
    const discounts = po.discounts || [];
    const sum = po.summary || {
      productsTotal: '$18156.2500',
      otherExpenses: '$0.0000',
      discount: '$0.0000',
      total: '$18156.2500',
    };
    const podInstructions = po.portOfDischargeInstructions || ['REQUIRED COC FOR THIS ORDER.'];
    const reqInstructions = po.requisitionInstructions || [];
    const colInstructions = po.collectionInstructions || [];
    const docs = po.documents || [];

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedPO(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back to List
            </button>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">View Purchase Order</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
              {po.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onShowSnackBar?.(`Editing Purchase Order ${po.code}`, 'info')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" /> Edit
            </button>
            <button
              onClick={() => {
                window.print();
                onShowSnackBar?.(`Preparing ${po.code} for printing...`, 'info');
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
            {/* Column 1: Order Info */}
            <div className="space-y-2 border-r border-slate-100 pr-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Requisition Info</h3>
              <div className="space-y-1.5 text-xs">
                <div><span className="text-slate-500 font-medium">Purchase Order Code:</span> <span className="text-slate-900 font-semibold">{reqInfo.purchaseOrderCode}</span></div>
                <div><span className="text-slate-500 font-medium">Requisition Code:</span> <span className="text-blue-600 font-semibold">{reqInfo.requisitionCode}</span></div>
                <div><span className="text-slate-500 font-medium">Proforma Code:</span> <span className="text-blue-600 font-semibold">{reqInfo.proformaCode}</span></div>
                <div><span className="text-slate-500 font-medium">Currency:</span> <span className="text-slate-800">{reqInfo.currency}</span></div>
                <div><span className="text-slate-500 font-medium">Port Of Loading:</span> <span className="text-slate-800">{reqInfo.portOfLoading}</span></div>
                <div><span className="text-slate-500 font-medium">Port Of Discharge:</span> <span className="text-slate-800">{reqInfo.portOfDischarge}</span></div>
                <div><span className="text-slate-500 font-medium">Place Of Delivery:</span> <span className="text-slate-800">{reqInfo.placeOfDelivery}</span></div>
                <div><span className="text-slate-500 font-medium">Created By:</span> <span className="text-slate-900 font-semibold">{reqInfo.createdBy}</span></div>
                <div><span className="text-slate-500 font-medium">Marketing Personal:</span> <span className="text-slate-800">{reqInfo.marketingPersonal}</span></div>
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

            {/* Column 3: Supplier */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Supplier</h3>
              <div className="space-y-1.5 text-xs">
                <div className="text-slate-900 font-semibold">{suppInfo.name}</div>
                {suppInfo.address && <div className="text-slate-600 leading-relaxed">{suppInfo.address}</div>}
                <div className="text-slate-600">{[suppInfo.city, suppInfo.state, suppInfo.country].filter(Boolean).join(', ')}</div>
                {suppInfo.phone && <div className="text-slate-600">{suppInfo.phone}</div>}
                {suppInfo.email && <div className="text-slate-600">{suppInfo.email}</div>}
                {suppInfo.website && <div className="text-blue-600">{suppInfo.website}</div>}
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
                    <th className="py-3 px-3">Variations</th>
                    <th className="py-3 px-3 text-right">Quantity</th>
                    <th className="py-3 px-3 text-right">PO Price</th>
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
                      <td className="py-3 px-3 text-slate-600">{prod.variations}</td>
                      <td className="py-3 px-3 text-right font-semibold text-slate-900 whitespace-nowrap">{prod.quantity}</td>
                      <td className="py-3 px-3 text-right font-semibold text-slate-900">{prod.poPrice}</td>
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
                    <td className="py-3 px-3 text-right">2,075</td>
                    <td className="py-3 px-3 text-right">-</td>
                    <td className="py-3 px-3 text-right">$ 18,156.2500</td>
                    <td className="py-3 px-3 text-center">-</td>
                    <td className="py-3 px-3 text-right">47.31</td>
                    <td className="py-3 px-3 text-right">7,760.5 KG</td>
                    <td className="py-3 px-3 text-center">-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Other Expenses & Discounts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Other Expenses</h3>
              {expenses.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No Expense found.</p>
              ) : (
                <div className="space-y-1 text-xs">
                  {expenses.map((e, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{e.expenseType}</span>
                      <span>{e.charges}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Discounts</h3>
              {discounts.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No Discount found.</p>
              ) : (
                <div className="space-y-1 text-xs">
                  {discounts.map((d, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{d.discountType}</span>
                      <span>{d.amount}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Container & Summary 2-Column Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Container</h3>
              <p className="text-xs font-semibold text-slate-800">{po.containerSummary || '40 ft HC × 1'}</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Summary</h3>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between"><span>Products Total:</span> <span className="font-semibold text-slate-900">{sum.productsTotal}</span></div>
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
            <div className="pt-1 flex flex-wrap gap-2">
              {podInstructions.map((pod, idx) => (
                <span key={idx} className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {pod}
                </span>
              ))}
            </div>
          </div>

          {/* Requisition Instructions */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Requisition Instructions</h3>
            <div className="flex flex-wrap gap-2">
              {reqInstructions.map((instruction, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
                >
                  {instruction}
                </span>
              ))}
            </div>
          </div>

          {/* Collection Instructions */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Collection Instructions</h3>
            <div className="space-y-1.5">
              {colInstructions.map((ci, idx) => (
                <div key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                  <span className="font-semibold text-slate-900">{idx + 1}.</span>
                  <span>{ci}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Documents & Remarks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Documents</h3>
              {docs.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No documents available.</p>
              ) : (
                <div className="space-y-1 text-xs">
                  {docs.map((d, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{d.documentType}</span>
                      <span>{d.file}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Remarks</h3>
              <p className="text-xs text-slate-700">{po.remarks || '-'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 3. VIEW: PURCHASE INVOICE DETAIL VIEW (POI-659)
  // ============================================================================
  if (workstream === 'invoice' && selectedPINV) {
    const pinv = selectedPINV;
    const compInfo = pinv.companyInfo || {
      code: 'CO-001',
      name: 'Soneri International General Trading LLC',
      email: 'info@soneriinternational.com',
      website: 'www.soneriinternational.com',
    };
    const suppInfo = pinv.supplierInfo || {
      name: pinv.supplier,
      address: '3-KM Bahawalpur Bypass, Bahawalpur Road',
      city: 'Multan',
      state: 'Punjab',
      country: 'Pakistan',
      phone: '920612001000',
      email: 'info@volkafood.com',
      website: 'https://volkafood.com/',
    };
    const finStatus = pinv.financeStatus || {
      status: 'Confirmed',
      nextFollowUpDate: '-',
      followUpAction: '-',
      comments: '-',
    };
    const prods = pinv.products || [];
    const txDetails = pinv.transactionDetails || [];
    const expenses = pinv.otherExpenses || [];
    const docs = pinv.documents || [];
    const sum = pinv.summary || {
      productsTotal: '$ 25584.0000',
      otherExpenses: '$ 7180.0000',
      discounts: '-',
      total: '$ 32764.0000',
    };

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedPINV(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back to List
            </button>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">View Purchase Invoice</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {pinv.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onShowSnackBar?.(`Editing Purchase Invoice ${pinv.code}`, 'info')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" /> Edit
            </button>
            <button
              onClick={() => {
                window.print();
                onShowSnackBar?.(`Preparing ${pinv.code} for printing...`, 'info');
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
                <div><span className="text-slate-500 font-medium">Purchase Invoice Code:</span> <span className="text-slate-900 font-semibold">{pinv.code}</span></div>
                <div><span className="text-slate-500 font-medium">CI Number:</span> <span className="text-slate-900 font-semibold">{pinv.ciNumber}</span></div>
                <div><span className="text-slate-500 font-medium">CI Date:</span> <span className="text-slate-800">{pinv.ciDate || '31/08/2026'}</span></div>
                <div><span className="text-slate-500 font-medium">Proforma Code:</span> <span className="text-blue-600 font-semibold">{pinv.proformaCode}</span></div>
                <div><span className="text-slate-500 font-medium">Purchase Order Code:</span> <span className="text-blue-600 font-semibold">{pinv.purchaseOrderCode}</span></div>
                <div><span className="text-slate-500 font-medium">Export Inquiry Code:</span> <span className="text-blue-600 font-semibold">{pinv.exportInquiryCode}</span></div>
                <div><span className="text-slate-500 font-medium">Marketing Personal:</span> <span className="text-slate-800">{pinv.marketingPersonal}</span></div>
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

            {/* Column 3: Supplier */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Supplier</h3>
              <div className="space-y-1.5 text-xs">
                <div className="text-slate-900 font-semibold">{suppInfo.name}</div>
                {suppInfo.address && <div className="text-slate-600 leading-relaxed">{suppInfo.address}</div>}
                <div className="text-slate-600">{[suppInfo.city, suppInfo.state, suppInfo.country].filter(Boolean).join(', ')}</div>
                {suppInfo.phone && <div className="text-slate-600">{suppInfo.phone}</div>}
                {suppInfo.email && <div className="text-slate-600">{suppInfo.email}</div>}
                {suppInfo.website && <div className="text-blue-600">{suppInfo.website}</div>}
              </div>
            </div>
          </div>

          {/* Finance Status */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Finance Status</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>
                {finStatus.status}
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div><span className="font-medium text-slate-500">Next Follow Up Date:</span> {finStatus.nextFollowUpDate}</div>
              <div><span className="font-medium text-slate-500">Follow Up Action:</span> {finStatus.followUpAction}</div>
              <div><span className="font-medium text-slate-500">Comments:</span> {finStatus.comments}</div>
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
                    <th className="py-3 px-3">MFG Date</th>
                    <th className="py-3 px-3">Expiry Date</th>
                    <th className="py-3 px-3">Batch No</th>
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
                      <td className="py-3 px-3 text-slate-600">{prod.mfgDate}</td>
                      <td className="py-3 px-3 text-slate-600">{prod.expiryDate}</td>
                      <td className="py-3 px-3 font-medium text-slate-700">{prod.batchNo}</td>
                      <td className="py-3 px-3 text-slate-500">{prod.notes || '-'}</td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="bg-slate-50 font-bold border-t border-slate-200 text-slate-900">
                    <td colSpan={3} className="py-3 px-3 text-right">Total</td>
                    <td className="py-3 px-3 text-right">2,080</td>
                    <td className="py-3 px-3 text-right">-</td>
                    <td className="py-3 px-3 text-right">$ 25,584.0000</td>
                    <td className="py-3 px-3 text-right">67.2880</td>
                    <td className="py-3 px-3 text-right">9,672.0000 KG</td>
                    <td colSpan={4}></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800">Transaction Details</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10.5px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Account Name</th>
                    <th className="py-2.5 px-4 text-right">Debit</th>
                    <th className="py-2.5 px-4 text-right">Credit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {txDetails.map((tx, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-4 font-medium text-slate-800">{tx.accountName}</td>
                      <td className="py-2.5 px-4 text-right text-slate-900">{tx.debit}</td>
                      <td className="py-2.5 px-4 text-right text-slate-900">{tx.credit}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold border-t border-slate-200 text-slate-900">
                    <td className="py-2.5 px-4">Total</td>
                    <td className="py-2.5 px-4 text-right">$ 32,764.0000</td>
                    <td className="py-2.5 px-4 text-right">$ 32,764.0000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Other Expenses & Discounts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Other Expenses</h3>
              <div className="space-y-2 text-xs">
                {expenses.map((exp, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="font-medium text-slate-800">{exp.expenseType}</span>
                    <span className="font-semibold text-slate-900">{exp.charges}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Discounts</h3>
              <p className="text-xs text-slate-500 italic">No Discount found.</p>
            </div>
          </div>

          {/* Container & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Container</h3>
              <p className="text-xs font-semibold text-slate-800">{pinv.containerSummary || '40 ft HC × 1'}</p>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Summary</h3>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between"><span>Products Total:</span> <span className="font-semibold text-slate-900">{sum.productsTotal}</span></div>
                <div className="flex justify-between"><span>Other Expenses:</span> <span>{sum.otherExpenses}</span></div>
                <div className="flex justify-between"><span>Discounts:</span> <span>{sum.discounts}</span></div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                  <span>Total:</span> <span>{sum.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Documents & Remarks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Documents</h3>
              <div className="space-y-2 text-xs">
                {docs.map((doc, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1.5 border-b border-slate-100">
                    <span className="font-medium text-slate-800">{doc.documentType}</span>
                    <span className="text-slate-500">{doc.createdTime}</span>
                    <span className="text-blue-600 font-semibold cursor-pointer hover:underline">{doc.file}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Remarks</h3>
              <p className="text-xs text-slate-700">{pinv.remarks || '-'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 4. GRID: PURCHASE WORKSTREAMS (Requisition, Order, Invoice)
  // ============================================================================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Title Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {workstream === 'requisition' && 'Manage Requisitions'}
            {workstream === 'order' && 'Manage Purchase Orders'}
            {workstream === 'invoice' && 'Manage Purchase Invoices'}
          </h1>
        </div>

        {/* Action Controls Top Right: Filters, Columns, Search */}
        <div className="flex items-center gap-3">
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

      {/* Tabs (for Requisition and Order) */}
      {(workstream === 'requisition' || workstream === 'order') && (
        <div className="bg-white border-b border-slate-200 px-6 flex gap-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'ALL'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {workstream === 'requisition' ? 'All Requisition' : 'All Purchase Orders'}
          </button>
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'PENDING'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            {workstream === 'requisition' ? 'Pending Requisition' : 'Pending Purchase Orders'}
          </button>
        </div>
      )}

      {/* Table Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            {/* ------------------------------------------------------------- */}
            {/* GRID: PURCHASE REQUISITION                                    */}
            {/* ------------------------------------------------------------- */}
            {workstream === 'requisition' && (
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Requisition Code</th>
                    <th className="py-3 px-4">Proforma Code</th>
                    <th className="py-3 px-4">Ticket Code</th>
                    <th className="py-3 px-4">Marketing Personal</th>
                    <th className="py-3 px-4">Supplier</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Payment Profile</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Proforma Status</th>
                    <th className="py-3 px-4">Created</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_PURCHASE_REQUISITIONS.filter((r) =>
                    activeTab === 'PENDING' ? r.status.toLowerCase().includes('pending') : true
                  )
                    .filter(
                      (r) =>
                        r.requisitionCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        r.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        r.marketingPersonal.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setSelectedPR(item)}
                            className="text-blue-600 font-semibold hover:underline cursor-pointer flex items-center gap-1"
                          >
                            {item.requisitionCode}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-blue-600 font-medium hover:underline cursor-pointer">
                          {item.proformaCode}
                        </td>
                        <td className="py-3 px-4 text-slate-600">{item.ticketCode}</td>
                        <td className="py-3 px-4 font-medium text-slate-800">{item.marketingPersonal}</td>
                        <td className="py-3 px-4 text-slate-800 max-w-xs truncate">{item.supplier}</td>
                        <td className="py-3 px-4 text-slate-600">{item.company}</td>
                        <td className="py-3 px-4 text-slate-600">{item.paymentProfile}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {item.proformaStatus}
                          </span>
                        </td>
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
                                  setSelectedPR(item);
                                  setOpenActionId(null);
                                }}
                                className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5 text-slate-700"
                              >
                                <Eye className="w-3.5 h-3.5 text-blue-600" /> View
                              </button>
                              <button
                                onClick={() => {
                                  onShowSnackBar?.(`Editing ${item.requisitionCode}`, 'info');
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
            {/* GRID: PURCHASE ORDER                                          */}
            {/* ------------------------------------------------------------- */}
            {workstream === 'order' && (
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Requisition Code</th>
                    <th className="py-3 px-4">Proforma Code</th>
                    <th className="py-3 px-4">Supplier</th>
                    <th className="py-3 px-4">Marketing Personal</th>
                    <th className="py-3 px-4">Company</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Proforma Status</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Finance Status</th>
                    <th className="py-3 px-4">Created</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_PURCHASE_ORDERS.filter((o) =>
                    activeTab === 'PENDING' ? o.status.toLowerCase().includes('draft') : true
                  )
                    .filter(
                      (o) =>
                        o.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        o.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        o.marketingPersonal.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <button
                            onClick={() => setSelectedPO(item)}
                            className="text-blue-600 font-semibold hover:underline cursor-pointer"
                          >
                            {item.code}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-blue-600 font-medium hover:underline cursor-pointer">
                          {item.requisitionCode}
                        </td>
                        <td className="py-3 px-4 text-blue-600 font-medium hover:underline cursor-pointer">
                          {item.proformaCode}
                        </td>
                        <td className="py-3 px-4 text-slate-800 max-w-xs truncate">{item.supplier}</td>
                        <td className="py-3 px-4 font-medium text-slate-800">{item.marketingPersonal}</td>
                        <td className="py-3 px-4 text-slate-600">{item.company}</td>
                        <td className="py-3 px-4 text-slate-800">{item.customer}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {item.proformaStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
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
                                  setSelectedPO(item);
                                  setOpenActionId(null);
                                }}
                                className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5 text-slate-700"
                              >
                                <Eye className="w-3.5 h-3.5 text-blue-600" /> View
                              </button>
                              <button
                                onClick={() => {
                                  onShowSnackBar?.(`Editing ${item.code}`, 'info');
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
            {/* GRID: PURCHASE INVOICE                                        */}
            {/* ------------------------------------------------------------- */}
            {workstream === 'invoice' && (
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Proforma Code</th>
                    <th className="py-3 px-4">Marketing Personal</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Supplier</th>
                    <th className="py-3 px-4">Company Name</th>
                    <th className="py-3 px-4">CI Number</th>
                    <th className="py-3 px-4">Purchase Order Code</th>
                    <th className="py-3 px-4">Export Inquiry Code</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_PURCHASE_INVOICES.filter(
                    (i) =>
                      i.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      i.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      i.customer.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <button
                          onClick={() => setSelectedPINV(item)}
                          className="text-blue-600 font-semibold hover:underline cursor-pointer"
                        >
                          {item.code}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-blue-600 font-medium hover:underline cursor-pointer">
                        {item.proformaCode}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">{item.marketingPersonal}</td>
                      <td className="py-3 px-4 text-slate-800 max-w-xs truncate">{item.customer}</td>
                      <td className="py-3 px-4 text-slate-800 max-w-xs truncate">{item.supplier}</td>
                      <td className="py-3 px-4 text-slate-600">{item.companyName}</td>
                      <td className="py-3 px-4 text-slate-800 font-medium">{item.ciNumber}</td>
                      <td className="py-3 px-4 text-blue-600 font-medium hover:underline cursor-pointer">
                        {item.purchaseOrderCode}
                      </td>
                      <td className="py-3 px-4 text-blue-600 font-medium hover:underline cursor-pointer">
                        {item.exportInquiryCode}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">{item.amount}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {item.status}
                        </span>
                      </td>
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
                                setSelectedPINV(item);
                                setOpenActionId(null);
                              }}
                              className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5 text-slate-700"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-600" /> View
                            </button>
                            <button
                              onClick={() => {
                                onShowSnackBar?.(`Editing ${item.code}`, 'info');
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

          {/* Pagination Footer matching screenshot */}
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
            <div>
              {workstream === 'requisition' && 'Showing 1 to 10 of 741 records'}
              {workstream === 'order' && 'Showing 1 to 10 of 739 records'}
              {workstream === 'invoice' && 'Showing 1 to 10 of 589 records'}
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
                  {workstream === 'requisition' ? '75' : workstream === 'order' ? '74' : '59'}
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

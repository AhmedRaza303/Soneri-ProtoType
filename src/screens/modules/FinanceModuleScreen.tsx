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
  LayoutGrid,
  CreditCard,
  Eye,
  Check,
  X,
  Printer,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import {
  MOCK_PO_APPROVALS,
  MOCK_PROFORMA_SUPPLIERS,
  POApprovalItem,
  ProformaSupplierItem,
} from '../../data/erpWorkstreamsData';

interface FinanceModuleScreenProps {
  workstream: 'po_approval' | 'proforma_supplier';
  onBack: () => void;
  onShowSnackBar?: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const FinanceModuleScreen: React.FC<FinanceModuleScreenProps> = ({
  workstream,
  onBack,
  onShowSnackBar,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'card'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [poList, setPoList] = useState<POApprovalItem[]>(MOCK_PO_APPROVALS);
  const [proformaList, setProformaList] = useState<ProformaSupplierItem[]>(MOCK_PROFORMA_SUPPLIERS);

  // Selected for View Details
  const [selectedPO, setSelectedPO] = useState<POApprovalItem | null>(null);
  const [selectedProforma, setSelectedProforma] = useState<ProformaSupplierItem | null>(null);

  const handleApprovePO = (po: POApprovalItem) => {
    setPoList((prev) =>
      prev.map((item) => (item.id === po.id ? { ...item, status: 'Approved' } : item))
    );
    if (selectedPO?.id === po.id) {
      setSelectedPO({ ...selectedPO, status: 'Approved' });
    }
    onShowSnackBar?.(`Purchase Order ${po.poNumber} has been approved`, 'success');
  };

  const handleRejectPO = (po: POApprovalItem) => {
    setPoList((prev) =>
      prev.map((item) => (item.id === po.id ? { ...item, status: 'Rejected' } : item))
    );
    if (selectedPO?.id === po.id) {
      setSelectedPO({ ...selectedPO, status: 'Rejected' });
    }
    onShowSnackBar?.(`Purchase Order ${po.poNumber} has been rejected`, 'warning');
  };

  // ============================================================================
  // 1. VIEW: PO APPROVAL DETAIL VIEW
  // ============================================================================
  if (workstream === 'po_approval' && selectedPO) {
    const po = selectedPO;
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
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">View PO Approval</h1>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                po.status === 'Approved'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : po.status === 'Rejected'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  po.status === 'Approved'
                    ? 'bg-emerald-500'
                    : po.status === 'Rejected'
                    ? 'bg-rose-500'
                    : 'bg-amber-500'
                }`}
              ></span>
              {po.status}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                po.priority === 'Urgent'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : po.priority === 'High'
                  ? 'bg-orange-50 text-orange-700 border border-orange-200'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {po.priority} Priority
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onShowSnackBar?.(`Printed PO voucher for ${po.poNumber}`, 'info')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print PO
            </button>
            {po.status !== 'Approved' && (
              <button
                onClick={() => handleApprovePO(po)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-xs cursor-pointer"
              >
                <Check className="w-4 h-4" /> Approve Order
              </button>
            )}
            {po.status !== 'Rejected' && (
              <button
                onClick={() => handleRejectPO(po)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md shadow-xs cursor-pointer"
              >
                <X className="w-4 h-4" /> Reject Order
              </button>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
          {/* Main Info Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 border-r border-slate-100 pr-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Order Details</h3>
              <div className="space-y-1.5 text-xs">
                <div><span className="text-slate-500 font-medium">PO Number:</span> <span className="text-slate-900 font-semibold">{po.poNumber}</span></div>
                <div><span className="text-slate-500 font-medium">Supplier Name:</span> <span className="text-slate-900 font-semibold">{po.supplierName}</span></div>
                <div><span className="text-slate-500 font-medium">Department:</span> <span className="text-slate-800">{po.department}</span></div>
                <div><span className="text-slate-500 font-medium">Requester:</span> <span className="text-slate-800">{po.requester}</span></div>
              </div>
            </div>

            <div className="space-y-2 border-r border-slate-100 pr-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Schedule & Terms</h3>
              <div className="space-y-1.5 text-xs">
                <div><span className="text-slate-500 font-medium">Order Date:</span> <span className="text-slate-900 font-semibold">{po.orderDate}</span></div>
                <div><span className="text-slate-500 font-medium">Delivery Date:</span> <span className="text-slate-800">{po.deliveryDate}</span></div>
                <div><span className="text-slate-500 font-medium">Payment Terms:</span> <span className="text-slate-800">{po.paymentTerms}</span></div>
                <div><span className="text-slate-500 font-medium">Priority:</span> <span className="font-semibold text-slate-900">{po.priority}</span></div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Financial Summary</h3>
              <div className="space-y-1.5 text-xs">
                <div><span className="text-slate-500 font-medium">Total Amount:</span> <span className="text-slate-800 font-mono">{po.currency} {po.totalAmount.toLocaleString()}</span></div>
                <div><span className="text-slate-500 font-medium">Tax Amount:</span> <span className="text-slate-800 font-mono">{po.currency} {po.taxAmount.toLocaleString()}</span></div>
                <div><span className="text-slate-500 font-medium">Net Amount:</span> <span className="text-slate-950 font-black font-mono text-sm">{po.currency} {po.netAmount.toLocaleString()}</span></div>
                <div><span className="text-slate-500 font-medium">Approval Status:</span> <span className="font-bold text-slate-900">{po.status}</span></div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800">Order Items & Bill of Materials</h3>
              <span className="text-xs text-slate-500 font-semibold">{po.items.length} line items</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10.5px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Item Code</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4 text-right">Quantity</th>
                    <th className="py-3 px-4">Unit</th>
                    <th className="py-3 px-4 text-right">Unit Price ({po.currency})</th>
                    <th className="py-3 px-4 text-right">Total ({po.currency})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {po.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{item.itemCode}</td>
                      <td className="py-3 px-4 font-medium text-slate-800">{item.description}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">{item.quantity.toLocaleString()}</td>
                      <td className="py-3 px-4 text-slate-500">{item.unit}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-800">{item.unitPrice.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold border-t border-slate-200 text-slate-900">
                    <td colSpan={5} className="py-3 px-4 text-right">Net Payable Value:</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-950 font-black">
                      {po.currency} {po.netAmount.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Multi-Stage Approval Hierarchy Stepper */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Multi-Stage Approval Hierarchy</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {po.approvals.map((appr, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    appr.status === 'Approved'
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : appr.status === 'Rejected'
                      ? 'bg-rose-50/50 border-rose-200'
                      : 'bg-slate-50 border-slate-200'
                  } space-y-2`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{appr.role}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        appr.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : appr.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {appr.status}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800">{appr.name}</p>
                  {appr.date && (
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {appr.date}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Justification Notes */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Purchase Order Notes</h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-md border border-slate-200">
              {po.notes}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. VIEW: PROFORMA SUPPLIER DETAIL VIEW
  // ============================================================================
  if (workstream === 'proforma_supplier' && selectedProforma) {
    const prof = selectedProforma;
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedProforma(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back to List
            </button>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">View Proforma Supplier</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              {prof.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onShowSnackBar?.(`Exported proforma voucher ${prof.proformaNumber}`, 'info')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print Proforma
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
          {/* Main Info Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 border-r border-slate-100 pr-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Supplier Particulars</h3>
              <div className="space-y-1.5 text-xs">
                <div><span className="text-slate-500 font-medium">Proforma Number:</span> <span className="text-slate-900 font-semibold">{prof.proformaNumber}</span></div>
                <div><span className="text-slate-500 font-medium">Supplier Name:</span> <span className="text-slate-900 font-semibold">{prof.supplierName}</span></div>
                <div><span className="text-slate-500 font-medium">Origin Country:</span> <span className="text-slate-800">{prof.originCountry}</span></div>
                <div><span className="text-slate-500 font-medium">LC Number:</span> <span className="text-blue-600 font-semibold">{prof.lcNumber}</span></div>
              </div>
            </div>

            <div className="space-y-2 border-r border-slate-100 pr-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Banking Information</h3>
              <div className="space-y-1.5 text-xs">
                <div><span className="text-slate-500 font-medium">Bank Name:</span> <span className="text-slate-900 font-medium">{prof.bankName}</span></div>
                <div><span className="text-slate-500 font-medium">IBAN:</span> <span className="text-slate-800 font-mono">{prof.ibanNumber}</span></div>
                <div><span className="text-slate-500 font-medium">SWIFT Code:</span> <span className="text-slate-800 font-mono font-semibold">{prof.swiftCode}</span></div>
                <div><span className="text-slate-500 font-medium">Purpose:</span> <span className="text-slate-700">{prof.purpose}</span></div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Financials & Advance</h3>
              <div className="space-y-1.5 text-xs">
                <div><span className="text-slate-500 font-medium">Issue Date:</span> <span className="text-slate-800">{prof.issueDate}</span></div>
                <div><span className="text-slate-500 font-medium">Due Date:</span> <span className="text-slate-800">{prof.dueDate}</span></div>
                <div><span className="text-slate-500 font-medium">Total Amount:</span> <span className="text-slate-900 font-bold">{prof.currency} {prof.amount.toLocaleString()}</span></div>
                <div><span className="text-slate-500 font-medium">Advance Required:</span> <span className="text-blue-700 font-bold">{prof.advancePercentage}% ({prof.currency} {prof.advanceAmount.toLocaleString()})</span></div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800">Proforma Line Items</h3>
              <span className="text-xs text-slate-500 font-semibold">{prof.items.length} items</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10.5px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">HS Code</th>
                    <th className="py-3 px-4 text-right">Quantity</th>
                    <th className="py-3 px-4">Unit</th>
                    <th className="py-3 px-4 text-right">Rate ({prof.currency})</th>
                    <th className="py-3 px-4 text-right">Amount ({prof.currency})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {prof.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-900">{item.description}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{item.hsCode}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">{item.quantity.toLocaleString()}</td>
                      <td className="py-3 px-4 text-slate-500">{item.unit}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-800">{item.rate.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold border-t border-slate-200 text-slate-900">
                    <td colSpan={5} className="py-3 px-4 text-right">Total Invoice Value:</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-950 font-black">
                      {prof.currency} {prof.amount.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 3. MAIN SCREEN: GRID VIEW & CARD VIEW (WITH TOGGLE)
  // ============================================================================
  const titles = {
    po_approval: { title: 'Purchase Order Approval', subtitle: 'Executive Multi-Tier Approval Workflow & Authorization' },
    proforma_supplier: { title: 'Supplier Proforma Invoices', subtitle: 'Import Invoices, Advance Remittances & LC Tracking' },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Title & Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {titles[workstream].title}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">{titles[workstream].subtitle}</p>
        </div>

        {/* Action Controls Top Right: View Mode Toggle, Filters, Search */}
        <div className="flex items-center gap-3">
          {/* View Mode Toggle: Grid View <-> Card View */}
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

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* =========================================================================
            WORKSTREAM: PO APPROVAL
           ========================================================================= */}
        {workstream === 'po_approval' && (
          <>
            {viewMode === 'grid' ? (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 uppercase text-[10.5px] font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">PO #</th>
                        <th className="py-3 px-4">Supplier Name</th>
                        <th className="py-3 px-4">Department</th>
                        <th className="py-3 px-4">Requester</th>
                        <th className="py-3 px-4">Order Date</th>
                        <th className="py-3 px-4">Delivery Date</th>
                        <th className="py-3 px-4">Priority</th>
                        <th className="py-3 px-4 text-right">Net Amount</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {poList.filter(
                        (p) =>
                          p.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.department.toLowerCase().includes(searchQuery.toLowerCase())
                      ).map((po) => (
                        <tr key={po.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900 cursor-pointer hover:text-blue-600" onClick={() => setSelectedPO(po)}>
                            {po.poNumber}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-900">{po.supplierName}</td>
                          <td className="py-3.5 px-4 text-slate-700">{po.department}</td>
                          <td className="py-3.5 px-4 text-slate-700">{po.requester}</td>
                          <td className="py-3.5 px-4 text-slate-700">{po.orderDate}</td>
                          <td className="py-3.5 px-4 text-slate-700">{po.deliveryDate}</td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[10.5px] font-semibold ${
                                po.priority === 'Urgent'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : po.priority === 'High'
                                  ? 'bg-orange-50 text-orange-700 border border-orange-200'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {po.priority}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                            {po.currency} {po.netAmount.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                                po.status === 'Approved'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : po.status === 'Rejected'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}
                            >
                              {po.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => setSelectedPO(po)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-500" /> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* PO Approval Card View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {poList.filter(
                  (p) =>
                    p.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.department.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((po) => (
                  <div
                    key={po.id}
                    className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <div className="font-mono text-xs font-bold text-blue-600">{po.poNumber}</div>
                        <h3 className="text-sm font-bold text-slate-900 cursor-pointer hover:text-blue-600 mt-0.5" onClick={() => setSelectedPO(po)}>
                          {po.supplierName}
                        </h3>
                        <p className="text-xs text-slate-500">{po.department}</p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border shrink-0 ${
                          po.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : po.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {po.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Requester:</span>
                        <span className="text-slate-800 font-medium">{po.requester}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Order Date:</span>
                        <span className="text-slate-800">{po.orderDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Delivery Date:</span>
                        <span className="text-slate-800">{po.deliveryDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Priority:</span>
                        <span className="font-semibold text-slate-900">{po.priority}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-100">
                        <span className="text-slate-500 font-semibold">Net Payable:</span>
                        <span className="text-slate-900 font-black font-mono text-sm">{po.currency} {po.netAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">{po.items.length} items</span>
                      <button
                        onClick={() => setSelectedPO(po)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* =========================================================================
            WORKSTREAM: PROFORMA SUPPLIER
           ========================================================================= */}
        {workstream === 'proforma_supplier' && (
          <>
            {viewMode === 'grid' ? (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 uppercase text-[10.5px] font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Proforma #</th>
                        <th className="py-3 px-4">Supplier Name</th>
                        <th className="py-3 px-4">Origin Country</th>
                        <th className="py-3 px-4">Issue Date</th>
                        <th className="py-3 px-4">Due Date</th>
                        <th className="py-3 px-4">LC #</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                        <th className="py-3 px-4 text-center">Advance %</th>
                        <th className="py-3 px-4 text-right">Advance Amount</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {proformaList.filter(
                        (p) =>
                          p.proformaNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.originCountry.toLowerCase().includes(searchQuery.toLowerCase())
                      ).map((prof) => (
                        <tr key={prof.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900 cursor-pointer hover:text-blue-600" onClick={() => setSelectedProforma(prof)}>
                            {prof.proformaNumber}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-900">{prof.supplierName}</td>
                          <td className="py-3.5 px-4 text-slate-700">{prof.originCountry}</td>
                          <td className="py-3.5 px-4 text-slate-700">{prof.issueDate}</td>
                          <td className="py-3.5 px-4 text-slate-700">{prof.dueDate}</td>
                          <td className="py-3.5 px-4 font-mono text-blue-600">{prof.lcNumber}</td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                            {prof.currency} {prof.amount.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold text-blue-700">{prof.advancePercentage}%</td>
                          <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-800">
                            {prof.currency} {prof.advanceAmount.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              {prof.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => setSelectedProforma(prof)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-500" /> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Proforma Supplier Card View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {proformaList.filter(
                  (p) =>
                    p.proformaNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.originCountry.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((prof) => (
                  <div
                    key={prof.id}
                    className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <div className="font-mono text-xs font-bold text-blue-600">{prof.proformaNumber}</div>
                        <h3 className="text-sm font-bold text-slate-900 cursor-pointer hover:text-blue-600 mt-0.5" onClick={() => setSelectedProforma(prof)}>
                          {prof.supplierName}
                        </h3>
                        <p className="text-xs text-slate-500">{prof.originCountry} • LC: {prof.lcNumber}</p>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                        {prof.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Issue Date:</span>
                        <span className="text-slate-800">{prof.issueDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Due Date:</span>
                        <span className="text-slate-800">{prof.dueDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Advance Terms:</span>
                        <span className="text-blue-700 font-bold">{prof.advancePercentage}% ({prof.currency} {prof.advanceAmount.toLocaleString()})</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-100">
                        <span className="text-slate-500 font-semibold">Total Amount:</span>
                        <span className="text-slate-900 font-black font-mono text-sm">{prof.currency} {prof.amount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">{prof.items.length} items</span>
                      <button
                        onClick={() => setSelectedProforma(prof)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

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
  MoreVertical,
  Printer,
  Sparkles,
  Users,
  FileText,
  MapPin,
  Calendar,
  Building,
  DollarSign,
  Tag,
  CheckCircle2,
  Clock,
  ChevronDown,
} from 'lucide-react';
import {
  MOCK_EXHIBITIONS,
  MOCK_MARKETING_LEADS,
  MOCK_MARKETING_QUOTATIONS,
  ExhibitionItem,
  MarketingLeadItem,
  MarketingQuotationItem,
} from '../../data/erpWorkstreamsData';

interface MarketingModuleScreenProps {
  workstream: 'exhibition' | 'leads' | 'quotation';
  onBack: () => void;
  onShowSnackBar?: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const MarketingModuleScreen: React.FC<MarketingModuleScreenProps> = ({
  workstream,
  onBack,
  onShowSnackBar,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'card'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  // Selected item for View Page
  const [selectedExhibition, setSelectedExhibition] = useState<ExhibitionItem | null>(null);
  const [selectedLead, setSelectedLead] = useState<MarketingLeadItem | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<MarketingQuotationItem | null>(null);

  // ============================================================================
  // 1. VIEW: EXHIBITION DETAIL VIEW
  // ============================================================================
  if (workstream === 'exhibition' && selectedExhibition) {
    const ex = selectedExhibition;
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedExhibition(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back to List
            </button>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">View Exhibition</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {ex.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onShowSnackBar?.(`Exported profile for ${ex.name}`, 'success')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Export Report
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
          {/* Main Info Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 border-r border-slate-100 pr-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Exhibition Details</h3>
              <div className="space-y-1.5 text-xs">
                <div><span className="text-slate-500 font-medium">Exhibition Name:</span> <span className="text-slate-900 font-semibold">{ex.name}</span></div>
                <div><span className="text-slate-500 font-medium">City:</span> <span className="text-slate-800">{ex.city}</span></div>
                <div><span className="text-slate-500 font-medium">Country:</span> <span className="text-slate-800">{ex.country}</span></div>
                <div><span className="text-slate-500 font-medium">Venue:</span> <span className="text-slate-800">{ex.venue}</span></div>
                <div><span className="text-slate-500 font-medium">Booth Number:</span> <span className="text-blue-600 font-semibold">{ex.boothNumber}</span></div>
              </div>
            </div>

            <div className="space-y-2 border-r border-slate-100 pr-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Schedule & Scale</h3>
              <div className="space-y-1.5 text-xs">
                <div><span className="text-slate-500 font-medium">Start Date:</span> <span className="text-slate-900 font-semibold">{ex.startDate}</span></div>
                <div><span className="text-slate-500 font-medium">End Date:</span> <span className="text-slate-800">{ex.endDate}</span></div>
                <div><span className="text-slate-500 font-medium">Stall Area:</span> <span className="text-slate-800">{ex.stallAreaSqm} Sqm</span></div>
                <div><span className="text-slate-500 font-medium">Status:</span> <span className="font-semibold text-emerald-700">{ex.status}</span></div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Financial Overview</h3>
              <div className="space-y-1.5 text-xs">
                <div><span className="text-slate-500 font-medium">Budget Allocated:</span> <span className="text-slate-900 font-semibold">{ex.currency} {ex.budgetAllocated.toLocaleString()}</span></div>
                <div><span className="text-slate-500 font-medium">Actual Spent:</span> <span className="text-slate-800">{ex.currency} {ex.actualSpent.toLocaleString()}</span></div>
                <div><span className="text-slate-500 font-medium">Leads Generated:</span> <span className="text-emerald-700 font-bold">{ex.leadsGenerated} Verified Leads</span></div>
                <div><span className="text-slate-500 font-medium">Potential Order:</span> <span className="text-slate-900 font-semibold">${ex.potentialOrderUSD?.toLocaleString() || '0'}</span></div>
              </div>
            </div>
          </div>

          {/* Key Products Displayed */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Key Products Displayed</h3>
            <div className="flex flex-wrap gap-2">
              {ex.keyProductsDisplayed.map((prod, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium"
                >
                  {prod}
                </span>
              ))}
            </div>
          </div>

          {/* Attending Delegates */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Attending Company Delegates</h3>
            <div className="flex flex-wrap gap-2">
              {ex.delegates.map((delegate, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 text-xs font-medium"
                >
                  {delegate}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. VIEW: MARKETING LEAD DETAIL VIEW
  // ============================================================================
  if (workstream === 'leads' && selectedLead) {
    const lead = selectedLead;
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedLead(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back to List
            </button>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">View Marketing Lead</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              {lead.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onShowSnackBar?.(`Exported lead details for ${lead.contactPerson}`, 'success')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print Lead Profile
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
          {/* Main Info Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 border-r border-slate-100 pr-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Lead Particulars</h3>
              <div className="space-y-1.5 text-xs">
                <div><span className="text-slate-500 font-medium">Lead Code:</span> <span className="text-slate-900 font-semibold">{lead.leadCode}</span></div>
                <div><span className="text-slate-500 font-medium">Contact Person:</span> <span className="text-slate-900 font-semibold">{lead.contactPerson}</span></div>
                <div><span className="text-slate-500 font-medium">Company Name:</span> <span className="text-slate-800">{lead.company}</span></div>
                <div><span className="text-slate-500 font-medium">Country:</span> <span className="text-slate-800">{lead.country}</span></div>
                <div><span className="text-slate-500 font-medium">Email:</span> <span className="text-blue-600 font-medium">{lead.email}</span></div>
                <div><span className="text-slate-500 font-medium">Phone:</span> <span className="text-slate-800">{lead.phone}</span></div>
              </div>
            </div>

            <div className="space-y-2 border-r border-slate-100 pr-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Commercial Requirements</h3>
              <div className="space-y-1.5 text-xs">
                <div><span className="text-slate-500 font-medium">Source Exhibition:</span> <span className="text-slate-900 font-semibold">{lead.source}</span></div>
                <div><span className="text-slate-500 font-medium">Product Interest:</span> <span className="text-slate-800">{lead.productInterest}</span></div>
                <div><span className="text-slate-500 font-medium">Est. Annual Volume:</span> <span className="text-slate-900 font-semibold">{lead.estimatedVolume}</span></div>
                <div><span className="text-slate-500 font-medium">Lead Stage:</span> <span className="font-semibold text-blue-700">{lead.stage}</span></div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Assignment & Date</h3>
              <div className="space-y-1.5 text-xs">
                <div><span className="text-slate-500 font-medium">Assigned Marketer:</span> <span className="text-slate-900 font-semibold">{lead.assignedTo}</span></div>
                <div><span className="text-slate-500 font-medium">Date Added:</span> <span className="text-slate-800">{lead.createdDate}</span></div>
                <div><span className="text-slate-500 font-medium">Status:</span> <span className="font-semibold text-emerald-700">{lead.status}</span></div>
              </div>
            </div>
          </div>

          {/* Notes & Follow-Up Log */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-800">Communication & Negotiation Notes</h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-md border border-slate-200">
              {lead.notes}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 3. VIEW: MARKETING QUOTATION DETAIL VIEW
  // ============================================================================
  if (workstream === 'quotation' && selectedQuote) {
    const q = selectedQuote;
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedQuote(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back to List
            </button>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">View Quotation</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              {q.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onShowSnackBar?.(`Exported quotation ${q.quotationNumber}`, 'success')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print Quotation
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
          {/* Main Info Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 border-r border-slate-100 pr-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quote Details</h3>
              <div className="space-y-1.5 text-xs">
                <div><span className="text-slate-500 font-medium">Quotation Number:</span> <span className="text-slate-900 font-semibold">{q.quotationNumber}</span></div>
                <div><span className="text-slate-500 font-medium">Customer / Lead Name:</span> <span className="text-slate-900 font-semibold">{q.customerName}</span></div>
                <div><span className="text-slate-500 font-medium">Country:</span> <span className="text-slate-800">{q.country}</span></div>
                <div><span className="text-slate-500 font-medium">Destination Port:</span> <span className="text-slate-800">{q.destinationPort}</span></div>
              </div>
            </div>

            <div className="space-y-2 border-r border-slate-100 pr-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Commercial Terms</h3>
              <div className="space-y-1.5 text-xs">
                <div><span className="text-slate-500 font-medium">Issue Date:</span> <span className="text-slate-900 font-semibold">{q.date}</span></div>
                <div><span className="text-slate-500 font-medium">Valid Until:</span> <span className="text-slate-800">{q.validUntil}</span></div>
                <div><span className="text-slate-500 font-medium">Incoterm:</span> <span className="text-slate-800">{q.incoterm}</span></div>
                <div><span className="text-slate-500 font-medium">Payment Terms:</span> <span className="text-slate-800">{q.paymentTerms}</span></div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Value Summary</h3>
              <div className="space-y-1.5 text-xs">
                <div><span className="text-slate-500 font-medium">Subtotal:</span> <span className="text-slate-800">{q.currency} {q.subtotal.toLocaleString()}</span></div>
                <div><span className="text-slate-500 font-medium">Freight Cost:</span> <span className="text-slate-800">{q.currency} {q.freightCost.toLocaleString()}</span></div>
                <div><span className="text-slate-500 font-medium">Total Quotation:</span> <span className="text-slate-900 font-black text-sm">{q.currency} {q.totalAmount.toLocaleString()}</span></div>
                <div><span className="text-slate-500 font-medium">Status:</span> <span className="font-semibold text-blue-700">{q.status}</span></div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800">Quoted Specifications</h3>
              <span className="text-xs text-slate-500 font-semibold">{q.items.length} items</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10.5px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Specifications</th>
                    <th className="py-3 px-4 text-right">Quantity</th>
                    <th className="py-3 px-4">Unit</th>
                    <th className="py-3 px-4 text-right">Rate ({q.currency})</th>
                    <th className="py-3 px-4 text-right">Amount ({q.currency})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {q.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-900">{item.description}</td>
                      <td className="py-3 px-4 text-slate-600">{item.specs}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">{item.quantity.toLocaleString()}</td>
                      <td className="py-3 px-4 text-slate-500">{item.unit}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-800">{item.rate.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">{item.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold border-t border-slate-200 text-slate-900">
                    <td colSpan={5} className="py-3 px-4 text-right">Total Quote Amount:</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-950 font-black">
                      {q.currency} {q.totalAmount.toLocaleString()}
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
  // 4. MAIN SCREEN: GRID VIEW & CARD VIEW (WITH TOGGLE)
  // ============================================================================
  const titles = {
    exhibition: { title: 'Manage Exhibitions', subtitle: 'Global Trade Fairs, Pavilions & Booths' },
    leads: { title: 'Manage Marketing Leads', subtitle: 'Global Textile Buyers & Commercial Leads' },
    quotation: { title: 'Manage Quotations', subtitle: 'Commercial Export Offers & Formal Quotes' },
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
            WORKSTREAM: EXHIBITION
           ========================================================================= */}
        {workstream === 'exhibition' && (
          <>
            {viewMode === 'grid' ? (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 uppercase text-[10.5px] font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Exhibition Name</th>
                        <th className="py-3 px-4">City</th>
                        <th className="py-3 px-4">Country</th>
                        <th className="py-3 px-4">Venue</th>
                        <th className="py-3 px-4">Start Date</th>
                        <th className="py-3 px-4">End Date</th>
                        <th className="py-3 px-4">Booth #</th>
                        <th className="py-3 px-4 text-right">Budget</th>
                        <th className="py-3 px-4 text-right">Spent</th>
                        <th className="py-3 px-4 text-center">Leads</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {MOCK_EXHIBITIONS.filter(
                        (e) =>
                          e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.country.toLowerCase().includes(searchQuery.toLowerCase())
                      ).map((ex) => (
                        <tr key={ex.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900 cursor-pointer hover:text-blue-600" onClick={() => setSelectedExhibition(ex)}>
                            {ex.name}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700">{ex.city}</td>
                          <td className="py-3.5 px-4 text-slate-700">{ex.country}</td>
                          <td className="py-3.5 px-4 text-slate-600">{ex.venue}</td>
                          <td className="py-3.5 px-4 text-slate-700">{ex.startDate}</td>
                          <td className="py-3.5 px-4 text-slate-700">{ex.endDate}</td>
                          <td className="py-3.5 px-4 font-semibold text-blue-600">{ex.boothNumber}</td>
                          <td className="py-3.5 px-4 text-right font-mono text-slate-800">{ex.currency} {ex.budgetAllocated.toLocaleString()}</td>
                          <td className="py-3.5 px-4 text-right font-mono text-slate-800">{ex.currency} {ex.actualSpent.toLocaleString()}</td>
                          <td className="py-3.5 px-4 text-center font-bold text-emerald-700">{ex.leadsGenerated}</td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {ex.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => setSelectedExhibition(ex)}
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
              /* Exhibition Card View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {MOCK_EXHIBITIONS.filter(
                  (e) =>
                    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    e.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    e.country.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((ex) => (
                  <div
                    key={ex.id}
                    className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 cursor-pointer hover:text-blue-600" onClick={() => setSelectedExhibition(ex)}>
                          {ex.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">{ex.city}, {ex.country}</p>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                        {ex.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Venue:</span>
                        <span className="text-slate-800 font-medium truncate max-w-[180px]">{ex.venue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Booth #:</span>
                        <span className="text-blue-600 font-semibold">{ex.boothNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Dates:</span>
                        <span className="text-slate-800 font-medium">{ex.startDate} to {ex.endDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Budget / Spent:</span>
                        <span className="text-slate-800 font-mono">{ex.currency} {ex.budgetAllocated.toLocaleString()} / {ex.actualSpent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Leads Captured:</span>
                        <span className="text-emerald-700 font-bold">{ex.leadsGenerated} leads</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">{ex.stallAreaSqm} Sqm Stall</span>
                      <button
                        onClick={() => setSelectedExhibition(ex)}
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
            WORKSTREAM: LEADS
           ========================================================================= */}
        {workstream === 'leads' && (
          <>
            {viewMode === 'grid' ? (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 uppercase text-[10.5px] font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Lead Code</th>
                        <th className="py-3 px-4">Contact Person</th>
                        <th className="py-3 px-4">Company Name</th>
                        <th className="py-3 px-4">Country</th>
                        <th className="py-3 px-4">Source Exhibition</th>
                        <th className="py-3 px-4">Product Interest</th>
                        <th className="py-3 px-4">Estimated Volume</th>
                        <th className="py-3 px-4">Stage</th>
                        <th className="py-3 px-4">Assigned To</th>
                        <th className="py-3 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {MOCK_MARKETING_LEADS.filter(
                        (l) =>
                          l.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.country.toLowerCase().includes(searchQuery.toLowerCase())
                      ).map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900 cursor-pointer hover:text-blue-600" onClick={() => setSelectedLead(lead)}>
                            {lead.leadCode}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-900">{lead.contactPerson}</td>
                          <td className="py-3.5 px-4 text-slate-700">{lead.company}</td>
                          <td className="py-3.5 px-4 text-slate-700">{lead.country}</td>
                          <td className="py-3.5 px-4 text-slate-600">{lead.source}</td>
                          <td className="py-3.5 px-4 text-slate-800 font-medium truncate max-w-[200px]">{lead.productInterest}</td>
                          <td className="py-3.5 px-4 text-slate-700">{lead.estimatedVolume}</td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              {lead.stage}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-800">{lead.assignedTo}</td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => setSelectedLead(lead)}
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
              /* Leads Card View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {MOCK_MARKETING_LEADS.filter(
                  (l) =>
                    l.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    l.country.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <div className="font-mono text-xs font-bold text-blue-600">{lead.leadCode}</div>
                        <h3 className="text-sm font-bold text-slate-900 cursor-pointer hover:text-blue-600 mt-0.5" onClick={() => setSelectedLead(lead)}>
                          {lead.contactPerson}
                        </h3>
                        <p className="text-xs text-slate-500">{lead.company} ({lead.country})</p>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                        {lead.stage}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Product Interest:</span>
                        <span className="text-slate-800 font-medium truncate max-w-[180px]">{lead.productInterest}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Source:</span>
                        <span className="text-slate-800 font-medium truncate max-w-[180px]">{lead.source}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Est. Volume:</span>
                        <span className="text-slate-900 font-semibold">{lead.estimatedVolume}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Assigned To:</span>
                        <span className="text-slate-800 font-semibold">{lead.assignedTo}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">Added: {lead.createdDate}</span>
                      <button
                        onClick={() => setSelectedLead(lead)}
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
            WORKSTREAM: QUOTATION
           ========================================================================= */}
        {workstream === 'quotation' && (
          <>
            {viewMode === 'grid' ? (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 uppercase text-[10.5px] font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Quotation #</th>
                        <th className="py-3 px-4">Customer Name</th>
                        <th className="py-3 px-4">Country</th>
                        <th className="py-3 px-4">Destination Port</th>
                        <th className="py-3 px-4">Issue Date</th>
                        <th className="py-3 px-4">Valid Until</th>
                        <th className="py-3 px-4 text-right">Total Amount</th>
                        <th className="py-3 px-4">Incoterm</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {MOCK_MARKETING_QUOTATIONS.filter(
                        (q) =>
                          q.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.country.toLowerCase().includes(searchQuery.toLowerCase())
                      ).map((quote) => (
                        <tr key={quote.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900 cursor-pointer hover:text-blue-600" onClick={() => setSelectedQuote(quote)}>
                            {quote.quotationNumber}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-900">{quote.customerName}</td>
                          <td className="py-3.5 px-4 text-slate-700">{quote.country}</td>
                          <td className="py-3.5 px-4 text-slate-600">{quote.destinationPort}</td>
                          <td className="py-3.5 px-4 text-slate-700">{quote.date}</td>
                          <td className="py-3.5 px-4 text-slate-700">{quote.validUntil}</td>
                          <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900">
                            {quote.currency} {quote.totalAmount.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 font-medium">{quote.incoterm}</td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              {quote.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => setSelectedQuote(quote)}
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
              /* Quotation Card View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {MOCK_MARKETING_QUOTATIONS.filter(
                  (q) =>
                    q.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    q.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    q.country.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((quote) => (
                  <div
                    key={quote.id}
                    className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                      <div>
                        <div className="font-mono text-xs font-bold text-blue-600">{quote.quotationNumber}</div>
                        <h3 className="text-sm font-bold text-slate-900 cursor-pointer hover:text-blue-600 mt-0.5" onClick={() => setSelectedQuote(quote)}>
                          {quote.customerName}
                        </h3>
                        <p className="text-xs text-slate-500">{quote.country}</p>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                        {quote.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Port of Discharge:</span>
                        <span className="text-slate-800 font-medium truncate max-w-[180px]">{quote.destinationPort}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Incoterm:</span>
                        <span className="text-slate-800 font-semibold">{quote.incoterm}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Issue Date:</span>
                        <span className="text-slate-800">{quote.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Valid Until:</span>
                        <span className="text-slate-800">{quote.validUntil}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-100">
                        <span className="text-slate-500 font-semibold">Total Quote Value:</span>
                        <span className="text-slate-900 font-black font-mono text-sm">{quote.currency} {quote.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">{quote.items.length} items included</span>
                      <button
                        onClick={() => setSelectedQuote(quote)}
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

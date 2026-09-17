/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  X,
} from 'lucide-react';
import {
  MOCK_PURCHASE_REQUISITIONS,
  MOCK_PURCHASE_ORDERS,
  MOCK_PURCHASE_INVOICES,
  PurchaseRequisitionItem,
  PurchaseOrderItem,
  PurchaseInvoiceItem,
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

interface PurchaseModuleScreenProps {
  workstream: 'requisition' | 'order' | 'invoice';
  onBack: () => void;
  onShowSnackBar?: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

type PurchaseFilterState = {
  customer: string;
  supplier: string;
  company: string;
  product: string;
  status: string;
};

const EMPTY_FILTERS: PurchaseFilterState = {
  customer: 'All',
  supplier: 'All',
  company: 'All',
  product: 'All',
  status: 'All',
};

const FILTER_FIELDS = [
  ['customer', 'Customer'],
  ['supplier', 'Supplier'],
  ['company', 'Company'],
  ['product', 'Product'],
  ['status', 'Status'],
] as const;

function uniqOptions(values: string[]) {
  return ['All', ...Array.from(new Set(values.filter((v) => v && v !== '-'))).sort()];
}

function prCustomer(r: PurchaseRequisitionItem): string {
  const parts = r.proformaCode.split('>').map((s) => s.trim());
  if (parts.length >= 3) return `${parts[1]} - ${parts[2]}`;
  if (parts.length === 2) return parts[1];
  return '';
}

function prProducts(r: PurchaseRequisitionItem): string[] {
  const fromProducts = (r.products || []).map((p) => p.productName);
  const fromMap = (r.containerMapping?.items || []).map((i) => i.productName);
  return [...fromProducts, ...fromMap];
}

function poProducts(o: PurchaseOrderItem): string[] {
  return (o.products || []).map((p) => p.productName);
}

export const PurchaseModuleScreen: React.FC<PurchaseModuleScreenProps> = ({
  workstream,
  onBack,
  onShowSnackBar,
}) => {
  const [viewMode, setViewMode] = useState<ListViewMode>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [containerMappingOpen, setContainerMappingOpen] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [draftFilters, setDraftFilters] = useState<PurchaseFilterState>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<PurchaseFilterState>(EMPTY_FILTERS);
  const filterRef = useRef<HTMLDivElement>(null);

  // Selected item for View Page
  const [selectedPR, setSelectedPR] = useState<PurchaseRequisitionItem | null>(null);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrderItem | null>(null);
  const [selectedPINV, setSelectedPINV] = useState<PurchaseInvoiceItem | null>(null);

  const q = searchQuery.toLowerCase();

  const prFilterOptions = useMemo(() => {
    const customers = MOCK_PURCHASE_REQUISITIONS.map(prCustomer);
    const suppliers = MOCK_PURCHASE_REQUISITIONS.map((r) => r.supplier);
    const companies = MOCK_PURCHASE_REQUISITIONS.map((r) => r.company);
    const products = MOCK_PURCHASE_REQUISITIONS.flatMap(prProducts);
    const statuses = MOCK_PURCHASE_REQUISITIONS.map((r) => r.status);
    return {
      customer: uniqOptions(customers),
      supplier: uniqOptions(suppliers),
      company: uniqOptions(companies),
      product: uniqOptions(products),
      status: uniqOptions(statuses),
    };
  }, []);

  const poFilterOptions = useMemo(() => {
    return {
      customer: uniqOptions(MOCK_PURCHASE_ORDERS.map((o) => o.customer)),
      supplier: uniqOptions(MOCK_PURCHASE_ORDERS.map((o) => o.supplier)),
      company: uniqOptions(MOCK_PURCHASE_ORDERS.map((o) => o.company)),
      product: uniqOptions(MOCK_PURCHASE_ORDERS.flatMap(poProducts)),
      status: uniqOptions(MOCK_PURCHASE_ORDERS.map((o) => o.status)),
    };
  }, []);

  const pinvFilterOptions = useMemo(() => {
    return {
      customer: uniqOptions(MOCK_PURCHASE_INVOICES.map((i) => i.customer)),
      supplier: uniqOptions(MOCK_PURCHASE_INVOICES.map((i) => i.supplier)),
      company: uniqOptions(MOCK_PURCHASE_INVOICES.map((i) => i.companyName)),
      product: uniqOptions(
        MOCK_PURCHASE_INVOICES.flatMap((i) => (i.products || []).map((p) => p.productName))
      ),
      status: uniqOptions(MOCK_PURCHASE_INVOICES.map((i) => i.status)),
    };
  }, []);

  const filterOptions =
    workstream === 'order'
      ? poFilterOptions
      : workstream === 'invoice'
      ? pinvFilterOptions
      : prFilterOptions;

  const filteredPRs = useMemo(
    () =>
      MOCK_PURCHASE_REQUISITIONS.filter((r) => {
        const matchesSearch =
          !q ||
          r.requisitionCode.toLowerCase().includes(q) ||
          r.supplier.toLowerCase().includes(q) ||
          r.marketingPersonal.toLowerCase().includes(q) ||
          r.company.toLowerCase().includes(q) ||
          r.proformaCode.toLowerCase().includes(q);

        const customer = prCustomer(r);
        const products = prProducts(r);
        const matchesFilters =
          (appliedFilters.customer === 'All' || customer === appliedFilters.customer) &&
          (appliedFilters.supplier === 'All' || r.supplier === appliedFilters.supplier) &&
          (appliedFilters.company === 'All' || r.company === appliedFilters.company) &&
          (appliedFilters.product === 'All' || products.includes(appliedFilters.product)) &&
          (appliedFilters.status === 'All' || r.status === appliedFilters.status);

        return matchesSearch && matchesFilters;
      }),
    [q, appliedFilters]
  );

  const filteredPOs = useMemo(
    () =>
      MOCK_PURCHASE_ORDERS.filter((o) => {
        const matchesSearch =
          !q ||
          o.code.toLowerCase().includes(q) ||
          o.supplier.toLowerCase().includes(q) ||
          o.marketingPersonal.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.company.toLowerCase().includes(q);

        const products = poProducts(o);
        const matchesFilters =
          (appliedFilters.customer === 'All' || o.customer === appliedFilters.customer) &&
          (appliedFilters.supplier === 'All' || o.supplier === appliedFilters.supplier) &&
          (appliedFilters.company === 'All' || o.company === appliedFilters.company) &&
          (appliedFilters.product === 'All' || products.includes(appliedFilters.product)) &&
          (appliedFilters.status === 'All' || o.status === appliedFilters.status);

        return matchesSearch && matchesFilters;
      }),
    [q, appliedFilters]
  );

  const filteredPINVs = useMemo(
    () =>
      MOCK_PURCHASE_INVOICES.filter((i) => {
        const matchesSearch =
          !q ||
          i.code.toLowerCase().includes(q) ||
          i.supplier.toLowerCase().includes(q) ||
          i.customer.toLowerCase().includes(q) ||
          i.companyName.toLowerCase().includes(q) ||
          i.ciNumber.toLowerCase().includes(q);

        const products = (i.products || []).map((p) => p.productName);
        const matchesFilters =
          (appliedFilters.customer === 'All' || i.customer === appliedFilters.customer) &&
          (appliedFilters.supplier === 'All' || i.supplier === appliedFilters.supplier) &&
          (appliedFilters.company === 'All' || i.companyName === appliedFilters.company) &&
          (appliedFilters.product === 'All' || products.includes(appliedFilters.product)) &&
          (appliedFilters.status === 'All' || i.status === appliedFilters.status);

        return matchesSearch && matchesFilters;
      }),
    [q, appliedFilters]
  );

  const prPaging = usePagedList(filteredPRs);
  const poPaging = usePagedList(filteredPOs);
  const pinvPaging = usePagedList(filteredPINVs);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    prPaging.resetPage();
    poPaging.resetPage();
    pinvPaging.resetPage();
  };

  const activeFilterCount = useMemo(
    () => FILTER_FIELDS.filter(([key]) => appliedFilters[key] !== 'All').length,
    [appliedFilters]
  );

  useEffect(() => {
    setDraftFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setShowFilters(false);
    prPaging.resetPage();
    poPaging.resetPage();
    pinvPaging.resetPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workstream]);

  useEffect(() => {
    prPaging.resetPage();
    poPaging.resetPage();
    pinvPaging.resetPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (showFilters && filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [showFilters]);

  const openFilterPanel = () => {
    setDraftFilters(appliedFilters);
    setShowFilters((v) => !v);
  };

  const applyFilters = () => {
    setAppliedFilters({ ...draftFilters });
    setShowFilters(false);
    onShowSnackBar?.('Filters applied', 'success');
  };

  const clearFilters = () => {
    setDraftFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setShowFilters(false);
    onShowSnackBar?.('Filters cleared', 'info');
  };

  const removeFilter = (key: keyof PurchaseFilterState) => {
    const next = { ...appliedFilters, [key]: 'All' };
    setAppliedFilters(next);
    setDraftFilters(next);
  };

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
      <MobilePage>
        <MobileHeader
          title="View Requisition"
          subtitle={pr.requisitionCode}
          status={pr.status}
          onBack={() => setSelectedPR(null)}
          actions={
            <HeaderIconBtn
              label="Print"
              icon="print"
              onClick={() => { window.print(); onShowSnackBar?.(`Preparing ${pr.requisitionCode} for printing...`, 'info'); }}
            />
          }
        />
        <MobileContent>

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
                        <thead className="bg-slate-50 text-slate-600 uppercase text-body-sm font-semibold border-y border-slate-200">
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
            <div className="p-4 sm:px-6 sm:py-3 space-y-2.5">
              {prods.map((prod, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs">
                  <div className="flex items-start gap-3">
                    <img
                      src={prod.thumbnail}
                      alt={prod.productName}
                      className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-body-sm font-extrabold text-[#0f2b3c] leading-snug break-words">
                        {prod.productName}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap mt-1.5">
                        <span className="inline-flex px-2 py-0.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-label font-bold">
                          {prod.variations}
                        </span>
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-lg text-label font-bold border ${
                            prod.artworkNeeded === 'Yes'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          Artwork {prod.artworkNeeded}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div>
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Qty</p>
                          <p className="text-body-sm font-bold text-slate-900 font-mono">{prod.quantity}</p>
                        </div>
                        <div>
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Shelf Life</p>
                          <p className="text-body-sm font-semibold text-slate-700">{prod.shelfLifeDuration}</p>
                        </div>
                        <div>
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">CBM</p>
                          <p className="text-body-sm font-semibold text-slate-700 tabular-nums">{prod.cbm}</p>
                        </div>
                        <div>
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Weight</p>
                          <p className="text-body-sm font-semibold text-slate-700 tabular-nums">{prod.weight}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Supplier Price</p>
                          <p className="text-body-sm font-bold text-slate-900 font-mono">{prod.supplierPrice}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Supplier Remarks</p>
                          <p className="text-body-sm font-medium text-slate-600 break-words">{prod.supplierRemarks || '-'}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Notes</p>
                          <p className="text-body-sm font-medium text-slate-600 break-words">{prod.notes || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-label font-bold uppercase tracking-wider text-slate-500">Total Qty</span>
                  <span className="text-body font-black font-mono text-slate-900">2,075</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <p className="text-caption font-bold uppercase tracking-wider text-slate-400">CBM</p>
                    <p className="text-body-sm font-bold font-mono text-slate-900">47.31</p>
                  </div>
                  <div>
                    <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Weight</p>
                    <p className="text-body-sm font-bold font-mono text-slate-900">7,760.5 KG</p>
                  </div>
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
                  className="px-3 py-1 rounded-full text-body-sm font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
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
        </MobileContent>
      </MobilePage>
    );
  }
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
      <MobilePage>
        <MobileHeader
          title="View Purchase Order"
          subtitle={po.code}
          status={po.status}
          onBack={() => setSelectedPO(null)}
          actions={
            <HeaderIconBtn
              label="Print"
              icon="print"
              onClick={() => { window.print(); onShowSnackBar?.(`Preparing ${po.code} for printing...`, 'info'); }}
            />
          }
        />
        <MobileContent>

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
            <div className="p-4 sm:px-6 sm:py-3 space-y-2.5">
              {prods.map((prod, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs">
                  <div className="flex items-start gap-3">
                    <img
                      src={prod.thumbnail}
                      alt={prod.productName}
                      className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-body-sm font-extrabold text-[#0f2b3c] leading-snug break-words">
                        {prod.productName}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap mt-1.5">
                        <span className="inline-flex px-2 py-0.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-label font-bold">
                          {prod.variations}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div>
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Qty</p>
                          <p className="text-body-sm font-bold text-slate-900 font-mono">{prod.quantity}</p>
                        </div>
                        <div>
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">PO Price</p>
                          <p className="text-body-sm font-semibold text-slate-900 font-mono">{prod.poPrice}</p>
                        </div>
                        <div>
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Total</p>
                          <p className="text-body-sm font-black text-slate-900 font-mono tabular-nums">{prod.total}</p>
                        </div>
                        <div>
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Shelf Life</p>
                          <p className="text-body-sm font-semibold text-slate-700">{prod.shelfLifeDuration}</p>
                        </div>
                        <div>
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">CBM</p>
                          <p className="text-body-sm font-semibold text-slate-700 tabular-nums">{prod.cbm}</p>
                        </div>
                        <div>
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Weight</p>
                          <p className="text-body-sm font-semibold text-slate-700 tabular-nums">{prod.weight}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Notes</p>
                          <p className="text-body-sm font-medium text-slate-600 break-words">{prod.notes || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-label font-bold uppercase tracking-wider text-slate-500">Total Qty</span>
                  <span className="text-body font-black font-mono text-slate-900">2,075</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Total Amount</p>
                    <p className="text-body-sm font-black font-mono text-slate-900">$ 18,156.2500</p>
                  </div>
                  <div>
                    <p className="text-caption font-bold uppercase tracking-wider text-slate-400">CBM</p>
                    <p className="text-body-sm font-semibold font-mono text-slate-700">47.31</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Weight</p>
                    <p className="text-body-sm font-semibold font-mono text-slate-700">7,760.5 KG</p>
                  </div>
                </div>
              </div>
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
                  className="px-3 py-1 rounded-full text-body-sm font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
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
        </MobileContent>
      </MobilePage>
    );
  }
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
      <MobilePage>
        <MobileHeader
          title="View Purchase Invoice"
          subtitle={pinv.code}
          status={pinv.status}
          onBack={() => setSelectedPINV(null)}
          actions={
            <HeaderIconBtn
              label="Print"
              icon="print"
              onClick={() => { window.print(); onShowSnackBar?.(`Preparing ${pinv.code} for printing...`, 'info'); }}
            />
          }
        />
        <MobileContent>

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
            <div className="p-4 sm:px-6 sm:py-3 space-y-2.5">
              {prods.map((prod, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs">
                  <div className="flex items-start gap-3">
                    <img
                      src={prod.thumbnail}
                      alt={prod.productName}
                      className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-body-sm font-extrabold text-[#0f2b3c] leading-snug break-words">
                        {prod.productName}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap mt-1.5">
                        <span className="inline-flex px-2 py-0.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-label font-bold">
                          {prod.variation}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div>
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Qty</p>
                          <p className="text-body-sm font-bold text-slate-900 font-mono">{prod.quantity}</p>
                        </div>
                        <div>
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Total</p>
                          <p className="text-body-sm font-black text-slate-900 font-mono tabular-nums">{prod.total}</p>
                        </div>
                        <div>
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Price</p>
                          <p className="text-body-sm font-semibold text-slate-900 font-mono">{prod.price}</p>
                        </div>
                        <div>
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">CBM</p>
                          <p className="text-body-sm font-semibold text-slate-700 tabular-nums">{prod.cbm}</p>
                        </div>
                        <div>
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Weight</p>
                          <p className="text-body-sm font-semibold text-slate-700 tabular-nums">{prod.weight}</p>
                        </div>
                        <div>
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Batch</p>
                          <p className="text-body-sm font-medium text-slate-700">{prod.batchNo}</p>
                        </div>
                        <div>
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">MFG</p>
                          <p className="text-body-sm font-semibold text-slate-700">{prod.mfgDate}</p>
                        </div>
                        <div>
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Expiry</p>
                          <p className="text-body-sm font-semibold text-slate-700">{prod.expiryDate}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Notes</p>
                          <p className="text-body-sm font-medium text-slate-600 break-words">{prod.notes || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-label font-bold uppercase tracking-wider text-slate-500">Total Qty</p>
                    <p className="text-body font-black font-mono text-slate-900">2,080</p>
                  </div>
                  <div className="text-right">
                    <p className="text-label font-bold uppercase tracking-wider text-slate-500">Total Amount</p>
                    <p className="text-body font-black font-mono text-slate-900">$ 25,584.0000</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <p className="text-caption font-bold uppercase tracking-wider text-slate-400">CBM</p>
                    <p className="text-body-sm font-semibold font-mono text-slate-700">67.2880</p>
                  </div>
                  <div>
                    <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Weight</p>
                    <p className="text-body-sm font-semibold font-mono text-slate-700">9,672.0000 KG</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800">Transaction Details</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-body-sm font-semibold border-b border-slate-200">
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
        </MobileContent>
      </MobilePage>
    );
  }
  // ============================================================================
  const paging =
    workstream === 'requisition' ? prPaging : workstream === 'order' ? poPaging : pinvPaging;

  return (
    <MobilePage>
      <MobileHeader
        title={
          workstream === 'requisition'
            ? 'Manage Requisitions'
            : workstream === 'order'
            ? 'Manage Purchase Orders'
            : 'Manage Purchase Invoices'
        }
        onBack={onBack}
      />

      <MobileContent>
        <div className="relative z-20" ref={filterRef}>
          <SoftCard>
            <ListToolbar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              searchPlaceholder={
                workstream === 'requisition'
                  ? 'Search requisitions…'
                  : workstream === 'order'
                  ? 'Search purchase orders…'
                  : 'Search purchase invoices…'
              }
              onFilterClick={openFilterPanel}
              onColumnsClick={() => onShowSnackBar?.('Column selection opened', 'info')}
              trailing={
                activeFilterCount > 0 ? (
                  <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-teal-600 text-white text-[10px] font-bold">
                    {activeFilterCount}
                  </span>
                ) : undefined
              }
            />
          </SoftCard>

          {showFilters && (
            <div className="mt-2 rounded-2xl border border-slate-200 bg-white shadow-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-900">Filters</p>
                <button
                  type="button"
                  onClick={() => setShowFilters(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FILTER_FIELDS.map(([key, label]) => (
                  <div
                    key={key}
                    className={`space-y-1 ${key === 'product' ? 'sm:col-span-2' : ''}`}
                  >
                    <label className="text-xs font-bold text-slate-700">{label}</label>
                    <select
                      value={draftFilters[key]}
                      onChange={(e) =>
                        setDraftFilters((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white outline-hidden focus:ring-2 focus:ring-[#0f2b3c]/30 cursor-pointer"
                    >
                      {filterOptions[key].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt.length > 80 ? `${opt.slice(0, 80)}…` : opt}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 cursor-pointer"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={applyFilters}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#0f2b3c] hover:bg-[#1a3d52] cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {FILTER_FIELDS.filter(([key]) => appliedFilters[key] !== 'All').map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => removeFilter(key)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer max-w-full"
                >
                  <span className="truncate">
                    {label}:{' '}
                    {appliedFilters[key].length > 40
                      ? `${appliedFilters[key].slice(0, 40)}…`
                      : appliedFilters[key]}
                  </span>
                  <X className="w-3 h-3 text-slate-400 shrink-0" />
                </button>
              ))}
              <button
                type="button"
                onClick={clearFilters}
                className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* ---- Requisition ---- */}
        {workstream === 'requisition' &&
          (viewMode === 'grid' ? (
            <DataTable
              headers={[
                'Requisition Code',
                'Supplier',
                'Company',
                'Payment Profile',
                'Status',
                'Proforma Status',
                'Created',
                'Actions',
              ]}
            >
              {prPaging.paged.map((item) => (
                <DataRow key={item.id} onClick={() => setSelectedPR(item)}>
                  <Td accent mono>
                    {item.requisitionCode}
                  </Td>
                  <Td className="max-w-[180px] truncate">{item.supplier}</Td>
                  <Td className="max-w-[160px] truncate">{item.company}</Td>
                  <Td>{item.paymentProfile}</Td>
                  <Td>
                    <StatusPill status={item.status} />
                  </Td>
                  <Td>
                    <StatusPill status={item.proformaStatus} />
                  </Td>
                  <Td className="whitespace-nowrap">{item.created}</Td>
                  <Td>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPR(item);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-body-sm font-semibold cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-teal-600" /> View
                    </button>
                  </Td>
                </DataRow>
              ))}
            </DataTable>
          ) : (
            <CardGrid>
              {prPaging.paged.map((item) => (
                <RecordCard
                  key={item.id}
                  code={item.requisitionCode}
                  title={item.supplier}
                  subtitle={item.company}
                  status={item.status}
                  badges={<StatusPill status={item.proformaStatus} />}
                  fields={[
                    { label: 'Payment Profile', value: item.paymentProfile },
                    { label: 'Marketing', value: item.marketingPersonal },
                    { label: 'Proforma', value: item.proformaCode },
                    { label: 'Created', value: item.created },
                  ]}
                  onClick={() => setSelectedPR(item)}
                  actions={[
                    { label: 'View', icon: 'view', onClick: () => setSelectedPR(item) },
                  ]}
                />
              ))}
            </CardGrid>
          ))}

        {/* ---- Purchase Order ---- */}
        {workstream === 'order' &&
          (viewMode === 'grid' ? (
            <DataTable
              headers={[
                'Code',
                'Supplier',
                'Customer',
                'Company',
                'Status',
                'Proforma Status',
                'Created',
                'Actions',
              ]}
            >
              {poPaging.paged.map((item) => (
                <DataRow key={item.id} onClick={() => setSelectedPO(item)}>
                  <Td accent mono>
                    {item.code}
                  </Td>
                  <Td className="max-w-[160px] truncate">{item.supplier}</Td>
                  <Td className="max-w-[140px] truncate">{item.customer}</Td>
                  <Td className="max-w-[140px] truncate">{item.company}</Td>
                  <Td>
                    <StatusPill status={item.status} />
                  </Td>
                  <Td>
                    <StatusPill status={item.proformaStatus} />
                  </Td>
                  <Td className="whitespace-nowrap">{item.created}</Td>
                  <Td>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPO(item);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-body-sm font-semibold cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-teal-600" /> View
                    </button>
                  </Td>
                </DataRow>
              ))}
            </DataTable>
          ) : (
            <CardGrid>
              {poPaging.paged.map((item) => (
                <RecordCard
                  key={item.id}
                  code={item.code}
                  title={item.supplier}
                  subtitle={item.customer}
                  status={item.status}
                  badges={<StatusPill status={item.proformaStatus} />}
                  fields={[
                    { label: 'Company', value: item.company },
                    { label: 'Marketing', value: item.marketingPersonal },
                    { label: 'Requisition', value: item.requisitionCode },
                    { label: 'Created', value: item.created },
                  ]}
                  onClick={() => setSelectedPO(item)}
                  actions={[
                    { label: 'View', icon: 'view', onClick: () => setSelectedPO(item) },
                  ]}
                />
              ))}
            </CardGrid>
          ))}

        {/* ---- Purchase Invoice ---- */}
        {workstream === 'invoice' &&
          (viewMode === 'grid' ? (
            <DataTable
              headers={[
                'Code',
                'Customer',
                'Supplier',
                'Company',
                'CI Number',
                'Amount',
                'Status',
                'Actions',
              ]}
            >
              {pinvPaging.paged.map((item) => (
                <DataRow key={item.id} onClick={() => setSelectedPINV(item)}>
                  <Td accent mono>
                    {item.code}
                  </Td>
                  <Td className="max-w-[160px] truncate">{item.customer}</Td>
                  <Td className="max-w-[160px] truncate">{item.supplier}</Td>
                  <Td className="max-w-[140px] truncate">{item.companyName}</Td>
                  <Td>{item.ciNumber}</Td>
                  <Td className="font-bold">{item.amount}</Td>
                  <Td>
                    <StatusPill status={item.status} />
                  </Td>
                  <Td>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPINV(item);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-body-sm font-semibold cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-teal-600" /> View
                    </button>
                  </Td>
                </DataRow>
              ))}
            </DataTable>
          ) : (
            <CardGrid>
              {pinvPaging.paged.map((item) => (
                <RecordCard
                  key={item.id}
                  code={item.code}
                  title={item.customer}
                  subtitle={item.supplier}
                  status={item.status}
                  fields={[
                    { label: 'Amount', value: item.amount },
                    { label: 'CI Number', value: item.ciNumber },
                    { label: 'Company', value: item.companyName },
                    { label: 'PO Code', value: item.purchaseOrderCode },
                  ]}
                  onClick={() => setSelectedPINV(item)}
                  actions={[
                    { label: 'View', icon: 'view', onClick: () => setSelectedPINV(item) },
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

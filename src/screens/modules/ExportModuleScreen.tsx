/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Eye,
  MoreVertical,
  RefreshCw,
  Ticket,
  FilePlus2,
  X,
  Ship,
  MapPin,
  Package,
} from 'lucide-react';
import {
  MOCK_CONTAINER_TRACKING,
  ContainerTrackingItem,
} from '../../data/erpWorkstreamsData';
import {
  ListToolbar,
  ListPagination,
  usePagedList,
  ListViewMode,
} from '../../components/common/DataListShell';
import {
  MobilePage,
  MobileHeader,
  SoftCard,
  MobileContent,
} from '../../components/common/MobileLayout';
import { TrackingTimelineModal } from '../../components/common/TrackingTimelineModal';

interface ExportModuleScreenProps {
  onBack: () => void;
  onShowSnackBar?: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

type FilterState = {
  marketer: string;
  customer: string;
  portOfDischarge: string;
  company: string;
  placeOfDelivery: string;
};

const EMPTY_FILTERS: FilterState = {
  marketer: 'All',
  customer: 'All',
  portOfDischarge: 'All',
  company: 'All',
  placeOfDelivery: 'All',
};

const FILTER_FIELDS = [
  ['marketer', 'Marketing Personal'],
  ['customer', 'Customer'],
  ['portOfDischarge', 'Port Of Discharge'],
  ['company', 'Company'],
  ['placeOfDelivery', 'Place of Delivery'],
] as const;

function LinkText({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-blue-600 font-semibold hover:underline text-left cursor-pointer"
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const delivered = status === 'DELIVERED';
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide ${
        delivered ? 'bg-slate-900 text-white' : 'bg-slate-700 text-white'
      }`}
    >
      {status}
    </span>
  );
}

function ShipmentDot({ status }: { status: string }) {
  const danger = /gate-?out|alert|delay/i.test(status);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full shrink-0 ${danger ? 'bg-rose-500' : 'bg-emerald-500'}`} />
      <span className="font-semibold text-slate-800">{status}</span>
    </span>
  );
}

function ActionsMenu({
  item,
  open,
  onToggle,
  onAction,
}: {
  item: ContainerTrackingItem;
  open: boolean;
  onToggle: () => void;
  onAction: (label: string, item: ContainerTrackingItem, disabled?: boolean) => void;
}) {
  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
      >
        Actions
        <MoreVertical className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 bottom-full mb-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-40 py-1 text-left text-xs overflow-hidden">
          <button
            type="button"
            onClick={() => onAction('View Container Tracking', item)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-slate-50 text-slate-800 font-semibold cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" /> View Container Tracking
          </button>
          <button
            type="button"
            onClick={() => onAction('Update Status', item)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-slate-50 text-slate-800 font-semibold cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" /> Update Status
          </button>
          <button
            type="button"
            onClick={() => onAction('Open Ticket', item)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 hover:bg-slate-50 text-slate-800 font-semibold cursor-pointer"
          >
            <Ticket className="w-3.5 h-3.5 text-slate-500" /> Open Ticket
          </button>
          <button
            type="button"
            onClick={() => onAction('Add Customer Payment', item, true)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-slate-400 font-semibold cursor-not-allowed"
          >
            <FilePlus2 className="w-3.5 h-3.5" /> Add Customer Payment
          </button>
        </div>
      )}
    </div>
  );
}

function TrackingBlock({ item }: { item: ContainerTrackingItem }) {
  if (item.trackingError) {
    return (
      <p className="text-rose-600 font-semibold leading-snug text-[11px]">
        Error Msg: {item.trackingError}
      </p>
    );
  }
  return (
    <div className="space-y-0.5 text-[11px] leading-relaxed">
      <p>
        <span className="text-slate-500">BL:</span>{' '}
        <span className="font-mono font-bold text-slate-900">{item.blNumber}</span>
      </p>
      <p>
        <span className="text-slate-500">Sealine:</span>{' '}
        <span className="font-semibold text-slate-800">{item.sealineCode}</span>
      </p>
      <p>
        <span className="text-slate-500">Name:</span>{' '}
        <span className="text-slate-700">{item.sealineName}</span>
      </p>
      <p className="flex items-center gap-1.5 flex-wrap pt-0.5">
        <span className="text-slate-500">Status:</span>
        <StatusBadge status={item.trackingApiStatus} />
      </p>
    </div>
  );
}

function ContainerCard({
  item,
  openActionId,
  setOpenActionId,
  onView,
  onAction,
  onSnack,
}: {
  item: ContainerTrackingItem;
  openActionId: string | null;
  setOpenActionId: (id: string | null) => void;
  onView: (item: ContainerTrackingItem) => void;
  onAction: (label: string, item: ContainerTrackingItem, disabled?: boolean) => void;
  onSnack?: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}) {
  return (
    <article className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden flex flex-col">
      {/* accent bar */}
      <div
        className={`h-1 w-full ${
          item.trackingError
            ? 'bg-rose-500'
            : item.trackingApiStatus === 'DELIVERED'
            ? 'bg-emerald-500'
            : 'bg-[#0f2b3c]'
        }`}
      />

      <div className="p-4 flex flex-col gap-3.5 flex-1">
        {/* header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <LinkText onClick={() => onView(item)}>
              <span className="text-base font-extrabold tracking-tight">{item.proformaCode}</span>
            </LinkText>
            <p className="text-xs text-slate-600">
              Marketer:{' '}
              <LinkText onClick={() => onSnack?.(item.marketer, 'info')}>{item.marketer}</LinkText>
            </p>
            <p className="text-xs text-slate-600">Delivery: {item.deliveryDate}</p>
            <p className="text-xs text-slate-600">Container: {item.containerCount}</p>
          </div>
          <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
            {item.trackingType}
          </span>
        </div>

        {/* tracking inset */}
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-3">
          <div className="flex items-center gap-1.5 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <Ship className="w-3 h-3" /> Tracking
          </div>
          <TrackingBlock item={item} />
        </div>

        {/* meta grid */}
        <div className="grid grid-cols-1 gap-3 text-xs">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Customer</p>
            <LinkText onClick={() => onSnack?.(item.customer, 'info')}>{item.customer}</LinkText>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Company</p>
            <p className="font-semibold text-slate-800 leading-snug">{item.company}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Location
              </p>
              <p className="text-slate-700">From: {item.fromLocation}</p>
              <p className="text-slate-700">To: {item.toLocation}</p>
              <p className="text-slate-700">ATD: {item.atd}</p>
              <p className="text-slate-700">ETA: {item.eta}</p>
              {item.ata && <p className="text-slate-700">ATA: {item.ata}</p>}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Active Event</p>
              <p className="text-slate-700">Description: {item.activeEventDescription}</p>
              <p className="text-slate-700">Location: {item.activeEventLocation}</p>
              <p className="text-slate-700">Date: {item.activeEventDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Port</p>
              <p>
                Place of Delivery:{' '}
                <LinkText onClick={() => onSnack?.(item.placeOfDelivery, 'info')}>
                  {item.placeOfDelivery}
                </LinkText>
              </p>
              <p>
                Port of Discharge:{' '}
                <LinkText onClick={() => onSnack?.(item.portOfDischarge, 'info')}>
                  {item.portOfDischarge}
                </LinkText>
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5 flex items-center gap-1">
                <Package className="w-3 h-3" /> Shipment Info
              </p>
              <p>
                Inquiry: <LinkText>{item.inquiryCode}</LinkText>
              </p>
              <p>
                Shipment: <LinkText>{item.shipmentCode}</LinkText>
              </p>
              <p className="mt-0.5">
                <ShipmentDot status={item.shipmentStatus} />
              </p>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
          <div className="text-xs text-slate-600 space-y-0.5 min-w-0">
            <p>
              Tracking Status:{' '}
              <span className="font-semibold text-slate-800">{item.trackingStatus}</span>
            </p>
            <p>
              Notes:{' '}
              <LinkText onClick={() => onSnack?.(`Add note · ${item.proformaCode}`, 'info')}>
                Add
              </LinkText>
              {' · '}
              <LinkText onClick={() => onSnack?.(`Logs · ${item.proformaCode}`, 'info')}>
                Logs
              </LinkText>
            </p>
            <p className="text-[11px] text-slate-400">{item.trackingCreated}</p>
          </div>
          <ActionsMenu
            item={item}
            open={openActionId === item.id}
            onToggle={() => setOpenActionId(openActionId === item.id ? null : item.id)}
            onAction={onAction}
          />
        </div>
      </div>
    </article>
  );
}

export const ExportModuleScreen: React.FC<ExportModuleScreenProps> = ({
  onBack,
  onShowSnackBar,
}) => {
  const [viewMode, setViewMode] = useState<ListViewMode>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [containerList] = useState<ContainerTrackingItem[]>(MOCK_CONTAINER_TRACKING);
  const [selectedContainer, setSelectedContainer] = useState<ContainerTrackingItem | null>(null);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [draftFilters, setDraftFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(EMPTY_FILTERS);
  const filterRef = useRef<HTMLDivElement>(null);

  const filterOptions = useMemo(() => {
    const uniq = (values: string[]) => ['All', ...Array.from(new Set(values.filter(Boolean))).sort()];
    return {
      marketer: uniq(containerList.map((c) => c.marketer)),
      customer: uniq(containerList.map((c) => c.customer)),
      portOfDischarge: uniq(containerList.map((c) => c.portOfDischarge)),
      company: uniq(containerList.map((c) => c.company)),
      placeOfDelivery: uniq(containerList.map((c) => c.placeOfDelivery)),
    };
  }, [containerList]);

  const activeFilterCount = useMemo(
    () => FILTER_FIELDS.filter(([key]) => appliedFilters[key] !== 'All').length,
    [appliedFilters]
  );

  const filteredContainers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return containerList.filter((c) => {
      const matchesSearch =
        !q ||
        [
          c.proformaCode,
          c.marketer,
          c.blNumber,
          c.customer,
          c.company,
          c.containerNumber,
          c.portOfDischarge,
          c.placeOfDelivery,
          c.inquiryCode,
          c.shipmentCode,
          c.sealineCode,
          c.trackingType,
          c.trackingApiStatus,
        ].some((v) => v.toLowerCase().includes(q));

      const matchesFilters =
        (appliedFilters.marketer === 'All' || c.marketer === appliedFilters.marketer) &&
        (appliedFilters.customer === 'All' || c.customer === appliedFilters.customer) &&
        (appliedFilters.portOfDischarge === 'All' ||
          c.portOfDischarge === appliedFilters.portOfDischarge) &&
        (appliedFilters.company === 'All' || c.company === appliedFilters.company) &&
        (appliedFilters.placeOfDelivery === 'All' ||
          c.placeOfDelivery === appliedFilters.placeOfDelivery);

      return matchesSearch && matchesFilters;
    });
  }, [containerList, searchQuery, appliedFilters]);

  const paging = usePagedList(filteredContainers, 10);

  // Reset to page 1 whenever the filtered result set changes
  useEffect(() => {
    paging.resetPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, appliedFilters]);

  // Close filter / actions on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node;
      if (showFilters && filterRef.current && !filterRef.current.contains(target)) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [showFilters]);

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setOpenActionId(null);
  };

  const openFilterPanel = () => {
    setDraftFilters(appliedFilters);
    setShowFilters((v) => !v);
  };

  const applyFilters = () => {
    setAppliedFilters({ ...draftFilters });
    setShowFilters(false);
    setOpenActionId(null);
    onShowSnackBar?.('Filters applied', 'success');
  };

  const clearFilters = () => {
    setDraftFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setShowFilters(false);
    setOpenActionId(null);
    onShowSnackBar?.('Filters cleared', 'info');
  };

  const removeFilter = (key: keyof FilterState) => {
    const next = { ...appliedFilters, [key]: 'All' };
    setAppliedFilters(next);
    setDraftFilters(next);
  };

  const runAction = (label: string, item: ContainerTrackingItem, disabled?: boolean) => {
    setOpenActionId(null);
    if (disabled) {
      onShowSnackBar?.('Add Customer Payment is not available for this shipment', 'warning');
      return;
    }
    if (label === 'View Container Tracking') {
      setSelectedContainer(item);
      return;
    }
    onShowSnackBar?.(`${label} · ${item.proformaCode}`, 'info');
  };

  return (
    <MobilePage>
      <MobileHeader
        title="Container Tracking"
        subtitle="Export logistics · live sealine & port events"
        onBack={onBack}
      />

      <MobileContent>
        {/* Toolbar + filter panel (outside SoftCard so overflow doesn't clip) */}
        <div className="relative z-20" ref={filterRef}>
        <SoftCard>
            <ListToolbar
              viewMode={viewMode}
              onViewModeChange={(mode) => {
                setViewMode(mode);
                setOpenActionId(null);
              }}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              searchPlaceholder="Search..."
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
                  <div key={key} className="space-y-1">
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
                          {opt}
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
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer"
                >
                  {label}: {appliedFilters[key]}
                  <X className="w-3 h-3 text-slate-400" />
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

        {filteredContainers.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-sm font-semibold text-slate-500">No tracking records found</p>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-3 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          /* ===================== GRID (TABLE) ===================== */
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left min-w-[1400px]">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Proforma</th>
                    <th className="py-3 px-3">Tracking Type</th>
                    <th className="py-3 px-3">Tracking</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Company</th>
                    <th className="py-3 px-3">Location</th>
                    <th className="py-3 px-3">Active Event</th>
                    <th className="py-3 px-3">Port</th>
                    <th className="py-3 px-3">Shipment Info</th>
                    <th className="py-3 px-3">Tracking Status</th>
                    <th className="py-3 px-3">Notes</th>
                    <th className="py-3 px-3">Tracking Created</th>
                    <th className="py-3 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paging.paged.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 align-top transition-colors">
                      <td className="py-3 px-3">
                        <LinkText onClick={() => setSelectedContainer(item)}>
                          {item.proformaCode}
                        </LinkText>
                        <p className="text-slate-600 mt-0.5">
                          Marketer:{' '}
                          <span className="text-blue-600 font-semibold">{item.marketer}</span>
                        </p>
                        <p className="text-slate-600">Delivery: {item.deliveryDate}</p>
                        <p className="text-slate-600">Container: {item.containerCount}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 font-bold text-slate-700">
                          {item.trackingType}
                        </span>
                      </td>
                      <td className="py-3 px-3 max-w-[220px]">
                        <TrackingBlock item={item} />
                      </td>
                      <td className="py-3 px-3 max-w-[160px]">
                        <LinkText onClick={() => onShowSnackBar?.(item.customer, 'info')}>
                          {item.customer}
                        </LinkText>
                      </td>
                      <td className="py-3 px-3 max-w-[180px]">
                        <p className="font-semibold text-slate-800 leading-snug">{item.company}</p>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <p>From: {item.fromLocation}</p>
                        <p>To: {item.toLocation}</p>
                        <p>ATD: {item.atd}</p>
                        <p>ETA: {item.eta}</p>
                        {item.ata && <p>ATA: {item.ata}</p>}
                      </td>
                      <td className="py-3 px-3">
                        <p>Description: {item.activeEventDescription}</p>
                        <p>Location: {item.activeEventLocation}</p>
                        <p>Date: {item.activeEventDate}</p>
                      </td>
                      <td className="py-3 px-3">
                        <p>
                          Place of Delivery:{' '}
                          <LinkText>{item.placeOfDelivery}</LinkText>
                        </p>
                        <p>
                          Port of Discharge:{' '}
                          <LinkText>{item.portOfDischarge}</LinkText>
                        </p>
                      </td>
                      <td className="py-3 px-3">
                        <p>
                          Inquiry: <LinkText>{item.inquiryCode}</LinkText>
                        </p>
                        <p>
                          Shipment: <LinkText>{item.shipmentCode}</LinkText>
                        </p>
                        <p className="mt-0.5">
                          <ShipmentDot status={item.shipmentStatus} />
                        </p>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {item.trackingStatus}
                      </td>
                      <td className="py-3 px-3">
                        <LinkText onClick={() => onShowSnackBar?.(`Add note · ${item.proformaCode}`, 'info')}>
                          Add
                        </LinkText>
                        {' · '}
                        <LinkText onClick={() => onShowSnackBar?.(`Logs · ${item.proformaCode}`, 'info')}>
                          Logs
                        </LinkText>
                      </td>
                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                        {item.trackingCreated}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <ActionsMenu
                          item={item}
                          open={openActionId === item.id}
                          onToggle={() =>
                            setOpenActionId(openActionId === item.id ? null : item.id)
                          }
                          onAction={runAction}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* ===================== CARD ===================== */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {paging.paged.map((item) => (
              <ContainerCard
                key={item.id}
                item={item}
                openActionId={openActionId}
                setOpenActionId={setOpenActionId}
                onView={setSelectedContainer}
                onAction={runAction}
                onSnack={onShowSnackBar}
              />
            ))}
          </div>
        )}

        <ListPagination
          page={paging.page}
          pageSize={paging.pageSize}
          total={paging.total}
          onPageChange={(p) => {
            setOpenActionId(null);
            paging.setPage(p);
          }}
          onPageSizeChange={paging.setPageSize}
        />
      </MobileContent>

      <TrackingTimelineModal
        open={!!selectedContainer}
        item={selectedContainer}
        onClose={() => setSelectedContainer(null)}
      />
    </MobilePage>
  );
};

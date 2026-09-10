/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Ship,
  Anchor,
  Navigation,
  Compass,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
  Printer,
  FileCheck2,
  PackageCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldAlert,
  Plus,
  X,
} from 'lucide-react';
import { AppBar } from '../../components/common/AppBar';
import { SearchField } from '../../components/common/SearchField';
import {
  MOCK_CONTAINER_TRACKING,
  ContainerTrackingItem,
} from '../../data/erpWorkstreamsData';

interface ExportModuleScreenProps {
  onBack: () => void;
  onShowSnackBar?: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const ExportModuleScreen: React.FC<ExportModuleScreenProps> = ({
  onBack,
  onShowSnackBar,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [containerList, setContainerList] = useState<ContainerTrackingItem[]>(MOCK_CONTAINER_TRACKING);
  const [selectedContainer, setSelectedContainer] = useState<ContainerTrackingItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Shipment Form State
  const [newContainerNumber, setNewContainerNumber] = useState('');
  const [newBlNumber, setNewBlNumber] = useState('');
  const [newShippingLine, setNewShippingLine] = useState('Maersk Line');
  const [newVesselName, setNewVesselName] = useState('');
  const [newVoyageNumber, setNewVoyageNumber] = useState('');
  const [newSealNumber, setNewSealNumber] = useState('');
  const [newSizeType, setNewSizeType] = useState('40ft High Cube (HC)');
  const [newPortOfLoading, setNewPortOfLoading] = useState('Port Muhammad Bin Qasim (PKBQM)');
  const [newPortOfDischarge, setNewPortOfDischarge] = useState('Hamburg Port (DEHAM)');
  const [newEtd, setNewEtd] = useState(new Date().toISOString().split('T')[0]);
  const [newEta, setNewEta] = useState(new Date(Date.now() + 25 * 86400000).toISOString().split('T')[0]);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newPackagesCount, setNewPackagesCount] = useState(650);
  const [newNetWeightKg, setNewNetWeightKg] = useState(19500);

  const handleCreateContainer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContainerNumber.trim() || !newBlNumber.trim()) {
      onShowSnackBar?.('Please enter Container and B/L number', 'warning');
      return;
    }

    const newShipment: ContainerTrackingItem = {
      id: `cnt_${Date.now()}`,
      containerNumber: newContainerNumber.trim().toUpperCase(),
      sizeType: newSizeType,
      shippingLine: (newShippingLine === 'MSC Mediterranean Shipping' ? 'MSC' : newShippingLine === 'Maersk Line' ? 'Maersk' : newShippingLine) as any,
      blNumber: newBlNumber.trim().toUpperCase(),
      vesselName: newVesselName.trim() || 'MSC ISABELLA',
      voyageNumber: newVoyageNumber.trim() || '2504W',
      portOfLoading: newPortOfLoading,
      portOfDischarge: newPortOfDischarge,
      departureDate: newEtd,
      eta: newEta,
      status: 'Port Gate In',
      currentMilestoneIndex: 2,
      sealNumber: newSealNumber.trim() || `SL-${Math.floor(100000 + Math.random() * 900000)}`,
      grossWeightKg: Number(newNetWeightKg) || 18000,
      totalCartons: Number(newPackagesCount) || 500,
      cargoDescription: '100% Combed Cotton Ring Spun Weaving Yarn On Cones',
      customerName: newCustomerName.trim() || 'Global European Logistics B.V.',
      milestones: [
        { title: 'Empty Dispatched from Depot', location: 'Karachi Central Depot', date: `${newEtd} 08:30`, completed: true },
        { title: 'Factory Loading & Sealing', location: 'Soneri Mill No. 1 Raiwind', date: `${newEtd} 14:00`, completed: true },
        { title: 'Port Gate In & Weighbridge', location: newPortOfLoading, date: `${newEtd} 20:00`, completed: true },
        { title: 'Loaded on Vessel & Departed', location: newPortOfLoading, date: `${newEtd} 23:00`, completed: false },
        { title: 'Vessel Arrival & Discharge', location: newPortOfDischarge, date: `${newEta} 10:00`, completed: false },
      ],
    };

    setContainerList([newShipment, ...containerList]);
    setShowAddModal(false);
    // Reset fields
    setNewContainerNumber('');
    setNewBlNumber('');
    setNewCustomerName('');
    setNewVesselName('');
    onShowSnackBar?.(`Container ${newShipment.containerNumber} booked & tracking initiated!`, 'success');
  };

  const filteredContainers = containerList.filter((c) => {
    const matchesSearch =
      c.containerNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.blNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.vesselName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.portOfDischarge.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' || c.status.toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  // ====================================================
  // VIEW: CONTAINER DETAIL VIEW
  // ====================================================
  if (selectedContainer) {
    return (
      <div className="min-h-full pb-24 bg-slate-50/60">
        <AppBar
          title={`Tracking: ${selectedContainer.containerNumber}`}
          subtitle={`${selectedContainer.shippingLine} • B/L: ${selectedContainer.blNumber}`}
          showBack
          onBack={() => setSelectedContainer(null)}
        />

        <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
          {/* Header Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-black font-mono text-slate-900">
                  {selectedContainer.containerNumber}
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {selectedContainer.status}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {selectedContainer.sizeType}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Consignee: <strong className="text-slate-800">{selectedContainer.customerName}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onShowSnackBar?.(`Refreshing live AIS tracking for ${selectedContainer.vesselName}...`, 'info')}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-xs transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                Live Satellite AIS
              </button>
            </div>
          </div>

          {/* Voyage Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Ocean Carrier & Vessel
              </span>
              <p className="text-sm font-bold text-slate-900">{selectedContainer.vesselName}</p>
              <p className="text-xs text-slate-500 font-mono">
                Voyage: {selectedContainer.voyageNumber} ({selectedContainer.shippingLine})
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Port of Loading (POL)
              </span>
              <p className="text-sm font-bold text-slate-900">{selectedContainer.portOfLoading}</p>
              <p className="text-xs text-slate-500 font-mono">
                Sailed: {selectedContainer.departureDate}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Port of Discharge (POD)
              </span>
              <p className="text-sm font-bold text-slate-900">{selectedContainer.portOfDischarge}</p>
              <p className="text-xs font-bold text-emerald-700 font-mono">
                ETA: {selectedContainer.eta}
              </p>
            </div>
          </div>

          {/* Visual Milestone Progress Tracker */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">End-to-End Shipment Milestones</h3>
              <span className="text-xs font-semibold text-slate-500">
                Status: {selectedContainer.status}
              </span>
            </div>

            <div className="relative pl-6 space-y-5 border-l-2 border-slate-200">
              {selectedContainer.milestones.map((m, idx) => (
                <div key={idx} className="relative">
                  <div
                    className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                      m.completed
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {m.completed && <CheckCircle2 className="w-3 h-3" />}
                  </div>

                  <div className="space-y-0.5">
                    <h4
                      className={`text-xs font-bold ${
                        m.completed ? 'text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      {m.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span>{m.location}</span>
                      <span>•</span>
                      <span className="font-mono">{m.date}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cargo Manifest Summary */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Cargo Stowing & Packaging Particulars</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Seal Number</span>
                <span className="font-mono font-bold text-slate-900">{selectedContainer.sealNumber}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Gross Weight</span>
                <span className="font-mono font-bold text-slate-900">{selectedContainer.grossWeightKg.toLocaleString()} Kg</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Total Package Units</span>
                <span className="font-mono font-bold text-slate-900">{selectedContainer.totalCartons} Cartons</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block text-[11px]">Customs Status</span>
                <span className="font-bold text-emerald-700">Form E Verified</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
              <span className="font-bold text-slate-800">Declared Goods: </span>
              <span className="text-slate-700">{selectedContainer.cargoDescription}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // GRID / LIST: CONTAINER TRACKING
  // ====================================================
  return (
    <div className="min-h-full pb-24 bg-slate-50/60">
      <AppBar
        title="Container Tracking"
        subtitle="Global Export Maritime & Port Logistics"
        showBack
        onBack={onBack}
      />

      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-4">
        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Maritime Export Fleet Tracking</h3>
            <p className="text-xs text-slate-500">Live shipping line AIS status & port terminal logistics</p>
          </div>
          <button
            id="btn-add-container-shipment"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Track New Container</span>
          </button>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="flex-1">
            <SearchField
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search container#, BL#, vessel, destination..."
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl overflow-x-auto">
            {['ALL', 'AT SEA', 'BERTHING', 'CUSTOMS CLEARED'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  statusFilter === tab
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab === 'ALL' ? 'All Containers' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Container Cards List */}
        <div className="space-y-3">
          {filteredContainers.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <p className="text-sm font-semibold text-slate-500">No active shipments matching criteria</p>
            </div>
          ) : (
            filteredContainers.map((container) => (
              <div
                key={container.id}
                id={`container-row-${container.id}`}
                onClick={() => setSelectedContainer(container)}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm active:scale-[0.99] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:bg-slate-800 transition-colors">
                    <Ship className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                        {container.containerNumber}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {container.status}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {container.shippingLine} • {container.sizeType}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {container.vesselName} (Voy {container.voyageNumber})
                    </h4>

                    <p className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                      <span>POD: <strong className="text-slate-800">{container.portOfDischarge}</strong></span>
                      <span>•</span>
                      <span>Consignee: {container.customerName}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Port Arrival ETA</p>
                    <p className="text-sm font-black font-mono text-emerald-700">
                      {container.eta}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      B/L: {container.blNumber}
                    </p>
                  </div>

                  <div className="p-2 rounded-full text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal: Track New Container / Book Shipment */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                  <Ship className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Track New Export Container</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContainer} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Container Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MSKU-9021884"
                    value={newContainerNumber}
                    onChange={(e) => setNewContainerNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-slate-900 outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Bill of Lading (B/L) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MSK-PK-991204"
                    value={newBlNumber}
                    onChange={(e) => setNewBlNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-slate-900 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Shipping Line</label>
                  <select
                    value={newShippingLine}
                    onChange={(e) => setNewShippingLine(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-900 outline-hidden"
                  >
                    <option value="Maersk Line">Maersk Line</option>
                    <option value="MSC Mediterranean Shipping">MSC Mediterranean Shipping</option>
                    <option value="CMA CGM">CMA CGM</option>
                    <option value="Hapag-Lloyd">Hapag-Lloyd</option>
                    <option value="ONE Ocean Network Express">ONE Ocean Network Express</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Container Size / Type</label>
                  <select
                    value={newSizeType}
                    onChange={(e) => setNewSizeType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-900 outline-hidden"
                  >
                    <option value="40ft High Cube (HC)">40ft High Cube (HC)</option>
                    <option value="40ft Standard Dry">40ft Standard Dry</option>
                    <option value="20ft Standard Dry">20ft Standard Dry</option>
                    <option value="40ft Reefer Controlled">40ft Reefer Controlled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Vessel Name</label>
                  <input
                    type="text"
                    placeholder="e.g. MAERSK COLUMBUS"
                    value={newVesselName}
                    onChange={(e) => setNewVesselName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-900 outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Voyage #</label>
                  <input
                    type="text"
                    placeholder="e.g. 2505E"
                    value={newVoyageNumber}
                    onChange={(e) => setNewVoyageNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-slate-900 outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Customs Seal #</label>
                  <input
                    type="text"
                    placeholder="e.g. SL-889102"
                    value={newSealNumber}
                    onChange={(e) => setNewSealNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-slate-900 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Port of Loading (POL)</label>
                  <input
                    type="text"
                    value={newPortOfLoading}
                    onChange={(e) => setNewPortOfLoading(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-900 outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Port of Discharge (POD)</label>
                  <input
                    type="text"
                    value={newPortOfDischarge}
                    onChange={(e) => setNewPortOfDischarge(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-900 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Sailing Date (ETD)</label>
                  <input
                    type="date"
                    value={newEtd}
                    onChange={(e) => setNewEtd(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-900 outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Arrival Date (ETA)</label>
                  <input
                    type="date"
                    value={newEta}
                    onChange={(e) => setNewEta(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-900 outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Buyer / Consignee Name</label>
                <input
                  type="text"
                  placeholder="e.g. Hanseatic Spinning Mills GmbH, Germany"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-900 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Packages / Cartons</label>
                  <input
                    type="number"
                    value={newPackagesCount}
                    onChange={(e) => setNewPackagesCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-900 outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Gross Weight (KG)</label>
                  <input
                    type="number"
                    value={newNetWeightKg}
                    onChange={(e) => setNewNetWeightKg(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-slate-900 outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-xs"
                >
                  Confirm & Track Container
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

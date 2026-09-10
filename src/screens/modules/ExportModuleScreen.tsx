/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import {
  Ship,
  Navigation,
  CheckCircle2,
  Plus,
  X,
} from 'lucide-react';
import {
  MOCK_CONTAINER_TRACKING,
  ContainerTrackingItem,
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
  DetailFieldGrid,
  InfoField,
  ListViewMode,
} from '../../components/common/DataListShell';
import {
  MobilePage,
  MobileHeader,
  SoftCard,
  MobileContent,
  SectionBand,
} from '../../components/common/MobileLayout';

interface ExportModuleScreenProps {
  onBack: () => void;
  onShowSnackBar?: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const ExportModuleScreen: React.FC<ExportModuleScreenProps> = ({
  onBack,
  onShowSnackBar,
}) => {
  const [viewMode, setViewMode] = useState<ListViewMode>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [containerList, setContainerList] = useState<ContainerTrackingItem[]>(MOCK_CONTAINER_TRACKING);
  const [selectedContainer, setSelectedContainer] = useState<ContainerTrackingItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

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
      shippingLine:
        newShippingLine === 'MSC Mediterranean Shipping'
          ? 'MSC'
          : newShippingLine === 'Maersk Line'
          ? 'Maersk'
          : newShippingLine,
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
    setNewContainerNumber('');
    setNewBlNumber('');
    setNewCustomerName('');
    setNewVesselName('');
    onShowSnackBar?.(`Container ${newShipment.containerNumber} booked & tracking initiated!`, 'success');
  };

  const filteredContainers = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return containerList.filter((c) => {
      const matchesSearch =
        c.containerNumber.toLowerCase().includes(q) ||
        c.blNumber.toLowerCase().includes(q) ||
        c.vesselName.toLowerCase().includes(q) ||
        c.customerName.toLowerCase().includes(q) ||
        c.portOfDischarge.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === 'ALL' || c.status.toUpperCase() === statusFilter.toUpperCase();
      return matchesSearch && matchesStatus;
    });
  }, [containerList, searchQuery, statusFilter]);

  const paging = usePagedList(filteredContainers, 10);

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    paging.resetPage();
  };

  if (selectedContainer) {
    return (
      <MobilePage>
        <MobileHeader
          title={`Tracking: ${selectedContainer.containerNumber}`}
          subtitle={`${selectedContainer.shippingLine} • B/L: ${selectedContainer.blNumber}`}
          status={selectedContainer.status}
          onBack={() => setSelectedContainer(null)}
          actions={
            <button
              type="button"
              onClick={() =>
                onShowSnackBar?.(
                  `Refreshing live AIS tracking for ${selectedContainer.vesselName}...`,
                  'info'
                )
              }
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-[11px] font-bold bg-[#0f2b3c] text-white hover:bg-[#163a50] cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live AIS</span>
            </button>
          }
        />

        <MobileContent>
          <SoftCard>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-black font-mono text-slate-900">
                  {selectedContainer.containerNumber}
                </h2>
                <StatusPill status={selectedContainer.status} />
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {selectedContainer.sizeType}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Consignee: <strong className="text-slate-800">{selectedContainer.customerName}</strong>
              </p>
            </div>
          </SoftCard>

          <SectionBand title="Voyage Specs">
            <DetailFieldGrid>
              <InfoField
                label="Ocean Carrier & Vessel"
                value={
                  <>
                    <span className="text-sm font-bold text-slate-900 block">
                      {selectedContainer.vesselName}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Voyage: {selectedContainer.voyageNumber} ({selectedContainer.shippingLine})
                    </span>
                  </>
                }
              />
              <InfoField
                label="Port of Loading (POL)"
                value={
                  <>
                    <span className="text-sm font-bold text-slate-900 block">
                      {selectedContainer.portOfLoading}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Sailed: {selectedContainer.departureDate}
                    </span>
                  </>
                }
              />
              <InfoField
                label="Port of Discharge (POD)"
                value={
                  <>
                    <span className="text-sm font-bold text-slate-900 block">
                      {selectedContainer.portOfDischarge}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 font-mono">
                      ETA: {selectedContainer.eta}
                    </span>
                  </>
                }
              />
            </DetailFieldGrid>
          </SectionBand>

          <SectionBand title="End-to-End Shipment Milestones">
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
          </SectionBand>

          <SectionBand title="Cargo Stowing & Packaging Particulars">
            <DetailFieldGrid>
              <InfoField label="Seal Number" value={selectedContainer.sealNumber} mono />
              <InfoField
                label="Gross Weight"
                value={`${selectedContainer.grossWeightKg.toLocaleString()} Kg`}
                mono
              />
              <InfoField
                label="Total Package Units"
                value={`${selectedContainer.totalCartons} Cartons`}
                mono
              />
              <InfoField label="Customs Status" value="Form E Verified" accent />
            </DetailFieldGrid>
            <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
              <span className="font-bold text-slate-800">Declared Goods: </span>
              <span className="text-slate-700">{selectedContainer.cargoDescription}</span>
            </div>
          </SectionBand>
        </MobileContent>
      </MobilePage>
    );
  }

  return (
    <MobilePage>
      <MobileHeader
        title="Container Tracking"
        subtitle="Global Export Maritime & Port Logistics"
        onBack={onBack}
      />

      <MobileContent>
        <SoftCard>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Maritime Export Fleet Tracking</h3>
                <p className="text-xs text-slate-500">
                  Live shipping line AIS status & port terminal logistics
                </p>
              </div>
            </div>

            <ListToolbar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              searchPlaceholder="Search container#, BL#, vessel, destination…"
              onFilterClick={() => onShowSnackBar?.('Filter panel opened', 'info')}
              onColumnsClick={() => onShowSnackBar?.('Column selection opened', 'info')}
              trailing={
                <button
                  id="btn-add-container-shipment"
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-xl bg-[#0f2b3c] text-white hover:bg-[#163a50] transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Track New
                </button>
              }
            />

            <div className="flex items-center gap-1.5 p-1 bg-slate-50 border border-slate-200 rounded-xl overflow-x-auto">
              {['ALL', 'AT SEA', 'BERTHING', 'CUSTOMS CLEARED'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setStatusFilter(tab);
                    paging.resetPage();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    statusFilter === tab
                      ? 'bg-[#0f2b3c] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`}
                >
                  {tab === 'ALL' ? 'All Containers' : tab}
                </button>
              ))}
            </div>
          </div>
        </SoftCard>

        {filteredContainers.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-sm font-semibold text-slate-500">
              No active shipments matching criteria
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <DataTable
            headers={[
              'Container #',
              'Status',
              'Shipping Line',
              'Size',
              'Vessel',
              'Voyage',
              'Port of Discharge',
              'Customer',
              'ETA',
              'BL #',
            ]}
          >
            {paging.paged.map((container) => (
              <DataRow key={container.id} onClick={() => setSelectedContainer(container)}>
                <Td accent mono>
                  {container.containerNumber}
                </Td>
                <Td>
                  <StatusPill status={container.status} />
                </Td>
                <Td>{container.shippingLine}</Td>
                <Td>{container.sizeType}</Td>
                <Td className="max-w-[140px] truncate">{container.vesselName}</Td>
                <Td mono>{container.voyageNumber}</Td>
                <Td className="max-w-[160px] truncate">{container.portOfDischarge}</Td>
                <Td className="max-w-[160px] truncate">{container.customerName}</Td>
                <Td mono accent>
                  {container.eta}
                </Td>
                <Td mono>{container.blNumber}</Td>
              </DataRow>
            ))}
          </DataTable>
        ) : (
          <CardGrid>
            {paging.paged.map((container) => (
              <RecordCard
                key={container.id}
                code={container.containerNumber}
                title={container.vesselName}
                subtitle={`${container.shippingLine} • Voy ${container.voyageNumber}`}
                status={container.status}
                fields={[
                  { label: 'Size', value: container.sizeType },
                  { label: 'Port of Discharge', value: container.portOfDischarge },
                  { label: 'Customer', value: container.customerName },
                  { label: 'ETA', value: container.eta },
                  { label: 'BL #', value: container.blNumber },
                  { label: 'Shipping Line', value: container.shippingLine },
                ]}
                onClick={() => setSelectedContainer(container)}
                actions={[
                  {
                    label: 'View',
                    icon: 'view',
                    onClick: () => setSelectedContainer(container),
                  },
                ]}
                footer={
                  <span className="inline-flex items-center gap-1.5">
                    <Ship className="w-3.5 h-3.5 text-teal-600" />
                    Track milestones
                  </span>
                }
              />
            ))}
          </CardGrid>
        )}

        <ListPagination
          page={paging.page}
          pageSize={paging.pageSize}
          total={paging.total}
          onPageChange={paging.setPage}
          onPageSizeChange={paging.setPageSize}
        />
      </MobileContent>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0f2b3c] text-white flex items-center justify-center">
                  <Ship className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Track New Export Container</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContainer} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Container Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MSKU-9021884"
                    value={newContainerNumber}
                    onChange={(e) => setNewContainerNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-[#0f2b3c] outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Bill of Lading (B/L) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MSK-PK-991204"
                    value={newBlNumber}
                    onChange={(e) => setNewBlNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-[#0f2b3c] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Shipping Line
                  </label>
                  <select
                    value={newShippingLine}
                    onChange={(e) => setNewShippingLine(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#0f2b3c] outline-hidden"
                  >
                    <option value="Maersk Line">Maersk Line</option>
                    <option value="MSC Mediterranean Shipping">MSC Mediterranean Shipping</option>
                    <option value="CMA CGM">CMA CGM</option>
                    <option value="Hapag-Lloyd">Hapag-Lloyd</option>
                    <option value="ONE Ocean Network Express">ONE Ocean Network Express</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Container Size / Type
                  </label>
                  <select
                    value={newSizeType}
                    onChange={(e) => setNewSizeType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#0f2b3c] outline-hidden"
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
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Vessel Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MAERSK COLUMBUS"
                    value={newVesselName}
                    onChange={(e) => setNewVesselName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#0f2b3c] outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Voyage #
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2505E"
                    value={newVoyageNumber}
                    onChange={(e) => setNewVoyageNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-[#0f2b3c] outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Customs Seal #
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SL-889102"
                    value={newSealNumber}
                    onChange={(e) => setNewSealNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-[#0f2b3c] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Port of Loading (POL)
                  </label>
                  <input
                    type="text"
                    value={newPortOfLoading}
                    onChange={(e) => setNewPortOfLoading(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#0f2b3c] outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Port of Discharge (POD)
                  </label>
                  <input
                    type="text"
                    value={newPortOfDischarge}
                    onChange={(e) => setNewPortOfDischarge(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#0f2b3c] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Sailing Date (ETD)
                  </label>
                  <input
                    type="date"
                    value={newEtd}
                    onChange={(e) => setNewEtd(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#0f2b3c] outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Arrival Date (ETA)
                  </label>
                  <input
                    type="date"
                    value={newEta}
                    onChange={(e) => setNewEta(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#0f2b3c] outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Buyer / Consignee Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hanseatic Spinning Mills GmbH, Germany"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#0f2b3c] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Packages / Cartons
                  </label>
                  <input
                    type="number"
                    value={newPackagesCount}
                    onChange={(e) => setNewPackagesCount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#0f2b3c] outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Gross Weight (KG)
                  </label>
                  <input
                    type="number"
                    value={newNetWeightKg}
                    onChange={(e) => setNewNetWeightKg(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#0f2b3c] outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0f2b3c] text-white font-bold hover:bg-[#163a50] transition-colors shadow-xs cursor-pointer"
                >
                  Confirm & Track Container
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MobilePage>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Shield,
  Coins,
  Network,
  Calculator,
  Search,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  RefreshCw,
  Sliders,
  DollarSign,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { AppBar } from '../../components/common/AppBar';
import { SearchField } from '../../components/common/SearchField';
import {
  MOCK_USER_AUTHORIZATIONS,
  MOCK_EXCHANGE_RATES,
  MOCK_IP_WHITELISTS,
  UserAuthItem,
  ExchangeRateItem,
  IpWhitelistItem,
} from '../../data/erpWorkstreamsData';

interface AdminModuleWorkstreamsProps {
  workstream: 'user_auth' | 'exchange_rate' | 'ip_whitelist' | 'price_calculator';
  onBack: () => void;
  onShowSnackBar?: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const AdminModuleWorkstreams: React.FC<AdminModuleWorkstreamsProps> = ({
  workstream,
  onBack,
  onShowSnackBar,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // ----------------------------------------------------
  // STATE: USER AUTHORIZATION
  // ----------------------------------------------------
  const [userAuths, setUserAuths] = useState<UserAuthItem[]>(MOCK_USER_AUTHORIZATIONS);
  const [selectedUserAuth, setSelectedUserAuth] = useState<UserAuthItem | null>(null);

  // ----------------------------------------------------
  // STATE: EXCHANGE RATE
  // ----------------------------------------------------
  const [exchangeRates, setExchangeRates] = useState<ExchangeRateItem[]>(MOCK_EXCHANGE_RATES);
  const [isUpdatingRates, setIsUpdatingRates] = useState(false);

  const handleFetchLatestRates = () => {
    setIsUpdatingRates(true);
    setTimeout(() => {
      setIsUpdatingRates(false);
      onShowSnackBar?.('Interbank & SBP Foreign Exchange rates synchronized successfully', 'success');
    }, 700);
  };

  // ----------------------------------------------------
  // STATE: IP WHITELIST
  // ----------------------------------------------------
  const [ipList, setIpList] = useState<IpWhitelistItem[]>(MOCK_IP_WHITELISTS);
  const [showAddIpModal, setShowAddIpModal] = useState(false);
  const [newIpAddress, setNewIpAddress] = useState('');
  const [newIpDescription, setNewIpDescription] = useState('');

  const handleAddIp = () => {
    if (!newIpAddress) {
      onShowSnackBar?.('Please enter a valid IP address or CIDR range', 'error');
      return;
    }
    const newEntry: IpWhitelistItem = {
      id: `ip_${Date.now()}`,
      ipAddress: newIpAddress,
      description: newIpDescription || 'Authorized Office Location',
      location: 'Branch Gateway',
      status: 'Active',
      allowedRoles: ['Super Admin', 'Finance Approver'],
      addedDate: new Date().toISOString().split('T')[0],
      addedBy: 'Admin Console',
    };
    setIpList([newEntry, ...ipList]);
    setShowAddIpModal(false);
    setNewIpAddress('');
    setNewIpDescription('');
    onShowSnackBar?.(`IP Range ${newIpAddress} added to gateway firewall`, 'success');
  };

  const handleToggleIpStatus = (id: string) => {
    setIpList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'Active' ? 'Blocked' : 'Active' }
          : item
      )
    );
    onShowSnackBar?.('IP access rule toggled', 'info');
  };

  // ----------------------------------------------------
  // STATE: PRICE CALCULATOR
  // ----------------------------------------------------
  const [yarnCount, setYarnCount] = useState('30/1 Combed Cotton');
  const [rawCottonCostPerLb, setRawCottonCostPerLb] = useState(380); // PKR
  const [spinningCostPerLb, setSpinningCostPerLb] = useState(145); // PKR
  const [weavingCostPerMeter, setWeavingCostPerMeter] = useState(65); // PKR
  const [processingDyeingPerMeter, setProcessingDyeingPerMeter] = useState(85); // PKR
  const [freightAndPackingUSD, setFreightAndPackingUSD] = useState(0.12); // USD
  const [profitMarginPercent, setProfitMarginPercent] = useState(14); // %
  const [conversionRateUSD, setConversionRateUSD] = useState(279.5); // PKR / USD

  // Cost Computations
  const totalYarnCostPKRPerLb = rawCottonCostPerLb + spinningCostPerLb;
  const fabricRawCostPKRPerMeter = (totalYarnCostPKRPerLb * 0.28) + weavingCostPerMeter + processingDyeingPerMeter;
  const fabricCostUSDPerMeter = fabricRawCostPKRPerMeter / conversionRateUSD;
  const landedCostUSDPerMeter = fabricCostUSDPerMeter + freightAndPackingUSD;
  const sellingPriceUSDPerMeter = landedCostUSDPerMeter * (1 + profitMarginPercent / 100);
  const container40FtTotalValueUSD = sellingPriceUSDPerMeter * 45000; // ~45,000 meters in 40ft container

  // ====================================================
  // WORKSTREAM 1: USER AUTHORIZATION
  // ====================================================
  if (workstream === 'user_auth') {
    return (
      <div className="min-h-full pb-24 bg-slate-50/60">
        <AppBar
          title="User Authorization"
          subtitle="Role-Based Access Control (RBAC) & Module Permissions"
          showBack
          onBack={onBack}
        />

        <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-4">
          <SearchField
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search users, roles, email..."
          />

          <div className="space-y-3">
            {userAuths
              .filter(
                (u) =>
                  u.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  u.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  u.role.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((u) => (
                <div
                  key={u.userId}
                  id={`user-auth-${u.userId}`}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                        {u.userName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{u.userName}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            {u.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{u.userEmail} • Last Login: {u.lastLogin}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500">Global Admin:</span>
                      <strong className={u.isSuperAdmin ? 'text-emerald-700' : 'text-slate-700'}>
                        {u.isSuperAdmin ? 'Authorized' : 'Standard'}
                      </strong>
                    </div>
                  </div>

                  {/* Modules Permissions Matrix */}
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Authorized Workstream Modules
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
                      {u.permissions.map((p, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">{p.module}</span>
                            {p.canApprove && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                                Sign-Off
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                            {p.canView && <span className="text-emerald-700 font-semibold">View</span>}
                            {p.canCreate && <span>• Add</span>}
                            {p.canEdit && <span>• Edit</span>}
                            {p.canDelete && <span className="text-rose-600">• Del</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // WORKSTREAM 2: EXCHANGE RATE
  // ====================================================
  if (workstream === 'exchange_rate') {
    return (
      <div className="min-h-full pb-24 bg-slate-50/60">
        <AppBar
          title="Exchange Rate"
          subtitle="State Bank of Pakistan (SBP) & Interbank Forex Conversion Rates"
          showBack
          onBack={onBack}
        />

        <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Live Forex Settlement Matrix</h3>
              <p className="text-xs text-slate-500">Used across Export Invoicing, LC Realization & Price Calculator</p>
            </div>
            <button
              onClick={handleFetchLatestRates}
              disabled={isUpdatingRates}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isUpdatingRates ? 'animate-spin' : ''}`} />
              {isUpdatingRates ? 'Syncing SBP Rates...' : 'Sync Latest Forex'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {exchangeRates.map((rate) => (
              <div
                key={rate.currency}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-900 font-bold flex items-center justify-center text-xs font-mono">
                      {rate.symbol}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{rate.currency}</h4>
                      <p className="text-[11px] text-slate-500">{rate.name}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                    SBP Verified
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Buying</span>
                    <span className="font-mono font-bold text-slate-900">{rate.buyingRate.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Selling</span>
                    <span className="font-mono font-bold text-slate-900">{rate.sellingRate.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Interbank</span>
                    <span className="font-mono font-bold text-blue-700">{rate.interbankRate.toFixed(2)}</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400">
                  Last Updated: {rate.lastUpdated}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // WORKSTREAM 3: IP WHITELIST
  // ====================================================
  if (workstream === 'ip_whitelist') {
    return (
      <div className="min-h-full pb-24 bg-slate-50/60">
        <AppBar
          title="IP Whitelist"
          subtitle="Enterprise Network Security & Geographic Gateway Firewalls"
          showBack
          onBack={onBack}
        />

        <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <SearchField
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search IP, description, location..."
              />
            </div>
            <button
              onClick={() => setShowAddIpModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add IP Address
            </button>
          </div>

          {/* Add IP Modal */}
          {showAddIpModal && (
            <div className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-md space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Register Static IP or CIDR Subnet</h3>
                <button
                  onClick={() => setShowAddIpModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">IP Address / CIDR Range</label>
                  <input
                    type="text"
                    value={newIpAddress}
                    onChange={(e) => setNewIpAddress(e.target.value)}
                    placeholder="e.g. 110.37.214.88 or 10.0.0.0/24"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation & Location</label>
                  <input
                    type="text"
                    value={newIpDescription}
                    onChange={(e) => setNewIpDescription(e.target.value)}
                    placeholder="e.g. Raiwind Spinning Unit NOC"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddIpModal(false)}
                  className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddIp}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                >
                  Authorize IP Range
                </button>
              </div>
            </div>
          )}

          {/* IP List */}
          <div className="space-y-3">
            {ipList
              .filter(
                (ip) =>
                  ip.ipAddress.includes(searchQuery) ||
                  ip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  ip.location.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((ip) => (
                <div
                  key={ip.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                      <Network className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-sm text-slate-900">{ip.ipAddress}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            ip.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {ip.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800">{ip.description}</h4>
                      <p className="text-[11px] text-slate-500">
                        {ip.location} • Added by {ip.addedBy} on {ip.addedDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleIpStatus(ip.id)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      {ip.status === 'Active' ? 'Disable Access' : 'Enable Access'}
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // WORKSTREAM 4: PRICE CALCULATOR
  // ====================================================
  return (
    <div className="min-h-full pb-24 bg-slate-50/60">
      <AppBar
        title="Price Calculator"
        subtitle="Textile Export Fabric & Yarn Costing Engine (FOB & CIF)"
        showBack
        onBack={onBack}
      />

      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Inputs Section */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Raw Material & Conversion Cost Inputs
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Yarn Spec</label>
                <select
                  value={yarnCount}
                  onChange={(e) => setYarnCount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  <option>30/1 Combed Cotton</option>
                  <option>20/1 Carded Cotton</option>
                  <option>40/1 Compact Cotton</option>
                  <option>80/20 Cotton Polyester</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Cotton Price (PKR / lb)</label>
                <input
                  type="number"
                  value={rawCottonCostPerLb}
                  onChange={(e) => setRawCottonCostPerLb(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono font-bold focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Spinning Conversion (PKR / lb)</label>
                <input
                  type="number"
                  value={spinningCostPerLb}
                  onChange={(e) => setSpinningCostPerLb(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Airjet Weaving Cost (PKR / m)</label>
                <input
                  type="number"
                  value={weavingCostPerMeter}
                  onChange={(e) => setWeavingCostPerMeter(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Continuous Dyeing (PKR / m)</label>
                <input
                  type="number"
                  value={processingDyeingPerMeter}
                  onChange={(e) => setProcessingDyeingPerMeter(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Freight & Packing (USD / m)</label>
                <input
                  type="number"
                  step="0.01"
                  value={freightAndPackingUSD}
                  onChange={(e) => setFreightAndPackingUSD(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Profit Margin (%)</label>
                <input
                  type="number"
                  value={profitMarginPercent}
                  onChange={(e) => setProfitMarginPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono font-bold text-blue-700 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Forex USD / PKR</label>
                <input
                  type="number"
                  value={conversionRateUSD}
                  onChange={(e) => setConversionRateUSD(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Computed Commercial Quotation
              </h3>

              <div className="py-4 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Fabric Cost (PKR/meter):</span>
                  <span className="font-mono font-bold text-slate-900">PKR {fabricRawCostPKRPerMeter.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Base Cost (USD/meter):</span>
                  <span className="font-mono font-bold text-slate-900">${fabricCostUSDPerMeter.toFixed(3)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Landed Export Cost:</span>
                  <span className="font-mono font-bold text-slate-900">${landedCostUSDPerMeter.toFixed(3)} / m</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                  <span className="font-bold text-slate-800 text-sm">Suggested FOB Price:</span>
                  <span className="font-mono font-black text-xl text-emerald-700">
                    ${sellingPriceUSDPerMeter.toFixed(3)} / m
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-900 rounded-xl text-white space-y-2">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block">
                Standard 40ft HC Shipment (45,000 meters)
              </span>
              <p className="text-2xl font-black font-mono text-emerald-400">
                ${container40FtTotalValueUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-slate-300 font-mono">
                Equivalent PKR: {(container40FtTotalValueUSD * conversionRateUSD).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

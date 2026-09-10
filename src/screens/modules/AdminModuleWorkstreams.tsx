/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Network } from 'lucide-react';
import {
  MOCK_USER_AUTHORIZATIONS,
  MOCK_EXCHANGE_RATES,
  MOCK_IP_WHITELISTS,
  MOCK_CATALOG_PRODUCTS,
  UserAuthItem,
  ExchangeRateItem,
  IpWhitelistItem,
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
  InfoField,
  ListViewMode,
} from '../../components/common/DataListShell';
import {
  MobilePage,
  MobileHeader,
  SoftCard,
  SectionBand,
  MobileContent,
  FormInput,
  PrimaryBtn,
  MobileFieldGrid,
  HeaderIconBtn,
} from '../../components/common/MobileLayout';
import { useTheme } from '../../context/ThemeContext';

interface AdminModuleWorkstreamsProps {
  workstream: 'user_auth' | 'exchange_rate' | 'ip_whitelist' | 'price_calculator';
  onBack: () => void;
  onShowSnackBar?: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const CURRENCY_OPTIONS = [
  { value: 'Euro', label: 'Euro' },
  { value: 'United States Dollar', label: 'United States Dollar' },
  { value: 'Pakistani Rupee', label: 'Pakistani Rupee' },
  { value: 'British Pound', label: 'British Pound' },
  { value: 'UAE Dirham', label: 'UAE Dirham' },
  { value: 'United Arab Emirates Dirham', label: 'United Arab Emirates Dirham' },
  { value: 'Chinese Yuan', label: 'Chinese Yuan' },
  { value: 'Saudi Riyal', label: 'Saudi Riyal' },
];

const PRODUCT_OPTIONS = MOCK_CATALOG_PRODUCTS.map((p) => ({
  value: p.id,
  label: `${p.code} — ${p.name}`,
}));

function formatMoney(n: number, digits = 4) {
  return `$${n.toFixed(digits)}`;
}

function formatPct(n: number) {
  return `${n.toFixed(2)}%`;
}

function todayIso() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function nowCreatedStamp() {
  return new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

const ActiveToggle: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}> = ({ checked, onChange, label = 'Active' }) => {
  const { isDark } = useTheme();
  return (
    <label className="flex items-center justify-between gap-3 min-h-[42px]">
      <span className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
          checked ? 'bg-teal-600' : isDark ? 'bg-slate-700' : 'bg-slate-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
};

const SuggestRow: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  const { isDark } = useTheme();
  return (
    <div
      className={`flex items-center justify-between gap-3 py-2.5 border-b last:border-0 ${
        isDark ? 'border-slate-800' : 'border-slate-100'
      }`}
    >
      <span className={`text-[11px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        {label}
      </span>
      <span className={`text-xs font-mono font-bold ${isDark ? 'text-teal-300' : 'text-teal-700'}`}>
        {value}
      </span>
    </div>
  );
};

const NetProfitCard: React.FC<{
  title: string;
  rows: {
    key: string;
    label: string;
    sellingPrice: number;
    onSellingChange: (v: number) => void;
    netMargin: number;
    gp: number;
    np: number;
  }[];
}> = ({ title, rows }) => {
  const { isDark } = useTheme();
  return (
    <SoftCard padding={false}>
      <div
        className={`px-4 py-2.5 ${
          isDark
            ? 'bg-gradient-to-r from-teal-950/50 to-slate-900/40 border-b border-slate-800'
            : 'bg-gradient-to-r from-[#d9eef3] to-[#eef6f8] border-b border-slate-100'
        }`}
      >
        <h3
          className={`text-[11px] font-extrabold uppercase tracking-[0.14em] ${
            isDark ? 'text-teal-200' : 'text-[#0f2b3c]'
          }`}
        >
          {title}
        </h3>
      </div>
      <div className="p-3.5 space-y-3">
        {rows.map((row) => (
          <div
            key={row.key}
            className={`rounded-2xl border p-3 space-y-2.5 ${
              isDark ? 'border-slate-800 bg-[#0b1320]/60' : 'border-slate-100 bg-slate-50/80'
            }`}
          >
            <p className={`text-[11px] font-extrabold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              {row.label}
            </p>
            <FormInput
              label="Selling Price"
              type="number"
              prefix="$"
              value={row.sellingPrice}
              onChange={(v) => row.onSellingChange(Number(v) || 0)}
            />
            <div className="grid grid-cols-3 gap-2">
              <div>
                <p className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  Net Margin
                </p>
                <p className={`text-xs font-mono font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  {formatPct(row.netMargin)}
                </p>
              </div>
              <div>
                <p className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  GP
                </p>
                <p className={`text-xs font-mono font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  {formatMoney(row.gp)}
                </p>
              </div>
              <div>
                <p className={`text-[9px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  NP
                </p>
                <p className={`text-xs font-mono font-bold ${isDark ? 'text-teal-300' : 'text-teal-700'}`}>
                  {formatMoney(row.np)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SoftCard>
  );
};

export const AdminModuleWorkstreams: React.FC<AdminModuleWorkstreamsProps> = ({
  workstream,
  onBack,
  onShowSnackBar,
}) => {
  const { isDark } = useTheme();
  const [viewMode, setViewMode] = useState<ListViewMode>('card');
  const [searchQuery, setSearchQuery] = useState('');

  const [userAuths] = useState<UserAuthItem[]>(MOCK_USER_AUTHORIZATIONS);
  const [selectedUserAuth, setSelectedUserAuth] = useState<UserAuthItem | null>(null);

  const [exchangeRates, setExchangeRates] = useState<ExchangeRateItem[]>(MOCK_EXCHANGE_RATES);
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(todayIso());
  const [buyingRate, setBuyingRate] = useState('');
  const [sellingRate, setSellingRate] = useState('');

  const [ipList, setIpList] = useState<IpWhitelistItem[]>(MOCK_IP_WHITELISTS);
  const [showIpForm, setShowIpForm] = useState(false);
  const [ipName, setIpName] = useState('');
  const [ipFrom, setIpFrom] = useState('');
  const [ipTo, setIpTo] = useState('');
  const [ipActive, setIpActive] = useState(true);

  const [productId, setProductId] = useState('');
  const [profitPct, setProfitPct] = useState(20);
  const [fundPct, setFundPct] = useState(25);
  const [overheadPct, setOverheadPct] = useState(10);
  const [total20ftCarton, setTotal20ftCarton] = useState(0);
  const [total40ftCarton, setTotal40ftCarton] = useState(0);
  const [freightUsd20, setFreightUsd20] = useState(0);
  const [freightUsd40, setFreightUsd40] = useState(0);
  const [fobSell20, setFobSell20] = useState(0);
  const [fobSell40, setFobSell40] = useState(0);
  const [cnfSell20, setCnfSell20] = useState(0);
  const [cnfSell40, setCnfSell40] = useState(0);
  const [sellTouched, setSellTouched] = useState(false);

  const selectedProduct = useMemo(
    () => MOCK_CATALOG_PRODUCTS.find((p) => p.id === productId),
    [productId]
  );

  const baseUnitCost = selectedProduct?.exportPriceUSD ?? selectedProduct?.pricePerUnit ?? 0;
  const expenseFactor = 1 + (profitPct + fundPct + overheadPct) / 100;
  const fobSuggested = baseUnitCost * expenseFactor;
  const freightPer20 = total20ftCarton > 0 ? freightUsd20 / total20ftCarton : freightUsd20;
  const freightPer40 = total40ftCarton > 0 ? freightUsd40 / total40ftCarton : freightUsd40;
  const cnf20Suggested = fobSuggested + freightPer20;
  const cnf40Suggested = fobSuggested + freightPer40;

  useEffect(() => {
    if (!sellTouched) {
      setFobSell20(Number(fobSuggested.toFixed(4)));
      setFobSell40(Number(fobSuggested.toFixed(4)));
      setCnfSell20(Number(cnf20Suggested.toFixed(4)));
      setCnfSell40(Number(cnf40Suggested.toFixed(4)));
    }
  }, [fobSuggested, cnf20Suggested, cnf40Suggested, sellTouched, productId]);

  const calcNet = (selling: number, freightPerUnit: number) => {
    const cost = baseUnitCost + freightPerUnit;
    const gp = selling - cost;
    const netMargin = selling > 0 ? (gp / selling) * 100 : 0;
    const expenseTotal = profitPct + fundPct + overheadPct;
    const np = expenseTotal > 0 ? gp * (profitPct / expenseTotal) : gp;
    return { netMargin, gp, np };
  };

  const fob20Metrics = calcNet(fobSell20, 0);
  const fob40Metrics = calcNet(fobSell40, 0);
  const cnf20Metrics = calcNet(cnfSell20, freightPer20);
  const cnf40Metrics = calcNet(cnfSell40, freightPer40);

  const q = searchQuery.toLowerCase();

  const filteredUsers = useMemo(
    () =>
      userAuths.filter(
        (u) =>
          u.userName.toLowerCase().includes(q) ||
          u.userEmail.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q)
      ),
    [userAuths, q]
  );

  const filteredIps = useMemo(
    () =>
      ipList.filter((ip) => {
        const name = (ip.ipName || ip.description || '').toLowerCase();
        const from = ip.fromIp || ip.ipAddress || '';
        const to = ip.toIp || ip.ipAddress || '';
        return (
          name.includes(q) ||
          from.includes(searchQuery) ||
          to.includes(searchQuery) ||
          (ip.addedBy || '').toLowerCase().includes(q) ||
          (ip.networkLocation || ip.location || '').toLowerCase().includes(q)
        );
      }),
    [ipList, q, searchQuery]
  );

  const filteredRates = useMemo(
    () =>
      exchangeRates.filter(
        (r) =>
          r.id.includes(searchQuery) ||
          r.fromCurrency.toLowerCase().includes(q) ||
          r.toCurrency.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q)
      ),
    [exchangeRates, q, searchQuery]
  );

  const userPaging = usePagedList(filteredUsers, 10);
  const ipPaging = usePagedList(filteredIps, 10);
  const ratePaging = usePagedList(filteredRates, 10);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    userPaging.resetPage();
    ipPaging.resetPage();
    ratePaging.resetPage();
  };

  const handleSubmitExchangeRate = () => {
    if (!fromCurrency || !toCurrency || !effectiveDate || !buyingRate || !sellingRate) {
      onShowSnackBar?.('Please fill all required currency rate fields', 'warning');
      return;
    }
    const buy = Number(buyingRate);
    const sell = Number(sellingRate);
    const nextId = String(
      Math.max(0, ...exchangeRates.map((r) => Number(r.id) || 0)) + 1
    );
    const row: ExchangeRateItem = {
      id: nextId,
      fromCurrency,
      toCurrency,
      currencyCode: fromCurrency.slice(0, 3).toUpperCase(),
      currencyName: fromCurrency,
      symbol: '',
      buyingRate: buy,
      sellingRate: sell,
      interbankBuying: buy,
      interbankSelling: sell,
      openMarketBuying: buy,
      openMarketSelling: sell,
      effectiveDate,
      created: nowCreatedStamp(),
      lastUpdated: 'Just now',
      status: 'Active',
    };
    setExchangeRates((prev) => [row, ...prev]);
    ratePaging.resetPage();
    setFromCurrency('');
    setToCurrency('');
    setEffectiveDate(todayIso());
    setBuyingRate('');
    setSellingRate('');
    onShowSnackBar?.('Currency rate saved successfully', 'success');
  };

  const handleToggleIpStatus = (id: string) => {
    setIpList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'Active' ? 'Disabled' : 'Active' }
          : item
      )
    );
    onShowSnackBar?.('IP access rule toggled', 'info');
  };

  const handleSubmitIp = () => {
    if (!ipName.trim() || !ipFrom.trim() || !ipTo.trim()) {
      onShowSnackBar?.('Please enter IP Name, From and To', 'warning');
      return;
    }
    const row: IpWhitelistItem = {
      id: `ip_${Date.now()}`,
      ipName: ipName.trim(),
      fromIp: ipFrom.trim(),
      toIp: ipTo.trim(),
      ipAddress: ipFrom.trim(),
      description: ipName.trim(),
      networkLocation: 'Manual entry',
      location: 'Manual entry',
      addedBy: 'software.admin',
      addedDate: todayIso(),
      dateAdded: todayIso(),
      status: ipActive ? 'Active' : 'Disabled',
      allowedRoles: ['Super Admin'],
    };
    setIpList((prev) => [row, ...prev]);
    ipPaging.resetPage();
    setIpName('');
    setIpFrom('');
    setIpTo('');
    setIpActive(true);
    setShowIpForm(false);
    onShowSnackBar?.('IP whitelist rule added', 'success');
  };

  // ---- USER AUTH DETAIL ----
  if (workstream === 'user_auth' && selectedUserAuth) {
    const u = selectedUserAuth;
    return (
      <MobilePage>
        <MobileHeader
          title={u.userName}
          subtitle={`${u.role} • ${u.userEmail}`}
          onBack={() => setSelectedUserAuth(null)}
          status={u.isSuperAdmin ? 'Super Admin' : u.role}
        />
        <MobileContent>
          <SectionBand title="User Profile">
            <MobileFieldGrid>
              <InfoField label="Name" value={u.userName} />
              <InfoField label="Email" value={u.userEmail} />
              <InfoField label="Role" value={u.role} />
              <InfoField label="Last Login" value={u.lastLogin} />
              <InfoField
                label="Super Admin"
                value={u.isSuperAdmin ? 'Authorized' : 'Standard'}
                accent={u.isSuperAdmin}
              />
            </MobileFieldGrid>
          </SectionBand>

          <SectionBand title="Authorized Workstream Modules">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {u.permissions.map((p, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border space-y-1 ${
                    isDark
                      ? 'bg-slate-900/50 border-slate-800'
                      : 'bg-slate-50 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                      {p.module}
                    </span>
                    {p.canApprove && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                        Sign-Off
                      </span>
                    )}
                  </div>
                  <div
                    className={`flex items-center gap-1.5 text-[10px] flex-wrap ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {p.canView && <span className="text-emerald-600 font-semibold">View</span>}
                    {p.canCreate && <span>• Add</span>}
                    {p.canEdit && <span>• Edit</span>}
                    {p.canDelete && <span className="text-rose-600">• Del</span>}
                  </div>
                </div>
              ))}
            </div>
          </SectionBand>
        </MobileContent>
      </MobilePage>
    );
  }

  // ---- USER AUTHORIZATION LIST ----
  if (workstream === 'user_auth') {
    return (
      <MobilePage>
        <MobileHeader
          title="User Authorization"
          subtitle="Role-Based Access Control & Module Permissions"
          onBack={onBack}
        />
        <MobileContent>
          <SoftCard>
            <ListToolbar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              searchPlaceholder="Search users, roles, email…"
              onFilterClick={() => onShowSnackBar?.('Filter panel opened', 'info')}
              onColumnsClick={() => onShowSnackBar?.('Column selection opened', 'info')}
            />
          </SoftCard>

          {viewMode === 'grid' ? (
            <DataTable headers={['User', 'Role', 'Email', 'Last Login', 'Super Admin', 'Actions']}>
              {userPaging.paged.map((u) => (
                <DataRow key={u.userId} onClick={() => setSelectedUserAuth(u)}>
                  <Td className="font-semibold text-slate-900">{u.userName}</Td>
                  <Td>
                    <StatusPill status={u.role} />
                  </Td>
                  <Td className="max-w-[200px] truncate">{u.userEmail}</Td>
                  <Td>{u.lastLogin}</Td>
                  <Td>
                    <StatusPill status={u.isSuperAdmin ? 'Yes' : 'No'} />
                  </Td>
                  <Td accent>View</Td>
                </DataRow>
              ))}
            </DataTable>
          ) : (
            <CardGrid>
              {userPaging.paged.map((u) => (
                <RecordCard
                  key={u.userId}
                  title={u.userName}
                  subtitle={u.userEmail}
                  status={u.role}
                  badges={u.isSuperAdmin ? <StatusPill status="Super Admin" /> : undefined}
                  fields={[
                    { label: 'Last Login', value: u.lastLogin },
                    {
                      label: 'Super Admin',
                      value: u.isSuperAdmin ? 'Authorized' : 'Standard',
                    },
                    { label: 'Modules', value: `${u.permissions.length} assigned` },
                    { label: 'Email', value: u.userEmail },
                  ]}
                  onClick={() => setSelectedUserAuth(u)}
                  actions={[
                    {
                      label: 'View',
                      icon: 'view',
                      onClick: () => setSelectedUserAuth(u),
                    },
                  ]}
                />
              ))}
            </CardGrid>
          )}

          <ListPagination
            page={userPaging.page}
            pageSize={userPaging.pageSize}
            total={userPaging.total}
            onPageChange={userPaging.setPage}
            onPageSizeChange={userPaging.setPageSize}
          />
        </MobileContent>
      </MobilePage>
    );
  }

  // ---- EXCHANGE RATE ----
  if (workstream === 'exchange_rate') {
    return (
      <MobilePage>
        <MobileHeader
          title="Currency Rate Setup"
          subtitle="From / To currency pairs, buying & selling rates"
          onBack={onBack}
        />
        <MobileContent>
          <SoftCard>
            <h3
              className={`text-[11px] font-extrabold uppercase tracking-[0.14em] mb-3.5 ${
                isDark ? 'text-teal-200' : 'text-[#0f2b3c]'
              }`}
            >
              Currency Rate Setup
            </h3>
            <MobileFieldGrid>
              <FormInput
                label="From Currency"
                required
                as="select"
                placeholder="Select Currency"
                value={fromCurrency}
                onChange={setFromCurrency}
                options={CURRENCY_OPTIONS}
              />
              <FormInput
                label="To Currency"
                required
                as="select"
                placeholder="Select Currency"
                value={toCurrency}
                onChange={setToCurrency}
                options={CURRENCY_OPTIONS}
              />
              <FormInput
                label="Effective Date"
                required
                type="date"
                value={effectiveDate}
                onChange={setEffectiveDate}
              />
              <FormInput
                label="Buying Rate"
                required
                type="number"
                placeholder="Enter Buying Rate"
                value={buyingRate}
                onChange={setBuyingRate}
              />
              <FormInput
                label="Selling Rate"
                required
                type="number"
                placeholder="Enter Selling Rate"
                value={sellingRate}
                onChange={setSellingRate}
              />
            </MobileFieldGrid>
            <div className="mt-4 flex justify-end">
              <PrimaryBtn onClick={handleSubmitExchangeRate} className="flex-none min-w-[120px]">
                Submit
              </PrimaryBtn>
            </div>
          </SoftCard>

          <SoftCard>
            <ListToolbar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              searchPlaceholder="Search rates…"
              onFilterClick={() => onShowSnackBar?.('Filter panel opened', 'info')}
              onColumnsClick={() => onShowSnackBar?.('Column selection opened', 'info')}
            />
          </SoftCard>

          {viewMode === 'grid' ? (
            <DataTable
              headers={[
                'ID',
                'From Currency',
                'To Currency',
                'Effective Date',
                'Buying Rate',
                'Selling Rate',
                'Status',
                'Created',
                'Actions',
              ]}
            >
              {ratePaging.paged.map((rate) => (
                <DataRow key={rate.id}>
                  <Td mono>{rate.id}</Td>
                  <Td className="font-semibold">{rate.fromCurrency}</Td>
                  <Td>{rate.toCurrency}</Td>
                  <Td mono>{rate.effectiveDate}</Td>
                  <Td mono>{rate.buyingRate}</Td>
                  <Td mono>{rate.sellingRate}</Td>
                  <Td>
                    <StatusPill status={rate.status} />
                  </Td>
                  <Td>{rate.created}</Td>
                  <Td accent>Actions</Td>
                </DataRow>
              ))}
            </DataTable>
          ) : (
            <CardGrid>
              {ratePaging.paged.map((rate) => (
                <RecordCard
                  key={rate.id}
                  code={`ID ${rate.id}`}
                  title={`${rate.fromCurrency} → ${rate.toCurrency}`}
                  subtitle={`Effective ${rate.effectiveDate}`}
                  status={rate.status}
                  fields={[
                    { label: 'From Currency', value: rate.fromCurrency },
                    { label: 'To Currency', value: rate.toCurrency },
                    { label: 'Effective Date', value: rate.effectiveDate },
                    { label: 'Buying Rate', value: rate.buyingRate },
                    { label: 'Selling Rate', value: rate.sellingRate },
                    { label: 'Created', value: rate.created },
                  ]}
                  actions={[
                    {
                      label: 'View',
                      icon: 'view',
                      onClick: () =>
                        onShowSnackBar?.(
                          `${rate.fromCurrency} → ${rate.toCurrency}: ${rate.buyingRate} / ${rate.sellingRate}`,
                          'info'
                        ),
                    },
                  ]}
                />
              ))}
            </CardGrid>
          )}

          <ListPagination
            page={ratePaging.page}
            pageSize={ratePaging.pageSize}
            total={ratePaging.total}
            onPageChange={ratePaging.setPage}
            onPageSizeChange={ratePaging.setPageSize}
          />
        </MobileContent>
      </MobilePage>
    );
  }

  // ---- IP WHITELIST ----
  if (workstream === 'ip_whitelist') {
    return (
      <MobilePage>
        <MobileHeader
          title="IP Whitelist"
          subtitle="Gateway access rules — IP Name, From, To, Active"
          onBack={onBack}
          actions={
            <HeaderIconBtn
              label="Add IP"
              icon="edit"
              onClick={() => setShowIpForm((v) => !v)}
            />
          }
        />
        <MobileContent>
          {showIpForm && (
            <SoftCard>
              <h3
                className={`text-[11px] font-extrabold uppercase tracking-[0.14em] mb-3.5 ${
                  isDark ? 'text-teal-200' : 'text-[#0f2b3c]'
                }`}
              >
                Add IP Whitelist
              </h3>
              <MobileFieldGrid>
                <FormInput
                  label="IP Name"
                  required
                  placeholder="e.g. Head Office PTCL Fiber"
                  value={ipName}
                  onChange={setIpName}
                />
                <FormInput
                  label="From"
                  required
                  placeholder="From IP"
                  value={ipFrom}
                  onChange={setIpFrom}
                />
                <FormInput
                  label="To"
                  required
                  placeholder="To IP"
                  value={ipTo}
                  onChange={setIpTo}
                />
                <ActiveToggle checked={ipActive} onChange={setIpActive} label="Active" />
              </MobileFieldGrid>
              <div className="mt-4 flex gap-2 justify-end">
                <PrimaryBtn
                  onClick={() => setShowIpForm(false)}
                  className="flex-none !bg-slate-500 hover:!bg-slate-600 min-w-[88px]"
                >
                  Cancel
                </PrimaryBtn>
                <PrimaryBtn onClick={handleSubmitIp} className="flex-none min-w-[120px]">
                  <Plus className="w-3.5 h-3.5" />
                  Submit
                </PrimaryBtn>
              </div>
            </SoftCard>
          )}

          <SoftCard>
            <ListToolbar
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              searchPlaceholder="Search IP, name, location…"
              onFilterClick={() => onShowSnackBar?.('Filter panel opened', 'info')}
              onColumnsClick={() => onShowSnackBar?.('Column selection opened', 'info')}
              trailing={
                !showIpForm ? (
                  <button
                    type="button"
                    onClick={() => setShowIpForm(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-xl bg-[#0f2b3c] text-white hover:bg-[#163a50] transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add IP
                  </button>
                ) : undefined
              }
            />
          </SoftCard>

          {viewMode === 'grid' ? (
            <DataTable
              headers={['IP Name', 'From', 'To', 'Active', 'Added By', 'Date', 'Actions']}
            >
              {ipPaging.paged.map((ip) => {
                const from = ip.fromIp || ip.ipAddress || '—';
                const to = ip.toIp || ip.ipAddress || '—';
                return (
                  <DataRow key={ip.id}>
                    <Td className="font-semibold">{ip.ipName || ip.description || '—'}</Td>
                    <Td mono>{from}</Td>
                    <Td mono>{to}</Td>
                    <Td>
                      <StatusPill status={ip.status} />
                    </Td>
                    <Td>{ip.addedBy}</Td>
                    <Td>{ip.addedDate || ip.dateAdded || '—'}</Td>
                    <Td>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleIpStatus(ip.id);
                        }}
                        className="text-[11px] font-bold text-teal-700 hover:underline cursor-pointer"
                      >
                        {ip.status === 'Active' ? 'Disable' : 'Enable'}
                      </button>
                    </Td>
                  </DataRow>
                );
              })}
            </DataTable>
          ) : (
            <CardGrid>
              {ipPaging.paged.map((ip) => {
                const from = ip.fromIp || ip.ipAddress || '—';
                const to = ip.toIp || ip.ipAddress || '—';
                return (
                  <RecordCard
                    key={ip.id}
                    title={ip.ipName || ip.description || 'IP Rule'}
                    subtitle={ip.networkLocation || ip.location || ip.description}
                    status={ip.status}
                    fields={[
                      { label: 'From', value: from },
                      { label: 'To', value: to },
                      { label: 'Added By', value: ip.addedBy },
                      { label: 'Date', value: ip.addedDate || ip.dateAdded || '—' },
                    ]}
                    footer={
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleIpStatus(ip.id);
                        }}
                        className="inline-flex items-center gap-1.5 font-semibold text-teal-700 hover:underline cursor-pointer"
                      >
                        <Network className="w-3.5 h-3.5" />
                        {ip.status === 'Active' ? 'Disable Access' : 'Enable Access'}
                      </button>
                    }
                    actions={[
                      {
                        label: ip.status === 'Active' ? 'Disable' : 'Enable',
                        icon: 'edit',
                        onClick: () => handleToggleIpStatus(ip.id),
                      },
                    ]}
                  />
                );
              })}
            </CardGrid>
          )}

          <ListPagination
            page={ipPaging.page}
            pageSize={ipPaging.pageSize}
            total={ipPaging.total}
            onPageChange={ipPaging.setPage}
            onPageSizeChange={ipPaging.setPageSize}
          />
        </MobileContent>
      </MobilePage>
    );
  }

  // ---- PRICE CALCULATOR ----
  return (
    <MobilePage>
      <MobileHeader
        title="Price Calculator"
        subtitle="Operational expenses, container freight & suggestive FOB / CNF pricing"
        onBack={onBack}
      />
      <MobileContent>
        <SoftCard>
          <FormInput
            label="Select Product"
            as="select"
            placeholder="Select Product"
            value={productId}
            onChange={(v) => {
              setProductId(v);
              setSellTouched(false);
            }}
            options={PRODUCT_OPTIONS}
          />
        </SoftCard>

        <SectionBand title="Operational Expenses">
          <MobileFieldGrid>
            <FormInput
              label="Profit (Percentage)"
              type="number"
              prefix="%"
              value={profitPct}
              onChange={(v) => {
                setProfitPct(Number(v) || 0);
                setSellTouched(false);
              }}
            />
            <FormInput
              label="Fund (Percentage)"
              type="number"
              prefix="%"
              value={fundPct}
              onChange={(v) => {
                setFundPct(Number(v) || 0);
                setSellTouched(false);
              }}
            />
            <FormInput
              label="Overhead (Percentage)"
              type="number"
              prefix="%"
              value={overheadPct}
              onChange={(v) => {
                setOverheadPct(Number(v) || 0);
                setSellTouched(false);
              }}
            />
          </MobileFieldGrid>
        </SectionBand>

        <SectionBand title="Container Freight">
          <MobileFieldGrid>
            <FormInput
              label="Total 20ft Carton"
              type="number"
              value={total20ftCarton}
              onChange={(v) => {
                setTotal20ftCarton(Number(v) || 0);
                setSellTouched(false);
              }}
            />
            <FormInput
              label="Total 40ft Carton"
              type="number"
              value={total40ftCarton}
              onChange={(v) => {
                setTotal40ftCarton(Number(v) || 0);
                setSellTouched(false);
              }}
            />
            <FormInput
              label="Freight (USD) 20ft"
              type="number"
              prefix="$"
              value={freightUsd20}
              onChange={(v) => {
                setFreightUsd20(Number(v) || 0);
                setSellTouched(false);
              }}
            />
            <FormInput
              label="Freight (USD) 40ft"
              type="number"
              prefix="$"
              value={freightUsd40}
              onChange={(v) => {
                setFreightUsd40(Number(v) || 0);
                setSellTouched(false);
              }}
            />
          </MobileFieldGrid>
        </SectionBand>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <SectionBand title="Suggestive Pricing (FOB)">
            <SuggestRow
              label="Selling Price (Suggested)"
              value={formatMoney(fobSuggested)}
            />
          </SectionBand>
          <SectionBand title="Suggestive Pricing (CNF)">
            <SuggestRow
              label="Selling Price 20ft (Suggested)"
              value={formatMoney(cnf20Suggested)}
            />
            <SuggestRow
              label="Selling Price 40ft (Suggested)"
              value={formatMoney(cnf40Suggested)}
            />
          </SectionBand>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          <NetProfitCard
            title="Net Profit (FOB)"
            rows={[
              {
                key: 'fob20',
                label: 'Selling Price 20ft',
                sellingPrice: fobSell20,
                onSellingChange: (v) => {
                  setSellTouched(true);
                  setFobSell20(v);
                },
                ...fob20Metrics,
              },
              {
                key: 'fob40',
                label: 'Selling Price 40ft',
                sellingPrice: fobSell40,
                onSellingChange: (v) => {
                  setSellTouched(true);
                  setFobSell40(v);
                },
                ...fob40Metrics,
              },
            ]}
          />
          <NetProfitCard
            title="Net Profit (CNF)"
            rows={[
              {
                key: 'cnf20',
                label: 'Selling Price 20ft',
                sellingPrice: cnfSell20,
                onSellingChange: (v) => {
                  setSellTouched(true);
                  setCnfSell20(v);
                },
                ...cnf20Metrics,
              },
              {
                key: 'cnf40',
                label: 'Selling Price 40ft',
                sellingPrice: cnfSell40,
                onSellingChange: (v) => {
                  setSellTouched(true);
                  setCnfSell40(v);
                },
                ...cnf40Metrics,
              },
            ]}
          />
        </div>
      </MobileContent>
    </MobilePage>
  );
};

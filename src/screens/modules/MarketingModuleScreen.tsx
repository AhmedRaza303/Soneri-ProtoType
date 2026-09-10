/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { Eye, MoreVertical } from 'lucide-react';
import {
  MOCK_EXHIBITIONS,
  MOCK_MARKETING_LEADS,
  MOCK_MARKETING_QUOTATIONS,
  ExhibitionItem,
  MarketingLeadItem,
  MarketingQuotationItem,
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
  DetailSection,
  DetailFieldGrid,
  InfoField,
  ListViewMode,
} from '../../components/common/DataListShell';
import {
  MobilePage,
  MobileHeader,
  SoftCard,
  MobileContent,
  HeaderIconBtn,
} from '../../components/common/MobileLayout';

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
  const [viewMode, setViewMode] = useState<ListViewMode>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  const [selectedExhibition, setSelectedExhibition] = useState<ExhibitionItem | null>(null);
  const [selectedLead, setSelectedLead] = useState<MarketingLeadItem | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<MarketingQuotationItem | null>(null);

  const q = searchQuery.toLowerCase();

  const filteredExhibitions = useMemo(
    () =>
      MOCK_EXHIBITIONS.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q) ||
          e.country.toLowerCase().includes(q)
      ),
    [q]
  );

  const filteredLeads = useMemo(
    () =>
      MOCK_MARKETING_LEADS.filter(
        (l) =>
          l.leadCode.toLowerCase().includes(q) ||
          l.customerCompany.toLowerCase().includes(q) ||
          l.exhibition.toLowerCase().includes(q) ||
          l.country.toLowerCase().includes(q) ||
          l.marketingPersonal.toLowerCase().includes(q)
      ),
    [q]
  );

  const filteredQuotes = useMemo(
    () =>
      MOCK_MARKETING_QUOTATIONS.filter(
        (quote) =>
          quote.quotationNumber.toLowerCase().includes(q) ||
          quote.customerName.toLowerCase().includes(q) ||
          quote.country.toLowerCase().includes(q)
      ),
    [q]
  );

  const exPaging = usePagedList(filteredExhibitions, 10);
  const leadPaging = usePagedList(filteredLeads, 10);
  const quotePaging = usePagedList(filteredQuotes, 10);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    exPaging.resetPage();
    leadPaging.resetPage();
    quotePaging.resetPage();
  };

  const paging =
    workstream === 'exhibition'
      ? exPaging
      : workstream === 'leads'
      ? leadPaging
      : quotePaging;

  // ============================================================================
  // 1. VIEW: EXHIBITION DETAIL VIEW
  // ============================================================================
  if (workstream === 'exhibition' && selectedExhibition) {
    const ex = selectedExhibition;
    return (
      <MobilePage>
        <MobileHeader
          title="View Exhibition"
          subtitle={ex.name}
          status={ex.status}
          onBack={() => setSelectedExhibition(null)}
          actions={
            <HeaderIconBtn
              label="Export Report"
              icon="print"
              onClick={() => onShowSnackBar?.(`Exported profile for ${ex.name}`, 'success')}
            />
          }
        />

        <MobileContent>
          <DetailSection title="Exhibition Overview">
            <DetailFieldGrid>
              <InfoField label="Exhibition Name" value={ex.name} />
              <InfoField label="City" value={ex.city} />
              <InfoField label="Country" value={ex.country} />
              <InfoField label="Venue" value={ex.venue} />
              <InfoField label="Booth Number" value={ex.boothNumber} accent />
              <InfoField label="Start Date" value={ex.startDate} />
              <InfoField label="End Date" value={ex.endDate} />
              <InfoField label="Stall Area" value={`${ex.stallAreaSqm} Sqm`} />
              <InfoField
                label="Budget Allocated"
                value={`${ex.currency} ${ex.budgetAllocated.toLocaleString()}`}
              />
              <InfoField
                label="Actual Spent"
                value={`${ex.currency} ${ex.actualSpent.toLocaleString()}`}
              />
              <InfoField label="Leads Generated" value={`${ex.leadsGenerated} Verified Leads`} />
              <InfoField
                label="Potential Order"
                value={`$${ex.potentialOrderUSD?.toLocaleString() || '0'}`}
              />
            </DetailFieldGrid>
          </DetailSection>

          <DetailSection title="Key Products Displayed">
            <div className="flex flex-wrap gap-2">
              {ex.keyProductsDisplayed.map((prod, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 text-xs font-medium"
                >
                  {prod}
                </span>
              ))}
            </div>
          </DetailSection>

          <DetailSection title="Attending Company Delegates">
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
          </DetailSection>
        </MobileContent>
      </MobilePage>
    );
  }

  // ============================================================================
  // 2. VIEW: MARKETING LEAD DETAIL VIEW
  // ============================================================================
  if (workstream === 'leads' && selectedLead) {
    const lead = selectedLead;
    return (
      <MobilePage>
        <MobileHeader
          title="View Marketing Lead"
          subtitle={`${lead.leadCode} · ${lead.customerCompany}`}
          status={lead.status}
          onBack={() => setSelectedLead(null)}
          actions={
            <HeaderIconBtn
              label="Print Lead Profile"
              icon="print"
              onClick={() =>
                onShowSnackBar?.(`Exported lead details for ${lead.contactPerson}`, 'success')
              }
            />
          }
        />

        <MobileContent>
          <DetailSection title="Lead Particulars">
            <DetailFieldGrid>
              <InfoField label="Lead Code" value={lead.leadCode} mono accent />
              <InfoField label="Exhibition" value={lead.exhibition} />
              <InfoField label="Marketing Personal" value={lead.marketingPersonal} />
              <InfoField label="Customer / Company" value={lead.customerCompany} />
              <InfoField label="Country" value={lead.country} />
              <InfoField label="Place of Delivery" value={lead.placeOfDelivery} />
              <InfoField label="Status" value={<StatusPill status={lead.status} />} />
              <InfoField label="Created" value={lead.created} />
              <InfoField label="Contact Person" value={lead.contactPerson} />
              <InfoField label="Email" value={lead.email} accent />
              <InfoField label="Phone" value={lead.phone} />
              <InfoField label="Product Interest" value={lead.productInterest} />
              <InfoField label="Est. Annual Volume" value={lead.estimatedVolume} />
              <InfoField label="Stage" value={lead.stage} />
            </DetailFieldGrid>
          </DetailSection>

          <DetailSection title="Communication & Negotiation Notes">
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-md border border-slate-200">
              {lead.notes}
            </p>
          </DetailSection>
        </MobileContent>
      </MobilePage>
    );
  }

  // ============================================================================
  // 3. VIEW: MARKETING QUOTATION DETAIL VIEW
  // ============================================================================
  if (workstream === 'quotation' && selectedQuote) {
    const quoteItem = selectedQuote;
    return (
      <MobilePage>
        <MobileHeader
          title="View Quotation"
          subtitle={`${quoteItem.quotationNumber} · ${quoteItem.customerName}`}
          status={quoteItem.status}
          onBack={() => setSelectedQuote(null)}
          actions={
            <HeaderIconBtn
              label="Print Quotation"
              icon="print"
              onClick={() =>
                onShowSnackBar?.(`Exported quotation ${quoteItem.quotationNumber}`, 'success')
              }
            />
          }
        />

        <MobileContent>
          <DetailSection title="Quote Details">
            <DetailFieldGrid>
              <InfoField label="Quotation Number" value={quoteItem.quotationNumber} mono accent />
              <InfoField label="Customer / Lead Name" value={quoteItem.customerName} />
              <InfoField label="Country" value={quoteItem.country} />
              <InfoField label="Destination Port" value={quoteItem.destinationPort} />
              <InfoField label="Issue Date" value={quoteItem.date} />
              <InfoField label="Valid Until" value={quoteItem.validUntil} />
              <InfoField label="Incoterm" value={quoteItem.incoterm} />
              <InfoField label="Payment Terms" value={quoteItem.paymentTerms} />
              <InfoField
                label="Subtotal"
                value={`${quoteItem.currency} ${quoteItem.subtotal.toLocaleString()}`}
              />
              <InfoField
                label="Freight Cost"
                value={`${quoteItem.currency} ${quoteItem.freightCost.toLocaleString()}`}
              />
              <InfoField
                label="Total Quotation"
                value={`${quoteItem.currency} ${quoteItem.totalAmount.toLocaleString()}`}
              />
              <InfoField label="Status" value={<StatusPill status={quoteItem.status} />} />
            </DetailFieldGrid>
          </DetailSection>

          <DetailSection
            title="Quoted Specifications"
            action={
              <span className="text-xs text-slate-500 font-semibold">
                {quoteItem.items.length} items
              </span>
            }
          >
            <div className="overflow-x-auto -mx-1">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10.5px] font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Specifications</th>
                    <th className="py-3 px-4 text-right">Quantity</th>
                    <th className="py-3 px-4">Unit</th>
                    <th className="py-3 px-4 text-right">Rate ({quoteItem.currency})</th>
                    <th className="py-3 px-4 text-right">Amount ({quoteItem.currency})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quoteItem.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-900">{item.description}</td>
                      <td className="py-3 px-4 text-slate-600">{item.specs}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900">
                        {item.quantity.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{item.unit}</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-800">
                        {item.rate.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {item.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold border-t border-slate-200 text-slate-900">
                    <td colSpan={5} className="py-3 px-4 text-right">
                      Total Quote Amount:
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-950 font-black">
                      {quoteItem.currency} {quoteItem.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </DetailSection>
        </MobileContent>
      </MobilePage>
    );
  }

  // ============================================================================
  // 4. MAIN SCREEN: GRID VIEW & CARD VIEW
  // ============================================================================
  const titles = {
    exhibition: { title: 'Manage Exhibitions', subtitle: 'Global Trade Fairs, Pavilions & Booths' },
    leads: { title: 'Manage Marketing Leads', subtitle: 'Global Textile Buyers & Commercial Leads' },
    quotation: { title: 'Manage Quotations', subtitle: 'Commercial Export Offers & Formal Quotes' },
  };

  return (
    <MobilePage>
      <MobileHeader
        title={titles[workstream].title}
        subtitle={titles[workstream].subtitle}
        onBack={onBack}
      />

      <MobileContent>
        <SoftCard>
          <ListToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            searchPlaceholder="Search records…"
            onFilterClick={() => onShowSnackBar?.('Filter panel opened', 'info')}
            onColumnsClick={() => onShowSnackBar?.('Column selection opened', 'info')}
          />
        </SoftCard>

        {workstream === 'exhibition' &&
          (viewMode === 'grid' ? (
            <DataTable
              headers={[
                'Exhibition Name',
                'City',
                'Country',
                'Venue',
                'Start',
                'End',
                'Booth #',
                'Budget',
                'Leads',
                'Status',
                'Actions',
              ]}
            >
              {exPaging.paged.map((ex) => (
                <DataRow key={ex.id} onClick={() => setSelectedExhibition(ex)}>
                  <Td className="font-bold text-slate-900 max-w-[180px] truncate">{ex.name}</Td>
                  <Td>{ex.city}</Td>
                  <Td>{ex.country}</Td>
                  <Td className="max-w-[140px] truncate">{ex.venue}</Td>
                  <Td>{ex.startDate}</Td>
                  <Td>{ex.endDate}</Td>
                  <Td accent>{ex.boothNumber}</Td>
                  <Td mono>
                    {ex.currency} {ex.budgetAllocated.toLocaleString()}
                  </Td>
                  <Td className="font-bold text-emerald-700">{ex.leadsGenerated}</Td>
                  <Td>
                    <StatusPill status={ex.status} />
                  </Td>
                  <Td>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedExhibition(ex);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                  </Td>
                </DataRow>
              ))}
            </DataTable>
          ) : (
            <CardGrid>
              {exPaging.paged.map((ex) => (
                <RecordCard
                  key={ex.id}
                  title={ex.name}
                  subtitle={`${ex.city}, ${ex.country}`}
                  status={ex.status}
                  fields={[
                    { label: 'Venue', value: ex.venue },
                    { label: 'Booth #', value: ex.boothNumber },
                    { label: 'Dates', value: `${ex.startDate} → ${ex.endDate}` },
                    {
                      label: 'Budget',
                      value: `${ex.currency} ${ex.budgetAllocated.toLocaleString()}`,
                    },
                    { label: 'Leads', value: `${ex.leadsGenerated}` },
                    { label: 'Stall', value: `${ex.stallAreaSqm} Sqm` },
                  ]}
                  onClick={() => setSelectedExhibition(ex)}
                  actions={[
                    {
                      label: 'View',
                      icon: 'view',
                      onClick: () => setSelectedExhibition(ex),
                    },
                  ]}
                />
              ))}
            </CardGrid>
          ))}

        {workstream === 'leads' &&
          (viewMode === 'grid' ? (
            <DataTable
              headers={[
                'Code',
                'Exhibition',
                'Marketing Personal',
                'Customer/Company',
                'Country',
                'Place of Delivery',
                'Status',
                'Created',
                'Actions',
              ]}
            >
              {leadPaging.paged.map((lead) => (
                <DataRow key={lead.id} onClick={() => setSelectedLead(lead)}>
                  <Td accent mono>
                    {lead.leadCode}
                  </Td>
                  <Td className="max-w-[160px] truncate">{lead.exhibition}</Td>
                  <Td>{lead.marketingPersonal}</Td>
                  <Td className="max-w-[180px] truncate font-semibold">{lead.customerCompany}</Td>
                  <Td>{lead.country}</Td>
                  <Td className="max-w-[160px] truncate">{lead.placeOfDelivery}</Td>
                  <Td>
                    <StatusPill status={lead.status} />
                  </Td>
                  <Td className="max-w-[160px] truncate text-[11px]">{lead.created}</Td>
                  <Td className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenActionId(openActionId === lead.id ? null : lead.id);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold cursor-pointer"
                    >
                      Actions <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                    {openActionId === lead.id && (
                      <div className="absolute right-2 mt-1 w-32 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 text-left text-xs">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLead(lead);
                            setOpenActionId(null);
                          }}
                          className="w-full px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5 text-slate-700 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-teal-600" /> View
                        </button>
                      </div>
                    )}
                  </Td>
                </DataRow>
              ))}
            </DataTable>
          ) : (
            <CardGrid>
              {leadPaging.paged.map((lead) => (
                <RecordCard
                  key={lead.id}
                  code={lead.leadCode}
                  title={lead.customerCompany}
                  subtitle={lead.exhibition}
                  status={lead.status}
                  fields={[
                    { label: 'Marketing Personal', value: lead.marketingPersonal },
                    { label: 'Country', value: lead.country },
                    { label: 'Place of Delivery', value: lead.placeOfDelivery },
                    { label: 'Created', value: lead.created },
                  ]}
                  onClick={() => setSelectedLead(lead)}
                  actions={[
                    { label: 'View', icon: 'view', onClick: () => setSelectedLead(lead) },
                  ]}
                />
              ))}
            </CardGrid>
          ))}

        {workstream === 'quotation' &&
          (viewMode === 'grid' ? (
            <DataTable
              headers={[
                'Quotation #',
                'Customer Name',
                'Country',
                'Destination Port',
                'Issue Date',
                'Valid Until',
                'Total Amount',
                'Incoterm',
                'Status',
                'Actions',
              ]}
            >
              {quotePaging.paged.map((quote) => (
                <DataRow key={quote.id} onClick={() => setSelectedQuote(quote)}>
                  <Td accent mono>
                    {quote.quotationNumber}
                  </Td>
                  <Td className="font-semibold max-w-[180px] truncate">{quote.customerName}</Td>
                  <Td>{quote.country}</Td>
                  <Td className="max-w-[140px] truncate">{quote.destinationPort}</Td>
                  <Td>{quote.date}</Td>
                  <Td>{quote.validUntil}</Td>
                  <Td mono className="font-bold">
                    {quote.currency} {quote.totalAmount.toLocaleString()}
                  </Td>
                  <Td>{quote.incoterm}</Td>
                  <Td>
                    <StatusPill status={quote.status} />
                  </Td>
                  <Td>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedQuote(quote);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                  </Td>
                </DataRow>
              ))}
            </DataTable>
          ) : (
            <CardGrid>
              {quotePaging.paged.map((quote) => (
                <RecordCard
                  key={quote.id}
                  code={quote.quotationNumber}
                  title={quote.customerName}
                  subtitle={quote.country}
                  status={quote.status}
                  fields={[
                    { label: 'Port of Discharge', value: quote.destinationPort },
                    { label: 'Incoterm', value: quote.incoterm },
                    { label: 'Issue Date', value: quote.date },
                    { label: 'Valid Until', value: quote.validUntil },
                    {
                      label: 'Total',
                      value: `${quote.currency} ${quote.totalAmount.toLocaleString()}`,
                    },
                  ]}
                  onClick={() => setSelectedQuote(quote)}
                  actions={[
                    { label: 'View', icon: 'view', onClick: () => setSelectedQuote(quote) },
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

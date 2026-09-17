/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, X, ChevronDown, Calendar } from 'lucide-react';
import {
  MOCK_AWAITING_CONFIRMATIONS,
  AwaitingConfirmationItem,
} from '../../data/erpWorkstreamsData';
import {
  ListToolbar,
  StatusPill,
  ListViewMode,
  RecordCard,
  CardGrid,
  DataTable,
  DataRow,
  Td,
  usePagedList,
  ListPagination,
} from '../../components/common/DataListShell';
import {
  MobilePage,
  MobileHeader,
  SoftCard,
  MobileContent,
  HeaderIconBtn,
} from '../../components/common/MobileLayout';

type UpdateStatusOption = 'Confirmed' | 'Revert - Send Back' | '';

const STATUS_OPTIONS = ['Confirmed', 'Revert - Send Back'] as const;
const REASON_OPTIONS = [
  'NO ADVANCE RECD.',
  'DOCS INCOMPLETE',
  'PRICE MISMATCH',
  'CUSTOMER REQUEST',
  'OTHER',
] as const;

interface StatusFormErrors {
  status?: string;
  reason?: string;
  comments?: string;
  followUpDate?: string;
  followUpAction?: string;
}

interface AwaitingConfirmationsScreenProps {
  onBack: () => void;
  onShowSnackBar?: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const AwaitingConfirmationsScreen: React.FC<AwaitingConfirmationsScreenProps> = ({
  onBack,
  onShowSnackBar,
}) => {
  const [list, setList] = useState<AwaitingConfirmationItem[]>(MOCK_AWAITING_CONFIRMATIONS);
  const [selected, setSelected] = useState<AwaitingConfirmationItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ListViewMode>('card');

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusOption, setStatusOption] = useState<UpdateStatusOption>('');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [reasonOption, setReasonOption] = useState('');
  const [reasonDropdownOpen, setReasonDropdownOpen] = useState(false);
  const [followUp, setFollowUp] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpAction, setFollowUpAction] = useState('');
  const [statusComments, setStatusComments] = useState('');
  const [formErrors, setFormErrors] = useState<StatusFormErrors>({});

  const filtered = list.filter(
    (item) =>
      item.proformaCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.marketingPersonal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.placeOfDelivery.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paging = usePagedList(filtered, 10);

  const isRevert = statusOption === 'Revert - Send Back';

  const resetStatusForm = () => {
    setStatusOption('');
    setStatusDropdownOpen(false);
    setReasonOption('');
    setReasonDropdownOpen(false);
    setFollowUp(false);
    setFollowUpDate('');
    setFollowUpAction('');
    setStatusComments('');
    setFormErrors({});
  };

  const openStatusModal = () => {
    resetStatusForm();
    setShowStatusModal(true);
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    setStatusDropdownOpen(false);
    setReasonDropdownOpen(false);
  };

  const validateStatusForm = (): StatusFormErrors => {
    const errors: StatusFormErrors = {};
    if (!statusOption) errors.status = 'Field is Required';
    if (isRevert && !reasonOption) errors.reason = 'Field is Required';
    if (isRevert && !statusComments.trim()) errors.comments = 'Field is Required';
    if (followUp && !followUpDate) errors.followUpDate = 'Field is Required';
    if (followUp && !followUpAction.trim()) errors.followUpAction = 'Field is Required';
    return errors;
  };

  const handleSubmitStatus = () => {
    const errors = validateStatusForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0 || !selected || !statusOption) {
      onShowSnackBar?.('Please fill all required fields', 'warning');
      return;
    }

    const nextStatus = statusOption;
    setList((prev) =>
      prev.map((item) => (item.id === selected.id ? { ...item, status: nextStatus } : item))
    );
    setSelected({ ...selected, status: nextStatus });
    closeStatusModal();

    const bits = [
      `${selected.proformaCode} → ${nextStatus}`,
      isRevert && reasonOption ? `Reason: ${reasonOption}` : '',
      followUp ? `Follow up ${followUpDate} · ${followUpAction}` : '',
      statusComments.trim() ? statusComments.trim() : '',
    ].filter(Boolean);

    onShowSnackBar?.(bits.join(' · '), statusOption === 'Confirmed' ? 'success' : 'info');
  };

  if (selected) {
    const ac = selected;
    return (
      <MobilePage>
        <MobileHeader
          title="View Proforma"
          subtitle={`${ac.proformaCode} · ${ac.customerInfo.name}`}
          status={ac.status}
          onBack={() => setSelected(null)}
          actions={
            <HeaderIconBtn
              label="Print"
              icon="print"
              onClick={() => {
                window.print();
                onShowSnackBar?.(`Preparing ${ac.proformaCode} for printing...`, 'info');
              }}
            />
          }
        />

        <MobileContent>
          {/* Proforma Info */}
          <SoftCard>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Proforma Info
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5 text-xs">
                <p className="text-slate-900 font-semibold">{ac.companyInfo.name}</p>
                <p className="text-slate-600 leading-relaxed">{ac.companyInfo.address}</p>
                <p className="text-slate-500">{ac.companyInfo.email}</p>
                <p className="text-slate-500">{ac.companyInfo.phone}</p>
                <p className="text-slate-500">TRN: {ac.companyInfo.trn}</p>
              </div>
              <div className="space-y-1.5 text-xs border-t border-slate-100 pt-3">
                <p className="text-slate-900 font-semibold">
                  {ac.customerInfo.code} - {ac.customerInfo.name}
                </p>
                <p className="text-slate-600 leading-relaxed">{ac.customerInfo.address}</p>
              </div>
              <div className="space-y-1.5 text-xs border-t border-slate-100 pt-3">
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Proforma Code:</span>
                  <span className="font-semibold text-slate-900">{ac.proformaCode}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Sale Return Code:</span>
                  <span className="text-slate-800">{ac.saleReturnCode}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Reference Proforma:</span>
                  <span className="text-slate-800">{ac.referenceProformaCode}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Marketing Person:</span>
                  <span className="text-slate-800">{ac.marketingPersonal}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Quote:</span>
                  <span className="text-blue-600 font-semibold">{ac.quoteCode}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Price Term:</span>
                  <span className="text-slate-800">{ac.priceTerm}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Currency:</span>
                  <span className="text-slate-800">{ac.currency}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Created By:</span>
                  <span className="text-slate-800">{ac.createdBy}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Created At:</span>
                  <span className="text-slate-800">{ac.createdAt}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Expiry Date:</span>
                  <span className="text-slate-800">{ac.expiryDate}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Collection From:</span>
                  <span className="text-slate-800">{ac.collectionFrom || '-'}</span>
                </div>
              </div>
            </div>
          </SoftCard>

          {/* Buyer & Consignee */}
          <SoftCard>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Buyer & Consignee
            </h3>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div>
                <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Bill To</p>
                <p className="font-medium leading-relaxed">{ac.buyerAndConsignee.billTo}</p>
              </div>
              <div className="pt-2">
                <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Ship To</p>
                <p className="font-medium leading-relaxed">{ac.buyerAndConsignee.shipTo}</p>
              </div>
              <div className="flex justify-between gap-3 pt-2 border-t border-slate-100">
                <span className="text-slate-500">Port of Loading:</span>
                <span className="font-semibold text-right">{ac.buyerAndConsignee.portOfLoading}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Port of Discharge:</span>
                <span className="font-semibold text-right">{ac.buyerAndConsignee.portOfDischarge}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Place of Delivery:</span>
                <span className="font-semibold text-right">{ac.buyerAndConsignee.placeOfDelivery}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Mode of Delivery:</span>
                <span className="font-semibold text-right">{ac.buyerAndConsignee.modeOfDelivery}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Shipment Type:</span>
                <span className="font-semibold text-right">{ac.buyerAndConsignee.shipmentType || '-'}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Delivery Month:</span>
                <span className="font-semibold text-right">{ac.buyerAndConsignee.expectedDeliveryMonth}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Insurance:</span>
                <span className="font-semibold text-right">{ac.buyerAndConsignee.insurance || '-'}</span>
              </div>
            </div>
          </SoftCard>

          {/* Notify Parties */}
          <SoftCard>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Notify Parties
            </h3>
            <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
              {ac.notifyParties}
            </p>
          </SoftCard>

          {/* Products */}
          <SoftCard padding={false}>
            <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800">Products</h3>
              <span className="text-xs text-slate-500 font-semibold">{ac.products.length} products</span>
            </div>
            <div className="p-4 sm:px-6 sm:py-3 space-y-2.5">
              {ac.products.map((prod, idx) => (
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
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Cost Price</p>
                          <p className="text-body-sm font-semibold text-slate-900 font-mono">{prod.costPrice}</p>
                        </div>
                        <div>
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Quantity</p>
                          <p className="text-body-sm font-bold text-slate-900 font-mono">{prod.quantity}</p>
                        </div>
                        <div>
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Price</p>
                          <p className="text-body-sm font-semibold text-slate-900 font-mono">{prod.price}</p>
                        </div>
                        <div>
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Total</p>
                          <p className="text-body-sm font-black text-slate-900 font-mono tabular-nums">{prod.total}</p>
                        </div>
                        <div>
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Profit Margin</p>
                          <p className="text-body-sm font-semibold text-emerald-700 font-mono">{prod.margin}</p>
                        </div>
                        <div>
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Gross Profit</p>
                          <p className="text-body-sm font-bold text-slate-900 font-mono tabular-nums">{prod.grossProfit}</p>
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
                        <div>
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Notes</p>
                          <p className="text-body-sm font-medium text-slate-600">{prod.notes || '-'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-label font-bold uppercase tracking-wider text-slate-500">Total Qty</span>
                  <span className="text-body font-black font-mono text-slate-900">{ac.productsSummary.quantity}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Total</p>
                    <p className="text-body-sm font-black font-mono text-slate-900">{ac.productsSummary.total}</p>
                  </div>
                  <div>
                    <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Gross Profit</p>
                    <p className="text-body-sm font-bold font-mono text-slate-900">{ac.productsSummary.grossProfit}</p>
                  </div>
                  <div>
                    <p className="text-caption font-bold uppercase tracking-wider text-slate-400">CBM</p>
                    <p className="text-body-sm font-semibold font-mono text-slate-700">{ac.productsSummary.cbm}</p>
                  </div>
                  <div>
                    <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Weight</p>
                    <p className="text-body-sm font-semibold font-mono text-slate-700">{ac.productsSummary.weight}</p>
                  </div>
                </div>
              </div>
            </div>
          </SoftCard>

          {/* Other Expenses */}
          <SoftCard>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Other Expenses</h3>
            {ac.otherExpenses.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No Expense found.</p>
            ) : (
              <div className="space-y-2.5">
                {ac.otherExpenses.map((expense, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Expense Type</p>
                        <p className="text-body-sm font-semibold text-slate-900">{expense.expenseType}</p>
                      </div>
                      <div>
                        <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Charges</p>
                        <p className="text-body-sm font-bold text-slate-900 font-mono">{expense.charges}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Remarks</p>
                        <p className="text-body-sm font-medium text-slate-600">{expense.remarks || '-'}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between px-1">
                  <span className="text-body-sm font-bold text-slate-900">Total</span>
                  <span className="text-body-sm font-black text-slate-900 font-mono">
                    {ac.summary.otherExpenses}
                  </span>
                </div>
              </div>
            )}
          </SoftCard>

          {/* Discounts */}
          <SoftCard>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Discounts</h3>
            {ac.discounts.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No Discount found.</p>
            ) : (
              <div className="space-y-2.5">
                {ac.discounts.map((discount, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Discount Type</p>
                        <p className="text-body-sm font-semibold text-slate-900">{discount.discountType}</p>
                      </div>
                      <div>
                        <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Amount</p>
                        <p className="text-body-sm font-bold text-slate-900 font-mono">{discount.amount}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Remarks</p>
                        <p className="text-body-sm font-medium text-slate-600">{discount.remarks || '-'}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between px-1">
                  <span className="text-body-sm font-bold text-slate-900">Total</span>
                  <span className="text-body-sm font-black text-slate-900 font-mono">
                    {ac.summary.totalDiscount}
                  </span>
                </div>
              </div>
            )}
          </SoftCard>

          {/* Container Mapping */}
          <SoftCard padding={false}>
            <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800">Container Mapping</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {ac.containerMapping.containerSize} · {ac.containerMapping.containerName}
              </p>
            </div>
            <div className="p-4 sm:px-6 sm:py-3 space-y-2">
              {ac.containerMapping.items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 rounded-xl border border-slate-200 p-3">
                  <img
                    src={item.thumbnail}
                    alt={item.productName}
                    className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-body-sm font-bold text-slate-900 leading-snug break-words">
                      {item.productName}
                    </p>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className="text-label font-bold text-teal-700">{item.variation}</span>
                      <span className="text-body-sm font-bold font-mono text-slate-900">{item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SoftCard>

          {/* Payment Details */}
          <SoftCard>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Payment Details</h3>
            <div className="space-y-2.5">
              {ac.paymentDetails.map((pay, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Proforma Code</p>
                      <p className="text-body-sm font-bold text-blue-600 font-mono">{pay.proformaCode}</p>
                    </div>
                    <div>
                      <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Proforma Amount</p>
                      <p className="text-body-sm font-bold font-mono text-slate-900">{pay.proformaAmount}</p>
                    </div>
                    <div>
                      <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Current Amount</p>
                      <p className="text-body-sm font-semibold font-mono text-slate-800">{pay.currentAmount}</p>
                    </div>
                    <div>
                      <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Exchanged Amount</p>
                      <p className="text-body-sm font-semibold font-mono text-slate-800">{pay.exchangedAmount}</p>
                    </div>
                    <div>
                      <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Advance</p>
                      <p className="text-body-sm font-bold font-mono text-emerald-700">{pay.advance}</p>
                    </div>
                    <div>
                      <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Remaining</p>
                      <p className="text-body-sm font-bold font-mono text-amber-700">{pay.remainingAmount}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Notes</p>
                      <p className="text-body-sm font-medium text-slate-600">{pay.notes || '-'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SoftCard>

          {/* Container & Summary */}
          <SoftCard>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Container</h3>
            <ul className="space-y-1 mb-4">
              <li className="text-xs font-semibold text-slate-800 flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                {ac.containerSummary}
              </li>
            </ul>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 text-center">Summary</h3>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between gap-3">
                <span>Products Total:</span>
                <span className="font-semibold text-slate-900 font-mono">{ac.summary.productsTotal}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Total Discount:</span>
                <span className="font-mono">{ac.summary.totalDiscount}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Other Expenses:</span>
                <span className="font-mono">{ac.summary.otherExpenses}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Margin:</span>
                <span className="font-mono text-emerald-700">{ac.summary.margin}</span>
              </div>
              <div className="flex justify-between gap-3 pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                <span>Total:</span>
                <span className="font-mono underline underline-offset-2">{ac.summary.total}</span>
              </div>
            </div>
          </SoftCard>

          {/* Instructions */}
          <SoftCard>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Port of Discharge Instructions
            </h3>
            {ac.portOfDischargeInstructions.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No Instructions found.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {ac.portOfDischargeInstructions.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </SoftCard>

          <SoftCard>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Proforma Instructions
            </h3>
            <div className="flex flex-wrap gap-2">
              {ac.proformaInstructions.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </SoftCard>

          <SoftCard>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Collection Instructions
            </h3>
            <ul className="space-y-2">
              {ac.collectionInstructions.map((item, idx) => (
                <li key={idx} className="text-xs font-semibold text-slate-700 flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </SoftCard>

          <SoftCard>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Customer Remarks</h3>
            <p className="text-xs text-slate-700">{ac.customerRemarks}</p>
          </SoftCard>

          <SoftCard>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Remarks</h3>
            <p className="text-xs text-slate-700">{ac.remarks || '-'}</p>
          </SoftCard>

          <SoftCard>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Payment Terms</h3>
            <p className="text-xs text-slate-800 font-semibold">{ac.paymentTerms}</p>
          </SoftCard>

          <SoftCard>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Marketer Comments</h3>
            <span className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {ac.marketerComments}
            </span>
          </SoftCard>

          {/* Bottom Action */}
          <div className="flex justify-end pt-1 pb-2">
            <button
              type="button"
              onClick={openStatusModal}
              className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0f2b3c] hover:bg-[#1a3d52] shadow-sm cursor-pointer"
            >
              Action
            </button>
          </div>
        </MobileContent>

        {/* Update Status Modal — Action button */}
        {showStatusModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
                <h3 className="text-base font-bold text-slate-900">Update Status</h3>
                <button
                  type="button"
                  onClick={closeStatusModal}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-5 py-4 space-y-4">
                {/* Row: Status + Follow Up (+ Date/Action when YES) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Status */}
                  <div className="space-y-1.5 relative">
                    <label className="text-xs font-bold text-slate-700">
                      Status <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setStatusDropdownOpen((v) => !v);
                          setReasonDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border bg-white text-left text-sm cursor-pointer ${
                          formErrors.status ? 'border-rose-400' : 'border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <span className={statusOption ? 'font-semibold text-slate-900' : 'text-slate-400'}>
                          {statusOption || 'Select Status'}
                        </span>
                        <span className="flex items-center gap-1 shrink-0">
                          {statusOption && (
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation();
                                setStatusOption('');
                                setReasonOption('');
                                setFormErrors((prev) => ({ ...prev, status: undefined, reason: undefined }));
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.stopPropagation();
                                  setStatusOption('');
                                  setReasonOption('');
                                }
                              }}
                              className="p-0.5 rounded text-slate-400 hover:text-slate-700"
                            >
                              <X className="w-3.5 h-3.5" />
                            </span>
                          )}
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        </span>
                      </button>
                      {statusDropdownOpen && (
                        <div className="absolute left-0 right-0 top-full mt-1 z-30 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                          {STATUS_OPTIONS.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                setStatusOption(opt);
                                setStatusDropdownOpen(false);
                                if (opt !== 'Revert - Send Back') setReasonOption('');
                                setFormErrors((prev) => ({
                                  ...prev,
                                  status: undefined,
                                  reason: undefined,
                                  comments: undefined,
                                }));
                              }}
                              className={`w-full text-left px-3 py-2.5 text-sm font-medium cursor-pointer transition-colors ${
                                statusOption === opt
                                  ? 'bg-sky-50 text-sky-800'
                                  : 'text-slate-800 hover:bg-slate-50'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {formErrors.status && (
                      <p className="text-label font-semibold text-rose-500">{formErrors.status}</p>
                    )}
                  </div>

                  {/* Follow Up */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Follow Up</label>
                    <button
                      type="button"
                      onClick={() => {
                        setFollowUp((v) => {
                          if (v) {
                            setFollowUpDate('');
                            setFollowUpAction('');
                            setFormErrors((prev) => ({
                              ...prev,
                              followUpDate: undefined,
                              followUpAction: undefined,
                            }));
                          }
                          return !v;
                        });
                      }}
                      className="flex items-center gap-2 h-[42px] cursor-pointer"
                      aria-pressed={followUp}
                    >
                      <span
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                          followUp ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                            followUp ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </span>
                      <span className="text-xs font-bold text-slate-600">{followUp ? 'YES' : 'NO'}</span>
                    </button>
                  </div>

                  {/* Follow Up Date + Action — only when YES */}
                  {followUp && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">
                          Follow Up Date <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={followUpDate}
                            onChange={(e) => {
                              setFollowUpDate(e.target.value);
                              setFormErrors((prev) => ({ ...prev, followUpDate: undefined }));
                            }}
                            className={`w-full px-3 py-2.5 pr-10 rounded-xl border text-sm text-slate-800 outline-hidden focus:ring-2 focus:ring-[#0f2b3c]/30 ${
                              formErrors.followUpDate ? 'border-rose-400' : 'border-slate-300'
                            }`}
                          />
                          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                        {formErrors.followUpDate && (
                          <p className="text-label font-semibold text-rose-500">{formErrors.followUpDate}</p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">
                          Follow Up Action <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={followUpAction}
                          onChange={(e) => {
                            setFollowUpAction(e.target.value);
                            setFormErrors((prev) => ({ ...prev, followUpAction: undefined }));
                          }}
                          placeholder="Enter Follow Up Action"
                          className={`w-full px-3 py-2.5 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-[#0f2b3c]/30 ${
                            formErrors.followUpAction ? 'border-rose-400' : 'border-slate-300'
                          }`}
                        />
                        {formErrors.followUpAction && (
                          <p className="text-label font-semibold text-rose-500">{formErrors.followUpAction}</p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Reason — only for Revert */}
                {isRevert && (
                  <div className="space-y-1.5 relative max-w-md">
                    <label className="text-xs font-bold text-slate-700">
                      Reason <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setReasonDropdownOpen((v) => !v);
                          setStatusDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border bg-white text-left text-sm cursor-pointer ${
                          formErrors.reason ? 'border-rose-400' : 'border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        <span className={reasonOption ? 'font-semibold text-slate-900' : 'text-slate-400'}>
                          {reasonOption || 'Select Reason'}
                        </span>
                        <span className="flex items-center gap-1 shrink-0">
                          {reasonOption && (
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation();
                                setReasonOption('');
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.stopPropagation();
                                  setReasonOption('');
                                }
                              }}
                              className="p-0.5 rounded text-slate-400 hover:text-slate-700"
                            >
                              <X className="w-3.5 h-3.5" />
                            </span>
                          )}
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        </span>
                      </button>
                      {reasonDropdownOpen && (
                        <div className="absolute left-0 right-0 top-full mt-1 z-30 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                          {REASON_OPTIONS.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                setReasonOption(opt);
                                setReasonDropdownOpen(false);
                                setFormErrors((prev) => ({ ...prev, reason: undefined }));
                              }}
                              className={`w-full text-left px-3 py-2.5 text-sm font-medium cursor-pointer transition-colors ${
                                reasonOption === opt
                                  ? 'bg-sky-50 text-sky-800'
                                  : 'text-slate-800 hover:bg-slate-50'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {formErrors.reason && (
                      <p className="text-label font-semibold text-rose-500">{formErrors.reason}</p>
                    )}
                  </div>
                )}

                {/* Comments */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Comments {isRevert && <span className="text-rose-500">*</span>}
                  </label>
                  <textarea
                    value={statusComments}
                    onChange={(e) => {
                      setStatusComments(e.target.value);
                      setFormErrors((prev) => ({ ...prev, comments: undefined }));
                    }}
                    rows={4}
                    placeholder="Enter Comments"
                    className={`w-full px-3 py-2.5 rounded-xl border text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0f2b3c]/30 outline-hidden resize-y min-h-[96px] ${
                      formErrors.comments ? 'border-rose-400' : 'border-slate-300'
                    }`}
                  />
                  {formErrors.comments && (
                    <p className="text-label font-semibold text-rose-500">{formErrors.comments}</p>
                  )}
                </div>
              </div>

              <div className="px-5 py-4 border-t border-slate-100 flex justify-end sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={handleSubmitStatus}
                  className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0f2b3c] hover:bg-[#1a3d52] cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </MobilePage>
    );
  }

  return (
    <MobilePage>
      <MobileHeader
        title="Awaiting Confirmations"
        subtitle="Finance Order · Customer proformas pending confirmation"
        onBack={onBack}
      />

      <MobileContent>
        <SoftCard padding={false}>
          <ListToolbar
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              paging.setPage(1);
            }}
            searchPlaceholder="Search proforma, customer, company..."
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onFilterClick={() => onShowSnackBar?.('Filter panel opened', 'info')}
            onColumnsClick={() => onShowSnackBar?.('Column selection opened', 'info')}
          />
        </SoftCard>

        {viewMode === 'grid' ? (
          <SoftCard padding={false}>
            <DataTable
              headers={[
                'Proforma Code',
                'Customer',
                'Company',
                'Marketing',
                'Place Of Delivery',
                'Status',
                'Amount',
                'Action',
              ]}
            >
              {paging.paged.map((item) => (
                <DataRow key={item.id} onClick={() => setSelected(item)}>
                  <Td accent mono>
                    {item.proformaCode}
                  </Td>
                  <Td className="max-w-[160px] truncate">{item.customer}</Td>
                  <Td className="max-w-[140px] truncate">{item.company}</Td>
                  <Td>{item.marketingPersonal}</Td>
                  <Td>{item.placeOfDelivery}</Td>
                  <Td>
                    <StatusPill status={item.status} />
                  </Td>
                  <Td mono className="font-bold">
                    {item.amount}
                  </Td>
                  <Td>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(item);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" /> View
                    </button>
                  </Td>
                </DataRow>
              ))}
            </DataTable>
          </SoftCard>
        ) : (
          <CardGrid>
            {paging.paged.map((item) => (
              <RecordCard
                key={item.id}
                title={item.proformaCode}
                subtitle={item.customer}
                badges={<StatusPill status={item.status} />}
                onClick={() => setSelected(item)}
                fields={[
                  { label: 'Company', value: item.company },
                  { label: 'Marketing', value: item.marketingPersonal },
                  { label: 'Delivery', value: item.placeOfDelivery },
                  { label: 'Amount', value: item.amount },
                  { label: 'Created', value: item.createdAt },
                ]}
                actions={[
                  {
                    label: 'View',
                    icon: 'view',
                    onClick: () => setSelected(item),
                  },
                ]}
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
    </MobilePage>
  );
};

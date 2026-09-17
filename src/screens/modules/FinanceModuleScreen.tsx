/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Eye, Pencil, Check, X, Calendar } from 'lucide-react';
import {
  MOCK_PO_APPROVALS,
  MOCK_PROFORMA_SUPPLIERS,
  POApprovalItem,
  ProformaSupplierItem,
  ProformaSupplierProduct,
} from '../../data/erpWorkstreamsData';
import {
  ListToolbar,
  StatusPill,
  ListViewMode,
} from '../../components/common/DataListShell';
import {
  MobilePage,
  MobileHeader,
  SoftCard,
  MobileContent,
  HeaderIconBtn,
} from '../../components/common/MobileLayout';
import {
  UpdateStatusModal,
  UpdateStatusPayload,
} from '../../components/common/UpdateStatusModal';

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
  const [viewMode, setViewMode] = useState<ListViewMode>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [poList, setPoList] = useState<POApprovalItem[]>(MOCK_PO_APPROVALS);
  const [proformaList, setProformaList] = useState<ProformaSupplierItem[]>(MOCK_PROFORMA_SUPPLIERS);

  // Selected for View Details
  const [selectedPO, setSelectedPO] = useState<POApprovalItem | null>(null);
  const [selectedProforma, setSelectedProforma] = useState<ProformaSupplierItem | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Proforma supplier product editing
  const [profProducts, setProfProducts] = useState<ProformaSupplierProduct[]>([]);
  const [editingSupplierIdx, setEditingSupplierIdx] = useState<number | null>(null);
  const [editSupplier, setEditSupplier] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editRemarks, setEditRemarks] = useState('');
  const [pricingModalIdx, setPricingModalIdx] = useState<number | null>(null);
  const [pricingTab, setPricingTab] = useState<'product' | 'collection'>('product');
  const [moveRequisition, setMoveRequisition] = useState(false);
  const [profFollowUp, setProfFollowUp] = useState(true);
  const [profFollowUpDate, setProfFollowUpDate] = useState('');
  const [profFollowUpAction, setProfFollowUpAction] = useState('');

  useEffect(() => {
    if (selectedProforma?.products) {
      setProfProducts(selectedProforma.products.map((p) => ({ ...p })));
    } else {
      setProfProducts([]);
    }
    setEditingSupplierIdx(null);
    setPricingModalIdx(null);
    setPricingTab('product');
    setMoveRequisition(false);
    setProfFollowUp(true);
    setProfFollowUpDate('');
    setProfFollowUpAction('');
  }, [selectedProforma?.id]);

  const handlePOStatusSubmit = (payload: UpdateStatusPayload) => {
    if (!selectedPO) return;
    const nextStatus: POApprovalItem['status'] =
      payload.status === 'Confirmed' ? 'Approved' : 'Rejected';

    setPoList((prev) =>
      prev.map((item) => (item.id === selectedPO.id ? { ...item, status: nextStatus } : item))
    );
    setSelectedPO({ ...selectedPO, status: nextStatus });
    setShowStatusModal(false);

    const bits = [
      `PO ${selectedPO.poNumber} → ${payload.status}`,
      payload.reason ? `Reason: ${payload.reason}` : '',
      payload.followUp ? `Follow up ${payload.followUpDate} · ${payload.followUpAction}` : '',
      payload.comments || '',
    ].filter(Boolean);
    onShowSnackBar?.(bits.join(' · '), payload.status === 'Confirmed' ? 'success' : 'warning');
  };

  const openSupplierEdit = (idx: number) => {
    const prod = profProducts[idx];
    setEditingSupplierIdx(idx);
    setEditSupplier(prod.supplier);
    setEditPrice(prod.supplierPrice.replace(/^\$\s?/, ''));
    setEditRemarks(prod.supplierRemarks === '-' ? '' : prod.supplierRemarks);
  };

  const cancelSupplierEdit = () => {
    setEditingSupplierIdx(null);
  };

  const updateSupplierEdit = (idx: number) => {
    if (!editSupplier.trim() || !editPrice.trim()) {
      onShowSnackBar?.('Supplier and Price are required', 'warning');
      return;
    }
    const priceFormatted = editPrice.trim().startsWith('$')
      ? editPrice.trim()
      : `$ ${editPrice.trim()}`;
    setProfProducts((prev) =>
      prev.map((p, i) =>
        i === idx
          ? {
              ...p,
              supplier: editSupplier.trim(),
              supplierPrice: priceFormatted,
              supplierRemarks: editRemarks.trim() || '-',
              costPrice: priceFormatted.includes('.')
                ? `$ ${parseFloat(priceFormatted.replace(/[^0-9.]/g, '')).toFixed(4)}`
                : priceFormatted,
            }
          : p
      )
    );
    setEditingSupplierIdx(null);
    onShowSnackBar?.('Supplier updated', 'success');
  };

  const selectPricingOption = (supplier: string, costPrice: string) => {
    if (pricingModalIdx === null) return;
    const idx = pricingModalIdx;
    const numeric = costPrice.replace(/[^0-9.]/g, '');
    setProfProducts((prev) =>
      prev.map((p, i) =>
        i === idx
          ? {
              ...p,
              supplier,
              supplierPrice: `$ ${numeric}`,
              costPrice: costPrice.startsWith('$') ? costPrice : `$ ${numeric}`,
            }
          : p
      )
    );
    setEditingSupplierIdx(idx);
    setEditSupplier(supplier);
    setEditPrice(numeric);
    setPricingModalIdx(null);
    onShowSnackBar?.(`Selected ${supplier}`, 'success');
  };

  // ============================================================================
  // 1. VIEW: PO APPROVAL DETAIL VIEW
  // ============================================================================
  if (workstream === 'po_approval' && selectedPO) {
    const po = selectedPO;
    return (
      <MobilePage>
        <MobileHeader
          title="View PO Approval"
          subtitle={`${po.poNumber} · ${po.supplierName}`}
          status={po.status}
          onBack={() => setSelectedPO(null)}
          actions={
            <HeaderIconBtn
              label="Print PO"
              icon="print"
              variant="soft"
              onClick={() => onShowSnackBar?.(`Printed PO voucher for ${po.poNumber}`, 'info')}
            />
          }
        />

        <MobileContent>
          {/* Main Info Card */}
          <SoftCard>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </SoftCard>

          {/* Products */}
          <SoftCard padding={false}>
            <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800">Products</h3>
              <span className="text-xs text-slate-500 font-semibold">{po.items.length} products</span>
            </div>
            <div className="p-4 sm:px-6 sm:py-3 space-y-2.5">
              {po.items.map((prod, idx) => (
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
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Sale Price</p>
                          <p className="text-body-sm font-semibold text-slate-900 font-mono">{prod.salePrice}</p>
                        </div>
                        <div>
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Supplier Price</p>
                          <p className="text-body-sm font-semibold text-slate-900 font-mono">{prod.supplierPrice}</p>
                        </div>
                        <div>
                          <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Quantity</p>
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
                  <span className="text-label font-bold uppercase tracking-wider text-slate-500">Total</span>
                  <span className="text-body font-black font-mono text-slate-900">
                    {po.productsSummary?.quantity ?? '-'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Total Amount</p>
                    <p className="text-body-sm font-black font-mono text-slate-900">
                      {po.productsSummary?.total ?? '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Gross Profit</p>
                    <p className="text-body-sm font-bold font-mono text-slate-900">
                      {po.productsSummary?.grossProfit ?? '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-caption font-bold uppercase tracking-wider text-slate-400">CBM</p>
                    <p className="text-body-sm font-semibold font-mono text-slate-700">
                      {po.productsSummary?.cbm ?? '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Weight</p>
                    <p className="text-body-sm font-semibold font-mono text-slate-700">
                      {po.productsSummary?.weight ?? '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SoftCard>

          {/* Other Expenses & Discounts */}
          <div className="grid grid-cols-1 gap-3">
            <SoftCard>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Other Expenses</h3>
              {(po.otherExpenses?.length ?? 0) === 0 ? (
                <p className="text-xs text-slate-500 italic">No Expense found.</p>
              ) : (
                <div className="space-y-2.5">
                  {po.otherExpenses!.map((expense, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 space-y-2">
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
                  <div className="flex items-center justify-between px-1 pt-1">
                    <span className="text-body-sm font-bold text-slate-900">Total</span>
                    <span className="text-body-sm font-black text-slate-900 font-mono">
                      {po.summary?.otherExpenses ?? '-'}
                    </span>
                  </div>
                </div>
              )}
            </SoftCard>

            <SoftCard>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Discounts</h3>
              {(po.discounts?.length ?? 0) === 0 ? (
                <p className="text-xs text-slate-500 italic">No Discount found.</p>
              ) : (
                <div className="space-y-2.5">
                  {po.discounts!.map((discount, idx) => (
                    <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 space-y-2">
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
                  <div className="flex items-center justify-between px-1 pt-1">
                    <span className="text-body-sm font-bold text-slate-900">Total</span>
                    <span className="text-body-sm font-black text-slate-900 font-mono">
                      {po.summary?.discount ?? '-'}
                    </span>
                  </div>
                </div>
              )}
            </SoftCard>
          </div>

          {/* Container & Summary */}
          <div className="grid grid-cols-1 gap-3">
            <SoftCard>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Container</h3>
              <ul className="space-y-1">
                <li className="text-xs font-semibold text-slate-800 flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                  {po.containerSummary || '-'}
                </li>
              </ul>
            </SoftCard>

            <SoftCard>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 text-center">Summary</h3>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between gap-3">
                  <span>Products Total:</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    {po.summary?.productsTotal ?? '-'}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Other Expenses:</span>
                  <span className="font-mono">{po.summary?.otherExpenses ?? '-'}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Discount:</span>
                  <span className="font-mono">{po.summary?.discount ?? '-'}</span>
                </div>
                <div className="flex justify-between gap-3 pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
                  <span>Total:</span>
                  <span className="font-mono underline underline-offset-2">{po.summary?.total ?? '-'}</span>
                </div>
              </div>
            </SoftCard>
          </div>

          {/* Port Of Discharge Instructions */}
          <SoftCard>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Port of Discharge Instructions
            </h3>
            {(po.portOfDischargeInstructions?.length ?? 0) === 0 ? (
              <p className="text-xs text-slate-500 italic">No Instructions found.</p>
            ) : (
              <div className="pt-1 flex flex-wrap gap-2">
                {po.portOfDischargeInstructions!.map((instruction, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                  >
                    {instruction}
                  </span>
                ))}
              </div>
            )}
          </SoftCard>

          {/* Requisition Instructions */}
          <SoftCard>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Requisition Instructions
            </h3>
            {(po.requisitionInstructions?.length ?? 0) === 0 ? (
              <p className="text-xs text-slate-500 italic">No instructions found.</p>
            ) : (
              <ul className="space-y-2">
                {po.requisitionInstructions!.map((instruction, idx) => (
                  <li key={idx} className="text-xs font-semibold text-emerald-700 flex items-start gap-2 leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            )}
          </SoftCard>

          {/* Justification Notes */}
          <SoftCard>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Purchase Order Notes</h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-md border border-slate-200">
              {po.notes}
            </p>
          </SoftCard>

          <div className="flex justify-end pt-1 pb-2">
            <button
              type="button"
              onClick={() => setShowStatusModal(true)}
              className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0f2b3c] hover:bg-[#1a3d52] shadow-sm cursor-pointer"
            >
              Action
            </button>
          </div>
        </MobileContent>

        <UpdateStatusModal
          open={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          onSubmit={handlePOStatusSubmit}
          onValidationError={() => onShowSnackBar?.('Please fill all required fields', 'warning')}
        />
      </MobilePage>
    );
  }

  // ============================================================================
  // 2. VIEW: PROFORMA SUPPLIER DETAIL VIEW
  // ============================================================================
  if (workstream === 'proforma_supplier' && selectedProforma) {
    const prof = selectedProforma;
    const pricingProduct = pricingModalIdx !== null ? profProducts[pricingModalIdx] : null;
    const pricingRows =
      pricingProduct == null
        ? []
        : pricingTab === 'product'
          ? pricingProduct.pricingOptions
          : pricingProduct.collectionPricingOptions || [];

    return (
      <MobilePage>
        <MobileHeader
          title="View Proforma Supplier"
          subtitle={`${prof.proformaNumber} · ${prof.supplierName}`}
          status={prof.status}
          onBack={() => setSelectedProforma(null)}
          actions={
            <HeaderIconBtn
              label="Print Proforma"
              icon="print"
              onClick={() => onShowSnackBar?.(`Exported proforma voucher ${prof.proformaNumber}`, 'info')}
            />
          }
        />

        <MobileContent>
          {/* Main Info Card */}
          <SoftCard>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </SoftCard>

          {/* Products */}
          <SoftCard padding={false}>
            <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800">Products</h3>
              <span className="text-xs text-slate-500 font-semibold">{profProducts.length} products</span>
            </div>
            <div className="p-4 sm:px-6 sm:py-3 space-y-3">
              {profProducts.map((prod, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-xs space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={prod.thumbnail}
                      alt={prod.productName}
                      className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-body-sm font-extrabold text-blue-700 leading-snug break-words">
                        {prod.productName}
                      </p>
                      {prod.variation && (
                        <span className="inline-flex mt-1.5 px-2 py-0.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-label font-bold">
                          {prod.variation}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Cost Price</p>
                      <button
                        type="button"
                        onClick={() => {
                          setPricingModalIdx(idx);
                          setPricingTab('product');
                        }}
                        className="inline-flex items-center gap-1.5 text-body-sm font-bold text-slate-900 font-mono hover:text-blue-700 cursor-pointer"
                      >
                        {prod.costPrice}
                        <Pencil className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>
                    <div>
                      <p className="text-caption font-bold uppercase tracking-wider text-slate-400">KG Price</p>
                      <p className="text-body-sm font-semibold text-slate-900 font-mono">{prod.kgPrice}</p>
                    </div>
                    <div>
                      <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Quantity</p>
                      <p className="text-body-sm font-bold text-slate-900 font-mono">{prod.quantity}</p>
                    </div>
                    <div>
                      <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Sale Price</p>
                      <p className="text-body-sm font-semibold text-slate-900 font-mono">{prod.salePrice}</p>
                    </div>
                    <div>
                      <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Total</p>
                      <p className="text-body-sm font-black text-slate-900 font-mono tabular-nums">{prod.total}</p>
                    </div>
                    <div>
                      <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Margin</p>
                      <p className="text-body-sm font-semibold text-emerald-700 font-mono">{prod.margin}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Gross Profit</p>
                      <p className="text-body-sm font-bold text-slate-900 font-mono">{prod.grossProfit}</p>
                    </div>
                  </div>

                  {/* Supplier panel */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-caption font-bold uppercase tracking-wider text-slate-500">Supplier</p>
                      {editingSupplierIdx !== idx && (
                        <button
                          type="button"
                          onClick={() => openSupplierEdit(idx)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-label font-bold text-sky-700 border border-sky-200 bg-white hover:bg-sky-50 cursor-pointer"
                        >
                          <Pencil className="w-3 h-3" /> Edit
                        </button>
                      )}
                    </div>

                    {editingSupplierIdx === idx ? (
                      <div className="space-y-2.5">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">
                            Supplier <span className="text-rose-500">*</span>
                          </label>
                          <select
                            value={editSupplier}
                            onChange={(e) => setEditSupplier(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white outline-hidden focus:ring-2 focus:ring-[#0f2b3c]/30"
                          >
                            {[
                              prod.supplier,
                              ...prod.pricingOptions.map((o) => o.supplier),
                              ...(prod.collectionPricingOptions?.map((o) => o.supplier) || []),
                            ]
                              .filter((v, i, a) => a.indexOf(v) === i)
                              .map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">
                            Price (Carton) <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">$</span>
                            <input
                              type="text"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 text-sm font-mono outline-hidden focus:ring-2 focus:ring-[#0f2b3c]/30"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Remarks</label>
                          <textarea
                            value={editRemarks}
                            onChange={(e) => setEditRemarks(e.target.value)}
                            rows={2}
                            placeholder="Enter Remarks"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-[#0f2b3c]/30 resize-y"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={cancelSupplierEdit}
                            className="px-3.5 py-2 rounded-xl text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => updateSupplierEdit(idx)}
                            className="px-3.5 py-2 rounded-xl text-sm font-bold text-white bg-[#0f2b3c] hover:bg-[#1a3d52] cursor-pointer"
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between gap-2">
                          <span className="text-slate-500">Supplier:</span>
                          <span className="font-semibold text-slate-900 text-right">{prod.supplier}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-slate-500">Price:</span>
                          <span className="font-bold font-mono text-slate-900">{prod.supplierPrice}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-slate-500">Remarks:</span>
                          <span className="font-medium text-slate-700">{prod.supplierRemarks || '-'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-label font-bold uppercase tracking-wider text-slate-500">Total</span>
                  <span className="text-body font-black font-mono text-slate-900">
                    {prof.productsSummary?.quantity ?? '-'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-caption font-bold uppercase tracking-wider text-slate-400">KG Price</p>
                    <p className="text-body-sm font-semibold font-mono text-slate-700">
                      {prof.productsSummary?.kgPrice ?? '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Total</p>
                    <p className="text-body-sm font-black font-mono text-slate-900">
                      {prof.productsSummary?.total ?? '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Margin</p>
                    <p className="text-body-sm font-semibold font-mono text-emerald-700">
                      {prof.productsSummary?.margin ?? '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-caption font-bold uppercase tracking-wider text-slate-400">Gross Profit</p>
                    <p className="text-body-sm font-bold font-mono text-slate-900">
                      {prof.productsSummary?.grossProfit ?? '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SoftCard>

          <SoftCard>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Customer Remarks</h3>
            <p className="text-xs text-slate-700">{prof.customerRemarks || '-'}</p>
          </SoftCard>

          <SoftCard>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Container</h3>
            <ul className="space-y-1">
              <li className="text-xs font-semibold text-slate-800 flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                {prof.containerSummary || '-'}
              </li>
            </ul>
          </SoftCard>

          {/* Follow Up */}
          <SoftCard>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Follow Up</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Move Requisition</label>
                <button
                  type="button"
                  onClick={() => setMoveRequisition((v) => !v)}
                  className="flex items-center gap-2 h-[42px] cursor-pointer"
                >
                  <span
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                      moveRequisition ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        moveRequisition ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </span>
                  <span className="text-xs font-bold text-slate-600">{moveRequisition ? 'YES' : 'NO'}</span>
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Follow Up</label>
                <button
                  type="button"
                  onClick={() => setProfFollowUp((v) => !v)}
                  className="flex items-center gap-2 h-[42px] cursor-pointer"
                >
                  <span
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                      profFollowUp ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                        profFollowUp ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </span>
                  <span className="text-xs font-bold text-slate-600">{profFollowUp ? 'YES' : 'NO'}</span>
                </button>
              </div>

              {profFollowUp && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Follow Up Date <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={profFollowUpDate}
                        onChange={(e) => setProfFollowUpDate(e.target.value)}
                        className="w-full px-3 py-2.5 pr-10 rounded-xl border border-slate-300 text-sm outline-hidden focus:ring-2 focus:ring-[#0f2b3c]/30"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Follow Up Action <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={profFollowUpAction}
                      onChange={(e) => setProfFollowUpAction(e.target.value)}
                      placeholder="Enter Follow Up Action"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm placeholder:text-slate-400 outline-hidden focus:ring-2 focus:ring-[#0f2b3c]/30"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => {
                  if (profFollowUp && (!profFollowUpDate || !profFollowUpAction.trim())) {
                    onShowSnackBar?.('Please fill Follow Up Date and Action', 'warning');
                    return;
                  }
                  onShowSnackBar?.('Follow up submitted', 'success');
                }}
                className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0f2b3c] hover:bg-[#1a3d52] cursor-pointer"
              >
                Submit
              </button>
            </div>
          </SoftCard>
        </MobileContent>

        {/* Product / Collection Pricing Modal */}
        {pricingModalIdx !== null && pricingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-4 border-b border-slate-200">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setPricingTab('product')}
                    className={`py-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                      pricingTab === 'product'
                        ? 'border-[#0f2b3c] text-[#0f2b3c]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Product Pricing
                  </button>
                  <button
                    type="button"
                    onClick={() => setPricingTab('collection')}
                    className={`py-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                      pricingTab === 'collection'
                        ? 'border-[#0f2b3c] text-[#0f2b3c]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Collection Pricing
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setPricingModalIdx(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-800 leading-snug">
                  {pricingProduct.productName}
                </p>
              </div>

              <div className="overflow-y-auto p-4 space-y-2">
                <div className="grid grid-cols-[1fr_auto_auto] gap-2 px-1 text-caption font-bold uppercase tracking-wider text-slate-400">
                  <span>Supplier</span>
                  <span className="text-right min-w-[72px]">Cost Price</span>
                  <span className="text-right min-w-[80px]">Action</span>
                </div>
                {pricingRows.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4 text-center">No pricing found.</p>
                ) : (
                  pricingRows.map((row, rIdx) => (
                    <div
                      key={`${row.supplier}-${rIdx}`}
                      className="grid grid-cols-[1fr_auto_auto] gap-2 items-center rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5"
                    >
                      <p className="text-xs font-semibold text-slate-900 leading-snug pr-2">{row.supplier}</p>
                      <p className="text-xs font-bold font-mono text-slate-900 min-w-[72px] text-right">
                        {row.costPrice}
                      </p>
                      <button
                        type="button"
                        onClick={() => selectPricingOption(row.supplier, row.costPrice)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-label font-bold text-sky-700 border border-sky-300 bg-white hover:bg-sky-50 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" /> Select
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </MobilePage>
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
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search records…"
            onFilterClick={() => onShowSnackBar?.('Filter panel opened', 'info')}
            onColumnsClick={() => onShowSnackBar?.('Column selection opened', 'info')}
          />
        </SoftCard>

        {/* =========================================================================
            WORKSTREAM: PO APPROVAL
           ========================================================================= */}
        {workstream === 'po_approval' && (
          <>
            {viewMode === 'grid' ? (
              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 uppercase text-body-sm font-semibold border-b border-slate-200">
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
                              className={`inline-flex items-center px-2 py-0.5 rounded text-body-sm font-semibold ${
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
                            <StatusPill status={po.status} />
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
                      <StatusPill status={po.status} />
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
                      <span className="text-body-sm text-slate-400 font-medium">{po.items.length} items</span>
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
                    <thead className="bg-slate-50 text-slate-600 uppercase text-body-sm font-semibold border-b border-slate-200">
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
                            <StatusPill status={prof.status} />
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
                      <StatusPill status={prof.status} />
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
                      <span className="text-body-sm text-slate-400 font-medium">{prof.items.length} items</span>
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
      </MobileContent>
    </MobilePage>
  );
};

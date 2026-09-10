/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Landmark,
  Ship,
  ShoppingBag,
  TrendingUp,
  BarChart3,
  Megaphone,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { AppBar } from '../components/common/AppBar';
import { MenuTile } from '../components/common/ModuleCards';
import { SearchField } from '../components/common/SearchField';
import { ERP_MODULES } from '../data/mockData';
import { ERPModule, ScreenId, StaticPreviewConfig } from '../types';

interface StaticModuleScreenProps {
  moduleId: string;
  onBack: () => void;
  onOpenPreview: (config: StaticPreviewConfig) => void;
  onNavigate?: (screen: ScreenId) => void;
}

const ICON_MAP = {
  finance: Landmark,
  export: Ship,
  purchase: ShoppingBag,
  sales: TrendingUp,
  reports: BarChart3,
  marketing: Megaphone,
  catalog: Layers,
};

const WORKSTREAM_ROUTE_MAP: Record<string, ScreenId> = {
  fin_po: 'finance_po_approval',
  fin_proforma: 'finance_proforma_supplier',
  exp_container: 'export_container_tracking',
  pur_readiness: 'purchase_readiness',
  pur_req: 'purchase_requisition',
  pur_po: 'purchase_order',
  pur_inv: 'purchase_invoice',
  pur_tracking: 'purchase_supplier_tracking',
  rep_pur_sum: 'report_purchase_summary',
  rep_container: 'report_pl_container',
  rep_export_doc: 'report_export_document',
  rep_shipment_pnl: 'report_shipment_pnl',
  rep_order: 'report_order',
  rep_unconfirmed: 'report_unconfirmed',
  rep_supp_aging: 'report_supplier_aging',
  rep_cust_aging: 'report_customer_aging',
  rep_payable: 'report_payable',
  rep_receivable: 'report_receivable',
  rep_overall_pnl: 'report_overall_pnl',
  rep_cashflow: 'report_cashflow',
  rep_trial: 'report_trial',
  rep_inventory: 'report_inventory',
  rep_party: 'report_party',
  rep_sales_sum: 'report_sales_summary',
  sal_proforma: 'sales_proforma_invoice',
  sal_inv: 'sales_invoice',
  sal_payment: 'sales_customer_payment',
  mkt_exhibition: 'marketing_exhibition',
  mkt_leads: 'marketing_leads',
  mkt_quotation: 'marketing_quotation',
  cat_category: 'catalog_category',
  cat_collection: 'catalog_collection',
  cat_brand: 'catalog_brand',
  cat_products: 'catalog_products',
};

export const StaticModuleScreen: React.FC<StaticModuleScreenProps> = ({
  moduleId,
  onBack,
  onOpenPreview,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const moduleData = ERP_MODULES.find((m) => m.id === moduleId);

  if (!moduleData) {
    return (
      <div className="p-6 text-center">
        <p>Module not found.</p>
        <button onClick={onBack} className="mt-4 text-xs font-bold text-slate-900">
          Go Back
        </button>
      </div>
    );
  }

  const IconComponent =
    ICON_MAP[moduleId as keyof typeof ICON_MAP] || Layers;

  const filteredItems = (moduleData.items || []).filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-full pb-24 bg-slate-50/60">
      <AppBar
        title={moduleData.name}
        subtitle={`${moduleData.items?.length || 0} Workstreams Available`}
        showBack
        onBack={onBack}
      />

      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-4">
        {/* Module Banner */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
            <IconComponent className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-900 truncate">
              {moduleData.name} Workflows
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              {moduleData.description}
            </p>
          </div>
        </div>

        {/* Search for large lists like Reports */}
        {(moduleData.items?.length || 0) > 5 && (
          <SearchField
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={`Search ${moduleData.name} items...`}
          />
        )}

        {/* Section Header */}
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Available Operations
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            {filteredItems.length} options
          </span>
        </div>

        {/* Clickable Menu Tiles */}
        <div className="space-y-2.5">
          {filteredItems.map((item) => {
            const targetScreen = WORKSTREAM_ROUTE_MAP[item.id];
            return (
              <MenuTile
                key={item.id}
                id={`item-${item.id}`}
                title={item.title}
                subtitle={item.subtitle}
                badge={item.badge}
                onClick={() => {
                  if (targetScreen && onNavigate) {
                    onNavigate(targetScreen);
                  } else {
                    onOpenPreview({
                      moduleName: moduleData.name,
                      featureTitle: item.title,
                      description: item.subtitle,
                      backScreen: (`module_${moduleId}` as ScreenId),
                    });
                  }
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

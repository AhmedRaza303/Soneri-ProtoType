/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FolderTree,
  Bookmark,
  Package,
  Search,
  ChevronRight,
  Printer,
  Sparkles,
  Layers,
  Tag,
  CheckCircle2,
  Box,
  SlidersHorizontal,
} from 'lucide-react';
import { AppBar } from '../../components/common/AppBar';
import { SearchField } from '../../components/common/SearchField';
import {
  MOCK_CATALOG_CATEGORIES,
  MOCK_COLLECTION_BRANDS,
  MOCK_CATALOG_PRODUCTS,
  CatalogCategoryItem,
  CollectionBrandItem,
  CatalogProductItem,
} from '../../data/erpWorkstreamsData';

interface CatalogModuleScreenProps {
  workstream: 'category' | 'collection_brand' | 'products';
  onBack: () => void;
  onShowSnackBar?: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const CatalogModuleScreen: React.FC<CatalogModuleScreenProps> = ({
  workstream,
  onBack,
  onShowSnackBar,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedCategory, setSelectedCategory] = useState<CatalogCategoryItem | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<CollectionBrandItem | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<CatalogProductItem | null>(null);

  // ----------------------------------------------------
  // VIEW: CATEGORY DETAIL VIEW
  // ----------------------------------------------------
  if (workstream === 'category' && selectedCategory) {
    return (
      <div className="min-h-full pb-24 bg-slate-50/60">
        <AppBar
          title={selectedCategory.name}
          subtitle={`Code: ${selectedCategory.code} • Division: ${selectedCategory.division}`}
          showBack
          onBack={() => setSelectedCategory(null)}
        />

        <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-black text-slate-900">{selectedCategory.name}</h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {selectedCategory.status}
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {selectedCategory.code}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Parent Division: <strong className="text-slate-800">{selectedCategory.division}</strong> • Products Linked: {selectedCategory.productCount}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onShowSnackBar?.(`Category spec sheet exported`, 'info')}
                className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Export Category Tree
              </button>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-xs space-y-1">
            <span className="font-bold text-slate-900">Category Scope & Definition:</span>
            <p className="text-slate-600 leading-relaxed">{selectedCategory.description}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Sub-Classifications & Weave Types</h3>
            <div className="flex flex-wrap gap-2">
              {selectedCategory.subCategories.map((sub, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200"
                >
                  {sub}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW: COLLECTION BRAND DETAIL VIEW
  // ----------------------------------------------------
  if (workstream === 'collection_brand' && selectedBrand) {
    return (
      <div className="min-h-full pb-24 bg-slate-50/60">
        <AppBar
          title={selectedBrand.brandName}
          subtitle={`Season: ${selectedBrand.season} • Market: ${selectedBrand.targetMarket}`}
          showBack
          onBack={() => setSelectedBrand(null)}
        />

        <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-black text-slate-900">{selectedBrand.brandName}</h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {selectedBrand.status}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {selectedBrand.season}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Target Market: <strong className="text-slate-800">{selectedBrand.targetMarket}</strong> • Code: {selectedBrand.brandCode}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onShowSnackBar?.(`Collection Lookbook exported for ${selectedBrand.brandName}`, 'info')}
                className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Collection Lookbook
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Brand Aesthetic Concept</span>
              <p className="text-slate-700 font-medium leading-relaxed">{selectedBrand.concept}</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Core Fabric Blends</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedBrand.featuredFabrics.map((fabric, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono text-[11px]"
                  >
                    {fabric}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW: PRODUCT DETAIL VIEW
  // ----------------------------------------------------
  if (workstream === 'products' && selectedProduct) {
    return (
      <div className="min-h-full pb-24 bg-slate-50/60">
        <AppBar
          title={selectedProduct.title}
          subtitle={`SKU: ${selectedProduct.sku} • Category: ${selectedProduct.category}`}
          showBack
          onBack={() => setSelectedProduct(null)}
        />

        <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-black text-slate-900">{selectedProduct.title}</h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {selectedProduct.status}
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {selectedProduct.sku}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Collection: <strong className="text-slate-800">{selectedProduct.brand}</strong> • Category: {selectedProduct.category}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onShowSnackBar?.(`Technical Spec Sheet PDF downloaded`, 'info')}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                title="Print Spec Sheet"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Technical Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Composition</span>
              <p className="font-bold text-slate-900">{selectedProduct.composition}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">GSM / Weight</span>
              <p className="font-mono font-bold text-slate-900">{selectedProduct.gsm} GSM</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Yarn Count</span>
              <p className="font-mono font-bold text-slate-900">{selectedProduct.yarnCount}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Width</span>
              <p className="font-mono font-bold text-slate-900">{selectedProduct.widthInch}&quot;</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1.5">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Pricing & Unit</span>
              <p className="text-base font-black font-mono text-slate-900">
                {selectedProduct.currency} {selectedProduct.pricePerUnit.toFixed(2)} / {selectedProduct.unit}
              </p>
              <p className="text-slate-500">Minimum Order Quantity: 3,000 {selectedProduct.unit}</p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-1.5">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Warehouse Physical Stock</span>
              <p className="text-base font-black font-mono text-emerald-700">
                {selectedProduct.stockAvailable.toLocaleString()} {selectedProduct.unit} Ready
              </p>
              <p className="text-slate-500">Location: Warehouse B-12 (Finished Weave Bay)</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ====================================================
  // GRID / LIST VIEWS
  // ====================================================
  const titles = {
    category: { title: 'Product Category', subtitle: 'Fabric, Yarn, and Processing Classification Taxonomy' },
    collection_brand: { title: 'Collection Brand', subtitle: 'Global Export Lines, Seasonal Collections & Brands' },
    products: { title: 'Textile Products', subtitle: 'Technical Master SKUs, Yarn Counts & Finished Goods' },
  };

  return (
    <div className="min-h-full pb-24 bg-slate-50/60">
      <AppBar
        title={titles[workstream].title}
        subtitle={titles[workstream].subtitle}
        showBack
        onBack={onBack}
      />

      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-4">
        <SearchField
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={`Search ${titles[workstream].title}...`}
        />

        {/* Category List */}
        {workstream === 'category' && (
          <div className="space-y-3">
            {MOCK_CATALOG_CATEGORIES.filter(
              (c) =>
                c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.division.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((cat) => (
              <div
                key={cat.id}
                id={`cat-row-${cat.id}`}
                onClick={() => setSelectedCategory(cat)}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm active:scale-[0.99] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:bg-slate-800 transition-colors">
                    <FolderTree className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                        {cat.name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {cat.status}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {cat.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 truncate">{cat.description}</p>
                    <p className="text-xs text-slate-500">
                      Division: <strong>{cat.division}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Active SKUs</p>
                    <p className="text-base font-black font-mono text-slate-900">
                      {cat.productCount} Products
                    </p>
                  </div>
                  <div className="p-2 rounded-full text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Collection Brand List */}
        {workstream === 'collection_brand' && (
          <div className="space-y-3">
            {MOCK_COLLECTION_BRANDS.filter(
              (b) =>
                b.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.season.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.targetMarket.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((brand) => (
              <div
                key={brand.id}
                id={`brand-row-${brand.id}`}
                onClick={() => setSelectedBrand(brand)}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm active:scale-[0.99] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:bg-slate-800 transition-colors">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                        {brand.brandName}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {brand.status}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {brand.season}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 truncate">{brand.concept}</p>
                    <p className="text-xs text-slate-500">
                      Target: <strong>{brand.targetMarket}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Total Styles</p>
                    <p className="text-base font-black font-mono text-slate-900">
                      {brand.totalProducts} Styles
                    </p>
                  </div>
                  <div className="p-2 rounded-full text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products List */}
        {workstream === 'products' && (
          <div className="space-y-3">
            {MOCK_CATALOG_PRODUCTS.filter(
              (p) =>
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.brand.toLowerCase().includes(searchQuery.toLowerCase())
            ).map((product) => (
              <div
                key={product.id}
                id={`prod-row-${product.id}`}
                onClick={() => setSelectedProduct(product)}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm active:scale-[0.99] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:bg-slate-800 transition-colors">
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                        {product.title}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {product.status}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {product.sku}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 truncate">
                      {product.composition} • {product.gsm} GSM • {product.yarnCount}
                    </p>
                    <p className="text-xs text-slate-500">
                      Collection: <strong>{product.brand}</strong> • {product.category}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Unit Price</p>
                    <p className="text-base font-black font-mono text-slate-900">
                      {product.currency} {product.pricePerUnit.toFixed(2)}
                    </p>
                    <p className="text-[11px] text-emerald-700 font-semibold font-mono">
                      {product.stockAvailable.toLocaleString()} {product.unit} in stock
                    </p>
                  </div>
                  <div className="p-2 rounded-full text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

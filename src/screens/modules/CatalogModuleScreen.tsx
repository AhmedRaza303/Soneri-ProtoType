/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { Eye, Package } from 'lucide-react';
import {
  CardGrid,
  DataRow,
  DataTable,
  InfoField,
  ListPagination,
  ListToolbar,
  RecordCard,
  StatusPill,
  Td,
  usePagedList,
  type ListViewMode,
} from '../../components/common/DataListShell';
import {
  DocPlaceholder,
  HeaderIconBtn,
  MobileContent,
  MobileFieldGrid,
  MobileHeader,
  MobilePage,
  SectionBand,
  SoftCard,
} from '../../components/common/MobileLayout';
import { useTheme } from '../../context/ThemeContext';
import {
  BrandItem,
  CategoryItem,
  CollectionItem,
  MOCK_CATALOG_BRANDS,
  MOCK_CATALOG_CATEGORIES,
  MOCK_CATALOG_COLLECTIONS,
  MOCK_CATALOG_PRODUCTS,
  ProductItem,
} from '../../data/erpWorkstreamsData';

type CatalogWorkstream =
  | 'category'
  | 'brand'
  | 'collection'
  | 'collection_brand'
  | 'products';

interface CatalogModuleScreenProps {
  workstream: CatalogWorkstream;
  onBack: () => void;
  onShowSnackBar?: (msg: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

type ResolvedWorkstream = 'category' | 'brand' | 'collection' | 'products';

function resolveWorkstream(ws: CatalogWorkstream): ResolvedWorkstream {
  if (ws === 'collection_brand') return 'brand';
  return ws;
}

const WORKSTREAM_META: Record<
  ResolvedWorkstream,
  { title: string; subtitle: string; searchPlaceholder: string }
> = {
  category: {
    title: 'Categories',
    subtitle: 'Product category hierarchy & HS codes',
    searchPlaceholder: 'Search categories…',
  },
  brand: {
    title: 'Brands',
    subtitle: 'Brand master, trademark & packaging flags',
    searchPlaceholder: 'Search brands…',
  },
  collection: {
    title: 'Collections',
    subtitle: 'Collections linked to brand houses',
    searchPlaceholder: 'Search collections…',
  },
  products: {
    title: 'Products',
    subtitle: 'Product master SKUs & pricing',
    searchPlaceholder: 'Search products…',
  },
};

const BRAND_HEADERS = [
  'Code',
  'Brand Name',
  'Short Name',
  'Website',
  'Register Country',
  'Status',
  'Packaging Only',
  'Trade Mark Status',
  'Created',
  'Actions',
];

const COLLECTION_HEADERS = ['Code', 'Collection Name', 'Status', 'Created', 'Actions'];

const CATEGORY_HEADERS = [
  'Code',
  'Name',
  'Parent',
  'HSCode',
  'Status',
  'Products',
  'Created',
  'Actions',
];

const PRODUCT_HEADERS = [
  'Code',
  'Product Name',
  'Company Name',
  'Collection',
  'Status',
  'Created',
  'Actions',
];

const ActionCell: React.FC<{ onView: () => void }> = ({ onView }) => {
  const { isDark } = useTheme();
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onView();
      }}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer transition-colors ${
        isDark
          ? 'border-slate-700 text-slate-200 hover:bg-slate-800'
          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
      }`}
    >
      <Eye className="w-3.5 h-3.5" />
      View
    </button>
  );
};

const LogoField: React.FC<{ label: string; value?: string }> = ({ label, value }) => {
  const { isDark } = useTheme();
  return (
    <div className="min-w-0 space-y-1.5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      {value ? (
        <div
          className={`rounded-2xl border px-3 py-4 text-center ${
            isDark ? 'border-slate-700 bg-slate-900/40' : 'border-slate-200/80 bg-slate-50'
          }`}
        >
          <p
            className={`text-[11px] font-mono font-semibold break-all ${
              isDark ? 'text-teal-300' : 'text-teal-700'
            }`}
          >
            {value}
          </p>
        </div>
      ) : (
        <DocPlaceholder label="No Document Available" />
      )}
    </div>
  );
};

export const CatalogModuleScreen: React.FC<CatalogModuleScreenProps> = ({
  workstream,
  onBack,
  onShowSnackBar,
}) => {
  const { isDark } = useTheme();
  const resolved = resolveWorkstream(workstream);
  const meta = WORKSTREAM_META[resolved];

  const [viewMode, setViewMode] = useState<ListViewMode>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<BrandItem | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<CollectionItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  const mutedText = isDark ? 'text-slate-400' : 'text-slate-500';

  const filteredBrands = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MOCK_CATALOG_BRANDS;
    return MOCK_CATALOG_BRANDS.filter(
      (b) =>
        b.code.toLowerCase().includes(q) ||
        b.brandName.toLowerCase().includes(q) ||
        b.shortName.toLowerCase().includes(q) ||
        b.registerCountry.toLowerCase().includes(q) ||
        b.tradeMarkStatus.toLowerCase().includes(q) ||
        b.website.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredCollections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MOCK_CATALOG_COLLECTIONS;
    return MOCK_CATALOG_COLLECTIONS.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.collectionName.toLowerCase().includes(q) ||
        c.brandName.toLowerCase().includes(q) ||
        c.brandCode.toLowerCase().includes(q) ||
        c.collectionDetail.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MOCK_CATALOG_CATEGORIES;
    return MOCK_CATALOG_CATEGORIES.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.parentCategory.toLowerCase().includes(q) ||
        c.hsCode.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return MOCK_CATALOG_PRODUCTS;
    return MOCK_CATALOG_PRODUCTS.filter(
      (p) =>
        p.code.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.companyName.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const brandPage = usePagedList(filteredBrands, 10);
  const collectionPage = usePagedList(filteredCollections, 10);
  const categoryPage = usePagedList(filteredCategories, 10);
  const productPage = usePagedList(filteredProducts, 10);

  useEffect(() => {
    brandPage.resetPage();
    collectionPage.resetPage();
    categoryPage.resetPage();
    productPage.resetPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when search/workstream changes
  }, [searchQuery, resolved]);

  const snack = (msg: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    onShowSnackBar?.(msg, type);
  };

  const handleFilterClick = () => snack('Filters panel coming soon', 'info');
  const handleColumnsClick = () => snack('Column picker coming soon', 'info');

  /* ========================================================
   * DETAIL: BRAND
   * ======================================================== */
  if (resolved === 'brand' && selectedBrand) {
    const b = selectedBrand;
    return (
      <MobilePage>
        <MobileHeader
          title="View Brand"
          subtitle={`${b.brandName} · ${b.code}`}
          status={b.status}
          onBack={() => setSelectedBrand(null)}
          actions={
            <HeaderIconBtn
              label="Print"
              icon="print"
              onClick={() => snack(`Preparing brand sheet for ${b.brandName}`, 'info')}
            />
          }
        />
        <MobileContent>
          <SoftCard>
            <MobileFieldGrid>
              <InfoField label="Brand Code" value={b.code} mono accent />
              <InfoField label="Status" value={<StatusPill status={b.status} />} />
              <InfoField label="Brand Name" value={b.brandName} />
              <InfoField label="Short Name" value={b.shortName || '—'} />
              <InfoField label="Registered Country" value={b.registerCountry || '—'} />
              <InfoField label="Establishment Date" value={b.establishmentDate || '—'} />
              <InfoField
                label="Website URL"
                value={
                  b.website ? (
                    <a
                      href={b.website}
                      target="_blank"
                      rel="noreferrer"
                      className={
                        isDark
                          ? 'text-teal-300 text-xs font-semibold break-all'
                          : 'text-teal-700 text-xs font-semibold break-all'
                      }
                      onClick={(e) => e.stopPropagation()}
                    >
                      {b.website}
                    </a>
                  ) : (
                    '—'
                  )
                }
              />
              <InfoField label="Private Label" value={<StatusPill status={b.privateLabel} />} />
              <LogoField label="Primary Logo" value={b.primaryLogo} />
              <LogoField label="Secondary Logo" value={b.secondaryLogo} />
              <InfoField label="Remarks" value={b.remarks || '—'} />
            </MobileFieldGrid>
          </SoftCard>

          <SectionBand title="Documents" emptyText="No documents attached" />
        </MobileContent>
      </MobilePage>
    );
  }

  /* ========================================================
   * DETAIL: COLLECTION
   * ======================================================== */
  if (resolved === 'collection' && selectedCollection) {
    const c = selectedCollection;
    const hasProducts = c.products.length > 0;
    const hasInstructions = c.instructions.length > 0;

    return (
      <MobilePage>
        <MobileHeader
          title="View Collection"
          subtitle={`${c.collectionName} · ${c.code}`}
          status={c.status}
          onBack={() => setSelectedCollection(null)}
          actions={
            <HeaderIconBtn
              label="Print"
              icon="print"
              onClick={() => snack(`Preparing collection sheet for ${c.collectionName}`, 'info')}
            />
          }
        />
        <MobileContent>
          <SoftCard>
            <MobileFieldGrid>
              <InfoField label="Collection Code" value={c.code} mono accent />
              <InfoField label="Status" value={<StatusPill status={c.status} />} />
              <InfoField label="Collection Name" value={c.collectionName} />
              <InfoField label="Collection Detail" value={c.collectionDetail || '—'} />
              <div className="min-w-0 space-y-1.5 xs:col-span-2 sm:col-span-2 lg:col-span-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Collection Thumbnail
                </p>
                {c.thumbnail ? (
                  <div
                    className={`rounded-2xl border px-3 py-4 text-center ${
                      isDark ? 'border-slate-700 bg-slate-900/40' : 'border-slate-200/80 bg-slate-50'
                    }`}
                  >
                    <p
                      className={`text-[11px] font-mono font-semibold break-all ${
                        isDark ? 'text-teal-300' : 'text-teal-700'
                      }`}
                    >
                      {c.thumbnail}
                    </p>
                  </div>
                ) : (
                  <DocPlaceholder label="No Document Available" />
                )}
              </div>
            </MobileFieldGrid>
          </SoftCard>

          <SectionBand
            title="Products"
            emptyText={!hasProducts ? 'No Products added' : undefined}
            action={
              hasProducts ? (
                <span className={`text-[10px] font-bold ${mutedText}`}>
                  {c.products.length} item{c.products.length === 1 ? '' : 's'}
                </span>
              ) : undefined
            }
          >
            <div className="space-y-2.5">
              {c.products.map((p) => (
                <div
                  key={p.code}
                  className={`flex items-start justify-between gap-3 rounded-2xl border px-3.5 py-3 ${
                    isDark
                      ? 'border-slate-800 bg-slate-900/50'
                      : 'border-slate-100 bg-slate-50/80'
                  }`}
                >
                  <div className="min-w-0 space-y-1">
                    <p
                      className={`text-[10px] font-mono font-bold ${
                        isDark ? 'text-teal-300' : 'text-teal-800'
                      }`}
                    >
                      {p.code}
                    </p>
                    <p
                      className={`text-xs font-semibold leading-snug ${
                        isDark ? 'text-slate-100' : 'text-slate-900'
                      }`}
                    >
                      {p.name}
                    </p>
                  </div>
                  <div className="shrink-0 text-right space-y-1">
                    <p className={`text-[9px] font-bold uppercase tracking-wider ${mutedText}`}>
                      Primary
                    </p>
                    <StatusPill status={p.primary} />
                  </div>
                </div>
              ))}
            </div>
          </SectionBand>

          <SectionBand
            title="Instructions"
            emptyText={!hasInstructions ? 'No Products added' : undefined}
          >
            <div className="space-y-2">
              {c.instructions.map((ins, idx) => (
                <div
                  key={`${ins.sort}-${idx}`}
                  className={`rounded-xl border px-3.5 py-3 text-xs ${
                    ins.highlight
                      ? isDark
                        ? 'border-amber-500/30 bg-amber-500/10 text-amber-100'
                        : 'border-amber-200 bg-amber-50 text-amber-950'
                      : isDark
                      ? 'border-slate-800 bg-slate-900/40 text-slate-200'
                      : 'border-slate-100 bg-slate-50 text-slate-800'
                  }`}
                >
                  <span className={`mr-2 text-[10px] font-mono font-bold ${mutedText}`}>
                    #{ins.sort || idx + 1}
                  </span>
                  {ins.text}
                </div>
              ))}
            </div>
          </SectionBand>
        </MobileContent>
      </MobilePage>
    );
  }

  /* ========================================================
   * DETAIL: CATEGORY
   * ======================================================== */
  if (resolved === 'category' && selectedCategory) {
    const c = selectedCategory;
    return (
      <MobilePage>
        <MobileHeader
          title="View Category"
          subtitle={`${c.name} · ${c.code}`}
          status={c.status}
          onBack={() => setSelectedCategory(null)}
          actions={
            <HeaderIconBtn
              label="Print"
              icon="print"
              onClick={() => snack(`Preparing category sheet for ${c.name}`, 'info')}
            />
          }
        />
        <MobileContent>
          <SoftCard>
            <MobileFieldGrid>
              <InfoField label="Category Name" value={c.name} />
              <InfoField label="Parent Category" value={c.parentCategory} />
              <InfoField label="HSCode" value={c.hsCode} mono accent />
              <InfoField label="Active" value={<StatusPill status={c.status} />} />
              <InfoField label="Products" value={String(c.productCount)} mono />
              <InfoField label="Created" value={c.created} />
            </MobileFieldGrid>

            <div className="mt-4 space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Description
              </p>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                {c.description || '—'}
              </p>
            </div>
          </SoftCard>

          <SectionBand
            title="Sub-Categories"
            emptyText={c.subCategories.length === 0 ? 'No sub-categories defined' : undefined}
          >
            <div className="flex flex-wrap gap-2">
              {c.subCategories.map((sub) => (
                <span
                  key={sub}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                    isDark
                      ? 'bg-teal-500/10 text-teal-200 border-teal-500/25'
                      : 'bg-teal-50 text-teal-900 border-teal-100'
                  }`}
                >
                  {sub}
                </span>
              ))}
            </div>
          </SectionBand>
        </MobileContent>
      </MobilePage>
    );
  }

  /* ========================================================
   * DETAIL: PRODUCT
   * ======================================================== */
  if (resolved === 'products' && selectedProduct) {
    const p = selectedProduct;
    return (
      <MobilePage>
        <MobileHeader
          title="View Product"
          subtitle={`${p.code || p.sku} · ${p.companyName}`}
          status={p.status}
          onBack={() => setSelectedProduct(null)}
          actions={
            <HeaderIconBtn
              label="Print"
              icon="print"
              onClick={() => snack(`Preparing product sheet for ${p.code || p.sku}`, 'info')}
            />
          }
        />
        <MobileContent>
          <SoftCard>
            <MobileFieldGrid>
              <InfoField label="Code" value={p.code || p.sku} mono accent />
              <InfoField label="Product Name" value={p.name || p.title} />
              <InfoField label="Company Name" value={p.companyName} />
              <InfoField label="Collection" value={p.collection} />
              <InfoField label="Status" value={<StatusPill status={p.status} />} />
              <InfoField
                label="Created"
                value={
                  <span>
                    {p.created}
                    {p.createdBy ? (
                      <span className={`block text-[11px] mt-0.5 ${mutedText}`}>
                        by {p.createdBy}
                      </span>
                    ) : null}
                  </span>
                }
              />
            </MobileFieldGrid>

            <div
              className={`mt-4 grid grid-cols-2 gap-3 rounded-2xl border p-3.5 ${
                isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50/90'
              }`}
            >
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${mutedText}`}>
                  Price
                </p>
                <p
                  className={`mt-1 text-sm font-mono font-extrabold ${
                    isDark ? 'text-teal-300' : 'text-teal-800'
                  }`}
                >
                  {p.currency} {p.pricePerUnit.toFixed(4)}
                </p>
                <p className={`text-[10px] mt-0.5 ${mutedText}`}>/ {p.unit}</p>
              </div>
              <div>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${mutedText}`}>
                  Stock
                </p>
                <p
                  className={`mt-1 text-sm font-mono font-extrabold ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}
                >
                  {p.stockAvailable.toLocaleString()}
                </p>
                <p className={`text-[10px] mt-0.5 ${mutedText}`}>{p.unit} available</p>
              </div>
            </div>
          </SoftCard>
        </MobileContent>
      </MobilePage>
    );
  }

  /* ========================================================
   * LIST VIEWS
   * ======================================================== */

  const renderBrandList = () => {
    const { paged, page, pageSize, total, setPage, setPageSize } = brandPage;

    return (
      <>
        {viewMode === 'grid' ? (
          <DataTable headers={BRAND_HEADERS}>
            {paged.map((b) => (
              <DataRow key={b.id} onClick={() => setSelectedBrand(b)}>
                <Td mono accent>
                  {b.code}
                </Td>
                <Td>{b.brandName}</Td>
                <Td>{b.shortName || '—'}</Td>
                <Td className="max-w-[140px] truncate">{b.website || '—'}</Td>
                <Td>{b.registerCountry || '—'}</Td>
                <Td>
                  <StatusPill status={b.status} />
                </Td>
                <Td>
                  <StatusPill status={b.packagingOnly} />
                </Td>
                <Td>{b.tradeMarkStatus || '—'}</Td>
                <Td className="whitespace-nowrap">{b.created}</Td>
                <Td>
                  <ActionCell onView={() => setSelectedBrand(b)} />
                </Td>
              </DataRow>
            ))}
          </DataTable>
        ) : (
          <CardGrid>
            {paged.map((b) => (
              <RecordCard
                key={b.id}
                code={b.code}
                title={b.brandName}
                subtitle={b.registerCountry || undefined}
                status={b.status}
                badges={<StatusPill status={b.packagingOnly} />}
                fields={[
                  { label: 'Short Name', value: b.shortName || '—' },
                  { label: 'Private Label', value: <StatusPill status={b.privateLabel} /> },
                  {
                    label: 'Packaging Only',
                    value: <StatusPill status={b.packagingOnly} />,
                  },
                  { label: 'Created', value: b.created },
                ]}
                onClick={() => setSelectedBrand(b)}
                actions={[
                  { label: 'View', icon: 'view', onClick: () => setSelectedBrand(b) },
                  {
                    label: 'Print',
                    icon: 'print',
                    onClick: () => snack(`Preparing brand sheet for ${b.brandName}`, 'info'),
                  },
                ]}
              />
            ))}
          </CardGrid>
        )}
        <ListPagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </>
    );
  };

  const renderCollectionList = () => {
    const { paged, page, pageSize, total, setPage, setPageSize } = collectionPage;

    return (
      <>
        {viewMode === 'grid' ? (
          <DataTable headers={COLLECTION_HEADERS}>
            {paged.map((c) => (
              <DataRow key={c.id} onClick={() => setSelectedCollection(c)}>
                <Td mono accent>
                  {c.code}
                </Td>
                <Td>{c.collectionName}</Td>
                <Td>
                  <StatusPill status={c.status} />
                </Td>
                <Td className="whitespace-nowrap">{c.created}</Td>
                <Td>
                  <ActionCell onView={() => setSelectedCollection(c)} />
                </Td>
              </DataRow>
            ))}
          </DataTable>
        ) : (
          <CardGrid>
            {paged.map((c) => (
              <RecordCard
                key={c.id}
                code={c.code}
                title={c.collectionName}
                subtitle={c.collectionDetail || `${c.brandCode} · ${c.brandName}`}
                status={c.status}
                fields={[
                  { label: 'Brand', value: c.brandName },
                  { label: 'Products', value: String(c.products.length) },
                  { label: 'Created', value: c.created },
                  { label: 'Status', value: <StatusPill status={c.status} /> },
                ]}
                onClick={() => setSelectedCollection(c)}
                actions={[
                  { label: 'View', icon: 'view', onClick: () => setSelectedCollection(c) },
                  {
                    label: 'Print',
                    icon: 'print',
                    onClick: () =>
                      snack(`Preparing collection sheet for ${c.collectionName}`, 'info'),
                  },
                ]}
              />
            ))}
          </CardGrid>
        )}
        <ListPagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </>
    );
  };

  const renderCategoryList = () => {
    const { paged, page, pageSize, total, setPage, setPageSize } = categoryPage;

    return (
      <>
        {viewMode === 'grid' ? (
          <DataTable headers={CATEGORY_HEADERS}>
            {paged.map((c) => (
              <DataRow key={c.id} onClick={() => setSelectedCategory(c)}>
                <Td mono accent>
                  {c.code}
                </Td>
                <Td>{c.name}</Td>
                <Td>{c.parentCategory}</Td>
                <Td mono>{c.hsCode}</Td>
                <Td>
                  <StatusPill status={c.status} />
                </Td>
                <Td mono>{c.productCount}</Td>
                <Td className="whitespace-nowrap">{c.created}</Td>
                <Td>
                  <ActionCell onView={() => setSelectedCategory(c)} />
                </Td>
              </DataRow>
            ))}
          </DataTable>
        ) : (
          <CardGrid>
            {paged.map((c) => (
              <RecordCard
                key={c.id}
                code={c.code}
                title={c.name}
                subtitle={c.description}
                status={c.status}
                fields={[
                  { label: 'Parent', value: c.parentCategory },
                  { label: 'HSCode', value: c.hsCode },
                  { label: 'Products', value: String(c.productCount) },
                  { label: 'Created', value: c.created },
                ]}
                onClick={() => setSelectedCategory(c)}
                actions={[
                  { label: 'View', icon: 'view', onClick: () => setSelectedCategory(c) },
                  {
                    label: 'Print',
                    icon: 'print',
                    onClick: () => snack(`Preparing category sheet for ${c.name}`, 'info'),
                  },
                ]}
              />
            ))}
          </CardGrid>
        )}
        <ListPagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </>
    );
  };

  const renderProductList = () => {
    const { paged, page, pageSize, total, setPage, setPageSize } = productPage;

    return (
      <>
        {viewMode === 'grid' ? (
          <DataTable headers={PRODUCT_HEADERS}>
            {paged.map((p) => (
              <DataRow key={p.id} onClick={() => setSelectedProduct(p)}>
                <Td mono accent>
                  {p.code || p.sku}
                </Td>
                <Td className="max-w-[280px]">
                  <span className="line-clamp-2">{p.name || p.title}</span>
                </Td>
                <Td>{p.companyName}</Td>
                <Td>{p.collection}</Td>
                <Td>
                  <StatusPill status={p.status} />
                </Td>
                <Td className="whitespace-nowrap">{p.created}</Td>
                <Td>
                  <ActionCell onView={() => setSelectedProduct(p)} />
                </Td>
              </DataRow>
            ))}
          </DataTable>
        ) : (
          <CardGrid>
            {paged.map((p) => (
              <RecordCard
                key={p.id}
                code={p.code || p.sku}
                title={p.name || p.title}
                subtitle={p.companyName}
                status={p.status}
                fields={[
                  { label: 'Collection', value: p.collection },
                  {
                    label: 'Price',
                    value: `${p.currency} ${p.pricePerUnit.toFixed(2)}`,
                  },
                  {
                    label: 'Stock',
                    value: `${p.stockAvailable.toLocaleString()} ${p.unit}`,
                  },
                  {
                    label: 'Created',
                    value: `${p.created}${p.createdBy ? ` · ${p.createdBy}` : ''}`,
                  },
                ]}
                footer={
                  <span className="inline-flex items-center gap-1.5">
                    <Package className="w-3 h-3 opacity-60" />
                    {p.brand}
                  </span>
                }
                onClick={() => setSelectedProduct(p)}
                actions={[
                  { label: 'View', icon: 'view', onClick: () => setSelectedProduct(p) },
                  {
                    label: 'Print',
                    icon: 'print',
                    onClick: () =>
                      snack(`Preparing product sheet for ${p.code || p.sku}`, 'info'),
                  },
                ]}
              />
            ))}
          </CardGrid>
        )}
        <ListPagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </>
    );
  };

  return (
    <MobilePage>
      <MobileHeader title={meta.title} subtitle={meta.subtitle} onBack={onBack} />

      <MobileContent>
        <SoftCard>
          <ListToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder={meta.searchPlaceholder}
            onFilterClick={handleFilterClick}
            onColumnsClick={handleColumnsClick}
          />
        </SoftCard>

        {resolved === 'brand' && renderBrandList()}
        {resolved === 'collection' && renderCollectionList()}
        {resolved === 'category' && renderCategoryList()}
        {resolved === 'products' && renderProductList()}
      </MobileContent>
    </MobilePage>
  );
};

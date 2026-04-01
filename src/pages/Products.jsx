import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import './Products.css';

const API = 'https://manipraveen1.pythonanywhere.com/api/';

const GENDERS      = ['Boy', 'Girl'];
const AGE_GROUPS   = ['0-6 months', '7-12 months', 'Kids', 'Adults'];
const BRANDS_LIST  = ['Babyhug', 'Babyge', 'Konkie kids', "Carter's", 'Dapper Dudes'];
const COLORS = [
  { label: 'Blue',       value: 'blue',       hex: '#60a5fa' },
  { label: 'White',      value: 'white',      hex: '#e5e7eb' },
  { label: 'Red',        value: 'red',        hex: '#f87171' },
  { label: 'Multicolor', value: 'multicolor', hex: 'linear-gradient(135deg,#f87171,#facc15,#34d399,#60a5fa)' },
  { label: 'Yellow',     value: 'yellow',     hex: '#fde047' },
  { label: 'Pink',       value: 'pink',       hex: '#f9a8d4' },
  { label: 'Green',      value: 'green',      hex: '#6ee7b7' },
];
const DISCOUNTS    = ['Upto 10%', '10%-20%', '20%-30%', '30%+'];
const PRICE_RANGES = ['Under ₹250', '₹250–₹1000', '₹1000–₹3000', 'Above ₹3000'];
const CURATED      = ['Trending now', 'Fast moving', 'Extra warm'];
const SORT_OPTIONS = ['New arrivals', 'Price: Low to High', 'Price: High to Low', 'Best Sellers'];
const PERIODS      = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

const CAT_LABELS = {
  'baby-fashion':         'Baby Fashions',
  'toys':                 'Toys',
  'footwear-accessories': 'Footwear & Accessories',
  'baby-care':            'Moms & Baby Care',
  'furniture':            'Furniture & Bedding',
  'rental':               'Rental Services',
  'offers':               'Offers',
  '':                     'All Products',
};

/* ── Collapsible filter section ── */
function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="filter-section">
      <button className="filter-section-toggle" onClick={() => setOpen(o => !o)}>
        <span className="filter-section-title">{title}</span>
        <span className={`filter-caret ${open ? 'open' : ''}`}>▾</span>
      </button>
      {open && <div className="filter-section-body">{children}</div>}
    </div>
  );
}

/* ── Styled checkbox ── */
function CheckBox({ label, checked, onChange, color }) {
  return (
    <label className={`filter-checkbox ${checked ? 'is-checked' : ''}`}>
      <span className="checkbox-box">{checked && <span className="checkbox-tick">✓</span>}</span>
      {color && (
        <span
          className="color-swatch"
          style={color.startsWith('linear') ? { background: color } : { background: color }}
        />
      )}
      <span className="checkbox-label">{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} hidden />
    </label>
  );
}

/* ── Active filter chip ── */
function Chip({ label, onRemove }) {
  return (
    <span className="active-chip">
      {label}
      <button onClick={onRemove} className="chip-remove">×</button>
    </span>
  );
}

export default function Products() {
  const [searchParams] = useSearchParams();
  const categorySlug   = searchParams.get('category') || '';
  const searchQuery    = searchParams.get('search') || '';
  const subFilter      = searchParams.get('sub') || '';
  const isRental       = categorySlug === 'rental';

  const [products,    setProducts]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [totalPages,  setTotalPages]  = useState(1);
  const [page,        setPage]        = useState(1);
  const [sortBy,      setSortBy]      = useState('New arrivals');
  const [period,      setPeriod]      = useState('Monthly');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Filters
  const [gender,    setGender]    = useState([]);
  const [ageGroup,  setAgeGroup]  = useState([]);
  const [brands,    setBrands]    = useState([]);
  const [colors,    setColors]    = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [prices,    setPrices]    = useState([]);
  const [curated,   setCurated]   = useState([]);
  const [premium,   setPremium]   = useState(false);

  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);

  // ── Derive grid class once so all three branches stay in sync
  // Category pages always use 3 columns; "New arrivals" on root /products uses 4
  const gridClass = `products-grid ${!categorySlug && sortBy === 'New arrivals' ? 'new-arrivals' : 'categories'}`;

  // All active filter chips
  const activeFilters = [
    ...gender.map(v    => ({ label: v,         remove: () => toggle(gender,    setGender,    v) })),
    ...ageGroup.map(v  => ({ label: v,         remove: () => toggle(ageGroup,  setAgeGroup,  v) })),
    ...brands.map(v    => ({ label: v,         remove: () => toggle(brands,    setBrands,    v) })),
    ...colors.map(v    => ({ label: v,         remove: () => toggle(colors,    setColors,    v) })),
    ...discounts.map(v => ({ label: v,         remove: () => toggle(discounts, setDiscounts, v) })),
    ...prices.map(v    => ({ label: v,         remove: () => toggle(prices,    setPrices,    v) })),
    ...curated.map(v   => ({ label: v,         remove: () => toggle(curated,   setCurated,   v) })),
    ...(premium        ? [{ label: 'Premium',  remove: () => setPremium(false) }] : []),
  ];

  const clearAllFilters = () => {
    setGender([]); setAgeGroup([]); setBrands([]); setColors([]);
    setDiscounts([]); setPrices([]); setCurated([]); setPremium(false);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categorySlug) params.set('category', categorySlug);
      if (subFilter)    params.set('sub', subFilter);
      if (searchQuery)  params.set('search', searchQuery);
      params.set('page', page);

      if (sortBy === 'Price: Low to High') params.set('ordering', 'price');
      if (sortBy === 'Price: High to Low') params.set('ordering', '-price');
      if (sortBy === 'New arrivals')       params.set('ordering', '-created_at');
      if (sortBy === 'Best Sellers')       params.set('is_top_selling', 'true');

      if (gender.length)    params.set('gender',      gender.join(','));
      if (ageGroup.length)  params.set('age_group',   ageGroup.join(','));
      if (brands.length)    params.set('brand',       brands.join(','));
      if (colors.length)    params.set('color',       colors.join(','));
      if (prices.length)    params.set('price_range', prices.join(','));
      if (premium)          params.set('is_premium',  'true');

      const res  = await fetch(`${API}/products/?${params}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setProducts(data);
        setTotalPages(Math.max(1, Math.ceil(data.length / 9)));
      } else {
        setProducts(data.results || []);
        setTotalPages(Math.max(1, Math.ceil((data.count || 0) / 9)));
      }
    } catch (err) {
      console.error('Products fetch error:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [categorySlug, subFilter, searchQuery, page, sortBy, gender, ageGroup, brands, colors, prices, premium]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { setPage(1); }, [categorySlug, searchQuery]);

  const pageLabel  = searchQuery
    ? `Results for "${searchQuery}"`
    : (CAT_LABELS[categorySlug] || 'All Products');

  const breadcrumb = categorySlug
    ? `Home / ${CAT_LABELS[categorySlug] || categorySlug}`
    : searchQuery
    ? `Home / Search`
    : 'Home / Products';

  const pageCount = Math.min(totalPages, 10);
  const pages     = Array.from({ length: pageCount }, (_, i) => i + 1);

  return (
    <div className="products-page">

      {/* ── Breadcrumb */}
      <div className="breadcrumb-bar">
        <span className="breadcrumb-text">{breadcrumb}</span>
      </div>

      <div className="products-layout">

        {/* ══ FILTER SIDEBAR ══ */}
        <aside className={`filter-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
          <div className="sidebar-header">
            <span className="sidebar-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
              Filters
            </span>
            {activeFilters.length > 0 && (
              <button className="clear-all-btn" onClick={clearAllFilters}>
                Clear all ({activeFilters.length})
              </button>
            )}
          </div>

          <div className="sidebar-body">
            <FilterSection title="Gender">
              {GENDERS.map(g => (
                <CheckBox key={g} label={g} checked={gender.includes(g)}
                  onChange={() => { toggle(gender, setGender, g); setPage(1); }} />
              ))}
            </FilterSection>

            <FilterSection title="Age Group">
              {AGE_GROUPS.map(a => (
                <CheckBox key={a} label={a} checked={ageGroup.includes(a)}
                  onChange={() => { toggle(ageGroup, setAgeGroup, a); setPage(1); }} />
              ))}
            </FilterSection>

            <FilterSection title="Brand">
              {BRANDS_LIST.map(b => (
                <CheckBox key={b} label={b} checked={brands.includes(b)}
                  onChange={() => { toggle(brands, setBrands, b); setPage(1); }} />
              ))}
            </FilterSection>

            <FilterSection title="Color">
              <div className="color-grid">
                {COLORS.map(c => (
                  <button
                    key={c.value}
                    className={`color-btn ${colors.includes(c.value) ? 'color-selected' : ''}`}
                    onClick={() => { toggle(colors, setColors, c.value); setPage(1); }}
                    title={c.label}
                    style={c.hex.startsWith('linear')
                      ? { background: c.hex }
                      : { background: c.hex }}
                  >
                    {colors.includes(c.value) && <span className="color-check">✓</span>}
                  </button>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Price Range" defaultOpen={false}>
              {PRICE_RANGES.map(p => (
                <CheckBox key={p} label={p} checked={prices.includes(p)}
                  onChange={() => { toggle(prices, setPrices, p); setPage(1); }} />
              ))}
            </FilterSection>

            <FilterSection title="Discount" defaultOpen={false}>
              {DISCOUNTS.map(d => (
                <CheckBox key={d} label={d} checked={discounts.includes(d)}
                  onChange={() => { toggle(discounts, setDiscounts, d); setPage(1); }} />
              ))}
            </FilterSection>

            <FilterSection title="Curated" defaultOpen={false}>
              {CURATED.map(c => (
                <CheckBox key={c} label={c} checked={curated.includes(c)}
                  onChange={() => { toggle(curated, setCurated, c); setPage(1); }} />
              ))}
            </FilterSection>

            <FilterSection title="Premium" defaultOpen={false}>
              <CheckBox label="Show premium only" checked={premium}
                onChange={() => { setPremium(!premium); setPage(1); }} />
            </FilterSection>
          </div>
        </aside>

        {/* ══ PRODUCTS MAIN ══ */}
        <main className="products-main">

          {/* ── Top bar */}
          <div className="products-topbar">
            <div className="topbar-left">
              <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(o => !o)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                {sidebarOpen ? 'Hide filters' : 'Show filters'}
              </button>
              <h1 className="products-title">{pageLabel}</h1>
              {!loading && (
                <span className="products-count">
                  {products.length} item{products.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="topbar-right">
              {isRental && (
                <div className="sort-wrap">
                  <label className="sort-label">Period</label>
                  <select className="sort-select" value={period}
                    onChange={e => setPeriod(e.target.value)}>
                    {PERIODS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              )}
              <div className="sort-wrap">
                <label className="sort-label">Sort</label>
                <select className="sort-select" value={sortBy}
                  onChange={e => { setSortBy(e.target.value); setPage(1); }}>
                  {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* ── Active filter chips */}
          {activeFilters.length > 0 && (
            <div className="active-chips-row">
              {activeFilters.map((f, i) => (
                <Chip key={i} label={f.label} onRemove={f.remove} />
              ))}
            </div>
          )}

          {/* ── Sub-filter tag */}
          {subFilter && (
            <div className="sub-filter-tag">
              <span>📌 {subFilter.replace(/-/g, ' ')}</span>
              <Link
                to={`/products${categorySlug ? `?category=${categorySlug}` : ''}`}
                className="sub-clear">
                ✕ Clear
              </Link>
            </div>
          )}

          {/* ── Grid — all three states use the same gridClass */}
          {loading ? (
            // ✅ Skeleton uses correct dynamic class (4 cols for new arrivals, 3 for categories)
            <div className={gridClass}>
              {Array.from({ length: sortBy === 'New arrivals' ? 8 : 6 }).map((_, i) => (
                <div key={i} className="product-skeleton" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="products-empty">
              <div className="empty-blob">🛍️</div>
              <h3 className="empty-heading">No products found</h3>
              <p className="empty-sub">Try adjusting your filters or search term.</p>
              <Link to="/products" className="empty-cta">Browse all products</Link>
            </div>
          ) : (
            // ✅ Populated grid uses the same gridClass
            <div className={gridClass}>
              {products.map((p, i) => (
                <div key={p.id} className="product-card-wrapper" style={{ animationDelay: `${i * 0.05}s` }}>
                  <ProductCard product={p} isRental={isRental} rentalPeriod={period} />
                </div>
              ))}
            </div>
          )}

          {/* ── Pagination */}
          {!loading && products.length > 0 && totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-nav-btn"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}>
                ← Prev
              </button>

              {pages.map(p => (
                <button key={p}
                  className={`page-btn ${page === p ? 'active' : ''}`}
                  onClick={() => setPage(p)}>
                  {p}
                </button>
              ))}

              {totalPages > 10 && (
                <>
                  <span className="page-ellipsis">…</span>
                  <button className="page-btn" onClick={() => setPage(totalPages)}>
                    {totalPages}
                  </button>
                </>
              )}

              <button
                className="page-nav-btn"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}>
                Next →
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

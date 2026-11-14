import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api, unwrap } from '../services/api';
import ProductCard from '../components/ProductCard';

const priceOf = p => p.priceAfterDiscount || p.price || 0;

// `shop` = the All Products page: same filters sidebar as search, without the search box.
export default function SearchResults({ shop = false }) {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const q = (shop ? params.get('keyword') : params.get('q')) || '';
  const subcategory = params.get('subcategory') || '';

  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState(q);
  const [view, setView] = useState('grid');
  const [sort, setSort] = useState('relevance');
  const [cats, setCats] = useState([]);
  const [brands, setBrands] = useState([]);
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const resultsRef = useRef(null);

  // Load products once
  useEffect(() => {
    api.get('/products?limit=500')
      .then(r => {
        const d = unwrap(r);
        setAll(Array.isArray(d) ? d : d?.products || []);
      })
      .catch(() => setAll([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => setInput(q), [q]);

  // 1) products matching the search text
  const matched = useMemo(() => {
    const t = q.trim().toLowerCase();
    const base = subcategory
      ? all.filter(p => (p.subcategory || []).some(sc => (sc._id || sc) === subcategory))
      : all;
    if (!t) return base;
    return base.filter(p =>
      [p.title, p.description, p.category?.name, p.brand?.name, p.subcategory?.[0]?.name]
        .filter(Boolean)
        .some(v => v.toLowerCase().includes(t))
    );
  }, [all, q, subcategory]);

  // sidebar options come from the matched products
  const catOptions = useMemo(
    () => [...new Set(matched.map(p => p.category?.name).filter(Boolean))],
    [matched]
  );
  const brandOptions = useMemo(
    () => [...new Set(matched.map(p => p.brand?.name).filter(Boolean))],
    [matched]
  );

  // 2) apply filters + sort
  const results = useMemo(() => {
    let list = matched.filter(p =>
      (!cats.length || cats.includes(p.category?.name)) &&
      (!brands.length || brands.includes(p.brand?.name)) &&
      (min === '' || priceOf(p) >= Number(min)) &&
      (max === '' || priceOf(p) <= Number(max))
    );
    if (sort === 'low') list = [...list].sort((a, b) => priceOf(a) - priceOf(b));
    if (sort === 'high') list = [...list].sort((a, b) => priceOf(b) - priceOf(a));
    if (sort === 'rating') list = [...list].sort((a, b) => (b.ratingsAverage || 0) - (a.ratingsAverage || 0));
    return list;
  }, [matched, cats, brands, min, max, sort]);

  // when a filter changes, bring the results into view
  useEffect(() => {
    if (!loading) resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [cats, brands, min, max, sort]);

  const toggle = (setter, value) =>
    setter(prev => (prev.includes(value) ? prev.filter(x => x !== value) : [...prev, value]));

  const clearFilters = () => { setCats([]); setBrands([]); setMin(''); setMax(''); };
  const clearAll = () => { clearFilters(); setParams({}); };

  const submit = e => {
    e.preventDefault();
    if (input.trim()) navigate(`/search?q=${encodeURIComponent(input.trim())}`);
  };

  const hasFilters = cats.length || brands.length || min !== '' || max !== '';

  return (
    <main className="container page search-page">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> / {shop ? 'Shop' : 'Search Results'}
      </div>

      {!shop && (
        <form className="search-box" onSubmit={submit}>
          <i className="fa-solid fa-magnifying-glass" />
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Search products..." />
        </form>
      )}

      {shop ? (
        <>
          <h1>{subcategory ? 'Subcategory Products' : 'All Products'}</h1>
          <p className="muted">Discover our fresh products and everyday essentials.</p>
        </>
      ) : (
        <>
          <h1>Search Results{q && <> for "{q}"</>}</h1>
          <p className="muted">We found {loading ? '...' : results.length} products for you</p>
        </>
      )}

      <div className="search-layout">
        {/* ===== Sidebar ===== */}
        <aside className="filters">
          <h3>Categories</h3>
          <div className="filter-list">
            {catOptions.map(c => (
              <label key={c}>
                <input type="checkbox" checked={cats.includes(c)} onChange={() => toggle(setCats, c)} /> {c}
              </label>
            ))}
          </div>

          <h3>Price Range</h3>
          <div className="price-row">
            <input type="number" placeholder="Min" value={min} onChange={e => setMin(e.target.value)} />
            <input type="number" placeholder="Max" value={max} onChange={e => setMax(e.target.value)} />
          </div>
          <div className="price-chips">
            {[500, 1000, 5000, 10000].map(v => (
              <button key={v} type="button" onClick={() => { setMin(''); setMax(String(v)); }}>
                Under {v >= 1000 ? v / 1000 + 'K' : v}
              </button>
            ))}
          </div>

          <h3>Brands</h3>
          <div className="filter-list">
            {brandOptions.map(b => (
              <label key={b}>
                <input type="checkbox" checked={brands.includes(b)} onChange={() => toggle(setBrands, b)} /> {b}
              </label>
            ))}
          </div>

          <button type="button" className="clear-filters" onClick={clearFilters}>Clear All Filters</button>
        </aside>

        {/* ===== Results ===== */}
        <section className="search-results" ref={resultsRef}>
          <div className="results-bar">
            <span className="count">Showing {results.length} of {matched.length}</span>
            <div className="view-toggle">
              <button className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')}>
                <i className="fa-solid fa-grip" />
              </button>
              <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>
                <i className="fa-solid fa-list" />
              </button>
            </div>
            <label>
              Sort by:{' '}
              <select value={sort} onChange={e => setSort(e.target.value)}>
                <option value="relevance">Relevance</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </label>
          </div>

          {(q || hasFilters) && (
            <div className="active-filters">
              <i className="fa-solid fa-filter" /> Active:
              {q && <span className="chip">"{q}" <button onClick={() => setParams({})}>×</button></span>}
              {cats.map(c => <span className="chip" key={c}>{c} <button onClick={() => toggle(setCats, c)}>×</button></span>)}
              {brands.map(b => <span className="chip" key={b}>{b} <button onClick={() => toggle(setBrands, b)}>×</button></span>)}
              <button className="link-btn" onClick={clearAll}>Clear all</button>
            </div>
          )}

          {loading ? (
            <div className="loading">Loading products...</div>
          ) : results.length ? (
            <div className={view === 'grid' ? 'product-grid' : 'product-grid list-view'}>
              {results.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div className="empty">
              <i className="fa-solid fa-magnifying-glass" />
              <h2>No Products Found</h2>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
              <button className="primary-btn" onClick={clearAll}>Clear Filters</button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

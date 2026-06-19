import { useParams, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import { useState } from 'react';
import './Catalog.css';

export default function Catalog() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const metalFilter = searchParams.get('metal') || 'all';
  const sortBy = searchParams.get('sort') || 'featured';

  let filtered = category
    ? PRODUCTS.filter(p => p.category === category)
    : [...PRODUCTS];

  if (metalFilter !== 'all') {
    filtered = filtered.filter(p => p.metal === metalFilter);
  }

  if (sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);
  else if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);

  const activeCategory = CATEGORIES.find(c => c.id === category);
  const title = activeCategory ? activeCategory.label : 'All Jewelry';

  const setFilter = (key, val) => {
    const params = new URLSearchParams(searchParams);
    if (val === 'all') params.delete(key);
    else params.set(key, val);
    setSearchParams(params);
  };

  return (
    <div className="catalog-page container">
      <div className="catalog-header">
        <div>
          <h1 className="catalog-title">{title}</h1>
          <p className="catalog-count">{filtered.length} pieces</p>
        </div>
        <button className="filter-toggle" onClick={() => setFiltersOpen(!filtersOpen)}>
          <SlidersHorizontal size={16} /> Filters
        </button>
      </div>

      <div className={`catalog-filters ${filtersOpen ? 'open' : ''}`}>
        <div className="filter-group">
          <label>Metal</label>
          <select value={metalFilter} onChange={e => setFilter('metal', e.target.value)}>
            <option value="all">All Metals</option>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="rose">Rose Gold</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Sort By</label>
          <select value={sortBy} onChange={e => setFilter('sort', e.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
        {(metalFilter !== 'all' || sortBy !== 'featured') && (
          <button className="clear-filters" onClick={() => setSearchParams({})}>
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="catalog-tabs">
        <button className={!category ? 'active' : ''} onClick={() => window.location.href = '/catalog'}>All</button>
        {CATEGORIES.map(c => (
          <button key={c.id} className={category === c.id ? 'active' : ''} onClick={() => window.location.href = `/catalog/${c.id}`}>
            {c.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="catalog-empty">
          <p>No pieces match your filters. Try adjusting them.</p>
        </div>
      ) : (
        <div className="products-grid">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}

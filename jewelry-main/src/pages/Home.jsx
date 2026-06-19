import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Camera, Shield, Truck } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import './Home.css';

const LOOKBOOK_PREVIEW = [
  {
    image: 'https://images.pexels.com/photos/10216924/pexels-photo-10216924.jpeg?auto=compress&cs=tinysrgb&w=600',
    title: 'Golden Hour',
    productId: 3,
  },
  {
    image: 'https://images.pexels.com/photos/10308953/pexels-photo-10308953.jpeg?auto=compress&cs=tinysrgb&w=600',
    title: 'Pearl Glow',
    productId: 6,
  },
  {
    image: 'https://images.pexels.com/photos/1084663/pexels-photo-1084663.jpeg?auto=compress&cs=tinysrgb&w=600',
    title: 'Gold Rush',
    productId: 5,
  },
];

export default function Home() {
  const featured = PRODUCTS.filter(p => p.badge);
  const bestSellers = PRODUCTS.filter(p => p.rating >= 4.7).slice(0, 4);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <img src="https://images.pexels.com/photos/265906/pexels-photo-265906.jpeg?auto=compress&cs=tinysrgb&w=1280" alt="" />
          <div className="hero-overlay" />
        </div>
        <div className="container hero-content">
          <span className="hero-tag"><Sparkles size={14} /> AR-Powered Try-On</span>
          <h1>Try Before<br />You Buy</h1>
          <p>Experience fine jewelry on you — earrings & necklaces — live through your camera.</p>
          <div className="hero-actions">
            <Link to="/catalog" className="btn-primary">Shop Collection <ArrowRight size={16} /></Link>
            <Link to="/try-on/earring/1" className="btn-outline"><Camera size={16} /> Try On Now</Link>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="categories-section container">
        <h2 className="section-title">Shop by Category</h2>
        <div className="categories-grid">
          {CATEGORIES.map(cat => (
            <Link key={cat.id} to={`/catalog/${cat.id}`} className="category-card">
              <img
                src={PRODUCTS.find(p => p.category === cat.id)?.image}
                alt={cat.label}
              />
              <div className="category-overlay">
                <h3>{cat.label}</h3>
                <span>{cat.count} items</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="featured-section container">
        <div className="section-header">
          <h2 className="section-title">Featured Pieces</h2>
          <Link to="/catalog" className="view-all">View All <ArrowRight size={14} /></Link>
        </div>
        <div className="products-grid">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* AR Feature Highlight */}
      <section className="ar-section">
        <div className="container ar-section-inner">
          <div className="ar-text">
            <span className="ar-tag"><Camera size={14} /> Augmented Reality</span>
            <h2>See It On You, Live</h2>
            <p>Our AR engine uses MediaPipe hand & face tracking to place jewelry on you in real-time. No app download needed — just your browser and webcam.</p>
            <div className="ar-features">
              <div className="ar-feature"><Sparkles size={18} /> Real-time tracking</div>
              <div className="ar-feature"><Shield size={18} /> 100% in-browser</div>
              <div className="ar-feature"><Camera size={18} /> No app required</div>
            </div>
            <Link to="/try-on/earring/1" className="btn-primary">Try It Free <ArrowRight size={16} /></Link>
          </div>
          <div className="ar-visual">
            <img src="https://images.pexels.com/photos/3214958/pexels-photo-3214958.jpeg?auto=compress&cs=tinysrgb&w=600" alt="AR demo" />
          </div>
        </div>
      </section>

      {/* Featured Looks */}
      <section className="lookbook-preview container">
        <div className="section-header">
          <h2 className="section-title">Featured Looks</h2>
          <Link to="/lookbook" className="view-all">View Lookbook <ArrowRight size={14} /></Link>
        </div>
        <div className="lookbook-preview-grid">
          {LOOKBOOK_PREVIEW.map((look, i) => (
            <Link key={i} to={`/product/${look.productId}`} className="lookbook-preview-card">
              <img src={look.image} alt={look.title} loading="lazy" />
              <div className="lookbook-preview-overlay">
                <span>{look.title}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bestsellers-section container">
        <div className="section-header">
          <h2 className="section-title">Best Sellers</h2>
          <Link to="/catalog" className="view-all">View All <ArrowRight size={14} /></Link>
        </div>
        <div className="products-grid">
          {bestSellers.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Trust Banner */}
      <section className="trust-banner container">
        <div className="trust-items">
          <div className="trust-item"><Truck size={24} /> Free Shipping Over $200</div>
          <div className="trust-item"><Shield size={24} /> Certified Authentic</div>
          <div className="trust-item"><Camera size={24} /> AR Try-On Available</div>
        </div>
      </section>
    </div>
  );
}

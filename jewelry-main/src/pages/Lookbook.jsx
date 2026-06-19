import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye } from 'lucide-react';
import { PRODUCTS } from '../data/mockData';
import './Lookbook.css';

const LOOKS = [
  {
    id: 1,
    image: 'https://images.pexels.com/photos/10216924/pexels-photo-10216924.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Golden Hour',
    description: 'Statement gold earrings that catch every ray of light.',
    productId: 3,
    style: 'earrings',
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/1136554/pexels-photo-1136554.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Night Bloom',
    description: 'Emerald accents for an after-dark elegance.',
    productId: 4,
    style: 'earrings',
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/10308953/pexels-photo-10308953.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Pearl Glow',
    description: 'Classic pearls reimagined for the modern woman.',
    productId: 6,
    style: 'necklaces',
  },
  {
    id: 4,
    image: 'https://images.pexels.com/photos/1084663/pexels-photo-1084663.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Gold Rush',
    description: 'Bold gold chains for an unmistakable presence.',
    productId: 5,
    style: 'necklaces',
  },
  {
    id: 5,
    image: 'https://images.pexels.com/photos/10216911/pexels-photo-10216911.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Crystal Clear',
    description: 'Crystal drops that dance with every movement.',
    productId: 1,
    style: 'earrings',
  },
  {
    id: 6,
    image: 'https://images.pexels.com/photos/1646817/pexels-photo-1646817.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Layered Luxe',
    description: 'Layered necklaces for a curated, effortless look.',
    productId: 6,
    style: 'necklaces',
  },
  {
    id: 7,
    image: 'https://images.pexels.com/photos/10216936/pexels-photo-10216936.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Everyday Elegance',
    description: 'Subtle sparkle for the daytime minimalist.',
    productId: 2,
    style: 'earrings',
  },
  {
    id: 8,
    image: 'https://images.pexels.com/photos/1232453/pexels-photo-1232453.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Modern Heirloom',
    description: 'Timeless pieces made to be passed down.',
    productId: 8,
    style: 'necklaces',
  },
];

const FILTERS = ['all', 'earrings', 'necklaces'];

export default function Lookbook() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? LOOKS
    : LOOKS.filter(l => l.style === activeFilter);

  return (
    <div className="lookbook-page">
      <div className="lookbook-hero">
        <div className="container">
          <h1>Lookbook</h1>
          <p>Curated editorial looks — see how our pieces come to life.</p>
        </div>
      </div>

      <div className="container">
        <div className="lookbook-filters">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`lookbook-filter ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f === 'all' ? 'All Looks' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="lookbook-grid">
          {filtered.map(look => {
            const product = PRODUCTS.find(p => p.id === look.productId);
            return (
              <div key={look.id} className="lookbook-card">
                <div className="lookbook-card-image">
                  <img src={look.image} alt={look.title} loading="lazy" />
                  <div className="lookbook-card-overlay">
                    <Link to={`/product/${look.productId}`} className="lookbook-view-btn">
                      <Eye size={16} /> View Product
                    </Link>
                  </div>
                </div>
                <div className="lookbook-card-info">
                  <h3>{look.title}</h3>
                  <p>{look.description}</p>
                  {product && (
                    <Link to={`/product/${look.productId}`} className="lookbook-shop-link">
                      Shop {product.name} <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="lookbook-empty">
            <p>No looks found for this category.</p>
          </div>
        )}
      </div>

      <div className="lookbook-cta">
        <div className="container">
          <h2>Ready to find your look?</h2>
          <p>Browse our full collection and try on any piece with AR.</p>
          <Link to="/catalog" className="btn-primary">Shop Collection <ArrowRight size={16} /></Link>
        </div>
      </div>
    </div>
  );
}

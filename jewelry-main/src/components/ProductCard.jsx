import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [wishlisted, setWishlisted] = useState(false);

  const categoryMap = {
    earrings: 'earring',
    necklaces: 'necklace',
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-image-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.badge && <span className="product-badge">{product.badge}</span>}
        {product.arEnabled && <span className="ar-badge">AR Try-On</span>}
        <button
          className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
          onClick={e => { e.preventDefault(); setWishlisted(!wishlisted); }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </Link>
      <div className="product-info">
        <Link to={`/product/${product.id}`} className="product-name">{product.name}</Link>
        <div className="product-meta">
          <span className="product-price">${product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="product-original-price">${product.originalPrice.toLocaleString()}</span>
          )}
        </div>
        <div className="product-rating">
          {'★'.repeat(Math.floor(product.rating))}{product.rating % 1 >= 0.5 ? '½' : ''}
          <span className="rating-count">({product.reviews})</span>
        </div>
        <div className="product-actions">
          <button className="btn-add-cart" onClick={() => addItem(product)}>
            <ShoppingBag size={14} /> Add to Bag
          </button>
          {product.arEnabled && (
            <Link
              to={`/try-on/${categoryMap[product.category]}/${product.id}`}
              className="btn-try-on"
            >
              <Eye size={14} /> Try On
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

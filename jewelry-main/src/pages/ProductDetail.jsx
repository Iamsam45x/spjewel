import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Camera, ArrowLeft, Star, Shield, Truck, ChevronRight } from 'lucide-react';
import { PRODUCTS, SELLERS } from '../data/mockData';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const product = PRODUCTS.find(p => p.id === Number(id));

  if (!product) {
    return (
      <div className="detail-page container">
        <p>Product not found.</p>
        <Link to="/catalog">Back to catalog</Link>
      </div>
    );
  }

  const seller = SELLERS.find(s => s.id === product.seller);
  const categoryMap = { earrings: 'earring', necklaces: 'necklace' };
  const arMode = categoryMap[product.category];

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className="detail-page container">
      <nav className="detail-breadcrumb">
        <Link to="/">Home</Link>
        <ChevronRight size={12} />
        <Link to="/catalog">Catalog</Link>
        <ChevronRight size={12} />
        <Link to={`/catalog/${product.category}`}>{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</Link>
        <ChevronRight size={12} />
        <span>{product.name}</span>
      </nav>

      <div className="detail-grid">
        <div className="detail-images">
          <div className="detail-main-image">
            <img src={product.image} alt={product.name} />
            {product.badge && <span className="product-badge">{product.badge}</span>}
            {discount && <span className="discount-badge">-{discount}%</span>}
          </div>
        </div>

        <div className="detail-info">
          {seller && (
            <Link to={`/catalog`} className="detail-seller">
              <img src={seller.avatar} alt={seller.name} />
              <span>{seller.name}</span>
              {seller.verified && <Shield size={12} className="verified-icon" />}
            </Link>
          )}

          <h1 className="detail-name">{product.name}</h1>

          <div className="detail-rating">
            <Star size={14} fill="var(--accent)" stroke="var(--accent)" />
            <span className="rating-value">{product.rating}</span>
            <span className="rating-count">({product.reviews} reviews)</span>
          </div>

          <div className="detail-price-row">
            <span className="detail-price">${product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="detail-original">${product.originalPrice.toLocaleString()}</span>
            )}
            {discount && <span className="detail-discount">Save {discount}%</span>}
          </div>

          <p className="detail-desc">{product.description}</p>

          <div className="detail-props">
            <div className="detail-metal">
              <span className="metal-label">Metal:</span>
              <span className={`metal-chip ${product.metal}`}>
                {product.metal === 'gold' ? 'Gold' : product.metal === 'silver' ? 'Silver' : 'Rose Gold'}
              </span>
            </div>
            {product.gemstone && (
              <div className="detail-gemstone">
                <span className="metal-label">Gemstone:</span>
                <span className={`gem-chip ${product.gemstone}`}>
                  {product.gemstone.charAt(0).toUpperCase() + product.gemstone.slice(1)}
                </span>
              </div>
            )}
            {product.style && (
              <div className="detail-style">
                <span className="metal-label">Style:</span>
                <span className="style-chip">{product.style.replace(/-/g, ' ')}</span>
              </div>
            )}
          </div>

          <div className="detail-actions">
            <button className="btn-primary btn-lg" onClick={() => addItem(product)}>
              <ShoppingBag size={18} /> Add to Bag — ${product.price.toLocaleString()}
            </button>
            {product.arEnabled && (
              <Link to={`/try-on/${arMode}/${product.id}`} className="btn-ar-lg">
                <Camera size={18} /> Try On with AR
              </Link>
            )}
          </div>

          <div className="detail-perks">
            <div className="perk"><Truck size={16} /> Free shipping</div>
            <div className="perk"><Shield size={16} /> Certified authentic</div>
            <div className="perk"><Camera size={16} /> AR try-on</div>
          </div>
        </div>
      </div>
    </div>
  );
}

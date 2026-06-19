import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Gem, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import './Header.css';

export default function Header() {
  const { count } = useCart();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAR = location.pathname.startsWith('/try-on');

  if (isAR) return null;

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <header className="header">
      <div className="header-inner container">
        <Link to="/" className="logo">
          <Gem size={24} />
          <span className="logo-text">Aurum</span>
        </Link>

        <nav className={`nav ${mobileOpen ? 'open' : ''}`}>
          <Link to="/" className={isActive('/')} onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/catalog" className={isActive('/catalog') ? 'active' : ''} onClick={() => setMobileOpen(false)}>Shop All</Link>
          <Link to="/catalog/earrings" className={isActive('/catalog/earrings') ? 'active' : ''} onClick={() => setMobileOpen(false)}>Earrings</Link>
          <Link to="/catalog/necklaces" className={isActive('/catalog/necklaces') ? 'active' : ''} onClick={() => setMobileOpen(false)}>Necklaces</Link>
          <Link to="/seller" className={isActive('/seller') ? 'active' : ''} onClick={() => setMobileOpen(false)}>Seller Hub</Link>
        </nav>

        <div className="header-actions">
          <button className="icon-btn" aria-label="Search">
            <Search size={20} />
          </button>
          <Link to="/seller" className="icon-btn" aria-label="Seller dashboard">
            <User size={20} />
          </Link>
          <Link to="/cart" className="icon-btn cart-btn" aria-label="Cart">
            <ShoppingBag size={20} />
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>
          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}

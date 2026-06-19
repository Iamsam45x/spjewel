import { Link } from 'react-router-dom';
import { Gem, Mail, MapPin, Phone } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const { pathname } = useLocation();
  if (pathname.startsWith('/try-on')) return null;

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <Gem size={20} />
              <span>SPJewel</span>
            </div>
            <p className="footer-tagline">Virtual try-on for fine jewelry. See it on you before you buy.</p>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            <Link to="/catalog/earrings">Earrings</Link>
            <Link to="/catalog/necklaces">Necklaces</Link>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/seller">Sell on SPJewel</Link>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <span><Mail size={14} /> hello@SPJewel.co</span>
            <span><Phone size={14} /> +1 (800) 555-GEMS</span>
            <span><MapPin size={14} /> New York, NY</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; 2026 SPJewel. All rights reserved.</span>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

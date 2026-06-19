import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Camera } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

const categoryMap = { earrings: 'earring', necklaces: 'necklace' };

export default function Cart() {
  const { items, removeItem, updateQty, total, count } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-page container">
        <div className="cart-empty">
          <ShoppingBag size={48} />
          <h2>Your bag is empty</h2>
          <p>Discover our collection and find something you love.</p>
          <Link to="/catalog" className="btn-primary">Shop Now <ArrowRight size={16} /></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1 className="cart-title">Shopping Bag ({count})</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map(item => (
            <div key={item.id} className="cart-item">
              <Link to={`/product/${item.id}`} className="cart-item-image">
                <img src={item.image} alt={item.name} />
              </Link>
              <div className="cart-item-info">
                <Link to={`/product/${item.id}`} className="cart-item-name">{item.name}</Link>
                <span className="cart-item-meta">{item.category}</span>
                <span className="cart-item-price">${item.price.toLocaleString()}</span>
                <div className="cart-item-actions">
                  <div className="qty-control">
                    <button onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}><Minus size={14} /></button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}><Plus size={14} /></button>
                  </div>
                  {item.arEnabled && (
                    <Link to={`/try-on/${categoryMap[item.category]}/${item.id}`} className="cart-try-on">
                      <Camera size={14} /> Try On
                    </Link>
                  )}
                  <button className="cart-remove" onClick={() => removeItem(item.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${total.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{total >= 200 ? 'Free' : '$15'}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${(total + (total >= 200 ? 0 : 15)).toLocaleString()}</span>
          </div>
          <Link to="/checkout" className="btn-primary checkout-btn">
            Proceed to Checkout <ArrowRight size={16} />
          </Link>
          <Link to="/catalog" className="continue-shopping">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

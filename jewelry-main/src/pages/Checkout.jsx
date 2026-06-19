import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import './Checkout.css';

export default function Checkout() {
  const { items, total, count, clearCart } = useCart();
  const [step, setStep] = useState('info');
  const shipping = total >= 200 ? 0 : 15;

  if (items.length === 0 && step !== 'done') {
    return (
      <div className="checkout-page container">
        <div className="checkout-empty">
          <h2>No items to checkout</h2>
          <Link to="/catalog" className="btn-primary">Shop Now</Link>
        </div>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="checkout-page container">
        <div className="checkout-success">
          <CheckCircle size={56} />
          <h2>Order Placed!</h2>
          <p>Thank you for your purchase. Your order has been confirmed and will be shipped shortly.</p>
          <Link to="/" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page container">
      <Link to="/cart" className="checkout-back"><ArrowLeft size={16} /> Back to Bag</Link>
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-layout">
        <div className="checkout-form">
          {/* Steps indicator */}
          <div className="checkout-steps">
            <div className={`checkout-step ${step === 'info' ? 'active' : step === 'payment' ? 'done' : 'done'}`}>1. Shipping</div>
            <div className={`checkout-step ${step === 'payment' ? 'active' : step === 'done' ? 'done' : ''}`}>2. Payment</div>
            <div className={`checkout-step ${step === 'done' ? 'active' : ''}`}>3. Confirm</div>
          </div>

          {step === 'info' && (
            <div className="form-section">
              <h3>Shipping Information</h3>
              <div className="form-grid">
                <div className="form-group full">
                  <label>Full Name</label>
                  <input type="text" placeholder="Jane Doe" />
                </div>
                <div className="form-group full">
                  <label>Email</label>
                  <input type="email" placeholder="jane@example.com" />
                </div>
                <div className="form-group full">
                  <label>Address</label>
                  <input type="text" placeholder="123 Main St" />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input type="text" placeholder="New York" />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input type="text" placeholder="NY" />
                </div>
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input type="text" placeholder="10001" />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <select><option>United States</option><option>Canada</option><option>United Kingdom</option></select>
                </div>
              </div>
              <button className="btn-primary" onClick={() => setStep('payment')}>Continue to Payment</button>
            </div>
          )}

          {step === 'payment' && (
            <div className="form-section">
              <h3>Payment Details</h3>
              <div className="secure-badge"><Lock size={14} /> Secure Checkout</div>
              <div className="form-grid">
                <div className="form-group full">
                  <label>Card Number</label>
                  <input type="text" placeholder="4242 4242 4242 4242" />
                </div>
                <div className="form-group">
                  <label>Expiry</label>
                  <input type="text" placeholder="MM / YY" />
                </div>
                <div className="form-group">
                  <label>CVC</label>
                  <input type="text" placeholder="123" />
                </div>
                <div className="form-group full">
                  <label>Name on Card</label>
                  <input type="text" placeholder="Jane Doe" />
                </div>
              </div>
              <div className="form-buttons">
                <button className="btn-outline" onClick={() => setStep('info')}>Back</button>
                <button className="btn-primary" onClick={() => { setStep('done'); clearCart(); }}>
                  Place Order — ${(total + shipping).toLocaleString()}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="checkout-summary">
          <h3>Order Summary ({count} items)</h3>
          {items.map(item => (
            <div key={item.id} className="checkout-item">
              <img src={item.image} alt={item.name} />
              <div>
                <span className="checkout-item-name">{item.name}</span>
                <span className="checkout-item-qty">Qty: {item.qty}</span>
              </div>
              <span className="checkout-item-price">${(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
          <div className="checkout-totals">
            <div className="summary-row"><span>Subtotal</span><span>${total.toLocaleString()}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : '$15'}</span></div>
            <div className="summary-row total"><span>Total</span><span>${(total + shipping).toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

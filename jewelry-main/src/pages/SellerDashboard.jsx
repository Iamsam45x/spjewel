import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, DollarSign, TrendingUp, Eye, Plus, BarChart3, ShoppingBag, Star } from 'lucide-react';
import { PRODUCTS, SELLERS, SELLER_ORDERS } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import './SellerDashboard.css';

const STAT_CARDS = [
  { label: 'Total Revenue', value: '$14,295', change: '+12.5%', icon: DollarSign, color: 'gold' },
  { label: 'Orders', value: '47', change: '+8.2%', icon: Package, color: 'blue' },
  { label: 'Views', value: '2,847', change: '+24.1%', icon: Eye, color: 'green' },
  { label: 'Conversion', value: '3.2%', change: '+0.8%', icon: TrendingUp, color: 'orange' },
];

const STATUS_MAP = {
  pending: { label: 'Pending', class: 'pending' },
  processing: { label: 'Processing', class: 'processing' },
  shipped: { label: 'Shipped', class: 'shipped' },
  delivered: { label: 'Delivered', class: 'delivered' },
};

export default function SellerDashboard() {
  const [tab, setTab] = useState('overview');
  const seller = SELLERS[0]; // Simulate logged-in seller
  const myProducts = PRODUCTS.filter(p => p.seller === seller.id);

  return (
    <div className="seller-page container">
      <div className="seller-header">
        <div className="seller-profile">
          <img src={seller.avatar} alt={seller.name} className="seller-avatar" />
          <div>
            <h1>{seller.name}</h1>
            <div className="seller-meta">
              <span className="seller-verified"><Star size={12} /> Verified Seller</span>
              <span>{seller.rating} rating</span>
              <span>{seller.totalSales} sales</span>
              <span>Since {seller.since}</span>
            </div>
          </div>
        </div>
        <Link to="/catalog" className="btn-primary"><Plus size={16} /> Add New Listing</Link>
      </div>

      <div className="seller-tabs">
        <button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}>
          <BarChart3 size={16} /> Overview
        </button>
        <button className={tab === 'listings' ? 'active' : ''} onClick={() => setTab('listings')}>
          <ShoppingBag size={16} /> My Listings
        </button>
        <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>
          <Package size={16} /> Orders
        </button>
      </div>

      {tab === 'overview' && (
        <div className="dashboard-overview">
          <div className="stat-cards">
            {STAT_CARDS.map(s => (
              <div key={s.label} className={`stat-card ${s.color}`}>
                <div className="stat-icon"><s.icon size={20} /></div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-change">{s.change}</div>
              </div>
            ))}
          </div>

          {/* Mini revenue chart placeholder */}
          <div className="chart-card">
            <h3>Revenue Trend</h3>
            <div className="chart-bars">
              {[35, 52, 48, 61, 55, 72, 68, 84, 78, 92, 88, 96].map((h, i) => (
                <div key={i} className="chart-bar" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="chart-labels">
              {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>

          {/* Recent orders */}
          <div className="recent-orders">
            <h3>Recent Orders</h3>
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Product</th>
                  <th>Buyer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {SELLER_ORDERS.slice(0, 4).map(o => (
                  <tr key={o.id}>
                    <td className="order-id">{o.id}</td>
                    <td>{o.product}</td>
                    <td>{o.buyer}</td>
                    <td className="order-amount">${o.amount.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${STATUS_MAP[o.status].class}`}>
                        {STATUS_MAP[o.status].label}
                      </span>
                    </td>
                    <td className="order-date">{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'listings' && (
        <div className="seller-listings">
          <div className="listings-header">
            <h2>My Listings ({myProducts.length})</h2>
          </div>
          <div className="products-grid">
            {myProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="seller-orders">
          <h2>All Orders</h2>
          <table className="orders-table full">
            <thead>
              <tr>
                <th>Order</th>
                <th>Product</th>
                <th>Buyer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {SELLER_ORDERS.map(o => (
                <tr key={o.id}>
                  <td className="order-id">{o.id}</td>
                  <td>{o.product}</td>
                  <td>{o.buyer}</td>
                  <td className="order-amount">${o.amount.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${STATUS_MAP[o.status].class}`}>
                      {STATUS_MAP[o.status].label}
                    </span>
                  </td>
                  <td className="order-date">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

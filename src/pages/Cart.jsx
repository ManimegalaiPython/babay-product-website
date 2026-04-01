import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import './Cart.css';

const API_BASE = 'https://manipraveen1.pythonanywhere.com/api/';

const resolveImg = (src) => {
  if (!src) return 'https://via.placeholder.com/80x80?text=No+Image';
  return src.startsWith('http') ? src : `${API_BASE}${src}`;
};

const Cart = () => {
  const { cart, removeItem, updateQuantity, loadCart } = useCart();
  const navigate = useNavigate();

  // Load cart fresh every time this page is visited
  useEffect(() => {
    loadCart();
  }, []);

  const items = cart?.items || [];
  const totalPrice = cart?.total_price || 0;

  return (
    <div className="cart-root">

      {/* Breadcrumb */}
      <div className="cart-breadcrumb">
        <Link to="/">Home</Link> / Cart
      </div>

      <h2 className="cart-title">Cart</h2>

      {/* Table Header */}
      <div className="cart-header">
        <span>Name</span>
        <span>Qty</span>
        <span>Age</span>
        <span>Price</span>
        <span>Remove</span>
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <Link to="/" className="cart-empty-link">Continue Shopping</Link>
        </div>
      ) : (
        /* Cart Items */
        items.map(item => (
          <div className="cart-row" key={item.id}>

            {/* Product Name + Image */}
            <div className="cart-product">
              <img
                src={resolveImg(item.product?.image)}
                alt={item.product?.name || 'Product'}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                }}
              />
              <div className="cart-product-name">{item.product?.name}</div>
            </div>

            {/* Quantity */}
            <select
              className="cart-qty-select"
              value={item.quantity}
              onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>

            {/* Age Group */}
            <span className="cart-age">
              {item.product?.age_group || '0-12M'}
            </span>

            {/* Price */}
            <span className="cart-price">
              ₹{(Number(item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}
            </span>

            {/* Remove */}
            <button
              className="cart-remove-btn"
              onClick={() => removeItem(item.id)}
              title="Remove item"
            >
              🗑
            </button>

          </div>
        ))
      )}

      {/* Order Summary */}
      <div className="cart-summary">
        <div className="summary-box">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{Number(totalPrice).toLocaleString('en-IN')}</span>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <span>₹0</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>₹{Number(totalPrice).toLocaleString('en-IN')}</span>
          </div>

          <button
            className="checkout-btn"
            onClick={() => navigate('/checkout')}
            disabled={items.length === 0}
          >
            Checkout
          </button>
        </div>
      </div>

      {/* Continue Shopping */}
      <div className="cart-continue">
        <Link to="/" className="continue-link">Continue shopping</Link>
      </div>

    </div>
  );
};

export default Cart;

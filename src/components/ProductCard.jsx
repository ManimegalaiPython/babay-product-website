import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductCard.css';

const API_BASE = 'http://localhost:8000';

const ProductCard = ({ product, isRental = false, rentalPeriod = 'Monthly', buttonText }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [wished, setWished] = useState(false);
  const [addedCart, setAddedCart] = useState(false);

  const imgSrc = product.image?.startsWith('http')
    ? product.image
    : product.image
      ? `${API_BASE}${product.image}`
      : 'https://via.placeholder.com/200x200?text=No+Image';

  const priceLabel = isRental
    ? `₹${Number(product.price).toLocaleString('en-IN')} / ${rentalPeriod.toLowerCase()}`
    : `₹${Number(product.price).toLocaleString('en-IN')}`;

  const discount = Number(product.discount);

  const handleCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert('Please login to add items to cart.');
      navigate('/login');
      return;
    }

    try {
      await addItem(product.id, 1);
      setAddedCart(true);
      setTimeout(() => navigate('/cart'), 500);
    } catch (error) {
      console.error('Add to cart failed:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  const handleBuy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/product/${product.slug}`);
  };

  const label = buttonText || (isRental ? 'Book Now' : 'Buy Now');

  return (
    <div className="pc-card">
      {discount > 0 && <span className="pc-badge">{discount}% OFF</span>}

      <button
        className={`pc-wish ${wished ? 'active' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          setWished(!wished);
        }}
      >
        {wished ? '♥' : '♡'}
      </button>

      <Link to={`/product/${product.slug}`} className="pc-img-link">
        <div className="pc-img-wrap">
          <img
            src={imgSrc}
            alt={product.name}
            className="pc-img"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
            }}
          />
        </div>
      </Link>

      <div className="pc-body">
        <Link to={`/product/${product.slug}`} className="pc-name-link">
          <h3 className="pc-name">{product.name}</h3>
        </Link>

        <div className="pc-price-row">
          <span className="pc-price">{priceLabel}</span>
          {discount > 0 && product.original_price && (
            <span className="pc-original">
              ₹{Number(product.original_price).toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <div className="pc-actions">
          <button
            className={`pc-btn pc-cart ${addedCart ? 'added' : ''}`}
            onClick={handleCart}
          >
            {addedCart ? '✓ Added' : 'Add to Cart'}
          </button>

          <button
            className={`pc-btn pc-buy ${isRental ? 'rental' : ''}`}
            onClick={handleBuy}
          >
            {label}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
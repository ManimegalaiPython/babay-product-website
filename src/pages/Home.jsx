import React, { useEffect, useState } from 'react';
import Banner from '../components/Banner';
import CategoryIcons from '../components/CategoryIcons';
import ProductCard from '../components/ProductCard';
import {
  fetchProducts,
  fetchReviews,
  likeReview,
  dislikeReview,
  fetchBrands
} from '../services/api';

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [topSelling, setTopSelling]   = useState([]);
  const [reviews, setReviews]         = useState([]);
  const [brands, setBrands]           = useState([]);

  const [loadingNew,     setLoadingNew]     = useState(true);
  const [loadingTop,     setLoadingTop]     = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [topIndex, setTopIndex] = useState(0);
  const visibleCount = 4;

  // ── Track which reviews the user has already voted on (prevents double vote)
  const [voted, setVoted] = useState({});  // { [reviewId]: 'like' | 'dislike' }

  // ===== PRODUCTS =====
  useEffect(() => {
    fetchProducts({ is_new: true })
      .then(res => setNewArrivals(res.data.results || res.data))
      .finally(() => setLoadingNew(false));

    fetchProducts({ is_top_selling: true })
      .then(res => setTopSelling(res.data.results || res.data))
      .finally(() => setLoadingTop(false));
  }, []);

  // ===== BRANDS =====
  useEffect(() => {
    fetchBrands()
      .then(res => setBrands(res.data))
      .catch(err => console.error('Failed to load brands:', err));
  }, []);

  // ===== REVIEWS =====
  useEffect(() => {
    fetchReviews()
      .then(res => setReviews(res.data))
      .finally(() => setLoadingReviews(false));
  }, []);

  // ===== SLIDER =====
  const handleNext = () => {
    if (topIndex + visibleCount < topSelling.length) setTopIndex(topIndex + visibleCount);
  };
  const handlePrev = () => {
    if (topIndex - visibleCount >= 0) setTopIndex(topIndex - visibleCount);
  };

  // ===== LIKE — one vote per review per session =====
  const handleLike = async (id) => {
    if (voted[id]) return;
    try {
      await likeReview(id);
      setReviews(prev =>
        prev.map(r => r.id === id ? { ...r, likes: (r.likes || 0) + 1 } : r)
      );
      setVoted(prev => ({ ...prev, [id]: 'like' }));
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  // ===== DISLIKE — one vote per review per session =====
  const handleDislike = async (id) => {
    if (voted[id]) return;
    try {
      await dislikeReview(id);
      setReviews(prev =>
        prev.map(r => r.id === id ? { ...r, dislikes: (r.dislikes || 0) + 1 } : r)
      );
      setVoted(prev => ({ ...prev, [id]: 'dislike' }));
    } catch (err) {
      console.error('Dislike failed:', err);
    }
  };

  return (
    <div>
      <Banner />
      <CategoryIcons />

      {/* ===== NEW ARRIVALS ===== */}
      <div className="container">
        <h2>New Arrivals</h2>
        {loadingNew ? (
          <div className="loading">Loading new arrivals...</div>
        ) : (
          <div className="products-grid">
            {newArrivals.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* ===== TOP SELLING ===== */}
      <div className="container top-selling-section">
        <h2>Top Selling</h2>
        <div className="slider-container">
          <button className="arrow left" onClick={handlePrev} disabled={topIndex === 0}>❮</button>
          <div className="products-grid1">
            {topSelling.slice(topIndex, topIndex + visibleCount).map(p => (
              <ProductCard key={p.id} product={p} buttonText="Shop Now" />
            ))}
          </div>
          <button className="arrow right" onClick={handleNext} disabled={topIndex + visibleCount >= topSelling.length}>❯</button>
        </div>
      </div>

      {/* ===== TOP BRANDS — continuous marquee ===== */}
      <div className="top-brands-section">
        <h2>Top Brands</h2>
        <div className="brands-slider">
          <div className="brands-track">
            {brands.map((b, idx) => (
              <img key={idx} src={b.image} alt={b.name} className="brand-img" />
            ))}
            {/* ✅ Duplicate for seamless infinite loop */}
            {brands.map((b, idx) => (
              <img key={`dup-${idx}`} src={b.image} alt={b.name} className="brand-img" />
            ))}
          </div>
        </div>
      </div>

      {/* ===== OUR HAPPY CUSTOMER ===== */}
      <div className="happy-section">
        <h2>Our happy customer</h2>
        {loadingReviews ? (
          <div className="loading">Loading reviews...</div>
        ) : (
          <div className="customer-grid">
            {reviews.map(r => (
              <div key={r.id} className="customer-card">
                <div className="avatar">{r.name?.charAt(0) || '👤'}</div>
                <h3>{r.name}</h3>
                <div className="stars">
                  {'★'.repeat(r.rating || 5)}{'☆'.repeat(5 - (r.rating || 5))}
                </div>
                <p>{r.text}</p>
                <div className="reaction-buttons">
                  {/* ✅ Disables both buttons after one vote; highlights the chosen one */}
                  <button
                    onClick={() => handleLike(r.id)}
                    className={`like-btn ${voted[r.id] === 'like' ? 'voted-like' : ''}`}
                    disabled={!!voted[r.id]}
                    title={voted[r.id] ? 'Already voted' : 'Like'}
                  >
                    👍 {r.likes || 0}
                  </button>
                  <button
                    onClick={() => handleDislike(r.id)}
                    className={`dislike-btn ${voted[r.id] === 'dislike' ? 'voted-dislike' : ''}`}
                    disabled={!!voted[r.id]}
                    title={voted[r.id] ? 'Already voted' : 'Dislike'}
                  >
                    👎 {r.dislikes || 0}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
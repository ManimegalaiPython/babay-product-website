import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchProductBySlug } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'https://manipraveen1.pythonanywhere.com/api/';

const resolveImg = (src, fallbackSize = '400x400') =>
  !src
    ? `https://via.placeholder.com/${fallbackSize}?text=No+Image`
    : src.startsWith('http')
    ? src
    : `${API_BASE}${src}`;

const Stars = ({ rating = 0 }) => (
  <span style={{ color: '#f59e0b', fontSize: 15, letterSpacing: 1 }}>
    {'★'.repeat(Math.round(rating))}
    {'☆'.repeat(5 - Math.round(rating))}
  </span>
);

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .pd-root {
    font-family: 'Nunito', 'Segoe UI', sans-serif;
    background: #fff;
    color: #1a1a1a;
    min-height: 100vh;
  }

  .pd-state {
    display: flex; align-items: center; justify-content: center;
    min-height: 60vh;
    font-size: 18px; font-weight: 700; color: #888;
  }

  .pd-breadcrumb { font-size: 12px; color: #888; padding: 10px 32px; }
  .pd-breadcrumb a { color: #888; text-decoration: none; }
  .pd-breadcrumb a:hover { color: #f472b6; }

  .pd-main {
    display: flex; gap: 40px;
    padding: 16px 32px 32px;
    max-width: 1100px; margin: 0 auto;
  }

  .pd-gallery { display: flex; flex-direction: column; gap: 12px; min-width: 360px; }
  .pd-main-img-wrap {
    background: #f3f4f6; border-radius: 12px; overflow: hidden;
    width: 360px; height: 360px;
    display: flex; align-items: center; justify-content: center;
  }
  .pd-main-img { width: 100%; height: 100%; object-fit: cover; }
  .pd-thumbs { display: flex; gap: 10px; flex-wrap: wrap; }
  .pd-thumb {
    width: 80px; height: 80px; border-radius: 8px; overflow: hidden;
    border: 2px solid transparent; cursor: pointer;
    background: #f3f4f6; transition: border-color .2s;
  }
  .pd-thumb.active { border-color: #f472b6; }
  .pd-thumb img { width: 100%; height: 100%; object-fit: cover; }

  .pd-info { flex: 1; padding-top: 4px; }
  .pd-info h1 { font-size: 20px; font-weight: 800; line-height: 1.35; margin-bottom: 8px; }
  .pd-mrp { font-size: 15px; color: #333; margin-bottom: 2px; }
  .pd-mrp strong { color: #1a1a1a; font-weight: 800; }
  .pd-mrp .pd-strike {
    font-size: 13px; color: #aaa; text-decoration: line-through; margin-left: 8px;
  }
  .pd-mrp .pd-disc { font-size: 13px; color: #16a34a; font-weight: 800; margin-left: 6px; }
  .pd-tax { font-size: 11px; color: #888; margin-bottom: 16px; }

  .pd-row { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; flex-wrap: wrap; }
  .pd-label { font-size: 14px; font-weight: 700; min-width: 80px; }

  .pd-swatch {
    width: 24px; height: 24px; border-radius: 50%;
    cursor: pointer; border: 2px solid transparent;
    transition: border-color .2s, transform .15s;
    display: inline-block;
  }
  .pd-swatch.active { border-color: #111; transform: scale(1.18); }

  .pd-pill {
    border: 1.5px solid #ccc; border-radius: 6px;
    padding: 5px 14px; font-size: 13px; font-weight: 700;
    cursor: pointer; background: #fff; transition: all .15s;
    font-family: 'Nunito', sans-serif;
  }
  .pd-pill.active { border-color: #f472b6; color: #f472b6; background: #fff0f6; }

  .pd-qty { display: flex; align-items: center; }
  .pd-qty-btn {
    width: 32px; height: 32px;
    border: 1.5px solid #ccc; background: #fff;
    font-size: 18px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    border-radius: 4px; transition: background .15s;
    font-family: 'Nunito', sans-serif;
  }
  .pd-qty-btn:hover { background: #f3f4f6; }
  .pd-qty-val {
    width: 40px; height: 32px;
    border-top: 1.5px solid #ccc; border-bottom: 1.5px solid #ccc;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 15px;
  }

  .pd-actions { display: flex; gap: 12px; margin: 20px 0; }
  .pd-btn {
    flex: 1; padding: 13px 0; border-radius: 8px;
    border: none; font-size: 15px; font-weight: 800;
    cursor: pointer; font-family: 'Nunito', sans-serif;
    transition: opacity .15s, transform .1s;
    background: #fbbf24; color: #1a1a1a;
  }
  .pd-btn:active { transform: scale(.97); }
  .pd-btn:hover { opacity: .88; }
  .pd-btn:disabled { opacity: .5; cursor: not-allowed; }
  .pd-btn.added { background: #86efac; }

  .pd-pincode-label { font-size: 14px; font-weight: 700; margin-bottom: 8px; }
  .pd-pincode-row { display: flex; max-width: 340px; }
  .pd-pincode-input {
    flex: 1; padding: 10px 14px;
    border: 1.5px solid #ccc; border-right: none;
    border-radius: 6px 0 0 6px;
    font-size: 14px; font-family: 'Nunito', sans-serif; outline: none;
  }
  .pd-pincode-input:focus { border-color: #f472b6; }
  .pd-pincode-btn {
    padding: 10px 20px; background: #fbbf24;
    border: 1.5px solid #fbbf24; border-radius: 0 6px 6px 0;
    font-weight: 800; font-size: 14px; cursor: pointer;
    font-family: 'Nunito', sans-serif;
  }
  .pd-pincode-result { font-size: 12px; margin-top: 6px; color: #16a34a; font-weight: 700; }

  .pd-tabs-section { max-width: 1100px; margin: 0 auto 32px; padding: 0 32px; }
  .pd-tabs-border { border: 1.5px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
  .pd-tab-list { display: flex; border-bottom: 1.5px solid #e5e7eb; }
  .pd-tab {
    flex: 1; padding: 14px 0; font-size: 14px; font-weight: 700;
    border: none; background: #fff; cursor: pointer;
    font-family: 'Nunito', sans-serif; color: #777;
    position: relative; transition: color .15s; text-transform: capitalize;
  }
  .pd-tab.active { color: #1a1a1a; }
  .pd-tab.active::after {
    content: ''; position: absolute;
    bottom: -1px; left: 12px; right: 12px;
    height: 3px; background: #f472b6; border-radius: 2px;
  }
  .pd-tab-body { padding: 24px; min-height: 140px; }
  .pd-tab-body h4 {
    font-size: 12px; font-weight: 800; letter-spacing: .07em;
    text-transform: uppercase; margin-bottom: 8px; color: #555;
  }
  .pd-tab-body p, .pd-tab-body li { font-size: 13px; line-height: 1.75; color: #444; }
  .pd-tab-body ul { padding-left: 18px; }
  .pd-tab-cols { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; }

  .pd-reviews-section { max-width: 1100px; margin: 0 auto 32px; padding: 0 32px; }
  .pd-reviews-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .pd-reviews-header h2 { font-size: 18px; font-weight: 800; }
  .pd-write-review-link { font-size: 14px; font-weight: 700; color: #f472b6; text-decoration: none; }
  .pd-reviews-grid {
    background: #fce7f3; border-radius: 12px; padding: 20px;
    display: grid; grid-template-columns: repeat(3, 1fr) auto; gap: 16px; align-items: start;
  }
  .pd-review-card { background: #fff; border-radius: 10px; padding: 14px; }
  .pd-review-user { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
  .pd-review-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }
  .pd-review-name { font-weight: 800; font-size: 14px; }
  .pd-review-text { font-size: 12px; color: #444; line-height: 1.6; margin-top: 6px; }
  .pd-write-box {
    background: #fff; border: 1.5px solid #e5e7eb; border-radius: 10px;
    padding: 14px; display: flex; flex-direction: column; gap: 10px; min-width: 180px;
  }
  .pd-write-box textarea {
    resize: none; border: 1px solid #e5e7eb; border-radius: 6px;
    padding: 8px; font-size: 13px; font-family: 'Nunito', sans-serif;
    height: 90px; outline: none;
  }
  .pd-write-box textarea:focus { border-color: #f472b6; }
  .pd-submit-btn {
    background: #fbbf24; border: none; border-radius: 6px;
    padding: 8px 0; font-weight: 800; font-size: 14px;
    cursor: pointer; font-family: 'Nunito', sans-serif; width: 100%;
  }

  .pd-related-section { max-width: 1100px; margin: 0 auto 48px; padding: 0 32px; }
  .pd-related-title { font-size: 18px; font-weight: 800; margin-bottom: 16px; }
  .pd-related-scroll-wrap { position: relative; }
  .pd-related-grid {
    display: flex; gap: 16px; overflow-x: auto;
    scroll-snap-type: x mandatory; padding-bottom: 8px;
  }
  .pd-related-grid::-webkit-scrollbar { height: 4px; }
  .pd-related-grid::-webkit-scrollbar-thumb { background: #f472b6; border-radius: 2px; }
  .pd-rel-card {
    min-width: 190px; max-width: 190px; border: 1.5px solid #e5e7eb;
    border-radius: 10px; overflow: hidden; scroll-snap-align: start;
    background: #fff; position: relative;
  }
  .pd-rel-img { width: 100%; height: 160px; object-fit: cover; background: #f3f4f6; display: block; }
  .pd-rel-wish {
    position: absolute; top: 8px; right: 8px; background: #fff;
    border: none; border-radius: 50%; width: 28px; height: 28px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 14px; color: #999;
    box-shadow: 0 1px 4px rgba(0,0,0,.12);
  }
  .pd-rel-wish.active { color: #f472b6; }
  .pd-rel-body { padding: 10px; }
  .pd-rel-name { font-size: 12px; font-weight: 700; line-height: 1.4; margin-bottom: 6px; min-height: 48px; }
  .pd-rel-price { font-size: 13px; font-weight: 800; margin-bottom: 3px; }
  .pd-rel-meta { font-size: 11px; color: #888; margin-bottom: 3px; }
  .pd-rel-swatches { display: flex; gap: 5px; margin-bottom: 10px; }
  .pd-rel-swatch { width: 14px; height: 14px; border-radius: 50%; display: inline-block; }
  .pd-rel-actions { display: flex; gap: 6px; }
  .pd-rel-btn {
    flex: 1; padding: 7px 0; border: none; border-radius: 6px;
    background: #fbbf24; font-weight: 800; font-size: 11px;
    cursor: pointer; font-family: 'Nunito', sans-serif;
  }
  .pd-rel-btn:hover { opacity: .85; }
  .pd-next-btn {
    position: absolute; right: -16px; top: 50%; transform: translateY(-50%);
    width: 36px; height: 36px; border-radius: 50%; background: #fbbf24;
    border: none; font-size: 20px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,.15); z-index: 1;
  }

  @media (max-width: 768px) {
    .pd-main { flex-direction: column; padding: 12px 16px; gap: 20px; }
    .pd-gallery { min-width: unset; }
    .pd-main-img-wrap { width: 100%; height: 280px; }
    .pd-reviews-grid { grid-template-columns: 1fr; }
    .pd-tab-cols { grid-template-columns: 1fr; }
    .pd-tabs-section, .pd-reviews-section, .pd-related-section { padding: 0 16px; }
    .pd-tab { font-size: 12px; }
  }
`;

const RelatedCard = ({ product }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [wished, setWished] = useState(false);

  const colors = Array.isArray(product.colors)
    ? product.colors
    : typeof product.colors === 'string'
    ? product.colors.split(',').map(c => c.trim())
    : [];

  const handleRelatedCart = async () => {
    if (!user) {
      alert('Please login to add items to cart.');
      navigate('/login');
      return;
    }
    try {
      await addItem(product.id, 1);
      navigate('/cart');
    } catch (error) {
      console.error('Add to cart failed:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  return (
    <div className="pd-rel-card">
      <img
        src={resolveImg(product.image, '200x200')}
        alt={product.name}
        className="pd-rel-img"
        onError={e => { e.target.src = 'https://via.placeholder.com/200x200?text=No+Image'; }}
      />
      <button
        className={`pd-rel-wish ${wished ? 'active' : ''}`}
        onClick={() => setWished(w => !w)}
      >{wished ? '♥' : '♡'}</button>

      <div className="pd-rel-body">
        <div className="pd-rel-name">{product.name}</div>
        <div className="pd-rel-price">Price : ₹{Number(product.price).toLocaleString('en-IN')}</div>
        {product.age_group && <div className="pd-rel-meta">Age: {product.age_group}</div>}
        {colors.length > 0 && (
          <>
            <div className="pd-rel-meta">Color:</div>
            <div className="pd-rel-swatches">
              {colors.map((c, i) => <span key={i} className="pd-rel-swatch" style={{ background: c }} />)}
            </div>
          </>
        )}
        <div className="pd-rel-actions">
          <button className="pd-rel-btn" onClick={() => navigate(`/product/${product.slug}`)}>Buy Now</button>
          <button className="pd-rel-btn" onClick={handleRelatedCart}>Add to cart</button>
        </div>
      </div>
    </div>
  );
};

const TABS = ['description', 'specification', 'expert advice', 'delivery & return'];
const PLACEHOLDER_REVIEWS = [
  { id: 'r1', name: 'Arya',       avatar: 'https://i.pravatar.cc/40?img=1', rating: 4, text: 'Really amazing and best shirt for hot weather.' },
  { id: 'r2', name: 'Marsha',     avatar: 'https://i.pravatar.cc/40?img=5', rating: 5, text: 'Amazing product and great quality...delivered before time!' },
  { id: 'r3', name: 'Snehal Lad', avatar: 'https://i.pravatar.cc/40?img=9', rating: 5, text: 'Best fashion store for my little boy. We luv to shop here.' },
];

const ProductDetails = () => {
  const { slug }    = useParams();
  const navigate    = useNavigate();
  const { addItem } = useCart();
  const { user }    = useAuth();

  const [product,    setProduct]    = useState(null);
  const [related,    setRelated]    = useState([]);
  const [reviews,    setReviews]    = useState(PLACEHOLDER_REVIEWS);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(false);
  const [activeImg,  setActiveImg]  = useState(0);
  const [activeColor,setActiveColor]= useState(0);
  const [activeAge,  setActiveAge]  = useState(0);
  const [qty,        setQty]        = useState(1);
  const [activeTab,  setActiveTab]  = useState('description');
  const [pincode,    setPincode]    = useState('');
  const [pinResult,  setPinResult]  = useState('');
  const [reviewText, setReviewText] = useState('');
  const [addedCart,  setAddedCart]  = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetchProductBySlug(slug)
      .then(res => {
        setProduct(res.data);
        if (res.data?.related_products) setRelated(res.data.related_products);
        if (res.data?.reviews)          setReviews(res.data.reviews);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please login to add items to cart.');
      navigate('/login');
      return;
    }
    try {
      await addItem(product.id, qty);
      setAddedCart(true);
      setTimeout(() => navigate('/cart'), 400);
    } catch (error) {
      console.error('Add to cart failed:', error);
      alert('Failed to add to cart. Please try again.');
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      alert('Please login to continue.');
      navigate('/login');
      return;
    }
    try {
      await addItem(product.id, qty);
      navigate('/checkout');
    } catch (error) {
      console.error('Buy now failed:', error);
    }
  };

  const handlePinCheck = () => {
    if (pincode.length === 6) {
      setPinResult(`✓ Delivery available to ${pincode}`);
    } else {
      setPinResult('Please enter a valid 6-digit pincode.');
    }
  };

  const handleReviewSubmit = () => {
    if (!reviewText.trim()) return;
    setReviews(prev => [
      ...prev,
      { id: Date.now(), name: 'You', avatar: 'https://i.pravatar.cc/40?img=12', rating: 5, text: reviewText.trim() },
    ]);
    setReviewText('');
  };

  const scrollNext = () => scrollRef.current?.scrollBy({ left: 220, behavior: 'smooth' });

  const getImages = () => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length) return product.images;
    if (Array.isArray(product.image_urls) && product.image_urls.length) return product.image_urls;
    if (product.image) return [product.image];
    return [];
  };

  const images     = getImages();
  const mainImgSrc = images.length ? resolveImg(images[activeImg]) : resolveImg(null);

  const colors = product
    ? Array.isArray(product.colors)
      ? product.colors
      : typeof product.colors === 'string' && product.colors
      ? product.colors.split(',').map(c => c.trim())
      : []
    : [];

  const ageGroups = product
    ? Array.isArray(product.age_groups)
      ? product.age_groups
      : typeof product.age_groups === 'string' && product.age_groups
      ? product.age_groups.split(',').map(a => a.trim())
      : []
    : [];

  if (loading) return (
    <>
      <style>{STYLES}</style>
      <div className="pd-root">
        <div className="pd-state">Loading product…</div>
      </div>
    </>
  );

  if (error || !product) return (
    <>
      <style>{STYLES}</style>
      <div className="pd-root">
        <div className="pd-state">Product not found.</div>
      </div>
    </>
  );

  return (
    <>
      <style>{STYLES}</style>
      <div className="pd-root">

        <div className="pd-breadcrumb">
          <Link to="/">Home</Link> / <Link to="/baby-fashion">baby fashion</Link> / {product.name}
        </div>

        <div className="pd-main">

          <div className="pd-gallery">
            <div className="pd-main-img-wrap">
              <img
                className="pd-main-img"
                src={mainImgSrc}
                alt={product.name}
                onError={e => { e.target.src = 'https://via.placeholder.com/400x400?text=No+Image'; }}
              />
            </div>
            {images.length > 1 && (
              <div className="pd-thumbs">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className={`pd-thumb ${activeImg === i ? 'active' : ''}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img
                      src={resolveImg(img, '80x80')}
                      alt={`View ${i + 1}`}
                      onError={e => { e.target.src = 'https://via.placeholder.com/80x80'; }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pd-info">
            <h1>{product.name}</h1>

            <div className="pd-mrp">
              MRP : <strong>₹{Number(product.price).toLocaleString('en-IN')}</strong>
              {product.original_price && (
                <span className="pd-strike">₹{Number(product.original_price).toLocaleString('en-IN')}</span>
              )}
              {product.discount > 0 && (
                <span className="pd-disc">{product.discount}% OFF</span>
              )}
            </div>
            <div className="pd-tax">Price inclusive of all taxes</div>

            {colors.length > 0 && (
              <div className="pd-row">
                <span className="pd-label">Color</span>
                {colors.map((c, i) => (
                  <span
                    key={i}
                    className={`pd-swatch ${activeColor === i ? 'active' : ''}`}
                    style={{ background: c }}
                    onClick={() => setActiveColor(i)}
                    title={c}
                  />
                ))}
              </div>
            )}

            {ageGroups.length > 0 && (
              <div className="pd-row">
                <span className="pd-label">Age Group</span>
                {ageGroups.map((ag, i) => (
                  <button
                    key={i}
                    className={`pd-pill ${activeAge === i ? 'active' : ''}`}
                    onClick={() => setActiveAge(i)}
                  >{ag}</button>
                ))}
              </div>
            )}

            <div className="pd-row">
              <span className="pd-label">Quantity</span>
              <div className="pd-qty">
                <button className="pd-qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <div className="pd-qty-val">{qty}</div>
                <button className="pd-qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
              </div>
            </div>

            <div className="pd-actions">
              <button
                className={`pd-btn ${addedCart ? 'added' : ''}`}
                onClick={handleAddToCart}
              >
                {addedCart ? '✓ Added!' : 'Add to cart'}
              </button>
              <button className="pd-btn" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>

            <div className="pd-pincode-label">Check Pincode</div>
            <div className="pd-pincode-row">
              <input
                className="pd-pincode-input"
                placeholder="Enter pincode"
                value={pincode}
                onChange={e => { setPincode(e.target.value.replace(/\D/g, '')); setPinResult(''); }}
                maxLength={6}
              />
              <button className="pd-pincode-btn" onClick={handlePinCheck}>Check</button>
            </div>
            {pinResult && <div className="pd-pincode-result">{pinResult}</div>}
          </div>
        </div>

        <div className="pd-tabs-section">
          <div className="pd-tabs-border">
            <div className="pd-tab-list">
              {TABS.map(t => (
                <button
                  key={t}
                  className={`pd-tab ${activeTab === t ? 'active' : ''}`}
                  onClick={() => setActiveTab(t)}
                >{t}</button>
              ))}
            </div>
            <div className="pd-tab-body">
              {activeTab === 'description' && (
                <div className="pd-tab-cols">
                  <div>
                    <h4>At a Glance</h4>
                    <p>{product.description?.at_a_glance || product.description || 'No description available.'}</p>
                  </div>
                  <div>
                    <h4>Features and Benefits</h4>
                    {Array.isArray(product.description?.features) ? (
                      <ul>{product.description.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
                    ) : (
                      <p>—</p>
                    )}
                  </div>
                  <div>
                    <h4>Care Instruction</h4>
                    <p>{product.description?.care || product.care_instruction || 'Machine Wash'}</p>
                  </div>
                </div>
              )}
              {activeTab === 'specification' && (
                <p style={{ color: '#888' }}>
                  {product.specification || 'Specification details coming soon.'}
                </p>
              )}
              {activeTab === 'expert advice' && (
                <p style={{ color: '#888' }}>Expert advice coming soon.</p>
              )}
              {activeTab === 'delivery & return' && (
                <p style={{ color: '#888' }}>
                  {product.delivery_info || 'Free delivery on orders above ₹499. Easy 30-day returns.'}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="pd-reviews-section">
          <div className="pd-reviews-header">
            <h2>Reviews</h2>
            <a href="#write-review" className="pd-write-review-link">Write Review</a>
          </div>
          <div className="pd-reviews-grid">
            {reviews.map(r => (
              <div key={r.id} className="pd-review-card">
                <div className="pd-review-user">
                  <img
                    className="pd-review-avatar"
                    src={r.avatar || `https://i.pravatar.cc/40?u=${r.id}`}
                    alt={r.name}
                    onError={e => { e.target.src = 'https://via.placeholder.com/36'; }}
                  />
                  <span className="pd-review-name">{r.name}</span>
                </div>
                <Stars rating={r.rating} />
                <div className="pd-review-text">{r.text}</div>
              </div>
            ))}
            <div className="pd-write-box" id="write-review">
              <textarea
                placeholder="Type here.."
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
              />
              <button className="pd-submit-btn" onClick={handleReviewSubmit}>Submit</button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="pd-related-section">
            <div className="pd-related-title">You might also like</div>
            <div className="pd-related-scroll-wrap">
              <div className="pd-related-grid" ref={scrollRef}>
                {related.map(p => <RelatedCard key={p.id || p.slug} product={p} />)}
              </div>
              <button className="pd-next-btn" onClick={scrollNext}>›</button>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default ProductDetails;

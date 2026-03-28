import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .to-root {
    font-family: 'Nunito', sans-serif;
    background: #fafafa;
    min-height: 100vh;
    color: #1a1a1a;
    padding-bottom: 60px;
  }

  /* ── Top bar ── */
  .to-topbar {
    background: #fff;
    border-bottom: 1.5px solid #f0f0f0;
    padding: 14px 24px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 100;
  }
  .to-logo {
    font-size: 20px; font-weight: 900; color: #ec4899; letter-spacing: -.02em;
  }
  .to-logo span { color: #FACC15; }
  .to-breadcrumb {
    font-size: 12px; color: #999; font-weight: 600;
  }
  .to-breadcrumb a { color: #ec4899; text-decoration: none; }

  /* ── Hero banner ── */
  .to-hero {
    background: linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #FACC15 100%);
    padding: 32px 24px 28px;
    text-align: center; color: #fff;
    position: relative; overflow: hidden;
  }
  .to-hero::before {
    content: ''; position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.06'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
  .to-hero-icon { font-size: 48px; margin-bottom: 10px; }
  .to-hero-title {
    font-size: 24px; font-weight: 900; margin-bottom: 4px;
    text-shadow: 0 2px 8px rgba(0,0,0,.15);
  }
  .to-hero-sub {
    font-size: 13px; font-weight: 600; opacity: .9;
  }
  .to-order-id-badge {
    display: inline-block; background: rgba(255,255,255,.2);
    border: 1.5px solid rgba(255,255,255,.35);
    border-radius: 20px; padding: 5px 16px;
    font-size: 12px; font-weight: 800; margin-top: 12px;
    backdrop-filter: blur(4px);
  }

  /* ── Layout ── */
  .to-layout {
    max-width: 900px; margin: 0 auto;
    padding: 24px 16px 0;
    display: flex; gap: 24px; align-items: flex-start;
  }
  @media (max-width: 700px) {
    .to-layout { flex-direction: column; }
    .to-sidebar { width: 100% !important; position: static !important; }
  }
  .to-main { flex: 1; min-width: 0; }
  .to-sidebar {
    width: 300px; flex-shrink: 0;
    position: sticky; top: 76px;
  }

  /* ── Card ── */
  .to-card {
    background: #fff;
    border: 1.5px solid #e5e7eb;
    border-radius: 16px;
    padding: 22px;
    margin-bottom: 18px;
  }
  .to-card-title {
    font-size: 14px; font-weight: 800; color: #111;
    margin-bottom: 18px; display: flex; align-items: center; gap: 8px;
  }
  .to-card-icon {
    width: 28px; height: 28px; background: #fce7f3;
    border-radius: 8px; display: flex; align-items: center;
    justify-content: center; font-size: 14px; flex-shrink: 0;
  }

  /* ── Status steps ── */
  .to-steps { position: relative; padding-left: 0; }
  .to-step {
    display: flex; gap: 16px; align-items: flex-start;
    padding-bottom: 28px; position: relative;
  }
  .to-step:last-child { padding-bottom: 0; }
  .to-step-left {
    display: flex; flex-direction: column; align-items: center;
    flex-shrink: 0; width: 36px;
  }
  .to-step-dot {
    width: 36px; height: 36px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; flex-shrink: 0;
    position: relative; z-index: 1;
    transition: all .3s;
  }
  .to-step-dot.done {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    box-shadow: 0 4px 12px rgba(34,197,94,.35);
  }
  .to-step-dot.active {
    background: linear-gradient(135deg, #FACC15, #f59e0b);
    box-shadow: 0 4px 12px rgba(250,204,21,.4);
    animation: to-bounce .8s ease-in-out infinite alternate;
  }
  .to-step-dot.pending {
    background: #f3f4f6;
    box-shadow: none;
  }
  @keyframes to-bounce {
    from { transform: scale(1);   }
    to   { transform: scale(1.1); }
  }
  .to-step-line {
    width: 2px; flex: 1; min-height: 20px;
    background: #e5e7eb; margin-top: 4px;
  }
  .to-step-line.done { background: #22c55e; }
  .to-step-line.active {
    background: linear-gradient(to bottom, #22c55e 50%, #e5e7eb 50%);
  }
  .to-step-content { padding-top: 6px; flex: 1; }
  .to-step-title {
    font-size: 14px; font-weight: 800;
  }
  .to-step-title.done    { color: #16a34a; }
  .to-step-title.active  { color: #d97706; }
  .to-step-title.pending { color: #aaa; }
  .to-step-desc {
    font-size: 12px; font-weight: 600; color: #888; margin-top: 2px;
    line-height: 1.5;
  }
  .to-step-time {
    font-size: 11px; font-weight: 700; color: #bbb; margin-top: 4px;
  }

  /* ── Current status highlight ── */
  .to-status-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 20px;
    font-size: 13px; font-weight: 800;
    margin-bottom: 18px;
  }
  .to-status-pill.processing {
    background: #fef3c7; color: #d97706;
    border: 1.5px solid #fde68a;
  }
  .to-status-pill.shipped {
    background: #eff6ff; color: #2563eb;
    border: 1.5px solid #bfdbfe;
  }
  .to-status-pill.delivered {
    background: #f0fdf4; color: #16a34a;
    border: 1.5px solid #86efac;
  }
  .to-status-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: currentColor;
    animation: to-blink 1.2s ease-in-out infinite;
  }
  @keyframes to-blink {
    0%, 100% { opacity: 1; } 50% { opacity: .3; }
  }

  /* ── Order item ── */
  .to-item {
    display: flex; gap: 12px; align-items: flex-start;
    padding: 12px 0; border-bottom: 1px dashed #f0f0f0;
  }
  .to-item:last-child { border-bottom: none; padding-bottom: 0; }
  .to-item-img {
    width: 56px; height: 56px; object-fit: contain;
    background: #fafafa; border-radius: 8px;
    border: 1.5px solid #f0f0f0; flex-shrink: 0; padding: 4px;
  }
  .to-item-name { font-size: 12px; font-weight: 700; line-height: 1.4; color: #111; }
  .to-item-meta { font-size: 11px; color: #888; font-weight: 600; margin-top: 3px; }
  .to-item-price { font-size: 13px; font-weight: 800; color: #ec4899; margin-top: 4px; }

  /* ── Price summary ── */
  .to-price-row {
    display: flex; justify-content: space-between;
    font-size: 13px; font-weight: 700; color: #555;
    padding: 7px 0; border-bottom: 1px dashed #f0f0f0;
  }
  .to-price-row:last-child { border-bottom: none; }
  .to-price-row.total {
    font-size: 15px; font-weight: 900; color: #111;
    padding-top: 12px; margin-top: 4px;
    border-top: 2px solid #f0f0f0; border-bottom: none;
  }
  .to-price-row .green { color: #16a34a; }
  .to-price-row .pink  { color: #ec4899; }

  /* ── Address block ── */
  .to-address-block {
    background: #fafafa; border-radius: 10px;
    padding: 12px 14px; font-size: 12px; font-weight: 600;
    color: #555; line-height: 1.8;
    border: 1.5px dashed #e5e7eb;
  }
  .to-address-name {
    font-size: 13px; font-weight: 800; color: #111; margin-bottom: 4px;
  }

  /* ── Help block ── */
  .to-help-card {
    background: linear-gradient(135deg, #fce7f3, #fff0f6);
    border: 1.5px solid #f9a8d4;
    border-radius: 14px; padding: 18px;
    text-align: center;
  }
  .to-help-title { font-size: 14px; font-weight: 800; color: #be185d; margin-bottom: 6px; }
  .to-help-sub { font-size: 12px; font-weight: 600; color: #888; margin-bottom: 14px; line-height: 1.5; }
  .to-help-btn {
    display: inline-block; padding: 10px 22px;
    background: #ec4899; color: #fff;
    border-radius: 8px; font-size: 12px; font-weight: 800;
    text-decoration: none; transition: background .15s;
  }
  .to-help-btn:hover { background: #db2777; }

  /* ── Continue shopping ── */
  .to-shop-btn {
    width: 100%; padding: 14px 0;
    background: #FACC15; color: #111;
    border: none; border-radius: 10px;
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800;
    cursor: pointer; box-shadow: 0 4px 0 #d4a800;
    transition: transform .12s, box-shadow .12s;
    margin-top: 4px;
  }
  .to-shop-btn:hover  { transform: translateY(-2px); box-shadow: 0 6px 0 #d4a800; }
  .to-shop-btn:active { transform: translateY(2px);  box-shadow: 0 2px 0 #d4a800; }

  /* ── Copy ID button ── */
  .to-copy-btn {
    background: none; border: none; cursor: pointer;
    color: #ec4899; font-size: 11px; font-weight: 800;
    padding: 2px 6px; border-radius: 4px;
    transition: background .15s;
  }
  .to-copy-btn:hover { background: #fce7f3; }
`;

// ORDER STATUS STAGES
const STAGES = [
  {
    key:   'confirmed',
    icon:  '✅',
    title: 'Order Confirmed',
    desc:  'Your order has been placed successfully and payment received.',
  },
  {
    key:   'processing',
    icon:  '📦',
    title: 'Order Processing',
    desc:  'We\'re carefully picking and packing your items.',
  },
  {
    key:   'shipped',
    icon:  '🚚',
    title: 'Order Shipped',
    desc:  'Your order is on the way! Our delivery partner has picked it up.',
  },
  {
    key:   'out_for_delivery',
    icon:  '🛵',
    title: 'Out for Delivery',
    desc:  'Almost there! Your order is out for delivery today.',
  },
  {
    key:   'delivered',
    icon:  '🎉',
    title: 'Delivered',
    desc:  'Your order has been delivered. Enjoy!',
  },
];

// For demo: determine step based on time since order (or hardcode to step 1 = processing)
function getCurrentStep() {
  // In real app, fetch from API. Here we default to "processing" (index 1)
  return 1;
}

function getTimestamp(offsetHours) {
  const d = new Date(Date.now() - offsetHours * 3600 * 1000);
  return d.toLocaleString('en-IN', {
    day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function TrackOrder() {
  const { orderId }  = useParams();
  const { state }    = useLocation();
  const navigate     = useNavigate();
  const [copied, setCopied] = useState(false);

  const currentStep = getCurrentStep(); // 0-based index into STAGES

  const items        = state?.items        || [];
  const subtotal     = state?.subtotal     || 0;
  const shipping     = state?.shipping     || 0;
  const discAmt      = state?.discAmt      || 0;
  const total        = state?.total        || state?.total || 0;
  const address      = state?.address      || {};
  const paymentMethod = state?.paymentMethod || 'Online Payment';
  const paymentId    = state?.paymentId    || null;

  const displayId = orderId || state?.orderId || 'N/A';
  const shortId   = String(displayId).slice(-10).toUpperCase();

  const estimatedDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  })();

  const copyOrderId = () => {
    navigator.clipboard?.writeText(displayId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const getStepStatus = (index) => {
    if (index < currentStep)  return 'done';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  const getStepIcon = (index, icon) => {
    if (index < currentStep)  return '✓';
    return icon;
  };

  const getStepTime = (index) => {
    if (index === 0) return getTimestamp(0.5);
    if (index < currentStep) return getTimestamp((currentStep - index) * 2);
    if (index === currentStep) return 'In progress…';
    return 'Pending';
  };

  const statusPillClass =
    currentStep >= 4 ? 'delivered' :
    currentStep >= 2 ? 'shipped' : 'processing';

  const statusLabel =
    currentStep >= 4 ? '🎉 Delivered' :
    currentStep >= 2 ? '🚚 Shipped' :
    currentStep >= 1 ? '📦 Processing' : '✅ Confirmed';

  return (
    <>
      <style>{STYLES}</style>
      <div className="to-root">

        {/* Top bar */}
        <div className="to-topbar">
          <div className="to-logo">Baby<span>Zone</span></div>
          <div className="to-breadcrumb">
            <Link to="/">Home</Link> / Track Order
          </div>
        </div>

        {/* Hero */}
        <div className="to-hero">
          <div className="to-hero-icon">📦</div>
          <div className="to-hero-title">Track Your Order</div>
          <div className="to-hero-sub">Real-time updates on your BabyZone delivery</div>
          <div className="to-order-id-badge">
            Order #{shortId}
            <button className="to-copy-btn" onClick={copyOrderId} style={{ color: '#fff', marginLeft: 4 }}>
              {copied ? '✓ Copied' : '📋'}
            </button>
          </div>
        </div>

        <div className="to-layout">

          {/* ── LEFT: Main content ── */}
          <div className="to-main">

            {/* Status card */}
            <div className="to-card">
              <div className="to-card-title">
                <span className="to-card-icon">📍</span>
                Order Status
              </div>

              <div className={`to-status-pill ${statusPillClass}`}>
                <div className="to-status-dot" />
                {statusLabel}
              </div>

              <div className="to-steps">
                {STAGES.map((stage, i) => {
                  const status = getStepStatus(i);
                  return (
                    <div className="to-step" key={stage.key}>
                      <div className="to-step-left">
                        <div className={`to-step-dot ${status}`}>
                          {getStepIcon(i, stage.icon)}
                        </div>
                        {i < STAGES.length - 1 && (
                          <div className={`to-step-line ${
                            i < currentStep ? 'done' :
                            i === currentStep ? 'active' : ''
                          }`} />
                        )}
                      </div>
                      <div className="to-step-content">
                        <div className={`to-step-title ${status}`}>{stage.title}</div>
                        <div className="to-step-desc">{stage.desc}</div>
                        <div className="to-step-time">{getStepTime(i)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 16, padding: '12px 14px', background: '#fef9ec',
                borderRadius: 10, border: '1.5px solid #fde68a',
                fontSize: 12, fontWeight: 700, color: '#92400e' }}>
                🗓️ Estimated delivery by <strong>{estimatedDate}</strong>
              </div>
            </div>

            {/* Items ordered */}
            {items.length > 0 && (
              <div className="to-card">
                <div className="to-card-title">
                  <span className="to-card-icon">🛍️</span>
                  Items Ordered ({items.length})
                </div>
                {items.map((item, i) => (
                  <div className="to-item" key={i}>
                    <img
                      className="to-item-img"
                      src={item.product?.image || '/placeholder.png'}
                      alt={item.product?.name}
                      onError={e => { e.target.src = '/placeholder.png'; }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="to-item-name">{item.product?.name}</div>
                      <div className="to-item-meta">Qty: {item.quantity}</div>
                      {item.product?.age_group && (
                        <div className="to-item-meta">Age: {item.product.age_group}</div>
                      )}
                      <div className="to-item-price">
                        ₹{(Number(item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="to-sidebar">

            {/* Order summary */}
            <div className="to-card">
              <div className="to-card-title">
                <span className="to-card-icon">🧾</span>
                Order Summary
              </div>

              {subtotal > 0 && (
                <>
                  <div className="to-price-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discAmt > 0 && (
                    <div className="to-price-row">
                      <span>Discount</span>
                      <span className="green">− ₹{discAmt.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="to-price-row">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'green' : ''}>
                      {shipping === 0 ? 'FREE 🎉' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="to-price-row total">
                    <span>Total</span>
                    <span className="pink">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </>
              )}

              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px dashed #f0f0f0' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#888', marginBottom: 4 }}>
                  PAYMENT METHOD
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#111' }}>
                  {paymentMethod === 'Cash on Delivery' ? '💵' : '💳'} {paymentMethod}
                </div>
                {paymentId && (
                  <div style={{ fontSize: 11, color: '#888', fontWeight: 600, marginTop: 3 }}>
                    Ref: {String(paymentId).slice(-12)}
                  </div>
                )}
              </div>
            </div>

            {/* Delivery address */}
            {(address.firstName || address.address) && (
              <div className="to-card">
                <div className="to-card-title">
                  <span className="to-card-icon">📍</span>
                  Delivery Address
                </div>
                <div className="to-address-block">
                  <div className="to-address-name">
                    {address.firstName} {address.lastName}
                  </div>
                  {address.address && <div>{address.address}</div>}
                  {address.apartment && <div>{address.apartment}</div>}
                  {(address.city || address.state) && (
                    <div>{[address.city, address.state, address.pincode].filter(Boolean).join(', ')}</div>
                  )}
                  {address.phone && <div>📞 {address.phone}</div>}
                </div>
              </div>
            )}

            {/* Help */}
            <div className="to-help-card">
              <div className="to-help-title">Need Help?</div>
              <div className="to-help-sub">
                Have questions about your order?<br />
                Our support team is here for you.
              </div>
              <a href="mailto:support@babyzone.in" className="to-help-btn">
                📧 Contact Support
              </a>
            </div>

            <button className="to-shop-btn" onClick={() => navigate('/')}>
              🛍️ Continue Shopping
            </button>

          </div>
        </div>
      </div>
    </>
  );
}
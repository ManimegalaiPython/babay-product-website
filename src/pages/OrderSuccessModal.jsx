import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MODAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

  .osm-overlay {
    position: fixed; inset: 0; z-index: 10000;
    background: rgba(0,0,0,0.45);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    animation: osm-fadeIn .25s ease;
  }
  @keyframes osm-fadeIn { from { opacity: 0 } to { opacity: 1 } }

  .osm-card {
    background: #fff;
    border-radius: 24px;
    padding: 40px 36px 32px;
    max-width: 440px; width: 100%;
    text-align: center;
    position: relative;
    box-shadow: 0 32px 80px rgba(0,0,0,.18);
    animation: osm-slideUp .35s cubic-bezier(.34,1.56,.64,1);
    font-family: 'Nunito', sans-serif;
  }
  @keyframes osm-slideUp {
    from { opacity: 0; transform: translateY(40px) scale(.95) }
    to   { opacity: 1; transform: translateY(0)    scale(1)   }
  }

  /* confetti burst particles */
  .osm-confetti {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; overflow: hidden; border-radius: 24px;
  }
  .osm-dot {
    position: absolute; width: 8px; height: 8px; border-radius: 50%;
    animation: osm-burst 1s ease-out forwards;
    opacity: 0;
  }
  @keyframes osm-burst {
    0%   { opacity: 1; transform: translate(0,0) scale(1); }
    100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
  }

  /* check circle */
  .osm-check-wrap {
    width: 96px; height: 96px; margin: 0 auto 20px;
    position: relative;
  }
  .osm-check-bg {
    width: 96px; height: 96px; border-radius: 50%;
    background: linear-gradient(135deg, #fde68a, #FACC15);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 0 12px rgba(250,204,21,.15), 0 0 0 24px rgba(250,204,21,.07);
    animation: osm-pulse 2s ease-in-out infinite;
  }
  @keyframes osm-pulse {
    0%, 100% { box-shadow: 0 0 0 12px rgba(250,204,21,.15), 0 0 0 24px rgba(250,204,21,.07); }
    50%       { box-shadow: 0 0 0 16px rgba(250,204,21,.2),  0 0 0 32px rgba(250,204,21,.08); }
  }
  .osm-check-svg {
    width: 44px; height: 44px;
    stroke-dasharray: 60;
    stroke-dashoffset: 60;
    animation: osm-draw .5s .2s ease forwards;
  }
  @keyframes osm-draw { to { stroke-dashoffset: 0; } }

  .osm-title {
    font-size: 22px; font-weight: 900; color: #111;
    margin-bottom: 6px; letter-spacing: -.01em;
  }
  .osm-subtitle {
    font-size: 13px; font-weight: 600; color: #777;
    margin-bottom: 20px; line-height: 1.5;
  }

  .osm-info-box {
    background: #fef9ec; border: 1.5px solid #fde68a;
    border-radius: 12px; padding: 14px 18px;
    margin-bottom: 20px; text-align: left;
  }
  .osm-info-row {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 12px; font-weight: 700; color: #555;
    padding: 5px 0; border-bottom: 1px dashed #fde68a;
  }
  .osm-info-row:last-child { border-bottom: none; }
  .osm-info-val { color: #111; font-weight: 800; }
  .osm-info-val.highlight { color: #ec4899; }

  .osm-delivery-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: #f0fdf4; border: 1.5px solid #86efac;
    border-radius: 20px; padding: 6px 14px;
    font-size: 12px; font-weight: 800; color: #16a34a;
    margin-bottom: 22px;
  }

  .osm-btns {
    display: flex; gap: 10px;
  }
  .osm-btn-track {
    flex: 1; padding: 14px 0;
    background: #FACC15; color: #111;
    border: none; border-radius: 10px;
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800;
    cursor: pointer; box-shadow: 0 4px 0 #d4a800;
    transition: transform .12s, box-shadow .12s;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .osm-btn-track:hover  { transform: translateY(-2px); box-shadow: 0 6px 0 #d4a800; }
  .osm-btn-track:active { transform: translateY(2px);  box-shadow: 0 2px 0 #d4a800; }

  .osm-btn-back {
    flex: 1; padding: 14px 0;
    background: #fff; color: #555;
    border: 1.5px solid #e5e7eb; border-radius: 10px;
    font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 800;
    cursor: pointer; transition: border-color .15s, color .15s;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .osm-btn-back:hover { border-color: #ec4899; color: #ec4899; }
`;

const CONFETTI_COLORS = ['#FACC15','#ec4899','#22c55e','#60a5fa','#f97316','#a78bfa'];

function ConfettiDots() {
  const dots = Array.from({ length: 18 }, (_, i) => {
    const angle  = (i / 18) * 360;
    const dist   = 60 + Math.random() * 80;
    const tx     = `${Math.cos((angle * Math.PI) / 180) * dist}px`;
    const ty     = `${Math.sin((angle * Math.PI) / 180) * dist - 40}px`;
    const color  = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    const delay  = `${(i * 0.04).toFixed(2)}s`;
    const size   = 6 + Math.random() * 6;
    return { tx, ty, color, delay, size };
  });

  return (
    <div className="osm-confetti">
      {dots.map((d, i) => (
        <div
          key={i}
          className="osm-dot"
          style={{
            '--tx': d.tx, '--ty': d.ty,
            background: d.color,
            top: '50%', left: '50%',
            width: d.size, height: d.size,
            marginLeft: -d.size / 2, marginTop: -d.size / 2,
            animationDelay: d.delay,
          }}
        />
      ))}
    </div>
  );
}

export default function OrderSuccessModal({ orderId, paymentId, paymentMethod, total, itemCount, onClose }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);

  const handleTrack = () => {
    setVisible(false);
    navigate(`/track-order/${orderId}`, {
      state: { orderId, paymentId, paymentMethod, total }
    });
  };

  const handleBack = () => {
    setVisible(false);
    if (onClose) onClose();
    navigate('/');
  };

  if (!visible) return null;

  const shortId = orderId ? String(orderId).slice(-10).toUpperCase() : 'N/A';
  const estimatedDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  })();

  return (
    <>
      <style>{MODAL_STYLES}</style>
      <div className="osm-overlay" onClick={e => e.target === e.currentTarget && handleBack()}>
        <div className="osm-card">
          <ConfettiDots />

          {/* Check Circle */}
          <div className="osm-check-wrap">
            <div className="osm-check-bg">
              <svg className="osm-check-svg" viewBox="0 0 52 52" fill="none"
                stroke="#111" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="14,27 22,35 38,18" />
              </svg>
            </div>
          </div>

          <div className="osm-title">Your Order is Confirmed! 🎉</div>
          <div className="osm-subtitle">
            Thank you for shopping with BabyZone.<br />
            We're packing your order with love 💛
          </div>

          <div className="osm-info-box">
            <div className="osm-info-row">
              <span>Order ID</span>
              <span className="osm-info-val highlight">#{shortId}</span>
            </div>
            {paymentId && (
              <div className="osm-info-row">
                <span>Payment ID</span>
                <span className="osm-info-val">{String(paymentId).slice(-10)}</span>
              </div>
            )}
            <div className="osm-info-row">
              <span>Payment</span>
              <span className="osm-info-val">{paymentMethod || 'Online'}</span>
            </div>
            <div className="osm-info-row">
              <span>Items</span>
              <span className="osm-info-val">{itemCount || 1} item{itemCount > 1 ? 's' : ''}</span>
            </div>
            {total && (
              <div className="osm-info-row">
                <span>Total Paid</span>
                <span className="osm-info-val highlight">₹{Number(total).toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>

          <div className="osm-delivery-badge">
            🚚 Estimated delivery by {estimatedDate}
          </div>

          <div className="osm-btns">
            <button className="osm-btn-track" onClick={handleTrack}>
              📦 Track Order
            </button>
            <button className="osm-btn-back" onClick={handleBack}>
              🏠 Back to Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
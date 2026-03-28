import { useState, useRef, useEffect } from "react";

/* ─────────────────────────── STYLES ─────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .contact-page {
    font-family: 'Nunito', sans-serif;
    background: #fff;
    min-height: 100vh;
  }

  /* BREADCRUMB */
  .breadcrumb {
    font-size: 13px; color: #555;
    padding: 14px 32px;
    border-bottom: 2px solid #f9a8d4;
  }

  /* CONTACT LAYOUT */
  .contact-wrapper {
    display: flex; gap: 48px;
    padding: 40px 48px;
    max-width: 960px; margin: 0 auto;
    align-items: flex-start;
  }
  .reach-us { flex: 0 0 300px; }
  .reach-us h2 { font-size: 22px; font-weight: 800; color: #111; margin-bottom: 20px; }

  /* INFO CARDS */
  .info-card {
    border: 2px solid #111; border-radius: 14px;
    padding: 18px 20px; margin-bottom: 14px;
    display: flex; align-items: center; gap: 14px;
    background: #fff; cursor: pointer;
    transition: background 0.18s, transform 0.15s;
  }
  .info-card:hover { background: #fef9c3; transform: translateY(-2px); }
  .info-card .icon { font-size: 22px; flex-shrink: 0; }
  .info-card .card-text { font-size: 14px; font-weight: 700; color: #111; line-height: 1.5; }
  .info-card .card-sub  { font-size: 13px; font-weight: 600; color: #333; }

  /* LIVE CHAT BUTTON */
  .live-chat-btn {
    margin-top: 8px; background: #FACC15; border: none;
    border-radius: 10px; padding: 14px 0; width: 100%;
    font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 800; color: #111;
    cursor: pointer; transition: background 0.18s, transform 0.15s;
    box-shadow: 0 3px 0 #d4a800;
  }
  .live-chat-btn:hover { background: #fbbf24; transform: translateY(-2px); box-shadow: 0 5px 0 #d4a800; }

  /* CONTACT FORM */
  .contact-form-section { flex: 1; }
  .contact-form-section h2 { font-size: 22px; font-weight: 800; color: #111; margin-bottom: 20px; }
  .form-panel { background: #f9a8d4; border-radius: 18px; padding: 28px 28px 32px; }
  .form-group { margin-bottom: 16px; }
  .form-group label { display: block; font-size: 14px; font-weight: 800; color: #111; margin-bottom: 6px; }
  .form-group input, .form-group textarea {
    width: 100%; background: #fff; border: none; border-radius: 10px;
    padding: 12px 14px; font-family: 'Nunito', sans-serif;
    font-size: 14px; color: #333; outline: none; transition: box-shadow 0.18s;
  }
  .form-group input::placeholder, .form-group textarea::placeholder { color: #aaa; }
  .form-group input:focus, .form-group textarea:focus { box-shadow: 0 0 0 2px #ec4899; }
  .form-group textarea { resize: none; height: 90px; }
  .send-btn {
    display: block; margin: 20px auto 0;
    background: #FACC15; border: none; border-radius: 10px;
    padding: 12px 52px; font-family: 'Nunito', sans-serif;
    font-size: 15px; font-weight: 800; color: #111; cursor: pointer;
    transition: background 0.18s, transform 0.15s; box-shadow: 0 3px 0 #d4a800;
  }
  .send-btn:hover:not(:disabled) { background: #fbbf24; transform: translateY(-2px); box-shadow: 0 5px 0 #d4a800; }
  .send-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .status { margin-top: 14px; padding: 10px 14px; border-radius: 10px; font-size: 13px; font-weight: 700; text-align: center; }
  .status.success { background: #dcfce7; color: #166534; }
  .status.error   { background: #fee2e2; color: #991b1b; }

  /* FAQ */
  .faq-wrapper { max-width: 960px; margin: 0 auto; padding: 0 48px 48px; }
  .faq-panel { background: #f9a8d4; border-radius: 18px; padding: 28px 32px 32px; }
  .faq-panel h2 { font-size: 20px; font-weight: 800; color: #111; text-align: center; margin-bottom: 24px; }
  .faq-item { margin-bottom: 20px; }
  .faq-item:last-child { margin-bottom: 0; }
  .faq-question { font-size: 14px; font-weight: 800; color: #111; margin-bottom: 8px; }
  .faq-answer { background: #fff; border-radius: 10px; padding: 14px 16px; font-size: 13px; font-weight: 600; color: #333; line-height: 1.65; }

  /* ══════════════════════════════════
     LIVE CHAT POPUP
  ══════════════════════════════════ */
  .chat-popup-overlay {
    position: fixed; inset: 0; z-index: 200;
    display: flex; align-items: flex-end; justify-content: flex-end;
    padding: 24px; pointer-events: none;
  }
  .chat-popup {
    pointer-events: all;
    width: 340px; background: #fff;
    border-radius: 20px; overflow: hidden;
    box-shadow: 0 8px 40px rgba(0,0,0,0.18);
    display: flex; flex-direction: column;
    animation: slideUp 0.25s ease;
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .chat-header {
    background: #f9a8d4; padding: 16px 18px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .chat-header-left { display: flex; align-items: center; gap: 10px; }
  .chat-avatar {
    width: 38px; height: 38px; border-radius: 50%;
    background: #FACC15; display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }
  .chat-header-info .chat-name { font-size: 14px; font-weight: 800; color: #111; }
  .chat-header-info .chat-status { font-size: 11px; color: #555; display: flex; align-items: center; gap: 4px; }
  .chat-status-dot { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; display: inline-block; }
  .chat-close-btn {
    background: none; border: none; font-size: 20px;
    cursor: pointer; color: #555; line-height: 1;
  }
  .chat-messages {
    flex: 1; padding: 16px; overflow-y: auto;
    display: flex; flex-direction: column; gap: 10px;
    max-height: 280px; background: #fdf2f8;
  }
  .chat-bubble {
    max-width: 80%; padding: 10px 13px;
    border-radius: 14px; font-size: 13px; font-weight: 600; line-height: 1.5;
  }
  .chat-bubble.bot {
    background: #fff; color: #111; border-bottom-left-radius: 4px;
    align-self: flex-start; box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  }
  .chat-bubble.user {
    background: #ec4899; color: #fff; border-bottom-right-radius: 4px;
    align-self: flex-end;
  }
  .chat-bubble .bubble-time { font-size: 10px; opacity: 0.6; margin-top: 4px; }
  .chat-typing { display: flex; gap: 4px; align-items: center; padding: 4px 0; }
  .chat-typing span {
    width: 7px; height: 7px; border-radius: 50%; background: #ec4899;
    animation: bounce 1s infinite;
  }
  .chat-typing span:nth-child(2) { animation-delay: 0.15s; }
  .chat-typing span:nth-child(3) { animation-delay: 0.3s; }
  @keyframes bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40%           { transform: translateY(-6px); }
  }
  .chat-input-row {
    display: flex; gap: 8px; padding: 12px 14px;
    border-top: 1px solid #f0d0e4; background: #fff;
  }
  .chat-input {
    flex: 1; border: 1.5px solid #f9a8d4; border-radius: 10px;
    padding: 9px 12px; font-family: 'Nunito', sans-serif;
    font-size: 13px; outline: none; color: #333;
    transition: border-color 0.18s;
  }
  .chat-input:focus { border-color: #ec4899; }
  .chat-send-btn {
    background: #FACC15; border: none; border-radius: 10px;
    padding: 9px 14px; font-size: 16px; cursor: pointer;
    transition: background 0.15s; box-shadow: 0 2px 0 #d4a800;
    font-weight: 800;
  }
  .chat-send-btn:hover { background: #fbbf24; }

  /* ══════════════════════════════════
     REFUND POLICY MODAL
  ══════════════════════════════════ */
  .modal-backdrop {
    position: fixed; inset: 0; background: rgba(0,0,0,0.45);
    z-index: 300; display: flex; align-items: center; justify-content: center;
    padding: 20px; animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal-box {
    background: #fff; border-radius: 20px;
    max-width: 560px; width: 100%;
    max-height: 80vh; overflow-y: auto;
    box-shadow: 0 12px 48px rgba(0,0,0,0.2);
    animation: popIn 0.22s ease;
  }
  @keyframes popIn {
    from { opacity: 0; transform: scale(0.93); }
    to   { opacity: 1; transform: scale(1); }
  }
  .modal-header {
    background: #f9a8d4; padding: 20px 24px;
    border-radius: 20px 20px 0 0;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0;
  }
  .modal-header h3 { font-size: 17px; font-weight: 800; color: #111; }
  .modal-close-btn {
    background: none; border: none; font-size: 22px;
    cursor: pointer; color: #555; line-height: 1;
  }
  .modal-body { padding: 24px; }
  .policy-section { margin-bottom: 20px; }
  .policy-section:last-child { margin-bottom: 0; }
  .policy-section h4 { font-size: 14px; font-weight: 800; color: #ec4899; margin-bottom: 8px; }
  .policy-section p  { font-size: 13px; font-weight: 600; color: #444; line-height: 1.7; }
  .policy-section ul { padding-left: 18px; margin-top: 6px; }
  .policy-section ul li { font-size: 13px; font-weight: 600; color: #444; line-height: 1.8; }

  /* RESPONSIVE */
  @media (max-width: 700px) {
    .contact-wrapper { flex-direction: column; padding: 24px 20px; gap: 32px; }
    .reach-us { flex: unset; width: 100%; }
    .faq-wrapper { padding: 0 20px 36px; }
    .chat-popup { width: 300px; }
  }
`;

/* ─────────────────────────── DATA ─────────────────────────── */
const faqs = [
  { q: "Where are the offices of BabyZone located?", a: "Currently our office is located in Madurai while the orders are shipped from our warehouses located across India." },
  { q: "How do I know my order has been confirmed?", a: "After checking out during the payment process, you will get a confirmation that your payment has been processed successfully. You will also get a mail in your registered email id, along with an SMS to your registered mobile number confirming the order." },
  { q: "Are there any other hidden charges like Octroi or Entry tax?", a: "You will get the final price during check out. Our prices are all inclusive and you need not pay anything extra." },
  { q: "How long will it take to receive my orders?", a: "For all areas serviced by reputed couriers, the delivery time would be within 3 to 4 business days after dispatch (business days exclude Sundays and other holidays). However items weighing over 2 kilos may take a couple of days longer to reach. For other areas the products will be shipped through Indian Postal Service and may take 1–2 weeks depending on the location." },
  { q: "Will my GST amount be refunded on Order Cancellation and Returns?", a: "Yes. GST amount collected will be returned to customer's source method at the time of Cancellation and Returns." },
];

const BOT_REPLIES = [
  "Thanks for reaching out! Our team will get back to you shortly. 😊",
  "Got it! Could you please share your order ID if this is order-related?",
  "We're here to help! A support agent will respond within a few minutes.",
  "Thank you for your message. Is there anything else I can help with?",
];

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/* ═══════════════════════════════════════════════════════════════
   LIVE CHAT POPUP COMPONENT
═══════════════════════════════════════════════════════════════ */
function LiveChatPopup({ onClose }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! Welcome to BabyZone support. How can we help you today?", time: now() },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg = { from: "user", text, time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];
      setTyping(false);
      setMessages((prev) => [...prev, { from: "bot", text: reply, time: now() }]);
    }, 1400);
  };

  const handleKey = (e) => { if (e.key === "Enter") sendMessage(); };

  return (
    <div className="chat-popup-overlay">
      <div className="chat-popup">
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-left">
            <div className="chat-avatar">👶</div>
            <div className="chat-header-info">
              <div className="chat-name">BabyZone Support</div>
              <div className="chat-status"><span className="chat-status-dot" /> Online</div>
            </div>
          </div>
          <button className="chat-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.from}`}>
              {m.text}
              <div className="bubble-time">{m.time}</div>
            </div>
          ))}
          {typing && (
            <div className="chat-bubble bot">
              <div className="chat-typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="chat-input-row">
          <input
            className="chat-input"
            placeholder="Type your message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button className="chat-send-btn" onClick={sendMessage}>➤</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   REFUND POLICY MODAL COMPONENT
═══════════════════════════════════════════════════════════════ */
function RefundPolicyModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h3>🔄 Exchange & Refund Policy</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="policy-section">
            <h4>Returns</h4>
            <p>We accept returns within <strong>7 days</strong> of delivery. Items must be unused, in original packaging, and in the same condition as received.</p>
          </div>
          <div className="policy-section">
            <h4>Eligible Items for Return</h4>
            <ul>
              <li>Defective or damaged products</li>
              <li>Wrong item delivered</li>
              <li>Item not as described on the website</li>
            </ul>
          </div>
          <div className="policy-section">
            <h4>Non-Returnable Items</h4>
            <ul>
              <li>Perishable goods and consumables</li>
              <li>Items on sale or clearance</li>
              <li>Personal hygiene products once opened</li>
            </ul>
          </div>
          <div className="policy-section">
            <h4>Exchange Process</h4>
            <p>To request an exchange, contact us at <strong>supporta@babyzone.com</strong> with your order ID and reason. We will arrange a pickup and dispatch the replacement within 3–5 business days.</p>
          </div>
          <div className="policy-section">
            <h4>Refund Timeline</h4>
            <p>Once your return is received and inspected, we will notify you. Approved refunds are processed to your original payment method within <strong>5–7 business days</strong>. GST amount is fully refunded on eligible cancellations.</p>
          </div>
          <div className="policy-section">
            <h4>Order Cancellation</h4>
            <p>Orders can be cancelled before they are shipped. Once shipped, cancellation is not possible — please initiate a return after delivery.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN CONTACT COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", queries: "" });
  const [status, setStatus]     = useState({ type: "", message: "" });
  const [loading, setLoading]   = useState(false);

  // Feature toggles
  const [showChat,   setShowChat]   = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);

  const TRACK_ORDER_URL = "/track-order"; // ← change to your route

  const getCookie = (name) => {
    let val = null;
    if (document.cookie) {
      document.cookie.split(";").forEach((c) => {
        const t = c.trim();
        if (t.startsWith(name + "=")) val = decodeURIComponent(t.slice(name.length + 1));
      });
    }
    return val;
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    setStatus({ type: "", message: "" });
    try {
      const response = await fetch("http://localhost:8000/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRFToken": getCookie("csrftoken") },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setStatus({ type: "success", message: data.message || "Message sent successfully!" });
        setFormData({ name: "", email: "", phone: "", queries: "" });
      } else {
        setStatus({ type: "error", message: data.message || "Something went wrong." });
      }
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>

      {/* LIVE CHAT POPUP */}
      {showChat && <LiveChatPopup onClose={() => setShowChat(false)} />}

      {/* REFUND POLICY MODAL */}
      {showPolicy && <RefundPolicyModal onClose={() => setShowPolicy(false)} />}

      <div className="contact-page">
        <div className="breadcrumb">Home/Contact</div>

        {/* ── CONTACT SECTION ── */}
        <div className="contact-wrapper">

          {/* LEFT */}
          <div className="reach-us">
            <h2>Reach us</h2>

            {/* Phone + Email card */}
            <div className="info-card" onClick={() => window.location.href = "mailto:supporta@babyzone.com"}>
              <span className="icon">📞</span>
              <div>
                <div className="card-text">+123-456-7890</div>
                <div className="card-sub">supporta@babyzone.com</div>
              </div>
            </div>

            {/* Track Order → redirect */}
            <div className="info-card" onClick={() => window.location.href = TRACK_ORDER_URL}>
              <span className="icon">🚚</span>
              <div className="card-text">Track order &amp;<br />Cancel order</div>
            </div>

            {/* Refund Policy → modal */}
            <div className="info-card" onClick={() => setShowPolicy(true)}>
              <span className="icon">🔄</span>
              <div className="card-text">Exchange and<br />refund policy</div>
            </div>

            {/* Live Chat → popup */}
            <button className="live-chat-btn" onClick={() => setShowChat(true)}>
              💬 Live Chat
            </button>
          </div>

          {/* RIGHT — Contact Form */}
          <div className="contact-form-section">
            <h2>Contact Form</h2>
            <div className="form-panel">
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Id" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" />
              </div>
              <div className="form-group">
                <label>Queries</label>
                <textarea name="queries" value={formData.queries} onChange={handleChange} placeholder="Your Message.." />
              </div>
              <button className="send-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? "Sending…" : "Send"}
              </button>
              {status.message && <div className={`status ${status.type}`}>{status.message}</div>}
            </div>
          </div>
        </div>

        {/* ── FAQ SECTION ── */}
        <div className="faq-wrapper">
          <div className="faq-panel">
            <h2>FAQ's</h2>
            {faqs.map((faq, i) => (
              <div className="faq-item" key={i}>
                <div className="faq-question">{faq.q}</div>
                <div className="faq-answer">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
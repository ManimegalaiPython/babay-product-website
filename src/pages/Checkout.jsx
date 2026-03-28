import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder, verifyPayment } from '../services/api';
import OrderSuccessModal from './OrderSuccessModal';

const RAZORPAY_KEY = 'rzp_test_SNpf4zgYLdY4bJ';

const DISCOUNT_CODES = {
  BABY10: { type: 'percent', value: 10, label: '10% off' },
  SAVE50: { type: 'flat',    value: 50, label: '₹50 off' },
  NEWMOM: { type: 'percent', value: 15, label: '15% off' },
};

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli',
  'Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry',
];

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ck-root {
    font-family: 'Nunito', sans-serif;
    background: #fff;
    min-height: 100vh;
    color: #1a1a1a;
    padding-bottom: 60px;
  }

  .ck-breadcrumb {
    font-size: 12px; color: #666; font-weight: 600; padding: 10px 24px;
  }
  .ck-breadcrumb a { color: #666; text-decoration: none; }
  .ck-breadcrumb a:hover { color: #ec4899; }

  .ck-steps {
    display: flex; align-items: center; justify-content: center;
    gap: 0; padding: 12px 24px 4px; max-width: 480px; margin: 0 auto;
  }
  .ck-step {
    display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1;
  }
  .ck-step-circle {
    width: 28px; height: 28px; border-radius: 50%; background: #e5e7eb;
    color: #999; font-size: 13px; font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    transition: background .2s, color .2s;
  }
  .ck-step.active .ck-step-circle { background: #ec4899; color: #fff; }
  .ck-step.done   .ck-step-circle { background: #22c55e; color: #fff; }
  .ck-step-label {
    font-size: 10px; font-weight: 700; color: #aaa;
    text-transform: uppercase; letter-spacing: .04em;
  }
  .ck-step.active .ck-step-label { color: #ec4899; }
  .ck-step.done   .ck-step-label { color: #22c55e; }
  .ck-step-line {
    flex: 1; height: 2px; background: #e5e7eb;
    margin-bottom: 14px; transition: background .2s;
  }
  .ck-step-line.done { background: #22c55e; }

  .ck-layout {
    display: flex; gap: 32px; padding: 0 24px;
    max-width: 1060px; margin: 0 auto; align-items: flex-start;
  }
  @media (max-width: 768px) {
    .ck-layout { flex-direction: column-reverse; gap: 20px; padding: 0 16px; }
    .ck-summary { width: 100% !important; position: static !important; }
  }

  .ck-title {
    font-size: 22px; font-weight: 800; text-align: center; margin: 16px 0 20px;
  }

  .ck-form { flex: 1; min-width: 0; }

  .ck-panel {
    background: #fff; border: 1.5px solid #e5e7eb;
    border-radius: 12px; padding: 20px; margin-bottom: 16px;
  }

  .ck-section-title {
    font-size: 15px; font-weight: 800; margin-bottom: 14px;
    display: flex; align-items: center; gap: 8px;
  }
  .ck-section-icon {
    width: 24px; height: 24px; background: #fce7f3; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; font-size: 13px;
  }

  .ck-field { margin-bottom: 12px; }
  .ck-label {
    display: block; font-size: 11px; font-weight: 700; color: #555;
    margin-bottom: 4px; text-transform: uppercase; letter-spacing: .04em;
  }

  .ck-input, .ck-select {
    width: 100%; padding: 11px 14px;
    border: 1.5px solid #d1d5db; border-radius: 8px;
    font-family: 'Nunito', sans-serif; font-size: 14px;
    font-weight: 600; color: #111; outline: none;
    transition: border-color .18s, box-shadow .18s; background: #fff;
  }
  .ck-input:focus, .ck-select:focus {
    border-color: #f472b6; box-shadow: 0 0 0 3px rgba(244,114,182,.12);
  }
  .ck-input.error, .ck-select.error { border-color: #dc2626; }
  .ck-input::placeholder { color: #bbb; font-weight: 600; }
  .ck-select { appearance: none; cursor: pointer; }
  .ck-select-wrap { position: relative; }
  .ck-select-wrap::after {
    content: '▾'; position: absolute; right: 12px; top: 50%;
    transform: translateY(-50%); pointer-events: none; color: #888; font-size: 14px;
  }

  .ck-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .ck-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
  @media (max-width: 500px) {
    .ck-row-2, .ck-row-3 { grid-template-columns: 1fr; }
  }

  .ck-checkbox-row {
    display: flex; align-items: flex-start; gap: 8px;
    font-size: 13px; font-weight: 600; color: #444;
    cursor: pointer; margin-top: 2px;
  }
  .ck-checkbox-row input {
    accent-color: #ec4899; width: 15px; height: 15px;
    cursor: pointer; flex-shrink: 0; margin-top: 2px;
  }

  .ck-error-msg {
    color: #dc2626; font-size: 11px; font-weight: 700;
    margin-top: 4px; display: flex; align-items: center; gap: 4px;
  }

  .ck-pay-option {
    border: 1.5px solid #d1d5db; border-radius: 10px;
    padding: 14px 16px; margin-bottom: 10px; cursor: pointer;
    transition: border-color .15s, background .15s, box-shadow .15s;
    display: flex; align-items: center; gap: 10px;
  }
  .ck-pay-option:hover { border-color: #f9a8d4; }
  .ck-pay-option.selected {
    border-color: #f472b6; background: #fff0f6;
    box-shadow: 0 0 0 3px rgba(244,114,182,.1);
  }
  .ck-pay-option input[type="radio"] {
    accent-color: #ec4899; width: 16px; height: 16px;
    cursor: pointer; flex-shrink: 0;
  }
  .ck-pay-label { font-size: 13px; font-weight: 700; flex: 1; }
  .ck-pay-sub { font-size: 11px; color: #888; font-weight: 600; }
  .ck-pay-icons { display: flex; gap: 5px; align-items: center; flex-shrink: 0; }
  .ck-pay-icon {
    background: #1a1a2e; color: #fff; border-radius: 4px;
    font-size: 8px; font-weight: 800; padding: 3px 6px; letter-spacing: .02em;
  }
  .ck-pay-icon.visa  { background: #1a1f71; }
  .ck-pay-icon.gpay  { background: #fff; color: #111; border: 1px solid #ddd; }
  .ck-pay-icon.mc    { background: #eb001b; }
  .ck-pay-icon.rupay { background: #008d4b; }

  .ck-summary {
    width: 340px; flex-shrink: 0; background: #fce7f3;
    border-radius: 14px; padding: 20px; position: sticky; top: 20px;
  }
  .ck-summary-title {
    font-size: 16px; font-weight: 800; margin-bottom: 16px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .ck-item-count {
    background: #ec4899; color: #fff; border-radius: 20px;
    font-size: 11px; font-weight: 800; padding: 2px 8px;
  }

  .ck-summary-item {
    display: flex; gap: 12px; margin-bottom: 14px; align-items: flex-start;
    background: #fff; border-radius: 10px; padding: 10px;
    border: 1.5px solid #f9a8d4;
  }
  .ck-summary-img {
    width: 60px; height: 60px; object-fit: contain;
    background: #fff; border-radius: 6px; flex-shrink: 0; padding: 2px;
  }
  .ck-summary-name { font-size: 12px; font-weight: 700; line-height: 1.4; }
  .ck-summary-meta { font-size: 11px; color: #666; font-weight: 600; margin-top: 2px; }
  .ck-summary-price { font-size: 13px; font-weight: 800; color: #ec4899; margin-top: 4px; }

  .ck-discount-row { display: flex; gap: 8px; margin-bottom: 14px; }
  .ck-discount-input {
    flex: 1; padding: 10px 14px; border: 1.5px solid #d1d5db;
    border-radius: 8px; font-family: 'Nunito', sans-serif;
    font-size: 13px; font-weight: 700; outline: none;
    background: #fff; transition: border-color .18s; text-transform: uppercase;
  }
  .ck-discount-input:focus { border-color: #f472b6; }
  .ck-discount-input::placeholder { color: #bbb; text-transform: none; font-weight: 600; }
  .ck-apply-btn {
    background: #1a1a1a; color: #fff; border: none; border-radius: 8px;
    padding: 10px 16px; font-family: 'Nunito', sans-serif;
    font-size: 12px; font-weight: 800; cursor: pointer;
    transition: background .15s; white-space: nowrap;
  }
  .ck-apply-btn:hover { background: #333; }
  .ck-apply-btn:disabled { opacity: .5; cursor: not-allowed; }
  .ck-discount-success {
    font-size: 12px; color: #16a34a; font-weight: 700;
    margin-bottom: 10px; display: flex; align-items: center; gap: 5px;
  }
  .ck-discount-fail {
    font-size: 12px; color: #dc2626; font-weight: 700; margin-bottom: 10px;
  }

  .ck-price-row {
    display: flex; justify-content: space-between; align-items: flex-start;
    font-size: 13px; font-weight: 700; color: #444; margin-bottom: 8px;
  }
  .ck-price-row.discount-row { color: #16a34a; }
  .ck-price-row.total {
    font-size: 16px; font-weight: 800; color: #111;
    border-top: 2px solid #f9a8d4; padding-top: 12px; margin-top: 8px;
  }
  .ck-tax-note {
    font-size: 11px; color: #888; font-weight: 600;
    margin-top: 4px; text-align: right;
  }

  .ck-shipping-right { text-align: right; }
  .ck-ship-rate { font-size: 13px; font-weight: 700; color: #444; }
  .ck-ship-dest { font-size: 11px; color: #888; font-weight: 600; }
  .ck-free-ship { color: #16a34a; font-weight: 800; }

  .ck-ship-progress-wrap {
    background: #fff; border-radius: 8px; padding: 10px 12px;
    margin-bottom: 14px; border: 1.5px solid #f9a8d4;
  }
  .ck-ship-progress-label { font-size: 11px; font-weight: 700; color: #555; margin-bottom: 6px; }
  .ck-ship-progress-bar-bg {
    height: 6px; background: #fce7f3; border-radius: 999px; overflow: hidden;
  }
  .ck-ship-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #f472b6, #ec4899);
    border-radius: 999px; transition: width .4s ease;
  }

  .ck-order-btn {
    background: #FACC15; color: #111; border: none; border-radius: 10px;
    padding: 15px 0; width: 100%; font-family: 'Nunito', sans-serif;
    font-size: 15px; font-weight: 800; cursor: pointer; margin-top: 16px;
    box-shadow: 0 4px 0 #d4a800;
    transition: transform .12s, box-shadow .12s;
    display: flex; align-items: center; justify-content: center;
    gap: 8px; letter-spacing: .02em;
  }
  .ck-order-btn:hover  { transform: translateY(-2px); box-shadow: 0 6px 0 #d4a800; }
  .ck-order-btn:active { transform: translateY(2px);  box-shadow: 0 2px 0 #d4a800; }
  .ck-order-btn:disabled {
    opacity: .55; cursor: not-allowed;
    transform: none; box-shadow: 0 4px 0 #d4a800;
  }

  .ck-secure-badge {
    display: flex; align-items: center; justify-content: center; gap: 5px;
    font-size: 11px; color: #888; font-weight: 700; margin-top: 10px;
  }

  .ck-toast {
    position: fixed; bottom: 24px; left: 50%;
    transform: translateX(-50%) translateY(80px);
    background: #1a1a1a; color: #fff; padding: 12px 24px;
    border-radius: 30px; font-size: 13px; font-weight: 700;
    z-index: 9999; transition: transform .3s cubic-bezier(.34,1.56,.64,1);
    white-space: nowrap; box-shadow: 0 8px 24px rgba(0,0,0,.2);
  }
  .ck-toast.show { transform: translateX(-50%) translateY(0); }
  .ck-toast.success { background: #16a34a; }
  .ck-toast.error   { background: #dc2626; }

  @keyframes ck-spin { to { transform: rotate(360deg); } }
  .ck-spinner {
    width: 18px; height: 18px; border: 3px solid rgba(0,0,0,.2);
    border-top-color: #111; border-radius: 50%;
    animation: ck-spin .7s linear infinite; display: inline-block;
  }

  .ck-empty {
    text-align: center; padding: 40px 20px;
    color: #aaa; font-weight: 700; font-size: 15px;
  }
  .ck-empty-icon { font-size: 40px; margin-bottom: 12px; }
`;

function loadRazorpay() {
  return new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement('script');
    s.src     = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload  = () => resolve(true);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
}

const FREE_SHIP_THRESHOLD = 999;
const FLAT_SHIPPING       = 99;

// ✅ Field defined OUTSIDE component — fixes focus-loss bug
const Field = ({ id, label, errors, children }) => (
  <div className="ck-field">
    {label && <label className="ck-label" htmlFor={id}>{label}</label>}
    {children}
    {errors[id] && <div className="ck-error-msg">⚠ {errors[id]}</div>}
  </div>
);

export default function Checkout() {
  const navigate           = useNavigate();
  const { cart, loadCart } = useCart();
  const { user }           = useAuth();

  const [form, setForm] = useState({
    email:     '',
    updates:   false,
    country:   'India',
    firstName: '',
    lastName:  '',
    address:   '',
    apartment: '',
    city:      '',
    state:     '',
    pincode:   '',
    phone:     '',
    saveInfo:  false,
    payment:   'online',
  });

  const [errors,          setErrors]          = useState({});
  const [loading,         setLoading]         = useState(false);
  const [discountCode,    setDiscountCode]    = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountMsg,     setDiscountMsg]     = useState('');
  const [toast,           setToast]           = useState({ show: false, msg: '', type: '' });
  const [successModal,    setSuccessModal]    = useState(null);

  // ✅ track whether payment is done — prevents failure toast after success
  const paymentSucceeded = useRef(false);
  const initDone         = useRef(false);
  const step = 2;

  /* ── Load saved info + pre-fill email ── */
  useEffect(() => {
    let saved = {};
    try {
      const raw = localStorage.getItem('ck_saved_info');
      if (raw) saved = JSON.parse(raw);
    } catch {}

    setForm({
      email:     user?.email || saved.email     || '',
      updates:   false,
      country:   saved.country   || 'India',
      firstName: saved.firstName || '',
      lastName:  saved.lastName  || '',
      address:   saved.address   || '',
      apartment: saved.apartment || '',
      city:      saved.city      || '',
      state:     saved.state     || '',
      pincode:   saved.pincode   || '',
      phone:     saved.phone     || '',
      saveInfo:  Object.keys(saved).length > 0,
      payment:   'online',
    });

    setTimeout(() => { initDone.current = true; }, 50);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Save info ── */
  const saveInfoRef = useRef(false);
  useEffect(() => {
    if (!initDone.current) return;
    if (form.saveInfo === saveInfoRef.current) return;
    saveInfoRef.current = form.saveInfo;
    if (form.saveInfo) {
      const { payment, updates, saveInfo, ...toSave } = form;
      localStorage.setItem('ck_saved_info', JSON.stringify(toSave));
    } else {
      localStorage.removeItem('ck_saved_info');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.saveInfo]);

  /* ── Derived values ── */
  const items    = cart?.items || [];
  const subtotal = items.reduce(
    (s, i) => s + Number(i.product?.price || 0) * i.quantity, 0
  );
  const discAmt          = appliedDiscount ? appliedDiscount.amount : 0;
  const shipping         = subtotal - discAmt >= FREE_SHIP_THRESHOLD ? 0 : FLAT_SHIPPING;
  const taxable          = subtotal - discAmt + shipping;
  const cgst             = +(taxable * 0.09).toFixed(2);
  const total            = taxable;
  const freeShipProgress = Math.min(100, Math.round(subtotal / FREE_SHIP_THRESHOLD * 100));

  /* ── Field setter ── */
  const set = (k, v) => {
    setForm(prev => ({ ...prev, [k]: v }));
    setErrors(prev => {
      if (!prev[k]) return prev;
      const next = { ...prev };
      delete next[k];
      return next;
    });
  };

  /* ── Toast ── */
  const showToast = (msg, type = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: '', type: '' }), 3000);
  };

  /* ── Discount ── */
  const applyDiscount = () => {
    const code  = discountCode.trim().toUpperCase();
    const found = DISCOUNT_CODES[code];
    if (!found) { setDiscountMsg('fail'); setAppliedDiscount(null); return; }
    const amt = found.type === 'percent'
      ? Math.round(subtotal * found.value / 100)
      : found.value;
    setAppliedDiscount({ label: found.label, amount: amt, code });
    setDiscountMsg('ok');
    showToast(`Discount applied: ${found.label} 🎉`);
  };

  const removeDiscount = () => {
    setAppliedDiscount(null); setDiscountCode(''); setDiscountMsg('');
  };

  /* ── Validation ── */
  const validate = () => {
    const e = {};
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email';
    if (!form.firstName.trim()) e.firstName = 'First name required';
    if (!form.lastName.trim())  e.lastName  = 'Last name required';
    if (!form.address.trim())   e.address   = 'Address required';
    if (!form.city.trim())      e.city      = 'City required';
    if (!form.state)            e.state     = 'Select your state';
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter valid 6-digit pincode';
    if (!/^\d{10}$/.test(form.phone))  e.phone   = 'Enter valid 10-digit phone';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Persist form ── */
  const persistForm = () => {
    if (form.saveInfo) {
      const { payment, updates, saveInfo, ...toSave } = form;
      localStorage.setItem('ck_saved_info', JSON.stringify(toSave));
    }
  };

  /* ── Address object ── */
  const getAddress = () => ({
    firstName: form.firstName,
    lastName:  form.lastName,
    address:   `${form.address}${form.apartment ? ', ' + form.apartment : ''}`,
    city:      form.city,
    state:     form.state,
    pincode:   form.pincode,
    phone:     form.phone,
    email:     form.email,
  });

  /* ── Build items payload ── */
  const getItemsPayload = () =>
    items.map(i => ({
      product_id: i.product?.id,
      name:       i.product?.name       || '',
      image:      i.product?.image      || '',
      price:      Number(i.product?.price) || 0,
      quantity:   i.quantity,
      age_group:  i.product?.age_group  || '',
    }));

  /* ── COD handler ── */
  const handleCOD = async () => {
    persistForm();
    setLoading(true);
    try {
      const { data } = await placeOrder({
        payment_method: 'cod',
        shipping,
        address: getAddress(),
        items:   getItemsPayload(),
      });
      await loadCart();
      // ✅ Show success modal
      setSuccessModal({
        orderId:       data.order_id,
        paymentId:     null,
        paymentMethod: 'Cash on Delivery',
        total,
        itemCount:     items.reduce((s, i) => s + i.quantity, 0),
        items, subtotal, shipping, discAmt, address: form,
      });
    } catch (err) {
      console.error('COD order failed:', err);
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  /* ── Razorpay handler ── */
  const handleRazorpay = async () => {
    persistForm();
    setLoading(true);

    const loaded = await loadRazorpay();
    if (!loaded) {
      showToast('Could not load payment gateway.', 'error');
      setLoading(false);
      return;
    }

    try {
      // Step 1: Create order on backend
      const { data } = await placeOrder({
        payment_method: 'online',
        shipping,
        address: getAddress(),
        items:   getItemsPayload(),
      });

      // ✅ Reset success flag before opening Razorpay
      paymentSucceeded.current = false;

      // ✅ Amount must come from backend (in paise)
      const options = {
        key:         RAZORPAY_KEY,
        amount:      data.amount,                  // ✅ paise from backend
        currency:    data.currency    || 'INR',
        order_id:    data.razorpay_order_id,       // ✅ Razorpay order id from backend
        name:        'BabyZone',
        description: `Order (${items.length} item${items.length > 1 ? 's' : ''})`,
        prefill: {
          name:    `${form.firstName} ${form.lastName}`,
          email:   form.email,
          contact: form.phone,
        },
        theme: { color: '#f472b6' },

        // ✅ handler fires ONLY on payment success
        handler: async (response) => {
          // Mark as succeeded FIRST so ondismiss toast is suppressed
          paymentSucceeded.current = true;
          try {
            await verifyPayment({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            });
            await loadCart();
            setLoading(false);
            // ✅ Show success modal
            setSuccessModal({
              orderId:       data.order_id,
              paymentId:     response.razorpay_payment_id,
              paymentMethod: 'Online Payment',
              total,
              itemCount:     items.reduce((s, i) => s + i.quantity, 0),
              items, subtotal, shipping, discAmt, address: form,
            });
          } catch {
            setLoading(false);
            showToast('Payment verification failed. Contact support.', 'error');
          }
        },

        modal: {
          // ✅ ondismiss fires when modal closes — only show toast if payment did NOT succeed
          ondismiss: () => {
            if (!paymentSucceeded.current) {
              setLoading(false);
              showToast('Payment cancelled.', 'error');
            }
          },
        },
      };

      const rzp = new window.Razorpay(options);

      // ✅ payment.failed — only fires on actual failure, not cancellation
      rzp.on('payment.failed', (resp) => {
        paymentSucceeded.current = false;
        setLoading(false);
        showToast(`Payment failed: ${resp.error?.description || 'Unknown error'}`, 'error');
      });

      rzp.open();

    } catch (err) {
      console.error('Order creation failed:', err);
      showToast('Failed to create order. Please try again.', 'error');
      setLoading(false);
    }
  };

  /* ── Main submit ── */
  const handleOrder = () => {
    if (!validate()) {
      showToast('Please fix the errors above ☝️', 'error');
      const el = document.querySelector('.ck-input.error, .ck-select.error');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (form.payment === 'cod') handleCOD();
    else handleRazorpay();
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="ck-root">

        <div className="ck-breadcrumb">
          <Link to="/">Home</Link> /&nbsp;
          <Link to="/cart">Cart</Link> /&nbsp;
          <strong>Checkout</strong>
        </div>

        <div className="ck-steps">
          {[['1','Cart'],['2','Details'],['3','Payment'],['4','Done']].map(([n, label], i, arr) => (
            <React.Fragment key={n}>
              <div className={`ck-step ${step > +n ? 'done' : step === +n ? 'active' : ''}`}>
                <div className="ck-step-circle">{step > +n ? '✓' : n}</div>
                <div className="ck-step-label">{label}</div>
              </div>
              {i < arr.length - 1 && (
                <div className={`ck-step-line ${step > +n ? 'done' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <h1 className="ck-title">Checkout</h1>

        <div className="ck-layout">

          {/* ── LEFT: Form ── */}
          <div className="ck-form">

            {/* Contact */}
            <div className="ck-panel">
              <div className="ck-section-title">
                <span className="ck-section-icon">✉️</span> Contact
              </div>
              <Field id="email" label="Email address *" errors={errors}>
                <input id="email" type="email"
                  className={`ck-input${errors.email ? ' error' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => set('email', e.target.value)} />
              </Field>
              <label className="ck-checkbox-row">
                <input type="checkbox" checked={form.updates}
                  onChange={e => set('updates', e.target.checked)} />
                Send me order updates &amp; offers via Email and WhatsApp
              </label>
            </div>

            {/* Delivery */}
            <div className="ck-panel">
              <div className="ck-section-title">
                <span className="ck-section-icon">📦</span> Delivery Address
              </div>

              <Field id="country" label="Country / Region" errors={errors}>
                <div className="ck-select-wrap">
                  <select id="country" className="ck-select"
                    value={form.country} onChange={e => set('country', e.target.value)}>
                    <option value="India">India</option>
                  </select>
                </div>
              </Field>

              <div className="ck-row-2">
                <Field id="firstName" label="First name *" errors={errors}>
                  <input id="firstName" type="text"
                    className={`ck-input${errors.firstName ? ' error' : ''}`}
                    placeholder="Riya" value={form.firstName}
                    onChange={e => set('firstName', e.target.value)} />
                </Field>
                <Field id="lastName" label="Last name *" errors={errors}>
                  <input id="lastName" type="text"
                    className={`ck-input${errors.lastName ? ' error' : ''}`}
                    placeholder="Sharma" value={form.lastName}
                    onChange={e => set('lastName', e.target.value)} />
                </Field>
              </div>

              <Field id="address" label="Address *" errors={errors}>
                <input id="address" type="text"
                  className={`ck-input${errors.address ? ' error' : ''}`}
                  placeholder="House / Flat no., Street, Area"
                  value={form.address}
                  onChange={e => set('address', e.target.value)} />
              </Field>

              <Field id="apartment" label="Apartment, suite, etc. (optional)" errors={errors}>
                <input id="apartment" type="text" className="ck-input"
                  placeholder="Apartment, floor, landmark…"
                  value={form.apartment}
                  onChange={e => set('apartment', e.target.value)} />
              </Field>

              <div className="ck-row-3">
                <Field id="city" label="City *" errors={errors}>
                  <input id="city" type="text"
                    className={`ck-input${errors.city ? ' error' : ''}`}
                    placeholder="Mumbai" value={form.city}
                    onChange={e => set('city', e.target.value)} />
                </Field>
                <Field id="state" label="State *" errors={errors}>
                  <div className="ck-select-wrap">
                    <select id="state"
                      className={`ck-select${errors.state ? ' error' : ''}`}
                      value={form.state}
                      onChange={e => set('state', e.target.value)}>
                      <option value="">Select state</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </Field>
                <Field id="pincode" label="Pincode *" errors={errors}>
                  <input id="pincode" type="text" inputMode="numeric"
                    className={`ck-input${errors.pincode ? ' error' : ''}`}
                    placeholder="400001" maxLength={6}
                    value={form.pincode}
                    onChange={e => set('pincode', e.target.value.replace(/\D/g, ''))} />
                </Field>
              </div>

              <Field id="phone" label="Phone number *" errors={errors}>
                <input id="phone" type="text" inputMode="numeric"
                  className={`ck-input${errors.phone ? ' error' : ''}`}
                  placeholder="10-digit mobile number" maxLength={10}
                  value={form.phone}
                  onChange={e => set('phone', e.target.value.replace(/\D/g, ''))} />
              </Field>

              <label className="ck-checkbox-row">
                <input type="checkbox" checked={form.saveInfo}
                  onChange={e => set('saveInfo', e.target.checked)} />
                Save this information for next time
              </label>
            </div>

            {/* Payment */}
            <div className="ck-panel">
              <div className="ck-section-title">
                <span className="ck-section-icon">💳</span> Payment Method
              </div>

              <div className={`ck-pay-option${form.payment === 'online' ? ' selected' : ''}`}
                onClick={() => set('payment', 'online')}>
                <input type="radio" name="payment"
                  checked={form.payment === 'online'}
                  onChange={() => set('payment', 'online')} />
                <div style={{ flex: 1 }}>
                  <div className="ck-pay-label">Pay Online (UPI / Cards / Wallets)</div>
                  <div className="ck-pay-sub">Secured by Razorpay • Instant confirmation</div>
                </div>
                <div className="ck-pay-icons">
                  <span className="ck-pay-icon gpay">G Pay</span>
                  <span className="ck-pay-icon mc">MC</span>
                  <span className="ck-pay-icon visa">VISA</span>
                  <span className="ck-pay-icon rupay">RuPay</span>
                </div>
              </div>

              <div className={`ck-pay-option${form.payment === 'cod' ? ' selected' : ''}`}
                onClick={() => set('payment', 'cod')}>
                <input type="radio" name="payment"
                  checked={form.payment === 'cod'}
                  onChange={() => set('payment', 'cod')} />
                <div style={{ flex: 1 }}>
                  <div className="ck-pay-label">Cash on Delivery</div>
                  <div className="ck-pay-sub">Pay when your order arrives</div>
                </div>
                <span style={{ fontSize: 22 }}>💵</span>
              </div>
            </div>

          </div>

          {/* ── RIGHT: Summary ── */}
          <div className="ck-summary">
            <div className="ck-summary-title">
              Order Summary
              <span className="ck-item-count">
                {items.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>

            {subtotal < FREE_SHIP_THRESHOLD ? (
              <div className="ck-ship-progress-wrap">
                <div className="ck-ship-progress-label">
                  Add ₹{(FREE_SHIP_THRESHOLD - subtotal).toLocaleString('en-IN')} more for{' '}
                  <strong>FREE shipping!</strong>
                </div>
                <div className="ck-ship-progress-bar-bg">
                  <div className="ck-ship-progress-bar" style={{ width: `${freeShipProgress}%` }} />
                </div>
              </div>
            ) : (
              <div className="ck-discount-success" style={{ marginBottom: 12 }}>
                🎉 You've unlocked FREE shipping!
              </div>
            )}

            {items.length === 0 ? (
              <div className="ck-empty">
                <div className="ck-empty-icon">🛒</div>
                Your cart is empty.
              </div>
            ) : items.map((item, i) => (
              <div className="ck-summary-item" key={i}>
                <img className="ck-summary-img"
                  src={item.product?.image || '/placeholder.png'}
                  alt={item.product?.name}
                  onError={e => { e.target.src = '/placeholder.png'; }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="ck-summary-name">{item.product?.name}</div>
                  <div className="ck-summary-meta">Qty: {item.quantity}</div>
                  {item.product?.age_group && (
                    <div className="ck-summary-meta">Age: {item.product.age_group}</div>
                  )}
                  <div className="ck-summary-price">
                    ₹{(Number(item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            ))}

            <div className="ck-discount-row">
              <input className="ck-discount-input"
                placeholder="Discount / gift card code"
                value={discountCode}
                onChange={e => { setDiscountCode(e.target.value); setDiscountMsg(''); }}
                onKeyDown={e => e.key === 'Enter' && applyDiscount()}
                disabled={!!appliedDiscount} />
              <button className="ck-apply-btn"
                onClick={appliedDiscount ? removeDiscount : applyDiscount}
                disabled={!discountCode.trim() && !appliedDiscount}>
                {appliedDiscount ? 'Remove' : 'Apply'}
              </button>
            </div>
            {discountMsg === 'ok' && appliedDiscount && (
              <div className="ck-discount-success">
                ✅ {appliedDiscount.label} applied — saving ₹{appliedDiscount.amount}
              </div>
            )}
            {discountMsg === 'fail' && (
              <div className="ck-discount-fail">❌ Invalid discount code</div>
            )}

            <div className="ck-price-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {appliedDiscount && (
              <div className="ck-price-row discount-row">
                <span>Discount ({appliedDiscount.code})</span>
                <span>− ₹{appliedDiscount.amount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="ck-price-row">
              <span>Shipping</span>
              <div className="ck-shipping-right">
                {shipping === 0 ? (
                  <div className="ck-free-ship">FREE 🎉</div>
                ) : (
                  <>
                    <div className="ck-ship-rate">Flat rate: ₹{shipping}</div>
                    <div className="ck-ship-dest">To {form.state || 'your state'}</div>
                  </>
                )}
              </div>
            </div>
            <div className="ck-price-row total">
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div className="ck-tax-note">
              Includes ₹{cgst.toLocaleString('en-IN')} CGST + ₹{cgst.toLocaleString('en-IN')} SGST
            </div>

            <button className="ck-order-btn"
              onClick={handleOrder}
              disabled={loading || items.length === 0}>
              {loading
                ? <><span className="ck-spinner" /> Processing…</>
                : form.payment === 'cod'
                  ? '📦 Place Order (COD)'
                  : '🔒 Pay Now'
              }
            </button>

            <div className="ck-secure-badge">
              🔒 256-bit SSL secured • Powered by Razorpay
            </div>
          </div>

        </div>
      </div>

      {/* Toast — hidden when success modal is showing */}
      {!successModal && (
        <div className={`ck-toast ${toast.type} ${toast.show ? 'show' : ''}`}>
          {toast.msg}
        </div>
      )}

      {/* ✅ Success Modal */}
      {successModal && (
        <OrderSuccessModal
          orderId={successModal.orderId}
          paymentId={successModal.paymentId}
          paymentMethod={successModal.paymentMethod}
          total={successModal.total}
          itemCount={successModal.itemCount}
          onClose={() => {
            setSuccessModal(null);
            navigate('/');
          }}
        />
      )}
    </>
  );
}
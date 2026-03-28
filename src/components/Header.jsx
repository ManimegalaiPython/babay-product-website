import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  FaSearch, FaMicrophone, FaShoppingCart, FaUser,
  FaChevronDown, FaTimes, FaClock, FaFire,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Header.css';

const TRENDING = [
  'Baby onesies', 'Feeding bottles', 'Baby skincare',
  'Maternity dresses', 'Baby toys', 'Diaper bags',
];

const HISTORY_KEY = 'bz_search_history';

const Header = () => {
  const { user, logout } = useAuth();
  const { cart }         = useCart();
  const navigate         = useNavigate();
  const location         = useLocation();

  const [search,          setSearch]          = useState('');
  const [openDropdown,    setOpenDropdown]     = useState(false);
  const [isListening,     setIsListening]      = useState(false);
  const [micStatus,       setMicStatus]        = useState('idle');
  const [micTooltip,      setMicTooltip]       = useState('');
  const [liveTranscript,  setLiveTranscript]   = useState('');
  const [showSuggestions, setShowSuggestions]  = useState(false);
  const [suggPos,         setSuggPos]          = useState({ top: 0, left: 0, width: 0 });
  const [history,         setHistory]          = useState([]);
  const [currentMsg,      setCurrentMsg]       = useState(0);

  const dropdownRef    = useRef(null);
  const searchBarRef   = useRef(null);
  const inputRef       = useRef(null);
  const recognitionRef = useRef(null);

  /* ── announcements ── */
  const messages = [
    '🎉 Get Rs.250 additional off on cart value of Rs.2999 and above',
    '😊 Autumn winter 2025 is here! Dress your little one in soft, breathable fabrics!',
    '🚀 Free shipping on orders above Rs.999 — Shop now!',
  ];

  useEffect(() => {
    const iv = setInterval(() => setCurrentMsg(p => (p + 1) % messages.length), 3500);
    return () => clearInterval(iv);
  }, []);

  /* ── history ── */
  useEffect(() => {
    try { setHistory(JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')); }
    catch { setHistory([]); }
  }, []);

  const saveHistory = (term) => {
    const t = term.trim();
    if (!t) return;
    setHistory(prev => {
      const u = [t, ...prev.filter(h => h.toLowerCase() !== t.toLowerCase())].slice(0, 6);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(u));
      return u;
    });
  };

  const clearHistory = () => { setHistory([]); localStorage.removeItem(HISTORY_KEY); };

  const filteredHistory  = search.trim()
    ? history.filter(h => h.toLowerCase().includes(search.toLowerCase()))
    : history;

  const filteredTrending = search.trim()
    ? TRENDING.filter(t => t.toLowerCase().includes(search.toLowerCase()))
    : TRENDING;

  /* ── update suggestion portal position ── */
  const updateSuggPos = useCallback(() => {
    if (!searchBarRef.current) return;
    const rect = searchBarRef.current.getBoundingClientRect();
    setSuggPos({
      top:   rect.bottom + window.scrollY,
      left:  rect.left   + window.scrollX,
      width: rect.width,
    });
  }, []);

  const openSuggestions = () => {
    updateSuggPos();
    setShowSuggestions(true);
  };

  /* ── outside click — closes BOTH dropdown and suggestions ── */
  useEffect(() => {
    const handler = (e) => {
      // Close account dropdown if clicked outside
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }

      // Close suggestions if clicked outside search area
      const portal = document.getElementById('search-suggestions-portal');
      if (
        searchBarRef.current && !searchBarRef.current.contains(e.target) &&
        (!portal || !portal.contains(e.target))
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── reposition on scroll/resize ── */
  useEffect(() => {
    if (!showSuggestions) return;
    const update = () => updateSuggPos();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update, true); window.removeEventListener('resize', update); };
  }, [showSuggestions, updateSuggPos]);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  /* ── search ── */
  const doSearch = useCallback((term) => {
    const q = (term ?? search).trim();
    if (!q) return;
    saveHistory(q);
    setShowSuggestions(false);
    setSearch(q);
    navigate(`/products?search=${encodeURIComponent(q)}`);
  }, [search, navigate]);

  const handleSearch = (e) => { e.preventDefault(); doSearch(); };

  /* ── mic ── */
  const stopListening = useCallback(() => {
    try { recognitionRef.current?.stop(); } catch {}
    setIsListening(false); setMicStatus('idle'); setMicTooltip(''); setLiveTranscript('');
  }, []);

  const handleVoiceSearch = useCallback(() => {
    if (isListening) { stopListening(); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setMicStatus('unsupported'); setMicTooltip('Voice search not supported in this browser');
      setTimeout(() => { setMicStatus('idle'); setMicTooltip(''); }, 3000);
      return;
    }
    navigator.mediaDevices?.getUserMedia({ audio: true })
      .then(() => startRecognition(SR))
      .catch(() => {
        setMicStatus('error'); setMicTooltip('Microphone access denied — check browser settings');
        setTimeout(() => { setMicStatus('idle'); setMicTooltip(''); }, 3500);
      });
  }, [isListening, stopListening]);

  const startRecognition = (SR) => {
    const rec = new SR();
    recognitionRef.current = rec;
    rec.lang = 'en-IN'; rec.continuous = false; rec.interimResults = true; rec.maxAlternatives = 1;
    setIsListening(true); setMicStatus('listening'); setMicTooltip('Listening… speak now');
    setLiveTranscript(''); setShowSuggestions(false);
    rec.start();

    rec.onresult = (event) => {
      let interim = '', final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) { final += t; rec._final = t; }
        else interim += t;
      }
      const current = final || interim;
      setLiveTranscript(current); setSearch(current); inputRef.current?.focus();
      if (final) { setMicStatus('processing'); setMicTooltip('Searching…'); setTimeout(() => doSearch(final), 400); }
    };

    rec.onend = () => {
      setIsListening(false); setMicStatus('idle'); setMicTooltip(''); setLiveTranscript('');
      if (!rec._final) { openSuggestions(); }
    };

    rec.onerror = (event) => {
      setIsListening(false); setMicStatus('error');
      const msgs = { 'no-speech': 'No speech detected — try again', 'audio-capture': 'No microphone found', 'not-allowed': 'Microphone access denied', 'network': 'Network error', 'aborted': '' };
      setMicTooltip(msgs[event.error] || `Error: ${event.error}`); setLiveTranscript('');
      setTimeout(() => { setMicStatus('idle'); setMicTooltip(''); }, 3500);
    };
  };

  /* ── toggle dropdown on click instead of hover ── */
  const handleDropdownToggle = () => setOpenDropdown(prev => !prev);

  const handleLogout = () => { logout(); setOpenDropdown(false); navigate('/'); };
  const displayName  = user?.username || user?.email?.split('@')[0] || 'Account';

  const MicIcon = () => {
    if (micStatus === 'processing') return <span className="mic-spinner" />;
    if (micStatus === 'error')      return <FaTimes />;
    return <FaMicrophone />;
  };

  /* ── Suggestions portal ── */
  const SuggestionsPortal = () => {
    if (!showSuggestions) return null;
    const hasContent = filteredHistory.length > 0 || filteredTrending.length > 0;
    if (!hasContent && !search) return null;

    return createPortal(
      <div
        id="search-suggestions-portal"
        className="search-suggestions-portal"
        style={{ top: suggPos.top, left: suggPos.left, width: suggPos.width }}
      >
        {filteredHistory.length > 0 && (
          <div className="suggestion-section">
            <div className="suggestion-header">
              <span><FaClock /> Recent</span>
              <button className="clear-history-btn" onClick={clearHistory}>Clear all</button>
            </div>
            {filteredHistory.map((h, i) => (
              <button key={i} className="suggestion-item" onClick={() => doSearch(h)}>
                <FaClock className="sug-icon sug-clock" /> {h}
              </button>
            ))}
          </div>
        )}

        {filteredTrending.length > 0 && (
          <div className="suggestion-section">
            <div className="suggestion-header"><span><FaFire /> Trending</span></div>
            {filteredTrending.map((t, i) => (
              <button key={i} className="suggestion-item" onClick={() => doSearch(t)}>
                <FaFire className="sug-icon sug-fire" /> {t}
              </button>
            ))}
          </div>
        )}

        {filteredHistory.length === 0 && filteredTrending.length === 0 && search && (
          <div className="suggestion-empty">
            Press Enter to search "<strong>{search}</strong>"
          </div>
        )}
      </div>,
      document.body
    );
  };

  return (
    <>
      <header className="header-container">

        {/* Announcement */}
        <div className="announcement-bar">
          <span key={currentMsg} className="announcement-text">{messages[currentMsg]}</span>
        </div>

        {/* Main Header */}
        <div className="main-header">

          {/* Logo */}
          <div className="logo">
            <Link to="/" className="logo-link">
              <img src="/logoimage.png" alt="BabyZone Logo" className="logo-image" />
              <img src="/logoname.png"  alt="BabyZone"      className="logoname-image" />
            </Link>
          </div>

          {/* Search */}
          <div className="search-area">
            <form
              className={`search-bar ${showSuggestions ? 'suggestions-open' : ''} ${isListening ? 'listening-ring' : ''}`}
              ref={searchBarRef}
              onSubmit={handleSearch}
            >
              <FaSearch className="search-icon" />
              <input
                ref={inputRef}
                type="text"
                placeholder={isListening ? 'Listening…' : 'Search for baby products…'}
                value={search}
                onChange={(e) => { setSearch(e.target.value); openSuggestions(); }}
                onFocus={openSuggestions}
                autoComplete="off"
              />
              {search && (
                <button type="button" className="clear-btn"
                  onClick={() => { setSearch(''); inputRef.current?.focus(); }} aria-label="Clear">
                  <FaTimes />
                </button>
              )}
              <div className="mic-wrapper">
                {micTooltip && <div className="mic-tooltip">{micTooltip}</div>}
                {isListening && <div className="mic-waves"><span /><span /><span /></div>}
                <button
                  type="button"
                  className={`mic-button mic-${micStatus}`}
                  onClick={handleVoiceSearch}
                  aria-label={isListening ? 'Stop' : 'Voice search'}
                >
                  <MicIcon />
                </button>
              </div>
            </form>
          </div>

          {/* Right */}
          <div className="nav-right">
            <div className="nav-links">
              <Link to="/"          className={isActive('/')          ? 'active-link' : ''}>Home</Link>
              <Link to="/about"     className={isActive('/about')     ? 'active-link' : ''}>About</Link>
              <Link to="/contact"   className={isActive('/contact')   ? 'active-link' : ''}>Contact</Link>
              <Link to="/forum"     className={isActive('/forum')     ? 'active-link' : ''}>Forum</Link>
              <Link to="/parenting" className={isActive('/parenting') ? 'active-link' : ''}>Parenting Classes</Link>
            </div>

            {/* ✅ FIXED: click to toggle, not hover */}
            <div className="account-dropdown" ref={dropdownRef}>
              <span className="account-trigger" onClick={handleDropdownToggle}>
                <FaUser />
                <span className="account-label">{user ? displayName : 'Account'}</span>
                <FaChevronDown className={`chevron-icon ${openDropdown ? 'open' : ''}`} />
              </span>

              {openDropdown && (
                <div className="dropdown-menu">
                  {user ? (
                    <>
                      <div className="dropdown-greeting">👋 Hi, <strong>{displayName}</strong></div>
                      <div className="dropdown-divider" />
                      <Link to="/account"        onClick={() => setOpenDropdown(false)}>My Profile</Link>
                      <Link to="/track-order"    onClick={() => setOpenDropdown(false)}>My Orders</Link>
                      <div className="dropdown-divider" />
                      <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login"    onClick={() => setOpenDropdown(false)}>Log In</Link>
                      <Link to="/register" onClick={() => setOpenDropdown(false)}>Register</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="cart-icon">
              <FaShoppingCart />
              {cart?.items?.length > 0 && <span className="cart-count">{cart.items.length}</span>}
            </Link>
          </div>
        </div>

        {/* Listening Bar */}
        {isListening && (
          <div className="voice-listening-bar">
            <div className="voice-bar-inner">
              <div className="voice-bars-anim">{[...Array(5)].map((_, i) => <span key={i} />)}</div>
              <span className="voice-bar-text">
                {liveTranscript ? `"${liveTranscript}"` : 'Listening… speak your search'}
              </span>
              <button className="voice-bar-cancel" onClick={stopListening}><FaTimes /> Cancel</button>
            </div>
          </div>
        )}
      </header>

      <SuggestionsPortal />
    </>
  );
};

export default Header;
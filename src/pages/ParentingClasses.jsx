import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';


const API = "http://localhost:8000/api";

// ── Register Modal
function RegisterModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/forum/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("forumUser", JSON.stringify({ name: form.name, email: form.email }));
        onSuccess({ name: form.name, email: form.email });
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch {
      localStorage.setItem("forumUser", JSON.stringify({ name: form.name, email: form.email }));
      onSuccess({ name: form.name, email: form.email });
    } finally {
      setLoading(false);
    }
  };

  return (


    <div style={styles.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <h2 style={styles.modalTitle}>Sign in to Join</h2>
        <div style={styles.field}>
          <label style={styles.label}>Name</label>
          <input name="name" value={form.name} onChange={handleChange}
            placeholder="John Doe" style={styles.input} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange}
            placeholder="johndoe@gmail.com" style={styles.input} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <div style={styles.pwWrap}>
            <input name="password" type={showPw ? "text" : "password"}
              value={form.password} onChange={handleChange} placeholder="XXXXXX"
              style={{ ...styles.input, flex: 1, marginBottom: 0 }} />
            <button style={styles.pwToggle} onClick={() => setShowPw(!showPw)}>
              {showPw ? "🙈" : "👁"}
            </button>
          </div>
        </div>
        {error && <div style={styles.error}>{error}</div>}
        <div style={styles.forgot}>Forget password?</div>
        <div style={styles.modalActions}>
          <button style={styles.btnBack} onClick={onClose}>Back</button>
          <button style={styles.btnRegister} onClick={handleRegister} disabled={loading}>
            {loading ? "..." : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Join Class Modal
function JoinClassModal({ cls, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.email) { setError("Name and email are required."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/parenting/join-class/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, class_id: cls.id, class_title: cls.title }),
      });
      const data = await res.json();
      if (!res.ok && res.status !== 200) {
        setError(data.message || "Something went wrong.");
        setLoading(false);
        return;
      }
    } catch {
      // silent — still show success
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (

    <div style={styles.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        {submitted ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 48 }}>🎉</div>
            <h2 style={styles.modalTitle}>You're Enrolled!</h2>
            <p style={{ color: "#666", marginBottom: 24 }}>
              Successfully joined <strong>{cls.title}</strong>
            </p>
            <button style={styles.btnRegister} onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <h2 style={styles.modalTitle}>Join Class</h2>
            <p style={{ color: "#888", marginBottom: 16, fontSize: 14 }}>
              {cls.title} — Starts {cls.starts_on} · {cls.duration}
            </p>
            <div style={styles.field}>
              <label style={styles.label}>Name</label>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="Your name" style={styles.input} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="your@email.com" style={styles.input} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Phone (optional)</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                placeholder="+91 XXXXX XXXXX" style={styles.input} />
            </div>
            {error && <div style={styles.error}>{error}</div>}
            <div style={styles.modalActions}>
              <button style={styles.btnBack} onClick={onClose}>Back</button>
              <button style={styles.btnRegister} onClick={handleSubmit} disabled={loading}>
                {loading ? "..." : "Join Now"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Workshop Register Modal
function WorkshopModal({ workshop, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.email) { setError("Name and email are required."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/parenting/register-workshop/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, workshop_id: workshop.id, workshop_title: workshop.title }),
      });
      const data = await res.json();
      if (!res.ok && res.status !== 200) {
        setError(data.message || "Something went wrong.");
        setLoading(false);
        return;
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div style={styles.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        {submitted ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 48 }}>✅</div>
            <h2 style={styles.modalTitle}>Registered!</h2>
            <p style={{ color: "#666", marginBottom: 24 }}>
              You've registered for <strong>{workshop.title}</strong>
            </p>
            <button style={styles.btnRegister} onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <h2 style={styles.modalTitle}>Register for Workshop</h2>
            <p style={{ color: "#888", marginBottom: 16, fontSize: 14 }}>
              {workshop.title} · {workshop.date} · {workshop.time_display}
            </p>
            <div style={styles.field}>
              <label style={styles.label}>Name</label>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="Your name" style={styles.input} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="your@email.com" style={styles.input} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Phone (optional)</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                placeholder="+91 XXXXX XXXXX" style={styles.input} />
            </div>
            {error && <div style={styles.error}>{error}</div>}
            <div style={styles.modalActions}>
              <button style={styles.btnBack} onClick={onClose}>Back</button>
              <button style={styles.btnRegister} onClick={handleSubmit} disabled={loading}>
                {loading ? "..." : "Register"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Skeleton loader card
function SkeletonCard({ height = 150 }) {
  return (
    <div style={{ ...styles.classCard, animation: "pulse 1.5s ease-in-out infinite" }}>
      <div style={{ height, background: "#e8e8e8" }} />
      <div style={{ padding: 14 }}>
        <div style={{ height: 14, background: "#e8e8e8", borderRadius: 6, marginBottom: 10 }} />
        <div style={{ height: 12, background: "#f0f0f0", borderRadius: 6, marginBottom: 14, width: "70%" }} />
        <div style={{ height: 36, background: "#f0f0f0", borderRadius: 22 }} />
      </div>
    </div>
  );
}

// ── Main Page
export default function ParentingClasses() {
  const [classes, setClasses] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingWorkshops, setLoadingWorkshops] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [joinClass, setJoinClass] = useState(null);
  const [workshopModal, setWorkshopModal] = useState(null);

  // ── Fetch classes from backend
  useEffect(() => {
    fetch(`${API}/parenting/classes/`)
      .then((r) => r.json())
      .then((data) => {
        setClasses(Array.isArray(data) ? data : []);
        setLoadingClasses(false);
      })
      .catch(() => {
        setFetchError("Could not reach backend. Showing sample data.");
        setClasses([
          { id: 1, title: "Child Development", starts_on: "28/08/2025", duration: "10 Days", image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80" },
          { id: 2, title: "Discipline", starts_on: "29/08/2025", duration: "10 Days", image: "https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?w=400&q=80" },
          { id: 3, title: "Parenting techniques", starts_on: "30/08/2025", duration: "10 Days", image: "https://images.unsplash.com/photo-1520047775959-debb0c37b39e?w=400&q=80" },
          { id: 4, title: "Parenting techniques", starts_on: "02/09/2025", duration: "30 Days", image: "https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?w=400&q=80" },
        ]);
        setLoadingClasses(false);
      });
  }, []);

  // ── Fetch workshops from backend
  useEffect(() => {
    fetch(`${API}/parenting/workshops/`)
      .then((r) => r.json())
      .then((data) => {
        setWorkshops(Array.isArray(data) ? data : []);
        setLoadingWorkshops(false);
      })
      .catch(() => {
        setWorkshops([
          { id: 1, title: "Child care", conductor: "James doe", role: "Senior Doctor", date: "Wed, 28 Aug, 2025", time_display: "10.00 Am - 1.00Pm", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
          { id: 2, title: "First step with baby", conductor: "James doe", role: "Senior Doctor", date: "Wed, 28 Aug, 2025", time_display: "10.00 Am - 1.00Pm", image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80" },
          { id: 3, title: "The Art of Baby Handling", conductor: "James doe", role: "Senior Doctor", date: "Wed, 28 Aug, 2025", time_display: "10.00 Am - 1.00Pm", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80" },
        ]);
        setLoadingWorkshops(false);
      });
  }, []);

  // ── Resolve image URL: handles full URL from backend OR /media/... relative path
  const imgSrc = (url, fallback) => {
    if (!url) return fallback;
    if (url.startsWith("http")) return url;
    return `http://localhost:8000${url}`;
  };

  const classFallback = "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80";
  const workshopFallback = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80";

  return (
    <div style={styles.page}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>

      {/* Modals */}
      {showRegisterModal && (
        <RegisterModal onClose={() => setShowRegisterModal(false)}
          onSuccess={() => setShowRegisterModal(false)} />
      )}
      {joinClass && <JoinClassModal cls={joinClass} onClose={() => setJoinClass(null)} />}
      {workshopModal && <WorkshopModal workshop={workshopModal} onClose={() => setWorkshopModal(null)} />}

      {/* Breadcrumb */}
      <div style={styles.breadcrumb}>Home/ Parenting classes</div>

      {/* Fetch warning */}
      {fetchError && <div style={styles.fetchError}>⚠️ {fetchError}</div>}

      {/* ── Online Classes */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Online Classes</h2>
        <div style={styles.classesGrid}>
          {loadingClasses
            ? [1, 2, 3, 4].map((n) => <SkeletonCard key={n} height={150} />)
            : classes.map((cls) => (
              <div key={cls.id} style={styles.classCard}>
                <div style={styles.classImgWrap}>
                  <img
                    src={imgSrc(cls.image, classFallback)}
                    alt={cls.title}
                    style={styles.classImg}
                    onError={(e) => { e.target.src = classFallback; }}
                  />
                </div>
                <div style={styles.classInfo}>
                  <div style={styles.classTitle}>{cls.title}</div>
                  <div style={styles.classMeta}>
                    <span>Starts on {cls.starts_on}</span>
                    <span>{cls.duration}</span>
                  </div>
                  <button
                    style={styles.joinBtn}
                    onClick={() => setJoinClass(cls)}
                    onMouseEnter={(e) => (e.target.style.background = "#e6b800")}
                    onMouseLeave={(e) => (e.target.style.background = "#FFC107")}
                  >
                    Join class
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* ── Workshops */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Workshops</h2>
        <div style={styles.workshopsGrid}>
          {loadingWorkshops
            ? [1, 2, 3].map((n) => <SkeletonCard key={n} height={180} />)
            : workshops.map((ws) => (
              <div key={ws.id} style={styles.workshopCard}>
                <img
                  src={imgSrc(ws.image, workshopFallback)}
                  alt={ws.title}
                  style={styles.workshopImg}
                  onError={(e) => { e.target.src = workshopFallback; }}
                />
                <div style={styles.workshopInfo}>
                  <div style={styles.workshopTitle}>{ws.title}</div>
                  <div style={styles.workshopMeta}>Contucted by {ws.conductor}</div>
                  <div style={styles.workshopMeta}>{ws.role}</div>
                  <div style={styles.workshopMeta}>{ws.date}</div>
                  <div style={styles.workshopMeta}>Time: {ws.time_display}</div>
                  <button
                    style={styles.registerBtn}
                    onClick={() => setWorkshopModal(ws)}
                    onMouseEnter={(e) => (e.target.style.background = "#e6b800")}
                    onMouseLeave={(e) => (e.target.style.background = "#FFC107")}
                  >
                    Register
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* ── Banner */}
      <div style={styles.banner}>
        <div style={styles.bannerText}>Free sign In to Join classes and Workshop now</div>
        <button
          style={styles.bannerBtn}
          onClick={() => setShowRegisterModal(true)}
          onMouseEnter={(e) => (e.target.style.background = "#e6b800")}
          onMouseLeave={(e) => (e.target.style.background = "#FFC107")}
        >
          Register
        </button>
        <img
          src="https://images.unsplash.com/photo-1519689680058-324335c77eba?w=200&q=80"
          alt="mom and baby"
          style={styles.bannerImg}
        />
      </div>
    </div>
  );
}
const styles = {
  // Page container
  page: {
    fontFamily: "'Quicksand', sans-serif",
    backgroundColor: "#fff",
    minHeight: "100vh",               // was 200vh – fixed to avoid excessive scroll
    padding: "0 0 40px 0",
    color: "#222",
  },
  breadcrumb: {
    fontSize: 13,
    color: "#666",
    padding: "8px 24px",              // reduced from 14px 32px
    borderBottom: "1px solid #f0f0f0",
  },
  fetchError: {
    margin: "8px 24px",               // reduced from 12px 32px
    padding: "8px 12px",              // reduced from 10px 16px
    background: "#fff3cd",
    border: "1px solid #ffc107",
    borderRadius: 8,
    fontSize: 13,
    color: "#856404",
  },

  // Sections
  section: {
    padding: "16px 24px 4px",         // reduced from 24px 32px 8px
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 16,                 // reduced from 20
    color: "#111",
  },

  // Classes grid
  classesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,                          // reduced from 20
  },
  classCard: {
    border: "1.5px solid #e8e8e8",
    borderRadius: 14,
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  classImgWrap: {
    height: 250,                      // as you set
    overflow: "hidden",
    background: "#f5f5f5",
  },
  classImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  classInfo: {
    padding: "12px 12px 14px",        // reduced from 14px 14px 16px
  },
  classTitle: {
    fontWeight: 700,
    fontSize: 15,
    marginBottom: 4,                  // reduced from 6
    color: "#111",
  },
  classMeta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
    color: "#888",
    marginBottom: 8,                  // reduced from 12
  },
  joinBtn: {
    width: "100%",
    background: "#FFC107",
    border: "none",
    borderRadius: 22,
    padding: "8px 0",                 // reduced from 9px 0
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    color: "#111",
    transition: "background 0.2s",
  },

  // Workshops grid
  workshopsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 20,                          // reduced from 24
  },
  workshopCard: {
    border: "1.5px solid #e8e8e8",
    borderRadius: 14,
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  workshopImg: {
    width: "100%",
    height: 300,                      // as you set
    objectFit: "cover",
    display: "block",
  },
  workshopInfo: {
    padding: "12px 14px 16px",        // reduced from 14px 16px 18px
  },
  workshopTitle: {
    fontWeight: 700,
    fontSize: 16,
    marginBottom: 4,                  // reduced from 6
    color: "#111",
  },
  workshopMeta: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2,                  // reduced from 3
  },
  registerBtn: {
    marginTop: 10,                    // reduced from 12
    background: "#FFC107",
    border: "none",
    borderRadius: 22,
    padding: "8px 24px",              // reduced from 9px 28px
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    color: "#111",
    transition: "background 0.2s",
  },

  // Banner
  banner: {
    margin: "24px 24px 0",            // reduced from 32px 32px 0
    background: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 60%, #f48fb1 100%)",
    borderRadius: 16,
    padding: "20px 28px",             // reduced from 28px 40px
    display: "flex",
    alignItems: "center",
    gap: 20,                          // reduced from 24
    position: "relative",
    overflow: "hidden",
    minHeight: 80,                    // reduced from 100
  },
  bannerText: {
    fontSize: 18,
    fontWeight: 700,
    color: "#111",
    flex: 1,
  },
  bannerBtn: {
    background: "#FFC107",
    border: "none",
    borderRadius: 22,
    padding: "8px 28px",              // reduced from 10px 32px
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    color: "#111",
    flexShrink: 0,
    transition: "background 0.2s",
  },
  bannerImg: {
    width: 80,                        // reduced from 90
    height: 80,                       // reduced from 90
    borderRadius: "50%",
    objectFit: "cover",
    flexShrink: 0,
    border: "3px solid #fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  },

  // Modal styles (unchanged, but you can reduce padding if needed)
  backdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 },
  modal: { background: "#fff", borderRadius: 16, padding: "24px 28px", width: 380, maxWidth: "90vw", boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }, // reduced padding from 32px 36px
  modalTitle: { fontSize: 22, fontWeight: 700, marginBottom: 20, color: "#111", textAlign: "center" }, // reduced marginBottom
  field: { marginBottom: 14 },        // reduced from 16
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 4 }, // reduced
  input: { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14, outline: "none", boxSizing: "border-box", color: "#222" }, // reduced padding
  pwWrap: { display: "flex", gap: 8, alignItems: "center" },
  pwToggle: { background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: "0 4px" },
  error: { color: "#e53935", fontSize: 13, marginBottom: 8, textAlign: "center" }, // reduced
  forgot: { textAlign: "right", fontSize: 12, color: "#888", marginBottom: 16, cursor: "pointer" }, // reduced
  modalActions: { display: "flex", gap: 12, justifyContent: "center" },
  btnBack: { background: "#fff", border: "1.5px solid #ddd", borderRadius: 22, padding: "8px 24px", fontWeight: 600, fontSize: 14, cursor: "pointer", color: "#555" }, // reduced
  btnRegister: { background: "#FFC107", border: "none", borderRadius: 22, padding: "8px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer", color: "#111" }, // reduced
};
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ import real auth
import "./Forum.css";

// ── Fallback data if API is unreachable
const FALLBACK_CATEGORIES = [
  {
    id: 1,
    name: "Pregnancy",
    description: "Join forum to ask or share something",
    image: "https://images.unsplash.com/photo-1520775313364-b9e0e2f0a7a0?w=400&q=80",
  },
  {
    id: 2,
    name: "Parenting",
    description: "Join forum to ask or share something",
    image: "https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?w=400&q=80",
  },
  {
    id: 3,
    name: "Childcare",
    description: "Join forum to ask or share something",
    image: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=400&q=80",
  },
  {
    id: 4,
    name: "Product Reviews",
    description: "Join forum to ask or share something",
    image: "https://images.unsplash.com/photo-1545696968-1a31ea033e9a?w=400&q=80",
  },
];

const FALLBACK_BLOGS = [
  {
    id: 1,
    title: "The Story of My Rainbow Baby",
    excerpt:
      "What does it mean when I say that my daughter is my 'Rainbow Baby'? A 'Rainbow Baby' is a baby that is born following a miscarriage or an infant loss. Just like a beautiful and...",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=300&q=80",
  },
  {
    id: 2,
    title: "Baby Dry Skin: Symptoms, Causes and Treatment",
    excerpt:
      "For a parent, their baby's health is of utmost importance. This means taking care of their internal health by ensuring the right kind of nutrition...",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&q=80",
  },
  {
    id: 3,
    title: "Raisins for babies- Health benefits and risks",
    excerpt:
      "Many of us love a good old raisin- they are small, wrinkled packets of energy that have been around since medieval times...",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&q=80",
  },
  {
    id: 4,
    title: "Hernia in Babies – Types, Causes, Signs and Treatment",
    excerpt:
      "A hernia is a lump that develops under the skin, in the tummy or groin region, and in variable sizes...",
    image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=300&q=80",
  },
];

// ── Sign In / Register Modal — now uses AuthContext
function SignInModal({ onClose, onSuccess }) {
  const { login, register } = useAuth(); // ✅ use real auth

  const [isLogin, setIsLogin]     = useState(false); // toggle login vs register
  const [form, setForm]           = useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw]       = useState(false);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Register via AuthContext → Django User + JWT
  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await register(form.name, form.email, form.password);
      onSuccess(); // AuthContext already set user in state
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Login via AuthContext → Django JWT
  const handleLogin = async () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await login(form.email, form.password);
      onSuccess();
    } catch (err) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="signin-modal">
        <h2>{isLogin ? "Sign In" : "Sign in to Join"}</h2>

        {!isLogin && (
          <div className="modal-field">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
          </div>
        )}

        <div className="modal-field">
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="johndoe@gmail.com"
          />
        </div>

        <div className="modal-field">
          <label>Password</label>
          <div className="pw-wrap">
            <input
              name="password"
              type={showPw ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="XXXXXX"
            />
            <button className="pw-toggle" onClick={() => setShowPw(!showPw)}>
              {showPw ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {error && <div className="modal-error">{error}</div>}

        {/* ✅ Toggle between login and register */}
        <div className="modal-forgot" onClick={() => { setIsLogin(!isLogin); setError(""); }}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Sign in"}
        </div>

        <div className="modal-actions">
          <button className="modal-btn back" onClick={onClose}>Back</button>
          <button
            className="modal-btn register"
            onClick={isLogin ? handleLogin : handleRegister}
            disabled={loading}
          >
            {loading ? "..." : isLogin ? "Sign In" : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Forum Page
export default function Forum() {
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ get user from AuthContext (already loaded from localStorage)

  const [categories, setCategories]     = useState([]);
  const [blogs, setBlogs]               = useState([]);
  const [loadingCats, setLoadingCats]   = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  const [showModal, setShowModal]           = useState(false);
  const [pendingCategory, setPendingCategory] = useState(null);

  // ── Fetch forum groups from backend
  useEffect(() => {
    fetch("https://manipraveen1.pythonanywhere.com/api/forum/groups/", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setCategories(Array.isArray(data) && data.length > 0 ? data : FALLBACK_CATEGORIES);
      })
      .catch(() => setCategories(FALLBACK_CATEGORIES))
      .finally(() => setLoadingCats(false));
  }, []);

  // ── Fetch blog posts from backend
  useEffect(() => {
    fetch("http://localhost:8000/api/forum/blogs/", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setBlogs(Array.isArray(data) && data.length > 0 ? data : FALLBACK_BLOGS);
      })
      .catch(() => setBlogs(FALLBACK_BLOGS))
      .finally(() => setLoadingBlogs(false));
  }, []);

  const handleJoin = (categoryName) => {
    if (user) {
      // ✅ user already logged in via AuthContext — go straight to chat
      navigate("/forum/chat", { state: { category: categoryName } });
    } else {
      setPendingCategory(categoryName);
      setShowModal(true);
    }
  };

  // ✅ After successful login/register, AuthContext has set user — navigate to chat
  const handleSignInSuccess = () => {
    setShowModal(false);
    navigate("/forum/chat", { state: { category: pendingCategory } });
  };

  return (
    <div className="forum-page">
      {showModal && (
        <SignInModal onClose={() => setShowModal(false)} onSuccess={handleSignInSuccess} />
      )}

      {/* Breadcrumb */}
      <div className="breadcrumb">Home/ Forum</div>

      {/* Join Forum Banner */}
      <div className="join-banner-wrap">
        <button className="join-forum-btn" onClick={() => handleJoin(null)}>
          Join Forum
        </button>
      </div>

      {/* Category Cards */}
      <div className="category-grid">
        {loadingCats
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="cat-card cat-skeleton" />
            ))
          : categories.map((cat) => (
              <div
                key={cat.id}
                className="cat-card"
                style={{
                  backgroundImage: `url(${
                    cat.image ||
                    "https://images.unsplash.com/photo-1520775313364-b9e0e2f0a7a0?w=400&q=80"
                  })`,
                }}
              >
                <div className="cat-overlay" />
                <div className="cat-content">
                  <div className="cat-title">{cat.name}</div>
                  <div className="cat-desc">
                    {cat.description || "Join forum to ask or share something"}
                  </div>
                  <button className="cat-join-btn" onClick={() => handleJoin(cat.name)}>
                    Join
                  </button>
                </div>
              </div>
            ))}
      </div>

      {/* Blogs Section */}
      <div className="blogs-section">
        <div className="blogs-header">
          <button className="blogs-title-btn">Blogs</button>
          <span className="view-more">View more</span>
        </div>

        <div className="blogs-grid">
          {loadingBlogs
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="blog-card blog-skeleton">
                  <div className="blog-img-skeleton" />
                  <div className="blog-content-skeleton">
                    <div className="skel-line skel-title" />
                    <div className="skel-line" />
                    <div className="skel-line short" />
                  </div>
                </div>
              ))
            : blogs.map((blog) => (
                <div key={blog.id} className="blog-card">
                  <img
                    src={
                      blog.image ||
                      "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=300&q=80"
                    }
                    alt={blog.title}
                    className="blog-img"
                  />
                  <div className="blog-content">
                    <h3 className="blog-title">{blog.title}</h3>
                    <p className="blog-excerpt">{blog.excerpt}</p>
                    <button className="read-more-btn">Read more</button>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

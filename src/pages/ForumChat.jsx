import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ import real auth
import "./ForumChat.css";

// ── Groups data
const GROUPS = [
  { id: 1, name: "Pregnancy",       users: 500, img: "https://images.unsplash.com/photo-1520775313364-b9e0e2f0a7a0?w=80&q=60" },
  { id: 2, name: "Parenting",       users: 500, img: "https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?w=80&q=60" },
  { id: 3, name: "Child care",      users: 500, img: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=80&q=60" },
  { id: 4, name: "Product reviews", users: 500, img: "https://images.unsplash.com/photo-1545696968-1a31ea033e9a?w=80&q=60" },
];

// ── Seed messages per group
const SEED_MESSAGES = {
  1: [
    { id: 1, from: "Anya",  avatar: "https://i.pravatar.cc/40?img=47", text: "Hi everyone!", time: "12:00 AM, 25/08/2025", mine: false },
    { id: 2, from: "Priya", avatar: "https://i.pravatar.cc/40?img=48", text: "Hi everyone!", time: "1:00 PM, 25/08/2025",  mine: false },
    { id: 3, from: "Rita",  avatar: "https://i.pravatar.cc/40?img=49", text: "Hi everyone!", time: "12:00 AM, 25/08/2025", mine: false },
  ],
  2: [
    { id: 1, from: "Sara",  avatar: "https://i.pravatar.cc/40?img=32", text: "Any tips for newborns?", time: "9:00 AM, 25/08/2025", mine: false },
  ],
  3: [
    { id: 1, from: "Neha",  avatar: "https://i.pravatar.cc/40?img=25", text: "Looking for daycare advice!", time: "10:00 AM, 25/08/2025", mine: false },
  ],
  4: [
    { id: 1, from: "Meena", avatar: "https://i.pravatar.cc/40?img=44", text: "Anyone tried BabyZone diapers?", time: "11:00 AM, 25/08/2025", mine: false },
  ],
};

function formatTime() {
  const now = new Date();
  return now.toLocaleString("en-GB", {
    hour: "2-digit", minute: "2-digit", hour12: true,
    day: "2-digit", month: "2-digit", year: "numeric",
  }).replace(",", "");
}

export default function ForumChat() {
  const navigate  = useNavigate();
  const location  = useLocation();

  // ✅ Get user from AuthContext — single source of truth, no more localStorage "forumUser"
  const { user, logout } = useAuth();

  // Find initial group from navigation state
  const passedCat = location.state?.category;
  const initGroup =
    GROUPS.find(
      (g) => passedCat && g.name.toLowerCase().includes(passedCat?.toLowerCase().slice(0, 4))
    ) || GROUPS[0];

  const [activeGroup, setActiveGroup] = useState(initGroup);
  const [allMessages, setAllMessages] = useState({ ...SEED_MESSAGES });
  const [input, setInput]             = useState("");
  const bottomRef                     = useRef(null);

  const messages = allMessages[activeGroup.id] || [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeGroup]);

  // ✅ Redirect to forum login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/forum");
    }
  }, [user, navigate]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !user) return;

    const newMsg = {
      id: Date.now(),
      from: user.username,                              // ✅ use username from Django User
      avatar: `https://i.pravatar.cc/40?u=${user.email}`,
      text,
      time: formatTime(),
      mine: true,
    };

    setAllMessages((prev) => ({
      ...prev,
      [activeGroup.id]: [...(prev[activeGroup.id] || []), newMsg],
    }));
    setInput("");

    // Post to backend — JWT token is in localStorage, attach it
    try {
      const token = localStorage.getItem("access");
      await fetch("http://localhost:8000/api/forum/message/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}), // ✅ send JWT
        },
        credentials: "include",
        body: JSON.stringify({
          group: activeGroup.name,
          sender: user.username,
          message: text,
        }),
      });
    } catch {
      // silent fail — message already shown in UI
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // ✅ Leave = logout via AuthContext (clears tokens + user state)
  const handleLeave = () => {
    logout();
    navigate("/forum");
  };

  const handleHome = () => navigate("/");

  // Guard: while AuthContext is loading, show nothing
  if (!user) return null;

  return (
    <div className="chat-page">
      {/* LEFT SIDEBAR */}
      <aside className="chat-sidebar">
        <div className="sidebar-avatar">
          <img
            src={`https://i.pravatar.cc/60?u=${user.email}`}
            alt={user.username}
            className="my-avatar"
          />
        </div>
        <nav className="sidebar-nav">
          <button className="nav-item" onClick={handleHome}>
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </button>
          <button className="nav-item active">
            <span className="nav-icon">💬</span>
            <span>Chat</span>
          </button>
          <button className="nav-item">
            <span className="nav-icon">🔔</span>
            <span>Notification</span>
          </button>
        </nav>
        <button className="leave-btn" onClick={handleLeave}>
          <span>↩</span> Leave
        </button>
      </aside>

      {/* GROUPS PANEL */}
      <section className="groups-panel">
        <h2 className="groups-title">Groups</h2>
        <div className="groups-list">
          {GROUPS.map((g) => (
            <div
              key={g.id}
              className={`group-item ${activeGroup.id === g.id ? "active" : ""}`}
              onClick={() => setActiveGroup(g)}
            >
              <img src={g.img} alt={g.name} className="group-avatar" />
              <div className="group-info">
                <span className="group-name">{g.name}</span>
                <span className="group-users">{g.users} Users</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CHAT PANEL */}
      <section className="chat-panel">
        {/* Chat Header */}
        <div className="chat-header">
          <div className="chat-header-left">
            <img
              src={`https://i.pravatar.cc/42?u=${user.email}`}
              alt={user.username}
              className="chat-user-avatar"
            />
            <div>
              {/* ✅ show username from Django User, not forumUser.name */}
              <div className="chat-user-name">{user.username}</div>
              <div className="chat-user-status">Active</div>
            </div>
          </div>
          <button className="chat-menu-btn">⋮</button>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map((msg) =>
            msg.mine ? (
              <div key={msg.id} className="msg-row mine">
                <div className="msg-col">
                  <div className="bubble mine">{msg.text}</div>
                  <div className="msg-time">{msg.time}</div>
                </div>
                <img src={msg.avatar} alt={msg.from} className="msg-avatar" />
              </div>
            ) : (
              <div key={msg.id} className="msg-row theirs">
                <img src={msg.avatar} alt={msg.from} className="msg-avatar" />
                <div className="msg-col">
                  <div className="bubble theirs">{msg.text}</div>
                  <div className="msg-time">{msg.time}</div>
                </div>
              </div>
            )
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="chat-input-row">
          <input
            className="chat-input"
            placeholder="Type Message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button className="chat-send-btn" onClick={handleSend}>➤</button>
        </div>
      </section>
    </div>
  );
}
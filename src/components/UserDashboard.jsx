import React from 'react';
import MapComponent from './MapComponent';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen" style={{ fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ── NAVBAR ── */}
      <nav
        className="flex justify-between items-center shadow-lg"
        style={{
          background: "linear-gradient(135deg, #0f0c29 0%, #302b63 60%, #0077b6 100%)",
          borderBottom: "2px solid rgba(0,245,212,0.35)",
          padding: "10px 28px",
          flexShrink: 0,
        }}
      >
        {/* Left — brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "1.6rem" }}>🌊</span>
          <div>
            <h1 style={{
              fontSize: "1.15rem",
              fontWeight: "800",
              background: "linear-gradient(90deg, #00f5d4, #00b4d8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.1em",
              lineHeight: 1,
            }}>FLOODIFY</h1>
            <span style={{
              fontSize: "0.72rem",
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}>User Dashboard</span>
          </div>
        </div>

        {/* Right — user info + logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            background: "rgba(0,245,212,0.1)",
            border: "1px solid rgba(0,245,212,0.25)",
            borderRadius: "50px",
            padding: "7px 18px",
          }}>
            <div style={{
              width: "30px", height: "30px", borderRadius: "50%",
              background: "linear-gradient(135deg, #00f5d4, #00b4d8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.9rem", fontWeight: "700", color: "#0f0c29",
            }}>
              {(user.username || "U")[0].toUpperCase()}
            </div>
            <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.9rem", fontWeight: "600" }}>
              {user.username || "User"}
            </span>
          </div>

          <button
            onClick={handleLogout}
            style={{
              background: "linear-gradient(135deg, #ff4d6d, #c9184a)",
              color: "#fff",
              padding: "8px 20px",
              borderRadius: "50px",
              border: "none",
              fontWeight: "600",
              fontSize: "0.88rem",
              cursor: "pointer",
              boxShadow: "0 0 14px rgba(255,77,109,0.35)",
              transition: "transform 0.2s, box-shadow 0.2s",
              letterSpacing: "0.04em",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 22px rgba(255,77,109,0.55)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 14px rgba(255,77,109,0.35)"; }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* ── MAP LEGEND STRIP ── */}
      <div style={{
        background: "linear-gradient(90deg, #0f0c29, #1a1a2e, #0f0c29)",
        borderBottom: "1px solid rgba(0,245,212,0.15)",
        padding: "7px 28px",
        display: "flex",
        gap: "24px",
        alignItems: "center",
        flexShrink: 0,
        flexWrap: "wrap",
      }}>
        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Map Legend:</span>
        {[
          { dot: "🔵", label: "Your Location" },
          { dot: "🟠", label: "Flood Area" },
          { dot: "🟣", label: "Pending Shelter" },
          { dot: "🟢", label: "Verified Shelter" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "0.85rem" }}>{item.dot}</span>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.78rem" }}>{item.label}</span>
          </div>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{
            background: "rgba(0,245,212,0.12)",
            border: "1px solid rgba(0,245,212,0.3)",
            color: "#00f5d4",
            fontSize: "0.73rem",
            padding: "2px 12px",
            borderRadius: "50px",
            fontWeight: "600",
          }}>📍 Click map to report flood</span>
        </div>
      </div>

      {/* ── MAP ── */}
      <main className="flex-1 w-full" style={{ overflow: "hidden" }}>
        <div className="w-full h-full flex-1">
          <MapComponent
            role={user.role || "USER"}
            userId={user.id}
            username={user.username}
          />
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        background: "linear-gradient(135deg, #0f0c29, #302b63)",
        borderTop: "1px solid rgba(0,245,212,0.15)",
        color: "rgba(255,255,255,0.45)",
        padding: "10px 28px",
        textAlign: "center",
        fontSize: "0.82rem",
        flexShrink: 0,
      }}>
        {new Date().getFullYear()} <span style={{ color: "#00f5d4", fontWeight: "700" }}>JalRakshak Dashboard</span>. All CopyRights reserved.
      </footer>
    </div>
  );
}

export default UserDashboard;

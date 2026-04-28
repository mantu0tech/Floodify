import React from 'react';
import MapComponent from './MapComponent';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const adminName = "Team Telusko";

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ── NAVBAR ── */}
      <nav
        className="flex justify-between items-center shadow-lg"
        style={{
          background: "linear-gradient(135deg, #1a0500 0%, #4a1000 50%, #7c2d00 100%)",
          borderBottom: "2px solid rgba(255,120,0,0.4)",
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
              background: "linear-gradient(90deg, #ffa500, #ff6b35)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.1em",
              lineHeight: 1,
            }}>FLOODIFY</h1>
            <span style={{
              fontSize: "0.72rem",
              color: "rgba(255,200,100,0.6)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}>Admin Panel</span>
          </div>
        </div>

        {/* Right — admin info + logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* Admin badge */}
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            background: "rgba(255,120,0,0.12)",
            border: "1px solid rgba(255,120,0,0.3)",
            borderRadius: "50px",
            padding: "7px 18px",
          }}>
            <div style={{
              width: "30px", height: "30px", borderRadius: "50%",
              background: "linear-gradient(135deg, #ffa500, #ff6b35)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.9rem", color: "#1a0500",
            }}>🛡️</div>
            <div>
              <div style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.88rem", fontWeight: "700" }}>{adminName}</div>
              <div style={{ color: "#ffa500", fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Administrator</div>
            </div>
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

      {/* ── ADMIN LEGEND STRIP ── */}
      <div style={{
        background: "linear-gradient(90deg, #1a0500, #2a0e00, #1a0500)",
        borderBottom: "1px solid rgba(255,120,0,0.15)",
        padding: "7px 28px",
        display: "flex",
        gap: "24px",
        alignItems: "center",
        flexShrink: 0,
        flexWrap: "wrap",
      }}>
        <span style={{ color: "rgba(255,200,100,0.45)", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Admin Controls:</span>
        {[
          { dot: "🟠", label: "Flood Report" },
          { dot: "🟣", label: "Pending Shelter" },
          { dot: "🟢", label: "Verified Shelter" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "0.85rem" }}>{item.dot}</span>
            <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.78rem" }}>{item.label}</span>
          </div>
        ))}
        <div style={{ marginLeft: "auto" }}>
          <span style={{
            background: "rgba(255,120,0,0.12)",
            border: "1px solid rgba(255,120,0,0.3)",
            color: "#ffa500",
            fontSize: "0.73rem",
            padding: "2px 12px",
            borderRadius: "50px",
            fontWeight: "600",
          }}>🗺️ Click map to place shelter</span>
        </div>
      </div>

      {/* ── MAP ── */}
      <main className="flex-1 w-full" style={{ overflow: "hidden", minHeight: "calc(100vh - 140px)" }}>
        <div className="w-full h-full">
          <MapComponent role="ADMIN" />
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;

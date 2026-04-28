import { useNavigate } from "react-router-dom";
import WeatherMumbai from "./WeatherMumbai";
import floodifyLogo from "./floodylogo.png";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* ── Navbar ── */}
      <nav
        className="flex justify-between items-center px-8 py-4 shadow-lg"
        style={{
          background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
          borderBottom: "3px solid #00f5d4",
        }}
      >
        <div className="flex items-center gap-3">
          <span style={{ fontSize: "2rem" }}>🌊</span>
          <h1
            className="text-2xl font-bold cursor-pointer tracking-widest"
            onClick={() => navigate("/")}
            style={{
              background: "linear-gradient(90deg, #00f5d4, #00b4d8, #90e0ef)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "none",
              letterSpacing: "0.15em",
            }}
          >
            FLOODIFY
          </h1>
        </div>
        <button
          onClick={() => navigate("/login")}
          style={{
            background: "linear-gradient(135deg, #00f5d4, #00b4d8)",
            color: "#0f0c29",
            padding: "10px 28px",
            borderRadius: "50px",
            fontWeight: "700",
            fontSize: "0.95rem",
            border: "none",
            cursor: "pointer",
            letterSpacing: "0.05em",
            boxShadow: "0 0 18px rgba(0,245,212,0.45)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 0 28px rgba(0,245,212,0.7)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 0 18px rgba(0,245,212,0.45)";
          }}
        >
          Login
        </button>
      </nav>

      {/* ── Hero Section ── */}
      <section
        className="flex flex-col md:flex-row items-center justify-center px-10 py-20 text-white relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0f0c29 0%, #302b63 40%, #0077b6 100%)",
          minHeight: "420px",
        }}
      >
        {/* decorative circles */}
        <div style={{
          position: "absolute", top: "-80px", right: "-80px",
          width: "350px", height: "350px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,245,212,0.15), transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", left: "-60px",
          width: "280px", height: "280px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,180,216,0.15), transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{
          background: "rgba(255,255,255,0.08)",
          borderRadius: "20px",
          padding: "20px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(0,245,212,0.25)",
          marginBottom: "24px",
          marginRight: "0",
        }} className="md:mb-0 md:mr-10">
          <img
            src={floodifyLogo}
            alt="Floodify Logo"
            className="w-44 h-44 drop-shadow-lg"
            style={{ filter: "drop-shadow(0 0 20px rgba(0,245,212,0.5))" }}
          />
        </div>

        <div className="max-w-xl text-center md:text-left z-10">
          <div style={{
            display: "inline-block",
            background: "rgba(0,245,212,0.15)",
            border: "1px solid rgba(0,245,212,0.4)",
            borderRadius: "50px",
            padding: "4px 18px",
            fontSize: "0.8rem",
            letterSpacing: "0.12em",
            color: "#00f5d4",
            marginBottom: "16px",
            textTransform: "uppercase",
          }}>
            Real-time Monitoring
          </div>
          <h2 className="text-4xl font-extrabold mb-4" style={{
            lineHeight: "1.2",
            background: "linear-gradient(135deg, #ffffff, #90e0ef)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Flood Monitoring & Safety Platform
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
            Floodify allows users to monitor flood-affected areas, report incidents,
            and find nearby shelters and hospitals. Stay informed, stay safe, and
            help authorities manage real-time flood situations effectively.
          </p>
          <div className="flex gap-4 mt-8 flex-wrap justify-center md:justify-start">
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "linear-gradient(135deg, #00f5d4, #00b4d8)",
                color: "#0f0c29",
                padding: "12px 32px",
                borderRadius: "50px",
                fontWeight: "700",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(0,245,212,0.4)",
              }}
            >
              Get Started →
            </button>
            <button
              style={{
                background: "transparent",
                color: "#00f5d4",
                padding: "12px 32px",
                borderRadius: "50px",
                fontWeight: "600",
                border: "2px solid rgba(0,245,212,0.5)",
                cursor: "pointer",
              }}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section style={{
        background: "linear-gradient(90deg, #0077b6, #0096c7, #00b4d8)",
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
        gap: "12px",
      }}>
        {[
          { icon: "🗺️", label: "Live Map Tracking" },
          { icon: "⚡", label: "Instant Alerts" },
          { icon: "🏥", label: "Shelter Finder" },
          { icon: "📊", label: "Real-time Data" },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", color: "white" }}>
            <span style={{ fontSize: "1.4rem" }}>{item.icon}</span>
            <span style={{ fontWeight: "600", letterSpacing: "0.04em" }}>{item.label}</span>
          </div>
        ))}
      </section>

      {/* ── Weather Info ── */}
      <section style={{
        background: "linear-gradient(135deg, #0f0c29 0%, #1a1a2e 100%)",
        padding: "50px 20px",
      }}>
        <h2 style={{
          textAlign: "center",
          fontSize: "1.6rem",
          fontWeight: "700",
          marginBottom: "30px",
          background: "linear-gradient(90deg, #00f5d4, #00b4d8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "0.08em",
        }}>
          🌤 Current Weather Conditions
        </h2>
        <div className="w-full max-w-3xl px-6 mx-auto">
          <WeatherMumbai />
        </div>
      </section>

      {/* ── About Us ── */}
      <section style={{
        background: "linear-gradient(135deg, #302b63, #0f0c29)",
        padding: "70px 20px",
        textAlign: "center",
      }}>
        <div style={{
          display: "inline-block",
          background: "rgba(0,245,212,0.1)",
          border: "1px solid rgba(0,245,212,0.3)",
          borderRadius: "50px",
          padding: "4px 18px",
          fontSize: "0.8rem",
          color: "#00f5d4",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "16px",
        }}>Our Mission</div>
        <h2 style={{
          fontSize: "2rem",
          fontWeight: "800",
          marginBottom: "20px",
          background: "linear-gradient(135deg, #ffffff, #90e0ef)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>About Us</h2>
        <p style={{
          maxWidth: "640px",
          margin: "0 auto",
          lineHeight: "1.9",
          color: "rgba(255,255,255,0.72)",
          fontSize: "1.05rem",
        }}>
          We are a team dedicated to providing real-time flood monitoring solutions
          using modern web technologies. Our mission is to empower citizens and
          authorities with accurate data, ensuring timely decisions and safety
          during floods.
        </p>

        {/* Feature cards */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "24px",
          flexWrap: "wrap",
          marginTop: "50px",
          maxWidth: "900px",
          margin: "50px auto 0",
        }}>
          {[
            { icon: "🌊", title: "Flood Alerts", desc: "Get instant notifications about flood-prone zones near you.", color: "#00f5d4" },
            { icon: "🏕️", title: "Safe Shelters", desc: "Locate verified emergency shelters and relief camps.", color: "#00b4d8" },
            { icon: "🛡️", title: "Admin Control", desc: "Authorities manage, verify and respond to incidents quickly.", color: "#90e0ef" },
          ].map((card, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(10px)",
              border: `1px solid ${card.color}30`,
              borderRadius: "16px",
              padding: "30px 24px",
              minWidth: "220px",
              maxWidth: "260px",
              flex: "1",
              transition: "transform 0.3s",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-6px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "14px" }}>{card.icon}</div>
              <h3 style={{ color: card.color, fontWeight: "700", marginBottom: "10px", fontSize: "1.1rem" }}>{card.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", lineHeight: "1.6" }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: "linear-gradient(135deg, #0f0c29, #302b63)",
        borderTop: "1px solid rgba(0,245,212,0.2)",
        color: "rgba(255,255,255,0.6)",
        textAlign: "center",
        padding: "20px",
        fontSize: "0.9rem",
      }}>
        <span style={{ color: "#00f5d4", fontWeight: "700" }}>Floodify</span> &copy; {new Date().getFullYear()} — All rights reserved.
      </footer>
    </div>
  );
}

export default Home;

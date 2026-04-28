import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../API/api";
import floodbg from "./floodbg.jpeg";

function AdminLogin() {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onLogin = async (data) => {
    try {
      const response = await loginAdmin({
        username: data.username,
        password: data.password,
      });

      if (response.status === 200) {
        sessionStorage.setItem("isAdmin", "true");
        sessionStorage.setItem("adminUser", JSON.stringify(response.data));

        alert(`Welcome Admin!`);
        reset();
        navigate("/admin/dashboard");
      } else {
        alert("Invalid credentials. Try again.");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  const inputStyle = {
    width: "100%",
    marginTop: "8px",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1.5px solid rgba(255,165,0,0.3)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  };

  const labelStyle = {
    color: "rgba(255,255,255,0.75)",
    fontSize: "0.87rem",
    fontWeight: "600",
    letterSpacing: "0.04em",
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundImage: `url(${floodbg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* dark overlay */}
      <div style={{
        position: "fixed", inset: 0,
        background: "linear-gradient(135deg, rgba(20,5,5,0.9) 0%, rgba(80,20,10,0.85) 100%)",
        zIndex: 0,
      }} />

      {/* ── NAVBAR ── */}
      <nav
        className="flex justify-between items-center px-8 py-4 shadow-lg"
        style={{
          background: "linear-gradient(135deg, rgba(20,5,5,0.96), rgba(80,20,10,0.96))",
          borderBottom: "2px solid rgba(255,120,0,0.4)",
          position: "relative", zIndex: 10,
        }}
      >
        <div className="flex items-center gap-3">
          <span style={{ fontSize: "1.8rem" }}>🌊</span>
          <h1
            className="text-2xl font-bold cursor-pointer"
            onClick={() => navigate("/")}
            style={{
              background: "linear-gradient(90deg, #ffa500, #ff6b35)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.15em",
            }}
          >
            FLOODIFY
          </h1>
        </div>
        <span style={{
          background: "rgba(255,100,0,0.2)",
          border: "1px solid rgba(255,100,0,0.4)",
          color: "#ffa500",
          padding: "4px 16px",
          borderRadius: "50px",
          fontSize: "0.78rem",
          letterSpacing: "0.1em",
          fontWeight: "700",
          textTransform: "uppercase",
        }}>
          🛡️ Admin Portal
        </span>
      </nav>

      {/* ── ADMIN LOGIN CARD ── */}
      <div className="flex justify-center items-center flex-grow p-4" style={{ position: "relative", zIndex: 5 }}>
        <div style={{
          width: "100%",
          maxWidth: "420px",
          background: "rgba(20,5,5,0.88)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          border: "1px solid rgba(255,120,0,0.3)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.6), 0 0 50px rgba(255,100,0,0.1)",
          padding: "40px 36px",
        }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{
              width: "72px", height: "72px", borderRadius: "50%",
              background: "linear-gradient(135deg, #ffa500, #ff6b35)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2rem", margin: "0 auto 16px",
              boxShadow: "0 0 30px rgba(255,120,0,0.4)",
            }}>🛡️</div>
            <h2 style={{
              fontSize: "1.7rem", fontWeight: "800",
              background: "linear-gradient(90deg, #ffa500, #ff8c42)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.05em",
            }}>Admin Login</h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.88rem", marginTop: "6px" }}>
              Authorized personnel only
            </p>
          </div>

          {/* Warning banner */}
          <div style={{
            background: "rgba(255,100,0,0.1)",
            border: "1px solid rgba(255,100,0,0.25)",
            borderRadius: "10px",
            padding: "10px 14px",
            marginBottom: "24px",
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            <span>⚠️</span>
            <span style={{ color: "rgba(255,200,100,0.85)", fontSize: "0.82rem" }}>
              Restricted access — Admin credentials required
            </span>
          </div>

          <form onSubmit={handleSubmit(onLogin)} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Username */}
            <div>
              <label style={labelStyle}>Username</label>
              <input
                type="text"
                {...register("username", { required: "Username is required" })}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = "#ffa500"; e.target.style.boxShadow = "0 0 0 3px rgba(255,165,0,0.18)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,165,0,0.3)"; e.target.style.boxShadow = "none"; }}
              />
              {errors.username && (
                <p style={{ color: "#ff6b6b", fontSize: "0.8rem", marginTop: "6px" }}>{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                {...register("password", { required: "Password is required" })}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = "#ffa500"; e.target.style.boxShadow = "0 0 0 3px rgba(255,165,0,0.18)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,165,0,0.3)"; e.target.style.boxShadow = "none"; }}
              />
              {errors.password && (
                <p style={{ color: "#ff6b6b", fontSize: "0.8rem", marginTop: "6px" }}>{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #ffa500, #ff6b35)",
                color: "#1a0500",
                fontWeight: "800",
                fontSize: "1rem",
                cursor: "pointer",
                letterSpacing: "0.08em",
                boxShadow: "0 0 22px rgba(255,120,0,0.4)",
                transition: "transform 0.2s, box-shadow 0.2s",
                marginTop: "4px",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 35px rgba(255,120,0,0.6)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 22px rgba(255,120,0,0.4)"; }}
            >
              Login as Admin
            </button>
          </form>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{
        background: "linear-gradient(135deg, rgba(20,5,5,0.96), rgba(80,20,10,0.96))",
        borderTop: "1px solid rgba(255,100,0,0.2)",
        color: "rgba(255,255,255,0.45)",
        textAlign: "center",
        padding: "16px",
        fontSize: "0.88rem",
        position: "relative", zIndex: 10,
      }}>
        <span style={{ color: "#ffa500", fontWeight: "700" }}>Floodify</span> &copy; {new Date().getFullYear()} — All rights reserved.
      </footer>
    </div>
  );
}

export default AdminLogin;

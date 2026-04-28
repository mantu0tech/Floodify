import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../API/api";
import floodbg from "./floodbg.jpeg";

function Login() {
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  // ---- LOGIN FORM ----
  const { register: loginRegister, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors }, reset: resetLogin } = useForm();

  const onLogin = async (data) => {
    try {
      const res = await loginUser(data);
      resetLogin();
      if (res.data) {
        alert(`Welcome ${res.data.username}!`);
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/map");
      } else {
        alert("User not found. Please register.");
        setShowRegister(true);
      }
    } catch (error) {
      console.error(error);
      alert("Error logging in");
      setShowRegister(true);
    }
  };

  // ---- REGISTRATION FORM ----
  const { register: regRegister, handleSubmit: handleRegSubmit, formState: { errors: regErrors }, reset: resetReg } = useForm();

  const onRegister = async (data) => {
    try {
      const res = await registerUser(data);
      resetReg();
      if (res.data) {
        alert("User registered successfully! Please login.");
        setShowRegister(false);
        navigate("/login");
      } else {
        alert("Registration failed");
      }
    } catch (error) {
      console.error(error);
      alert("Error registering user");
    }
  };

  const inputStyle = {
    width: "100%",
    marginTop: "8px",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1.5px solid rgba(0,245,212,0.3)",
    background: "rgba(255,255,255,0.07)",
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
      {/* overlay */}
      <div style={{
        position: "fixed", inset: 0,
        background: "linear-gradient(135deg, rgba(15,12,41,0.88) 0%, rgba(48,43,99,0.82) 100%)",
        zIndex: 0,
      }} />

      {/* ── NAVBAR ── */}
      <nav
        className="flex justify-between items-center px-8 py-4 shadow-lg"
        style={{
          background: "linear-gradient(135deg, rgba(15,12,41,0.95), rgba(48,43,99,0.95))",
          borderBottom: "2px solid rgba(0,245,212,0.3)",
          position: "relative", zIndex: 10,
        }}
      >
        <div className="flex items-center gap-3">
          <span style={{ fontSize: "1.8rem" }}>🌊</span>
          <h1
            className="text-2xl font-bold cursor-pointer tracking-widest"
            onClick={() => navigate("/")}
            style={{
              background: "linear-gradient(90deg, #00f5d4, #00b4d8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.15em",
            }}
          >
            FLOODIFY
          </h1>
        </div>
      </nav>

      {/* ── LOGIN / REGISTER CARD ── */}
      <div className="flex justify-center items-center flex-grow p-4" style={{ position: "relative", zIndex: 5 }}>
        <div style={{
          width: "100%",
          maxWidth: "440px",
          background: "rgba(15,12,41,0.85)",
          backdropFilter: "blur(20px)",
          borderRadius: "24px",
          border: "1px solid rgba(0,245,212,0.25)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(0,245,212,0.08)",
          padding: "40px 36px",
        }}>
          {!showRegister ? (
            <form onSubmit={handleLoginSubmit(onLogin)} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "8px" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>🔐</div>
                <h2 style={{
                  fontSize: "1.6rem",
                  fontWeight: "800",
                  background: "linear-gradient(90deg, #00f5d4, #00b4d8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "0.05em",
                }}>Welcome Back</h2>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.88rem", marginTop: "4px" }}>Sign in to your Floodify account</p>
              </div>

              {/* Username */}
              <div>
                <label style={labelStyle}>Username</label>
                <input
                  type="text"
                  {...loginRegister("username", { required: "Username is required" })}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = "#00f5d4"; e.target.style.boxShadow = "0 0 0 3px rgba(0,245,212,0.15)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(0,245,212,0.3)"; e.target.style.boxShadow = "none"; }}
                />
                {loginErrors.username && (
                  <p style={{ color: "#ff6b6b", fontSize: "0.8rem", marginTop: "6px" }}>{loginErrors.username.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  {...loginRegister("password", { required: "Password is required" })}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = "#00f5d4"; e.target.style.boxShadow = "0 0 0 3px rgba(0,245,212,0.15)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(0,245,212,0.3)"; e.target.style.boxShadow = "none"; }}
                />
                {loginErrors.password && (
                  <p style={{ color: "#ff6b6b", fontSize: "0.8rem", marginTop: "6px" }}>{loginErrors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #00f5d4, #00b4d8)",
                  color: "#0f0c29",
                  fontWeight: "700",
                  fontSize: "1rem",
                  cursor: "pointer",
                  letterSpacing: "0.05em",
                  boxShadow: "0 0 20px rgba(0,245,212,0.35)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  marginTop: "4px",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(0,245,212,0.55)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(0,245,212,0.35)"; }}
              >
                Login
              </button>

              <p style={{ textAlign: "center", color: "rgba(255,255,255,0.55)", fontSize: "0.9rem" }}>
                Don't have an account?{" "}
                <span
                  style={{ color: "#00f5d4", cursor: "pointer", fontWeight: "600" }}
                  onClick={() => setShowRegister(true)}
                >
                  Register
                </span>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegSubmit(onRegister)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: "4px" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>✨</div>
                <h2 style={{
                  fontSize: "1.6rem",
                  fontWeight: "800",
                  background: "linear-gradient(90deg, #00b4d8, #90e0ef)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>Create Account</h2>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.88rem", marginTop: "4px" }}>Join the Floodify network</p>
              </div>

              {/* Name */}
              <div>
                <label style={labelStyle}>Name</label>
                <input
                  type="text"
                  {...regRegister("name", { required: "Name is required" })}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = "#00b4d8"; e.target.style.boxShadow = "0 0 0 3px rgba(0,180,216,0.15)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(0,245,212,0.3)"; e.target.style.boxShadow = "none"; }}
                />
                {regErrors.name && <p style={{ color: "#ff6b6b", fontSize: "0.8rem", marginTop: "4px" }}>{regErrors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  {...regRegister("email", {
                    required: "Email is required",
                    pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email address" },
                  })}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = "#00b4d8"; e.target.style.boxShadow = "0 0 0 3px rgba(0,180,216,0.15)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(0,245,212,0.3)"; e.target.style.boxShadow = "none"; }}
                />
                {regErrors.email && <p style={{ color: "#ff6b6b", fontSize: "0.8rem", marginTop: "4px" }}>{regErrors.email.message}</p>}
              </div>

              {/* Username */}
              <div>
                <label style={labelStyle}>Username</label>
                <input
                  type="text"
                  {...regRegister("username", { required: "Username is required" })}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = "#00b4d8"; e.target.style.boxShadow = "0 0 0 3px rgba(0,180,216,0.15)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(0,245,212,0.3)"; e.target.style.boxShadow = "none"; }}
                />
                {regErrors.username && <p style={{ color: "#ff6b6b", fontSize: "0.8rem", marginTop: "4px" }}>{regErrors.username.message}</p>}
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  {...regRegister("password", { required: "Password is required" })}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = "#00b4d8"; e.target.style.boxShadow = "0 0 0 3px rgba(0,180,216,0.15)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(0,245,212,0.3)"; e.target.style.boxShadow = "none"; }}
                />
                {regErrors.password && <p style={{ color: "#ff6b6b", fontSize: "0.8rem", marginTop: "4px" }}>{regErrors.password.message}</p>}
              </div>

              {/* Phone Number */}
              <div>
                <label style={labelStyle}>Phone No</label>
                <input
                  type="tel"
                  {...regRegister("phoneNo", {
                    required: "Phone number is required",
                    pattern: { value: /^[0-9]{10}$/, message: "Enter a valid 10-digit phone number" },
                  })}
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = "#00b4d8"; e.target.style.boxShadow = "0 0 0 3px rgba(0,180,216,0.15)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(0,245,212,0.3)"; e.target.style.boxShadow = "none"; }}
                />
                {regErrors.phoneNo && <p style={{ color: "#ff6b6b", fontSize: "0.8rem", marginTop: "4px" }}>{regErrors.phoneNo.message}</p>}
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #00b4d8, #90e0ef)",
                  color: "#0f0c29",
                  fontWeight: "700",
                  fontSize: "1rem",
                  cursor: "pointer",
                  boxShadow: "0 0 20px rgba(0,180,216,0.35)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  marginTop: "4px",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 0 30px rgba(0,180,216,0.55)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 0 20px rgba(0,180,216,0.35)"; }}
              >
                Register
              </button>

              <p style={{ textAlign: "center", color: "rgba(255,255,255,0.55)", fontSize: "0.9rem" }}>
                Already have an account?{" "}
                <span
                  style={{ color: "#00f5d4", cursor: "pointer", fontWeight: "600" }}
                  onClick={() => setShowRegister(false)}
                >
                  Login
                </span>
              </p>
            </form>
          )}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{
        background: "linear-gradient(135deg, rgba(15,12,41,0.95), rgba(48,43,99,0.95))",
        borderTop: "1px solid rgba(0,245,212,0.2)",
        color: "rgba(255,255,255,0.5)",
        textAlign: "center",
        padding: "16px",
        fontSize: "0.88rem",
        position: "relative", zIndex: 10,
      }}>
        <span style={{ color: "#00f5d4", fontWeight: "700" }}>Floodify</span> &copy; {new Date().getFullYear()} — All rights reserved.
      </footer>
    </div>
  );
}

export default Login;

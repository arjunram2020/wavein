"use client";
import { useEffect } from "react";
import Logo from "./Logo";

// Role-aware login modal. Does not authenticate yet — `onEnter` just routes to
// the organizer dashboard or fan view based on `role`.
const COPY = {
  organizer: { title: "Organizer sign in", sub: "Access the Event Command Center", cta: "Enter Command Center" },
  fan: { title: "Welcome to WaveIn", sub: "Find your wave for WC26", cta: "Continue to my wave" },
};

const inputStyle = {
  width: "100%", padding: "13px 15px", borderRadius: 11, background: "rgba(255,255,255,.04)",
  border: "1px solid rgba(255,255,255,.12)", color: "var(--text)", fontFamily: "inherit",
  fontSize: 15, outline: "none",
};
const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: "var(--muted-1)", marginBottom: 7 };

export default function LoginModal({ role = "organizer", onClose, onEnter }) {
  const copy = COPY[role] || COPY.organizer;

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = (e) => { e.preventDefault(); onEnter(role); };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, background: "rgba(6,10,18,.74)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
        animation: "fadeIn .3s ease",
      }}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        style={{
          width: "100%", maxWidth: 430, background: "linear-gradient(180deg,#141F36,#0E1729)",
          border: "1px solid rgba(255,255,255,.1)", borderRadius: 22, padding: 34,
          boxShadow: "0 40px 100px rgba(0,0,0,.6)", animation: "modalIn .45s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <div style={{ marginBottom: 22 }}>
          <Logo idSuffix="modal" wordmarkSize={19} />
        </div>
        <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: 30, margin: 0, letterSpacing: "-.3px", color: "var(--text-bright)" }}>
          {copy.title}
        </h3>
        <p style={{ margin: "6px 0 24px", color: "var(--muted-2)", fontSize: 14.5 }}>{copy.sub}</p>

        <label style={labelStyle}>Email</label>
        <input type="email" placeholder="you@email.com" style={{ ...inputStyle, marginBottom: 16 }} />

        <label style={labelStyle}>Password</label>
        <input type="password" placeholder="••••••••" style={{ ...inputStyle, marginBottom: 24 }} />

        <button
          type="submit"
          style={{
            width: "100%", padding: 15, borderRadius: 12, border: "none", cursor: "pointer",
            fontFamily: "inherit", fontSize: 16, fontWeight: 700, color: "#1A1206",
            background: "linear-gradient(180deg,#F0C572,#E0A24A)", boxShadow: "0 10px 26px rgba(224,162,74,.3)",
          }}
        >
          {copy.cta}
        </button>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 13.5, color: "#7E8AA0" }}>
          New here? <span style={{ color: "var(--gold)", cursor: "pointer", fontWeight: 600 }}>Create an account</span>
        </div>
      </form>
    </div>
  );
}

"use client";
import { useState } from "react";
import { ORIGINS, TRANSPORTS, EVENT, MAPS_URL } from "@/lib/data";
import { computeWave } from "@/lib/waveLogic";

function Dropdown({ label, placeholder, options, value, open, setOpen, onSelect }) {
  const selected = options.find((o) => o.id === value);
  return (
    <div style={{ position: "relative" }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#c9c9d8" }}>{label}</label>
      <div
        onClick={() => setOpen(!open)}
        style={{
          marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "13px 15px", background: "#0d0d14",
          border: `1px solid ${open ? "#00ff87" : "#1e1e2e"}`, borderRadius: 10,
          cursor: "pointer", fontSize: 14, color: selected ? "#fff" : "#5a5a72",
          transition: "border-color 0.15s",
        }}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <span style={{ color: "#8888aa", fontSize: 11 }}>▼</span>
      </div>
      {open && (
        <div
          style={{
            position: "absolute", left: 0, right: 0, top: "100%", marginTop: 6, zIndex: 20,
            background: "#0d0d14", border: "1px solid #1e2e24", borderRadius: 10,
            overflow: "hidden", boxShadow: "0 12px 30px rgba(0,0,0,0.6)",
          }}
        >
          {options.map((o) => (
            <div
              key={o.id}
              onClick={() => onSelect(o.id)}
              style={{ padding: "11px 15px", fontSize: 14, cursor: "pointer", color: "#e6e6f0", borderBottom: "1px solid #15151f" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,255,135,0.08)"; e.currentTarget.style.color = "#00ff87"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#e6e6f0"; }}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FanView() {
  const [origin, setOrigin] = useState(null);
  const [transport, setTransport] = useState(null);
  const [originOpen, setOriginOpen] = useState(false);
  const [transportOpen, setTransportOpen] = useState(false);
  const [result, setResult] = useState(null);

  const canSubmit = !!(origin && transport);

  const reset = () => { setResult(null); };

  const badgeStyle = (r) => ({
    display: "inline-block", padding: "14px 26px", borderRadius: 12,
    border: `2px solid ${r.color}`, color: r.color, fontSize: 24, fontWeight: 700,
    letterSpacing: "0.04em", textTransform: "uppercase", background: `${r.color}1a`,
    boxShadow: `0 0 24px ${r.color}55`, textShadow: `0 0 14px ${r.color}99`,
    animation: r.priority ? "wiPulse 2s ease-in-out infinite" : "none",
  });

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ width: "100%", maxWidth: 480, background: "#111118", border: "1px solid #1e2e24", borderRadius: 16, padding: 30, boxShadow: "0 0 40px rgba(0,255,135,0.08)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 999, background: "rgba(0,255,135,0.12)", border: "1px solid rgba(0,255,135,0.3)", color: "#00ff87", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", marginBottom: 16 }}>
          ⚽ WC26 ATLANTA
        </div>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>Find Your Wave</h1>
        <div style={{ fontSize: 13, color: "#8888aa", marginTop: 6 }}>
          {EVENT.label} · {EVENT.date} · {EVENT.kickoff}
        </div>

        <div style={{ marginTop: 26 }}>
          <Dropdown
            label="Where are you coming from?"
            placeholder="Select your origin"
            options={ORIGINS}
            value={origin}
            open={originOpen}
            setOpen={(v) => { setOriginOpen(v); setTransportOpen(false); }}
            onSelect={(id) => { setOrigin(id); setOriginOpen(false); setResult(null); }}
          />
        </div>

        <div style={{ marginTop: 18 }}>
          <Dropdown
            label="How are you getting here?"
            placeholder="Select your transport"
            options={TRANSPORTS}
            value={transport}
            open={transportOpen}
            setOpen={(v) => { setTransportOpen(v); setOriginOpen(false); }}
            onSelect={(id) => { setTransport(id); setTransportOpen(false); setResult(null); }}
          />
        </div>

        {!result && (
          <button
            onClick={() => { if (canSubmit) setResult(computeWave(origin, transport)); }}
            disabled={!canSubmit}
            style={{
              marginTop: 26, width: "100%", padding: 15, border: "none", borderRadius: 10,
              fontSize: 15, fontWeight: 700, transition: "transform 0.15s, box-shadow 0.15s",
              ...(canSubmit
                ? { background: "#00ff87", color: "#000", cursor: "pointer", boxShadow: "0 0 20px rgba(0,255,135,0.4)" }
                : { background: "#1a1a26", color: "#5a5a72", cursor: "not-allowed" }),
            }}
            onMouseEnter={(e) => { if (canSubmit) { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 0 28px rgba(0,255,135,0.6)"; } }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = canSubmit ? "0 0 20px rgba(0,255,135,0.4)" : "none"; }}
          >
            Get My Wave →
          </button>
        )}

        {result && (
          <div style={{ marginTop: 24, borderTop: "1px solid #1e1e2e", paddingTop: 24, animation: "wiSlideUp 0.45s ease" }}>
            <div style={{ textAlign: "center" }}>
              <div style={badgeStyle(result)}>{result.title}</div>
            </div>

            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 15 }}>
                <span style={{ fontSize: 20 }}>🕔</span>
                <span>Arrive <strong>{result.window}</strong></span>
              </div>

              {result.transitBonus && (
                <div style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 7, padding: "6px 12px", borderRadius: 999, background: "rgba(0,255,135,0.12)", border: "1px solid rgba(0,255,135,0.35)", color: "#00ff87", fontSize: 13, fontWeight: 600 }}>
                  🌱 Transit Bonus Applied
                </div>
              )}

              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 15 }}>
                <span style={{ fontSize: 20 }}>🎁</span>
                <span><span style={{ color: "#8888aa" }}>Your Reward:</span><br /><strong>{result.reward}</strong></span>
              </div>
            </div>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginTop: 20, display: "block", textAlign: "center", textDecoration: "none", width: "100%", padding: 15, background: "#00ff87", color: "#000", fontWeight: 700, fontSize: 15, borderRadius: 10, boxShadow: "0 0 22px rgba(0,255,135,0.45)" }}
            >
              Get Directions →
            </a>

            <div
              onClick={reset}
              style={{ marginTop: 14, textAlign: "center", fontSize: 13, color: "#8888aa", cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#8888aa")}
            >
              ← Try different options
            </div>

            <div style={{ marginTop: 18, fontSize: 12, color: "#5a5a72", lineHeight: 1.6, textAlign: "center" }}>
              💡 Arriving during your wave earns maximum rewards and guarantees express entry.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

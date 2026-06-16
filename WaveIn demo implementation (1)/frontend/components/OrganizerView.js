"use client";
import { useState } from "react";
import { useCountUp, fmt } from "@/lib/useCountUp";
import { generateChart } from "@/lib/waveLogic";
import { deriveCounters } from "@/lib/logistics";
import ArrivalChart from "./ArrivalChart";

const card = {
  background: "#111118", border: "1px solid #1e1e2e", borderRadius: 12,
  padding: 20, boxShadow: "0 0 20px rgba(0,255,135,0.05)",
};
const cardLabel = { fontSize: 11, fontWeight: 600, letterSpacing: "0.13em", color: "#8888aa" };
const colHead = { fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "#8888aa", padding: "0 8px 10px" };
const input = {
  width: "100%", background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 8,
  padding: "9px 12px", fontSize: 13, color: "#fff", outline: "none", boxSizing: "border-box",
};

const CATEGORIES_ORDER = ["WC26", "Falcons", "Atlanta United", "SEC Championship", "Concert", "Dragon Con"];
const CATEGORY_EMOJIS = { "WC26": "⚽", "Falcons": "🏈", "Atlanta United": "⚽", "SEC Championship": "🏈", "Concert": "🎤", "Dragon Con": "🐉" };
const W1 = "#00ff87", W2 = "#ffd23f", W3 = "#ff9500", W4 = "#ff4444";

function StatCard({ label, icon, value, sub, valueColor, glow }) {
  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={cardLabel}>{label}</span>
        <span style={{ fontSize: 20 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 38, fontWeight: 700, marginTop: 10, lineHeight: 1, color: valueColor || "#fff", textShadow: glow ? `0 0 12px ${glow}` : "none" }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: "#8888aa", marginTop: 8 }}>{sub}</div>
    </div>
  );
}

// Small mono "ƒ(x)" chip that shows how a metric is computed, under its value.
function Formula({ color, children }) {
  return (
    <div style={{
      marginTop: 8, padding: "6px 9px", borderRadius: 6,
      background: "rgba(255,255,255,0.03)", border: "1px solid #1e1e2e",
      display: "flex", gap: 7, alignItems: "flex-start",
    }}>
      <span style={{ color, fontWeight: 700, fontStyle: "italic", fontSize: 12, lineHeight: 1.5, flex: "none" }}>ƒ</span>
      <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 10.5, lineHeight: 1.5, color: "#9a9ab0" }}>
        {children}
      </span>
    </div>
  );
}

// ─── Event selector dropdown ──────────────────────────────────────────────────
function EventSelector({ events, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ev = events.find((e) => e.id === selected);
  const categories = CATEGORIES_ORDER.filter((c) => events.some((e) => e.category === c));
  events.forEach((e) => { if (!categories.includes(e.category)) categories.push(e.category); });

  return (
    <div style={{ position: "relative" }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: 10, padding: "9px 14px",
          background: "#0d0d14", border: `1px solid ${open ? "#00ff87" : "#1e1e2e"}`,
          borderRadius: 10, cursor: "pointer", transition: "border-color 0.15s", minWidth: 280,
        }}
      >
        <span style={{ fontSize: 16 }}>{ev?.emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{ev?.label}</div>
          <div style={{ fontSize: 11, color: "#8888aa" }}>{ev?.date} · {ev?.kickoff}</div>
        </div>
        <span style={{ color: "#5a5a72", fontSize: 11 }}>▼</span>
      </div>
      {open && (
        <div style={{
          position: "absolute", right: 0, top: "calc(100% + 6px)", zIndex: 30, minWidth: 320,
          background: "#0d0d14", border: "1px solid #1e2e24", borderRadius: 12,
          overflow: "hidden", boxShadow: "0 12px 40px rgba(0,0,0,0.7)", maxHeight: 380, overflowY: "auto",
        }}>
          {categories.map((cat) => (
            <div key={cat}>
              <div style={{ padding: "8px 14px 4px", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#5a5a72", textTransform: "uppercase", background: "#0a0a12" }}>
                {cat}
              </div>
              {events.filter((e) => e.category === cat).map((e) => (
                <div
                  key={e.id}
                  onClick={() => { onChange(e.id); setOpen(false); }}
                  style={{ padding: "9px 14px", cursor: "pointer", borderTop: "1px solid #15151f", display: "flex", alignItems: "center", gap: 10 }}
                  onMouseEnter={(el) => { el.currentTarget.style.background = "rgba(0,255,135,0.07)"; }}
                  onMouseLeave={(el) => { el.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ fontSize: 15 }}>{e.emoji}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: e.id === selected ? 700 : 400, color: e.id === selected ? "#00ff87" : "#e6e6f0" }}>{e.label}</div>
                    <div style={{ fontSize: 11, color: "#5a5a72" }}>{e.date} · {e.kickoff}</div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Create Event slide-over ──────────────────────────────────────────────────
const BLANK_WAVE = (n, dot) => ({
  name: `Wave ${n}`, dot,
  window: "", zones: "", transport: "", reward: "", fans: "",
});

function CreateEventPanel({ onSave, onClose }) {
  const [details, setDetails] = useState({
    label: "", category: "WC26", emoji: "⚽", date: "", kickoff: "", totalFans: "",
  });
  const [waves, setWaves] = useState([
    BLANK_WAVE(1, W1), BLANK_WAVE(2, W2), BLANK_WAVE(3, W3), BLANK_WAVE(4, W4),
  ]);
  const [error, setError] = useState("");

  const setDetail = (k, v) => setDetails((d) => ({ ...d, [k]: v }));
  const setWave = (i, k, v) => setWaves((ws) => ws.map((w, idx) => idx === i ? { ...w, [k]: v } : w));

  const handleSave = () => {
    if (!details.label || !details.date || !details.kickoff || !details.totalFans) {
      setError("Please fill in all event details."); return;
    }
    if (waves.some((w) => !w.window || !w.zones)) {
      setError("Each wave needs at least a time window and zones."); return;
    }
    const fans = parseInt(details.totalFans.replace(/,/g, ""), 10);
    const id = `custom-${Date.now()}`;
    onSave({
      id,
      category: details.category,
      emoji: details.emoji || CATEGORY_EMOJIS[details.category] || "📅",
      label: details.label,
      date: details.date,
      kickoff: details.kickoff,
      totalFans: fans.toLocaleString(),
      // Counters are derived from the wave table itself — per-wave fan counts,
      // transport modes, and real zone→stadium distances — not from attendance
      // multipliers. See lib/logistics.js.
      counters: deriveCounters(waves),
      waveTable: waves,
      chart: generateChart(details.kickoff, fans),
    });
    onClose();
  };

  const fieldStyle = { ...input, marginTop: 6 };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100, display: "flex", justifyContent: "flex-end",
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
    }}>
      <div style={{
        width: "min(600px, 100vw)", height: "100vh", background: "#0e0e16",
        borderLeft: "1px solid #1e2e24", overflowY: "auto", display: "flex", flexDirection: "column",
        animation: "wiSlideRight 0.3s ease",
      }}>
        {/* Header */}
        <div style={{ padding: "22px 28px 18px", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#0e0e16", zIndex: 10 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#00ff87", marginBottom: 4 }}>NEW EVENT</div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Create Event</h2>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#8888aa", fontSize: 22, cursor: "pointer", padding: 4 }}>✕</button>
        </div>

        <div style={{ padding: "24px 28px", flex: 1 }}>
          {/* ── Event details ── */}
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: "#8888aa", textTransform: "uppercase", marginBottom: 14 }}>Event Details</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 12, color: "#8888aa" }}>Event Name *</label>
              <input style={fieldStyle} placeholder="e.g. Falcons vs Cowboys" value={details.label} onChange={(e) => setDetail("label", e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#8888aa" }}>Category *</label>
              <select
                style={{ ...fieldStyle, appearance: "none" }}
                value={details.category}
                onChange={(e) => {
                  setDetail("category", e.target.value);
                  setDetail("emoji", CATEGORY_EMOJIS[e.target.value] || "📅");
                }}
              >
                {CATEGORIES_ORDER.map((c) => <option key={c} value={c}>{c}</option>)}
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#8888aa" }}>Emoji</label>
              <input style={fieldStyle} placeholder="⚽" value={details.emoji} onChange={(e) => setDetail("emoji", e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#8888aa" }}>Date *</label>
              <input style={fieldStyle} placeholder="Sep 13, 2026" value={details.date} onChange={(e) => setDetail("date", e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#8888aa" }}>Kickoff / Show Time *</label>
              <input style={fieldStyle} placeholder="7:00pm KO" value={details.kickoff} onChange={(e) => setDetail("kickoff", e.target.value)} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 12, color: "#8888aa" }}>Expected Attendance *</label>
              <input style={fieldStyle} placeholder="72,000" value={details.totalFans} onChange={(e) => setDetail("totalFans", e.target.value)} />
            </div>
          </div>

          {/* ── Wave table ── */}
          <div style={{ borderTop: "1px solid #1e1e2e", margin: "28px 0 18px" }} />
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: "#8888aa", textTransform: "uppercase", marginBottom: 4 }}>Wave Configuration</div>
          <div style={{ fontSize: 12, color: "#5a5a72", marginBottom: 16 }}>Set the arrival window, zones, transport type, and reward for each wave.</div>

          {waves.map((w, i) => (
            <div key={i} style={{ marginBottom: 20, padding: 16, background: "#111118", borderRadius: 10, borderLeft: `3px solid ${w.dot}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ width: 12, height: 12, borderRadius: "50%", background: w.dot, boxShadow: `0 0 6px ${w.dot}99`, flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{w.name}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 11, color: "#8888aa" }}>Time Window *</label>
                  <input style={fieldStyle} placeholder="4:30 – 5:15pm" value={w.window} onChange={(e) => setWave(i, "window", e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "#8888aa" }}>Zones *</label>
                  <input style={fieldStyle} placeholder="Airport, Downtown" value={w.zones} onChange={(e) => setWave(i, "zones", e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "#8888aa" }}>Transport Mode</label>
                  <input style={fieldStyle} placeholder="MARTA Priority" value={w.transport} onChange={(e) => setWave(i, "transport", e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "#8888aa" }}>Reward</label>
                  <input style={fieldStyle} placeholder="Free drink + Priority Gate" value={w.reward} onChange={(e) => setWave(i, "reward", e.target.value)} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 11, color: "#8888aa" }}>Estimated Fans</label>
                  <input style={fieldStyle} placeholder="5,200" value={w.fans} onChange={(e) => setWave(i, "fans", e.target.value)} />
                </div>
              </div>
            </div>
          ))}

          {error && <div style={{ fontSize: 13, color: "#ff4444", marginBottom: 12 }}>{error}</div>}
        </div>

        {/* Footer */}
        <div style={{ padding: "18px 28px", borderTop: "1px solid #1e1e2e", display: "flex", gap: 12, position: "sticky", bottom: 0, background: "#0e0e16" }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: 13, background: "none", border: "1px solid #1e1e2e", borderRadius: 10, color: "#8888aa", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{ flex: 2, padding: 13, background: "#00ff87", border: "none", borderRadius: 10, color: "#000", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 0 18px rgba(0,255,135,0.35)" }}
          >
            Create Event →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────
export default function OrganizerView({ events, onCreateEvent }) {
  const [selectedId, setSelectedId] = useState(events[0]?.id);
  const [showCreate, setShowCreate] = useState(false);

  const ev = events.find((e) => e.id === selectedId) || events[0];
  const { counters, waveTable, chart } = ev;

  const co2 = useCountUp(counters.co2Target, 20000, { min: 2, max: 8, minMs: 2000, maxMs: 3000 });
  const marta = useCountUp(counters.martaTarget, 25000, { min: 1, max: 1, minMs: 4000, maxMs: 6000 });
  const co2Pct = Math.min((co2 / counters.co2Ceiling) * 100, 100).toFixed(1) + "%";
  const martaPct = Math.min((marta / counters.martaCeiling) * 100, 100).toFixed(1) + "%";

  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "28px 28px 56px" }}>
      {showCreate && (
        <CreateEventPanel
          onSave={(newEv) => { onCreateEvent(newEv); setSelectedId(newEv.id); }}
          onClose={() => setShowCreate(false)}
        />
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ margin: 0, fontSize: 34, fontWeight: 700 }}>Event Command Center</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <EventSelector events={events} selected={selectedId} onChange={setSelectedId} />
          <button
            onClick={() => setShowCreate(true)}
            style={{
              padding: "9px 16px", background: "rgba(0,255,135,0.1)", border: "1px solid rgba(0,255,135,0.35)",
              borderRadius: 10, color: "#00ff87", fontSize: 13, fontWeight: 700, cursor: "pointer",
              whiteSpace: "nowrap", transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,255,135,0.18)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,255,135,0.1)"; }}
          >
            + New Event
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", border: "1px solid #1e1e2e", borderRadius: 999, background: "#111118" }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#00ff87", boxShadow: "0 0 10px rgba(0,255,135,0.8)", animation: "wiBlink 1.6s ease-in-out infinite" }} />
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", color: "#00ff87" }}>LIVE</span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 18 }}>
        <StatCard label="TOTAL FANS" icon="👥" value={ev.totalFans} sub={`${ev.label} · ${ev.date}`} />
        <StatCard label="ACTIVE WAVES" icon="🌊" value="4" sub="Waves 1–4 operational" />
        <StatCard label="CO₂ SAVED" icon="🌱" value={fmt(co2)} sub="kg this event" valueColor="#00ff87" glow="rgba(0,255,135,0.6)" />
        <StatCard label="CAR → MARTA SHIFTS" icon="🚇" value={fmt(marta)} sub="fans rerouted to transit" valueColor="#00c4ff" glow="rgba(0,196,255,0.5)" />
      </div>

      {/* Chart */}
      <div style={{ ...card, padding: "22px 22px 14px", marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 6 }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>
            Arrival Distribution — {ev.label}, {ev.date} · {ev.kickoff}
          </h2>
          <div style={{ display: "flex", gap: 18 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#8888aa" }}>
              <span style={{ width: 14, height: 3, borderRadius: 2, background: "#ff4444", display: "inline-block" }} />
              Without WaveIn
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#8888aa" }}>
              <span style={{ width: 14, height: 3, borderRadius: 2, background: "#00ff87", display: "inline-block" }} />
              With WaveIn
            </span>
          </div>
        </div>
        <ArrivalChart chart={chart} />
      </div>

      {/* Wave table + sustainability */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 18, alignItems: "start" }}>
        <div style={{ ...card, overflow: "hidden" }}>
          <h2 style={{ margin: "0 0 14px", fontSize: 17, fontWeight: 600 }}>Wave Assignments — Active</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.2fr 1.5fr 1.4fr 1.7fr 0.8fr", fontSize: 13 }}>
            <div style={colHead}>WAVE</div>
            <div style={colHead}>WINDOW</div>
            <div style={colHead}>ZONES</div>
            <div style={colHead}>TRANSPORT</div>
            <div style={colHead}>REWARD</div>
            <div style={{ ...colHead, textAlign: "right" }}>FANS</div>

            {waveTable.map((w, i) => {
              const rowBg = i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)";
              const cellBase = { padding: "13px 8px", borderTop: "1px solid #1e1e2e", background: rowBg, color: "#c9c9d8", display: "flex", alignItems: "center" };
              return (
                <div key={w.name} style={{ display: "contents" }}>
                  <div style={{ ...cellBase, color: "#fff" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 14, height: 14, borderRadius: "50%", flex: "none", background: w.dot, boxShadow: `0 0 8px ${w.dot}99` }} />
                      <span style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{w.name}</span>
                    </span>
                  </div>
                  <div style={cellBase}>{w.window}</div>
                  <div style={cellBase}>{w.zones}</div>
                  <div style={cellBase}>{w.transport}</div>
                  <div style={cellBase}>{w.reward}</div>
                  <div style={{ ...cellBase, justifyContent: "flex-end", fontWeight: 600, color: "#fff" }}>{w.fans}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ ...card, borderLeft: "4px solid #00ff87", boxShadow: "0 0 20px rgba(0,255,135,0.06)" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: "#00ff87", textShadow: "0 0 10px rgba(0,255,135,0.4)", marginBottom: 18 }}>
            🌱 SUSTAINABILITY IMPACT
          </div>

          <div style={{ fontSize: 11, letterSpacing: "0.08em", color: "#8888aa", textTransform: "uppercase" }}>CO₂ Saved This Event</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: "#00ff87", textShadow: "0 0 12px rgba(0,255,135,0.6)", margin: "2px 0 8px" }}>
            {fmt(co2)} <span style={{ fontSize: 15, color: "#8888aa", textShadow: "none", fontWeight: 500 }}>kg</span>
          </div>
          <div style={{ height: 7, borderRadius: 4, background: "#1e1e2e", overflow: "hidden" }}>
            <div style={{ height: "100%", background: "#00ff87", boxShadow: "0 0 10px rgba(0,255,135,0.6)", transition: "width 0.6s ease", width: co2Pct }} />
          </div>
          <Formula color="#00ff87">
            Σ (MARTA-wave fans × round-trip × zone distance km × 0.21 kg/km ÷ 2.0 per car)
          </Formula>

          <div style={{ fontSize: 11, letterSpacing: "0.08em", color: "#8888aa", textTransform: "uppercase", marginTop: 18 }}>Car → MARTA Shifts</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#00c4ff", textShadow: "0 0 10px rgba(0,196,255,0.5)", margin: "2px 0 8px" }}>
            {fmt(marta)} <span style={{ fontSize: 13, color: "#8888aa", textShadow: "none", fontWeight: 500 }}>fans</span>
          </div>
          <div style={{ height: 5, borderRadius: 4, background: "#1e1e2e", overflow: "hidden" }}>
            <div style={{ height: "100%", background: "#00c4ff", boxShadow: "0 0 8px rgba(0,196,255,0.5)", transition: "width 0.6s ease", width: martaPct }} />
          </div>
          <Formula color="#00c4ff">
            Σ fans in MARTA-mode waves &nbsp;·&nbsp; vs. ceiling = all fans within MARTA rail range (≤ 23 km)
          </Formula>

          <div style={{ borderTop: "1px dashed #1e1e2e", margin: "20px 0" }} />

          <div style={{ fontSize: 11, letterSpacing: "0.08em", color: "#8888aa", textTransform: "uppercase" }}>Projected: Full Season</div>
          <div style={{ fontSize: 20, fontWeight: 700, margin: "3px 0 14px" }}>
            408,000 kg <span style={{ fontSize: 13, color: "#8888aa", fontWeight: 500 }}>CO₂ eliminated</span>
          </div>

          <div style={{ fontSize: 12, color: "#8888aa", marginBottom: 8 }}>Equivalent to:</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}><span style={{ fontSize: 17 }}>🌳</span><span><strong style={{ color: "#fff" }}>2,190</strong> trees planted</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}><span style={{ fontSize: 17 }}>🚗</span><span><strong style={{ color: "#fff" }}>89</strong> cars removed for a year</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14 }}><span style={{ fontSize: 17 }}>✈️</span><span><strong style={{ color: "#fff" }}>51</strong> transatlantic flights offset</span></div>
          </div>

          <div style={{ borderTop: "1px dashed #1e1e2e", margin: "18px 0 12px" }} />
          <div style={{ fontSize: 11, lineHeight: 1.6, color: "#5a5a72" }}>
            Methodology: counters derived from each wave&apos;s fan count, transport mode, and real
            driving distance to Mercedes-Benz Stadium (Google Maps). Emissions: EPA avg car 0.21 kg CO₂/km ·
            round trip · 2.0 occupancy.
          </div>
        </div>
      </div>
    </div>
  );
}

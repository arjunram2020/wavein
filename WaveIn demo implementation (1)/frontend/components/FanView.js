"use client";
import { useMemo, useState, useEffect, useRef } from "react";
import { EVENTS, ORIGINS, TRANSPORTS, MAPS_URL } from "@/lib/data";
import { computeWave, parseTime, formatTime } from "@/lib/waveLogic";
import Reveal from "./Reveal";

const serif = "var(--font-serif)";

// Design wave→accent mapping for the result card (see handoff).
const RESULT_COLORS = { 1: "#5BD6A0", 2: "#7FD8C0", 3: "#E8B45A", 4: "#D99A4E" };
const GATES = { 1: "Gate A · Priority Lane", 2: "Gate B", 3: "Gate C", 4: "Gate D" };
// Transport sub-labels keyed by lib id.
const TRANSPORT_SUB = {
  "marta-train": "Cleanest — priority waves",
  "marta-bus": "Transit — earns the bonus",
  driving: "Personal vehicle",
  rideshare: "Uber / Lyft",
};

const labelStyle = { display: "block", fontSize: 13, fontWeight: 700, color: "var(--muted-1)", marginBottom: 8 };
const fieldStyle = {
  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
  padding: "14px 16px", borderRadius: 13, background: "rgba(255,255,255,.04)",
  border: "1px solid rgba(255,255,255,.1)", cursor: "pointer", fontFamily: "inherit", fontSize: 14.5,
  color: "var(--text)",
};
const menuStyle = {
  position: "absolute", top: "100%", left: 0, right: 0, marginTop: 8, background: "#1A2840",
  border: "1px solid rgba(255,255,255,.14)", borderRadius: 13, padding: 6,
  boxShadow: "0 24px 60px rgba(0,0,0,.6)", maxHeight: 260, overflow: "auto", animation: "modalIn .22s ease",
};

function Confetti() {
  const bits = [
    { left: "12%", w: 9, h: 9, bg: "#E8B45A", r: 2, dur: 2.4, delay: 0 },
    { left: "28%", w: 8, h: 8, bg: "#5BD6A0", r: "50%", dur: 2.8, delay: 0.3 },
    { left: "46%", w: 10, h: 6, bg: "#6FA0E0", r: 0, dur: 2.6, delay: 0.15 },
    { left: "64%", w: 9, h: 9, bg: "#F0C572", r: 2, dur: 3, delay: 0.45 },
    { left: "80%", w: 8, h: 8, bg: "#5BD6A0", r: "50%", dur: 2.5, delay: 0.2 },
    { left: "90%", w: 7, h: 7, bg: "#E8B45A", r: 2, dur: 2.9, delay: 0.6 },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", borderRadius: 24 }}>
      {bits.map((b, i) => (
        <span key={i} style={{ position: "absolute", left: b.left, top: 0, width: b.w, height: b.h, background: b.bg, borderRadius: b.r, animation: `confettiFall ${b.dur}s ease-in ${b.delay}s infinite` }} />
      ))}
    </div>
  );
}

export default function FanView({ events = EVENTS, onFanSubmit }) {
  const [selectedId, setSelectedId] = useState(events[0]?.id);
  const [origin, setOrigin] = useState(null);
  const [transport, setTransport] = useState(null);
  const [time, setTime] = useState(null); // minutes from midnight
  const [openDD, setOpenDD] = useState(""); // 'event' | 'origin' | 'transport' | ''
  const [result, setResult] = useState(null);
  const ddRef = useRef(null);

  // Close any open dropdown when clicking outside the dropdown column.
  useEffect(() => {
    if (!openDD) return;
    const onDown = (e) => { if (ddRef.current && !ddRef.current.contains(e.target)) setOpenDD(""); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [openDD]);

  const EVENT = events.find((e) => e.id === selectedId) || events[0];

  // Arrival slots span doors-open → last wave window. Doors-open is the event's
  // explicit field when set; otherwise it's inferred from the first wave start.
  // (Window starts inherit the window's am/pm so evening events aren't read as AM.)
  const slots = useMemo(() => {
    const wt = EVENT.waveTable;
    const meridiem = (t) => (/pm/i.test(t) ? "pm" : /am/i.test(t) ? "am" : "");
    const startMin = (w) => { const [s, e] = w.window.split(" – "); return parseTime(/am|pm/i.test(s) ? s : s + meridiem(e)); };
    const endMin = (w) => parseTime(w.window.split(" – ")[1]);
    const inferredLo = Math.min(...wt.map(startMin));
    const lo = EVENT.doorsOpen ? parseTime(EVENT.doorsOpen) : inferredLo;
    const hi = Math.max(...wt.map(endMin));
    const out = [];
    for (let m = lo; m <= hi; m += 15) out.push({ value: m, label: formatTime(m) });
    return out;
  }, [EVENT]);

  const doorsOpen = slots[0]?.label?.replace(/(am|pm)$/, "") ?? "";
  const canSubmit = !!(origin && transport && time !== null);
  const originLabel = ORIGINS.find((o) => o.id === origin)?.label;
  const transportLabel = TRANSPORTS.find((t) => t.id === transport)?.label;

  const submit = () => {
    if (!canSubmit) return;
    const r = computeWave(origin, transport, time, EVENT.waveTable);
    const label = r.priority ? "PRIORITY" : r.wave <= 2 ? "EARLY" : "STANDARD";
    setResult({
      wave: r.wave,
      label,
      window: r.window,
      color: RESULT_COLORS[r.wave] || "#5BD6A0",
      transit: r.transitBonus,
      reward: r.reward,
      gate: GATES[r.wave] || "Gate",
    });
    // Record this fan's response so the Organizer chart reflects real
    // submissions: red = their earliest time, green = assigned wave.
    onFanSubmit?.(EVENT.id, { earliestArrivalMin: time, assignedWindow: r.window });
  };

  const wrap = {
    position: "relative", zIndex: 1, minHeight: "calc(100vh - 70px)",
    padding: "clamp(28px,5vw,60px) clamp(18px,4vw,40px) 80px",
    display: "flex", alignItems: "flex-start", justifyContent: "center",
  };
  const glow = { position: "absolute", inset: 0, background: "radial-gradient(70% 50% at 50% 0%,rgba(224,162,74,.14),transparent 65%)", pointerEvents: "none" };

  if (result) {
    const rc = result.color;
    return (
      <div style={wrap}>
        <div style={glow} />
        <div style={{ position: "relative", width: "100%", maxWidth: 520 }}>
          <Confetti />
          <div style={{ position: "relative", background: "linear-gradient(180deg,#17243E,#101A2E)", border: `1px solid ${rc}66`, borderRadius: 24, padding: "clamp(28px,4vw,40px)", boxShadow: "0 40px 110px rgba(0,0,0,.55)", animation: "resultPop .65s cubic-bezier(.16,1,.3,1)", textAlign: "center", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 300, height: 200, background: `radial-gradient(circle,${rc}33,transparent 70%)` }} />
            <div style={{ position: "relative" }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "2px", color: "var(--muted-2)", textTransform: "uppercase" }}>Your assignment</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 14, padding: "12px 26px", borderRadius: 999, background: `${rc}1A`, border: `1px solid ${rc}66` }}>
                <span style={{ fontFamily: serif, fontSize: 34, lineHeight: 1, color: rc }}>Wave {result.wave}</span>
                <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: "1.5px", color: rc }}>{result.label}</span>
              </div>
              <div style={{ marginTop: 24, fontSize: 13, fontWeight: 700, letterSpacing: "1px", color: "var(--muted-3)", textTransform: "uppercase" }}>Arrive between</div>
              <div style={{ fontFamily: serif, fontSize: "clamp(34px,6vw,52px)", color: "var(--text-bright)", lineHeight: 1.05, marginTop: 4 }}>{result.window}</div>

              {result.transit && (
                <div style={{ display: "inline-flex", alignItems: "center", gap: 9, marginTop: 18, padding: "9px 16px", borderRadius: 12, background: "rgba(91,214,160,.12)", border: "1px solid rgba(91,214,160,.3)", fontSize: 13.5, fontWeight: 700, color: "var(--green)" }}>
                  🌱 Transit Bonus Applied — you bumped to an earlier wave
                </div>
              )}

              <div style={{ marginTop: 22, padding: 18, borderRadius: 16, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.09)", textAlign: "left", display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                  <span style={{ fontSize: 22 }}>🎁</span>
                  <div><div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".8px", color: "var(--muted-3)", textTransform: "uppercase" }}>Your reward</div><div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{result.reward}</div></div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 13, borderTop: "1px solid rgba(255,255,255,.07)", paddingTop: 14 }}>
                  <span style={{ fontSize: 22 }}>🚪</span>
                  <div><div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".8px", color: "var(--muted-3)", textTransform: "uppercase" }}>Entry</div><div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)" }}>{result.gate}</div></div>
                </div>
              </div>

              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" style={{ width: "100%", marginTop: 22, padding: 16, borderRadius: 14, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 16, fontWeight: 700, color: "#1A1206", background: "linear-gradient(180deg,#F0C572,#E0A24A)", boxShadow: "0 12px 30px rgba(224,162,74,.32)", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, textDecoration: "none", boxSizing: "border-box" }}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#1A1206" strokeWidth="2"><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.4" /></svg>
                Get Directions
              </a>
              <button onClick={() => setResult(null)} style={{ marginTop: 12, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13.5, fontWeight: 600, color: "var(--muted-3)" }}>← Start over</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <div style={glow} />
      <Reveal style={{ position: "relative", width: "100%", maxWidth: 560 }}>
        <div style={{ background: "linear-gradient(180deg,#17243E,#101A2E)", border: "1px solid rgba(232,180,90,.18)", borderRadius: 24, padding: "clamp(26px,4vw,40px)", boxShadow: "0 40px 100px rgba(0,0,0,.5)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 13px", borderRadius: 999, background: "linear-gradient(90deg,rgba(91,214,160,.18),rgba(232,180,90,.18))", border: "1px solid rgba(232,180,90,.3)", fontSize: 12, fontWeight: 800, letterSpacing: "1.5px", color: "var(--text)" }}>
            ⚽ {EVENT.category}
          </div>
          <h1 style={{ fontFamily: serif, fontWeight: 400, fontSize: "clamp(38px,6vw,58px)", letterSpacing: "-.5px", margin: "16px 0 4px", lineHeight: 1, color: "var(--text-bright)" }}>Find Your Wave</h1>
          <p style={{ margin: "0 0 24px", fontSize: 14.5, color: "var(--muted-2)" }}>{EVENT.label} · {EVENT.date} · {EVENT.kickoff}</p>

          <div ref={ddRef}>
          {/* Event selector */}
          <div style={{ position: "relative", zIndex: openDD === "event" ? 40 : 5, marginBottom: 18 }}>
            <label style={labelStyle}>Which event are you attending?</label>
            <button onClick={() => setOpenDD((d) => (d === "event" ? "" : "event"))} style={{ ...fieldStyle, gap: 11 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8B45A" strokeWidth="1.5"><ellipse cx="12" cy="12" rx="9" ry="5" /><path d="M3 12c0 3 4 5 9 5s9-2 9-5" /></svg>
              <div style={{ flex: 1, lineHeight: 1.2, textAlign: "left" }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--text)" }}>{EVENT.label}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted-3)" }}>{EVENT.date} · {EVENT.kickoff}</div>
              </div>
              <span style={{ color: "var(--muted-3)" }}>▾</span>
            </button>
            {openDD === "event" && (
              <div style={menuStyle}>
                {events.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => {
                      setSelectedId(e.id);
                      setOpenDD("");
                      // Reset the rest of the form when the event changes.
                      setOrigin(null); setTransport(null); setTime(null);
                    }}
                    style={{ width: "100%", textAlign: "left", padding: "11px 14px", borderRadius: 9, background: e.id === selectedId ? "rgba(232,180,90,.14)" : "none", border: "none", cursor: "pointer", fontFamily: "inherit", color: "#E4E9F1", display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span style={{ fontSize: 16 }}>{e.emoji}</span>
                    <span>
                      <span style={{ display: "block", fontSize: 14, fontWeight: 600 }}>{e.label}</span>
                      <span style={{ display: "block", fontSize: 11.5, color: "var(--muted-3)" }}>{e.date} · {e.kickoff}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Origin */}
          <div style={{ position: "relative", zIndex: openDD === "origin" ? 30 : 20, marginBottom: 18 }}>
            <label style={labelStyle}>Where are you coming from?</label>
            <button onClick={() => setOpenDD((d) => (d === "origin" ? "" : "origin"))} style={fieldStyle}>
              <span style={origin ? { color: "var(--text)", fontWeight: 600 } : { color: "var(--muted-3)" }}>{originLabel || "Select your origin"}</span>
              <span style={{ color: "var(--muted-3)" }}>▾</span>
            </button>
            {openDD === "origin" && (
              <div style={menuStyle}>
                {ORIGINS.map((o) => (
                  <button key={o.id} onClick={() => { setOrigin(o.id); setOpenDD(""); }} style={{ width: "100%", textAlign: "left", padding: "12px 14px", borderRadius: 9, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14.5, color: "#E4E9F1" }}>
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Transport */}
          <div style={{ position: "relative", zIndex: openDD === "transport" ? 30 : 15, marginBottom: 18 }}>
            <label style={labelStyle}>How are you getting here?</label>
            <button onClick={() => setOpenDD((d) => (d === "transport" ? "" : "transport"))} style={fieldStyle}>
              <span style={transport ? { color: "var(--text)", fontWeight: 600 } : { color: "var(--muted-3)" }}>{transportLabel || "Select your transport"}</span>
              <span style={{ color: "var(--muted-3)" }}>▾</span>
            </button>
            {openDD === "transport" && (
              <div style={menuStyle}>
                {TRANSPORTS.map((t) => (
                  <button key={t.id} onClick={() => { setTransport(t.id); setOpenDD(""); }} style={{ width: "100%", textAlign: "left", padding: "11px 14px", borderRadius: 9, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", color: "#E4E9F1", display: "block" }}>
                    <span style={{ fontSize: 14.5, fontWeight: 600, display: "block" }}>{t.label}</span>
                    <span style={{ fontSize: 12, color: "var(--muted-3)" }}>{TRANSPORT_SUB[t.id]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          </div>

          {/* Time grid */}
          <div style={{ marginBottom: 26 }}>
            <label style={labelStyle}>Earliest you could arrive? <span style={{ color: "var(--muted-3)", fontWeight: 500 }}>(doors open · {doorsOpen})</span></label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
              {slots.map((s) => {
                const sel = time === s.value;
                return (
                  <button
                    key={s.value}
                    onClick={() => setTime(s.value)}
                    style={{
                      padding: "13px 0", borderRadius: 12, fontFamily: "inherit", fontSize: 14.5, fontWeight: 600,
                      cursor: "pointer", textAlign: "center", transition: "all .22s",
                      ...(sel
                        ? { border: "1px solid rgba(232,180,90,.6)", background: "linear-gradient(180deg,rgba(240,197,114,.22),rgba(224,162,74,.12))", color: "var(--text)", boxShadow: "0 0 0 1px rgba(232,180,90,.25),0 6px 16px rgba(224,162,74,.18)" }
                        : { border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.03)", color: "var(--muted-1)" }),
                    }}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={submit}
            disabled={!canSubmit}
            style={{
              width: "100%", padding: 16, borderRadius: 14, border: "none", fontFamily: "inherit", fontSize: 16.5, fontWeight: 700, transition: "all .3s",
              ...(canSubmit
                ? { cursor: "pointer", color: "#1A1206", background: "linear-gradient(180deg,#F0C572,#E0A24A)", boxShadow: "0 12px 30px rgba(224,162,74,.34)" }
                : { cursor: "not-allowed", color: "var(--muted-4)", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)" }),
            }}
          >
            Get My Wave →
          </button>
        </div>
      </Reveal>
    </div>
  );
}

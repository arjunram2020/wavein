"use client";
import { useState, useMemo } from "react";
import { EVENTS } from "@/lib/data";
import { useCountUp, fmt } from "@/lib/useCountUp";
import { buildChartFromSubmissions } from "@/lib/waveLogic";
import Reveal from "./Reveal";
import ArrivalChart from "./ArrivalChart";

const serif = "var(--font-serif)";

// Design wave→color mapping (the lib data carries its own neon dot colors; the
// redesign maps by wave index to the warm palette instead).
const WAVE_COLORS = ["#5BD6A0", "#E8B45A", "#D99A4E", "#E2685B"];

// Full-season projection + equivalencies (presentation constants).
const SEASON = { co2: 408000, trees: 2190, cars: 89, flights: 51 };

const panel = {
  background: "linear-gradient(180deg,rgba(20,31,54,.6),rgba(13,19,31,.5))",
  border: "1px solid rgba(255,255,255,.09)", borderRadius: 20,
};

function StatCard({ label, value, unit, sub, color, icon, bg, border }) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 18, padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: "1.2px", color: "var(--muted-2)", textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</span>
        {icon}
      </div>
      <div style={{ marginTop: 14, lineHeight: 1 }}>
        <span style={{ fontSize: "clamp(32px,3.4vw,44px)", fontWeight: 800, color, letterSpacing: "-1px" }}>{value}</span>
        {unit && <span style={{ fontSize: 16, fontWeight: 700, color, marginLeft: 5 }}>{unit}</span>}
      </div>
      <div style={{ fontSize: 12.5, color: "var(--muted-3)", marginTop: 8 }}>{sub}</div>
    </div>
  );
}

function StadiumIcon({ stroke = "#E8B45A", size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6">
      <ellipse cx="12" cy="12" rx="9" ry="5" /><path d="M3 12c0 3 4 5 9 5s9-2 9-5" />
    </svg>
  );
}

export default function OrganizerView({ events = EVENTS, submissions = {} }) {
  const [selectedId, setSelectedId] = useState(events[0]?.id);
  const [pickerOpen, setPickerOpen] = useState(false);

  const ev = events.find((e) => e.id === selectedId) || events[0];
  const { counters, waveTable } = ev;

  // Arrival chart is built live from real + seeded fan submissions:
  //   red  = each fan's self-reported earliest arrival time
  //   green = the wave window each fan was assigned
  const evSubs = submissions[ev.id] || [];
  const chart = useMemo(
    () => buildChartFromSubmissions(ev, evSubs),
    [ev, evSubs]
  );

  // Live CO₂ counter (lib hook) shared by the stat card and the panel.
  const co2 = useCountUp(counters.co2Target, 1800, { min: 2, max: 8, minMs: 2200, maxMs: 3200 });
  const co2Pct = Math.min((co2 / counters.co2Ceiling) * 100, 100);
  const martaPct = Math.min((counters.martaTarget / counters.martaCeiling) * 100, 100);
  const shortDate = ev.date.replace(/,\s*\d{4}$/, "");

  return (
    <div style={{ position: "relative", zIndex: 1, maxWidth: 1340, margin: "0 auto", padding: "clamp(24px,3.5vw,44px) clamp(18px,3vw,40px) 80px" }}>
      {/* Header */}
      <Reveal style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 18, marginBottom: 30 }}>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: "1.8px", color: "var(--gold)", textTransform: "uppercase" }}>Organizer · Live</div>
          <h1 style={{ fontFamily: serif, fontWeight: 400, fontSize: "clamp(34px,4.4vw,56px)", letterSpacing: "-.4px", margin: "6px 0 0", color: "var(--text-bright)" }}>Event Command Center</h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* Event selector */}
          <div style={{ position: "relative" }}>
            <div onClick={() => setPickerOpen((o) => !o)} style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 16px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, cursor: "pointer" }}>
              <StadiumIcon />
              <div style={{ textAlign: "left", lineHeight: 1.25, whiteSpace: "nowrap" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{ev.label}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted-3)" }}>{ev.date} · {ev.kickoff}</div>
              </div>
              <span style={{ color: "var(--muted-3)", fontSize: 12, marginLeft: 4 }}>▾</span>
            </div>
            {pickerOpen && (
              <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 8, minWidth: 260, background: "#1A2840", border: "1px solid rgba(255,255,255,.14)", borderRadius: 13, padding: 6, boxShadow: "0 24px 60px rgba(0,0,0,.6)", zIndex: 30, maxHeight: 320, overflow: "auto", animation: "modalIn .22s ease" }}>
                {events.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => { setSelectedId(e.id); setPickerOpen(false); }}
                    style={{ width: "100%", textAlign: "left", padding: "10px 13px", borderRadius: 9, background: e.id === selectedId ? "rgba(232,180,90,.14)" : "none", border: "none", cursor: "pointer", fontFamily: "inherit", color: "var(--text)", display: "flex", alignItems: "center", gap: 9 }}
                  >
                    <span style={{ fontSize: 15 }}>{e.emoji}</span>
                    <span>
                      <span style={{ display: "block", fontSize: 13.5, fontWeight: 600 }}>{e.label}</span>
                      <span style={{ display: "block", fontSize: 11.5, color: "var(--muted-3)" }}>{e.date} · {e.kickoff}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button style={{ padding: "11px 18px", borderRadius: 12, border: "1px solid rgba(232,180,90,.45)", background: "rgba(232,180,90,.1)", color: "var(--gold)", fontFamily: "inherit", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>+ New Event</button>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 16px", borderRadius: 12, background: "rgba(91,214,160,.12)", border: "1px solid rgba(91,214,160,.3)", color: "var(--green)", fontSize: 13, fontWeight: 700, letterSpacing: ".5px" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--green)", boxShadow: "0 0 10px #5BD6A0", animation: "twinkle 1.6s ease-in-out infinite" }} />LIVE
          </span>
        </div>
      </Reveal>

      {/* Stat cards */}
      <Reveal delay={0.06} style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 18 }}>
        <StatCard
          label="Total Fans" value={ev.totalFans} sub={`${ev.label} · ${shortDate}`} color="var(--text)"
          bg="linear-gradient(165deg,rgba(232,180,90,.1),rgba(20,30,50,.5))" border="rgba(232,180,90,.18)"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8B45A" strokeWidth="1.5"><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3 3-5 6-5s6 2 6 5" /><path d="M16 6a3 3 0 0 1 0 6M21 20c0-2.5-1.5-4.3-4-4.8" /></svg>}
        />
        <StatCard
          label="Active Waves" value={String(waveTable.length)} sub={`Waves 1–${waveTable.length} operational`} color="var(--gold)"
          bg="linear-gradient(165deg,rgba(255,255,255,.05),rgba(20,30,50,.5))" border="rgba(255,255,255,.1)"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8FA8D8" strokeWidth="1.5"><path d="M3 12c3-5 6-5 9 0s6 5 9 0" /><path d="M3 17c3-5 6-5 9 0s6 5 9 0" opacity=".5" /></svg>}
        />
        <StatCard
          label="CO₂ Saved" value={fmt(co2)} unit="kg" sub="this event" color="var(--green)"
          bg="linear-gradient(165deg,rgba(91,214,160,.1),rgba(20,30,50,.5))" border="rgba(91,214,160,.2)"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5BD6A0" strokeWidth="1.5"><path d="M11 20A7 7 0 0 1 9.8 6.1C15 5 17 4 19 2c1 2 1 6-1 9a7 7 0 0 1-7 9Z" /><path d="M11 20c0-4 2-7 5-9" /></svg>}
        />
        <StatCard
          label="Car → MARTA" value={fmt(counters.martaTarget)} sub="fans rerouted to transit" color="var(--blue)"
          bg="linear-gradient(165deg,rgba(82,140,210,.1),rgba(20,30,50,.5))" border="rgba(82,140,210,.2)"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6FA0E0" strokeWidth="1.5"><rect x="4" y="5" width="16" height="11" rx="2" /><path d="M4 11h16M8 20l1-4M16 20l-1-4" /></svg>}
        />
      </Reveal>

      {/* Chart */}
      <Reveal delay={0.1} style={{ ...panel, padding: "24px clamp(16px,2.5vw,30px)", marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "var(--text)" }}>
            Arrival Distribution <span style={{ color: "var(--muted-3)", fontWeight: 500 }}>— {ev.label}, {shortDate} · {ev.kickoff}</span>
          </h3>
          <div style={{ display: "flex", gap: 18, fontSize: 13, fontWeight: 600 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--red)" }}><span style={{ width: 14, height: 3, borderRadius: 2, background: "var(--red)" }} />Without WaveIn</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: "var(--green)" }}><span style={{ width: 14, height: 3, borderRadius: 2, background: "var(--green)" }} />With WaveIn</span>
          </div>
        </div>
        <ArrivalChart chart={chart} variant="dashboard" height={360} />
      </Reveal>

      {/* Bottom: table + sustainability */}
      <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 18 }}>
        <Reveal style={{ ...panel, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 18px", color: "var(--text)" }}>Wave Assignments <span style={{ color: "var(--green)", fontWeight: 600 }}>— Active</span></h3>
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.1fr 1.2fr 1.4fr .7fr", gap: 10, fontSize: 10.5, fontWeight: 700, letterSpacing: "1px", color: "var(--muted-4)", textTransform: "uppercase", padding: "0 4px 12px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
            <span>Wave</span><span>Window</span><span>Zones</span><span>Reward</span><span style={{ textAlign: "right" }}>Fans</span>
          </div>
          {waveTable.map((w, i) => {
            const color = WAVE_COLORS[i] || WAVE_COLORS[WAVE_COLORS.length - 1];
            const last = i === waveTable.length - 1;
            return (
              <div key={w.name} style={{ display: "grid", gridTemplateColumns: "1.1fr 1.1fr 1.2fr 1.4fr .7fr", gap: 10, alignItems: "center", padding: "16px 4px", borderBottom: last ? "none" : "1px solid rgba(255,255,255,.05)", fontSize: 13 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "var(--text)" }}>
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}99` }} />{w.name}
                </span>
                <span style={{ color: "var(--muted-1)" }}>{w.window}</span>
                <span style={{ color: "var(--muted-2)" }}>{w.zones}</span>
                <span style={{ color: "var(--muted-1)" }}>{w.reward}</span>
                <span style={{ textAlign: "right", fontWeight: 700, color: "var(--text)" }}>{w.fans}</span>
              </div>
            );
          })}
        </Reveal>

        <Reveal delay={0.08} style={{ background: "linear-gradient(180deg,rgba(91,214,160,.08),rgba(13,22,30,.5))", border: "1px solid rgba(91,214,160,.2)", borderRadius: 20, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 18 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5BD6A0" strokeWidth="1.7"><path d="M11 20A7 7 0 0 1 9.8 6.1C15 5 17 4 19 2c1 2 1 6-1 9a7 7 0 0 1-7 9Z" /></svg>
            <h3 style={{ fontSize: 13, fontWeight: 700, letterSpacing: "1px", color: "var(--green)", textTransform: "uppercase", margin: 0 }}>Sustainability Impact</h3>
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".8px", color: "var(--muted-2)", textTransform: "uppercase" }}>CO₂ saved this event</div>
          <div style={{ margin: "6px 0 12px", lineHeight: 1 }}>
            <span style={{ fontFamily: serif, fontSize: 48, color: "var(--green)" }}>{fmt(co2)}</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: "var(--green)", marginLeft: 6 }}>kg</span>
          </div>
          <div style={{ height: 8, borderRadius: 5, background: "rgba(255,255,255,.06)", overflow: "hidden", marginBottom: 22 }}>
            <div style={{ height: "100%", width: `${co2Pct}%`, borderRadius: 5, background: "linear-gradient(90deg,#46C08A,#5BD6A0)", transition: "width .6s ease" }} />
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".8px", color: "var(--muted-2)", textTransform: "uppercase" }}>Car → MARTA shifts</div>
          <div style={{ margin: "6px 0 12px", lineHeight: 1 }}>
            <span style={{ fontFamily: serif, fontSize: 36, color: "var(--blue)" }}>{fmt(counters.martaTarget)}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--blue)", marginLeft: 6 }}>fans</span>
          </div>
          <div style={{ height: 8, borderRadius: 5, background: "rgba(255,255,255,.06)", overflow: "hidden", marginBottom: 24 }}>
            <div style={{ height: "100%", width: `${martaPct}%`, borderRadius: 5, background: "linear-gradient(90deg,#4A78C0,#6FA0E0)", transition: "width .6s ease" }} />
          </div>

          <div style={{ paddingTop: 20, borderTop: "1px solid rgba(255,255,255,.09)", fontSize: 11, fontWeight: 700, letterSpacing: ".8px", color: "var(--muted-2)", textTransform: "uppercase" }}>Projected: full season</div>
          <div style={{ margin: "6px 0 16px" }}>
            <span style={{ fontFamily: serif, fontSize: 32, color: "var(--text)" }}>{SEASON.co2.toLocaleString("en-US")} kg</span>{" "}
            <span style={{ fontSize: 14, color: "var(--green-soft)" }}>CO₂ eliminated</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11, fontSize: 14, color: "var(--muted-1)" }}><span style={{ fontSize: 19 }}>🌳</span><strong style={{ color: "var(--text)" }}>{SEASON.trees.toLocaleString("en-US")}</strong> trees planted</div>
            <div style={{ display: "flex", alignItems: "center", gap: 11, fontSize: 14, color: "var(--muted-1)" }}><span style={{ fontSize: 19 }}>🚗</span><strong style={{ color: "var(--text)" }}>{SEASON.cars}</strong> cars removed for a year</div>
            <div style={{ display: "flex", alignItems: "center", gap: 11, fontSize: 14, color: "var(--muted-1)" }}><span style={{ fontSize: 19 }}>✈️</span><strong style={{ color: "var(--text)" }}>{SEASON.flights}</strong> transatlantic flights offset</div>
          </div>
          <p style={{ margin: "20px 0 0", fontSize: 11, lineHeight: 1.5, color: "var(--muted-4)" }}>
            Methodology: counters derived from each wave&apos;s fan count, transport mode, and driving distance to Mercedes-Benz Stadium. EPA avg 0.21 kg CO₂/km · round trip · 2.0 occupancy.
          </p>
        </Reveal>
      </div>
    </div>
  );
}

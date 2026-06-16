"use client";
import { useCountUp, fmt } from "@/lib/useCountUp";
import { EVENT, COUNTERS, WAVE_TABLE } from "@/lib/data";
import ArrivalChart from "./ArrivalChart";

const card = {
  background: "#111118", border: "1px solid #1e1e2e", borderRadius: 12,
  padding: 20, boxShadow: "0 0 20px rgba(0,255,135,0.05)",
};
const cardLabel = { fontSize: 11, fontWeight: 600, letterSpacing: "0.13em", color: "#8888aa" };
const colHead = { fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "#8888aa", padding: "0 8px 10px" };

function StatCard({ label, icon, value, sub, valueColor, glow }) {
  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={cardLabel}>{label}</span>
        <span style={{ fontSize: 20 }}>{icon}</span>
      </div>
      <div
        style={{
          fontSize: 38, fontWeight: 700, marginTop: 10, lineHeight: 1,
          color: valueColor || "#fff",
          textShadow: glow ? `0 0 12px ${glow}` : "none",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 12, color: "#8888aa", marginTop: 8 }}>{sub}</div>
    </div>
  );
}

export default function OrganizerView() {
  const co2 = useCountUp(COUNTERS.co2Target, 20000, { min: 2, max: 8, minMs: 2000, maxMs: 3000 });
  const marta = useCountUp(COUNTERS.martaTarget, 25000, { min: 1, max: 1, minMs: 4000, maxMs: 6000 });

  const co2Pct = Math.min((co2 / COUNTERS.co2Ceiling) * 100, 100).toFixed(1) + "%";
  const martaPct = Math.min((marta / COUNTERS.martaCeiling) * 100, 100).toFixed(1) + "%";

  return (
    <div style={{ maxWidth: 1320, margin: "0 auto", padding: "28px 28px 56px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ margin: 0, fontSize: 34, fontWeight: 700 }}>Event Command Center</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", border: "1px solid #1e1e2e", borderRadius: 999, background: "#111118" }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#00ff87", boxShadow: "0 0 10px rgba(0,255,135,0.8)", animation: "wiBlink 1.6s ease-in-out infinite" }} />
          <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.14em", color: "#00ff87" }}>LIVE</span>
        </div>
      </div>

      {/* stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 18 }}>
        <StatCard label="TOTAL FANS" icon="👥" value={EVENT.totalFans} sub={`${EVENT.label} · ${EVENT.date}`} />
        <StatCard label="ACTIVE WAVES" icon="🌊" value="4" sub="Waves 1–4 operational" />
        <StatCard label="CO₂ SAVED" icon="🌱" value={fmt(co2)} sub="kg this game" valueColor="#00ff87" glow="rgba(0,255,135,0.6)" />
        <StatCard label="CAR → MARTA SHIFTS" icon="🚇" value={fmt(marta)} sub="fans rerouted to transit" valueColor="#00c4ff" glow="rgba(0,196,255,0.5)" />
      </div>

      {/* chart */}
      <div style={{ ...card, padding: "22px 22px 14px", marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 6 }}>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>
            Arrival Distribution — {EVENT.label}, {EVENT.date} · {EVENT.kickoff}
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
        <ArrivalChart />
      </div>

      {/* table + sustainability */}
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

            {WAVE_TABLE.map((w, i) => {
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

          <div style={{ fontSize: 11, letterSpacing: "0.08em", color: "#8888aa", textTransform: "uppercase" }}>CO₂ Saved This Game</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: "#00ff87", textShadow: "0 0 12px rgba(0,255,135,0.6)", margin: "2px 0 8px" }}>
            {fmt(co2)} <span style={{ fontSize: 15, color: "#8888aa", textShadow: "none", fontWeight: 500 }}>kg</span>
          </div>
          <div style={{ height: 7, borderRadius: 4, background: "#1e1e2e", overflow: "hidden" }}>
            <div style={{ height: "100%", background: "#00ff87", boxShadow: "0 0 10px rgba(0,255,135,0.6)", transition: "width 0.6s ease", width: co2Pct }} />
          </div>

          <div style={{ fontSize: 11, letterSpacing: "0.08em", color: "#8888aa", textTransform: "uppercase", marginTop: 18 }}>Car → MARTA Shifts</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#00c4ff", textShadow: "0 0 10px rgba(0,196,255,0.5)", margin: "2px 0 8px" }}>
            {fmt(marta)} <span style={{ fontSize: 13, color: "#8888aa", textShadow: "none", fontWeight: 500 }}>fans</span>
          </div>
          <div style={{ height: 5, borderRadius: 4, background: "#1e1e2e", overflow: "hidden" }}>
            <div style={{ height: "100%", background: "#00c4ff", boxShadow: "0 0 8px rgba(0,196,255,0.5)", transition: "width 0.6s ease", width: martaPct }} />
          </div>

          <div style={{ borderTop: "1px dashed #1e1e2e", margin: "20px 0" }} />

          <div style={{ fontSize: 11, letterSpacing: "0.08em", color: "#8888aa", textTransform: "uppercase" }}>Projected: 8 WC26 Games</div>
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
            Methodology: EPA idle emissions data. 0.8 gal/hr idle burn · 8.887 kg CO₂/gal. 22 min avg idle → 4 min with WaveIn.
          </div>
        </div>
      </div>
    </div>
  );
}

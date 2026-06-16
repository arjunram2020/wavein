"use client";

export default function Nav({ view, setView }) {
  const pill = (active) =>
    active
      ? {
          padding: "8px 18px", borderRadius: 999, border: "1px solid #00ff87",
          background: "#00ff87", color: "#000", fontWeight: 700, fontSize: 13,
          cursor: "pointer", boxShadow: "0 0 16px rgba(0,255,135,0.4)",
        }
      : {
          padding: "8px 18px", borderRadius: 999, border: "1px solid #1e1e2e",
          background: "transparent", color: "#fff", fontWeight: 600, fontSize: 13,
          cursor: "pointer",
        };

  return (
    <div
      style={{
        position: "sticky", top: 0, zIndex: 50, display: "flex",
        alignItems: "center", justifyContent: "space-between",
        padding: "0 28px", height: 64, background: "#0d0d14",
        borderBottom: "1px solid #1e1e2e",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 30, height: 30, borderRadius: 8, background: "#00ff87",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 17, boxShadow: "0 0 16px rgba(0,255,135,0.5)",
          }}
        >
          ⚡
        </div>
        <span style={{ fontSize: 21, fontWeight: 700, color: "#fff" }}>WaveIn</span>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => setView("organizer")} style={pill(view === "organizer")}>
          Organizer View
        </button>
        <button onClick={() => setView("fan")} style={pill(view === "fan")}>
          Fan View
        </button>
      </div>
    </div>
  );
}

"use client";
import Logo from "./Logo";

// Sticky top nav shared across all screens. The segmented control reflects the
// current screen and links directly to the organizer / fan views; the logo
// returns to the landing page.
export default function Nav({ screen, onHome, onOrganizer, onFan }) {
  const pill = (active) => ({
    padding: "8px 16px",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 13.5,
    fontWeight: 600,
    transition: "all .25s",
    ...(active
      ? { background: "linear-gradient(180deg,#F0C572,#E0A24A)", color: "#1A1206", boxShadow: "0 4px 14px rgba(224,162,74,.3)" }
      : { background: "transparent", color: "#A9B5C8" }),
  });

  return (
    <nav
      style={{
        position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "16px clamp(20px,4vw,44px)",
        background: "rgba(11,18,31,.72)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,.07)",
      }}
    >
      <button onClick={onHome} style={{ display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
        <Logo idSuffix="nav" />
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 999, padding: 4 }}>
        <button onClick={onOrganizer} style={pill(screen === "organizer")}>Organizer View</button>
        <button onClick={onFan} style={pill(screen === "fan")}>Fan View</button>
      </div>
    </nav>
  );
}

"use client";

// Wave mark + wordmark. SVG copied from the prototype nav.
// `idSuffix` keeps the gradient id unique when the logo renders more than once
// on a page (nav + modal).
export default function Logo({ size = 34, showWordmark = true, wordmarkSize = 21, idSuffix = "nav" }) {
  const gid = `wiLogo-${idSuffix}`;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 11 }}>
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ display: "block" }}>
        <rect x="1.5" y="1.5" width="37" height="37" rx="11" fill={`url(#${gid})`} stroke="rgba(232,180,90,.35)" />
        <path d="M6 25 C 11 16, 16 16, 20 22 C 24 28, 29 28, 34 19" stroke="#F4EDE0" strokeWidth="2.6" strokeLinecap="round" fill="none" opacity=".92" />
        <path d="M6 31 C 11 23, 16 23, 20 28 C 23 31.5, 27 32, 31 28" stroke="#E8B45A" strokeWidth="2.4" strokeLinecap="round" fill="none" />
        <circle cx="34" cy="19" r="2.7" fill="#E8B45A" />
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="40" y2="40">
            <stop stopColor="#244A86" />
            <stop offset="1" stopColor="#10213F" />
          </linearGradient>
        </defs>
      </svg>
      {showWordmark && (
        <span style={{ fontSize: wordmarkSize, fontWeight: 700, letterSpacing: "-.4px", color: "var(--text)" }}>
          Wave<span style={{ color: "var(--gold)" }}>In</span>
        </span>
      )}
    </span>
  );
}

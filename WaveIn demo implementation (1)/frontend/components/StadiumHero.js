"use client";

// Dusk stadium / skyline / traffic hero illustration. Pure SVG with internal
// gradients and a few looping animations (floatY, pulseRing, twinkle, dashMove).
// Ported from the design prototype; placeholder the client may later swap.
export default function StadiumHero() {
  return (
    <svg viewBox="0 0 1200 620" width="100%" style={{ display: "block" }}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0B1322" />
          <stop offset="0.42" stopColor="#22304F" />
          <stop offset="0.68" stopColor="#5B4A66" />
          <stop offset="0.85" stopColor="#C76C44" />
          <stop offset="1" stopColor="#EBA257" />
        </linearGradient>
        <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFD89A" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#F0A85C" stopOpacity="0.45" />
          <stop offset="1" stopColor="#F0A85C" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1A2236" />
          <stop offset="1" stopColor="#070B14" />
        </linearGradient>
        <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFE7B0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFE7B0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="domeG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2B3A5C" />
          <stop offset="1" stopColor="#141E33" />
        </linearGradient>
        <radialGradient id="vig" cx="0.5" cy="0.42" r="0.75">
          <stop offset="0.55" stopColor="#000000" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.55" />
        </radialGradient>
      </defs>

      <rect width="1200" height="620" fill="url(#sky)" />
      <ellipse cx="600" cy="430" rx="520" ry="240" fill="url(#sun)" />

      {/* stars */}
      <circle cx="220" cy="90" r="1.6" fill="#fff" opacity=".7" style={{ animation: "twinkle 4s ease-in-out infinite" }} />
      <circle cx="360" cy="140" r="1.3" fill="#fff" opacity=".5" style={{ animation: "twinkle 5s ease-in-out infinite .6s" }} />
      <circle cx="900" cy="80" r="1.5" fill="#fff" opacity=".6" style={{ animation: "twinkle 4.5s ease-in-out infinite 1s" }} />
      <circle cx="1040" cy="150" r="1.2" fill="#fff" opacity=".5" style={{ animation: "twinkle 6s ease-in-out infinite .3s" }} />
      <circle cx="120" cy="180" r="1.3" fill="#fff" opacity=".45" style={{ animation: "twinkle 5.5s ease-in-out infinite 1.4s" }} />

      {/* far skyline */}
      <g opacity="0.92">
        <rect x="70" y="300" width="46" height="150" fill="#16223C" />
        <rect x="124" y="270" width="34" height="180" fill="#13203A" />
        <path d="M170 250 L186 220 L202 250 L202 450 L170 450 Z" fill="#18243F" />
        <rect x="183" y="200" width="6" height="34" fill="#18243F" />
        <rect x="214" y="290" width="40" height="160" fill="#15213B" />
        <rect x="262" y="262" width="28" height="188" fill="#121E37" />
        <rect x="930" y="286" width="40" height="164" fill="#15213B" />
        <rect x="978" y="256" width="30" height="194" fill="#121E37" />
        <path d="M1016 250 L1030 224 L1044 250 L1044 450 L1016 450 Z" fill="#17233E" />
        <rect x="1052" y="300" width="42" height="150" fill="#16223C" />
        <rect x="1100" y="320" width="34" height="130" fill="#13203A" />
      </g>
      <g fill="#E8B45A" opacity="0.5">
        <rect x="80" y="320" width="3" height="5" /><rect x="92" y="340" width="3" height="5" />
        <rect x="134" y="300" width="3" height="5" /><rect x="142" y="330" width="3" height="5" />
        <rect x="942" y="310" width="3" height="5" /><rect x="988" y="290" width="3" height="5" />
        <rect x="1000" y="330" width="3" height="5" /><rect x="1064" y="340" width="3" height="5" />
      </g>
      <rect x="0" y="380" width="1200" height="90" fill="#2A2E44" opacity="0.28" />

      {/* stadium */}
      <g style={{ animation: "floatY 9s ease-in-out infinite" }}>
        <ellipse cx="600" cy="372" rx="270" ry="60" fill="url(#halo)" opacity="0.55" style={{ animation: "pulseRing 6s ease-in-out infinite" }} />
        <path d="M380 430 Q380 320 600 312 Q820 320 820 430 Z" fill="url(#domeG)" stroke="rgba(232,180,90,.25)" strokeWidth="1.5" />
        <ellipse cx="600" cy="430" rx="220" ry="34" fill="#101A2E" />
        <path d="M600 322 L628 350 L600 372 L572 350 Z" fill="#FFD89A" opacity="0.92" />
        <path d="M600 330 L618 350 L600 365 L582 350 Z" fill="#FFF0CC" />
        <path d="M412 414 Q600 350 788 414" stroke="#E8B45A" strokeWidth="2.4" fill="none" opacity="0.7" />
        <g fill="#FFE2A6" opacity="0.85">
          <circle cx="470" cy="408" r="2" /><circle cx="510" cy="400" r="2" /><circle cx="560" cy="395" r="2" />
          <circle cx="640" cy="395" r="2" /><circle cx="690" cy="400" r="2" /><circle cx="730" cy="408" r="2" />
        </g>
      </g>

      {/* road / traffic */}
      <path d="M0 620 L420 442 L780 442 L1200 620 Z" fill="url(#road)" />
      <path d="M600 442 L600 620" stroke="#E8B45A" strokeWidth="3" strokeDasharray="14 16" opacity="0.35" style={{ animation: "dashMove 1.4s linear infinite" }} />
      <path d="M470 442 L300 620" stroke="rgba(255,255,255,.08)" strokeWidth="2" />
      <path d="M730 442 L900 620" stroke="rgba(255,255,255,.08)" strokeWidth="2" />
      <g>
        <g transform="translate(508,470)"><rect width="34" height="17" rx="5" fill="#2E3C5C" /><circle cx="5" cy="16" r="2.4" fill="#E2685B" /><circle cx="29" cy="16" r="2.4" fill="#E2685B" /></g>
        <g transform="translate(620,468)"><rect width="36" height="17" rx="5" fill="#39456A" /><circle cx="5" cy="16" r="2.4" fill="#E2685B" /><circle cx="31" cy="16" r="2.4" fill="#E2685B" /></g>
        <g transform="translate(470,512)"><rect width="44" height="21" rx="6" fill="#33415F" /><circle cx="6" cy="20" r="3" fill="#E2685B" /><circle cx="38" cy="20" r="3" fill="#E2685B" /></g>
        <g transform="translate(660,510)"><rect width="46" height="21" rx="6" fill="#2C3A58" /><circle cx="6" cy="20" r="3" fill="#E2685B" /><circle cx="40" cy="20" r="3" fill="#E2685B" /></g>
        <g transform="translate(420,566)"><rect width="58" height="27" rx="7" fill="#39466A" /><circle cx="8" cy="26" r="3.6" fill="#E2685B" /><circle cx="50" cy="26" r="3.6" fill="#E2685B" /></g>
        <g transform="translate(700,562)"><rect width="60" height="27" rx="7" fill="#2F3D5C" /><circle cx="8" cy="26" r="3.6" fill="#E2685B" /><circle cx="52" cy="26" r="3.6" fill="#E2685B" /></g>
        <g transform="translate(250,590)"><rect width="40" height="20" rx="6" fill="#34425F" /><circle cx="36" cy="3" r="2.6" fill="#FFE2A6" /></g>
        <g transform="translate(910,588)"><rect width="42" height="20" rx="6" fill="#34425F" /><circle cx="6" cy="3" r="2.6" fill="#FFE2A6" /></g>
        <g transform="translate(556,490)"><rect width="40" height="18" rx="5" fill="#364568" /><circle cx="5" cy="17" r="2.6" fill="#E2685B" /><circle cx="35" cy="17" r="2.6" fill="#E2685B" /></g>
        <g transform="translate(516,536)"><rect width="50" height="23" rx="6" fill="#39466A" /><circle cx="7" cy="22" r="3.2" fill="#E2685B" /><circle cx="43" cy="22" r="3.2" fill="#E2685B" /></g>
        <g transform="translate(636,538)"><rect width="50" height="23" rx="6" fill="#313F5E" /><circle cx="7" cy="22" r="3.2" fill="#E2685B" /><circle cx="43" cy="22" r="3.2" fill="#E2685B" /></g>
        <g transform="translate(560,584)"><rect width="62" height="28" rx="7" fill="#3C4A6E" /><circle cx="9" cy="27" r="3.8" fill="#E2685B" /><circle cx="53" cy="27" r="3.8" fill="#E2685B" /></g>
      </g>
      <rect width="1200" height="620" fill="url(#vig)" opacity="0.5" />
    </svg>
  );
}

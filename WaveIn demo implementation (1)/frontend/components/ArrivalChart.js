"use client";
import { EVENTS } from "@/lib/data";

// Self-contained animated SVG area chart built from the static CHART arrays.
// No charting library, no network — same two-curve visual with a wipe-in
// reveal and a dashed kickoff line.
export default function ArrivalChart({ chart }) {
  const { times, withoutWaveIn, withWaveIn, kickoffIndex, kickoffLabel = "Kickoff", yMax } = chart || EVENTS[0].chart;

  const W = 1000, H = 340, L = 58, R = 982, T = 18, B = 286;
  const X = (i) => L + (i * (R - L)) / (times.length - 1);
  const Y = (v) => B - (v / yMax) * (B - T);
  const pts = (arr) => arr.map((v, i) => ({ x: X(i), y: Y(v) }));

  // Catmull-Rom -> cubic Bézier for smooth curves.
  const smooth = (p) => {
    let d = `M ${p[0].x} ${p[0].y}`;
    for (let i = 0; i < p.length - 1; i++) {
      const p0 = p[i - 1] || p[i];
      const p1 = p[i];
      const p2 = p[i + 1];
      const p3 = p[i + 2] || p2;
      const c1x = p1.x + (p2.x - p0.x) / 6;
      const c1y = p1.y + (p2.y - p0.y) / 6;
      const c2x = p2.x - (p3.x - p1.x) / 6;
      const c2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };
  const area = (p) =>
    smooth(p) + ` L ${p[p.length - 1].x} ${B} L ${p[0].x} ${B} Z`;

  const rp = pts(withoutWaveIn);
  const gp = pts(withWaveIn);
  const kx = X(kickoffIndex);
  const gridVals = [0, 2000, 4000, 6000, 8000];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="auto"
      style={{ display: "block", maxHeight: 360 }}
    >
      {gridVals.map((gv, i) => {
        const gy = Y(gv);
        return (
          <g key={`g${i}`}>
            <line x1={L} x2={R} y1={gy} y2={gy} stroke="#1e1e2e" strokeWidth={1} />
            <text x={L - 10} y={gy + 4} textAnchor="end" fontSize={11} fill="#5a5a72">
              {gv.toLocaleString()}
            </text>
          </g>
        );
      })}

      <text
        x={14}
        y={(T + B) / 2}
        fontSize={11}
        fill="#8888aa"
        textAnchor="middle"
        transform={`rotate(-90 14 ${(T + B) / 2})`}
      >
        Fan responses / 15 min
      </text>

      {times.map((t, i) => (
        <text key={`x${i}`} x={X(i)} y={B + 20} textAnchor="middle" fontSize={10.5} fill="#5a5a72">
          {t}
        </text>
      ))}

      <defs>
        <clipPath id="wiWipeClip">
          <rect
            x={0}
            y={0}
            width={W}
            height={H}
            style={{
              transformBox: "fill-box",
              transformOrigin: "left",
              animation: "wiWipe 1.6s ease-out forwards",
            }}
          />
        </clipPath>
      </defs>

      <g clipPath="url(#wiWipeClip)">
        <path d={area(rp)} fill="rgba(255,68,68,0.20)" />
        <path d={smooth(rp)} fill="none" stroke="#ff4444" strokeWidth={2.5} />
        <path d={area(gp)} fill="rgba(0,255,135,0.15)" />
        <path d={smooth(gp)} fill="none" stroke="#00ff87" strokeWidth={2.5} />
      </g>

      <line x1={kx} x2={kx} y1={T} y2={B} stroke="#ffffff" strokeWidth={1.5} strokeDasharray="5 5" opacity={0.6} />
      <rect x={kx - 44} y={T - 2} width={88} height={20} rx={5} fill="#1a1a26" stroke="#2a2a3a" />
      <text x={kx} y={T + 12} textAnchor="middle" fontSize={11} fill="#fff" fontWeight={600}>
        {kickoffLabel}
      </text>
    </svg>
  );
}

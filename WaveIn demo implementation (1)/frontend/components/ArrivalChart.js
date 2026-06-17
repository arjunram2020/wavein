"use client";
import { useEffect, useRef, useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ReferenceLine, ResponsiveContainer,
} from "recharts";

const RED = "#E2685B";
const GREEN = "#5BD6A0";

// Per-context styling. The same two-curve chart appears on the landing
// (problem = red only, solution = both with a subdued red) and on the
// dashboard (both at full strength, with extra y-ticks + axis label).
const VARIANTS = {
  problem:   { showGreen: false, redStroke: 3.2, redFill: 0.18, redOpacity: 1,    yTicks: [0, 4000, 8000], xTicks: ["4:00", "5:00", "6:00", "7:00"], yLabel: false },
  solution:  { showGreen: true,  redStroke: 2.4, redFill: 0.10, redOpacity: 0.55, yTicks: [0, 4000, 8000], xTicks: ["4:00", "5:00", "6:00", "7:00"], yLabel: false },
  dashboard: { showGreen: true,  redStroke: 3,   redFill: 0.16, redOpacity: 1,    yTicks: [0, 2000, 4000, 6000, 8000], xTicks: ["4:00", "4:30", "5:00", "5:30", "6:00", "6:30", "7:00", "7:15"], yLabel: true },
};

const axisTick = { fill: "var(--axis)", fontSize: 11.5, fontFamily: "var(--font-sans)" };

export default function ArrivalChart({ chart, variant = "dashboard", height = 340 }) {
  const cfg = VARIANTS[variant] || VARIANTS.dashboard;
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setInView(true); obs.unobserve(e.target); } }),
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const { times, withoutWaveIn, withWaveIn, kickoffIndex, kickoffLabel = "Kickoff", yMax } = chart;
  const data = times.map((t, i) => ({ time: t, without: withoutWaveIn[i], with: withWaveIn[i] }));
  const kickoffTime = times[kickoffIndex];

  return (
    <div ref={ref} style={{ width: "100%" }}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 18, right: 14, left: 6, bottom: 4 }}>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,.06)" />
          <XAxis
            dataKey="time"
            ticks={cfg.xTicks}
            tick={axisTick}
            tickLine={false}
            axisLine={false}
            interval={0}
            dy={6}
          />
          <YAxis
            domain={[0, yMax]}
            ticks={cfg.yTicks}
            tick={axisTick}
            tickLine={false}
            axisLine={false}
            width={46}
            tickFormatter={(v) => v.toLocaleString("en-US")}
            label={
              cfg.yLabel
                ? { value: "Fans / 15 min", angle: -90, position: "insideLeft", style: { fill: "var(--axis)", fontSize: 11, fontFamily: "var(--font-sans)", textAnchor: "middle" } }
                : undefined
            }
          />
          <ReferenceLine
            x={kickoffTime}
            stroke="rgba(255,255,255,.3)"
            strokeWidth={1.4}
            strokeDasharray="5 6"
            label={{ value: kickoffLabel, position: "top", fill: "var(--muted-1)", fontSize: 12, fontFamily: "var(--font-sans)" }}
          />
          {/* Red — Without WaveIn (drawn first so green overlays it). */}
          {inView && (
            <Area
              type="monotone"
              dataKey="without"
              stroke={RED}
              strokeWidth={cfg.redStroke}
              strokeOpacity={cfg.redOpacity}
              fill={RED}
              fillOpacity={cfg.redFill}
              strokeLinecap="round"
              isAnimationActive
              animationDuration={2100}
              animationEasing="ease-out"
              dot={false}
              activeDot={false}
            />
          )}
          {/* Green — With WaveIn. */}
          {inView && cfg.showGreen && (
            <Area
              type="monotone"
              dataKey="with"
              stroke={GREEN}
              strokeWidth={3.4}
              fill={GREEN}
              fillOpacity={0.16}
              strokeLinecap="round"
              isAnimationActive
              animationDuration={2100}
              animationBegin={150}
              animationEasing="ease-out"
              dot={false}
              activeDot={false}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

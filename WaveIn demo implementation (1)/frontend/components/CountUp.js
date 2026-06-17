"use client";
import { useEffect, useRef, useState } from "react";

// Counts up from 0 → `to` when scrolled into view. requestAnimationFrame with
// ease-out-cubic, formatted via toLocaleString('en-US'). Honors reduced motion
// by jumping straight to the final value.
export default function CountUp({ to, duration = 1900, decimals = 0, style, className }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const run = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      if (prefersReduced) { setValue(to); return; }
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(to * eased);
        if (p < 1) requestAnimationFrame(tick);
        else setValue(to);
      };
      requestAnimationFrame(tick);
    };

    if (typeof IntersectionObserver === "undefined") { run(); return; }
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { run(); obs.unobserve(e.target); } }),
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, duration]);

  return (
    <span ref={ref} style={style} className={className}>
      {value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
    </span>
  );
}

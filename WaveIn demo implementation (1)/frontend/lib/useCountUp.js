"use client";
import { useEffect, useRef, useState } from "react";

// Animates a number from 0 -> target over `duration` ms (ease-out cubic),
// then keeps "drifting" upward by small random increments to feel live.
// Everything is simulated on a timer — no network polling.
export function useCountUp(target, duration = 20000, drift = null) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  const timersRef = useRef([]);

  useEffect(() => {
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else if (drift) {
        startDrift();
      }
    };

    const startDrift = () => {
      const { min, max, minMs, maxMs } = drift;
      const step = () => {
        const inc = min + Math.floor(Math.random() * (max - min + 1));
        setValue((v) => v + inc);
        const t = setTimeout(step, minMs + Math.random() * (maxMs - minMs));
        timersRef.current.push(t);
      };
      const t = setTimeout(step, minMs + Math.random() * (maxMs - minMs));
      timersRef.current.push(t);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return value;
}

export const fmt = (n) => Math.round(n).toLocaleString("en-US");

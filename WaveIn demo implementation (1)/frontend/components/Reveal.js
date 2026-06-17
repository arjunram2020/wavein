"use client";
import { useEffect, useRef, useState } from "react";

// Scroll-reveal wrapper. Adds the `is-revealed` class (fade + rise) the first
// time the element enters the viewport, via IntersectionObserver. Honors
// prefers-reduced-motion through the CSS in globals.css.
//
// `delay` (seconds) staggers nested blocks. `once` defaults true.
export default function Reveal({
  children,
  delay = 0,
  className = "",
  style = {},
  as: Tag = "div",
  threshold = 0.12,
  once = true,
  onReveal,
}) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No IntersectionObserver (SSR-safe fallback): show immediately.
    if (typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      onReveal?.();
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            onReveal?.();
            if (once) obs.unobserve(entry.target);
          } else if (!once) {
            setRevealed(false);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tag
      ref={ref}
      className={`wi-reveal ${revealed ? "is-revealed" : ""} ${className}`.trim()}
      style={{ animationDelay: delay ? `${delay}s` : undefined, ...style }}
    >
      {children}
    </Tag>
  );
}

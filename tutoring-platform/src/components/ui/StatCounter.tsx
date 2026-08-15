"use client";

import { useEffect, useRef, useState } from "react";

export function StatCounter({
  value,
  label,
  suffix = "",
}: {
  value: number | null; // null = not yet available — handled gracefully, no "—"
  label: string;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value === null) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const duration = 1200;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          setDisplay(Math.floor(progress * value));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      {value === null ? (
        // Placeholders recede — smaller and muted, so real numbers stay the
        // loudest element on the row and "Coming soon" never competes with them.
        <p className="font-display text-2xl font-semibold text-ink-muted md:text-3xl">
          Coming soon
        </p>
      ) : (
        <p className="font-display text-4xl font-semibold text-brand-600 md:text-5xl">
          {display.toLocaleString()}
          {suffix}
        </p>
      )}
      <p className="mt-2 text-sm text-ink-muted">{label}</p>
    </div>
  );
}

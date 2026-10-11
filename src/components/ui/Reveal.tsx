"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Milliseconds of delay before the element animates in. */
  delay?: number;
  /** Starting offset direction of the animation. */
  from?: "up" | "left" | "right" | "scale";
  className?: string;
  style?: CSSProperties;
  as?: "div" | "section" | "article" | "li" | "span";
};

/**
 * Fade/slide-in on scroll using IntersectionObserver.
 * Respects `prefers-reduced-motion` via the global CSS rules.
 */
export function Reveal({
  children,
  delay = 0,
  from = "up",
  className = "",
  style,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof window === "undefined") return;

    let frame = 0;

    const check = () => {
      frame = 0;
      const target = ref.current;
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;

      // Reveal once it enters the viewport, or if it is already scrolled past
      // (deep links, instant jumps, restored scroll position).
      if (rect.top < vh * 0.92 || rect.bottom <= 0) {
        setVisible(true);
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        window.removeEventListener("hashchange", schedule);
      }
    };

    function schedule() {
      if (frame) return;
      frame = requestAnimationFrame(check);
    }

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("hashchange", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
    };
  }, []);

  const fromClass =
    from === "left"
      ? "reveal-left"
      : from === "right"
        ? "reveal-right"
        : from === "scale"
          ? "reveal-scale"
          : "";

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${fromClass} ${visible ? "is-visible" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms`, ...style } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

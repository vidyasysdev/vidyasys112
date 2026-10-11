import type { ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  /** Seconds for one full loop. */
  speed?: number;
};

/** Infinite horizontal scroller. Duplicates content so the loop is seamless. */
export function Marquee({ children, className = "", speed = 38 }: MarqueeProps) {
  return (
    <div className={`marquee ${className}`}>
      <div className="marquee-track" style={{ animationDuration: `${speed}s` }}>
        <div className="flex shrink-0 items-center" aria-hidden="false">
          {children}
        </div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

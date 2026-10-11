"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Slim gradient bar that sweeps across the top on every route change so
 * navigation always feels instant and intentional.
 */
export function RouteProgress() {
  const pathname = usePathname();
  const [running, setRunning] = useState(false);
  const [runKey, setRunKey] = useState(0);

  useEffect(() => {
    setRunKey((k) => k + 1);
    setRunning(true);
    const timeout = setTimeout(() => setRunning(false), 750);
    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!running) return null;

  return (
    <div
      key={runKey}
      onAnimationEnd={() => setRunning(false)}
      className="route-progress fixed top-0 left-0 right-0 h-[3px] z-[70] bg-gradient-to-r from-royal via-violet-500 to-fuchsia-500 shadow-[0_0_12px_rgb(43_92_230/0.6)]"
      aria-hidden="true"
    />
  );
}

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Hosts a sandboxed effect and owns its lifecycle.
 *
 * Two things the effects cannot do for themselves:
 * - resolve the site theme (the `dark` class the ThemeScript toggles), and
 * - unmount while off-screen, which releases the iframe document, its animation
 *   loops and its 2D/WebGL contexts together.
 */
export const EffectFrame = ({
  children,
  className = "",
  label,
  ratio,
  minHeight = 260,
  activeMargin = "200px",
  mode: forcedMode,
  hint,
}: {
  /** Receives the resolved theme. */
  children: (mode: "light" | "dark") => ReactNode;
  className?: string;
  label?: string;
  /** CSS aspect ratio, e.g. "16 / 9". Omit to fill the parent's height. */
  ratio?: string;
  minHeight?: number;
  activeMargin?: string;
  /** Pins the theme instead of following the site toggle. */
  mode?: "light" | "dark";
  /** Short call to action drawn over the effect until the pointer arrives. */
  hint?: string;
}) => {
  const host = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [active, setActive] = useState(false);

  const resolved = forcedMode ?? mode;

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setMode(root.classList.contains("dark") ? "dark" : "light");

    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = host.current;
    if (!element) return;

    let visible = false;
    const sync = () => setActive(visible && !document.hidden);

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        sync();
      },
      { rootMargin: activeMargin },
    );

    observer.observe(element);
    document.addEventListener("visibilitychange", sync);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [activeMargin]);

  return (
    <div
      ref={host}
      className={`group/frame overflow-hidden ${/absolute|fixed|sticky/.test(className) ? "" : "relative"} ${className}`}
      style={{ aspectRatio: ratio, minHeight }}
      /* A described effect is an image to assistive tech; an undescribed one is
         decoration, so it is hidden instead of announced as an empty image —
         `role="img"` with no name reads as just "image". */
      role={label ? "img" : "presentation"}
      aria-label={label ? label : undefined}
      aria-hidden={label ? undefined : true}
    >
      {active ? children(resolved) : null}

      {hint && active ? (
        <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-white/70 backdrop-blur-sm transition-opacity duration-500 group-hover/frame:opacity-0">
          {hint}
        </p>
      ) : null}
    </div>
  );
};

"use client";

import type { ElementType, ReactNode } from "react";
import { Reveal } from "./Reveal";

/**
 * Staggers a list's children as they scroll in.
 *
 * A server component cannot own an IntersectionObserver, so this thin client
 * boundary wraps them: the children stay server-rendered, and only the reveal
 * wrapper ships to the browser. Each child is cloned with an increasing delay so
 * a grid resolves as a wave rather than all at once.
 */
export const RevealGroup = ({
  children,
  step = 70,
  className = "",
  as: Tag = "div",
  effect = "reveal",
}: {
  children: ReactNode;
  /** Delay between children, in milliseconds. */
  step?: number;
  className?: string;
  as?: ElementType;
  /** `reveal` (fade up), `reveal-lift` (scale) or `reveal-left` / `reveal-right`. */
  effect?: string;
}) => {
  const items = Array.isArray(children) ? children : [children];

  return (
    <Tag className={className}>
      {items.map((child, index) => (
        <Reveal
          key={index}
          delay={Math.min(index * step, 420)}
          className={effect !== "reveal" ? effect : ""}
        >
          {child}
        </Reveal>
      ))}
    </Tag>
  );
};

"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Reveals its children once they scroll into view.
 *
 * A single IntersectionObserver per element, `once: true`, and the animation is
 * pure CSS (`opacity` + `translateY`), so no layout is read on scroll and the
 * compositor does the work. Unobserving after the first reveal means the page
 * pays for this exactly once per section.
 *
 * `prefers-reduced-motion` is handled in CSS: the element is simply visible, so
 * a visitor who asked for less motion never sees anything move.
 */
export const Reveal = ({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  /** Stagger in milliseconds, for lists. */
  delay?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    /* Without an observer the content must still be readable, so the hidden state
       is applied by script rather than shipped in the markup. */
    element.dataset.reveal = "pending";

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          element.dataset.reveal = "shown";
          observer.unobserve(element);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
};

import type { ReactNode } from "react";

type BadgeTone = "brand" | "success" | "warning" | "danger" | "neutral";

const toneClass: Record<BadgeTone, string> = {
  brand: "badge-brand",
  success: "badge-success",
  warning: "badge-warning",
  danger: "badge-danger",
  neutral: "badge-neutral",
};

export const Badge = ({
  children,
  tone = "brand",
  dot,
  className = "",
}: {
  children: ReactNode;
  tone?: BadgeTone;
  dot?: string;
  className?: string;
}) => (
  <span className={`${toneClass[tone]} ${className}`}>
    {dot && <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden="true" />}
    {children}
  </span>
);

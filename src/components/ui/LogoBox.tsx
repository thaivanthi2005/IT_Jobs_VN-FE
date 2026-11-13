import type { ReactNode } from "react";

const sizeClass = {
  sm: "h-12 w-12 rounded-xl",
  md: "h-14 w-14 rounded-2xl",
  lg: "h-[88px] w-[88px] rounded-2xl",
} as const;

/**
 * Company logo frame. Falls back to a monogram when no logo is uploaded,
 * so cards never render a broken <img>.
 */
export const LogoBox = ({
  src,
  name,
  size = "md",
  className = "",
}: {
  src?: string;
  name?: string;
  size?: keyof typeof sizeClass;
  className?: string;
}) => {
  const initials = (name || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`${sizeClass[size]} flex shrink-0 items-center justify-center overflow-hidden border border-ink-200 bg-white p-1.5 shadow-soft dark:border-white/10 dark:bg-white/[0.06] dark:shadow-none ${className}`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`Logo ${name ?? ""}`}
          loading="lazy"
          /* a logo file is usually drawn for a white page, so it keeps a light
             plate inside its tile even in dark mode — the tile is what changes.
             theme-ok: this surface must stay light on purpose. */
          className="h-full w-full rounded-[inherit] bg-white object-contain"
        />
      ) : (
        <span
          className="font-display text-base font-extrabold text-brand-700 dark:text-brand-300"
          aria-hidden="true"
        >
          {initials}
        </span>
      )}
    </div>
  );
};

export const IconTile = ({
  children,
  tone = "brand",
}: {
  children: ReactNode;
  tone?: "brand" | "success" | "warning" | "danger";
}) => {
  const tones = {
    brand: "bg-brand-50 text-brand-600 ring-brand-100",
    success: "bg-success-50 text-success-600 ring-success-500/15",
    warning: "bg-warning-50 text-warning-600 ring-warning-500/15",
    danger: "bg-danger-50 text-danger-600 ring-danger-500/15",
  } as const;

  return (
    <span
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ring-1 ring-inset ${tones[tone]}`}
    >
      {children}
    </span>
  );
};

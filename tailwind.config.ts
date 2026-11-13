import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      screens: {
        sm: "576px",
        md: "768px",
        lg: "992px",
        xl: "1216px",
        "2xl": "1400px",
      },
      colors: {
        brand: {
          50: "#F0F9FF",
          100: "#E0F2FE",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0369A1",
          700: "#075985",
          800: "#0C4A6E",
          900: "#082F49",
          950: "#041E30",
        },
        ink: {
          50: "#F8FAFC",
          /* The 100/200/300 steps are one notch darker than the stock slate ramp.
             At the stock values a `border-ink-200` measured 1.23:1 against a white
             card, which is why every card read as a borderless white blob on the
             light theme. Shifting the ramp down fixes ~40 call sites at once
             instead of editing each one. */
          100: "#E2E8F0",
          200: "#CBD5E1",
          300: "#B4C4D6",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#080F1D",
        },
        /* The 400 step is used on dark surfaces (hero badges, dark-mode alerts).
           It was missing from this ramp, so `text-success-400` produced no CSS at
           all and the text inherited its parent colour — which read as plain black
           on the light theme. Every ramp below now carries a full 50→900 range. */
        success: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
        },
        warning: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        danger: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
          950: "#450A0A",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        sm: "0.1875rem",
        md: "0.3125rem",
        lg: "0.375rem",
        xl: "0.4375rem",
        "2xl": "0.5rem",
        "3xl": "0.75rem",
        "4xl": "1rem",
        "5xl": "1.25rem",
      },
      boxShadow: {
        /* Card shadows are tuned for the light theme, where a white surface on
           #f1f5f9 needs a visible edge plus a lift. The first step (soft) is a
           hairline contact shadow; `card` is the default for `.surface`. */
        soft: "0 1px 2px 0 rgb(15 23 42 / 0.06), 0 1px 3px 0 rgb(15 23 42 / 0.10)",
        card: "0 1px 2px 0 rgb(15 23 42 / 0.08), 0 4px 12px -2px rgb(15 23 42 / 0.12), 0 0 0 1px rgb(15 23 42 / 0.04)",
        lift: "0 10px 28px -6px rgb(15 23 42 / 0.20), 0 3px 10px -2px rgb(15 23 42 / 0.10)",
        glow: "0 16px 48px -12px rgb(3 105 161 / 0.35)",
        inset: "inset 0 1px 0 0 rgb(255 255 255 / 0.08)",
      },
      backgroundImage: {
        "grid-light":
          "linear-gradient(to right, rgb(15 23 42 / 0.045) 1px, transparent 1px), linear-gradient(to bottom, rgb(15 23 42 / 0.045) 1px, transparent 1px)",
        "brand-fade":
          "linear-gradient(135deg, #082F49 0%, #075985 45%, #0369A1 100%)",
        "hero-mesh":
          "radial-gradient(60% 60% at 15% 20%, rgba(14,165,233,0.35) 0%, transparent 60%), radial-gradient(50% 50% at 85% 10%, rgba(22,163,74,0.22) 0%, transparent 55%), radial-gradient(70% 70% at 60% 100%, rgba(56,189,248,0.20) 0%, transparent 60%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "marquee-x": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in": "fade-in 0.4s ease-out both",
        "scale-in": "scale-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        shimmer: "shimmer 1.6s infinite",
        float: "float 6s ease-in-out infinite",
        "marquee-x": "marquee-x 32s linear infinite",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;

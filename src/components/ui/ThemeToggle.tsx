"use client";

import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa6";

const STORAGE_KEY = "itjobs-theme";

/**
 * Applies the stored theme before paint to avoid a flash of the wrong theme.
 * Inlined via <ThemeScript /> in the root layout.
 */
export const ThemeScript = () => (
  <script
    dangerouslySetInnerHTML={{
      __html: `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");var m=window.matchMedia("(prefers-color-scheme: dark)").matches;if(t==="dark"||(!t&&m)){document.documentElement.classList.add("dark")}}catch(e){}})();`,
    }}
  />
);

export const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      /* storage can be blocked; theme still applies for this session */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
      aria-pressed={mounted ? isDark : undefined}
      className={`inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-ink-500 transition-colors duration-200 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800 dark:hover:text-white ${className}`}
    >
      {mounted && isDark ? (
        <FaSun className="text-[15px]" aria-hidden="true" />
      ) : (
        <FaMoon className="text-[15px]" aria-hidden="true" />
      )}
    </button>
  );
};

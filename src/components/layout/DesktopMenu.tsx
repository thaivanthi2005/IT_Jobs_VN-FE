"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import type { MenuItem } from "./menu";

export const DesktopMenu = ({ items }: { items: MenuItem[] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const pathname = usePathname();

  /** A menu is "current" when the route starts with its href, so a detail page
   *  still lights up the section it belongs to. `/` only matches exactly. */
  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  // Close on Escape — keyboard users must be able to dismiss the mega menu.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenIndex(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <ul className="flex items-center gap-0.5">
      {items.map((menu, index) => {
        const hasMenu = Boolean(menu.columns?.length);
        const isOpen = openIndex === index;

        return (
          <li
            key={menu.name}
            className="relative"
            onMouseEnter={() => hasMenu && setOpenIndex(index)}
            onMouseLeave={() => hasMenu && setOpenIndex(null)}
          >
            {menu.highlight ? (
              <Link
                href={menu.link}
                className="ml-1 inline-flex items-center gap-1.5 rounded-md border border-success-500/25 bg-success-50 px-3 py-2 text-[13.5px] font-semibold text-success-700 transition-colors duration-200 hover:border-success-500/40 hover:bg-success-100 dark:border-success-600/40 dark:bg-success-600/15 dark:text-success-400 dark:hover:bg-success-600/25"
              >
                {menu.name}
                {menu.badge && (
                  <span className="rounded-full bg-success-600 px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none text-white">
                    {menu.badge}
                  </span>
                )}
              </Link>
            ) : hasMenu ? (
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-haspopup="true"
                className={`group relative inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-2 text-[13.5px] font-semibold transition-colors duration-200 ${
                  isOpen || isCurrent(menu.link)
                    ? "bg-brand-50 text-brand-700 dark:bg-ink-800 dark:text-brand-300"
                    : "text-ink-600 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-white"
                }`}
              >
                {menu.name}
                <FaChevronDown
                  className={`text-[9px] transition-transform duration-300 ease-out-expo ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
                {/* underline sweeps in from the left on hover, and stays for the
                    section the visitor is actually in */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-x-3 bottom-1 h-[2px] origin-left rounded-full bg-gradient-to-r from-brand-500 to-success-400 transition-transform duration-300 ease-out-expo ${
                    isCurrent(menu.link)
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </button>
            ) : (
              <Link
                href={menu.link}
                aria-current={isCurrent(menu.link) ? "page" : undefined}
                className={`group relative inline-flex rounded-md px-3 py-2 text-[13.5px] font-semibold transition-colors duration-200 ${
                  isCurrent(menu.link)
                    ? "text-brand-700 dark:text-brand-300"
                    : "text-ink-600 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-white"
                }`}
              >
                {menu.name}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-x-3 bottom-1 h-[2px] origin-left rounded-full bg-gradient-to-r from-brand-500 to-success-400 transition-transform duration-300 ease-out-expo ${
                    isCurrent(menu.link)
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            )}

            {hasMenu && isOpen && (
              <div className="absolute left-0 top-full z-50 pt-2 animate-fade-up">
                <div
                  className="max-w-[calc(100vw-2rem)] overflow-x-auto rounded-lg border border-ink-200 bg-white shadow-lift dark:border-ink-700 dark:bg-ink-900"
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${menu.columns!.length}, minmax(200px, 1fr))`,
                  }}
                >
                  {menu.columns!.map((column) => (
                    <div
                      key={column.title}
                      className="border-r border-ink-100 p-3 last:border-r-0 dark:border-ink-800"
                    >
                      <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-400">
                        {column.title}
                      </p>
                      <ul>
                        {column.items.map((leaf) => (
                          <li key={`${column.title}-${leaf.name}`}>
                            <Link
                              href={leaf.link}
                              className="group block rounded-md px-2 py-1.5 transition-colors duration-150 hover:bg-brand-50 dark:hover:bg-ink-800"
                            >
                              <span className="flex items-center gap-1.5">
                                <span className="text-[13px] font-medium text-ink-700 transition-colors group-hover:text-brand-700 dark:text-ink-200 dark:group-hover:text-brand-300">
                                  {leaf.name}
                                </span>
                                {leaf.badge && (
                                  <span className="rounded-full bg-brand-100 px-1.5 py-0.5 text-[9px] font-bold uppercase leading-none text-brand-700 dark:bg-brand-900/60 dark:text-brand-300">
                                    {leaf.badge}
                                  </span>
                                )}
                              </span>
                              {leaf.desc && (
                                <span className="mt-0.5 block text-[11px] leading-snug text-ink-400">
                                  {leaf.desc}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

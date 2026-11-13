"use client";

import Link from "next/link";
import { useState } from "react";
import { FaChevronDown, FaXmark } from "react-icons/fa6";
import { Logo } from "./Logo";
import type { MenuItem } from "./menu";

export const MobileMenu = ({
  items,
  open,
  onClose,
  footer,
}: {
  items: MenuItem[];
  open: boolean;
  onClose: () => void;
  footer: React.ReactNode;
}) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <>
      {/* Scrim */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-[80] bg-ink-950/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng"
        className={`fixed inset-y-0 left-0 z-[90] flex w-[86%] max-w-[340px] flex-col bg-white transition-transform duration-300 ease-out-expo dark:bg-ink-950 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4 dark:border-ink-800">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng menu"
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-ink-500 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800"
          >
            <FaXmark />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {items.map((menu) => {
              const hasMenu = Boolean(menu.columns?.length);
              const isExpanded = expanded === menu.name;

              if (menu.highlight) {
                return (
                  <li key={menu.name}>
                    <Link
                      href={menu.link}
                      onClick={onClose}
                      className="flex items-center gap-2 rounded-md border border-success-500/25 bg-success-50 px-3 py-2.5 text-sm font-semibold text-success-700 dark:border-success-600/40 dark:bg-success-600/15 dark:text-success-400"
                    >
                      {menu.name}
                      {menu.badge && (
                        <span className="rounded-full bg-success-600 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                          {menu.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              }

              return (
                <li key={menu.name}>
                  {hasMenu ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setExpanded(isExpanded ? null : menu.name)}
                        aria-expanded={isExpanded}
                        className="flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-semibold text-ink-800 hover:bg-ink-100 dark:text-ink-100 dark:hover:bg-ink-800"
                      >
                        {menu.name}
                        <FaChevronDown
                          className={`text-[10px] text-ink-400 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          aria-hidden="true"
                        />
                      </button>

                      {isExpanded && (
                        <div className="mb-1 ml-3 mt-1 space-y-3 border-l border-ink-200 pl-3 dark:border-ink-700">
                          {menu.columns!.map((column) => (
                            <div key={column.title}>
                              <p className="pb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-400">
                                {column.title}
                              </p>
                              <ul className="space-y-0.5">
                                {column.items.map((leaf) => (
                                  <li key={`${column.title}-${leaf.name}`}>
                                    <Link
                                      href={leaf.link}
                                      onClick={onClose}
                                      className="block rounded px-2 py-1.5 text-[13px] text-ink-600 hover:bg-brand-50 hover:text-brand-700 dark:text-ink-300 dark:hover:bg-ink-800"
                                    >
                                      {leaf.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={menu.link}
                      onClick={onClose}
                      className="block rounded-md px-3 py-2.5 text-sm font-semibold text-ink-800 hover:bg-ink-100 dark:text-ink-100 dark:hover:bg-ink-800"
                    >
                      {menu.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-ink-100 p-4 dark:border-ink-800">{footer}</div>
      </div>
    </>
  );
};

"use client";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

type PaginationProps = {
  page: number;
  totalPage: number | string | undefined | null;
  onChange: (page: number) => void;
  className?: string;
};

/** Builds a compact page window: 1 … 4 5 [6] 7 8 … 20 */
const getPageWindow = (current: number, total: number): (number | "gap")[] => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages: (number | "gap")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("gap");
  for (let index = start; index <= end; index += 1) pages.push(index);
  if (end < total - 1) pages.push("gap");
  pages.push(total);

  return pages;
};

export const Pagination = ({
  page,
  totalPage,
  onChange,
  className = "",
}: PaginationProps) => {
  const total = Math.max(0, Number(totalPage) || 0);
  if (total <= 0) return null;

  const current = Math.min(Math.max(1, Number(page) || 1), total);
  const pages = getPageWindow(current, total);

  const go = (next: number) => {
    if (next >= 1 && next <= total && next !== current) onChange(next);
  };

  return (
    <nav
      aria-label="Phân trang"
      className={`mt-10 flex flex-wrap items-center justify-center gap-1.5 ${className}`}
    >
      <button
        type="button"
        onClick={() => go(current - 1)}
        disabled={current === 1}
        aria-label="Trang trước"
        className="btn-outline h-10 w-10 p-0 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <FaChevronLeft className="text-xs" aria-hidden="true" />
      </button>

      {pages.map((item, index) =>
        item === "gap" ? (
          <span
            key={`gap-${index}`}
            className="px-1 text-sm font-semibold text-ink-400"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => go(item)}
            aria-current={item === current ? "page" : undefined}
            aria-label={`Trang ${item}`}
            className={
              item === current
                ? "btn h-10 min-w-10 border border-brand-600 bg-brand-600 p-0 px-3 text-white shadow-soft"
                : "btn-outline h-10 min-w-10 p-0 px-3"
            }
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => go(current + 1)}
        disabled={current === total}
        aria-label="Trang sau"
        className="btn-outline h-10 w-10 p-0 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <FaChevronRight className="text-xs" aria-hidden="true" />
      </button>
    </nav>
  );
};

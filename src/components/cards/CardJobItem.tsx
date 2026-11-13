import Link from "next/link";
import {
  FaArrowUpRightFromSquare,
  FaBriefcase,
  FaLocationDot,
  FaUserTie,
} from "react-icons/fa6";
import { LogoBox } from "@/components/ui/LogoBox";
import { getPositionLabel, getWorkingFormLabel } from "@/config/variable";
import type { JobCard as JobCardType } from "@/types/api";

const formatSalary = (min: number, max: number) => {
  if (!min && !max) return "Thương lượng";
  const fmt = (value: number) => `${Number(value).toLocaleString("vi-VN")}$`;
  return `${fmt(min)} – ${fmt(max)}`;
};

/** Shared shell classes, so the two card variants look identical. */
export const cardShell =
  "surface-interactive group flex h-full cursor-pointer flex-col p-5 focus-visible:-translate-y-1";

/**
 * The card's contents, shared by the server presentation and the client wrapper.
 *
 * Keeping the markup in one place means `CardJobItem` and `JobCardLink` cannot
 * drift apart: the server component is the source of truth, and the client copy
 * differs only in whether it intercepts the click.
 */
export const CardJobBody = ({ item }: { item: JobCardType }) => (
  <>
    <div className="flex items-start gap-3.5">
      <LogoBox src={item.companyLogo} name={item.companyName} size="sm" />
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 font-display text-[15px] font-bold leading-snug text-ink-900 transition-colors duration-200 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
          {item.title}
        </h3>
        <p className="mt-1 truncate text-[13px] font-medium text-ink-500 dark:text-ink-400">
          {item.companyName}
        </p>
      </div>
      <FaArrowUpRightFromSquare
        className="mt-1 shrink-0 text-[11px] text-ink-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-ink-600"
        aria-hidden="true"
      />
    </div>

    <div className="mt-4 flex flex-wrap gap-1.5">
      <span className="badge-brand">
        <FaUserTie className="text-[10px]" aria-hidden="true" />
        {getPositionLabel(item.position)}
      </span>
      <span className="badge-neutral">
        <FaBriefcase className="text-[10px]" aria-hidden="true" />
        {getWorkingFormLabel(item.workingForm)}
      </span>
    </div>

    <div className="mt-3 flex items-center gap-1.5 text-[13px] text-ink-500 dark:text-ink-400">
      <FaLocationDot className="text-[12px] text-ink-400" aria-hidden="true" />
      <span className="truncate">{item.companyCity || "Đang cập nhật"}</span>
    </div>

    <div className="mt-auto pt-4">
      <div className="flex flex-wrap gap-1.5">
        {item.technologies.slice(0, 4).map((tech) => (
          <span key={tech} className="chip">
            {tech}
          </span>
        ))}
        {item.technologies.length > 4 && (
          <span className="chip">+{item.technologies.length - 4}</span>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3.5 dark:border-ink-800">
        <span className="font-display text-[15px] font-extrabold text-success-600 dark:text-success-500">
          {formatSalary(item.salaryMin, item.salaryMax)}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
          Xem chi tiết
        </span>
      </div>
    </div>
  </>
);

/**
 * A job card, server-rendered.
 *
 * It carries a real `href` and no event handlers, so it works with JavaScript
 * off, in crawlers, and with middle-click. Interactivity lives in `JobCardLink` —
 * a function cannot be passed from a server component into the client tree, which
 * is what Next rejected with "Event handlers cannot be passed to Client Component
 * props".
 */
export const CardJobItem = ({ item }: { item: JobCardType }) => (
  <Link href={`/job/detail/${item.id}`} className={cardShell}>
    <CardJobBody item={item} />
  </Link>
);

export const CardJobSkeleton = () => (
  <div className="surface h-[232px] p-5">
    <div className="flex gap-3.5">
      <div className="skeleton h-12 w-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-4/5" />
        <div className="skeleton h-3 w-1/2" />
      </div>
    </div>
    <div className="mt-4 flex gap-2">
      <div className="skeleton h-6 w-20 rounded-full" />
      <div className="skeleton h-6 w-24 rounded-full" />
    </div>
    <div className="mt-6 space-y-2">
      <div className="skeleton h-3 w-2/3" />
      <div className="skeleton h-8 w-full" />
    </div>
  </div>
);

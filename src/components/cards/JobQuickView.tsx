"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FaBriefcase,
  FaBuilding,
  FaLocationDot,
  FaMoneyBillWave,
  FaUserTie,
  FaXmark,
  FaArrowRight,
} from "react-icons/fa6";
import { LogoBox } from "@/components/ui/LogoBox";
import { getPositionLabel, getWorkingFormLabel } from "@/config/variable";
import { formatSalary } from "@/lib/format";
import { setScenePaused } from "@/lib/scene-pause";
import type { JobCard } from "@/types/api";

/**
 * Quick-view modal for a job card.
 *
 * Clicking a card opens this instead of navigating, so the visitor can read the
 * essentials without losing their place in the list; the primary button still
 * leads to the full detail page.
 *
 * - three ways to close: the X button, a backdrop click, and Escape;
 * - focus moves into the dialog on open, Tab is trapped, focus returns on close;
 * - the page behind stops scrolling and the ambient 3D scenes pause.
 */
export const JobQuickView = ({
  job,
  onClose,
}: {
  job: JobCard | null;
  onClose: () => void;
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  const open = Boolean(job);

  const handleBackdrop = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      /* only a press on the backdrop itself closes; a drag that started inside
         the panel and ended outside must not */
      if (event.target === event.currentTarget) onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;

    restoreFocus.current = document.activeElement as HTMLElement | null;
    setScenePaused(true);

    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 20);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      setScenePaused(false);
      restoreFocus.current?.focus?.();
    };
  }, [open, onClose]);

  if (!job) return null;

  const meta = [
    { Icon: FaUserTie, label: "Cấp bậc", value: getPositionLabel(job.position) },
    { Icon: FaBriefcase, label: "Hình thức", value: getWorkingFormLabel(job.workingForm) },
    { Icon: FaMoneyBillWave, label: "Mức lương", value: formatSalary(job.salaryMin, job.salaryMax) },
    { Icon: FaLocationDot, label: "Địa điểm", value: job.companyCity || "Đang cập nhật" },
  ];

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[120] flex items-end justify-center bg-ink-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="presentation"
      onMouseDown={handleBackdrop}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-quick-view-title"
        className="surface animate-scale-in relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl p-0 shadow-lift sm:rounded-2xl"
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-brand-600 via-brand-500 to-success-500" />

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Đóng chi tiết công việc"
          className="absolute right-3 top-4 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-900 dark:hover:bg-ink-800 dark:hover:text-white"
        >
          <FaXmark className="text-[15px]" aria-hidden="true" />
        </button>

        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-3.5 pr-10">
            <LogoBox src={job.companyLogo} name={job.companyName} size="md" />
            <div className="min-w-0 flex-1">
              <h2
                id="job-quick-view-title"
                className="font-display text-[19px] font-extrabold leading-snug tracking-tight text-ink-900 dark:text-white sm:text-[22px]"
              >
                {job.title}
              </h2>
              <p className="mt-1.5 flex items-center gap-1.5 text-[13.5px] font-medium text-ink-600 dark:text-ink-300">
                <FaBuilding className="text-[11px] text-ink-400" aria-hidden="true" />
                <span className="truncate">{job.companyName}</span>
              </p>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {meta.map(({ Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl bg-ink-50 px-3.5 py-2.5 dark:bg-ink-900/60"
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600 ring-1 ring-inset ring-ink-200 dark:bg-ink-800 dark:text-brand-300 dark:ring-ink-700">
                  <Icon className="text-[12px]" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10.5px] font-bold uppercase tracking-wider text-ink-400">
                    {label}
                  </span>
                  <span className="block truncate text-[13px] font-semibold text-ink-800 dark:text-ink-100">
                    {value}
                  </span>
                </span>
              </div>
            ))}
          </dl>

          {job.technologies.length > 0 && (
            <div className="mt-5">
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-ink-400">
                Công nghệ yêu cầu
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {job.technologies.map((tech) => (
                  <span key={tech} className="chip">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-2 border-t border-ink-100 pt-5 dark:border-ink-800 sm:flex-row sm:items-center sm:justify-end">
            <button type="button" onClick={onClose} className="btn-ghost order-2 sm:order-1">
              Đóng
            </button>
            <Link
              href={`/job/detail/${job.id}`}
              className="btn-primary order-1 justify-center sm:order-2"
            >
              Ứng tuyển ngay
              <FaArrowRight className="text-[11px]" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

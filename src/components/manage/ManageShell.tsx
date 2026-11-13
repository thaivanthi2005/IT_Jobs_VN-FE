import Link from "next/link";
import type { ReactNode } from "react";
import {
  FaBriefcase,
  FaFileLines,
  FaUser,
} from "react-icons/fa6";

export type ManageNavItem = {
  label: string;
  href: string;
  Icon: typeof FaUser;
};

export const userNav: ManageNavItem[] = [
  { label: "Thông tin cá nhân", href: "/user-manage/profile", Icon: FaUser },
  { label: "CV đã gửi", href: "/user-manage/cv/list", Icon: FaFileLines },
];

export const companyNav: ManageNavItem[] = [
  { label: "Thông tin công ty", href: "/company-manage/profile", Icon: FaUser },
  { label: "Quản lý công việc", href: "/company-manage/job/list", Icon: FaBriefcase },
  { label: "Quản lý CV", href: "/company-manage/cv/list", Icon: FaFileLines },
];

export const ManageShell = ({
  title,
  description,
  nav,
  activeHref,
  action,
  children,
}: {
  title: string;
  description?: string;
  nav: ManageNavItem[];
  activeHref: string;
  action?: ReactNode;
  children: ReactNode;
}) => (
  <div className="bg-ink-50/50 py-8 dark:bg-ink-950/40 sm:py-12">
    <div className="container-page">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="heading-md">{title}</h1>
          {description && <p className="text-body mt-1.5">{description}</p>}
        </div>
        {action}
      </div>

      <div className="grid gap-6 lg:grid-cols-[248px_1fr]">
        <nav aria-label="Điều hướng quản lý" className="lg:sticky lg:top-24 lg:self-start">
          <ul className="flex gap-2 overflow-x-auto pb-1 scrollbar-none lg:flex-col lg:overflow-visible lg:pb-0">
            {nav.map(({ label, href, Icon }) => {
              const isActive = activeHref.startsWith(href);
              return (
                <li key={href} className="shrink-0 lg:w-full">
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center gap-2.5 whitespace-nowrap rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-colors duration-200 ${
                      isActive
                        ? "bg-brand-600 text-white shadow-soft"
                        : "border border-ink-200 bg-white text-ink-600 hover:border-brand-300 hover:text-brand-700 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-300 dark:hover:border-brand-600 dark:hover:text-brand-300"
                    }`}
                  >
                    <Icon className="text-[12px]" aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  </div>
);

import Link from "next/link";
import {
  FaBriefcase,
  FaBuilding,
  FaLocationDot,
  FaMoneyBillWave,
  FaUserTie,
} from "react-icons/fa6";
import { LogoBox } from "@/components/ui/LogoBox";
import { getPositionLabel, getWorkingFormLabel } from "@/config/variable";
import { formatSalary } from "@/lib/format";
import type { JobDetail } from "@/types/api";

export const JobHeaderCard = ({ job }: { job: JobDetail }) => {
  const meta = [
    { Icon: FaUserTie, label: "Cấp bậc", value: getPositionLabel(job.position) },
    { Icon: FaBriefcase, label: "Hình thức", value: getWorkingFormLabel(job.workingForm) },
    {
      Icon: FaMoneyBillWave,
      label: "Mức lương",
      value: formatSalary(job.salaryMin, job.salaryMax),
    },
    { Icon: FaLocationDot, label: "Địa điểm", value: job.companyAddress || "Đang cập nhật" },
  ];

  return (
    <div className="surface overflow-hidden">
      <div className="h-2 w-full bg-gradient-to-r from-brand-600 via-brand-500 to-success-500" />
      <div className="p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <LogoBox src={job.companyLogo} name={job.companyName} size="lg" />
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap gap-1.5">
              <span className="badge-brand">{getPositionLabel(job.position)}</span>
              <span className="badge-neutral">{getWorkingFormLabel(job.workingForm)}</span>
            </div>
            <h1 className="font-display text-[24px] font-extrabold leading-tight tracking-tight text-ink-900 dark:text-white sm:text-[30px]">
              {job.title}
            </h1>
            <p className="mt-2 flex items-center gap-2 text-[14px] font-medium text-ink-600 dark:text-ink-300">
              <FaBuilding className="text-[12px] text-ink-400" aria-hidden="true" />
              {job.companyName}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {meta.map(({ Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl bg-ink-50 px-4 py-3 dark:bg-ink-900/60"
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
        </div>

        {job.technologies.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-ink-400">
              Công nghệ sử dụng
            </p>
            <div className="flex flex-wrap gap-1.5">
              {job.technologies.map((tech) => (
                <span key={tech} className="chip">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        <Link href="#ung-tuyen" className="btn-primary btn-lg mt-6 w-full sm:w-auto">
          Ứng tuyển ngay
        </Link>
      </div>
    </div>
  );
};

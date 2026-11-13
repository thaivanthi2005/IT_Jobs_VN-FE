import Link from "next/link";
import { FaBriefcase, FaBuilding, FaClock, FaUserTie } from "react-icons/fa6";
import { formatSalary } from "@/lib/format";
import type { JobDetail } from "@/types/api";

export const JobSidebar = ({ job }: { job: JobDetail }) => {
  const companyFacts = [
    { Icon: FaBuilding, label: "Mô hình", value: job.companyModel },
    { Icon: FaUserTie, label: "Quy mô", value: job.companyEmployees },
    { Icon: FaClock, label: "Giờ làm việc", value: job.companyWorkingTime },
    { Icon: FaBriefcase, label: "Ngoài giờ", value: job.companyWorkOvertime },
  ].filter((row) => Boolean(row.value));

  return (
    <aside className="w-full shrink-0 lg:w-[330px]">
      <div className="space-y-5 lg:sticky lg:top-24">
        <div className="surface p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-400">
            Mức lương
          </p>
          <p className="mt-1.5 font-display text-2xl font-extrabold text-success-600 dark:text-success-500">
            {formatSalary(job.salaryMin, job.salaryMax)}
          </p>
          <Link href="#ung-tuyen" className="btn-primary mt-4 w-full">
            Gửi CV ứng tuyển
          </Link>
        </div>

        <div className="surface p-6">
          <h3 className="font-display text-[14px] font-bold text-ink-900 dark:text-white">
            Thông tin công ty
          </h3>
          <div className="mt-4 space-y-3">
            {companyFacts.map(({ Icon, label, value }) => (
              <div key={label} className="flex items-start gap-2.5">
                <Icon className="mt-0.5 shrink-0 text-[11px] text-ink-400" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-[10.5px] font-bold uppercase tracking-wider text-ink-400">
                    {label}
                  </p>
                  <p className="text-[13px] font-medium text-ink-700 dark:text-ink-200">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link href={`/company/detail/${job.companyId}`} className="btn-outline mt-5 w-full">
            Xem trang công ty
          </Link>
        </div>
      </div>
    </aside>
  );
};

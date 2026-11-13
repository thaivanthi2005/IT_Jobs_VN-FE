import Link from "next/link";
import {
  FaArrowLeft,
  FaBriefcase,
  FaBuilding,
  FaClock,
  FaLocationDot,
  FaUserTie,
} from "react-icons/fa6";
import { CardJobItem } from "@/components/cards/CardJobItem";
import { LogoBox } from "@/components/ui/LogoBox";
import type { CompanyDetail, JobCard } from "@/types/api";

export const CompanyDetailView = ({
  company,
  jobList,
}: {
  company: CompanyDetail;
  jobList: JobCard[];
}) => {
  const facts = [
    { Icon: FaBuilding, label: "Mô hình công ty", value: company.companyModel },
    { Icon: FaUserTie, label: "Quy mô", value: company.companyEmployees },
    { Icon: FaClock, label: "Thời gian làm việc", value: company.workingTime },
    { Icon: FaBriefcase, label: "Làm ngoài giờ", value: company.workOvertime },
  ].filter((row) => Boolean(row.value));

  return (
    <div className="bg-ink-50/50 py-8 dark:bg-ink-950/40 sm:py-12">
      <div className="container-page">
        <Link
          href="/company/list"
          className="mb-5 inline-flex items-center gap-2 text-[13px] font-semibold text-ink-500 transition-colors hover:text-brand-600 dark:text-ink-400"
        >
          <FaArrowLeft className="text-[10px]" aria-hidden="true" />
          Danh sách công ty
        </Link>

        {/* No `overflow-hidden` anywhere in this header. The cover is painted by two
            stacked backgrounds, and a rounded corner on a background clips itself —
            so giving `rounded-t-lg` to both the banner and its mesh child is enough.
            `overflow-hidden` would instead cut the logo that the negative margin
            below pulls up into this banner, which is the bug this fixed. */}
        <div className="surface">
          <div className="relative h-32 rounded-t-lg bg-brand-fade sm:h-40">
            <div
              className="absolute inset-0 rounded-t-lg bg-hero-mesh opacity-70"
              aria-hidden="true"
            />
          </div>
          {/* `relative z-10` is load-bearing, not decoration: the cover above is
              positioned, and a positioned element paints after a static sibling, so
              without this the banner drew over the logo that is pulled up into it
              by the negative margin below. */}
          <div className="relative z-10 px-6 pb-6 sm:px-8 sm:pb-8">
            <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end">
              <LogoBox
                src={company.logo}
                name={company.companyName}
                size="lg"
                className="border-4 border-white shadow-lift dark:border-ink-900"
              />
              <div className="min-w-0 flex-1 sm:pb-1">
                <h1 className="font-display text-[24px] font-extrabold tracking-tight text-ink-900 dark:text-white sm:text-[30px]">
                  {company.companyName}
                </h1>
                {company.address && (
                  <p className="mt-1.5 flex items-center gap-2 text-[13px] text-ink-500 dark:text-ink-400">
                    <FaLocationDot className="text-[12px]" aria-hidden="true" />
                    {company.address}
                  </p>
                )}
              </div>
              <Link
                href={`/search?company=${encodeURIComponent(company.companyName)}`}
                className="btn-primary shrink-0"
              >
                Xem việc làm ({jobList.length})
              </Link>
            </div>

            {facts.length > 0 && (
              <div className="mt-6 grid grid-cols-1 gap-3 border-t border-ink-100 pt-6 dark:border-ink-800 sm:grid-cols-2 lg:grid-cols-4">
                {facts.map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-2.5">
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                      <Icon className="text-[11px]" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10.5px] font-bold uppercase tracking-wider text-ink-400">
                        {label}
                      </span>
                      <span className="block text-[13px] font-semibold text-ink-800 dark:text-ink-100">
                        {value}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {company.description && (
          <div className="surface mt-6 p-6 sm:p-8">
            <h2 className="mb-4 font-display text-lg font-bold text-ink-900 dark:text-white">
              Giới thiệu công ty
            </h2>
            <div className="rich-text" dangerouslySetInnerHTML={{ __html: company.description }} />
          </div>
        )}

        <div className="mt-10">
          <div className="mb-6">
            <h2 className="heading-md">{jobList.length} việc làm đang tuyển</h2>
            <p className="text-body mt-1">Cơ hội nghề nghiệp tại {company.companyName}.</p>
          </div>

          {jobList.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {jobList.map((job) => (
                <CardJobItem key={job.id} item={job} />
              ))}
            </div>
          ) : (
            <div className="surface p-10 text-center">
              <p className="text-sm text-ink-500 dark:text-ink-400">
                Công ty hiện chưa có tin tuyển dụng nào.
              </p>
              <Link href="/search" className="btn-outline mt-5">
                Khám phá việc làm khác
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

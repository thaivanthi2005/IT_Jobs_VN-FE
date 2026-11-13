import Link from "next/link";
import { FaArrowRight, FaLocationDot } from "react-icons/fa6";
import { LogoBox } from "@/components/ui/LogoBox";
import type { CompanyCard } from "@/types/api";

export const CardCompanyItem = ({ item }: { item: CompanyCard }) => (
  <Link
    href={`/company/detail/${item.id}`}
    className="surface-interactive group flex h-full flex-col items-center p-6 text-center focus-visible:-translate-y-1"
  >
    <LogoBox src={item.logo} name={item.companyName} size="lg" />
    <h3 className="mt-4 line-clamp-2 font-display text-[15px] font-bold leading-snug text-ink-900 transition-colors duration-200 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
      {item.companyName}
    </h3>
    <div className="mt-2 flex items-center gap-1.5 text-[13px] text-ink-500 dark:text-ink-400">
      <FaLocationDot className="text-[12px]" aria-hidden="true" />
      <span className="truncate">{item.cityName || "Toàn quốc"}</span>
    </div>

    <div className="mt-auto w-full pt-5">
      <div className="flex items-center justify-between rounded-xl bg-ink-50 px-3.5 py-2.5 dark:bg-ink-900/60">
        <span className="text-[12px] font-semibold text-ink-600 dark:text-ink-300">
          <span className="font-display text-sm font-extrabold text-brand-700 dark:text-brand-300">
            {item.totalJob}
          </span>{" "}
          việc làm
        </span>
        <FaArrowRight
          className="text-[11px] text-brand-500 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
          aria-hidden="true"
        />
      </div>
    </div>
  </Link>
);

export const CardCompanySkeleton = () => (
  <div className="surface flex h-[248px] flex-col items-center p-6">
    <div className="skeleton h-[88px] w-[88px] rounded-2xl" />
    <div className="skeleton mt-4 h-4 w-3/4" />
    <div className="skeleton mt-2 h-3 w-1/2" />
    <div className="skeleton mt-auto h-10 w-full rounded-xl" />
  </div>
);

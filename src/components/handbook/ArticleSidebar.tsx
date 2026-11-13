import Link from "next/link";
import { FaCheck } from "react-icons/fa6";
import type { Article } from "@/config/handbook/article-types";

export const ArticleSidebar = ({ article }: { article: Article }) => (
  <aside className="w-full shrink-0 lg:w-[300px]">
    <div className="space-y-5 lg:sticky lg:top-24">
      <div className="surface p-5">
        <h2 className="font-display text-[13px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400">
          Checklist nhanh
        </h2>
        <ul className="mt-3 space-y-2">
          {article.checklist.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <FaCheck
                className="mt-1 shrink-0 text-[9px] text-success-600 dark:text-success-500"
                aria-hidden="true"
              />
              <span className="text-[12px] leading-relaxed text-ink-600 dark:text-ink-300">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="surface bg-brand-fade p-5">
        <p className="font-display text-[13.5px] font-bold text-white">Sẵn sàng ứng tuyển?</p>
        <p className="mt-1.5 text-[12px] leading-relaxed text-brand-100/80">
          Áp dụng ngay những gì vừa đọc vào hồ sơ của bạn.
        </p>
        <Link
          href={article.relatedJobsQuery}
          className="btn mt-3.5 w-full bg-white py-2 text-[12.5px] font-bold text-brand-800 hover:bg-brand-50"
        >
          Xem việc làm IT
        </Link>
      </div>
    </div>
  </aside>
);

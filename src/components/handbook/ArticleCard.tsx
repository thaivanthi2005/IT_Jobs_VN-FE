import Link from "next/link";
import { FaArrowRight, FaClockRotateLeft } from "react-icons/fa6";
import { categoryTone } from "@/config/handbook/articles";
import type { Article } from "@/config/handbook/article-types";

export const ArticleCard = ({ article }: { article: Article }) => (
  <Link
    href={`/cam-nang/${article.slug}`}
    className="surface-interactive group flex h-full flex-col p-5"
  >
    <div className="flex items-center gap-2">
      <span className={categoryTone(article.category)}>{article.category}</span>
      <span className="text-[11px] font-medium text-ink-400">{article.readingTime}</span>
    </div>

    <h3 className="mt-3 font-display text-[15px] font-bold leading-snug text-ink-900 transition-colors group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
      {article.title}
    </h3>

    <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">
      {article.summary}
    </p>

    <div className="mt-auto flex items-center justify-between border-t border-ink-100 pt-3.5 dark:border-ink-800">
      <span className="inline-flex items-center gap-1.5 text-[11.5px] text-ink-400">
        <FaClockRotateLeft className="text-[10px]" aria-hidden="true" />
        Cập nhật {article.updatedAt}
      </span>
      <span className="inline-flex items-center gap-1 text-[11.5px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
        Đọc
        <FaArrowRight
          className="text-[9px] transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </span>
    </div>
  </Link>
);

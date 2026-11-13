import Link from "next/link";
import type { Roadmap } from "@/config/handbook/types";

const levelTone: Record<Roadmap["level"], string> = {
  "Cơ bản": "badge-success",
  "Trung cấp": "badge-brand",
  "Nâng cao": "badge-warning",
};

export const RoadmapCard = ({ roadmap }: { roadmap: Roadmap }) => (
  <Link
    href={`/cam-nang/lo-trinh/${roadmap.slug}`}
    className="surface-interactive group flex h-full flex-col p-5"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="font-display text-[15px] font-bold text-ink-900 transition-colors group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
          {roadmap.title}
        </h3>
        <p className="mt-1 text-[11.5px] font-semibold uppercase tracking-wider text-ink-400">
          {roadmap.duration}
        </p>
      </div>
      <span className={levelTone[roadmap.level]}>{roadmap.level}</span>
    </div>

    <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">
      {roadmap.summary}
    </p>

    <div className="mt-auto pt-4">
      <div className="flex items-center justify-between border-t border-ink-100 pt-3 dark:border-ink-800">
        <span className="text-[11.5px] font-semibold text-ink-500 dark:text-ink-400">
          {roadmap.stages.length} giai đoạn ·{" "}
          {roadmap.stages.reduce((sum, stage) => sum + stage.nodes.length, 0)} chủ đề
        </span>
        <span className="text-[11.5px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          Xem lộ trình
        </span>
      </div>
    </div>
  </Link>
);

import Link from "next/link";
import { FaCircleCheck, FaRegCircle } from "react-icons/fa6";
import type { RoadmapStage } from "@/config/handbook/types";

export const StageTimeline = ({
  stage,
  index,
  isLast,
}: {
  stage: RoadmapStage;
  index: number;
  isLast: boolean;
}) => (
  <li id={stage.id} className="relative scroll-mt-24 pl-10 sm:pl-12">
    {/* Spine + node */}
    {!isLast && (
      <span
        className="absolute left-[15px] top-8 h-full w-0.5 bg-ink-200 dark:bg-ink-700 sm:left-[19px]"
        aria-hidden="true"
      />
    )}
    <span
      className="absolute left-0 top-1 inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-brand-500 bg-white font-display text-[12px] font-extrabold text-brand-600 dark:bg-ink-900 dark:text-brand-300 sm:h-10 sm:w-10 sm:text-[13px]"
      aria-hidden="true"
    >
      {index + 1}
    </span>

    <div className="pb-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-[16px] font-bold text-ink-900 dark:text-white sm:text-[17px]">
          {stage.title}
        </h3>
        <span className="badge-neutral">{stage.duration}</span>
      </div>
      <p className="mt-1 text-[12.5px] text-ink-500 dark:text-ink-400">{stage.subtitle}</p>

      <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {stage.nodes.map((node) => (
          <li
            key={node.id}
            className="rounded-md border border-ink-200 bg-white p-3.5 transition-colors duration-200 hover:border-brand-300 dark:border-ink-700 dark:bg-ink-900 dark:hover:border-brand-600"
          >
            <div className="flex items-start gap-2">
              {node.optional ? (
                <FaRegCircle
                  className="mt-1 shrink-0 text-[10px] text-ink-400"
                  aria-hidden="true"
                />
              ) : (
                <FaCircleCheck
                  className="mt-1 shrink-0 text-[10px] text-success-600 dark:text-success-500"
                  aria-hidden="true"
                />
              )}
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-ink-900 dark:text-white">
                  {node.title}
                  {node.optional && (
                    <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-400">
                      tuỳ chọn
                    </span>
                  )}
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-ink-500 dark:text-ink-400">
                  {node.desc}
                </p>
                {node.tags && node.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {node.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-semibold text-ink-600 dark:bg-ink-800 dark:text-ink-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </li>
);

export const StageNav = ({ stages }: { stages: RoadmapStage[] }) => (
  <nav aria-label="Mục lục lộ trình">
    <ol className="space-y-1">
      {stages.map((stage, index) => (
        <li key={stage.id}>
          <Link
            href={`#${stage.id}`}
            className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[12.5px] font-medium text-ink-600 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-brand-300"
          >
            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink-100 text-[10px] font-bold text-ink-500 dark:bg-ink-800 dark:text-ink-400">
              {index + 1}
            </span>
            <span className="truncate">{stage.title}</span>
          </Link>
        </li>
      ))}
    </ol>
  </nav>
);

import Link from "next/link";
import { FaLayerGroup } from "react-icons/fa6";
import type { Roadmap } from "@/config/handbook/types";

export const RoadmapHero = ({ roadmap }: { roadmap: Roadmap }) => {
  const totalNodes = roadmap.stages.reduce((sum, stage) => sum + stage.nodes.length, 0);

  return (
    <div className="surface overflow-hidden">
      <div className="h-1.5 w-full bg-gradient-to-r from-brand-600 via-brand-500 to-success-500" />
      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge-brand">
            <FaLayerGroup className="text-[9px]" aria-hidden="true" />
            Lộ trình
          </span>
          <span className="badge-neutral">{roadmap.level}</span>
          <span className="badge-neutral">{roadmap.duration}</span>
        </div>

        <h1 className="mt-3 heading-lg">{roadmap.title}</h1>
        <p className="text-body mt-2 max-w-2xl">{roadmap.summary}</p>

        <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-ink-100 pt-5 dark:border-ink-800 sm:grid-cols-4">
          {[
            { label: "Giai đoạn", value: `${roadmap.stages.length}` },
            { label: "Chủ đề", value: `${totalNodes}` },
            { label: "Thời lượng", value: roadmap.duration },
            { label: "Cấp độ", value: roadmap.level },
          ].map((stat) => (
            <div key={stat.label}>
              <dt className="text-[10.5px] font-bold uppercase tracking-wider text-ink-400">
                {stat.label}
              </dt>
              <dd className="mt-0.5 font-display text-[15px] font-extrabold text-ink-900 dark:text-white">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export const RoadmapSidebar = ({ roadmap }: { roadmap: Roadmap }) => (
  <aside className="w-full shrink-0 lg:w-[280px]">
    <div className="space-y-5 lg:sticky lg:top-24">
      <div className="surface p-5">
        <h2 className="mb-3 font-display text-[13px] font-bold uppercase tracking-wider text-ink-500 dark:text-ink-400">
          Mục lục
        </h2>
        <StageNavList stages={roadmap.stages} />
      </div>

      <div className="surface bg-brand-fade p-5">
        <p className="font-display text-[13.5px] font-bold text-white">
          Áp dụng ngay vào thực tế
        </p>
        <p className="mt-1.5 text-[12px] leading-relaxed text-brand-100/80">
          Xem các vị trí {roadmap.shortTitle} đang tuyển để biết thị trường cần gì.
        </p>
        <Link
          href="/search"
          className="btn mt-3.5 w-full bg-white py-2 text-[12.5px] font-bold text-brand-800 hover:bg-brand-50"
        >
          Xem việc làm
        </Link>
      </div>
    </div>
  </aside>
);

const StageNavList = ({ stages }: { stages: Roadmap["stages"] }) => (
  <nav aria-label="Mục lục lộ trình">
    <ol className="space-y-1">
      {stages.map((stage, index) => (
        <li key={stage.id}>
          <a
            href={`#${stage.id}`}
            className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[12.5px] font-medium text-ink-600 transition-colors hover:bg-brand-50 hover:text-brand-700 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-brand-300"
          >
            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink-100 text-[10px] font-bold text-ink-500 dark:bg-ink-800 dark:text-ink-400">
              {index + 1}
            </span>
            <span className="truncate">{stage.title}</span>
          </a>
        </li>
      ))}
    </ol>
  </nav>
);

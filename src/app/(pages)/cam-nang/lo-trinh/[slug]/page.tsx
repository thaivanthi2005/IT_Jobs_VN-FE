import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowLeft, FaArrowUpRightFromSquare, FaCheck } from "react-icons/fa6";
import { StageTimeline } from "@/components/handbook/StageTimeline";
import { RoadmapCard } from "@/components/handbook/RoadmapCard";
import { RoadmapHero, RoadmapSidebar } from "@/components/handbook/RoadmapHero";
import { getRelatedRoadmaps, getRoadmap, roadmaps } from "@/config/handbook";

export function generateStaticParams() {
  return roadmaps.map((roadmap) => ({ slug: roadmap.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const roadmap = getRoadmap(slug);
  if (!roadmap) return { title: "Không tìm thấy lộ trình" };
  return { title: roadmap.title, description: roadmap.summary };
}

export default async function RoadmapDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const roadmap = getRoadmap(slug);

  if (!roadmap) notFound();

  const related = getRelatedRoadmaps(roadmap);

  return (
    <div className="bg-ink-50/50 py-8 dark:bg-ink-950/40 sm:py-12">
      <div className="container-page">
        <Link
          href="/cam-nang"
          className="mb-5 inline-flex items-center gap-2 text-[13px] font-semibold text-ink-500 transition-colors hover:text-brand-600 dark:text-ink-400"
        >
          <FaArrowLeft className="text-[10px]" aria-hidden="true" />
          Cẩm nang IT
        </Link>

        <RoadmapHero roadmap={roadmap} />

        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          <div className="min-w-0 flex-1 space-y-6">
            <div className="surface p-6 sm:p-8">
              <h2 className="font-display text-[15px] font-bold text-ink-900 dark:text-white">
                Bạn sẽ đạt được gì
              </h2>
              <ul className="mt-4 space-y-2.5">
                {roadmap.outcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-2.5">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-50 text-success-600 ring-1 ring-inset ring-success-500/20 dark:bg-success-600/15 dark:text-success-500">
                      <FaCheck className="text-[9px]" aria-hidden="true" />
                    </span>
                    <span className="text-[13px] leading-relaxed text-ink-600 dark:text-ink-300">
                      {outcome}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface p-6 sm:p-8">
              <h2 className="mb-6 font-display text-[15px] font-bold text-ink-900 dark:text-white">
                Các giai đoạn
              </h2>
              <ol>
                {roadmap.stages.map((stage, index) => (
                  <StageTimeline
                    key={stage.id}
                    stage={stage}
                    index={index}
                    isLast={index === roadmap.stages.length - 1}
                  />
                ))}
              </ol>
            </div>

            <div className="surface p-6 sm:p-8">
              <h2 className="font-display text-[15px] font-bold text-ink-900 dark:text-white">
                Tài liệu nên đọc
              </h2>
              <ul className="mt-4 divide-y divide-ink-100 dark:divide-ink-800">
                {roadmap.resources.map((resource) => (
                  <li key={resource.href}>
                    <a
                      href={resource.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex items-start justify-between gap-3 py-2.5"
                    >
                      <span className="min-w-0">
                        <span className="block text-[13px] font-semibold text-ink-800 transition-colors group-hover:text-brand-700 dark:text-ink-100 dark:group-hover:text-brand-300">
                          {resource.title}
                        </span>
                        {resource.note && (
                          <span className="mt-0.5 block text-[11.5px] text-ink-400">
                            {resource.note}
                          </span>
                        )}
                      </span>
                      <FaArrowUpRightFromSquare
                        className="mt-0.5 shrink-0 text-[10px] text-ink-300 transition-colors group-hover:text-brand-500"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {related.length > 0 && (
              <div>
                <h2 className="mb-4 heading-md">Lộ trình liên quan</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {related.map((item) => (
                    <RoadmapCard key={item.slug} roadmap={item} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <RoadmapSidebar roadmap={roadmap} />
        </div>
      </div>
    </div>
  );
}

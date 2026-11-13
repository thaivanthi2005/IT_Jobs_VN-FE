import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { JobQuickViewClient } from "@/components/cards/JobQuickViewClient";
import { EmptyState } from "@/components/ui/States";
import { Reveal } from "@/components/ui/Reveal";
import { API_URL } from "@/config/variable";
import { isBuild } from "@/lib/build-phase";
import type { JobCard, SearchResult } from "@/types/api";

/**
 * Featured jobs, fetched on the server.
 *
 * This used to be a client component that fetched on mount, which meant every
 * visitor saw skeletons and waited a round trip before any job appeared. Moving
 * the fetch to the server removes that wait entirely: the cards are in the HTML.
 *
 * Only the optional quick-view dialog remains client-side, isolated in
 * `JobQuickViewClient`, so the section itself ships no JavaScript.
 */
async function getFeaturedJobs(limit: number): Promise<{ jobs: JobCard[]; total: number }> {
  /* skip the request entirely during `next build`: there is no backend, and Next
     prints the fetch error even when the promise is caught */
  if (isBuild()) return { jobs: [], total: 0 };

  try {
    const res = await fetch(`${API_URL}/search?page=1`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return { jobs: [], total: 0 };
    const data = (await res.json()) as SearchResult & { code?: string };
    if (data?.code !== "success") return { jobs: [], total: 0 };
    return {
      jobs: (data.jobs || []).slice(0, limit),
      total: Number(data.totalRecord) || 0,
    };
  } catch {
    return { jobs: [], total: 0 };
  }
}

export const FeaturedJobsSection = async ({ limit = 6 }: { limit?: number }) => {
  const { jobs, total: totalRecord } = await getFeaturedJobs(limit);

  return (
    <section className="section-pad bg-ink-50/70 dark:bg-ink-950/40">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="eyebrow">Việc làm nổi bật</span>
              <h2 className="heading-md mt-3">Cơ hội đang chờ bạn</h2>
              <p className="text-body mt-2 max-w-xl">
                Những vị trí mới nhất từ các công ty công nghệ đang tích cực tuyển dụng.
              </p>
            </div>
            <Link href="/search" className="btn-outline shrink-0">
              Xem tất cả {totalRecord > 0 && `(${totalRecord})`}
              <FaArrowRight className="text-[11px]" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-8">
          {jobs.length > 0 ? (
            <JobQuickViewClient jobs={jobs} layout="grid-3" />
          ) : (
            <EmptyState
              title="Chưa có tin tuyển dụng nào"
              description="Hiện chưa có việc làm được đăng tải. Vui lòng quay lại sau hoặc thử tìm kiếm với từ khoá khác."
              action={
                <Link href="/search" className="btn-primary">
                  Tìm kiếm việc làm
                </Link>
              }
            />
          )}
        </div>
      </div>
    </section>
  );
};

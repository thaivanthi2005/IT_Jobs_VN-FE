import type { Metadata } from "next";
import { HeroSearch } from "@/components/home/HeroSearch";
import { CategorySection } from "@/components/home/CategorySection";
import { ShowcaseSection } from "@/components/home/ShowcaseSection";
import { FeaturedJobsSection } from "@/components/home/FeaturedJobsSection";
import { TopCompaniesSection } from "@/components/home/TopCompaniesSection";
import { ValueSection } from "@/components/home/ValueSection";
import { API_URL } from "@/config/variable";
import { isBuild } from "@/lib/build-phase";
import type { SearchResult } from "@/types/api";

export const metadata: Metadata = {
  title: "ITJobs — Việc làm IT cho Developer chất",
  description:
    "Tìm việc làm IT mới nhất: ReactJS, NodeJS, Java, DevOps, Mobile. Kết nối với 500+ công ty công nghệ hàng đầu Việt Nam.",
};

/**
 * Total open jobs for the hero badge.
 *
 * Cached for a minute instead of fetched per request: the number is decorative,
 * and `no-store` made every visit wait on the API before the page could render.
 *
 * The request also carries a short timeout, because `next build` prerenders this
 * route with no backend running: without a timeout the build sat waiting on a
 * refused connection and printed an `ECONNREFUSED` trace for a number the page
 * can live without. On timeout the badge keeps its neutral copy.
 */
async function getTotalJobs(): Promise<number> {
  if (isBuild()) return 0;

  try {
    const res = await fetch(`${API_URL}/search?page=1`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return 0;
    const data = (await res.json()) as SearchResult & { code?: string };
    return data?.code === "success" ? Number(data.totalRecord) || 0 : 0;
  } catch {
    return 0;
  }
}

export default async function HomePage() {
  const totalJobs = await getTotalJobs();

  return (
    <>
      <HeroSearch totalJobs={totalJobs} />
      <CategorySection />
      <ShowcaseSection />
      <FeaturedJobsSection />
      <ValueSection />
      <TopCompaniesSection />
    </>
  );
}

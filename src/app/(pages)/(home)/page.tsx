import type { Metadata } from "next";
import { HeroSearch } from "@/components/home/HeroSearch";
import { CategorySection } from "@/components/home/CategorySection";
import { ShowcaseSection } from "@/components/home/ShowcaseSection";
import { FeaturedJobsSection } from "@/components/home/FeaturedJobsSection";
import { TopCompaniesSection } from "@/components/home/TopCompaniesSection";
import { ValueSection } from "@/components/home/ValueSection";
import { fetchServerApi } from "@/lib/server-api";
import { isBuild } from "@/lib/build-phase";
import type { SearchResult } from "@/types/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ITJobs — Việc làm IT cho Developer chất",
  description:
    "Tìm việc làm IT mới nhất: ReactJS, NodeJS, Java, DevOps, Mobile. Kết nối với 500+ công ty công nghệ hàng đầu Việt Nam.",
};

/**
 * Total open jobs for the hero badge.
 */
async function getTotalJobs(): Promise<number> {
  if (isBuild()) return 0;

  try {
    const res = await fetchServerApi("/search?page=1");
    if (!res.ok) return 0;
    const data = (await res.json()) as SearchResult & { code?: string };
    return data?.code === "success" ? Number(data.totalRecord) || 0 : 0;
  } catch (err) {
    console.error("getTotalJobs fetch error:", err);
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

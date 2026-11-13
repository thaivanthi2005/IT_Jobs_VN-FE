import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { Reveal } from "@/components/ui/Reveal";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { CardCompanyItem } from "@/components/cards/CardCompanyItem";
import { EmptyState } from "@/components/ui/States";
import { API_URL } from "@/config/variable";
import { isBuild } from "@/lib/build-phase";
import type { CompanyCard } from "@/types/api";

/**
 * Top hiring companies, fetched on the server.
 *
 * Same reasoning as `FeaturedJobsSection`: the previous version fetched on mount,
 * so the visitor saw skeleton tiles and waited a round trip. The company cards are
 * static markup with links, so nothing here needs the client at all.
 */
async function getCompanies(limit: number): Promise<CompanyCard[]> {
  /* same build-time guard as FeaturedJobsSection */
  if (isBuild()) return [];

  try {
    const res = await fetch(`${API_URL}/company/list?limitItems=${limit}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { code?: string; companyList?: CompanyCard[] };
    if (data?.code !== "success") return [];
    return (data.companyList || []).slice(0, limit);
  } catch {
    return [];
  }
}

export const TopCompaniesSection = async ({ limit = 9 }: { limit?: number }) => {
  const companies = await getCompanies(limit);

  return (
    <section className="section-pad">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="eyebrow">Nhà tuyển dụng</span>
              <h2 className="heading-md mt-3">Công ty IT hàng đầu</h2>
              <p className="text-body mt-2 max-w-xl">
                Nơi những kỹ sư giỏi nhất Việt Nam đang làm việc và xây dựng sản phẩm.
              </p>
            </div>
            <Link href="/company/list" className="btn-outline shrink-0">
              Xem tất cả
              <FaArrowRight className="text-[11px]" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-8">
          {companies.length > 0 ? (
            <RevealGroup
              step={70}
              effect="reveal-lift"
              className="grid grid-cols-2 gap-4 lg:grid-cols-3"
            >
              {companies.map((company) => (
                <CardCompanyItem key={company.id} item={company} />
              ))}
            </RevealGroup>
          ) : (
            <EmptyState
              title="Chưa có công ty nào"
              description="Danh sách nhà tuyển dụng đang được cập nhật. Vui lòng quay lại sau."
            />
          )}
        </div>
      </div>
    </section>
  );
};

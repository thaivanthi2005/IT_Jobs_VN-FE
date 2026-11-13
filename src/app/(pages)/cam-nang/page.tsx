import type { Metadata } from "next";
import Link from "next/link";
import { FaBookOpen, FaRoute, FaArrowRight } from "react-icons/fa6";
import { RoadmapCard } from "@/components/handbook/RoadmapCard";
import { ArticleCard } from "@/components/handbook/ArticleCard";
import { GalleryHeading } from "@/components/effects";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { roadmaps } from "@/config/handbook";
import { articles } from "@/config/handbook/articles";

export const metadata: Metadata = {
  title: "Cẩm nang IT — Lộ trình & kỹ năng",
  description:
    "Lộ trình học Frontend, Backend, Fullstack, DevOps và các bài viết thực tế về CV, phỏng vấn, thư xin việc và mức lương IT.",
};

export default function HandbookPage() {
  return (
    <div className="bg-ink-50/50 py-10 dark:bg-ink-950/40 sm:py-14">
      <div className="container-page">
        {/* Hero — twelve plates ring the headline, orbiting on their own.
            The theme is inherited from the site toggle rather than pinned, so
            the gallery repaints its plates and ink when the visitor switches
            between light and dark. */}
        <div className="overflow-hidden rounded-xl ring-1 ring-ink-200/70 dark:ring-ink-800">
          <GalleryHeading
            variant="handbook"
            ratio="16 / 7"
            autoHover
            label="Mười hai khung hình xếp thành vòng quanh dòng chữ Học đúng thứ tự, đi nhanh hơn"
          />
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="eyebrow">
              <FaBookOpen className="text-[10px]" aria-hidden="true" />
              Cẩm nang IT
            </span>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-600 dark:text-ink-300">
              Lộ trình chi tiết theo từng vai trò và những bài viết thực tế giúp bạn chuẩn bị
              hồ sơ, phỏng vấn và deal lương tự tin hơn.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/cam-nang/lo-trinh/frontend" className="btn-primary">
              Bắt đầu với Frontend
              <FaArrowRight className="text-[11px]" aria-hidden="true" />
            </Link>
            <Link href="/search" className="btn-outline">
              Xem việc làm đang tuyển
            </Link>
          </div>
        </div>

        {/* Roadmaps */}
        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 heading-md">
                <FaRoute className="text-[16px] text-brand-600" aria-hidden="true" />
                Lộ trình nghề nghiệp
              </h2>
              <p className="text-body mt-1">
                Tham khảo cấu trúc từ roadmap.sh, điều chỉnh theo nhu cầu tuyển dụng tại Việt Nam.
              </p>
            </div>
          </div>

          <RevealGroup
            step={70}
            effect="reveal-lift"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {roadmaps.map((roadmap) => (
              <RoadmapCard key={roadmap.slug} roadmap={roadmap} />
            ))}
          </RevealGroup>
        </section>

        {/* Articles */}
        <section className="mt-12">
          <div className="mb-5">
            <h2 className="heading-md">Bài viết thực tế</h2>
            <p className="text-body mt-1">
              Nội dung ngắn gọn, có checklist — dùng được ngay cho lần ứng tuyển tới.
            </p>
          </div>

          <RevealGroup
            step={70}
            effect="reveal-lift"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </RevealGroup>
        </section>
      </div>
    </div>
  );
}

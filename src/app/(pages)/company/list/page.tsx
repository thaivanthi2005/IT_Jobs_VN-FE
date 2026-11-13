import type { Metadata } from "next";
import { FaBuilding } from "react-icons/fa6";
import { ConstellationField } from "@/components/effects";
import { CompanyList } from "./CompanyList";

export const metadata: Metadata = {
  title: "Danh sách công ty IT",
  description: "Khám phá các công ty công nghệ hàng đầu Việt Nam đang tuyển dụng.",
};

export default function CompanyListPage() {
  return (
    <>
      {/* Field behind the page header — network of hiring companies.
          The section paints its own background and `isolate`s a stacking
          context, so the layer can sit at z-0 behind the copy instead of at
          -z-10, which would sink it behind <body> and hide it entirely. */}
      <section className="relative isolate overflow-hidden bg-ink-950">
        <ConstellationField
          variant="constellation-field"
          ratio="16 / 6"
          label="Mạng lưới các nút sáng nối với nhau, tượng trưng cho mạng lưới công ty tuyển dụng"
          className="absolute inset-0 z-0 opacity-70"
          minHeight={220}
          mode="dark"
        />
        <div className="container-page relative py-12 text-center sm:py-16">
          <span className="eyebrow border-white/25 bg-white/15 text-white backdrop-blur-sm">
            <FaBuilding className="text-[10px]" aria-hidden="true" />
            Nhà tuyển dụng
          </span>
          <h1 className="heading-lg mt-3 text-white">Công ty IT nổi bật</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-brand-100/80">
            Hơn 500 doanh nghiệp công nghệ đang tìm kiếm nhân tài trên ITJobs.
          </p>
        </div>
      </section>

      <div className="py-10 sm:py-14">
        <div className="container-page">
          <CompanyList />
        </div>
      </div>
    </>
  );
}

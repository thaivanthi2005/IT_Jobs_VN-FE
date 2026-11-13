import type { Metadata } from "next";
import { Suspense } from "react";
import { ConstellationField } from "@/components/effects";
import { SearchContainer } from "./SearchContainer";

export const metadata: Metadata = {
  title: "Kết quả tìm kiếm việc làm IT",
  description:
    "Tìm kiếm việc làm IT theo kỹ năng, thành phố, công ty, cấp bậc và hình thức làm việc.",
};

export default function SearchPage() {
  return (
    <>
      {/* Faint particle drift behind the result header — reads as "scanning".
          The band pins its own theme and background so the label stays readable
          in both site themes; `isolate` keeps the layer above the page body. */}
      <div className="relative isolate overflow-hidden border-b border-ink-100 bg-ink-950 dark:border-ink-800">
        <ConstellationField
          variant="particle-drift"
          ratio="16 / 4"
          mode="dark"
          label="Các hạt sáng trôi chậm và nối với nhau khi lại gần, gợi cảm giác đang quét dữ liệu"
          className="absolute inset-0 z-0 opacity-60"
          minHeight={140}
        />
        <div className="container-page relative py-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-200">
            Đang quét toàn bộ tin tuyển dụng
          </p>
        </div>
      </div>

      <div className="py-10 sm:py-14">
        <Suspense fallback={<div className="container-page h-64" />}>
          <SearchContainer />
        </Suspense>
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  FaMagnifyingGlass,
  FaLocationDot,
  FaCode,
  FaCircleCheck,
  FaBolt,
  FaArrowTrendUp,
} from "react-icons/fa6";
import { cityList, popularKeywordList } from "@/config/variable";
import { Backdrop3D } from "@/components/three/Backdrop3D";
import { OrbitRings } from "./OrbitRings";

export const HeroSearch = ({ totalJobs = 0 }: { totalJobs?: number }) => {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [keyword, setKeyword] = useState("");

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (keyword.trim()) params.set("keyword", keyword.trim());
    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <section className="relative overflow-hidden bg-brand-fade">
      <div className="pointer-events-none absolute inset-0 bg-hero-mesh" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
        aria-hidden="true"
      />

      <div className="container-page relative py-16 sm:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-12">
          {/* --------------------------------------------- copy */}
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-100 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success-400" />
              </span>
              {totalJobs > 0
                ? `${totalJobs.toLocaleString("vi-VN")} tin tuyển dụng đang mở`
                : "Cơ hội mới mỗi ngày"}
            </p>

            <h1 className="mt-5 font-display text-[32px] font-extrabold leading-[1.12] tracking-tight text-white text-balance sm:text-[44px] lg:text-[52px]">
              Tìm việc IT{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-success-400">xứng tầm</span>
                <span
                  className="absolute inset-x-0 bottom-1 z-0 h-3 rounded-sm bg-success-500/25"
                  aria-hidden="true"
                />
              </span>{" "}
              của bạn
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-100/80 sm:text-base">
              Hàng nghìn vị trí developer, engineer, DevOps từ các công ty công nghệ hàng
              đầu Việt Nam — cập nhật mỗi ngày.
            </p>

            <form
              onSubmit={handleSearch}
              role="search"
              className="mt-8 flex max-w-2xl flex-col gap-2.5 rounded-2xl bg-white p-2.5 shadow-glow sm:flex-row sm:items-center dark:bg-ink-900"
            >
              <div className="relative flex-1">
                <FaLocationDot
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-ink-400"
                  aria-hidden="true"
                />
                <label htmlFor="hero-city" className="sr-only">
                  Thành phố
                </label>
                <select
                  id="hero-city"
                  name="city"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  className="w-full cursor-pointer appearance-none rounded-xl bg-transparent py-2.5 pl-9 pr-6 text-sm font-medium text-ink-800 focus:outline-none dark:text-ink-100"
                >
                  <option value="">Tất cả thành phố</option>
                  {cityList.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative flex-[1.6]">
                <FaMagnifyingGlass
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-ink-400"
                  aria-hidden="true"
                />
                <label htmlFor="hero-keyword" className="sr-only">
                  Từ khoá
                </label>
                <input
                  id="hero-keyword"
                  name="keyword"
                  type="search"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Vị trí, kỹ năng, công ty…"
                  className="w-full rounded-xl bg-transparent py-2.5 pl-9 pr-3 text-sm font-medium text-ink-800 placeholder:text-ink-400 focus:outline-none dark:text-ink-100"
                />
              </div>

              <button type="submit" className="btn-primary h-11 w-full shrink-0 px-6 sm:w-auto">
                <FaMagnifyingGlass className="text-[13px]" aria-hidden="true" />
                Tìm kiếm
              </button>
            </form>

            <div className="mt-5 flex max-w-2xl flex-wrap items-center gap-2">
              <span className="text-[12px] font-medium text-brand-100/60">Mọi người tìm:</span>
              {popularKeywordList.map((item) => (
                <Link
                  key={item.value}
                  href={`/search?language=${encodeURIComponent(item.value)}`}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[12px] font-semibold text-brand-50 backdrop-blur-sm transition-all duration-200 hover:border-white/40 hover:bg-white/20"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* ------------------------------------------------- 3D tech orb */}
          <div className="relative">
            <div className="relative mx-auto aspect-square w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[520px]">
              <div
                className="absolute inset-8 rounded-full bg-brand-400/10 blur-3xl"
                aria-hidden="true"
              />

              <div className="absolute inset-0">
                <Backdrop3D variant="hero" />
              </div>

              <OrbitRings tilt={62} />

              <div
                className="pointer-events-none absolute inset-6 rounded-full border border-white/10"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-16 rounded-full border border-white/[0.06]"
                aria-hidden="true"
              />

              <div className="absolute -left-2 top-[16%] hidden animate-float rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 shadow-lg backdrop-blur-md sm:block">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-brand-100/70">
                  <FaCode className="text-[9px]" aria-hidden="true" />
                  Stack đang hot
                </p>
                <p className="mt-1 font-mono text-[12px] font-semibold text-white">
                  React · Node · Go
                </p>
              </div>

              <div
                className="absolute -right-1 top-[42%] hidden animate-float rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 shadow-lg backdrop-blur-md sm:block"
                style={{ animationDelay: "1.4s" }}
              >
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-brand-100/70">
                  <FaBolt className="text-[9px]" aria-hidden="true" />
                  Phản hồi TB
                </p>
                <p className="mt-1 font-display text-[13px] font-extrabold text-success-400">
                  &lt; 24 giờ
                </p>
              </div>

              <div
                className="absolute bottom-[14%] left-[8%] hidden animate-float rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 shadow-lg backdrop-blur-md sm:block"
                style={{ animationDelay: "0.7s" }}
              >
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-brand-100/70">
                  <FaCircleCheck className="text-[9px]" aria-hidden="true" />
                  Hồ sơ đã duyệt
                </p>
                <p className="mt-1 flex items-center gap-1 font-display text-[13px] font-extrabold text-white">
                  <FaArrowTrendUp className="text-[10px] text-success-400" aria-hidden="true" />
                  +38% tuần này
                </p>
              </div>
            </div>
          </div>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:max-w-2xl">
          {[
            { label: "Tin tuyển dụng", value: totalJobs > 0 ? `${totalJobs}+` : "1.200+" },
            { label: "Công ty IT", value: "500+" },
            { label: "Lập trình viên", value: "200k+" },
            { label: "Phản hồi TB", value: "< 24h" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="group rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-center backdrop-blur-sm transition-all duration-300 hover:border-white/25 hover:bg-white/[0.12]"
            >
              <dd className="font-display text-lg font-extrabold text-white">{stat.value}</dd>
              <dt className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-brand-100/60">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};

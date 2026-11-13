"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaChevronDown,
  FaFilter,
  FaMagnifyingGlass,
  FaXmark,
} from "react-icons/fa6";
import { CardJobSkeleton } from "@/components/cards/CardJobItem";
import { JobCardLink } from "@/components/cards/JobCardLink";
import { JobQuickView } from "@/components/cards/JobQuickView";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/States";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { positionList, workingFormList } from "@/config/variable";
import type { JobCard } from "@/types/api";
import { useJobSearch } from "./useJobSearch";

export const SearchContainer = () => {
  const {
    jobList,
    page,
    setPage,
    totalPage,
    totalRecord,
    loading,
    position,
    workingForm,
    keyword,
    setFilter,
    clearAll,
    activeChips,
  } = useJobSearch();

  const [showFilters, setShowFilters] = useState(false);
  const [preview, setPreview] = useState<JobCard | null>(null);

  return (
    <div className="container-page">
      <div className="mb-6">
        <h1 className="heading-md">
          {loading ? (
            <span className="inline-block h-7 w-64 rounded-md bg-ink-100 dark:bg-ink-800" />
          ) : totalRecord > 0 ? (
            <>
              <span className="text-brand-600 dark:text-brand-400">{totalRecord}</span>{" "}
              việc làm IT
            </>
          ) : (
            "Kết quả tìm kiếm"
          )}
        </h1>
        <p className="text-body mt-1.5">
          {totalRecord > 0
            ? "Chọn vị trí phù hợp và ứng tuyển chỉ trong vài phút."
            : "Thử điều chỉnh bộ lọc hoặc từ khoá để có thêm kết quả."}
        </p>
      </div>

      {activeChips.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <span
              key={chip.label}
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 py-1 pl-3 pr-1.5 text-[12px] font-semibold text-brand-700 dark:border-brand-800 dark:bg-brand-900/40 dark:text-brand-200"
            >
              {chip.label}
              <button
                type="button"
                onClick={chip.onRemove}
                aria-label={`Xoá bộ lọc ${chip.label}`}
                className="inline-flex h-4 w-4 cursor-pointer items-center justify-center rounded-full hover:bg-brand-200/60 dark:hover:bg-brand-800"
              >
                <FaXmark className="text-[8px]" aria-hidden="true" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="cursor-pointer text-[12px] font-semibold text-ink-500 underline underline-offset-2 hover:text-danger-600"
          >
            Xoá tất cả
          </button>
        </div>
      )}

      {/* Filter bar */}
      <div className="surface mb-7 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            aria-expanded={showFilters}
            className="btn-outline btn-sm lg:hidden"
          >
            <FaFilter className="text-[11px]" aria-hidden="true" />
            Bộ lọc
            <FaChevronDown
              className={`text-[9px] transition-transform ${showFilters ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>

          <div
            className={`${
              showFilters ? "flex" : "hidden"
            } w-full flex-wrap gap-2 lg:flex lg:w-auto`}
          >
            <label htmlFor="filter-position" className="sr-only">
              Cấp bậc
            </label>
            <select
              id="filter-position"
              value={position}
              onChange={(event) => setFilter("position", event.target.value)}
              className="field-select h-10 w-full py-1.5 text-[13px] sm:w-[190px]"
            >
              <option value="">Tất cả cấp bậc</option>
              {positionList.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>

            <label htmlFor="filter-working-form" className="sr-only">
              Hình thức làm việc
            </label>
            <select
              id="filter-working-form"
              value={workingForm}
              onChange={(event) => setFilter("workingForm", event.target.value)}
              className="field-select h-10 w-full py-1.5 text-[13px] sm:w-[210px]"
            >
              <option value="">Tất cả hình thức</option>
              {workingFormList.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              const value = new FormData(event.currentTarget).get("q");
              setFilter("keyword", String(value || "").trim());
            }}
            className="relative ml-auto"
          >
            <FaMagnifyingGlass
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-ink-400"
              aria-hidden="true"
            />
            <label htmlFor="filter-keyword" className="sr-only">
              Tìm theo từ khoá
            </label>
            <input
              id="filter-keyword"
              name="q"
              type="search"
              defaultValue={keyword}
              placeholder="Tìm trong kết quả…"
              className="field h-10 w-full py-1.5 pl-8 text-[13px] sm:w-[240px]"
            />
          </form>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <CardJobSkeleton key={index} />
          ))}
        </div>
      ) : jobList.length > 0 ? (
        <>
          <RevealGroup
            step={60}
            effect="reveal-lift"
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {jobList.map((job) => (
              <JobCardLink key={job.id} item={job} onOpen={setPreview} />
            ))}
          </RevealGroup>
          <Pagination page={page} totalPage={totalPage} onChange={setPage} />
        </>
      ) : (
        <EmptyState
          title="Không tìm thấy việc làm phù hợp"
          description="Không có kết quả nào khớp với bộ lọc hiện tại. Hãy thử bỏ một vài điều kiện hoặc dùng từ khoá rộng hơn."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <button type="button" onClick={clearAll} className="btn-primary">
                Xoá bộ lọc
              </button>
              <Link href="/" className="btn-outline">
                Về trang chủ
              </Link>
            </div>
          }
        />
      )}

      <JobQuickView job={preview} onClose={() => setPreview(null)} />
    </div>
  );
};

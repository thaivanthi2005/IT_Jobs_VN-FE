"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_URL, positionList, workingFormList } from "@/config/variable";
import type { JobCard } from "@/types/api";

const labelOf = (list: readonly { label: string; value: string }[], value: string) =>
  list.find((item) => item.value === value)?.label || value;

export const useJobSearch = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const filters = {
    language: searchParams.get("language") || "",
    city: searchParams.get("city") || "",
    company: searchParams.get("company") || "",
    keyword: searchParams.get("keyword") || "",
    position: searchParams.get("position") || "",
    workingForm: searchParams.get("workingForm") || "",
  };

  const { language, city, company, keyword, position, workingForm } = filters;

  const [jobList, setJobList] = useState<JobCard[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(1);
  }, [language, city, company, keyword, position, workingForm]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    const params = new URLSearchParams({ ...filters, page: String(page) });

    fetch(`${API_URL}/search?${params.toString()}`, { signal: controller.signal })
      .then((res) => res.json())
      .then(
        (data: {
          code?: string;
          jobs?: JobCard[];
          totalPage?: number;
          totalRecord?: number;
        }) => {
          if (data?.code === "success") {
            setJobList(data.jobs || []);
            setTotalPage(Number(data.totalPage) || 0);
            setTotalRecord(Number(data.totalRecord) || 0);
          }
        }
      )
      .catch(() => undefined)
      .finally(() => setLoading(false));

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, city, company, keyword, position, workingForm, page]);

  const pushWithParams = (params: URLSearchParams) => {
    const query = params.toString();
    router.push(query ? `/search?${query}` : "/search");
  };

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    pushWithParams(params);
  };

  const clearAll = () => router.push("/search");

  const activeChips = useMemo(() => {
    const chips: { label: string; onRemove: () => void }[] = [];
    const push = (key: string, text: string) =>
      chips.push({ label: text, onRemove: () => setFilter(key, "") });

    if (language) push("language", `Kỹ năng: ${language}`);
    if (city) push("city", `Thành phố: ${city}`);
    if (company) push("company", `Công ty: ${company}`);
    if (keyword) push("keyword", `Từ khoá: ${keyword}`);
    if (position) push("position", `Cấp bậc: ${labelOf(positionList, position)}`);
    if (workingForm) push("workingForm", `Hình thức: ${labelOf(workingFormList, workingForm)}`);
    return chips;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, city, company, keyword, position, workingForm]);

  return {
    ...filters,
    jobList,
    page,
    setPage,
    totalPage,
    totalRecord,
    loading,
    setFilter,
    clearAll,
    activeChips,
  };
};

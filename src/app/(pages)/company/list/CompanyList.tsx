"use client";

import { useEffect, useState } from "react";
import { CardCompanyItem, CardCompanySkeleton } from "@/components/cards/CardCompanyItem";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/States";
import { RevealGroup } from "@/components/ui/RevealGroup";
import { API_URL } from "@/config/variable";
import type { CompanyCard } from "@/types/api";

const PAGE_SIZE = 9;

export const CompanyList = () => {
  const [companyList, setCompanyList] = useState<CompanyCard[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(`${API_URL}/company/list?limitItems=${PAGE_SIZE}&page=${page}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data: { code?: string; companyList?: CompanyCard[]; totalPage?: number }) => {
        if (data?.code === "success") {
          setCompanyList(data.companyList || []);
          setTotalPage(Number(data.totalPage) || 0);
        }
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [page]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <CardCompanySkeleton key={index} />
        ))}
      </div>
    );
  }

  if (companyList.length === 0) {
    return (
      <EmptyState
        title="Chưa có công ty nào"
        description="Danh sách nhà tuyển dụng đang được cập nhật. Vui lòng quay lại sau."
      />
    );
  }

  return (
    <>
      <RevealGroup step={60} effect="reveal-lift" className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {companyList.map((company) => (
          <CardCompanyItem key={company.id} item={company} />
        ))}
      </RevealGroup>
      <Pagination page={page} totalPage={totalPage} onChange={setPage} />
    </>
  );
};

"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "@/components/ui/States";
import { API_URL } from "@/config/variable";
import type { CvCompanyItem } from "@/types/api";
import { CVItem } from "./CVItem";

export const CVList = () => {
  const [listCV, setListCV] = useState<CvCompanyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_URL}/company/cv/list`, {
      credentials: "include",
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data: { code?: string; listCV?: CvCompanyItem[] }) => {
        if (data?.code === "success") setListCV(data.listCV || []);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="surface h-[164px] animate-pulse" />
        ))}
      </div>
    );
  }

  if (listCV.length === 0) {
    return (
      <EmptyState
        title="Chưa có hồ sơ ứng tuyển"
        description="Khi ứng viên ứng tuyển vào tin của bạn, hồ sơ sẽ xuất hiện tại đây để duyệt."
      />
    );
  }

  return (
    <ul className="space-y-3">
      {listCV.map((item) => (
        <CVItem
          key={item.id}
          item={item}
          onDeleteSuccess={(id) => setListCV((prev) => prev.filter((cv) => cv.id !== id))}
        />
      ))}
    </ul>
  );
};

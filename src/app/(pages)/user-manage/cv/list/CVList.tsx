"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaBriefcase, FaBuilding, FaUserTie } from "react-icons/fa6";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { API_URL, getCvStatus, getPositionLabel, getWorkingFormLabel } from "@/config/variable";
import { formatSalary } from "@/lib/format";
import type { CvUserItem } from "@/types/api";

export const CVList = () => {
  const [listCV, setListCV] = useState<CvUserItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_URL}/user/cv/list`, {
      credentials: "include",
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data: { code?: string; listCV?: CvUserItem[] }) => {
        if (data?.code === "success") setListCV(data.listCV || []);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="surface h-[92px] animate-pulse" />
        ))}
      </div>
    );
  }

  if (listCV.length === 0) {
    return (
      <EmptyState
        title="Bạn chưa gửi CV nào"
        description="Khi bạn ứng tuyển một công việc, hồ sơ sẽ xuất hiện ở đây để bạn theo dõi trạng thái."
        action={
          <Link href="/search" className="btn-primary">
            Tìm việc làm ngay
          </Link>
        }
      />
    );
  }

  return (
    <ul className="space-y-3">
      {listCV.map((item) => {
        const status = getCvStatus(item.status);
        return (
          <li key={item.id}>
            <Link
              href={`/search?company=${encodeURIComponent(item.companyName)}`}
              className="surface-interactive group flex flex-col gap-3 p-5 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="line-clamp-1 font-display text-[15px] font-bold text-ink-900 transition-colors group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
                    {item.jobTitle}
                  </h2>
                  <Badge tone="neutral" dot={status.dot}>
                    {status.label}
                  </Badge>
                </div>

                <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-ink-500 dark:text-ink-400">
                  <FaBuilding className="text-[11px]" aria-hidden="true" />
                  {item.companyName}
                </p>

                <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[12px] text-ink-500 dark:text-ink-400">
                  <span className="inline-flex items-center gap-1.5">
                    <FaUserTie className="text-[10px]" aria-hidden="true" />
                    {getPositionLabel(item.jobPosition)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <FaBriefcase className="text-[10px]" aria-hidden="true" />
                    {getWorkingFormLabel(item.jobWorkingForm)}
                  </span>
                </div>
              </div>

              <div className="shrink-0 sm:text-right">
                <p className="font-display text-[15px] font-extrabold text-success-600 dark:text-success-500">
                  {formatSalary(item.jobSalaryMin, item.jobSalaryMax)}
                </p>
                <span className="mt-1 inline-block text-[11px] font-semibold uppercase tracking-wider text-ink-400">
                  Xem công ty
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

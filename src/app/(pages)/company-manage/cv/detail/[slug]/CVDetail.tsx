"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import { API_URL } from "@/config/variable";
import type { CvDetailInfo, CvDetailJob } from "@/types/api";
import { CvInfoCard, CvJobCard } from "./CvCards";

export const CVDetail = ({ id }: { id: string }) => {
  const [infoCV, setInfoCV] = useState<CvDetailInfo | null>(null);
  const [infoJob, setInfoJob] = useState<CvDetailJob | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_URL}/company/cv/detail/${id}`, {
      credentials: "include",
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!data) {
          setError("Phản hồi không hợp lệ từ máy chủ!");
          return;
        }
        if (data.code === "error") {
          setError(data.message || "Không tải được chi tiết CV!");
          return;
        }
        setInfoCV(data.infoCV ?? null);
        setInfoJob(data.infoJob ?? null);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError("Không kết nối được máy chủ! Kiểm tra backend port 4000.");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [id]);

  if (loading) return <div className="surface h-96 animate-pulse" />;

  if (error || !infoCV) {
    return (
      <div className="surface p-8 text-center">
        <p className="text-sm font-medium text-danger-600">{error || "Không có dữ liệu CV."}</p>
        <Link href="/company-manage/cv/list" className="btn-outline mt-5">
          <FaArrowLeft className="text-[11px]" aria-hidden="true" />
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Link
        href="/company-manage/cv/list"
        className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-500 transition-colors hover:text-brand-600 dark:text-ink-400"
      >
        <FaArrowLeft className="text-[10px]" aria-hidden="true" />
        Quay lại danh sách
      </Link>

      <CvInfoCard infoCV={infoCV} />
      {infoJob && <CvJobCard infoJob={infoJob} />}
    </div>
  );
};

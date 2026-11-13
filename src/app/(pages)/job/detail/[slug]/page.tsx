import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import { API_URL } from "@/config/variable";
import type { JobDetail } from "@/types/api";
import { JobDetailView } from "./JobDetailView";

export const metadata: Metadata = {
  title: "Chi tiết công việc",
  description: "Thông tin chi tiết về vị trí tuyển dụng và form ứng tuyển.",
};

async function getJobDetail(slug: string): Promise<JobDetail | null> {
  try {
    const res = await fetch(`${API_URL}/job/detail/${slug}`, { cache: "no-store" });
    const data = await res.json();
    if (data?.code !== "success") return null;
    return data.jobDetail as JobDetail;
  } catch {
    return null;
  }
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJobDetail(slug);

  if (!job) {
    return (
      <div className="container-page py-20">
        <div className="surface mx-auto max-w-lg p-10 text-center">
          <h1 className="font-display text-xl font-bold text-ink-900 dark:text-white">
            Không tìm thấy công việc
          </h1>
          <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
            Tin tuyển dụng này có thể đã bị gỡ hoặc đường dẫn không hợp lệ.
          </p>
          <Link href="/search" className="btn-primary mt-6">
            <FaArrowLeft className="text-[11px]" aria-hidden="true" />
            Xem việc làm khác
          </Link>
        </div>
      </div>
    );
  }

  return <JobDetailView job={job} />;
}

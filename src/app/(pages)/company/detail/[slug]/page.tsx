import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import { fetchServerApi } from "@/lib/server-api";
import type { CompanyDetail, JobCard } from "@/types/api";
import { CompanyDetailView } from "./CompanyDetailView";

export const metadata: Metadata = {
  title: "Chi tiết công ty",
  description: "Thông tin công ty và danh sách việc làm đang tuyển dụng.",
};

type CompanyResponse = {
  code?: string;
  companyDetail?: CompanyDetail;
  jobList?: JobCard[];
};

async function getCompany(slug: string): Promise<CompanyResponse | null> {
  try {
    const res = await fetchServerApi(`/company/detail/${slug}`, { cache: "no-store" });
    const data = (await res.json()) as CompanyResponse;
    return data?.code === "success" ? data : null;
  } catch {
    return null;
  }
}

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCompany(slug);
  const company = data?.companyDetail;

  if (!company) {
    return (
      <div className="container-page py-20">
        <div className="surface mx-auto max-w-lg p-10 text-center">
          <h1 className="font-display text-xl font-bold text-ink-900 dark:text-white">
            Không tìm thấy công ty
          </h1>
          <p className="mt-2 text-sm text-ink-500 dark:text-ink-400">
            Công ty này có thể không tồn tại hoặc đường dẫn không hợp lệ.
          </p>
          <Link href="/company/list" className="btn-primary mt-6">
            <FaArrowLeft className="text-[11px]" aria-hidden="true" />
            Danh sách công ty
          </Link>
        </div>
      </div>
    );
  }

  return <CompanyDetailView company={company} jobList={data?.jobList ?? []} />;
}

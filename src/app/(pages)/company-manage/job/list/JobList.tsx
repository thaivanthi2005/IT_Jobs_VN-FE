"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaBriefcase,
  FaLocationDot,
  FaPenToSquare,
  FaPlus,
  FaUserTie,
} from "react-icons/fa6";
import { ButtonDelete } from "@/components/manage/ButtonDelete";
import { LogoBox } from "@/components/ui/LogoBox";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/States";
import { API_URL, getPositionLabel, getWorkingFormLabel } from "@/config/variable";
import { formatSalary } from "@/lib/format";
import type { JobCard } from "@/types/api";

export const JobList = () => {
  const [jobList, setJobList] = useState<JobCard[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(`${API_URL}/company/job/list?page=${page}`, {
      credentials: "include",
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data: { code?: string; jobs?: JobCard[]; totalPage?: number }) => {
        if (data?.code === "success") {
          setJobList(data.jobs || []);
          setTotalPage(Number(data.totalPage) || 0);
        }
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [page]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="surface h-[112px] animate-pulse" />
        ))}
      </div>
    );
  }

  if (jobList.length === 0) {
    return (
      <EmptyState
        title="Chưa có tin tuyển dụng nào"
        description="Tạo tin tuyển dụng đầu tiên để bắt đầu nhận hồ sơ từ ứng viên."
        action={
          <Link href="/company-manage/job/create" className="btn-primary">
            <FaPlus className="text-[11px]" aria-hidden="true" />
            Đăng tin tuyển dụng
          </Link>
        }
      />
    );
  }

  return (
    <>
      <ul className="space-y-3">
        {jobList.map((job) => (
          <li key={job.id} className="surface p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <LogoBox src={job.companyLogo} name={job.companyName} size="sm" />

              <div className="min-w-0 flex-1">
                <Link
                  href={`/job/detail/${job.id}`}
                  className="line-clamp-1 font-display text-[15px] font-bold text-ink-900 transition-colors hover:text-brand-700 dark:text-white dark:hover:text-brand-300"
                >
                  {job.title}
                </Link>

                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="badge-brand">
                    <FaUserTie className="text-[9px]" aria-hidden="true" />
                    {getPositionLabel(job.position)}
                  </span>
                  <span className="badge-neutral">
                    <FaBriefcase className="text-[9px]" aria-hidden="true" />
                    {getWorkingFormLabel(job.workingForm)}
                  </span>
                  <span className="badge-neutral">
                    <FaLocationDot className="text-[9px]" aria-hidden="true" />
                    {job.companyCity || "—"}
                  </span>
                </div>

                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {job.technologies.slice(0, 5).map((tech) => (
                    <span key={tech} className="chip">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="shrink-0 sm:text-right">
                <p className="font-display text-[15px] font-extrabold text-success-600 dark:text-success-500">
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2 sm:justify-end">
                  <Link
                    href={`/company-manage/job/edit/${job.id}`}
                    className="btn-outline btn-sm"
                  >
                    <FaPenToSquare className="text-[11px]" aria-hidden="true" />
                    Sửa
                  </Link>
                  <ButtonDelete
                    api={`${API_URL}/company/job/delete/${job.id}`}
                    item={{ id: job.id, title: job.title }}
                    onDeleteSuccess={(id) =>
                      setJobList((prev) => prev.filter((item) => item.id !== id))
                    }
                  />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Pagination page={page} totalPage={totalPage} onChange={setPage} />
    </>
  );
};

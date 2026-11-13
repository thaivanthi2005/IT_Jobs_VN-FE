/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa6";
import type { JobDetail } from "@/types/api";
import { FormApply } from "./FormApply";
import { JobHeaderCard } from "./JobHeaderCard";
import { JobSidebar } from "./JobSidebar";

export const JobDetailView = ({ job }: { job: JobDetail }) => (
  <div className="bg-ink-50/50 py-8 dark:bg-ink-950/40 sm:py-12">
    <div className="container-page">
      <Link
        href="/search"
        className="mb-5 inline-flex items-center gap-2 text-[13px] font-semibold text-ink-500 transition-colors hover:text-brand-600 dark:text-ink-400"
      >
        <FaArrowLeft className="text-[10px]" aria-hidden="true" />
        Quay lại danh sách việc làm
      </Link>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-6">
          <JobHeaderCard job={job} />

          {job.images?.length > 0 && (
            <div className="surface p-6 sm:p-8">
              <h2 className="mb-4 font-display text-lg font-bold text-ink-900 dark:text-white">
                Hình ảnh công ty
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {job.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Hình ảnh ${index + 1} tại ${job.companyName}`}
                    className="aspect-[4/3] w-full rounded-xl object-cover ring-1 ring-inset ring-ink-200 dark:ring-ink-700"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="surface p-6 sm:p-8">
            <h2 className="mb-4 font-display text-lg font-bold text-ink-900 dark:text-white">
              Mô tả công việc
            </h2>
            <div
              className="rich-text"
              dangerouslySetInnerHTML={{
                __html: job.description || "<p>Đang cập nhật…</p>",
              }}
            />
          </div>

          <div id="ung-tuyen" className="surface scroll-mt-24 p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold text-ink-900 dark:text-white">
              Ứng tuyển vị trí này
            </h2>
            <p className="mt-1 text-[13px] text-ink-500 dark:text-ink-400">
              Điền thông tin bên dưới — nhà tuyển dụng sẽ liên hệ với bạn sớm nhất.
            </p>
            <div className="mt-6">
              <FormApply jobId={job.id} />
            </div>
          </div>
        </div>

        <JobSidebar job={job} />
      </div>
    </div>
  </div>
);

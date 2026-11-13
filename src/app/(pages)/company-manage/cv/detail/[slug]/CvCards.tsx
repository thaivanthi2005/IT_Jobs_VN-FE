"use client";

import Link from "next/link";
import { FaDownload, FaEnvelope, FaPhone } from "react-icons/fa6";
import { getPositionLabel, getWorkingFormLabel } from "@/config/variable";
import { formatSalary } from "@/lib/format";
import type { CvDetailInfo, CvDetailJob } from "@/types/api";


export const label = "text-[10.5px] font-bold uppercase tracking-wider text-ink-400";
export const value = "mt-0.5 text-[13.5px] font-semibold text-ink-900 dark:text-white";

export const CvInfoCard = ({ infoCV }: { infoCV: CvDetailInfo }) => (
  <div className="surface p-6 sm:p-8">
    <h2 className="font-display text-[15px] font-bold text-ink-900 dark:text-white">
      Thông tin ứng viên
    </h2>

    <div className="mt-5 grid gap-4 sm:grid-cols-3">
      <div>
        <p className={label}>Họ tên</p>
        <p className={value}>{infoCV.fullName}</p>
      </div>
      <div>
        <p className={label}>Email</p>
        <a
          href={`mailto:${infoCV.email}`}
          className="mt-0.5 flex items-center gap-1.5 text-[13.5px] font-semibold text-brand-600 hover:underline dark:text-brand-400"
        >
          <FaEnvelope className="text-[10px]" aria-hidden="true" />
          {infoCV.email}
        </a>
      </div>
      <div>
        <p className={label}>Điện thoại</p>
        <a
          href={`tel:${infoCV.phone}`}
          className="mt-0.5 flex items-center gap-1.5 text-[13.5px] font-semibold text-brand-600 hover:underline dark:text-brand-400"
        >
          <FaPhone className="text-[10px]" aria-hidden="true" />
          {infoCV.phone}
        </a>
      </div>
    </div>

    {infoCV.fileCV ? (
      <div className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className={label}>File CV</p>
          <a
            href={infoCV.fileCV}
            target="_blank"
            rel="noreferrer"
            className="btn-outline btn-sm"
          >
            <FaDownload className="text-[10px]" aria-hidden="true" />
            Tải xuống
          </a>
        </div>
        <div className="mt-2.5 overflow-hidden rounded-xl border border-ink-200 dark:border-ink-700">
          <iframe
            src={infoCV.fileCV}
            title="File CV"
            className="h-[620px] w-full bg-ink-100 dark:bg-ink-900"
          />
        </div>
      </div>
    ) : (
      <p className="mt-6 rounded-xl bg-warning-50 px-4 py-3 text-[12.5px] font-medium text-warning-600 dark:bg-warning-600/15">
        Ứng viên chưa đính kèm file CV.
      </p>
    )}
  </div>
);

export const CvJobCard = ({ infoJob }: { infoJob: CvDetailJob }) => (
  <div className="surface p-6 sm:p-8">
    <h2 className="font-display text-[15px] font-bold text-ink-900 dark:text-white">
      Công việc ứng tuyển
    </h2>

    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <div>
        <p className={label}>Tên công việc</p>
        <p className={value}>{infoJob.title}</p>
      </div>
      <div>
        <p className={label}>Mức lương</p>
        <p className="mt-0.5 text-[13.5px] font-extrabold text-success-600 dark:text-success-500">
          {formatSalary(infoJob.salaryMin, infoJob.salaryMax)}
        </p>
      </div>
      <div>
        <p className={label}>Cấp bậc</p>
        <p className={value}>{getPositionLabel(infoJob.position)}</p>
      </div>
      <div>
        <p className={label}>Hình thức</p>
        <p className={value}>{getWorkingFormLabel(infoJob.workingForm)}</p>
      </div>
    </div>

    {infoJob.technologies?.length > 0 && (
      <div className="mt-5">
        <p className={label}>Công nghệ</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {infoJob.technologies.map((tech) => (
            <span key={tech} className="chip">
              {tech}
            </span>
          ))}
        </div>
      </div>
    )}

    <Link href={`/job/detail/${infoJob.id}`} className="btn-outline mt-5 inline-flex">
      Xem tin tuyển dụng
    </Link>
  </div>
);

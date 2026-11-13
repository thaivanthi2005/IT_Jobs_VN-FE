/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { JobForm } from "@/components/manage/JobForm";
import { API_URL } from "@/config/variable";
import type { JobFormValues } from "@/components/manage/JobFormFields";

export const FormEdit = ({ id }: { id: string }) => {
  const router = useRouter();
  const [initial, setInitial] = useState<JobFormValues | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/company/job/edit/${id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data: any) => {
        if (data.code === "error") {
          setError(data.message || "Không tải được công việc!");
          return;
        }
        const job = data.jobDetail;
        setInitial({
          title: job.title || "",
          salaryMin: String(job.salaryMin ?? ""),
          salaryMax: String(job.salaryMax ?? ""),
          position: job.position || "intern",
          workingForm: job.workingForm || "office",
          technologies: (job.technologies || []).join(", "),
          description: job.description || "",
          images: job.images || [],
        });
      })
      .catch(() => setError("Không kết nối được máy chủ!"));
  }, [id]);

  if (error) {
    return (
      <div className="surface p-8 text-center">
        <p className="text-sm font-medium text-danger-600">{error}</p>
        <button
          type="button"
          onClick={() => router.push("/company-manage/job/list")}
          className="btn-outline mt-5"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  if (!initial) return <div className="surface h-96 animate-pulse" />;

  return <JobForm jobId={id} initial={initial} />;
};

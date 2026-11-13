/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toaster, toast } from "sonner";
import { FaArrowLeft, FaFloppyDisk } from "react-icons/fa6";
import { EditorMCE } from "@/components/editor/EditorMCE";
import { API_URL } from "@/config/variable";
import type { FieldErrors } from "@/types/forms";
import { BasicFields, emptyValues, type JobFormValues } from "./JobFormFields";
import { ImageFields } from "./JobFormImages";

export const JobForm = ({ jobId, initial }: { jobId?: string; initial?: JobFormValues }) => {
  const router = useRouter();
  const editorRef = useRef<any>(null);
  const [values, setValues] = useState<JobFormValues>(initial ?? emptyValues);
  const [existingImages, setExistingImages] = useState<string[]>(initial?.images ?? []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState(false);

  const set = <K extends keyof JobFormValues>(key: K, value: JobFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    const nextErrors: FieldErrors = {};
    if (!values.title.trim()) nextErrors.title = "Vui lòng nhập tên công việc!";
    if (values.salaryMin && Number(values.salaryMin) < 0)
      nextErrors.salaryMin = "Vui lòng nhập mức lương >= 0";
    if (values.salaryMax && Number(values.salaryMax) < 0)
      nextErrors.salaryMax = "Vui lòng nhập mức lương >= 0";
    if (
      values.salaryMin &&
      values.salaryMax &&
      Number(values.salaryMin) > Number(values.salaryMax)
    )
      nextErrors.salaryMax = "Lương tối đa phải lớn hơn hoặc bằng lương tối thiểu!";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Vui lòng kiểm tra lại các trường được đánh dấu.");
      return;
    }

    const description = editorRef.current ? editorRef.current.getContent() : values.description;

    const formData = new FormData();
    formData.append("title", values.title.trim());
    formData.append("salaryMin", values.salaryMin || "0");
    formData.append("salaryMax", values.salaryMax || "0");
    formData.append("position", values.position);
    formData.append("workingForm", values.workingForm);
    formData.append("technologies", values.technologies.trim());
    formData.append("description", description);
    newFiles.forEach((file) => formData.append("images", file));

    setPending(true);
    try {
      const res = await fetch(
        jobId ? `${API_URL}/company/job/edit/${jobId}` : `${API_URL}/company/job/create`,
        { method: jobId ? "PATCH" : "POST", body: formData, credentials: "include" }
      );
      const data = await res.json();

      if (data.code === "error") {
        toast.error(data.message || "Lưu thất bại!");
        return;
      }

      toast.success(data.message || "Lưu thành công!");
      setNewFiles([]);
      router.push("/company-manage/job/list");
      router.refresh();
    } catch {
      toast.error("Không kết nối được máy chủ!");
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="surface p-6 sm:p-8">
          <h2 className="font-display text-[15px] font-bold text-ink-900 dark:text-white">
            Thông tin cơ bản
          </h2>
          <BasicFields values={values} errors={errors} onChange={set} />
        </div>

        <div className="surface p-6 sm:p-8">
          <h2 className="font-display text-[15px] font-bold text-ink-900 dark:text-white">
            Hình ảnh
          </h2>
          <ImageFields
            existingImages={existingImages}
            newFiles={newFiles}
            onRemoveExisting={(index) =>
              setExistingImages((prev) => prev.filter((_, i) => i !== index))
            }
            onPickFiles={setNewFiles}
            onRemoveFile={(index) =>
              setNewFiles((prev) => prev.filter((_, i) => i !== index))
            }
          />
        </div>

        <div className="surface p-6 sm:p-8">
          <h2 className="font-display text-[15px] font-bold text-ink-900 dark:text-white">
            Mô tả chi tiết
          </h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-ink-200 dark:border-ink-700">
            <EditorMCE editorRef={editorRef} value={values.description} id="description" />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/company-manage/job/list" className="btn-ghost">
            <FaArrowLeft className="text-[11px]" aria-hidden="true" />
            Quay lại
          </Link>
          <button type="submit" disabled={pending} className="btn-primary">
            <FaFloppyDisk className="text-[12px]" aria-hidden="true" />
            {pending ? "Đang lưu…" : jobId ? "Cập nhật tin" : "Tạo tin tuyển dụng"}
          </button>
        </div>
      </form>
    </>
  );
};

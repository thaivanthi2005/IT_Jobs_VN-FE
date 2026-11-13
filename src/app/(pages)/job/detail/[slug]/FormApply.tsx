"use client";

import { useState } from "react";
import { Toaster, toast } from "sonner";
import { FaPaperPlane } from "react-icons/fa6";
import { API_URL } from "@/config/variable";
import { validateApplyForm, type FieldErrors } from "./apply-validation";
import { FileField, TextField } from "./ApplyFields";

export const FormApply = ({ jobId }: { jobId: string }) => {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [fileName, setFileName] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const fileInput = form.querySelector<HTMLInputElement>("#fileCV");
    const file = fileInput?.files?.[0] || null;

    const nextErrors = validateApplyForm(data, file);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      document.getElementById(Object.keys(nextErrors)[0])?.focus();
      return;
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("fullName", String(data.get("fullName")).trim());
    formData.append("email", String(data.get("email")).trim());
    formData.append("phone", String(data.get("phone")).trim());
    if (file) formData.append("fileCV", file);

    try {
      /* `credentials: "include"` is required: the session cookie is httpOnly and
         cross-origin (FE on :3000, BE on :4000), so without it the backend sees
         an anonymous request and cannot tie the application to the candidate. */
      const res = await fetch(`${API_URL}/job/apply`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const result = await res.json();

      if (result.code === "error") {
        toast.error(result.message || "Gửi CV thất bại!");
        return;
      }

      toast.success(result.message || "Đã gửi CV thành công!");
      form.reset();
      setFileName("");
      setErrors({});
    } catch {
      toast.error("Không kết nối được máy chủ!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <TextField
          id="fullName"
          label="Họ tên"
          placeholder="Nguyễn Văn A"
          autoComplete="name"
          error={errors.fullName}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="email"
            type="email"
            label="Email"
            placeholder="ban@email.com"
            autoComplete="email"
            error={errors.email}
          />
          <TextField
            id="phone"
            type="tel"
            label="Số điện thoại"
            placeholder="0912345678"
            autoComplete="tel"
            error={errors.phone}
          />
        </div>

        <FileField
          fileName={fileName}
          error={errors.fileCV}
          onChange={(name) => {
            setFileName(name);
            setErrors((prev) => ({ ...prev, fileCV: "" }));
          }}
        />

        <button type="submit" disabled={submitting} className="btn-primary h-12 w-full text-[15px]">
          <FaPaperPlane className="text-[13px]" aria-hidden="true" />
          {submitting ? "Đang gửi hồ sơ…" : "Gửi CV ứng tuyển"}
        </button>

        <p className="text-center text-[11.5px] leading-relaxed text-ink-400">
          Bằng việc gửi hồ sơ, bạn đồng ý với Điều khoản và Chính sách bảo mật của ITJobs.
        </p>
      </form>
    </>
  );
};

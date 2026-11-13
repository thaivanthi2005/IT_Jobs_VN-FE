"use client";

import { useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import { FaCloudArrowUp, FaUser } from "react-icons/fa6";
import { useAuth } from "@/hooks/useAuth";
import { API_URL } from "@/config/variable";
import { FormField } from "@/components/manage/FormField";

export const FormProfile = () => {
  const { infoUser, refresh } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!infoUser) return <div className="surface h-48 animate-pulse" />;

  const currentAvatar = preview || infoUser.avatar || "";

  return (
    <>
      <Toaster richColors position="top-right" />
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (pending) return;

          const form = event.currentTarget;
          const fullName = form.fullName.value.trim();
          const email = form.email.value.trim();
          const phone = form.phone.value.trim();

          const nextErrors: Record<string, string> = {};
          if (!fullName) nextErrors.fullName = "Vui lòng nhập họ tên!";
          else if (fullName.length < 5)
            nextErrors.fullName = "Họ tên phải có ít nhất 5 ký tự!";
          else if (fullName.length > 50)
            nextErrors.fullName = "Họ tên không được vượt quá 50 ký tự!";
          if (!email) nextErrors.email = "Vui lòng nhập email!";
          else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            nextErrors.email = "Email không đúng định dạng!";

          setErrors(nextErrors);
          if (Object.keys(nextErrors).length > 0) return;

          const formData = new FormData();
          formData.append("fullName", fullName);
          formData.append("email", email);
          formData.append("phone", phone);
          if (avatarFile) formData.append("avatar", avatarFile);

          setPending(true);
          try {
            const res = await fetch(`${API_URL}/user/profile`, {
              method: "PATCH",
              body: formData,
              credentials: "include",
            });
            const data = await res.json();
            if (data.code === "error") {
              toast.error(data.message || "Cập nhật thất bại!");
              return;
            }
            toast.success(data.message || "Cập nhật thành công!");
            setPreview("");
            setAvatarFile(null);
            refresh();
          } catch {
            toast.error("Không kết nối được máy chủ!");
          } finally {
            setPending(false);
          }
        }}
        className="surface p-6 sm:p-8"
      >
        <div className="flex flex-col items-start gap-5 border-b border-ink-100 pb-6 dark:border-ink-800 sm:flex-row sm:items-center">
          <span className="inline-flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-ink-200 bg-ink-50 text-2xl font-extrabold text-brand-700 dark:border-ink-700 dark:bg-ink-800 dark:text-brand-300">
            {currentAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentAvatar} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <FaUser aria-hidden="true" />
            )}
          </span>
          <div>
            <p className="font-display text-[14px] font-bold text-ink-900 dark:text-white">
              Ảnh đại diện
            </p>
            <p className="mt-0.5 text-[12.5px] text-ink-500 dark:text-ink-400">
              JPG hoặc PNG, kích thước tối thiểu 200×200px.
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-outline btn-sm mt-2.5"
            >
              <FaCloudArrowUp className="text-[11px]" aria-hidden="true" />
              Chọn ảnh
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                setAvatarFile(file);
                setPreview(URL.createObjectURL(file));
              }}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FormField
              id="fullName"
              label="Họ tên"
              defaultValue={infoUser.fullName}
              error={errors.fullName}
              required
            />
          </div>
          <FormField
            id="email"
            type="email"
            label="Email"
            defaultValue={infoUser.email}
            error={errors.email}
            required
          />
          <FormField
            id="phone"
            type="tel"
            label="Số điện thoại"
            defaultValue={infoUser.phone || ""}
            placeholder="0912345678"
          />
        </div>

        <div className="mt-7 flex justify-end border-t border-ink-100 pt-6 dark:border-ink-800">
          <button type="submit" disabled={pending} className="btn-primary">
            {pending ? "Đang cập nhật…" : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </>
  );
};

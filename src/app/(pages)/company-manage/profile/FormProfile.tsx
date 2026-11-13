"use client";

import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import { FaFloppyDisk } from "react-icons/fa6";
import { EditorMCE } from "@/components/editor/EditorMCE";
import { useAuth } from "@/hooks/useAuth";
import { API_URL } from "@/config/variable";
import type { City } from "@/types/api";
import { CompanyFields } from "./CompanyFields";
import { LogoUpload } from "./LogoUpload";

export const FormProfile = () => {
  const { infoCompany, refresh } = useAuth();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [pending, setPending] = useState(false);
  const editorRef = useRef<unknown>(null);

  useEffect(() => {
    fetch(`${API_URL}/city/list`)
      .then((res) => res.json())
      .then((data: { cityList?: City[] }) => setCities(data.cityList || []))
      .catch(() => undefined);
  }, []);

  if (!infoCompany) return <div className="surface h-96 animate-pulse" />;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    const form = event.currentTarget;
    const companyName = form.companyName.value.trim();
    const email = form.email.value.trim();

    if (!companyName) return toast.error("Vui lòng nhập tên công ty!");
    if (companyName.length > 200)
      return toast.error("Tên công ty không được vượt quá 200 ký tự!");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return toast.error("Email không đúng định dạng!");

    const description =
      (editorRef.current as { getContent?: () => string } | null)?.getContent?.() ??
      infoCompany.description ??
      "";

    const formData = new FormData();
    formData.append("companyName", companyName);
    formData.append("email", email);
    formData.append("city", form.city.value);
    formData.append("address", form.address.value);
    formData.append("companyModel", form.companyModel.value);
    formData.append("companyEmployees", form.companyEmployees.value);
    formData.append("workingTime", form.workingTime.value);
    formData.append("workOvertime", form.workOvertime.value);
    formData.append("phone", form.phone.value);
    formData.append("description", description);
    if (logoFile) formData.append("logo", logoFile);

    setPending(true);
    try {
      const res = await fetch(`${API_URL}/company/profile`, {
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
      setLogoFile(null);
      refresh();
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
            Nhận diện thương hiệu
          </h2>

          <LogoUpload
            current={preview || infoCompany.logo || ""}
            fallback={infoCompany.companyName}
            onPick={(file) => {
              setLogoFile(file);
              setPreview(URL.createObjectURL(file));
            }}
          />

          <CompanyFields infoCompany={infoCompany} cities={cities} />
        </div>

        <div className="surface p-6 sm:p-8">
          <h2 className="font-display text-[15px] font-bold text-ink-900 dark:text-white">
            Giới thiệu công ty
          </h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-ink-200 dark:border-ink-700">
            <EditorMCE
              editorRef={editorRef}
              value={infoCompany.description || ""}
              id="description"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={pending} className="btn-primary">
            <FaFloppyDisk className="text-[12px]" aria-hidden="true" />
            {pending ? "Đang lưu…" : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </>
  );
};

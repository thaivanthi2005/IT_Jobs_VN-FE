"use client";

import { useState } from "react";
import { Toaster, toast } from "sonner";
import { FaCircleCheck, FaEye, FaPhone, FaEnvelope } from "react-icons/fa6";
import Link from "next/link";
import { ButtonDelete } from "@/components/manage/ButtonDelete";
import { Badge } from "@/components/ui/Badge";
import { API_URL, cvStatusList } from "@/config/variable";
import type { CvCompanyItem } from "@/types/api";

export const CVItem = ({
  item,
  onDeleteSuccess,
}: {
  item: CvCompanyItem;
  onDeleteSuccess: (id: string) => void;
}) => {
  const [status, setStatus] = useState(item.status);
  const [pending, setPending] = useState(false);

  const current = cvStatusList.find((s) => s.value === status) || cvStatusList[0];

  const changeStatus = async (action: string) => {
    if (pending) return;
    setPending(true);
    try {
      const res = await fetch(`${API_URL}/company/cv/change-status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, id: item.id }),
      });
      const data = await res.json();
      if (data.code === "success") {
        setStatus(action);
        toast.success("Cập nhật trạng thái thành công!");
      } else {
        toast.error(data.message || "Không thể cập nhật trạng thái!");
      }
    } catch {
      toast.error("Không kết nối được máy chủ!");
    } finally {
      setPending(false);
    }
  };

  return (
    <li className="surface p-5">
      <Toaster richColors position="top-right" />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="line-clamp-1 font-display text-[15px] font-bold text-ink-900 dark:text-white">
            {item.jobTitle}
          </h3>
          <p className="mt-1 text-[13px] text-ink-500 dark:text-ink-400">
            Ứng viên:{" "}
            <span className="font-semibold text-ink-800 dark:text-ink-100">{item.fullName}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Badge tone="neutral" dot={current.dot}>
            {current.label}
          </Badge>
          <Badge tone={item.viewed ? "success" : "warning"}>
            <FaEye className="text-[9px]" aria-hidden="true" />
            {item.viewed ? "Đã xem" : "Chưa xem"}
          </Badge>
        </div>
      </div>

      <div className="mt-3.5 grid gap-1.5 text-[12.5px] text-ink-600 dark:text-ink-300 sm:grid-cols-2">
        <a
          href={`mailto:${item.email}`}
          className="inline-flex items-center gap-2 truncate hover:text-brand-600"
        >
          <FaEnvelope className="shrink-0 text-[10px] text-ink-400" aria-hidden="true" />
          <span className="truncate">{item.email}</span>
        </a>
        <a
          href={`tel:${item.phone}`}
          className="inline-flex items-center gap-2 truncate hover:text-brand-600"
        >
          <FaPhone className="shrink-0 text-[10px] text-ink-400" aria-hidden="true" />
          {item.phone}
        </a>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ink-100 pt-3.5 dark:border-ink-800">
        <Link href={`/company-manage/cv/detail/${item.id}`} className="btn-primary btn-sm">
          <FaEye className="text-[10px]" aria-hidden="true" />
          Xem CV
        </Link>
        {(current.value === "initial" || current.value === "rejected") && (
          <button
            type="button"
            onClick={() => changeStatus("approved")}
            disabled={pending}
            className="btn btn-sm bg-success-600 px-3.5 py-2 text-white hover:bg-success-700"
          >
            <FaCircleCheck className="text-[10px]" aria-hidden="true" />
            Duyệt
          </button>
        )}
        {(current.value === "initial" || current.value === "approved") && (
          <button
            type="button"
            onClick={() => changeStatus("rejected")}
            disabled={pending}
            className="btn btn-sm bg-danger-600 px-3.5 py-2 text-white hover:bg-danger-700"
          >
            Từ chối
          </button>
        )}
        <div className="ml-auto">
          <ButtonDelete
            api={`${API_URL}/company/cv/delete/${item.id}`}
            item={{ id: item.id, jobTitle: item.jobTitle }}
            onDeleteSuccess={onDeleteSuccess}
          />
        </div>
      </div>
    </li>
  );
};

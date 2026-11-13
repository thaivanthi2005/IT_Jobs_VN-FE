"use client";

import { useState } from "react";
import { FaCircleExclamation, FaTrashCan, FaXmark } from "react-icons/fa6";

export const ButtonDelete = ({
  api,
  item,
  label,
  onDeleteSuccess,
  className = "btn-danger btn-sm",
}: {
  api: string;
  item: { id: string; title?: string; jobTitle?: string };
  label?: string;
  onDeleteSuccess: (id: string) => void;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const name = item.title || item.jobTitle || "bản ghi này";

  const handleDelete = async () => {
    setPending(true);
    setError("");
    try {
      const res = await fetch(api, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (data.code === "error") {
        setError(data.message || "Xoá thất bại!");
        return;
      }
      onDeleteSuccess(item.id);
      setOpen(false);
    } catch {
      setError("Không kết nối được máy chủ!");
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        <FaTrashCan className="text-[11px]" aria-hidden="true" />
        {label || "Xoá"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-ink-950/50 p-4 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div className="w-full max-w-sm rounded-2xl border border-ink-200 bg-white p-6 shadow-lift animate-scale-in dark:border-ink-700 dark:bg-ink-900">
            <div className="flex items-start justify-between gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-danger-50 text-danger-600 ring-1 ring-inset ring-danger-500/15 dark:bg-danger-600/15 dark:text-danger-400">
                <FaCircleExclamation className="text-base" aria-hidden="true" />
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Đóng"
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800"
              >
                <FaXmark className="text-[12px]" aria-hidden="true" />
              </button>
            </div>

            <h2
              id="delete-dialog-title"
              className="mt-4 font-display text-base font-bold text-ink-900 dark:text-white"
            >
              Xác nhận xoá
            </h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">
              Bạn có chắc muốn xoá <span className="font-semibold text-ink-700 dark:text-ink-200">{name}</span>?
              Hành động này không thể hoàn tác.
            </p>

            {error && (
              <p className="mt-3 rounded-lg bg-danger-50 px-3 py-2 text-[12px] font-medium text-danger-700 dark:bg-danger-950/40 dark:text-danger-400">
                {error}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="btn-outline btn-sm">
                Huỷ
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={pending}
                className="btn-danger btn-sm"
              >
                {pending ? "Đang xoá…" : "Xoá"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

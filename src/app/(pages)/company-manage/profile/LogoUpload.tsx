"use client";

import { useRef } from "react";
import { FaCloudArrowUp } from "react-icons/fa6";

export const LogoUpload = ({
  current,
  fallback,
  onPick,
}: {
  current: string;
  fallback: string;
  onPick: (file: File) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mt-5 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
      <span className="inline-flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-ink-200 bg-white p-2 dark:border-ink-700">
        {current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current} alt="Logo" className="h-full w-full object-contain" />
        ) : (
          <span className="text-xl font-extrabold text-brand-700">
            {fallback.slice(0, 2).toUpperCase()}
          </span>
        )}
      </span>
      <div>
        <p className="font-display text-[14px] font-bold text-ink-900 dark:text-white">
          Logo công ty
        </p>
        <p className="mt-0.5 text-[12.5px] text-ink-500 dark:text-ink-400">
          Nên dùng ảnh vuông, tối thiểu 300×300px.
        </p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn-outline btn-sm mt-2.5"
        >
          <FaCloudArrowUp className="text-[11px]" aria-hidden="true" />
          Chọn logo
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onPick(file);
          }}
        />
      </div>
    </div>
  );
};

"use client";

import { FaCloudArrowUp, FaFilePdf } from "react-icons/fa6";

export const TextField = ({
  id,
  label,
  error,
  type = "text",
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  error?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) => (
  <div>
    <label htmlFor={id} className="field-label">
      {label} <span className="text-danger-500">*</span>
    </label>
    <input
      type={type}
      name={id}
      id={id}
      placeholder={placeholder}
      autoComplete={autoComplete}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`field h-11 ${error ? "border-danger-500 focus:border-danger-500" : ""}`}
    />
    {error && (
      <p id={`${id}-error`} className="mt-1.5 text-[12px] font-medium text-danger-600">
        {error}
      </p>
    )}
  </div>
);

export const FileField = ({
  fileName,
  error,
  onChange,
}: {
  fileName: string;
  error?: string;
  onChange: (name: string) => void;
}) => (
  <div>
    <label htmlFor="fileCV" className="field-label">
      File CV (PDF, tối đa 5MB) <span className="text-danger-500">*</span>
    </label>
    <label
      htmlFor="fileCV"
      className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed px-4 py-4 transition-colors duration-200 ${
        error
          ? "border-danger-400 bg-danger-50/50 dark:bg-danger-950/20"
          : "border-ink-200 bg-ink-50/60 hover:border-brand-400 hover:bg-brand-50/60 dark:border-ink-700 dark:bg-ink-900/40 dark:hover:border-brand-500"
      }`}
    >
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600 shadow-soft ring-1 ring-inset ring-ink-200 dark:bg-ink-800 dark:text-brand-300 dark:ring-ink-700">
        {fileName ? (
          <FaFilePdf className="text-[15px]" aria-hidden="true" />
        ) : (
          <FaCloudArrowUp className="text-[15px]" aria-hidden="true" />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold text-ink-800 dark:text-ink-100">
          {fileName || "Chọn hoặc kéo thả file CV vào đây"}
        </span>
        <span className="mt-0.5 block text-[11.5px] text-ink-500 dark:text-ink-400">
          Chỉ nhận định dạng PDF, dung lượng tối đa 5MB
        </span>
      </span>
      <input
        type="file"
        name="fileCV"
        id="fileCV"
        accept="application/pdf"
        className="sr-only"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "fileCV-error" : undefined}
        onChange={(event) => onChange(event.target.files?.[0]?.name || "")}
      />
    </label>
    {error && (
      <p id="fileCV-error" className="mt-1.5 text-[12px] font-medium text-danger-600">
        {error}
      </p>
    )}
  </div>
);

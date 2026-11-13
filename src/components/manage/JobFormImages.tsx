/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef } from "react";
import { FaCloudArrowUp, FaXmark } from "react-icons/fa6";

export const ImageFields = ({
  existingImages,
  newFiles,
  onRemoveExisting,
  onPickFiles,
  onRemoveFile,
}: {
  existingImages: string[];
  newFiles: File[];
  onRemoveExisting: (index: number) => void;
  onPickFiles: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      {existingImages.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-[11.5px] font-semibold text-ink-500">Ảnh hiện tại</p>
          <div className="grid grid-cols-3 gap-2.5">
            {existingImages.map((image, index) => (
              <div key={`${image}-${index}`} className="relative overflow-hidden rounded-lg">
                <img src={image} alt="" className="aspect-[4/3] w-full object-cover" />
                <button
                  type="button"
                  onClick={() => onRemoveExisting(index)}
                  aria-label="Xoá ảnh"
                  className="absolute right-1.5 top-1.5 inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-ink-950/60 text-white backdrop-blur-sm hover:bg-danger-600"
                >
                  <FaXmark className="text-[9px]" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn-outline w-full border-dashed py-4"
        >
          <FaCloudArrowUp className="text-[13px]" aria-hidden="true" />
          Chọn ảnh công ty (tối đa 8)
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(event) => onPickFiles(Array.from(event.target.files || []).slice(0, 8))}
        />
        {newFiles.length > 0 && (
          <ul className="mt-2.5 space-y-1.5">
            {newFiles.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center justify-between rounded-lg bg-ink-50 px-3 py-2 text-[12px] dark:bg-ink-900/60"
              >
                <span className="truncate text-ink-600 dark:text-ink-300">{file.name}</span>
                <button
                  type="button"
                  onClick={() => onRemoveFile(index)}
                  aria-label={`Xoá ${file.name}`}
                  className="cursor-pointer text-ink-400 hover:text-danger-600"
                >
                  <FaXmark className="text-[10px]" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

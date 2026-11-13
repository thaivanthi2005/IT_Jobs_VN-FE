"use client";

import { positionList, workingFormList } from "@/config/variable";
import type { FieldErrors } from "@/types/forms";

export type JobFormValues = {
  title: string;
  salaryMin: string;
  salaryMax: string;
  position: string;
  workingForm: string;
  technologies: string;
  description: string;
  images: string[];
};

export const emptyValues: JobFormValues = {
  title: "",
  salaryMin: "",
  salaryMax: "",
  position: "intern",
  workingForm: "office",
  technologies: "",
  description: "",
  images: [],
};

export const BasicFields = ({
  values,
  errors,
  onChange,
}: {
  values: JobFormValues;
  errors: FieldErrors;
  onChange: <K extends keyof JobFormValues>(key: K, value: JobFormValues[K]) => void;
}) => (
  <div className="mt-5 grid gap-5 sm:grid-cols-2">
    <div className="sm:col-span-2">
      <label htmlFor="title" className="field-label">
        Tên công việc <span className="text-danger-500">*</span>
      </label>
      <input
        id="title"
        value={values.title}
        onChange={(event) => onChange("title", event.target.value)}
        placeholder="VD: Senior ReactJS Developer"
        aria-invalid={Boolean(errors.title)}
        className={`field h-11 ${errors.title ? "border-danger-500" : ""}`}
      />
      {errors.title && (
        <p className="mt-1.5 text-[12px] font-medium text-danger-600">{errors.title}</p>
      )}
    </div>

    <div>
      <label htmlFor="salaryMin" className="field-label">
        Mức lương tối thiểu ($)
      </label>
      <input
        id="salaryMin"
        type="number"
        min={0}
        value={values.salaryMin}
        onChange={(event) => onChange("salaryMin", event.target.value)}
        placeholder="1000"
        aria-invalid={Boolean(errors.salaryMin)}
        className={`field h-11 ${errors.salaryMin ? "border-danger-500" : ""}`}
      />
      {errors.salaryMin && (
        <p className="mt-1.5 text-[12px] font-medium text-danger-600">{errors.salaryMin}</p>
      )}
    </div>

    <div>
      <label htmlFor="salaryMax" className="field-label">
        Mức lương tối đa ($)
      </label>
      <input
        id="salaryMax"
        type="number"
        min={0}
        value={values.salaryMax}
        onChange={(event) => onChange("salaryMax", event.target.value)}
        placeholder="2000"
        aria-invalid={Boolean(errors.salaryMax)}
        className={`field h-11 ${errors.salaryMax ? "border-danger-500" : ""}`}
      />
      {errors.salaryMax && (
        <p className="mt-1.5 text-[12px] font-medium text-danger-600">{errors.salaryMax}</p>
      )}
    </div>

    <div>
      <label htmlFor="position" className="field-label">
        Cấp bậc <span className="text-danger-500">*</span>
      </label>
      <select
        id="position"
        value={values.position}
        onChange={(event) => onChange("position", event.target.value)}
        className="field-select h-11"
      >
        {positionList.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label htmlFor="workingForm" className="field-label">
        Hình thức làm việc <span className="text-danger-500">*</span>
      </label>
      <select
        id="workingForm"
        value={values.workingForm}
        onChange={(event) => onChange("workingForm", event.target.value)}
        className="field-select h-11"
      >
        {workingFormList.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>

    <div className="sm:col-span-2">
      <label htmlFor="technologies" className="field-label">
        Công nghệ sử dụng
      </label>
      <input
        id="technologies"
        value={values.technologies}
        onChange={(event) => onChange("technologies", event.target.value)}
        placeholder="ReactJS, NodeJS, MongoDB"
        className="field h-11"
      />
      <p className="mt-1.5 text-[11.5px] text-ink-400">
        Phân tách bằng dấu phẩy và khoảng trắng, ví dụ{" "}
        <code className="rounded bg-ink-100 px-1 dark:bg-ink-800">ReactJS, NodeJS</code>
      </p>
    </div>
  </div>
);

"use client";

import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { passwordRules } from "@/lib/validation";

export const PasswordField = ({
  id = "password",
  value,
  onChange,
  error,
  label = "Mật khẩu",
  showRules = false,
  autoComplete = "new-password",
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  showRules?: boolean;
  autoComplete?: string;
}) => (
  <div>
    <label htmlFor={id} className="field-label">
      {label} <span className="text-danger-500">*</span>
    </label>
    <input
      type="password"
      name={id}
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      autoComplete={autoComplete}
      placeholder="••••••••"
      aria-invalid={Boolean(error)}
      aria-describedby={showRules ? `${id}-rules` : error ? `${id}-error` : undefined}
      className={`field h-11 ${error ? "border-danger-500 focus:border-danger-500" : ""}`}
    />
    {error && (
      <p id={`${id}-error`} className="mt-1.5 text-[12px] font-medium text-danger-600">
        {error}
      </p>
    )}
    {showRules && (
      <ul id={`${id}-rules`} className="mt-2.5 grid grid-cols-1 gap-1 sm:grid-cols-2">
        {passwordRules.map((rule) => {
          const passed = rule.test(value);
          return (
            <li
              key={rule.id}
              className={`flex items-center gap-1.5 text-[11.5px] font-medium transition-colors ${
                passed ? "text-success-600 dark:text-success-500" : "text-ink-400"
              }`}
            >
              {passed ? (
                <FaCircleCheck className="text-[10px]" aria-hidden="true" />
              ) : (
                <FaCircleXmark className="text-[10px]" aria-hidden="true" />
              )}
              {rule.label}
            </li>
          );
        })}
      </ul>
    )}
  </div>
);

"use client";

import { useState, type FormEvent } from "react";
import { FaArrowRight, FaCircleExclamation } from "react-icons/fa6";
import { API_URL } from "@/config/variable";
import { isValidEmail } from "@/lib/validation";
import { PasswordField } from "@/components/auth/PasswordField";
import type { FieldErrors } from "@/types/forms";

export const FormLogin = ({ role = "user" }: { role?: "user" | "company" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const endpoint = role === "company" ? `${API_URL}/company/login` : `${API_URL}/user/login`;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const nextErrors: FieldErrors = {};
    if (!email.trim()) nextErrors.email = "Vui lòng nhập email của bạn!";
    else if (!isValidEmail(email)) nextErrors.email = "Email không đúng định dạng!";
    if (!password) nextErrors.password = "Vui lòng nhập mật khẩu!";
    else if (password.length < 8) nextErrors.password = "Mật khẩu phải chứa ít nhất 8 ký tự!";

    setErrors(nextErrors);
    setServerError("");
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
        credentials: "include",
      });
      const data = await res.json().catch(() => null);

      if (!data || data.code === "error") {
        setServerError(data?.message || "Đăng nhập thất bại!");
        return;
      }

      // Cookie is httpOnly and set by the API — full reload confirms it before routing.
      window.location.assign(role === "company" ? "/company-manage/profile" : "/");
    } catch {
      setServerError("Không kết nối được máy chủ!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-[12.5px] font-medium text-danger-700 dark:border-danger-800 dark:bg-danger-950/40 dark:text-danger-400"
        >
          <FaCircleExclamation className="mt-0.5 shrink-0 text-[12px]" aria-hidden="true" />
          {serverError}
        </div>
      )}

      <div>
        <label htmlFor="email" className="field-label">
          Email <span className="text-danger-500">*</span>
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          placeholder="ban@email.com"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={`field h-11 ${errors.email ? "border-danger-500" : ""}`}
        />
        {errors.email && (
          <p id="email-error" className="mt-1.5 text-[12px] font-medium text-danger-600">
            {errors.email}
          </p>
        )}
      </div>

      <PasswordField
        value={password}
        onChange={setPassword}
        error={errors.password}
        autoComplete="current-password"
      />

      <button type="submit" disabled={submitting} className="btn-primary h-11 w-full">
        {submitting ? "Đang đăng nhập…" : "Đăng nhập"}
        {!submitting && <FaArrowRight className="text-[11px]" aria-hidden="true" />}
      </button>
    </form>
  );
};

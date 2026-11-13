"use client";

import { useState, type FormEvent } from "react";
import { FaArrowRight, FaCircleExclamation } from "react-icons/fa6";
import { API_URL } from "@/config/variable";
import { isStrongPassword, isValidEmail } from "@/lib/validation";
import { PasswordField } from "@/components/auth/PasswordField";
import type { FieldErrors } from "@/types/forms";

export const FormRegister = ({ role = "user" }: { role?: "user" | "company" }) => {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isCompany = role === "company";
  const endpoint = isCompany ? `${API_URL}/company/register` : `${API_URL}/user/register`;
  const loginHref = isCompany ? "/company/login" : "/user/login";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const nextErrors: FieldErrors = {};

    if (isCompany) {
      if (!companyName.trim()) nextErrors.companyName = "Vui lòng nhập tên công ty!";
      else if (companyName.trim().length > 200)
        nextErrors.companyName = "Tên công ty không được vượt quá 200 ký tự!";
    } else {
      if (!fullName.trim()) nextErrors.fullName = "Vui lòng nhập họ tên!";
      else if (fullName.trim().length < 5) nextErrors.fullName = "Họ tên phải có ít nhất 5 ký tự!";
      else if (fullName.trim().length > 50)
        nextErrors.fullName = "Họ tên không được vượt quá 50 ký tự!";
    }

    if (!email.trim()) nextErrors.email = "Vui lòng nhập email!";
    else if (!isValidEmail(email)) nextErrors.email = "Email không đúng định dạng!";

    if (!password) nextErrors.password = "Vui lòng nhập mật khẩu!";
    else if (!isStrongPassword(password))
      nextErrors.password = "Mật khẩu chưa đáp ứng yêu cầu bảo mật!";

    setErrors(nextErrors);
    setServerError("");
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);

    try {
      const body = isCompany
        ? { companyName: companyName.trim(), email: email.trim(), password }
        : { fullName: fullName.trim(), email: email.trim(), password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => null);

      if (!data || data.code === "error") {
        setServerError(data?.message || "Đăng ký thất bại!");
        return;
      }

      window.location.assign(loginHref);
    } catch {
      setServerError("Không kết nối được máy chủ!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <AuthError message={serverError} />

      {isCompany ? (
        <FormField
          id="companyName"
          label="Tên công ty"
          value={companyName}
          onChange={setCompanyName}
          error={errors.companyName}
          placeholder="Công ty TNHH ABC"
          autoComplete="organization"
        />
      ) : (
        <FormField
          id="fullName"
          label="Họ tên"
          value={fullName}
          onChange={setFullName}
          error={errors.fullName}
          placeholder="Nguyễn Văn A"
          autoComplete="name"
        />
      )}

      <FormField
        id="email"
        type="email"
        label="Email"
        value={email}
        onChange={setEmail}
        error={errors.email}
        placeholder="ban@email.com"
        autoComplete="email"
      />

      <PasswordField value={password} onChange={setPassword} error={errors.password} showRules />

      <button type="submit" disabled={submitting} className="btn-primary h-11 w-full">
        {submitting ? "Đang tạo tài khoản…" : "Tạo tài khoản"}
        {!submitting && <FaArrowRight className="text-[11px]" aria-hidden="true" />}
      </button>
    </form>
  );
};

const AuthError = ({ message }: { message: string }) =>
  message ? (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-[12.5px] font-medium text-danger-700 dark:border-danger-800 dark:bg-danger-950/40 dark:text-danger-400"
    >
      <FaCircleExclamation className="mt-0.5 shrink-0 text-[12px]" aria-hidden="true" />
      {message}
    </div>
  ) : null;

const FormField = ({
  id,
  label,
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  type?: string;
}) => (
  <div>
    <label htmlFor={id} className="field-label">
      {label} <span className="text-danger-500">*</span>
    </label>
    <input
      type={type}
      name={id}
      id={id}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      autoComplete={autoComplete}
      placeholder={placeholder}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`field h-11 ${error ? "border-danger-500" : ""}`}
    />
    {error && (
      <p id={`${id}-error`} className="mt-1.5 text-[12px] font-medium text-danger-600">
        {error}
      </p>
    )}
  </div>
);

import Link from "next/link";
import type { ReactNode } from "react";
import { FaArrowLeft, FaCheck, FaBriefcase } from "react-icons/fa6";
import { Logo } from "@/components/layout/Logo";
import { Backdrop3D } from "@/components/three/Backdrop3D";

const benefits = [
  "Hơn 1.200 tin tuyển dụng IT cập nhật mỗi ngày",
  "Theo dõi trạng thái hồ sơ theo thời gian thực",
  "Kết nối trực tiếp với 500+ công ty công nghệ",
];

export const AuthLayout = ({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}) => (
  <div className="min-h-[calc(100vh-var(--header-h))] lg:grid lg:grid-cols-2">
    {/* Left — form */}
    <div className="flex items-center justify-center px-4 py-10 sm:px-8">
      <div className="w-full max-w-[420px]">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-[13px] font-semibold text-ink-500 transition-colors hover:text-brand-600 dark:text-ink-400"
        >
          <FaArrowLeft className="text-[10px]" aria-hidden="true" />
          Về trang chủ
        </Link>

        <div className="lg:hidden">
          <Logo className="mb-6" />
        </div>

        <h1 className="font-display text-[24px] font-extrabold tracking-tight text-ink-900 dark:text-white sm:text-[27px]">
          {title}
        </h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">
          {description}
        </p>

        <div className="mt-5">{children}</div>

        <div className="mt-5 text-center text-[13px] text-ink-500 dark:text-ink-400">
          {footer}
        </div>
      </div>
    </div>

    {/* Right — brand panel */}
    <div className="relative hidden overflow-hidden bg-brand-fade lg:block">
      <div className="absolute inset-0 bg-hero-mesh" aria-hidden="true" />

      {/* 3D orb — sits behind the copy, never captures pointer events */}
      <div className="absolute inset-y-0 -right-10 w-[78%] opacity-90">
        <Backdrop3D variant="auth" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />
      <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
        <Logo onDark />

        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-brand-100 backdrop-blur-sm">
            <FaBriefcase className="text-[9px]" aria-hidden="true" />
            Nền tảng tuyển dụng IT
          </span>

          <h2 className="mt-5 max-w-md font-display text-[32px] font-extrabold leading-[1.15] tracking-tight text-white xl:text-[38px]">
            Sự nghiệp công nghệ tiếp theo bắt đầu từ đây
          </h2>

          <ul className="mt-8 space-y-3.5">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-500/20 text-success-400 ring-1 ring-inset ring-success-400/30">
                  <FaCheck className="text-[9px]" aria-hidden="true" />
                </span>
                <span className="text-[13.5px] leading-relaxed text-brand-100/85">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm">
          <div className="flex -space-x-2">
            {["N", "T", "H", "M"].map((initial, index) => (
              <span
                key={initial}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-brand-800 text-[10px] font-extrabold text-white ${
                  ["bg-brand-500", "bg-success-600", "bg-warning-500", "bg-brand-400"][index]
                }`}
              >
                {initial}
              </span>
            ))}
          </div>
          <p className="text-[12px] leading-snug text-brand-100/75">
            <span className="font-bold text-white">200.000+</span> lập trình viên đã tin dùng
            ITJobs
          </p>
        </div>
      </div>
    </div>
  </div>
);

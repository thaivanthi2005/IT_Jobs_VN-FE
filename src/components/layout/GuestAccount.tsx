"use client";

import Link from "next/link";
import { useState } from "react";
import { FaChevronDown, FaUserTie, FaBuilding, FaArrowRight } from "react-icons/fa6";

type RoleCard = {
  key: "user" | "company";
  title: string;
  desc: string;
  loginHref: string;
  registerHref: string;
  Icon: typeof FaUserTie;
};

const roles: RoleCard[] = [
  {
    key: "user",
    title: "Ứng viên",
    desc: "Tìm việc & ứng tuyển",
    loginHref: "/user/login",
    registerHref: "/user/register",
    Icon: FaUserTie,
  },
  {
    key: "company",
    title: "Nhà tuyển dụng",
    desc: "Đăng tin & tìm nhân tài",
    loginHref: "/company/login",
    registerHref: "/company/register",
    Icon: FaBuilding,
  },
];

const LoginDropdown = ({ fullWidth = false }: { fullWidth?: boolean }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={fullWidth ? "w-full" : "relative"}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Đăng nhập hoặc đăng ký"
        className={
          fullWidth
            ? "btn-primary w-full"
            : "btn-primary btn-sm"
        }
      >
        Đăng nhập
        <FaChevronDown
          className={`text-[9px] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          className={
            fullWidth
              ? "mt-2 w-full animate-fade-up"
              : "absolute right-0 top-full z-50 w-[336px] pt-2 animate-fade-up"
          }
        >
          <div className="rounded-lg border border-ink-200 bg-white p-2 shadow-lift dark:border-ink-700 dark:bg-ink-900">
            <p className="px-2 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-400">
              Chọn vai trò của bạn
            </p>

            <div className="grid grid-cols-2 gap-2">
              {roles.map(({ key, title, desc, loginHref, registerHref, Icon }) => (
                <div
                  key={key}
                  className="group rounded-md border border-ink-200 p-2.5 transition-colors duration-200 hover:border-brand-300 hover:bg-brand-50/60 dark:border-ink-700 dark:hover:border-brand-600 dark:hover:bg-ink-800"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100 dark:bg-ink-800 dark:text-brand-300 dark:ring-ink-700">
                    <Icon className="text-[12px]" aria-hidden="true" />
                  </span>
                  <p className="mt-2 font-display text-[13px] font-bold text-ink-900 dark:text-white">
                    {title}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-ink-500 dark:text-ink-400">
                    {desc}
                  </p>

                  <div className="mt-2.5 flex flex-col gap-1">
                    <Link
                      href={loginHref}
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center justify-between rounded-md bg-brand-600 px-2.5 py-1.5 text-[11.5px] font-semibold text-white transition-colors hover:bg-brand-700"
                    >
                      Đăng nhập
                      <FaArrowRight className="text-[8px]" aria-hidden="true" />
                    </Link>
                    <Link
                      href={registerHref}
                      onClick={() => setOpen(false)}
                      className="inline-flex items-center justify-center rounded-md border border-ink-200 px-2.5 py-1.5 text-[11.5px] font-semibold text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700 dark:border-ink-700 dark:text-ink-200 dark:hover:border-brand-600 dark:hover:text-brand-300"
                    >
                      Đăng ký
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const GuestAccount = ({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) => (
  <LoginDropdown fullWidth={variant === "mobile"} />
);

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUserTie, FaBuilding } from "react-icons/fa6";

/**
 * Two-role switcher shown on every auth page, so users never land on the
 * wrong login form without a way out.
 */
export const RoleTabs = ({ mode }: { mode: "login" | "register" }) => {
  const pathname = usePathname();
  const isCompany = pathname.startsWith("/company");

  const tabs = [
    {
      role: "Ứng viên",
      href: mode === "login" ? "/user/login" : "/user/register",
      active: !isCompany,
      Icon: FaUserTie,
    },
    {
      role: "Nhà tuyển dụng",
      href: mode === "login" ? "/company/login" : "/company/register",
      active: isCompany,
      Icon: FaBuilding,
    },
  ];

  return (
    <div
      role="tablist"
      aria-label="Chọn vai trò đăng nhập"
      className="grid grid-cols-2 gap-1 rounded-md border border-ink-200 bg-ink-50 p-1 dark:border-ink-700 dark:bg-ink-900"
    >
      {tabs.map(({ role, href, active, Icon }) => (
        <Link
          key={role}
          href={href}
          role="tab"
          aria-selected={active}
          className={`inline-flex items-center justify-center gap-1.5 rounded px-3 py-2 text-[12.5px] font-semibold transition-colors duration-200 ${
            active
              ? "bg-white text-brand-700 shadow-soft dark:bg-ink-800 dark:text-brand-300"
              : "text-ink-500 hover:text-ink-800 dark:text-ink-400 dark:hover:text-ink-100"
          }`}
        >
          <Icon className="text-[11px]" aria-hidden="true" />
          {role}
        </Link>
      ))}
    </div>
  );
};

/** Small link to flip between login <-> register keeping the same role. */
export const ModeSwitch = ({ mode }: { mode: "login" | "register" }) => {
  const pathname = usePathname();
  const isCompany = pathname.startsWith("/company");

  const target =
    mode === "login"
      ? isCompany
        ? "/company/register"
        : "/user/register"
      : isCompany
        ? "/company/login"
        : "/user/login";

  const label = mode === "login" ? "Chưa có tài khoản?" : "Đã có tài khoản?";
  const action = mode === "login" ? "Đăng ký ngay" : "Đăng nhập";

  return (
    <p className="text-center text-[12.5px] text-ink-500 dark:text-ink-400">
      {label}{" "}
      <Link
        href={target}
        className="font-semibold text-brand-600 hover:underline dark:text-brand-400"
      >
        {action}
      </Link>
    </p>
  );
};

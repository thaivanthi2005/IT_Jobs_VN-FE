"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  FaArrowRightFromBracket,
  FaBriefcase,
  FaChevronDown,
  FaFileLines,
  FaUser,
} from "react-icons/fa6";
import { useAuth } from "@/hooks/useAuth";
import { API_URL } from "@/config/variable";
import { GuestAccount } from "./GuestAccount";

const menuItemClass =
  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium text-ink-600 transition-colors duration-150 hover:bg-brand-50 hover:text-brand-700 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-brand-300";

export const HeaderAccount = () => {
  const { isLogin, infoUser, infoCompany, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    fetch(`${API_URL}/auth/logout`, { credentials: "include" })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!data || data.code === "success" || res.ok) {
          window.location.assign("/");
          return;
        }
        window.location.assign("/");
      })
      .catch(() => window.location.assign("/"));
  };

  if (loading) {
    return <div className="skeleton h-9 w-[132px] rounded-xl" />;
  }

  if (!isLogin) {
    return <GuestAccount />;
  }

  const displayName = infoUser?.fullName || infoCompany?.companyName || "Tài khoản";
  const isCompany = Boolean(infoCompany);
  const managePath = isCompany ? "/company-manage/profile" : "/user-manage/profile";

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Link
        href={managePath}
        aria-expanded={open}
        aria-haspopup="true"
        className="inline-flex max-w-[220px] items-center gap-2 rounded-xl border border-ink-200 bg-white py-1.5 pl-1.5 pr-3 transition-colors duration-200 hover:border-brand-300 dark:border-ink-700 dark:bg-ink-900 dark:hover:border-brand-600"
      >
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brand-50 text-[11px] font-extrabold text-brand-700 dark:bg-ink-800 dark:text-brand-300">
          {infoUser?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={infoUser.avatar}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            displayName.slice(0, 1).toUpperCase()
          )}
        </span>
        <span className="truncate text-[13px] font-semibold text-ink-800 dark:text-ink-100">
          {displayName}
        </span>
        <FaChevronDown className="shrink-0 text-[9px] text-ink-400" aria-hidden="true" />
      </Link>

      {open && (
        <div className="absolute right-0 top-full z-50 w-[248px] pt-2 animate-fade-up">
          <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white p-1.5 shadow-lift dark:border-ink-700 dark:bg-ink-900">
            <div className="border-b border-ink-100 px-3 pb-2.5 pt-1.5 dark:border-ink-800">
              <p className="truncate text-[13px] font-bold text-ink-900 dark:text-white">
                {displayName}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-ink-400">
                {isCompany ? "Nhà tuyển dụng" : "Ứng viên"}
              </p>
            </div>

            <div className="pt-1.5">
              {isCompany ? (
                <>
                  <Link href="/company-manage/profile" className={menuItemClass}>
                    <FaUser className="text-[11px]" aria-hidden="true" />
                    Thông tin công ty
                  </Link>
                  <Link href="/company-manage/job/list" className={menuItemClass}>
                    <FaBriefcase className="text-[11px]" aria-hidden="true" />
                    Quản lý công việc
                  </Link>
                  <Link href="/company-manage/cv/list" className={menuItemClass}>
                    <FaFileLines className="text-[11px]" aria-hidden="true" />
                    Quản lý CV
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/user-manage/profile" className={menuItemClass}>
                    <FaUser className="text-[11px]" aria-hidden="true" />
                    Thông tin cá nhân
                  </Link>
                  <Link href="/user-manage/cv/list" className={menuItemClass}>
                    <FaFileLines className="text-[11px]" aria-hidden="true" />
                    CV đã gửi
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-1 flex w-full cursor-pointer items-center gap-2.5 rounded-lg border-t border-ink-100 px-3 py-2.5 text-left text-[13px] font-medium text-danger-600 transition-colors duration-150 hover:bg-danger-50 dark:border-ink-800 dark:text-danger-500 dark:hover:bg-danger-600/10"
            >
              <FaArrowRightFromBracket className="text-[11px]" aria-hidden="true" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

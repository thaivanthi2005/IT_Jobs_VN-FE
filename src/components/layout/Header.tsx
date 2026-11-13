"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FaBars } from "react-icons/fa6";
import { Logo } from "./Logo";
import { DesktopMenu } from "./DesktopMenu";
import { MobileMenu } from "./MobileMenu";
import { HeaderAccount } from "./HeaderAccount";
import { GuestAccount } from "./GuestAccount";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { menuList } from "./menu";
import { useAuth } from "@/hooks/useAuth";

/**
 * Site header.
 *
 * Three layers of state, each doing real work rather than decorating:
 * - `scrolled` swaps a solid bar for a translucent one and lights the hairline
 *   underneath, so the header separates from content only once it overlaps it;
 * - `progress` drives a 1px brand line along the bottom edge, which is the only
 *   reading affordance the page needs;
 * - the mark inside `Logo` is the one element always in motion, so the brand
 *   never looks like a static template.
 */
export const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const { isLogin, infoUser, infoCompany } = useAuth();
  const pathname = usePathname();

  const items = menuList;

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      const scrolledPx = window.scrollY;
      setScrolled(scrolledPx > 8);

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, scrolledPx / scrollable) : 0);
    };

    /* scroll fires far more often than the browser paints, so the read is
       coalesced into one rAF — measuring layout on every event janks the page */
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    setShowMenu(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = showMenu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showMenu]);

  const mobileFooter = isLogin ? (
    <Link
      href={infoCompany ? "/company-manage/profile" : "/user-manage/profile"}
      className="btn-primary w-full"
    >
      {infoUser?.fullName || infoCompany?.companyName || "Tài khoản của tôi"}
    </Link>
  ) : (
    <GuestAccount variant="mobile" />
  );

  return (
    <>
      <header
        className={`group/hdr sticky top-0 z-[70] w-full transition-all duration-500 ease-out-expo ${
          scrolled
            ? "border-b border-ink-200/80 bg-white/85 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-ink-950/80"
            : "border-b border-transparent bg-white dark:bg-ink-950"
        }`}
      >
        {/* a faint brand wash behind the bar, only once it is translucent */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 bg-hero-mesh transition-opacity duration-700 ${
            scrolled ? "opacity-[0.14] dark:opacity-[0.22]" : "opacity-0"
          }`}
        />

        <div className="container-page relative">
          <div className="flex h-[68px] items-center justify-between gap-4">
            <Logo />

            <nav aria-label="Điều hướng chính" className="hidden lg:block">
              <DesktopMenu items={items} />
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />

              <div className="hidden lg:block">
                <HeaderAccount />
              </div>

              <button
                type="button"
                onClick={() => setShowMenu(true)}
                aria-label="Mở menu"
                aria-expanded={showMenu}
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-ink-200 text-ink-700 transition-all duration-200 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 lg:hidden dark:border-ink-700 dark:text-ink-200 dark:hover:border-brand-500 dark:hover:bg-ink-800"
              >
                <FaBars className="text-[15px]" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* reading progress: a 1px brand line along the bottom edge */}
        <div
          aria-hidden="true"
          className={`absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-brand-500 via-brand-400 to-success-400 transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
          style={{ transform: `scaleX(${Math.max(progress, 0.001)})` }}
        />

        {/* a hairline of light under the bar, so it separates from the page */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-brand-400/45 to-transparent transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />
      </header>

      <MobileMenu
        items={items}
        open={showMenu}
        onClose={() => setShowMenu(false)}
        footer={mobileFooter}
      />
    </>
  );
};

import Link from "next/link";
import {
  FaBriefcase,
  FaEnvelope,
  FaLocationDot,
  FaPhone,
} from "react-icons/fa6";
import { Logo } from "./Logo";
import { FooterCta } from "./FooterCta";
import { cityLinks, companyLinks, handbookLinks, jobLinks, linkHover, socials } from "./footer-data";

const columns = [
  { title: "Việc làm theo kỹ năng", links: jobLinks },
  { title: "Việc làm theo thành phố", links: cityLinks },
  { title: "Cẩm nang IT", links: handbookLinks },
  { title: "Nhà tuyển dụng", links: companyLinks },
];

export const Footer = () => (
  <footer className="mt-auto border-t border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-950">
    <FooterCta />

    <div className="container-page">
      <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">
            Nền tảng tuyển dụng IT chuyên sâu, kết nối lập trình viên với những công ty
            công nghệ hàng đầu Việt Nam.
          </p>

          <ul className="mt-5 space-y-2.5 text-[13px] text-ink-500 dark:text-ink-400">
            <li className="flex items-center gap-2.5">
              <FaEnvelope className="text-[12px] text-brand-500" aria-hidden="true" />
              <a href="mailto:hello@itjobs.vn" className="hover:text-brand-600">
                hello@itjobs.vn
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <FaPhone className="text-[12px] text-brand-500" aria-hidden="true" />
              <a href="tel:+842812345678" className="hover:text-brand-600">
                (028) 1234 5678
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <FaLocationDot className="text-[12px] text-brand-500" aria-hidden="true" />
              <span>TP. Hồ Chí Minh, Việt Nam</span>
            </li>
          </ul>

          <div className="mt-5 flex gap-2">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-ink-200 text-ink-500 transition-colors duration-200 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 dark:border-ink-700 dark:text-ink-400 dark:hover:border-brand-600 dark:hover:bg-ink-800 dark:hover:text-brand-300"
              >
                <Icon className="text-[13px]" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {columns.map((column) => (
          <div key={column.title}>
            <h3 className="flex items-center gap-2 font-display text-[13px] font-bold uppercase tracking-[0.1em] text-ink-900 dark:text-white">
              <FaBriefcase className="text-[10px] text-brand-500" aria-hidden="true" />
              {column.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={linkHover}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-ink-100 py-6 text-center sm:flex-row sm:text-left dark:border-ink-800">
        <p className="text-[12px] text-ink-400">
          © {new Date().getFullYear()} ITJobs Việt Nam. Bảo lưu mọi quyền.
        </p>
        <div className="flex gap-5 text-[12px] text-ink-400">
          <Link href="#" className="hover:text-brand-600">
            Điều khoản
          </Link>
          <Link href="#" className="hover:text-brand-600">
            Bảo mật
          </Link>
          <Link href="#" className="hover:text-brand-600">
            Liên hệ
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

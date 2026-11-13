import Link from "next/link";
import {
  FaBriefcase,
  FaCode,
  FaCloud,
  FaDatabase,
  FaMobileScreen,
  FaShieldHalved,
  FaArrowRight,
} from "react-icons/fa6";
import { Reveal } from "@/components/ui/Reveal";
import { RevealGroup } from "@/components/ui/RevealGroup";

const categories = [
  {
    title: "Frontend Developer",
    desc: "React, Vue, Next.js, TypeScript",
    href: "/search?language=Javascript",
    Icon: FaCode,
    tone: "from-brand-500/15 to-brand-500/5 text-brand-600",
  },
  {
    title: "Backend Developer",
    desc: "Node.js, Java, .NET, Go",
    href: "/search?language=NodeJS",
    Icon: FaDatabase,
    tone: "from-success-500/15 to-success-500/5 text-success-600",
  },
  {
    title: "Mobile Developer",
    desc: "iOS, Android, Flutter, React Native",
    href: "/search?language=ReactJS",
    Icon: FaMobileScreen,
    tone: "from-warning-500/15 to-warning-500/5 text-warning-600",
  },
  {
    title: "DevOps / Cloud",
    desc: "AWS, Docker, Kubernetes, CI/CD",
    href: "/search?language=NodeJS",
    Icon: FaCloud,
    tone: "from-brand-400/15 to-brand-400/5 text-brand-500",
  },
  {
    title: "Data & AI",
    desc: "Python, ML, Data Engineer",
    href: "/search?language=Javascript",
    Icon: FaDatabase,
    tone: "from-purple-500/15 to-purple-500/5 text-purple-600",
  },
  {
    title: "QA / Security",
    desc: "Automation Test, Pentest, SOC",
    href: "/search?language=HTML5",
    Icon: FaShieldHalved,
    tone: "from-danger-500/15 to-danger-500/5 text-danger-600",
  },
];

export const CategorySection = () => (
  <section className="section-pad">
    <div className="container-page">
      <Reveal>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="eyebrow">
              <FaBriefcase className="text-[10px]" aria-hidden="true" />
              Danh mục nghề nghiệp
            </span>
            <h2 className="heading-md mt-3">Khám phá theo chuyên môn</h2>
            <p className="text-body mt-2 max-w-xl">
              Chọn hướng đi phù hợp với kỹ năng và mục tiêu phát triển của bạn.
            </p>
          </div>
          <Link href="/search" className="btn-outline shrink-0">
            Xem tất cả
            <FaArrowRight className="text-[11px]" aria-hidden="true" />
          </Link>
        </div>
      </Reveal>

      <RevealGroup
        step={80}
        effect="reveal-lift"
        className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {categories.map(({ title, desc, href, Icon, tone }) => (
          <Link
            key={title}
            href={href}
            className="surface-interactive group flex items-center gap-4 p-5"
          >
            <span
              className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tone}`}
            >
              <Icon className="text-lg" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display text-[14.5px] font-bold text-ink-900 transition-colors group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-300">
                {title}
              </span>
              <span className="mt-0.5 block truncate text-[12.5px] text-ink-500 dark:text-ink-400">
                {desc}
              </span>
            </span>
            <FaArrowRight
              className="shrink-0 text-[11px] text-ink-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-brand-500 dark:text-ink-600"
              aria-hidden="true"
            />
          </Link>
        ))}
      </RevealGroup>
    </div>
  </section>
);

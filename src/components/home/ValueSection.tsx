import Link from "next/link";
import {
  FaBullseye,
  FaShieldHalved,
  FaBolt,
  FaUserGroup,
  FaArrowRight,
} from "react-icons/fa6";
import { Reveal } from "@/components/ui/Reveal";

const values = [
  {
    Icon: FaShieldHalved,
    title: "Minh bạch thông tin",
    desc: "Mức lương, mô hình làm việc và quy trình tuyển dụng được công khai ngay từ đầu.",
  },
  {
    Icon: FaBolt,
    title: "Phản hồi nhanh",
    desc: "Theo dõi trạng thái hồ sơ theo thời gian thực, không còn cảm giác chờ đợi mơ hồ.",
  },
  {
    Icon: FaUserGroup,
    title: "Đúng người, đúng việc",
    desc: "Bộ lọc theo kỹ năng, cấp bậc và thành phố giúp rút ngắn khoảng cách ứng tuyển.",
  },
];

export const ValueSection = () => (
  <section className="section-pad bg-ink-50/70 dark:bg-ink-950/40">
    <div className="container-page">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="reveal-left">
          <span className="eyebrow">
            <FaBullseye className="text-[10px]" aria-hidden="true" />
            Vì sao chọn ITJobs
          </span>
          <h2 className="heading-lg mt-4">
            Tuyển dụng IT không cần phải{" "}
            <span className="text-brand-600 dark:text-brand-400">may mắn</span>
          </h2>
          <p className="text-body mt-4">
            Chúng tôi xây dựng nền tảng dành riêng cho ngành công nghệ — nơi mọi thông tin
            đều rõ ràng và mỗi ứng viên đều được tôn trọng.
          </p>

          <div className="mt-8 space-y-4">
            {values.map(({ Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100 dark:bg-brand-900/40 dark:text-brand-300 dark:ring-brand-800">
                  <Icon className="text-[15px]" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-[14.5px] font-bold text-ink-900 dark:text-white">
                    {title}
                  </h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-500 dark:text-ink-400">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link href="/user/register" className="btn-primary btn-lg mt-8">
            Tạo hồ sơ ứng viên
            <FaArrowRight className="text-[12px]" aria-hidden="true" />
          </Link>
        </Reveal>

        {/* Decorative proof card */}
        <Reveal className="reveal-right relative" delay={120}>
          <div
            className="absolute -inset-4 rounded-[2rem] bg-brand-500/5 blur-2xl"
            aria-hidden="true"
          />
          <div className="surface relative overflow-hidden p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-ink-100 pb-5 dark:border-ink-800">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-400">
                  Hồ sơ của bạn
                </p>
                <p className="mt-1 font-display text-lg font-extrabold text-ink-900 dark:text-white">
                  Senior ReactJS Engineer
                </p>
              </div>
              <span className="badge-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success-500" aria-hidden="true" />
                Đã duyệt
              </span>
            </div>

            <ul className="mt-5 space-y-3.5">
              {[
                { label: "Đã gửi hồ sơ", value: "12 công ty", tone: "text-brand-600" },
                { label: "Nhà tuyển dụng xem", value: "8 lượt", tone: "text-success-600" },
                { label: "Lời mời phỏng vấn", value: "3 lời mời", tone: "text-warning-600" },
              ].map((row) => (
                <li
                  key={row.label}
                  className="flex items-center justify-between rounded-xl bg-ink-50 px-4 py-3 dark:bg-ink-900/60"
                >
                  <span className="text-[13px] font-medium text-ink-600 dark:text-ink-300">
                    {row.label}
                  </span>
                  <span className={`font-display text-[13px] font-extrabold ${row.tone}`}>
                    {row.value}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-xl border border-brand-100 bg-brand-50/60 p-4 dark:border-brand-800 dark:bg-brand-900/25">
              <p className="text-[12.5px] leading-relaxed text-ink-600 dark:text-ink-300">
                <span className="font-bold text-brand-700 dark:text-brand-300">
                  Mẹo:
                </span>{" "}
                Bổ sung dự án thực tế vào CV giúp tăng tỷ lệ được gọi phỏng vấn lên đến 40%.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { Backdrop3D } from "@/components/three/Backdrop3D";

export const FooterCta = () => (
  <div className="container-page">
    <div className="relative overflow-hidden rounded-lg bg-brand-fade px-6 py-10 sm:px-10 sm:py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(50% 60% at 80% 10%, rgba(74,222,128,0.25) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      {/* faint 3D orb anchored to the right edge */}
      <div className="pointer-events-none absolute -right-24 top-1/2 hidden h-[360px] w-[360px] -translate-y-1/2 opacity-45 sm:block">
        <Backdrop3D variant="banner" />
      </div>

      <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-[28px]">
            Bạn là nhà tuyển dụng?
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-brand-100/85">
            Tiếp cận hơn 200.000 lập trình viên Việt Nam. Đăng tin đầu tiên và bắt đầu
            nhận hồ sơ chỉ trong vài phút.
          </p>
        </div>
        <Link
          href="/company/register"
          className="btn shrink-0 bg-white px-6 py-3 font-bold text-brand-800 hover:bg-brand-50 active:scale-[0.98]"
        >
          Đăng tuyển ngay
          <FaArrowRight className="text-[12px]" aria-hidden="true" />
        </Link>
      </div>
    </div>
  </div>
);

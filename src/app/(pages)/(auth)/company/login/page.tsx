import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormLogin } from "@/components/auth/FormLogin";
import { ModeSwitch, RoleTabs } from "@/components/auth/RoleTabs";

export const metadata: Metadata = {
  title: "Đăng nhập nhà tuyển dụng",
  description: "Đăng nhập để quản lý tin tuyển dụng và hồ sơ ứng viên.",
};

export default function CompanyLoginPage() {
  return (
    <AuthLayout
      title="Đăng nhập"
      description="Quản lý tin tuyển dụng và hồ sơ ứng viên của bạn."
      footer={<ModeSwitch mode="login" />}
    >
      <div className="space-y-5">
        <RoleTabs mode="login" />
        <FormLogin role="company" />
      </div>
    </AuthLayout>
  );
}

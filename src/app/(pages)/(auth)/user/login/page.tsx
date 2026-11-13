import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormLogin } from "@/components/auth/FormLogin";
import { ModeSwitch, RoleTabs } from "@/components/auth/RoleTabs";

export const metadata: Metadata = {
  title: "Đăng nhập ứng viên",
  description: "Đăng nhập tài khoản ứng viên để quản lý hồ sơ và CV đã gửi.",
};

export default function UserLoginPage() {
  return (
    <AuthLayout
      title="Đăng nhập"
      description="Tiếp tục hành trình sự nghiệp của bạn với ITJobs."
      footer={<ModeSwitch mode="login" />}
    >
      <div className="space-y-5">
        <RoleTabs mode="login" />
        <FormLogin role="user" />
      </div>
    </AuthLayout>
  );
}

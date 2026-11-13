import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormRegister } from "@/components/auth/FormRegister";
import { ModeSwitch, RoleTabs } from "@/components/auth/RoleTabs";

export const metadata: Metadata = {
  title: "Đăng ký ứng viên",
  description: "Tạo tài khoản ứng viên miễn phí để ứng tuyển và theo dõi hồ sơ.",
};

export default function UserRegisterPage() {
  return (
    <AuthLayout
      title="Tạo tài khoản"
      description="Miễn phí — chỉ mất 30 giây để bắt đầu ứng tuyển."
      footer={<ModeSwitch mode="register" />}
    >
      <div className="space-y-5">
        <RoleTabs mode="register" />
        <FormRegister role="user" />
      </div>
    </AuthLayout>
  );
}

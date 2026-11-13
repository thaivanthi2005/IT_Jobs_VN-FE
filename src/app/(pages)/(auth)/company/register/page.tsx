import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { FormRegister } from "@/components/auth/FormRegister";
import { ModeSwitch, RoleTabs } from "@/components/auth/RoleTabs";

export const metadata: Metadata = {
  title: "Đăng ký nhà tuyển dụng",
  description: "Tạo tài khoản nhà tuyển dụng để đăng tin và tìm kiếm nhân tài IT.",
};

export default function CompanyRegisterPage() {
  return (
    <AuthLayout
      title="Tạo tài khoản"
      description="Đăng tin tuyển dụng và tiếp cận hàng trăm nghìn lập trình viên."
      footer={<ModeSwitch mode="register" />}
    >
      <div className="space-y-5">
        <RoleTabs mode="register" />
        <FormRegister role="company" />
      </div>
    </AuthLayout>
  );
}

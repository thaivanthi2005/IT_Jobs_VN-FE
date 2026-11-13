import type { Metadata } from "next";
import { ManageShell, companyNav } from "@/components/manage/ManageShell";
import { JobForm } from "@/components/manage/JobForm";

export const metadata: Metadata = {
  title: "Đăng tin tuyển dụng",
  description: "Tạo tin tuyển dụng mới để thu hút ứng viên IT.",
};

export default function JobCreatePage() {
  return (
    <ManageShell
      title="Đăng tin tuyển dụng"
      description="Điền đầy đủ thông tin để tin đăng thu hút đúng ứng viên."
      nav={companyNav}
      activeHref="/company-manage/job/list"
    >
      <JobForm />
    </ManageShell>
  );
}

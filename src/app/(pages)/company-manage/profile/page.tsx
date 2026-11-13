import type { Metadata } from "next";
import { ManageShell, companyNav } from "@/components/manage/ManageShell";
import { FormProfile } from "./FormProfile";

export const metadata: Metadata = {
  title: "Thông tin công ty",
  description: "Cập nhật hồ sơ công ty để thu hút ứng viên IT.",
};

export default function CompanyProfilePage() {
  return (
    <ManageShell
      title="Thông tin công ty"
      description="Hồ sơ đầy đủ giúp tin tuyển dụng của bạn tiếp cận đúng ứng viên."
      nav={companyNav}
      activeHref="/company-manage/profile"
    >
      <FormProfile />
    </ManageShell>
  );
}

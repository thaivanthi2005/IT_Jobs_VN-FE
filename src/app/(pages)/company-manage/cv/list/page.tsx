import type { Metadata } from "next";
import { ManageShell, companyNav } from "@/components/manage/ManageShell";
import { CVList } from "./CVList";

export const metadata: Metadata = {
  title: "Quản lý CV",
  description: "Duyệt và quản lý hồ sơ ứng viên đã ứng tuyển.",
};

export default function CompanyCVListPage() {
  return (
    <ManageShell
      title="Quản lý CV"
      description="Duyệt, từ chối và quản lý hồ sơ ứng viên."
      nav={companyNav}
      activeHref="/company-manage/cv/list"
    >
      <CVList />
    </ManageShell>
  );
}

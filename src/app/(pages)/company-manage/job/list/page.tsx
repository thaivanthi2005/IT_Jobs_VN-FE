import type { Metadata } from "next";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";
import { ManageShell, companyNav } from "@/components/manage/ManageShell";
import { JobList } from "./JobList";

export const metadata: Metadata = {
  title: "Quản lý công việc",
  description: "Danh sách tin tuyển dụng của công ty bạn.",
};

export default function CompanyJobListPage() {
  return (
    <ManageShell
      title="Quản lý công việc"
      description="Theo dõi và cập nhật các tin tuyển dụng đang đăng."
      nav={companyNav}
      activeHref="/company-manage/job/list"
      action={
        <Link href="/company-manage/job/create" className="btn-primary shrink-0">
          <FaPlus className="text-[11px]" aria-hidden="true" />
          Đăng tin mới
        </Link>
      }
    >
      <JobList />
    </ManageShell>
  );
}

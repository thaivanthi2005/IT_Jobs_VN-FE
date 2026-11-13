import type { Metadata } from "next";
import { ManageShell, companyNav } from "@/components/manage/ManageShell";
import { FormEdit } from "./FormEdit";

export const metadata: Metadata = {
  title: "Sửa tin tuyển dụng",
  description: "Cập nhật thông tin tin tuyển dụng đã đăng.",
};

export default async function JobEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <ManageShell
      title="Sửa tin tuyển dụng"
      description="Cập nhật nội dung để tin đăng luôn chính xác."
      nav={companyNav}
      activeHref="/company-manage/job/list"
    >
      <FormEdit id={id} />
    </ManageShell>
  );
}

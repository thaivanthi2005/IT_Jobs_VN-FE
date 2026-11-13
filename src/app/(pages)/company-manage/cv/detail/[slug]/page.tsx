import type { Metadata } from "next";
import { ManageShell, companyNav } from "@/components/manage/ManageShell";
import { CVDetail } from "./CVDetail";

export const metadata: Metadata = {
  title: "Chi tiết CV",
  description: "Xem chi tiết hồ sơ ứng viên và công việc ứng tuyển.",
};

export default async function CVDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <ManageShell
      title="Chi tiết CV"
      description="Xem hồ sơ ứng viên và thông tin công việc ứng tuyển."
      nav={companyNav}
      activeHref="/company-manage/cv/list"
    >
      <CVDetail id={slug} />
    </ManageShell>
  );
}

import type { Metadata } from "next";
import { ManageShell, userNav } from "@/components/manage/ManageShell";
import { CVList } from "./CVList";

export const metadata: Metadata = {
  title: "CV đã gửi",
  description: "Theo dõi trạng thái các hồ sơ bạn đã gửi cho nhà tuyển dụng.",
};

export default function UserCVListPage() {
  return (
    <ManageShell
      title="CV đã gửi"
      description="Theo dõi trạng thái duyệt hồ sơ theo thời gian thực."
      nav={userNav}
      activeHref="/user-manage/cv/list"
    >
      <CVList />
    </ManageShell>
  );
}

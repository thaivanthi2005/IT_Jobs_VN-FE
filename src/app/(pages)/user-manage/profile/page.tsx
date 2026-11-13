import type { Metadata } from "next";
import { ManageShell, userNav } from "@/components/manage/ManageShell";
import { FormProfile } from "./FormProfile";

export const metadata: Metadata = {
  title: "Thông tin cá nhân",
  description: "Cập nhật họ tên, email, số điện thoại và ảnh đại diện của bạn.",
};

export default function UserProfilePage() {
  return (
    <ManageShell
      title="Thông tin cá nhân"
      description="Cập nhật thông tin liên hệ để nhà tuyển dụng dễ dàng kết nối."
      nav={userNav}
      activeHref="/user-manage/profile"
    >
      <FormProfile />
    </ManageShell>
  );
}

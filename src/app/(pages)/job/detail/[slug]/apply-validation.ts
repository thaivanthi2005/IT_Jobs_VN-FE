export type FieldErrors = Record<string, string>;

const MAX_SIZE = 5 * 1024 * 1024;

export const validateApplyForm = (data: FormData, file: File | null): FieldErrors => {
  const next: FieldErrors = {};

  const fullName = String(data.get("fullName") || "").trim();
  if (!fullName) next.fullName = "Vui lòng nhập họ tên!";
  else if (fullName.length < 5) next.fullName = "Họ tên phải có ít nhất 5 ký tự!";
  else if (fullName.length > 50) next.fullName = "Họ tên không được vượt quá 50 ký tự!";

  const email = String(data.get("email") || "").trim();
  if (!email) next.email = "Vui lòng nhập email của bạn!";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    next.email = "Email không đúng định dạng!";

  const phone = String(data.get("phone") || "").trim();
  if (!phone) next.phone = "Vui lòng nhập số điện thoại!";
  else if (!/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(phone))
    next.phone = "Số điện thoại không đúng định dạng!";

  if (!file) next.fileCV = "Vui lòng chọn file CV!";
  else if (file.type !== "application/pdf") next.fileCV = "File phải là định dạng PDF!";
  else if (file.size > MAX_SIZE) next.fileCV = "Dung lượng file không được vượt quá 5MB!";

  return next;
};

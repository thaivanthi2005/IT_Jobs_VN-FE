export const API_URL =
  (typeof window === "undefined" && process.env.INTERNAL_API_URL)
    ? process.env.INTERNAL_API_URL
    : (process.env.NEXT_PUBLIC_API_URL || "https://api.devjobs.click");

export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAF_MsZ0vt1mpZCng";

export const positionList = [
  { label: "Intern", value: "intern" },
  { label: "Fresher", value: "fresher" },
  { label: "Junior", value: "junior" },
  { label: "Middle", value: "middle" },
  { label: "Senior", value: "senior" },
  { label: "Manager", value: "manager" },
] as const;

export const workingFormList = [
  { label: "Tại văn phòng", value: "office" },
  { label: "Làm từ xa", value: "remote" },
  { label: "Linh hoạt", value: "flexible" },
] as const;

export const cvStatusList = [
  {
    label: "Chưa duyệt",
    value: "initial",
    badge: "badge-neutral",
    dot: "bg-ink-400",
  },
  {
    label: "Đã duyệt",
    value: "approved",
    badge: "badge-success",
    dot: "bg-success-500",
  },
  {
    label: "Từ chối",
    value: "rejected",
    badge: "badge-danger",
    dot: "bg-danger-500",
  },
] as const;

export const cityList = [
  { label: "Hà Nội", value: "Hà Nội" },
  { label: "Đà Nẵng", value: "Đà Nẵng" },
  { label: "Hồ Chí Minh", value: "Hồ Chí Minh" },
] as const;

export const popularKeywordList = [
  { label: "ReactJS", value: "ReactJS" },
  { label: "Javascript", value: "Javascript" },
  { label: "NodeJS", value: "NodeJS" },
  { label: "HTML5", value: "HTML5" },
  { label: "CSS3", value: "CSS3" },
] as const;

export const getPositionLabel = (value?: string) =>
  positionList.find((item) => item.value === value)?.label || value || "—";

export const getWorkingFormLabel = (value?: string) =>
  workingFormList.find((item) => item.value === value)?.label || value || "—";

export const getCvStatus = (value?: string) =>
  cvStatusList.find((item) => item.value === value) || cvStatusList[0];

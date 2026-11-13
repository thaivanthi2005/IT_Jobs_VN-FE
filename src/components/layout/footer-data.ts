import { FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa6";

export const jobLinks = [
  { label: "Việc làm ReactJS", href: "/search?language=ReactJS" },
  { label: "Việc làm NodeJS", href: "/search?language=NodeJS" },
  { label: "Việc làm Javascript", href: "/search?language=Javascript" },
  { label: "Việc làm HTML5", href: "/search?language=HTML5" },
];

export const cityLinks = [
  { label: "Việc làm Hà Nội", href: "/search?city=H%C3%A0%20N%E1%BB%99i" },
  { label: "Việc làm Đà Nẵng", href: "/search?city=%C4%90%C3%A0%20N%E1%BA%B5ng" },
  { label: "Việc làm Hồ Chí Minh", href: "/search?city=H%E1%BB%93%20Ch%C3%AD%20Minh" },
];

export const companyLinks = [
  { label: "Danh sách công ty", href: "/company/list" },
  { label: "Đăng tuyển dụng", href: "/company/register" },
  { label: "Đăng nhập NTD", href: "/company/login" },
];

export const handbookLinks = [
  { label: "Cẩm nang IT", href: "/cam-nang" },
  { label: "Lộ trình Frontend", href: "/cam-nang/lo-trinh/frontend" },
  { label: "Lộ trình Backend", href: "/cam-nang/lo-trinh/backend" },
  { label: "Viết CV ấn tượng", href: "/cam-nang/viet-cv-an-tuong" },
  { label: "Kỹ năng phỏng vấn", href: "/cam-nang/ky-nang-phong-van" },
];

export const socials = [
  { label: "Facebook", href: "#", Icon: FaFacebookF },
  { label: "LinkedIn", href: "#", Icon: FaLinkedinIn },
  { label: "GitHub", href: "#", Icon: FaGithub },
];

export const linkHover =
  "text-[13px] text-ink-500 transition-colors duration-150 hover:text-brand-700 dark:text-ink-400 dark:hover:text-brand-300";

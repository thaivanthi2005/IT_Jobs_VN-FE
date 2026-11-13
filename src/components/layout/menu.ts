export type MenuLeaf = {
  name: string;
  link: string;
  desc?: string;
  badge?: string;
};

export type MenuColumn = {
  title: string;
  items: MenuLeaf[];
};

export type MenuItem = {
  name: string;
  link: string;
  /** Mega-menu columns. When present the item renders as a dropdown. */
  columns?: MenuColumn[];
  /** Direct link rendered with accent styling + optional badge. */
  highlight?: boolean;
  badge?: string;
};

export const menuList: MenuItem[] = [
  {
    name: "Việc làm IT",
    link: "/search",
    columns: [
      {
        title: "Theo kỹ năng",
        items: [
          { name: "ReactJS", link: "/search?language=ReactJS", desc: "Frontend phổ biến nhất" },
          { name: "NodeJS", link: "/search?language=NodeJS", desc: "Backend JavaScript" },
          { name: "Javascript", link: "/search?language=Javascript", desc: "Nền tảng web" },
          { name: "HTML5 / CSS3", link: "/search?language=HTML5", desc: "Dựng giao diện" },
        ],
      },
      {
        title: "Theo thành phố",
        items: [
          { name: "Hà Nội", link: "/search?city=H%C3%A0%20N%E1%BB%99i" },
          { name: "Đà Nẵng", link: "/search?city=%C4%90%C3%A0%20N%E1%BA%B5ng" },
          { name: "Hồ Chí Minh", link: "/search?city=H%E1%BB%93%20Ch%C3%AD%20Minh" },
        ],
      },
      {
        title: "Theo cấp bậc",
        items: [
          { name: "Intern / Fresher", link: "/search?position=intern" },
          { name: "Junior", link: "/search?position=junior" },
          { name: "Middle", link: "/search?position=middle" },
          { name: "Senior", link: "/search?position=senior" },
          { name: "Manager", link: "/search?position=manager" },
        ],
      },
    ],
  },
  {
    name: "Top công ty IT",
    link: "/company/list",
    columns: [
      {
        title: "Công ty nổi bật",
        items: [
          { name: "FPT Software", link: "/search?company=FPT%20Software" },
          { name: "Techcombank", link: "/search?company=Techcombank" },
          { name: "MB Bank", link: "/search?company=MB%20Bank" },
          { name: "ABC.LTD", link: "/search?company=ABC.LTD" },
        ],
      },
      {
        title: "Khám phá",
        items: [
          { name: "Tất cả công ty", link: "/company/list", desc: "500+ nhà tuyển dụng" },
          { name: "Công ty đang tuyển gấp", link: "/search", desc: "Ưu tiên phản hồi nhanh" },
          { name: "Môi trường Remote", link: "/search?workingForm=remote" },
          { name: "Làm việc linh hoạt", link: "/search?workingForm=flexible" },
        ],
      },
    ],
  },
  {
    name: "Cẩm nang IT",
    link: "/cam-nang",
    columns: [
      {
        title: "Chuẩn bị ứng tuyển",
        items: [
          {
            name: "Viết CV ấn tượng",
            link: "/cam-nang/viet-cv-an-tuong",
            desc: "Cấu trúc CV nhà tuyển dụng đọc",
          },
          {
            name: "Kỹ năng phỏng vấn",
            link: "/cam-nang/ky-nang-phong-van",
            desc: "20 câu hỏi thường gặp",
          },
          {
            name: "Thư xin việc",
            link: "/cam-nang/thu-xin-viec",
            desc: "Mẫu 150 từ hiệu quả",
          },
        ],
      },
      {
        title: "Định hướng nghề",
        items: [
          { name: "Lộ trình Frontend", link: "/cam-nang/lo-trinh/frontend" },
          { name: "Lộ trình Backend", link: "/cam-nang/lo-trinh/backend" },
          { name: "Lộ trình Fullstack", link: "/cam-nang/lo-trinh/fullstack" },
          { name: "Lộ trình DevOps", link: "/cam-nang/lo-trinh/devops" },
          {
            name: "Mức lương IT 2026",
            link: "/cam-nang/muc-luong-it-2026",
            badge: "Mới",
          },
        ],
      },
    ],
  },
  {
    name: "Việc làm Remote",
    link: "/search?workingForm=remote",
    highlight: true,
    badge: "Hot",
  },
];

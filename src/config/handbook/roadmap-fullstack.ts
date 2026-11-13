import type { Roadmap } from "./types";

export const fullstackRoadmap: Roadmap = {
  slug: "fullstack",
  title: "Lộ trình Fullstack Developer",
  shortTitle: "Fullstack",
  summary:
    "Kết hợp Frontend và Backend theo trục sản phẩm: từ feature, API, database đến deploy. Phù hợp với team nhỏ và startup.",
  level: "Trung cấp",
  duration: "10 – 14 tháng",
  outcomes: [
    "Tự làm trọn một feature từ UI đến database và deploy",
    "Hiểu trade-off giữa server component, client fetch và cache",
    "Đọc và sửa được code cả hai phía khi có bug production",
    "Đủ năng lực cho vị trí fullstack tại startup / product company",
  ],
  stages: [
    {
      id: "core",
      title: "Nền tảng chung",
      subtitle: "Học một lần, dùng cả hai phía",
      duration: "6 – 8 tuần",
      nodes: [
        {
          id: "ts",
          title: "TypeScript",
          desc: "Dùng chung type giữa FE và BE là lợi thế lớn của fullstack TypeScript.",
          tags: ["TypeScript"],
        },
        {
          id: "http",
          title: "HTTP & REST",
          desc: "Hiểu sâu request lifecycle, CORS, cookie, status code.",
          tags: ["HTTP"],
        },
        {
          id: "git",
          title: "Git workflow",
          desc: "Feature branch, rebase, resolve conflict, code review.",
          tags: ["Git"],
        },
      ],
    },
    {
      id: "frontend",
      title: "Frontend",
      subtitle: "Làm chủ UI và tương tác",
      duration: "8 – 10 tuần",
      nodes: [
        {
          id: "react",
          title: "React + Next.js",
          desc: "Component, hook, App Router, server/client component.",
          tags: ["React", "Next.js"],
        },
        {
          id: "css",
          title: "CSS & Tailwind",
          desc: "Layout, responsive, dark mode, design token.",
          tags: ["Tailwind"],
        },
        {
          id: "data",
          title: "Data fetching",
          desc: "Server action, TanStack Query, cache và revalidate.",
          tags: ["TanStack Query"],
        },
      ],
    },
    {
      id: "backend",
      title: "Backend",
      subtitle: "API và dữ liệu",
      duration: "8 – 10 tuần",
      nodes: [
        {
          id: "node",
          title: "Node.js + Express/NestJS",
          desc: "Routing, middleware, validate, xử lý lỗi tập trung.",
          tags: ["Node.js"],
        },
        {
          id: "db",
          title: "Database",
          desc: "PostgreSQL/MongoDB, quan hệ dữ liệu, index, migration.",
          tags: ["SQL", "MongoDB"],
        },
        {
          id: "auth",
          title: "Auth & phân quyền",
          desc: "JWT/cookie session, middleware bảo vệ route, ownership.",
          tags: ["Auth"],
        },
        {
          id: "upload",
          title: "Upload file",
          desc: "FormData, validate, lưu trữ cloud, hiển thị lại phía FE.",
          tags: ["Upload"],
        },
      ],
    },
    {
      id: "product",
      title: "Sản phẩm & Vận hành",
      subtitle: "Từ code đến người dùng",
      duration: "6 – 8 tuần",
      nodes: [
        {
          id: "contract",
          title: "API contract & type sharing",
          desc: "OpenAPI hoặc shared type package để FE/BE không lệch nhau.",
          tags: ["OpenAPI"],
        },
        {
          id: "docker",
          title: "Docker & Deploy",
          desc: "Dockerize cả FE/BE, biến môi trường, reverse proxy.",
          tags: ["Docker"],
        },
        {
          id: "perf",
          title: "Performance end-to-end",
          desc: "Đo LCP phía FE, đo query time phía BE, tối ưu điểm nghẽn.",
          tags: ["Performance"],
        },
        {
          id: "monitor",
          title: "Logging & Error tracking",
          desc: "Sentry, structured log, alert khi lỗi tăng.",
          tags: ["Monitoring"],
          optional: true,
        },
      ],
    },
  ],
  resources: [
    {
      title: "roadmap.sh — Full Stack Roadmap",
      href: "https://roadmap.sh/full-stack",
    },
    {
      title: "roadmap.sh — Next.js",
      href: "https://roadmap.sh/nextjs",
    },
    {
      title: "Next.js Docs",
      href: "https://nextjs.org/docs",
    },
  ],
  related: ["frontend", "backend", "devops"],
};

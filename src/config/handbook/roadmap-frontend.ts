import type { Roadmap } from "./types";

export const frontendRoadmap: Roadmap = {
  slug: "frontend",
  title: "Lộ trình Frontend Developer",
  shortTitle: "Frontend",
  summary:
    "Từ HTML/CSS đến React, TypeScript và tối ưu hiệu năng. Đây là lộ trình được dùng nhiều nhất cho các vị trí Frontend tại Việt Nam.",
  level: "Cơ bản",
  duration: "6 – 9 tháng",
  outcomes: [
    "Dựng được giao diện responsive chuẩn từ bản thiết kế Figma",
    "Thành thạo React 19 + TypeScript, quản lý state và data fetching",
    "Hiểu accessibility, semantic HTML và tối ưu Core Web Vitals",
    "Có 2–3 dự án thực tế đủ để đưa vào CV",
  ],
  stages: [
    {
      id: "foundation",
      title: "Nền tảng web",
      subtitle: "Bắt buộc phải chắc trước khi học framework",
      duration: "4 – 6 tuần",
      nodes: [
        {
          id: "html",
          title: "HTML5 & Semantic",
          desc: "Cấu trúc trang, thẻ semantic (header, nav, main, article), form, SEO cơ bản.",
          tags: ["HTML", "SEO"],
        },
        {
          id: "css",
          title: "CSS3 & Layout",
          desc: "Box model, Flexbox, Grid, position, responsive với media query.",
          tags: ["CSS", "Flexbox", "Grid"],
        },
        {
          id: "git",
          title: "Git & GitHub",
          desc: "commit, branch, merge, pull request. Kỹ năng mà mọi JD đều yêu cầu.",
          tags: ["Git"],
        },
        {
          id: "a11y",
          title: "Accessibility cơ bản",
          desc: "Contrast 4.5:1, label cho form, focus visible, keyboard navigation.",
          tags: ["A11y"],
          optional: true,
        },
      ],
    },
    {
      id: "javascript",
      title: "JavaScript chuyên sâu",
      subtitle: "Phần quyết định bạn ở mức junior hay middle",
      duration: "6 – 8 tuần",
      nodes: [
        {
          id: "js-core",
          title: "JS Core",
          desc: "Scope, closure, this, prototype, event loop, async/await, Promise.",
          tags: ["JavaScript"],
        },
        {
          id: "dom",
          title: "DOM & Event",
          desc: "querySelector, event delegation, bubbling, debounce/throttle.",
          tags: ["DOM"],
        },
        {
          id: "es6",
          title: "ES6+",
          desc: "Destructuring, spread, module, optional chaining, array methods.",
          tags: ["ES6"],
        },
        {
          id: "fetch",
          title: "HTTP & API",
          desc: "REST, status code, JSON, fetch, xử lý lỗi và loading state.",
          tags: ["HTTP"],
        },
      ],
    },
    {
      id: "tooling",
      title: "Công cụ & TypeScript",
      subtitle: "Làm việc chuyên nghiệp như team thật",
      duration: "3 – 4 tuần",
      nodes: [
        {
          id: "ts",
          title: "TypeScript",
          desc: "Type, interface, generic, utility types, strict mode.",
          tags: ["TypeScript"],
        },
        {
          id: "tailwind",
          title: "Tailwind CSS",
          desc: "Utility-first, design token, dark mode, responsive variant.",
          tags: ["Tailwind"],
        },
        {
          id: "bundler",
          title: "Vite / Next bundler",
          desc: "Dev server, HMR, biến môi trường, build production.",
          tags: ["Vite"],
        },
        {
          id: "lint",
          title: "ESLint & Prettier",
          desc: "Chuẩn hoá code style, bắt lỗi sớm trước khi review.",
          tags: ["Tooling"],
          optional: true,
        },
      ],
    },
    {
      id: "react",
      title: "React & Hệ sinh thái",
      subtitle: "Trọng tâm của lộ trình",
      duration: "8 – 10 tuần",
      nodes: [
        {
          id: "react-core",
          title: "React Core",
          desc: "Component, props, state, useEffect, key, render lifecycle.",
          tags: ["React"],
        },
        {
          id: "hooks",
          title: "Hooks nâng cao",
          desc: "useMemo, useCallback, useReducer, custom hook, useRef.",
          tags: ["Hooks"],
        },
        {
          id: "routing",
          title: "Routing",
          desc: "React Router hoặc App Router của Next.js, dynamic route, layout.",
          tags: ["Routing"],
        },
        {
          id: "state",
          title: "State management",
          desc: "Context API trước, sau đó Zustand/Redux Toolkit khi dự án lớn.",
          tags: ["State"],
        },
        {
          id: "query",
          title: "Data fetching",
          desc: "TanStack Query hoặc SWR: cache, retry, invalidate, optimistic update.",
          tags: ["TanStack Query"],
        },
        {
          id: "forms",
          title: "Form & Validation",
          desc: "React Hook Form + Zod, xử lý lỗi inline và accessibility.",
          tags: ["RHF", "Zod"],
        },
      ],
    },
    {
      id: "advanced",
      title: "Nâng cao & Sản phẩm",
      subtitle: "Bước đệm lên middle/senior",
      duration: "6 – 8 tuần",
      nodes: [
        {
          id: "nextjs",
          title: "Next.js",
          desc: "SSR/SSG, server component, metadata, image optimization.",
          tags: ["Next.js"],
        },
        {
          id: "perf",
          title: "Web Performance",
          desc: "LCP, CLS, INP, lazy load, code splitting, bundle analysis.",
          tags: ["Performance"],
        },
        {
          id: "testing",
          title: "Testing",
          desc: "Vitest + Testing Library cho unit/component, Playwright cho E2E.",
          tags: ["Testing"],
        },
        {
          id: "deploy",
          title: "Deploy & CI/CD",
          desc: "Vercel/GitHub Actions, preview env, biến môi trường an toàn.",
          tags: ["DevOps"],
        },
        {
          id: "arch",
          title: "Kiến trúc frontend",
          desc: "Feature-based structure, design system, monorepo khi cần.",
          tags: ["Architecture"],
          optional: true,
        },
      ],
    },
  ],
  resources: [
    {
      title: "roadmap.sh — Frontend Roadmap",
      href: "https://roadmap.sh/frontend",
      note: "Bản đồ gốc, cập nhật hàng năm",
    },
    {
      title: "MDN Web Docs",
      href: "https://developer.mozilla.org/vi/",
      note: "Tài liệu chuẩn cho HTML/CSS/JS",
    },
    {
      title: "react.dev",
      href: "https://react.dev/",
      note: "Tài liệu chính thức React 19",
    },
    {
      title: "web.dev — Core Web Vitals",
      href: "https://web.dev/vitals/",
    },
  ],
  related: ["backend", "fullstack", "devops"],
};

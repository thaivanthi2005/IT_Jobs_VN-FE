import type { Roadmap } from "./types";

export const backendRoadmap: Roadmap = {
  slug: "backend",
  title: "Lộ trình Backend Developer",
  shortTitle: "Backend",
  summary:
    "Từ ngôn ngữ, HTTP, cơ sở dữ liệu đến kiến trúc API và bảo mật. Tập trung vào NodeJS và NestJS — stack được tuyển nhiều nhất tại Việt Nam.",
  level: "Trung cấp",
  duration: "8 – 12 tháng",
  outcomes: [
    "Thiết kế REST API rõ ràng, có validate và xử lý lỗi tập trung",
    "Làm việc thành thạo với MongoDB/PostgreSQL và migration",
    "Hiểu auth (JWT/cookie), phân quyền và bảo mật cơ bản",
    "Triển khai được service lên VPS/Docker và viết test cho API",
  ],
  stages: [
    {
      id: "language",
      title: "Ngôn ngữ & Nền tảng",
      subtitle: "Chọn một ngôn ngữ và đi sâu",
      duration: "6 – 8 tuần",
      nodes: [
        {
          id: "js-ts",
          title: "JavaScript / TypeScript",
          desc: "Bắt buộc nếu theo NodeJS. Async, module, type system.",
          tags: ["JS", "TS"],
        },
        {
          id: "http",
          title: "HTTP & Web cơ bản",
          desc: "Request/response, header, status code, CORS, cookie, cache.",
          tags: ["HTTP"],
        },
        {
          id: "linux",
          title: "Terminal & Linux",
          desc: "Command cơ bản, ssh, permission, process, log.",
          tags: ["Linux"],
        },
      ],
    },
    {
      id: "database",
      title: "Cơ sở dữ liệu",
      subtitle: "Phần bị hỏi nhiều nhất khi phỏng vấn backend",
      duration: "5 – 7 tuần",
      nodes: [
        {
          id: "sql",
          title: "SQL & PostgreSQL",
          desc: "SELECT/JOIN/GROUP BY, index, transaction, explain plan.",
          tags: ["PostgreSQL"],
        },
        {
          id: "nosql",
          title: "MongoDB",
          desc: "Document model, aggregation pipeline, embedding vs referencing.",
          tags: ["MongoDB"],
        },
        {
          id: "orm",
          title: "ORM / ODM",
          desc: "Mongoose, Prisma hoặc TypeORM: schema, migration, relation.",
          tags: ["Prisma", "Mongoose"],
        },
        {
          id: "redis",
          title: "Redis & Cache",
          desc: "Cache-aside, TTL, rate limit, session store.",
          tags: ["Redis"],
          optional: true,
        },
      ],
    },
    {
      id: "framework",
      title: "Framework & API",
      subtitle: "Xây dựng API thực chiến",
      duration: "8 – 10 tuần",
      nodes: [
        {
          id: "node",
          title: "Node.js Runtime",
          desc: "Event loop, stream, buffer, fs, process, cluster.",
          tags: ["Node.js"],
        },
        {
          id: "nest",
          title: "Express / NestJS",
          desc: "Routing, middleware, DI, module, guard, interceptor.",
          tags: ["Express", "NestJS"],
        },
        {
          id: "rest",
          title: "Thiết kế REST API",
          desc: "Đặt tên resource, versioning, phân trang, filter, chuẩn lỗi.",
          tags: ["REST"],
        },
        {
          id: "validate",
          title: "Validation & Error handling",
          desc: "Joi/Zod/class-validator, error middleware, log có trace id.",
          tags: ["Validation"],
        },
      ],
    },
    {
      id: "security",
      title: "Auth & Bảo mật",
      subtitle: "Không thể bỏ qua với sản phẩm thật",
      duration: "4 – 5 tuần",
      nodes: [
        {
          id: "auth",
          title: "Authentication",
          desc: "Hash password (bcrypt/argon2), JWT, refresh token, httpOnly cookie.",
          tags: ["JWT", "Cookie"],
        },
        {
          id: "authz",
          title: "Authorization",
          desc: "Role-based, resource ownership, kiểm tra quyền ở tầng service.",
          tags: ["RBAC"],
        },
        {
          id: "owasp",
          title: "OWASP Top 10",
          desc: "SQL injection, XSS, CSRF, rate limit, kiểm soát upload file.",
          tags: ["Security"],
        },
        {
          id: "upload",
          title: "Upload & Storage",
          desc: "Multer, validate MIME/dung lượng, lưu S3/Cloudinary.",
          tags: ["Multer"],
          optional: true,
        },
      ],
    },
    {
      id: "ops",
      title: "Vận hành & Chất lượng",
      subtitle: "Đưa code lên production an toàn",
      duration: "5 – 7 tuần",
      nodes: [
        {
          id: "docker",
          title: "Docker",
          desc: "Dockerfile, docker-compose, multi-stage build, volume.",
          tags: ["Docker"],
        },
        {
          id: "ci",
          title: "CI/CD",
          desc: "GitHub Actions: lint, test, build, deploy tự động.",
          tags: ["CI/CD"],
        },
        {
          id: "test",
          title: "Testing API",
          desc: "Jest/Vitest + Supertest, integration test với DB test.",
          tags: ["Testing"],
        },
        {
          id: "scale",
          title: "Scaling & Message Queue",
          desc: "Load balancing, BullMQ/Redis queue, idempotency cho worker.",
          tags: ["Queue"],
          optional: true,
        },
      ],
    },
  ],
  resources: [
    {
      title: "roadmap.sh — Backend Roadmap",
      href: "https://roadmap.sh/backend",
    },
    {
      title: "roadmap.sh — Node.js Roadmap",
      href: "https://roadmap.sh/nodejs",
    },
    {
      title: "Node.js Docs",
      href: "https://nodejs.org/docs/latest/api/",
    },
    {
      title: "OWASP Top 10",
      href: "https://owasp.org/www-project-top-ten/",
      note: "Bắt buộc đọc trước khi làm sản phẩm thật",
    },
  ],
  related: ["frontend", "fullstack", "devops"],
};

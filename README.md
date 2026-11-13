# ITJobs — Modern IT Job Board Platform (Frontend)

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.1.6-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Three.js-0.186-000000?style=for-the-badge&logo=threedotjs&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/Docker-Standalone-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

Giao diện người dùng hiện đại cho nền tảng tuyển dụng việc làm công nghệ (**ITJobs**), được xây dựng trên nền tảng **Next.js 15 (App Router)** và **React 19**. Ứng dụng tích hợp hệ thống thiết kế chuẩn UI/UX, hỗ trợ đa chủ đề (Light/Dark Mode), hoạt cảnh 3D trực quan với **Three.js** và **CSS 3D**, bảo vệ phân quyền tại Edge qua **Next.js Middleware**, và đóng gói container **Docker Standalone** tối ưu dung lượng dưới 150MB.

---

## 📑 Mục lục
- [1. Điểm nổi bật & Tính năng](#1-điểm-nổi-bật--tính-năng)
- [2. Công nghệ sử dụng](#2-công-nghệ-sử-dụng)
- [3. Cấu trúc thư mục](#3-cấu-trúc-thư-mục)
- [4. Cài đặt & Khởi chạy](#4-cài-đặt--khởi-chạy)
  - [Chạy với Yarn](#cách-1-chạy-cục-bộ-với-yarn)
  - [Chạy với Docker](#cách-2-chạy-với-docker-standalone)
- [5. Cấu hình biến môi trường (.env.local)](#5-cấu-hình-biến-môi-trường-envlocal)
- [6. Danh sách 16 Routes & Phân quyền](#6-danh-sách-16-routes--phân-quyền)
- [7. Design System & Đồ họa 3D](#7-design-system--đồ-họa-3d)
- [8. Tối ưu Hiệu năng & Kiểm thử](#8-tối-ưu-hiệu-năng--kiểm-thử)

---

## 1. Điểm nổi bật & Tính năng

- 🎨 **Thiết kế UI/UX hiện đại:** Gam màu tối ưu độ tương phản WCAG $\ge 4.5:1$, bo góc và shadow tinh tế, hỗ trợ Dark Mode chống chớp giao diện (Anti-FOUC).
- 🌌 **Hoạt cảnh 3D tương tác (Three.js & CSS 3D):**
  - Khối Icosahedron 3D tương tác theo chuột tại Hero section.
  - Vòng quỹ đạo CSS 3D (`OrbitRings`) chạy trên compositor mượt mà 60fps.
  - Logo Mark 3D dựng bằng phép chiếu phối cảnh Canvas 2D không tốn WebGL context.
  - Tự động tạm dừng hoạt cảnh (Zero CPU/GPU footprint) khi tab ẩn hoặc khi mở Modal.
- ⚡ **Next.js 15 App Router & Server Components:**
  - Hỗ trợ Incremental Static Regeneration (ISR) với `revalidate: 60s`.
  - Prerender toàn bộ 27 trang tĩnh/động không gây lỗi `ECONNREFUSED` lúc build.
- 🛡️ **Edge Middleware Authentication:**
  - Xác thực chữ ký số JWT với thư viện `jose` trực tiếp tại Edge.
  - Phân quyền nghiêm ngặt giữa tài khoản Ứng viên (`/user-manage/*`) và Doanh nghiệp (`/company-manage/*`).
- 📝 **Trình soạn thảo TinyMCE:** Tích hợp form đăng tin tuyển dụng chuẩn WYSIWYG.
- 📦 **Docker Multi-stage Standalone:** Kích thước image sản phẩm được rút gọn từ $>1.2\text{GB}$ xuống dưới $150\text{MB}$.

---

## 2. Công nghệ sử dụng

| Lớp | Thư viện / Công nghệ | Phiên bản | Mục đích |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | `15.1.6` | Server Components, SSR, ISR, Routing |
| **Core UI** | React | `19.0.0` | UI Library thế hệ mới nhất |
| **Styling** | Tailwind CSS | `3.4.1` | Utility-first CSS & Custom Design Tokens |
| **3D Graphics** | Three.js + React Three Fiber + Drei | `0.186` / `9.8` / `10.7` | Hiệu ứng 3D không gian vũ trụ công nghệ |
| **Icons** | React Icons (FontAwesome 6) | `5.4.0` | Bộ icon SVG chuẩn vector |
| **Security** | Jose | `6.2.17` | Xác thực token JWT tại Edge Middleware |
| **Rich Text** | TinyMCE React | `6.2.1` | Trình soạn thảo mô tả công việc |
| **Toast** | Sonner | `2.0.5` | Thông báo trạng thái người dùng |
| **Language** | TypeScript | `5.x` | Type-safety toàn diện dự án |

---

## 3. Cấu trúc thư mục

```text
Product_JOB_FE_NEW_UI_UX/
├── public/                     # Tài nguyên tĩnh (SVG icons, favicons, effects)
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── (auth)/             # Trang đăng ký / đăng nhập (User & Company)
│   │   ├── (pages)/            # Các trang public: Trang chủ, Chi tiết Job, Công ty...
│   │   ├── cam-nang/           # Cẩm nang IT & Lộ trình nghề nghiệp (Static content)
│   │   ├── company-manage/     # Khu vực quản trị Doanh nghiệp (Protected)
│   │   ├── user-manage/        # Khu vực quản trị Ứng viên (Protected)
│   │   ├── globals.css         # Design tokens, Typography & Component layers
│   │   └── layout.tsx          # Root Layout (Fonts, Header, Footer, Toaster)
│   ├── components/             # Reusable UI Components
│   │   ├── auth/               # Form đăng nhập, đăng ký, trường mật khẩu
│   │   ├── cards/              # Job Card, Company Card, Quick-view Modal
│   │   ├── home/               # HeroSearch, CategorySection, OrbitRings...
│   │   ├── layout/             # Header, Navigation, Footer, Logo 3D
│   │   ├── manage/             # Shell quản trị, bảng thống kê, form ứng tuyển
│   │   ├── three/              # Scene 3D Three.js, Canvas r3f
│   │   └── ui/                 # Badge, Dialog, Pagination, ThemeToggle...
│   ├── config/                 # Biến cấu hình (API_URL, danh mục select...)
│   ├── hooks/                  # Custom React Hooks (useAuth, useTheme...)
│   ├── lib/                    # Thư viện tiện ích (validate, format tiền tệ, dates)
│   ├── types/                  # TypeScript interface definitions (Job, Company, CV)
│   └── middleware.ts           # Route guard bảo vệ phân quyền tài khoản
├── .dockerignore
├── .env.example
├── Dockerfile                  # Dockerfile Multi-stage Standalone
├── docker-compose.yml          # Compose khởi chạy riêng Frontend
├── next.config.ts              # Cấu hình Next.js (Standalone, Remote Patterns)
├── package.json
└── tailwind.config.ts
```

---

## 4. Cài đặt & Khởi chạy

### Yêu cầu hệ thống
- **Node.js** `>= 18.18.0` (Khuyên dùng Node 22)
- **Yarn** package manager

### Cách 1: Chạy cục bộ với Yarn

1. **Cài đặt dependencies:**
   ```bash
   yarn install --frozen-lockfile
   ```

2. **Cấu hình môi trường:**
   Tạo file `.env.local` từ mẫu `.env.example`:
   ```bash
   cp .env.example .env.local
   # Điền URL Backend (ví dụ: http://localhost:4000)
   ```

3. **Chạy server phát triển:**
   ```bash
   yarn dev
   ```
   Mở trình duyệt tại: `http://localhost:3000`

4. **Kiểm tra và Build kiểm thử:**
   ```bash
   # Kiểm tra kiểu dữ liệu TypeScript:
   npx tsc --noEmit

   # Linter kiểm tra code:
   yarn lint

   # Build bản production:
   yarn build
   yarn start
   ```

---

### Cách 2: Chạy với Docker Standalone

Dự án đã cấu hình sẵn Dockerfile 3-stage tạo bản build độc lập (standalone):

```bash
# 1. Build image và chạy container ngầm:
docker compose up -d --build

# 2. Xem logs hoạt động:
docker compose logs -f

# 3. Kiểm tra container:
docker compose ps

# 4. Tắt container:
docker compose down
```

---

## 5. Cấu hình biến môi trường (.env.local)

Sao chép `.env.example` thành `.env.local` và điền cấu hình thực tế:

```ini
# =====================================================================
# Cấu hình biến môi trường Frontend Next.js (ITJobs)
# =====================================================================

# URL API của Backend Express.js (Trình duyệt gọi API tới đây)
NEXT_PUBLIC_API_URL=https://api.devjobs.click

# URL của website Frontend
NEXT_PUBLIC_SITE_URL=https://devjobs.click

# API key TinyMCE Editor cho form đăng tuyển công việc
NEXT_PUBLIC_API_TINYMCE=your_tinymce_api_key_here

# Khóa bí mật JWT để Middleware xác thực cookie token (BẮT BUỘC trùng với Backend)
JWT_SECRET=your_jwt_secret_must_be_same_as_backend
```

---

## 6. Danh sách 16 Routes & Phân quyền

### 🌐 Nhóm trang Công khai (Public Routes)
| Tuyến đường (Route) | Mô tả giao diện | Cơ chế Render |
| :--- | :--- | :--- |
| `/` | Trang chủ (Hero search, việc nổi bật, top doanh nghiệp) | Static / ISR (`revalidate: 60`) |
| `/search` | Tìm kiếm việc làm với bộ lọc đa tiêu chí | Dynamic Client Search |
| `/job/detail/[slug]` | Chi tiết tin tuyển dụng & Form nộp CV | Dynamic SSR |
| `/company/list` | Danh bạ các công ty công nghệ | Static with Pagination |
| `/company/detail/[slug]` | Hồ sơ công ty & các vị trí đang mở | Dynamic SSR |
| `/cam-nang` | Cẩm nang nghề nghiệp IT & 4 lộ trình học | Static SSG |
| `/cam-nang/[slug]` | 4 bài viết cẩm nang chuyên sâu | Static SSG |
| `/cam-nang/lo-trinh/[slug]` | Lộ trình kỹ năng Frontend / Backend / Fullstack / DevOps | Static SSG |

### 🔐 Nhóm trang Xác thực (Auth Routes)
| Tuyến đường (Route) | Mô tả |
| :--- | :--- |
| `/user/login`, `/user/register` | Đăng nhập / Đăng ký dành cho Ứng viên |
| `/company/login`, `/company/register` | Đăng nhập / Đăng ký dành cho Nhà tuyển dụng |

### 🛡️ Nhóm trang Quản trị (Protected Routes - Bảo vệ bởi Middleware)
| Tuyến đường (Route) | Quyền hạn | Chức năng |
| :--- | :--- | :--- |
| `/user-manage/profile` | Ứng viên | Cập nhật hồ sơ cá nhân và avatar |
| `/user-manage/cv/list` | Ứng viên | Theo dõi danh sách công việc đã ứng tuyển & trạng thái duyệt |
| `/company-manage/profile` | Doanh nghiệp | Cập nhật thông tin công ty, logo và giới thiệu |
| `/company-manage/job/list` | Doanh nghiệp | Quản lý danh sách tin tuyển dụng đã đăng (sửa, xóa, xem) |
| `/company-manage/job/create` | Doanh nghiệp | Tạo tin tuyển dụng mới kèm rich-text TinyMCE |
| `/company-manage/job/edit/[id]` | Doanh nghiệp | Chỉnh sửa tin tuyển dụng |
| `/company-manage/cv/list` | Doanh nghiệp | Danh sách ứng viên ứng tuyển vào các vị trí của công ty |
| `/company-manage/cv/detail/[slug]` | Doanh nghiệp | Xem chi tiết CV và phê duyệt / từ chối hồ sơ |

---

## 7. Design System & Đồ họa 3D

- **Tone màu chủ đạo:**
  - Primary: `#0369A1` (Ocean Navy)
  - Secondary: `#0EA5E9` (Sky Cyan)
  - Accent / Success: `#16A34A` (Emerald)
  - Background: `#F1F5F9` (Light) / `#0B0F19` (Dark)
- **Kiểm soát hoạt cảnh thông minh:** Tích hợp `src/lib/scene-pause.ts` sử dụng cơ chế reference-counting: khi người dùng mở QuickView Modal hoặc chuyển sang tab khác trong trình duyệt, toàn bộ vòng lặp requestAnimationFrame của Three.js sẽ tạm dừng hoàn toàn để tiết kiệm pin và tài nguyên thiết bị.
- **Tiêu chuẩn Accessibility:** Đạt chỉ số tương phản WCAG AA trên cả 2 theme, hỗ trợ phím điều hướng `Escape` / `Tab-trap` cho tất cả Dialog.

---

## 8. Tối ưu Hiệu năng & Kiểm thử

- **Dung lượng First-paint JS:** $\approx 122\text{ kB}$ (Brotli compressed).
- **Thời gian render trang chủ:** $< 150\text{ms}$ với bộ nhớ đệm ISR.
- **Quy trình kiểm thử tích hợp (`scripts/`):**
  - `verify-effects.mjs`: Kiểm tra tính toàn vẹn của mã nguồn canvas và hiệu ứng đồ họa.
  - `audit-contrast.cjs`: Tự động kiểm tra chỉ số WCAG tương phản giữa nền và chữ.
  - `audit-palette.cjs`: Kiểm tra toàn bộ token màu trong Tailwind không bị thiếu step.
  - `verify-routes-render.cjs`: Kiểm thử tải và render các route chính, đảm bảo không có runtime error.

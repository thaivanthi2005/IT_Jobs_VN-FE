# =====================================================================
# Dockerfile cho ITJobs Frontend (Next.js 15 App Router + React 19)
# Multi-stage build (deps -> builder -> runner) với output "standalone"
# Tối ưu kích thước image (< 150MB) và bảo mật với user không phải root.
# =====================================================================

# ---------- Stage 1: Cài đặt dependencies ----------
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy lockfile và package.json để tận dụng cache layer của Docker
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# ---------- Stage 2: Build source code ----------
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Khai báo các build arguments cho biến môi trường public
ARG NEXT_PUBLIC_API_URL=https://api.devjobs.click
ARG NEXT_PUBLIC_SITE_URL=https://devjobs.click
ARG NEXT_PUBLIC_API_TINYMCE=
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAF_MsZ0vt1mpZCng
ARG JWT_SECRET=

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_TINYMCE=$NEXT_PUBLIC_API_TINYMCE
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV JWT_SECRET=$JWT_SECRET
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Chạy build production tạo output standalone
RUN yarn build

# ---------- Stage 3: Runtime image nhỏ gọn ----------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV TZ=Asia/Ho_Chi_Minh
ENV NEXT_PUBLIC_API_URL=https://api.devjobs.click
ENV NEXT_PUBLIC_SITE_URL=https://devjobs.click
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAF_MsZ0vt1mpZCng
ENV INTERNAL_API_URL=http://host.docker.internal:4000

# dumb-init xử lý process signal chuẩn trong container
RUN apk add --no-cache dumb-init

# Tạo user không có đặc quyền root để đảm bảo an ninh
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy thư mục static và public
COPY --from=builder /app/public ./public

# Copy output standalone (chỉ bao gồm runtime files và server.js)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Đảm bảo phân quyền thư mục cache cho user nextjs
RUN mkdir -p .next/cache && chown -R nextjs:nodejs .next/cache

USER nextjs

EXPOSE 3000

# Healthcheck kiểm tra server Next.js đang phản hồi
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.status<500?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]


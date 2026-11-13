import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeScript } from "@/components/ui/ThemeToggle";

/* Relative icon paths need an absolute base to resolve in metadata; the
   production host comes from the environment so this does not pin localhost. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ITJobs — Việc làm IT cho Developer chất",
    template: "%s | ITJobs",
  },
  description:
    "Nền tảng tuyển dụng IT hàng đầu Việt Nam. Tìm việc làm lập trình viên, kết nối với các công ty công nghệ top đầu.",
  keywords: ["việc làm IT", "tuyển dụng IT", "lập trình viên", "developer", "IT jobs"],
  applicationName: "ITJobs",
  /* `src/app/icon.svg` is picked up automatically by the App Router; these add
     the Apple touch icon and the manifest so an install uses the same mark. */
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#080f1d" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="vi"
      className="h-full"
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[999] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Bỏ qua điều hướng
        </a>

        <Header />

        <main id="main-content" className="w-full flex-1">
          {children}
        </main>

        <Footer />

        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{ className: "font-sans" }}
        />
      </body>
    </html>
  );
}

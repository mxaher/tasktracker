import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "متتبع المهام - نظام إدارة المهام",
  description: "تطبيق عربي متكامل لإدارة المهام ومتابعة التقدم والتعاون بين أعضاء الفريق.",
  keywords: ["متتبع المهام", "إدارة المهام", "إدارة المشاريع", "نكست جي إس", "تايب سكريبت", "ريأكت"],
  authors: [{ name: "فريق متتبع المهام" }],
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    shortcut: "/logo.svg",
  },
  openGraph: {
    title: "متتبع المهام - نظام إدارة المهام",
    description: "أدر المهام وتابع التقدم وتعاون مع فريقك من واجهة عربية كاملة",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={tajawal.variable}>
      <body
        className="antialiased bg-background text-foreground w-full min-h-screen"
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

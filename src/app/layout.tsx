import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "TaskTracker - Task Management System",
  description: "A comprehensive task tracking web application for managing tasks, tracking progress, and team collaboration.",
  keywords: ["TaskTracker", "Task Management", "Project Management", "Next.js", "TypeScript", "React"],
  authors: [{ name: "TaskTracker Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "TaskTracker - Task Management System",
    description: "Manage tasks, track progress, and collaborate with your team",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${tajawal.variable} antialiased bg-background text-foreground w-full min-h-screen`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

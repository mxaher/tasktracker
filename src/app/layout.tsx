import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground w-full min-h-screen`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

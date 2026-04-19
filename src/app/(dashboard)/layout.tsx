import Link from "next/link";
import { BarChart3, Settings, MessageSquare } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="flex min-h-14 w-full items-center gap-4 px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">متتبع المهام</span>
          </Link>
          <nav className="flex items-center gap-1 ms-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm hover:bg-muted transition-colors"
            >
              الرئيسية
            </Link>
            <Link
              href="/settings/telegram"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm hover:bg-muted transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              إعدادات تيليغرام
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-6 md:px-6">{children}</main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        متتبع المهام © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

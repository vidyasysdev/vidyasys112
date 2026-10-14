import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { RouteProgress } from "@/components/ui/RouteProgress";
import { BackToTop } from "@/components/ui/BackToTop";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="top"
      className="min-h-screen flex flex-col bg-canvas text-ink scroll-smooth"
    >
      <RouteProgress />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 pb-[calc(4.5rem_+_env(safe-area-inset-bottom))] lg:pb-0 outline-none"
      >
        {children}
      </main>
      <Footer />
      <BottomNav />
      <BackToTop />
    </div>
  );
}

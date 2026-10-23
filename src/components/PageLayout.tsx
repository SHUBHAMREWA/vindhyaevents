"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import dynamic from "next/dynamic";

const TopBanner  = dynamic(() => import("@/components/TopBanner"),  { ssr: false });
const Navbar     = dynamic(() => import("@/components/Navbar"),     { ssr: false });
const Footer     = dynamic(() => import("@/components/Footer"),     { ssr: false });
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });

interface Props {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  badge: string;
}

export default function PageLayout({ children, title, subtitle, badge }: Props) {
  const { theme } = useTheme();
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <TopBanner />
      <Navbar />

      {/* Page Hero Banner */}
      <div
        className="pt-[84px] md:pt-[100px] pb-5 md:pb-14 text-white text-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${theme.vars["--c-footer-from"]} 0%, ${theme.vars["--c-primary"]} 100%)` }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute -top-10 -left-10 w-40 h-40 md:w-64 md:h-64 rounded-full opacity-20 blur-2xl md:blur-3xl pointer-events-none"
          style={{ background: theme.vars["--c-secondary"] }}
        />
        <div
          className="absolute -bottom-10 -right-10 w-36 h-36 md:w-48 md:h-48 rounded-full opacity-20 blur-2xl md:blur-3xl pointer-events-none"
          style={{ background: theme.vars["--c-accent"] }}
        />

        <div className="relative z-10 container mx-auto px-4 md:px-6 pt-1.5 md:pt-6">
          {/* Top navigation row: Back button on left, Badge on right */}
          <div className="flex items-center justify-between gap-3 mb-2 md:mb-5 max-w-2xl mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-white/85 hover:text-white transition-all text-[11px] md:text-sm font-semibold bg-white/10 hover:bg-white/20 active:scale-95 px-2.5 py-1 md:px-4 md:py-1.5 rounded-full backdrop-blur-xs border border-white/10"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>

            <div
              className="inline-flex items-center px-2.5 py-0.5 md:px-4 md:py-1 rounded-full text-[10px] md:text-xs font-bold tracking-wider uppercase text-amber-200 border border-amber-300/30"
              style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
            >
              {badge}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif font-black text-white mb-1.5 md:mb-3 tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-white/85 text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed line-clamp-2 md:line-clamp-none font-normal">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Page Content */}
      {children}

      <Footer />
      <CustomCursor />
    </main>
  );
}

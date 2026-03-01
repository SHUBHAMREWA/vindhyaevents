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
        className="pt-[88px] pb-16 text-white text-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${theme.vars["--c-footer-from"]} 0%, ${theme.vars["--c-primary"]} 100%)` }}
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ background: theme.vars["--c-secondary"] }} />
        <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full opacity-20 blur-3xl"
          style={{ background: theme.vars["--c-accent"] }} />

        <div className="relative z-10 container mx-auto px-6 pt-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div
            className="inline-block px-5 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}
          >
            {badge}
          </div>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-3">{title}</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">{subtitle}</p>
        </div>
      </div>

      {/* Page Content */}
      {children}

      <Footer />
      <CustomCursor />
    </main>
  );
}

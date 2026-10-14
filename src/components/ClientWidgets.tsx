"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), { ssr: false });

export default function ClientWidgets() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const redirectHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#services" || hash === "#service") {
        router.replace("/services");
      } else if (
        hash === "#contact" ||
        hash === "#consultation" ||
        hash === "#book"
      ) {
        router.replace("/contact");
      }
    };
    redirectHash();
    window.addEventListener("hashchange", redirectHash);
    return () => window.removeEventListener("hashchange", redirectHash);
  }, [router]);

  return (
    <>
      <FloatingWhatsAppButton />
      <CustomCursor />
    </>
  );
}

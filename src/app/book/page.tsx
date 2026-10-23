"use client";

import dynamic from "next/dynamic";
import BookConsultation from "@/components/BookConsultation";
import { motion } from "motion/react";

const TopBanner = dynamic(() => import("@/components/TopBanner"), { ssr: false });
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });

export default function BookPage() {
  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between overflow-x-hidden w-full">
      <TopBanner />
      <Navbar />

      <main className="flex-1 w-full max-w-full overflow-x-hidden pt-[102px] sm:pt-[112px] pb-24 sm:pb-16 px-3 sm:px-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md mx-auto min-w-0"
        >
          <BookConsultation formOnly={true} />
        </motion.div>
      </main>
    </div>
  );
}

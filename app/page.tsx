"use client";

import { Camera, ImageIcon, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const HomePage = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <main className="min-h-screen bg-bg-primary pb-[240px] pt-[20px]">
      <div className="mx-auto max-w-md w-full px-5">
        {/* Header - Gap 20 from top is handled by main pt-[20px] */}
        <div className="w-full max-w-[350px] mx-auto h-[55px] bg-bg-header rounded-full flex items-center justify-center">
          <h1 className="font-semibold text-[20px] leading-none text-[#15151A]">
            Realtime QR Checker
          </h1>
        </div>

        {/* Gap 35 */}
        <div className="h-[35px]" />

        {/* Hero Text */}
        <p className="text-center font-medium text-[16px] leading-relaxed">
          <span className="text-[#B0FF1F]">
            &ldquo;Jangan asal scan QR Code, cek dulu
            <br />
          </span>
          <span className="px-1 bg-[#FF3F3F]/84 text-[#B0FF1F]">
            keamanannya
          </span>
          <span className="text-[#B0FF1F]"> disini&rdquo;</span>
        </p>

        {/* Gap 32 */}
        <div className="h-[32px]" />

        {/* Scan Box */}
        <Link
          href="/scan/camera"
          className="block w-full h-[281px] rounded-[32px] flex flex-col items-center justify-center gap-4 transition-all duration-300 bg-[#15151A] border border-[#B0FF1F] hover:bg-[#15151A]/80 relative"
        >
          <Camera className="w-10 h-10 text-text-base/40" />
          <span className="text-text-base/40 font-medium text-sm">
            Scan dari kamera
          </span>
        </Link>

        {/* Gap 24 */}
        <div className="h-[24px]" />

        {/* Buttons Row */}
        <div className="flex gap-3 w-full justify-center">
          {/* Upload Gallery */}
          <Link
            href="/scan/upload"
            className="flex items-center justify-center gap-[8px] rounded-[50px] transition-all duration-300 w-[171px] h-[57px] bg-[#F5F5F5]/10 border border-[#797979] backdrop-blur-[20px] hover:bg-[#F5F5F5]/20"
          >
            <ImageIcon className="w-[15px] h-[15px] text-[#B0FF1F] drop-shadow-[0_0_8px_rgba(176,255,31,0.8)]" />
            <span className="font-semibold text-[12px] text-[#B0FF1F]">
              Upload dari galeri
            </span>
          </Link>

          {/* Search Reports */}
          <Link
            href="/reports"
            className="flex items-center justify-center gap-[8px] rounded-[50px] transition-all duration-300 w-[171px] h-[57px] bg-[#F5F5F5]/10 border border-[#797979] backdrop-blur-[20px] hover:bg-[#F5F5F5]/20"
          >
            <span className="font-semibold text-[12px] text-[#B0FF1F]">
              Cari hasil laporan
            </span>
            <div className="rounded-full flex items-center justify-center w-[29px] h-[29px] bg-[#B0FF1F] shadow-[0_0_12px_rgba(176,255,31,0.8)]">
              <ArrowUpRight className="w-[14px] h-[14px] text-[#15151A]" />
            </div>
          </Link>
        </div>

        {/* Gap 36 */}
        <div className="h-[36px]" />
      </div>

      {/* Interactive Slide-up Footer */}
      <motion.div
        animate={{
          height: isSheetOpen ? "auto" : "90px",
        }}
        initial={false}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={() => setIsSheetOpen(!isSheetOpen)}
        className="fixed bottom-0 left-0 right-0 bg-[#15151A] rounded-t-[32px] z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] cursor-pointer overflow-hidden"
      >
        <div className="mx-auto flex flex-col items-center w-full max-w-[390px] pt-4 pb-8">
          {/* Drag Handle */}
          <div className="w-[62px] h-[4px] bg-white/20 rounded-full mb-6" />

          <h2 className="text-center font-semibold text-[16px] text-[#F5F5F5]/60 mb-2">
            Hasil scan realtime dan akurat
          </h2>

          <AnimatePresence>
            {isSheetOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="px-8"
              >
                <div className="h-4" />
                <p className="text-center font-medium text-[12px] leading-relaxed text-[#F5F5F5]/60">
                  Disini kami berkomitmen membantu anda dalam memecahkan masalah
                  ketika anda bingung isi qr ini apa dan mengurangi resiko
                  menajadi korban penipuan
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </main>
  );
};

export default HomePage;

"use client";

import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

export default function ReportsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-[390px] px-5">
        <div className="pt-safe-top space-y-[20px]">
          {/* Header */}
          <div className="w-[350px] h-[55px] bg-lime rounded-full flex items-center justify-center">
            <h1 className="text-text font-medium text-xl">
              Realtime QR Checker
            </h1>
          </div>

          <div className="h-[53px]" />

          {/* Title Section */}
          <div className="relative">
            {/* Back Button */}
            <Link
              href="/"
              className="absolute left-0 top-0 w-8 h-8 bg-[#F5F5F5] rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-text" />
            </Link>

            {/* Title */}
            <div className="text-center">
              <h2 className="text-text font-semibold text-xl">
                Laporan QR Penipuan
              </h2>
              <div className="h-2" />
              <p className="text-text font-medium text-xs">
                Temukan hal mencurigakan
              </p>
            </div>
          </div>

          <div className="h-[36px]" />

          {/* Search Box */}
          <div className="relative w-[350px] h-[50px]">
            <div className="absolute inset-0 border-2 border-lime rounded-[47px] flex items-center px-5 bg-white">
              <Search className="w-5 h-5 text-text/50 flex-shrink-0" />
              <input
                type="text"
                placeholder="Cari URL, merchant, atau NMID"
                className="flex-1 mx-3 text-text font-medium text-sm placeholder:text-text/50 bg-transparent outline-none"
              />
              <button className="w-[37px] h-[37px] bg-lime rounded-full flex items-center justify-center hover:bg-lime/90 transition-colors flex-shrink-0">
                <SlidersHorizontal className="w-5 h-5 text-text" />
              </button>
            </div>
          </div>

          <div className="h-[197px]" />

          {/* Empty State */}
          <div className="flex flex-col items-center">
            <h3 className="text-text font-bold text-xl">
              Belum Ada Laporan Penipuan
            </h3>

            <div className="h-4" />

            <p className="text-text/50 font-medium text-sm">
              Database masih kosong.
            </p>

            <div className="h-[160px]" />

            {/* CTA Button */}
            <Link
              href="/scan/camera"
              className="w-[166px] h-[44px] bg-lime rounded-full flex items-center justify-center hover:bg-lime/90 transition-colors"
            >
              <span className="text-text font-semibold text-sm">
                Scan QR Sekarang
              </span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

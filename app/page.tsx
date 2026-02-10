"use client";

import { Camera, ImageIcon, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg-primary overflow-hidden">
      <div className="mx-auto max-w-md w-full px-5">
        <div className="h-5" />

        <div className="w-full max-w-[350px] mx-auto h-[55px] bg-bg-header rounded-full flex items-center justify-center">
          <h1
            className="font-semibold text-[20px] leading-none"
            style={{ color: "#15151A" }}
          >
            Realtime QR Checker
          </h1>
        </div>

        <div className="h-[35px]" />

        <p className="text-center font-medium text-[16px] leading-relaxed">
          <span style={{ color: "#B0FF1F" }}>
            &ldquo;Jangan asal scan QR Code, cek dulu
            <br />
          </span>
          <span
            className="px-1"
            style={{
              backgroundColor: "rgba(255, 63, 63, 0.84)",
              color: "#B0FF1F",
            }}
          >
            keamanannya
          </span>
          <span style={{ color: "#B0FF1F" }}> disini&rdquo;</span>
        </p>

        <div className="h-8" />

        <Link
          href="/scan/camera"
          className="block w-full h-[281px] rounded-[32px] flex flex-col items-center justify-center gap-4 transition-all duration-300"
          style={{
            backgroundColor: "#15151A",
            border: "1px solid #B0FF1F",
          }}
        >
          <Camera className="w-10 h-10 text-text-base/40" />
          <span className="text-text-base/40 font-medium text-sm">
            Scan dari kamera
          </span>
        </Link>

        <div className="h-6" />

        <div className="flex gap-3 w-full justify-center">
          <Link
            href="/scan/upload"
            className="flex items-center justify-center gap-2 rounded-[50px] transition-all duration-300"
            style={{
              width: "171px",
              height: "57px",
              backgroundColor: "rgba(245, 245, 245, 0.1)",
              border: "1px solid #797979",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <ImageIcon
              style={{
                width: "15px",
                height: "15px",
                color: "#B0FF1F",
                filter: "drop-shadow(0 0 8px rgba(176, 255, 31, 0.8))",
              }}
            />
            <span
              className="font-semibold text-[12px]"
              style={{ color: "#B0FF1F" }}
            >
              Upload dari galeri
            </span>
          </Link>

          <Link
            href="/reports"
            className="flex items-center justify-center gap-2 rounded-[50px] transition-all duration-300"
            style={{
              width: "171px",
              height: "57px",
              backgroundColor: "rgba(245, 245, 245, 0.1)",
              border: "1px solid #797979",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <span
              className="font-semibold text-[12px]"
              style={{ color: "#B0FF1F" }}
            >
              Cari hasil laporan
            </span>
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: "29px",
                height: "29px",
                backgroundColor: "#B0FF1F",
                boxShadow: "0 0 12px rgba(176, 255, 31, 0.8)",
              }}
            >
              <ArrowUpRight
                style={{ width: "14px", height: "14px", color: "#15151A" }}
              />
            </div>
          </Link>
        </div>

        <div className="h-9" />

        <div
          className="mx-auto flex flex-col items-center"
          style={{ width: "390px" }}
        >
          <div
            style={{
              width: "62px",
              height: "1px",
              backgroundColor: "rgba(245, 245, 245, 0.2)",
            }}
          />

          <div className="h-8" />

          <h2
            className="text-center font-semibold text-[16px] mb-4"
            style={{ color: "rgba(245, 245, 245, 0.6)" }}
          >
            Hasil scan realtime dan akurat
          </h2>

          <p
            className="text-center font-medium text-[12px] leading-relaxed px-4"
            style={{ color: "rgba(245, 245, 245, 0.6)" }}
          >
            Disini kami berkomitmen membantu anda dalam memecahkan masalah
            ketika anda bingung isi qr ini apa dan mengurangi resiko menajadi
            korban penipuan
          </p>
        </div>
      </div>
    </main>
  );
}

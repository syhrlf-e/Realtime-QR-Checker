"use client";

import { Camera, Upload, ArrowUpRight, ChevronDown } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqItems = [
    {
      question: "Kenapa harus pakai QR Safe Checker?",
      answer:
        "QR Safe Checker membantu Anda mendeteksi QR code berbahaya sebelum melakukan pembayaran atau mengakses link, melindungi dari penipuan phishing dan QRIS palsu.",
    },
    {
      question: "Bagaimana cara kerjanya?",
      answer:
        "Aplikasi akan menganalisis QR code yang Anda scan, memeriksa keamanan URL, validasi QRIS, dan mencocokkan dengan database laporan penipuan dari pengguna lain.",
    },
    {
      question: "Apakah gratis?",
      answer:
        "Ya, QR Safe Checker 100% gratis untuk semua pengguna. Tidak ada biaya tersembunyi atau langganan.",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-[390px] px-5">
        <div className="pt-safe-top space-y-9">
          <div className="w-[350px] h-[55px] bg-lime rounded-full flex items-center justify-center">
            <h1 className="text-text font-medium text-xl">
              Realtime QR Checker
            </h1>
          </div>

          <p className="text-text text-sm font-normal text-center">
            "Jangan asal scan QR Code, cek dulu
            <br />
            <span className="bg-lime px-1">keamanannya</span> disini"
          </p>

          <div className="flex gap-4">
            <Link
              href="/scan/camera"
              className="w-[164px] h-[132px] border-2 border-lime rounded-[47px] flex flex-col items-center justify-center gap-2 hover:bg-lime/5 transition-colors"
            >
              <Camera className="w-8 h-8 text-text" />
              <span className="text-text font-semibold text-sm">
                Scan dari kamera
              </span>
            </Link>

            <Link
              href="/scan/upload"
              className="w-[164px] h-[132px] border-2 border-lime rounded-[47px] flex flex-col items-center justify-center gap-2 hover:bg-lime/5 transition-colors"
            >
              <Upload className="w-8 h-8 text-text" />
              <span className="text-text font-semibold text-sm">
                Upload foto QR
              </span>
            </Link>
          </div>

          <Link
            href="/reports"
            className="w-[350px] h-[57px] border-2 border-lime rounded-full flex items-center justify-between pl-6 pr-[14px] hover:bg-lime/5 transition-colors"
          >
            <span className="text-text font-medium text-sm">
              Lihat Laporan Penipuan
            </span>
            <div className="w-[29px] h-[29px] bg-lime rounded-full flex items-center justify-center">
              <ArrowUpRight className="w-[18px] h-[18px] text-text" />
            </div>
          </Link>

          <div className="space-y-6">
            <h2 className="text-text font-medium text-base">
              Apa itu QR Safe Checker?
            </h2>

            <div className="space-y-2">
              {faqItems.map((item, index) => (
                <div key={index} className="w-[350px]">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full h-[46px] bg-bg-accordion rounded-lg px-4 flex items-center justify-between hover:bg-gray-200 transition-colors"
                  >
                    <span className="text-text font-semibold text-xs text-left">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-text transition-transform ${
                        openFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openFaq === index && (
                    <div className="mt-2 px-4 py-3 bg-white border border-bg-accordion rounded-lg">
                      <p className="text-text text-xs leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

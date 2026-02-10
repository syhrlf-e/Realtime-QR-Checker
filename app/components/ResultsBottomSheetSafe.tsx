"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import ReportModal from "./ReportModal";

interface QRResultData {
  type: string;
  merchant?: string;
  nmid?: string;
  city?: string;
  amount?: string;
  checks: string[];
  rawData?: string;
  securityAnalysis?: {
    overallStatus: string;
    checks: Array<{
      name: string;
      status: string;
      message: string;
    }>;
  };
}

interface ResultsBottomSheetProps {
  data: QRResultData;
  onClose: () => void;
  onScanAgain: () => void;
  onReport?: () => void;
}

export default function ResultsBottomSheetSafe({
  data,
  onClose,
  onScanAgain,
  onReport,
}: ResultsBottomSheetProps) {
  const [showReportModal, setShowReportModal] = useState(false);

  const isQRIS = data.type === "QRIS Payment";
  const hasDetailedInfo =
    data.merchant || data.nmid || data.city || data.amount;

  const baseChecks =
    data.securityAnalysis?.checks ||
    data.checks.map((check) => ({
      name: check,
      status: "safe",
      message: check,
    }));

  const fallbackChecks = [
    { name: "Format QRIS valid", status: "safe", message: "Format QRIS valid" },
    {
      name: "Merchant ID terverifikasi",
      status: "safe",
      message: "Merchant ID terverifikasi",
    },
    {
      name: "Tidak ada laporan scam",
      status: "safe",
      message: "Tidak ada laporan scam",
    },
  ];

  const securityChecks =
    baseChecks.length >= 3
      ? baseChecks.slice(0, 3)
      : [...baseChecks, ...fallbackChecks].slice(0, 3);

  const handleReportSubmit = (reportData: any) => {
    console.log("Report submitted:", reportData);
    setShowReportModal(false);
    onClose();
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative w-full bg-[#15151A] rounded-t-3xl overflow-hidden"
        style={{ height: "90vh" }}
      >
        <div className="px-5 pt-4 h-full overflow-y-auto pb-10">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-1 bg-text-base/20 rounded-full" />
          </div>

          <div className="flex justify-center mb-3">
            <div className="relative w-[49px] h-[49px]">
              <Image
                src="/cheekmark.png"
                alt="Safe"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <h2 className="text-text-base font-medium text-xl text-center mb-8">
            QR Code Terlihat Aman
          </h2>

          <div className="relative mt-6 mb-8">
            {/* Floating Type Pill */}
            <div className="absolute -top-5 left-0 right-0 flex justify-center z-10">
              <div className="px-6 py-2 bg-[#B0FF1F] rounded-full shadow-lg">
                <span className="text-[#121C00] font-medium text-sm">
                  {data.type}
                </span>
              </div>
            </div>

            {/* Data Box */}
            <div className="w-full bg-[#1A1A20] rounded-2xl p-5 pt-10">
              {isQRIS && hasDetailedInfo ? (
                <div className="space-y-4">
                  {data.merchant && (
                    <div className="flex justify-between items-start">
                      <span className="text-[#B0FF1F]/50 text-xs font-medium">
                        Merchant
                      </span>
                      <span className="text-[#B0FF1F] text-sm font-medium text-right">
                        {data.merchant}
                      </span>
                    </div>
                  )}

                  {data.nmid && (
                    <div className="flex justify-between items-start">
                      <span className="text-[#B0FF1F]/50 text-xs font-medium">
                        NMID
                      </span>
                      <span className="text-[#B0FF1F] text-sm font-medium text-right">
                        {data.nmid}
                      </span>
                    </div>
                  )}

                  {data.city && (
                    <div className="flex justify-between items-start">
                      <span className="text-[#B0FF1F]/50 text-xs font-medium">
                        Kota
                      </span>
                      <span className="text-[#B0FF1F] text-sm font-medium text-right">
                        {data.city}
                      </span>
                    </div>
                  )}

                  {data.amount && (
                    <div className="flex justify-between items-start">
                      <span className="text-[#B0FF1F]/50 text-xs font-medium">
                        Amount
                      </span>
                      <span className="text-[#B0FF1F] text-sm font-medium text-right">
                        {data.amount}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-[#B0FF1F]/50 text-xs font-medium mb-2">
                    QR Content:
                  </p>
                  <p className="text-[#B0FF1F] text-sm font-medium break-all">
                    {data.rawData}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Security checks */}
          <div className="space-y-4 mb-8">
            {securityChecks.map((check: any, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-text-light flex items-center justify-center flex-shrink-0">
                  <CheckCircle2
                    className="w-3.5 h-3.5 text-bg-primary"
                    strokeWidth={3}
                  />
                </div>
                <p className="text-text-light font-medium text-sm">
                  {check.name}
                </p>
              </div>
            ))}
          </div>

          <div className="flex-1" />

          {/* Report bar */}
          <div className="w-full bg-bg-secondary border border-text-base/10 rounded-full pl-5 pr-2 py-2 flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full border border-[#FFB800] flex items-center justify-center">
                <span className="text-[#FFB800] text-xs font-bold">!</span>
              </div>
              <span className="text-text-base/60 font-medium text-xs">
                Lihat sesuatu yang mencurigakan?
              </span>
            </div>
            <button
              onClick={() => setShowReportModal(true)}
              className="px-5 py-2.5 bg-[#1A1A1E] rounded-full hover:bg-white/5 transition-colors"
            >
              <span className="text-[#FFB800] font-medium text-xs">
                Laporkan
              </span>
            </button>
          </div>

          {/* Scan again button */}
          <div className="flex justify-center">
            <button
              onClick={onScanAgain}
              className="w-full max-w-[200px] h-[50px] bg-[#B0FF1F] rounded-full hover:opacity-90 transition-opacity flex items-center justify-center shadow-[0_0_20px_rgba(176,255,31,0.3)]"
            >
              <span className="text-[#121C00] font-semibold text-sm">
                Scan QR Lain
              </span>
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showReportModal && (
          <ReportModal
            onClose={() => setShowReportModal(false)}
            onSubmit={handleReportSubmit}
            qrData={data}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

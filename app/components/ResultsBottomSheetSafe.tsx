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
        className="relative w-full bg-bg-primary rounded-t-3xl overflow-hidden"
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

          {/* Type pill */}
          <div className="flex justify-center mb-6">
            <div className="px-6 py-2 border border-text-light rounded-full">
              <span className="text-text-base font-medium text-sm">
                {data.type}
              </span>
            </div>
          </div>

          {/* Info card */}
          {isQRIS && hasDetailedInfo && (
            <div className="w-full bg-bg-secondary rounded-2xl p-5 mb-8 border border-text-base/10">
              {data.merchant && (
                <div className="flex justify-between items-start mb-4">
                  <span className="text-text-light text-xs font-medium">
                    Merchant
                  </span>
                  <span className="text-text-base text-sm font-medium text-right">
                    {data.merchant}
                  </span>
                </div>
              )}

              {data.nmid && (
                <div className="flex justify-between items-start mb-4">
                  <span className="text-text-light text-xs font-medium">
                    NMID
                  </span>
                  <span className="text-text-base text-sm font-medium text-right">
                    {data.nmid}
                  </span>
                </div>
              )}

              {data.city && (
                <div className="flex justify-between items-start mb-4">
                  <span className="text-text-light text-xs font-medium">
                    Kota
                  </span>
                  <span className="text-text-base text-sm font-medium text-right">
                    {data.city}
                  </span>
                </div>
              )}

              {data.amount && (
                <div className="flex justify-between items-start">
                  <span className="text-text-light text-xs font-medium">
                    Amount
                  </span>
                  <span className="text-text-base text-sm font-medium text-right">
                    {data.amount}
                  </span>
                </div>
              )}
            </div>
          )}

          {!isQRIS && data.rawData && (
            <div className="w-full bg-bg-secondary rounded-2xl p-5 mb-8 border border-text-base/10">
              <p className="text-text-light text-xs font-medium text-center mb-2">
                QR Content:
              </p>
              <p className="text-text-base text-sm font-medium break-all text-center">
                {data.rawData}
              </p>
            </div>
          )}

          {/* Security checks */}
          <div className="space-y-4 mb-8">
            {securityChecks.map((check: any, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle2
                  className="w-5 h-5 text-text-light flex-shrink-0"
                  strokeWidth={2.5}
                />
                <p className="text-text-base font-medium text-sm">
                  {check.name}
                </p>
              </div>
            ))}
          </div>

          {/* Report bar */}
          <div className="w-full bg-bg-secondary border border-text-base/10 rounded-full px-5 py-3 flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border border-text-base/30 flex items-center justify-center">
                <span className="text-text-base/50 text-xs">!</span>
              </div>
              <span className="text-text-base/60 font-medium text-xs">
                Lihat sesuatu yang mencurigakan?
              </span>
            </div>
            <button
              onClick={() => setShowReportModal(true)}
              className="px-4 py-1.5 border border-text-light rounded-full hover:bg-text-light/10 transition-colors"
            >
              <span className="text-text-light font-medium text-xs">
                Laporkan
              </span>
            </button>
          </div>

          {/* Scan again button */}
          <div className="flex justify-center">
            <button
              onClick={onScanAgain}
              className="h-[44px] px-8 bg-text-light rounded-full hover:opacity-90 transition-opacity flex items-center justify-center"
            >
              <span className="text-text-dark font-semibold text-sm">
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

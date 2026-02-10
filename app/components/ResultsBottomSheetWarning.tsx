"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
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

export default function ResultsBottomSheetWarning({
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
      status: "warning",
      message: check,
    }));

  const fallbackChecks = [
    { name: "Format sesuaia", status: "warning", message: "Format sesuaia" },
    {
      name: "Merchant ID tidak terverifikasi",
      status: "warning",
      message: "Merchant ID tidak terverifikasi",
    },
    {
      name: "Laporan penipuan ditemukan",
      status: "warning",
      message: "Laporan penipuan ditemukan",
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
                src="/warning_icon.png"
                alt="Warning"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <h2 className="text-text-base font-medium text-xl text-center mb-8">
            QR Code Mencurigakan
          </h2>

          <div className="relative mt-6 mb-8">
            {/* Floating Type Pill */}
            <div className="absolute -top-5 left-0 right-0 flex justify-center z-10">
              <div className="px-6 py-2 bg-text-warning rounded-full shadow-lg">
                <span className="text-text-base font-medium text-sm">
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
                      <span className="text-text-warning/50 text-xs font-medium">
                        Merchant
                      </span>
                      <span className="text-text-warning text-sm font-medium text-right">
                        {data.merchant}
                      </span>
                    </div>
                  )}

                  {data.nmid && (
                    <div className="flex justify-between items-start">
                      <span className="text-text-warning/50 text-xs font-medium">
                        NMID
                      </span>
                      <span className="text-text-warning text-sm font-medium text-right">
                        {data.nmid}
                      </span>
                    </div>
                  )}

                  {data.city && (
                    <div className="flex justify-between items-start">
                      <span className="text-text-warning/50 text-xs font-medium">
                        Kota
                      </span>
                      <span className="text-text-warning text-sm font-medium text-right">
                        {data.city}
                      </span>
                    </div>
                  )}

                  {data.amount && (
                    <div className="flex justify-between items-start">
                      <span className="text-text-warning/50 text-xs font-medium">
                        Amount
                      </span>
                      <span className="text-text-warning text-sm font-medium text-right">
                        {data.amount}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-text-warning/50 text-xs font-medium mb-2">
                    QR Content:
                  </p>
                  <p className="text-text-warning text-sm font-medium break-all">
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
                <div className="w-5 h-5 rounded-full bg-text-warning/20 flex items-center justify-center flex-shrink-0">
                  <X
                    className="w-3.5 h-3.5 text-text-warning"
                    strokeWidth={3}
                  />
                </div>
                <p className="text-text-base font-medium text-sm">
                  {check.name}
                </p>
              </div>
            ))}
          </div>

          <div className="h-2" />

          {/* Warning banner */}
          <div className="w-full py-3 bg-text-warning/10 border border-text-warning rounded-2xl flex items-center justify-center px-4 mb-8">
            <p className="text-text-warning font-medium text-xs text-center leading-relaxed">
              Jangan lanjutkan transaksi
            </p>
          </div>

          <div className="flex-1" />

          {/* Action buttons */}
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onScanAgain}
              className="flex-1 h-[50px] bg-[#B0FF1F] rounded-full hover:opacity-90 transition-opacity flex items-center justify-center shadow-[0_0_20px_rgba(176,255,31,0.3)]"
            >
              <span className="text-[#121C00] font-semibold text-xs sm:text-sm">
                Scan QR Lain
              </span>
            </button>

            <button
              onClick={() => setShowReportModal(true)}
              className="flex-1 h-[50px] border border-text-warning rounded-full hover:bg-text-warning/10 transition-colors flex items-center justify-center"
            >
              <span className="text-text-warning font-medium text-xs sm:text-sm">
                Laporkan
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

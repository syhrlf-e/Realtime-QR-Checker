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
                <X
                  className="w-5 h-5 text-text-warning flex-shrink-0"
                  strokeWidth={2.5}
                />
                <p className="text-text-base font-medium text-sm">
                  {check.name}
                </p>
              </div>
            ))}
          </div>

          <div className="h-2" />

          {/* Warning banner */}
          <div className="w-full h-[41px] bg-text-warning/10 border border-text-warning rounded-full flex items-center justify-center px-4 mb-8">
            <p className="text-text-warning font-normal text-xs text-center">
              Jangan lanjutkan transaksi apapun dengan QR ini
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={onScanAgain}
              className="h-[44px] px-6 bg-text-light rounded-full hover:opacity-90 transition-opacity flex items-center justify-center"
            >
              <span className="text-text-dark font-semibold text-sm">
                Scan QR Lain
              </span>
            </button>

            <button
              onClick={() => setShowReportModal(true)}
              className="h-[44px] px-6 border border-text-warning rounded-full hover:bg-text-warning/10 transition-colors flex items-center justify-center"
            >
              <span className="text-text-warning font-medium text-sm">
                Laporkan penipuan
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

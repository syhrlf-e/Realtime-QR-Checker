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

  // Ensure minimum 3 checks
  const fallbackChecks = [
    {
      name: "Format QRIS valid",
      status: "warning",
      message: "Format QRIS valid",
    },
    {
      name: "Format QRIS valid",
      status: "warning",
      message: "Format QRIS valid",
    },
    {
      name: "Format QRIS valid",
      status: "warning",
      message: "Format QRIS valid",
    },
  ];

  const securityChecks =
    baseChecks.length >= 3
      ? baseChecks.slice(0, 3)
      : [...baseChecks, ...fallbackChecks].slice(0, 3);

  const handleReportSubmit = (reportData: any) => {
    console.log("Report submitted:", reportData);
    // TODO: Send to Supabase
    alert("Laporan berhasil dikirim! Terima kasih atas kontribusinya.");
    setShowReportModal(false);
    onClose();
  };

  // Prevent body scroll when bottom sheet is open
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
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative w-full bg-white rounded-t-3xl overflow-hidden"
        style={{ height: "764px" }}
      >
        <div className="px-5 pt-9 h-full overflow-y-auto">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>

          <div className="h-4" />

          <div className="w-full h-[1px] bg-text/50" />

          <div className="h-8" />

          <div className="flex flex-col items-center">
            <div className="relative w-[49px] h-[49px]">
              <Image
                src="/warning.png"
                alt="Warning"
                fill
                className="object-contain"
              />
            </div>

            <div className="h-3" />

            <h2 className="text-text font-medium text-xl">
              QR Code Mencurigakan
            </h2>
          </div>

          <div className="h-9" />

          <div className="w-[350px] bg-[#F8F8F8] rounded-2xl shadow-md p-6 border border-gray-300">
            <h3 className="text-text font-medium text-base text-center">
              {isQRIS ? data.type : "Teks Biasa"}
            </h3>

            <div className="h-8" />

            {isQRIS && hasDetailedInfo && (
              <>
                {data.merchant && (
                  <>
                    <p className="text-text/50 font-medium text-xs">Merchant</p>
                    <div className="h-2" />
                    <p className="text-text font-medium text-base">
                      {data.merchant}
                    </p>
                    <div className="h-[22px]" />
                  </>
                )}

                {data.nmid && (
                  <>
                    <p className="text-text/50 font-medium text-xs">NMID</p>
                    <div className="h-2" />
                    <p className="text-text font-medium text-base">
                      {data.nmid}
                    </p>
                    <div className="h-[22px]" />
                  </>
                )}

                {data.city && (
                  <>
                    <p className="text-text/50 font-medium text-xs">Kota</p>
                    <div className="h-2" />
                    <p className="text-text font-medium text-base">
                      {data.city}
                    </p>
                    <div className="h-[22px]" />
                  </>
                )}

                {data.amount && (
                  <>
                    <p className="text-text/50 font-medium text-xs">Amount</p>
                    <div className="h-2" />
                    <p className="text-text font-medium text-base">
                      {data.amount}
                    </p>
                  </>
                )}
              </>
            )}

            {!isQRIS && data.rawData && (
              <>
                <p className="text-text/50 font-medium text-xs text-center">
                  Isi QR Code
                </p>
                <div className="h-2" />
                <p className="text-text font-medium text-sm break-all text-center">
                  {data.rawData}
                </p>
              </>
            )}
          </div>

          <div className="h-8" />

          <h3 className="text-text font-medium text-base">
            Kenapa terlihat mencurigakan?
          </h3>

          <div className="h-4" />

          <div className="space-y-3">
            {securityChecks.map((check: any, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <X
                  className="w-5 h-5 text-[#FF0000] flex-shrink-0"
                  strokeWidth={2.5}
                />
                <p className="text-text font-medium text-sm">{check.name}</p>
              </div>
            ))}
          </div>

          <div className="h-4" />

          <div className="w-[350px] min-h-[41px] bg-[#FFE5E5] border border-[#FF0000] rounded-[20px] flex items-center justify-center px-4 py-3">
            <p className="text-[#FF0000] font-medium text-xs text-center">
              Jangan lanjutkan transaksi apapun dengan QR ini
            </p>
          </div>

          <div className="h-10" />

          <div className="flex gap-3 justify-center">
            <button
              onClick={onScanAgain}
              className="w-[123px] h-[44px] bg-lime rounded-full hover:bg-lime/90 transition-colors"
            >
              <span className="text-text font-semibold text-sm">
                Scan QR Lain
              </span>
            </button>

            <button
              onClick={() => setShowReportModal(true)}
              className="w-[160px] h-[44px] bg-white border-2 border-[#FF0000] rounded-full hover:bg-red-50 transition-colors"
            >
              <span className="text-[#FF0000] font-semibold text-sm">
                Laporkan penipuan
              </span>
            </button>
          </div>

          <div className="h-10" />
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

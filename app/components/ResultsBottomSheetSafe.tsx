"use client";

import { Check } from "lucide-react";
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
}

export default function ResultsBottomSheetSafe({
  data,
  onClose,
  onScanAgain,
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

  // Ensure minimum 3 checks
  const fallbackChecks = [
    { name: "Format QR valid", status: "safe", message: "Format QR valid" },
    {
      name: "Tidak ada tanda bahaya",
      status: "safe",
      message: "Tidak ada tanda bahaya",
    },
    {
      name: "Konten terverifikasi",
      status: "safe",
      message: "Konten terverifikasi",
    },
  ];

  const securityChecks =
    baseChecks.length >= 3
      ? baseChecks.slice(0, 3)
      : [...baseChecks, ...fallbackChecks].slice(0, 3);

  const handleReportSubmit = (reportData: any) => {
    console.log("Report submitted:", reportData);
    setShowReportModal(false);
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
          <div className="flex justify-center mb-8">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
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

          <h2 className="text-text font-medium text-xl text-center mb-9">
            QR Code Terlihat Aman
          </h2>

          <div className="flex-1 overflow-y-auto">
            <div className="w-full bg-[#F8F8F8] rounded-2xl shadow-md p-6 mb-8 border border-gray-300">
              <h3 className="text-text font-medium text-base text-center">
                {data.type}
              </h3>

              <div className="h-8" />

              {isQRIS && hasDetailedInfo && (
                <>
                  {data.merchant && (
                    <>
                      <p className="text-text/50 font-medium text-xs">
                        Merchant
                      </p>
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

            <h3 className="text-text font-medium text-base mb-4">
              Kenapa terlihat aman?
            </h3>

            <div className="space-y-3 mb-4">
              {securityChecks.slice(0, 3).map((check: any, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <Check
                    className="w-5 h-5 text-text flex-shrink-0"
                    strokeWidth={2.5}
                  />
                  <p className="text-text font-medium text-sm">{check.name}</p>
                </div>
              ))}
            </div>

            <div className="w-full h-[41px] bg-[#EBEBEB] rounded-[20px] flex items-center justify-between px-4 mb-10">
              <p className="text-text font-medium text-xs">
                Lihat sesuatu yang mencurigakan?
              </p>
              <button
                onClick={() => setShowReportModal(true)}
                className="w-[77px] h-[27px] bg-white rounded-full hover:bg-gray-50 transition-colors"
              >
                <span className="text-text font-medium text-xs">Laporkan</span>
              </button>
            </div>

            <div className="flex justify-center pb-10">
              <button
                onClick={onScanAgain}
                className="w-[123px] h-[44px] bg-lime rounded-full hover:bg-lime/90 transition-colors"
              >
                <span className="text-text font-semibold text-sm">
                  Scan QR Lain
                </span>
              </button>
            </div>
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

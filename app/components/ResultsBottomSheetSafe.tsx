"use client";

import { Check } from "lucide-react";
import Image from "next/image";

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
  const isQRIS = data.type === "QRIS Payment";
  const hasDetailedInfo =
    data.merchant || data.nmid || data.city || data.amount;
  const securityChecks =
    data.securityAnalysis?.checks ||
    data.checks.map((check) => ({
      name: check,
      status: "safe",
      message: check,
    }));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-fadeIn">
      <div
        className="w-full max-w-[390px] bg-white rounded-t-3xl overflow-y-auto animate-slideUp"
        style={{ maxHeight: "90vh" }}
      >
        <div className="px-5 pt-9">
          {/* Handle bar */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>

          <div className="h-4" />

          <div className="w-full h-[1px] bg-text/50" />

          <div className="h-8" />

          {/* Status Icon & Title */}
          <div className="flex flex-col items-center">
            <div className="relative w-[49px] h-[49px]">
              <Image
                src="/safe_bg.png"
                alt="Safe"
                fill
                className="object-contain"
              />
            </div>

            <div className="h-3" />

            <h2 className="text-text font-medium text-xl">
              QR Code Terlihat Aman
            </h2>
          </div>

          <div className="h-9" />

          {/* Info Card - Show for QRIS or Plain Text */}
          <div className="w-[350px] bg-[#F8F8F8] rounded-2xl shadow-md p-6">
            <h3 className="text-text font-medium text-base">{data.type}</h3>

            <div className="h-8" />

            {/* QRIS Details */}
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

            {/* Non-QRIS: Show raw content */}
            {!isQRIS && data.rawData && (
              <>
                <p className="text-text/50 font-medium text-xs">Isi QR Code</p>
                <div className="h-2" />
                <p className="text-text font-medium text-sm break-all">
                  {data.rawData}
                </p>
              </>
            )}
          </div>

          <div className="h-8" />

          {/* Security Checks */}
          <h3 className="text-text font-medium text-base">
            Kenapa terlihat aman?
          </h3>

          <div className="h-4" />

          <div className="space-y-3">
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

          <div className="h-4" />

          {/* Report Prompt */}
          <div className="w-[350px] h-[41px] bg-[#EBEBEB] rounded-[20px] flex items-center justify-between px-4">
            <p className="text-text font-medium text-xs">
              Lihat sesuatu yang mencurigakan?
            </p>
            <button className="w-[77px] h-[27px] bg-white rounded-full hover:bg-gray-50 transition-colors">
              <span className="text-text font-medium text-xs">Laporkan</span>
            </button>
          </div>

          <div className="h-10" />

          {/* Action Button */}
          <div className="flex justify-center">
            <button
              onClick={onScanAgain}
              className="w-[123px] h-[44px] bg-lime rounded-full hover:bg-lime/90 transition-colors"
            >
              <span className="text-text font-semibold text-sm">
                Scan QR Lain
              </span>
            </button>
          </div>

          <div className="h-10" />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
    </div>
  );
}

"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useQRScanner } from "@/app/hooks/useQRScanner";
import { decodeQR, QRType } from "@/app/lib/qr-decoder";
import { analyzeURL } from "@/app/lib/url-analyzer";
import { analyzeQRIS } from "@/app/lib/qris-analyzer";
import ResultsBottomSheetSafe from "@/app/components/ResultsBottomSheetSafe";
import ResultsBottomSheetWarning from "@/app/components/ResultsBottomSheetWarning";

export default function CameraScannerPage() {
  const router = useRouter();
  const [showResults, setShowResults] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleQRDetected = (data: string) => {
    const decoded = decodeQR(data);

    let securityAnalysis;
    if (decoded.type === QRType.URL) {
      securityAnalysis = analyzeURL(decoded.parsedData.url);
    } else if (decoded.type === QRType.QRIS) {
      securityAnalysis = analyzeQRIS(decoded.parsedData);
    } else {
      securityAnalysis = {
        overallStatus: "safe",
        checks: [
          {
            name: "QR Code terdeteksi",
            status: "safe",
            message: `Tipe: ${decoded.type}`,
          },
        ],
      };
    }

    const result = {
      type: decoded.type === QRType.QRIS ? "QRIS Payment" : decoded.type,
      merchant: decoded.parsedData.merchantName,
      nmid: decoded.parsedData.nmid || decoded.parsedData.merchantId,
      city: decoded.parsedData.merchantCity,
      amount: decoded.parsedData.transactionAmount
        ? `Rp ${parseFloat(decoded.parsedData.transactionAmount).toLocaleString("id-ID")}`
        : undefined,
      checks: securityAnalysis.checks.map((check: any) => check.name),
      rawData: decoded.rawData,
      securityAnalysis,
    };

    setAnalysisResult(result);
    setShowResults(true);
  };

  const { videoRef, startScanning, stopScanning, resetLastScan } = useQRScanner(
    {
      onScan: handleQRDetected,
      onError: () => {
        toast.error(
          "Kamera tidak dapat diakses\nBerikan izin kamera di pengaturan browser Anda",
        );
      },
    },
  );

  useEffect(() => {
    startScanning();
    return () => {
      stopScanning();
    };
  }, [startScanning, stopScanning]);

  return (
    <main className="h-screen bg-bg-primary overflow-hidden">
      <div className="mx-auto max-w-md w-full px-5 py-5 h-full">
        <div className="h-full flex flex-col">
          <div className="w-full max-w-[350px] mx-auto h-[55px] bg-bg-header rounded-full flex items-center justify-center">
            <h1 className="text-text-dark font-medium text-xl">
              Realtime QR Checker
            </h1>
          </div>

          <div className="h-6" />

          <p className="text-text-base text-sm font-normal text-center">
            &ldquo;Jangan asal scan QR Code, cek dulu
            <br />
            <span className="bg-bg-header text-text-dark px-1">
              keamanannya
            </span>{" "}
            disini&rdquo;
          </p>

          <div className="h-6" />

          <div className="relative w-full max-w-[350px] mx-auto">
            <div className="relative h-[339px] bg-bg-secondary rounded-3xl overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[180px] h-[180px]">
                  <div className="absolute top-0 left-0 w-10 h-10 border-t-[3px] border-l-[3px] border-text-light rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-10 h-10 border-t-[3px] border-r-[3px] border-text-light rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-10 h-10 border-b-[3px] border-l-[3px] border-text-light rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-10 h-10 border-b-[3px] border-r-[3px] border-text-light rounded-br-xl" />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 left-0 right-0 flex justify-center">
              <div
                className="flex items-center justify-center rounded-[50px]"
                style={{
                  width: "204px",
                  height: "40px",
                  backgroundColor: "#B0FF1F",
                }}
              >
                <p
                  className="font-medium text-[14px]"
                  style={{ color: "#121C00" }}
                >
                  Mencari QR Code
                  <span className="inline-block animate-pulse">.</span>
                  <span
                    className="inline-block animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  >
                    .
                  </span>
                  <span
                    className="inline-block animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  >
                    .
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1" />

          <div className="flex w-full max-w-[350px] mx-auto pb-6">
            <button
              onClick={() => {
                stopScanning();
                router.push("/");
              }}
              className="flex items-center hover:opacity-90 transition-opacity"
            >
              <div
                className="w-[45px] h-[45px] rounded-l-full flex items-center justify-center"
                style={{ backgroundColor: "#15151A" }}
              >
                <ArrowLeft className="w-5 h-5" style={{ color: "#B0FF1F" }} />
              </div>
              <div
                className="h-[45px] px-4 rounded-r-full flex items-center justify-center"
                style={{ backgroundColor: "#15151A" }}
              >
                <span
                  className="font-medium text-sm"
                  style={{ color: "#B0FF1F" }}
                >
                  Kembali
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showResults && analysisResult && (
          <>
            {analysisResult.securityAnalysis?.overallStatus === "safe" ? (
              <ResultsBottomSheetSafe
                data={analysisResult}
                onClose={() => {
                  setShowResults(false);
                  resetLastScan();
                }}
                onScanAgain={() => {
                  setShowResults(false);
                  setAnalysisResult(null);
                  resetLastScan();
                }}
              />
            ) : (
              <ResultsBottomSheetWarning
                data={analysisResult}
                onClose={() => {
                  setShowResults(false);
                  resetLastScan();
                }}
                onScanAgain={() => {
                  setShowResults(false);
                  setAnalysisResult(null);
                  resetLastScan();
                }}
              />
            )}
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

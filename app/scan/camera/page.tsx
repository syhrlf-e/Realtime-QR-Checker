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
  const [isCameraReady, setIsCameraReady] = useState(false);

  const handleQRDetected = (data: string) => {
    const decoded = decodeQR(data);

    // Debug logging
    console.log("🔍 QR Detected:", data);
    console.log("📦 Decoded Type:", decoded.type);
    console.log("📄 Parsed Data:", decoded.parsedData);

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

    console.log("✅ Result to display:", result);

    setAnalysisResult(result);
    setShowResults(true);
  };

  const { videoRef, startScanning, stopScanning, resetLastScan } = useQRScanner(
    {
      onScan: handleQRDetected,
      onError: (error) => {
        console.error("QR Scanner error:", error);
        toast.error(
          "Kamera tidak dapat diakses\nBerikan izin kamera di pengaturan browser Anda",
        );
      },
    },
  );

  useEffect(() => {
    startScanning().then(() => {
      setIsCameraReady(true);
    });

    return () => {
      stopScanning();
    };
  }, [startScanning, stopScanning]);

  return (
    <main className="h-screen bg-white overflow-hidden">
      <div className="mx-auto max-w-md w-full px-5 py-5 h-full">
        <div className="space-y-9 h-full flex flex-col">
          <div className="w-full max-w-[350px] mx-auto h-[55px] bg-lime rounded-full flex items-center justify-center">
            <h1 className="text-text font-medium text-xl">
              Realtime QR Checker
            </h1>
          </div>

          <p className="text-text text-sm font-normal text-center">
            Jangan asal scan QR Code, cek dulu
            <br />
            <span className="bg-lime px-1">keamanannya</span> disini
          </p>

          <div className="relative w-full max-w-[350px] mx-auto h-[339px] bg-gray-900 rounded-3xl overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[179px] h-[179px]">
                <div className="absolute inset-0 border-2 border-lime rounded-2xl" />

                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-lime rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-lime rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-lime rounded-bl-2xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-lime rounded-br-2xl" />
              </div>
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <div className="bg-lime/90 px-4 py-2 rounded-full">
                <p className="text-text text-xs font-medium">
                  Mencari QR Code...
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center w-full max-w-[350px] mx-auto">
            <button
              onClick={() => {
                stopScanning();
                router.push("/");
              }}
              className="w-[45px] h-[45px] bg-lime rounded-full flex items-center justify-center hover:bg-lime/90 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-text" />
            </button>

            <button
              onClick={() => {
                stopScanning();
                router.push("/");
              }}
              className="w-[123px] h-[44px] bg-lime rounded-full flex items-center justify-center hover:bg-lime/90 transition-colors"
            >
              <span className="text-text font-semibold text-sm">Kembali</span>
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


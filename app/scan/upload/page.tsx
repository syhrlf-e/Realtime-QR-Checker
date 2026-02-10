"use client";

import { ArrowLeft, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import jsQR from "jsqr";
import toast from "react-hot-toast";
import { decodeQR, QRType } from "@/app/lib/qr-decoder";
import { analyzeURL } from "@/app/lib/url-analyzer";
import { analyzeQRIS } from "@/app/lib/qris-analyzer";
import ResultsBottomSheetSafe from "@/app/components/ResultsBottomSheetSafe";
import ResultsBottomSheetWarning from "@/app/components/ResultsBottomSheetWarning";
import { AnimatePresence, motion } from "framer-motion";

export default function UploadScannerPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // ... (keep existing handlers: handleDragOver, handleDragLeave, handleDrop, handleFileSelect, handleClick, handleFileInputChange)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = async (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!validTypes.includes(file.type)) {
      toast.error("Format tidak didukung\nGunakan file JPG atau PNG");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "File terlalu besar (maks 5MB)\nKompres gambar atau gunakan gambar lain",
      );
      return;
    }

    setIsProcessing(true);
    const startTime = Date.now();

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);

        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (!imageData) {
          setIsProcessing(false);
          toast.error("Gagal memproses gambar");
          return;
        }

        const code = jsQR(imageData.data, canvas.width, canvas.height);
        const elapsed = Date.now() - startTime;
        const remainingDelay = Math.max(0, 100 - elapsed);
        await new Promise((resolve) => setTimeout(resolve, remainingDelay));

        if (!code) {
          setIsProcessing(false);
          toast.error(
            "Tidak ada QR Code terdeteksi\nCoba foto yang lebih jelas",
          );
          return;
        }

        const decoded = decodeQR(code.data);
        let securityAnalysis: any = { overallStatus: "safe", checks: [] };

        if (decoded.type === QRType.URL && decoded.parsedData.url) {
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
        setIsProcessing(false);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

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

          <div className="h-8" />

          <div className="relative w-full max-w-[350px] mx-auto mb-5">
            <div
              onClick={isProcessing ? undefined : handleClick}
              onDragOver={isProcessing ? undefined : handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={isProcessing ? undefined : handleDrop}
              className={`w-full h-[200px] bg-bg-secondary border-2 border-text-light rounded-[32px] flex flex-col items-center justify-center gap-4 transition-colors relative ${
                isProcessing
                  ? "cursor-wait"
                  : isDragging
                    ? "bg-text-light/5 cursor-pointer"
                    : "hover:bg-text-light/5 cursor-pointer"
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-text-light border-t-transparent" />
                  <p className="text-text-base/50 text-sm font-medium">
                    Memproses gambar...
                  </p>
                </>
              ) : (
                <>
                  <ImageIcon className="w-10 h-10 text-text-base/30" />
                  <p className="text-text-base/30 text-sm font-medium text-center px-8">
                    Drag & Drop atau Klik
                    <br />
                    untuk upload foto QR
                  </p>
                </>
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <div className="h-4" />

          <p className="text-text-light text-xs font-medium text-center">
            *Format yang didukung : JPG, PNG (Max 5MB)
          </p>

          <div className="flex-1" />

          <div className="flex w-full max-w-[350px] mx-auto pb-16">
            <button
              onClick={() => router.push("/")}
              className="flex items-center hover:opacity-90 transition-opacity group"
            >
              <div className="w-[45px] h-[45px] rounded-full bg-[#15151A] flex items-center justify-center relative z-10">
                <ArrowLeft className="w-[18px] h-[18px] text-[#B0FF1F]" />
              </div>

              <div className="w-[96px] h-[44px] bg-[#15151A] rounded-full flex items-center justify-center -ml-3">
                <span className="font-medium text-[14px] text-[#B0FF1F]">
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
                onClose={() => setShowResults(false)}
                onScanAgain={() => {
                  setShowResults(false);
                  setAnalysisResult(null);
                }}
              />
            ) : (
              <ResultsBottomSheetWarning
                data={analysisResult}
                onClose={() => setShowResults(false)}
                onScanAgain={() => {
                  setShowResults(false);
                  setAnalysisResult(null);
                }}
              />
            )}
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

"use client";

import { ArrowLeft, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import jsQR from "jsqr";
import { decodeQR, QRType } from "@/app/lib/qr-decoder";
import { analyzeURL } from "@/app/lib/url-analyzer";
import { analyzeQRIS } from "@/app/lib/qris-analyzer";
import ResultsBottomSheetSafe from "@/app/components/ResultsBottomSheetSafe";

export default function UploadScannerPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

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

  const processQRImage = async (file: File) => {
    return new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            resolve(null);
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code && code.data) {
            resolve(code.data);
          } else {
            resolve(null);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (file: File) => {
    if (file.type === "image/jpeg" || file.type === "image/png") {
      if (file.size <= 5 * 1024 * 1024) {
        setSelectedFile(file);

        const qrData = await processQRImage(file);

        if (qrData) {
          const decoded = decodeQR(qrData);

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
        } else {
          alert("Tidak ada QR Code terdeteksi di gambar ini");
        }
      } else {
        alert("File terlalu besar. Maksimal 5MB");
      }
    } else {
      alert("Format file tidak didukung. Gunakan JPG atau PNG");
    }
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
    <main className="h-screen bg-white overflow-hidden">
      <div className="mx-auto max-w-[390px] px-5 h-full">
        <div className="pt-safe-top space-y-9 h-full flex flex-col">
          <div className="w-[350px] h-[55px] bg-lime rounded-full flex items-center justify-center">
            <h1 className="text-text font-medium text-xl">
              Realtime QR Checker
            </h1>
          </div>

          <p className="text-text text-sm font-normal text-center">
            Jangan asal scan QR Code, cek dulu
            <br />
            <span className="bg-lime px-1">keamanannya</span> disini
          </p>

          <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`w-[350px] h-[170px] border-2 border-lime rounded-[47px] flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
              isDragging ? "bg-lime/10" : "hover:bg-lime/5"
            }`}
          >
            <Upload className="w-10 h-10 text-text/30" />
            <p className="text-text/30 text-sm font-semibold text-center px-8">
              {selectedFile
                ? selectedFile.name
                : "Drag & Drop atau Klik untuk upload foto QR"}
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileInputChange}
            className="hidden"
          />

          <p className="text-text text-xs font-medium text-center">
            *Format yang didukung : JPG, PNG (Max 5MB)
          </p>

          <div className="flex items-center w-[350px] pt-[65px]">
            <button
              onClick={() => router.push("/")}
              className="w-[45px] h-[45px] bg-lime rounded-full flex items-center justify-center hover:bg-lime/90 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-text" />
            </button>

            <button
              onClick={() => router.push("/")}
              className="w-[123px] h-[44px] bg-lime rounded-full flex items-center justify-center hover:bg-lime/90 transition-colors"
            >
              <span className="text-text font-semibold text-sm">Kembali</span>
            </button>
          </div>
        </div>
      </div>

      {showResults && analysisResult && (
        <ResultsBottomSheetSafe
          data={analysisResult}
          onClose={() => setShowResults(false)}
          onScanAgain={() => {
            setShowResults(false);
            setAnalysisResult(null);
            setSelectedFile(null);
          }}
        />
      )}
    </main>
  );
}

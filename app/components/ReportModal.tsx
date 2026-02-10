"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

interface ReportModalProps {
  onClose: () => void;
  onSubmit: (data: ReportData) => void;
  qrData?: any;
}

interface ReportData {
  category: string;
  detail: string;
  location?: string;
}

const CATEGORIES = [
  "QRIS Palsu",
  "Stiker ditempel",
  "Merchant Palsu",
  "Phishing Link",
  "Lainnya",
];

export default function ReportModal({
  onClose,
  onSubmit,
  qrData,
}: ReportModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [detail, setDetail] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!selectedCategory || !detail.trim()) {
      toast.error("Mohon pilih kategori dan isi detail laporan");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qr_type: qrData?.type || "Unknown",
          qr_data: qrData?.rawData || "",
          category: selectedCategory,
          details: detail.trim(),
          location: location.trim() || null,
          security_status: qrData?.securityAnalysis?.overallStatus || null,
          security_checks: qrData?.securityAnalysis?.checks || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit report");
      }

      setShowSuccess(true);

      setTimeout(() => {
        onSubmit({
          category: selectedCategory,
          detail: detail.trim(),
          location: location.trim() || undefined,
        });
        onClose();
      }, 2500);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Gagal mengirim laporan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-bg-primary">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", damping: 20 }}
          className="flex flex-col items-center text-center px-8"
        >
          <div className="relative w-[80px] h-[80px] mb-6">
            <Image
              src="/cheekmark.png"
              alt="Success"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-text-light font-semibold text-2xl mb-4">
            Laporan Terkirim
          </h2>
          <p className="text-text-base/60 font-medium text-sm leading-relaxed max-w-[280px]">
            Terimakasih sudah melaporkan kepada kami, laporan yang anda kirim
            sangat berarti untuk pengguna lainnya.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
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

          <h2 className="text-text-light font-medium text-xl text-center mb-10">
            Laporkan QR Penipuan
          </h2>

          <div className="mb-8">
            <label className="text-text-base font-medium text-sm block mb-4">
              Kategori Penipuan:
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                    selectedCategory === category
                      ? "bg-text-light text-text-dark border-text-light"
                      : "bg-bg-secondary text-text-base border-text-base/10 hover:border-text-base/30"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="text-text-base font-medium text-sm block mb-4">
              Detail Laporan:
            </label>
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Ceritakan dengan detail..."
              className="w-full h-[140px] bg-bg-secondary border border-text-base/10 rounded-2xl p-4 text-text-base text-sm font-medium placeholder:text-text-base/30 resize-none outline-none focus:border-text-light/50 transition-colors"
            />
          </div>

          <div className="mb-10">
            <label className="text-text-base font-medium text-sm block mb-4">
              Lokasi kejadian (opsional)
            </label>
            <div className="inline-block">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Tambahkan lokasi"
                className="h-[40px] bg-bg-secondary border border-text-base/10 rounded-full px-5 text-text-base text-sm font-medium placeholder:text-text-base/30 outline-none focus:border-text-light/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`h-[44px] px-8 rounded-full transition-colors ${
                isSubmitting
                  ? "bg-text-base/20 text-text-base/50 cursor-not-allowed"
                  : "bg-text-light text-text-dark hover:opacity-90"
              }`}
            >
              <span className="font-semibold text-sm">
                {isSubmitting ? "Mengirim..." : "Kirim Laporan"}
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

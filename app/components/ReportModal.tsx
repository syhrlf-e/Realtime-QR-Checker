"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
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

      toast.success("Laporan berhasil dikirim!");
      onSubmit({
        category: selectedCategory,
        detail: detail.trim(),
        location: location.trim() || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Gagal mengirim laporan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent body scroll when modal is open
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

          <h2 className="text-text font-medium text-xl text-center mb-9">
            Laporkan QR Penipuan
          </h2>

          <div className="mb-8">
            <label className="text-text font-medium text-base block mb-4">
              Kategori Penipuan:
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-lime text-text"
                      : "bg-[#F5F5F5] text-text hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <label className="text-text font-medium text-base block mb-4">
              Detail Laporan:
            </label>
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Ceritakan dengan detail..."
              className="w-full h-[160px] bg-[#F5F5F5] rounded-2xl p-4 text-text text-sm font-medium placeholder:text-text/50 resize-none outline-none focus:ring-2 focus:ring-lime"
            />
          </div>

          <div className="mb-10">
            <label className="text-text font-medium text-base block mb-4">
              Lokasi kejadian (opsional)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Tambahkan lokasi"
              className="w-full h-[50px] bg-[#F5F5F5] rounded-full px-6 text-text text-sm font-medium placeholder:text-text/50 outline-none focus:ring-2 focus:ring-lime"
            />
          </div>

          <div className="flex justify-center pb-10">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-[160px] h-[44px] rounded-full transition-colors ${
                isSubmitting
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-lime text-text hover:bg-lime/90"
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

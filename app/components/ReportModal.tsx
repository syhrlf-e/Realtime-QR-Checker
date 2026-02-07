"use client";

import { motion } from "framer-motion";
import { useState } from "react";

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

  const handleSubmit = () => {
    if (!selectedCategory || !detail.trim()) {
      alert("Mohon pilih kategori dan isi detail laporan");
      return;
    }

    onSubmit({
      category: selectedCategory,
      detail: detail.trim(),
      location: location.trim() || undefined,
    });
  };

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
        style={{ height: "calc(100vh - 36px)" }}
      >
        <div className="px-5 pt-9 h-full overflow-y-auto">
          {/* Handle bar */}
          <div className="flex justify-center mb-8">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Title */}
          <h2 className="text-text font-medium text-xl text-center mb-9">
            Laporkan QR Penipuan
          </h2>

          {/* Category Selection */}
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

          {/* Detail Textarea */}
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

          {/* Location (Optional) */}
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

          {/* Submit Button */}
          <div className="flex justify-center pb-10">
            <button
              onClick={handleSubmit}
              className="w-[160px] h-[44px] bg-lime rounded-full hover:bg-lime/90 transition-colors"
            >
              <span className="text-text font-semibold text-sm">
                Kirim Laporan
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

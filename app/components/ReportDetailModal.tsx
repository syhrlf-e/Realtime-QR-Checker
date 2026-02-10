"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface Report {
  id: string;
  created_at: string;
  qr_type: string;
  qr_data: string;
  category: string;
  details: string | null;
  location: string | null;
  security_status: string | null;
  security_checks: any;
  count?: number;
}

interface ReportDetailModalProps {
  report: Report;
  onClose: () => void;
}

export default function ReportDetailModal({
  report,
  onClose,
}: ReportDetailModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const isURL = report.qr_type === "URL" || report.qr_data?.startsWith("http");
  const reportCount = report.count || 1;

  function extractDomain(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  }

  function getProtocol(url: string): string {
    try {
      const protocol = new URL(url).protocol.replace(":", "").toUpperCase();
      const isSecure = protocol === "HTTPS";
      return `${protocol} (${isSecure ? "Aman" : "Tidak Aman!"})`;
    } catch {
      return "Unknown";
    }
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffHours < 1) return "Baru saja";
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays === 1) return "1 hari lalu";
    return `${diffDays} hari lalu`;
  }

  const dangerReasons: string[] = [];
  if (isURL) {
    const domain = extractDomain(report.qr_data);
    if (
      domain.includes("tokopedi") ||
      domain.includes("gopay") ||
      domain.includes("shoppe")
    ) {
      dangerReasons.push(`Domain mirip dengan ${domain.split(".")[0]}.com`);
    }
    if (report.qr_data?.startsWith("http://")) {
      dangerReasons.push("Tidak menggunakan HTTPS");
    }
    dangerReasons.push(
      `Dilaporkan ${reportCount}× sebagai ${report.category.toLowerCase()}`,
    );
  } else {
    if (report.security_checks && Array.isArray(report.security_checks)) {
      report.security_checks.forEach((check: any) => {
        if (check.status === "warning" || check.status === "danger") {
          dangerReasons.push(check.message || check.name);
        }
      });
    }
    if (dangerReasons.length === 0) {
      dangerReasons.push(
        `Dilaporkan ${reportCount}× sebagai ${report.category}`,
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
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

          {/* Badge */}
          <div className="flex justify-center mb-3">
            <div className="relative w-[49px] h-[49px]">
              <Image
                src="/cheekmark.png"
                alt="Verified"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <h2 className="text-text-base font-semibold text-xl text-center mb-1">
            Terverifikasi Penipuan
          </h2>
          <p className="text-text-light font-medium text-sm text-center mb-8">
            Kategori : {report.category}
          </p>

          {/* QR Content card */}
          <div className="w-full bg-text-warning/10 border border-text-warning/30 rounded-2xl p-4 mb-4">
            <p className="text-text-base/50 text-xs font-medium text-center mb-1">
              QR Content :
            </p>
            <p className="text-text-base font-semibold text-sm break-all text-center">
              {report.qr_data}
            </p>
          </div>

          {/* Info block */}
          {isURL && (
            <div className="w-full bg-bg-secondary rounded-2xl p-4 mb-6 border border-text-base/10">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-base/60 text-sm">Tipe</span>
                  <span className="text-text-base text-sm">
                    {report.qr_type || "URL"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-base/60 text-sm">Domain</span>
                  <span className="text-text-base text-sm">
                    {extractDomain(report.qr_data)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-base/60 text-sm">Protokol</span>
                  <span className="text-text-base text-sm">
                    {getProtocol(report.qr_data)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Statistik */}
          <div className="mb-6">
            <h3 className="text-text-base font-semibold text-base mb-3">
              Statistik Laporan:
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-text-base/50 mt-0.5 flex-shrink-0" />
                <span className="text-text-base text-sm">
                  Total laporan: {reportCount}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-text-base/50 mt-0.5 flex-shrink-0" />
                <span className="text-text-base text-sm">
                  Pertama kali dilaporkan: {formatDate(report.created_at)}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-text-base/50 mt-0.5 flex-shrink-0" />
                <span className="text-text-base text-sm">
                  Terakhir dilaporkan: {formatRelativeTime(report.created_at)}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-text-base/50 mt-0.5 flex-shrink-0" />
                <span className="text-text-base text-sm">
                  Status:{" "}
                  <span className="font-semibold">Terverifikasi Penipuan</span>
                </span>
              </div>
            </div>
          </div>

          {/* Alasan bahaya */}
          <div className="mb-6">
            <h3 className="text-text-base font-semibold text-base mb-3">
              Kenapa Berbahaya:
            </h3>
            <div className="space-y-2">
              {dangerReasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-text-base/50 mt-0.5 flex-shrink-0" />
                  <span className="text-text-base text-sm">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lokasi */}
          <div className="mb-8">
            <h3 className="text-text-base font-semibold text-base mb-3">
              Lokasi Laporan:
            </h3>
            <div className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-text-base/50 mt-0.5 flex-shrink-0" />
              <span className="text-text-base text-sm">
                {report.location || "Tidak dibagikan"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={onClose}
              className="h-[44px] px-6 text-text-light font-medium text-sm hover:opacity-80 transition-opacity"
            >
              Tutup
            </button>
            <button className="h-[44px] px-6 border border-text-warning rounded-full hover:bg-text-warning/10 transition-colors">
              <span className="text-text-warning font-medium text-sm">
                Bagikan Peringatan
              </span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

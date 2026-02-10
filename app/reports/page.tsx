"use client";

import {
  Search,
  SlidersHorizontal,
  Check,
  ChevronDown,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import ReportDetailModal from "@/app/components/ReportDetailModal";

const FILTER_OPTIONS = [
  "Semua",
  "Phishing Link",
  "QRIS Palsu",
  "Stiker ditempel",
  "Merchant Palsu",
  "Lainnya",
];

const SORT_OPTIONS = ["Terbaru", "Terbanyak"];

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

export default function ReportsPage() {
  const [showFilterSort, setShowFilterSort] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Semua");
  const [selectedSort, setSelectedSort] = useState("Terbaru");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    fetchReports();
  }, [selectedFilter]);

  async function fetchReports() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedFilter !== "Semua") {
        params.append("category", selectedFilter);
      }

      const response = await fetch(`/api/reports?${params}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch reports");
      }

      setReports(result.data || []);
      setTotalCount(result.data?.length || 0);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Gagal memuat laporan\nPeriksa koneksi internet Anda");
      setReports([]);
    } finally {
      setLoading(false);
    }
  }

  const aggregatedReports = reports.reduce(
    (acc: Record<string, Report>, report) => {
      const key = report.qr_data;
      if (!acc[key]) {
        acc[key] = { ...report, count: 0 };
      }
      acc[key].count = (acc[key].count || 0) + 1;
      if (new Date(report.created_at) > new Date(acc[key].created_at)) {
        acc[key] = { ...report, count: acc[key].count };
      }
      return acc;
    },
    {},
  );

  let reportsList = Object.values(aggregatedReports);

  reportsList = reportsList.sort((a, b) => {
    if (selectedSort === "Terbanyak") {
      return (b.count || 0) - (a.count || 0);
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const filteredReports = reportsList.filter((report) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      report.qr_data?.toLowerCase().includes(query) ||
      report.category?.toLowerCase().includes(query) ||
      report.details?.toLowerCase().includes(query)
    );
  });

  function formatRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays === 1) return "1 hari lalu";
    return `${diffDays} hari lalu`;
  }

  return (
    <main className="min-h-screen bg-bg-primary overflow-hidden h-screen">
      <div className="mx-auto max-w-md w-full px-5 py-5 h-full flex flex-col">
        <div className="mb-6">
          <div className="w-full max-w-[350px] mx-auto h-[55px] bg-bg-header rounded-full flex items-center justify-center">
            <h1 className="text-text-dark font-medium text-xl">
              Realtime QR Checker
            </h1>
          </div>

          <div className="h-8" />

          <div className="relative">
            <Link
              href="/"
              className="absolute left-0 top-1 w-8 h-8 flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <ChevronLeft className="w-6 h-6 text-text-light" />
            </Link>

            <div className="text-center">
              <h2 className="text-text-base font-semibold text-xl">
                Laporan QR Penipuan
              </h2>
              <div className="h-1" />
              <p className="text-text-base/50 font-medium text-xs">
                Temukan hal mencurigakan
              </p>
            </div>
          </div>

          <div className="h-6" />

          <div className="relative w-full max-w-[350px] mx-auto h-[50px]">
            <div className="absolute inset-0 bg-bg-secondary border border-text-base/10 rounded-full flex items-center pl-4 pr-[6px]">
              <Search className="w-5 h-5 text-text-base/30 flex-shrink-0" />
              <input
                type="text"
                placeholder="Cari URL, merchant, atau NMID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 mx-3 text-text-base font-medium text-sm placeholder:text-text-base/30 bg-transparent outline-none"
              />
              <button
                onClick={() => setShowFilterSort(!showFilterSort)}
                className="w-[37px] h-[37px] bg-text-light rounded-full flex items-center justify-center hover:opacity-90 transition-opacity flex-shrink-0"
              >
                <SlidersHorizontal className="w-5 h-5 text-text-dark" />
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {showFilterSort && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="h-3" />
                <div className="flex gap-3 w-full max-w-[350px] mx-auto">
                  <div className="relative flex-1 min-w-0">
                    <button
                      onClick={() => {
                        setShowFilterDropdown(!showFilterDropdown);
                        setShowSortDropdown(false);
                      }}
                      className="h-10 bg-bg-secondary border border-text-base/10 rounded-full px-4 flex items-center gap-2 hover:bg-bg-secondary/80 transition-colors w-full"
                    >
                      <span className="text-text-base font-medium text-sm truncate">
                        Filter: {selectedFilter}
                      </span>
                      <ChevronDown className="w-4 h-4 text-text-base flex-shrink-0" />
                    </button>

                    <AnimatePresence>
                      {showFilterDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-12 left-0 right-0 bg-bg-secondary rounded-2xl shadow-lg border border-text-base/10 py-2 z-10"
                        >
                          {FILTER_OPTIONS.map((option) => (
                            <button
                              key={option}
                              onClick={() => {
                                setSelectedFilter(option);
                                setShowFilterDropdown(false);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-text-base/5 transition-colors flex items-center justify-between"
                            >
                              <span className="text-text-base font-medium text-sm">
                                {option}
                              </span>
                              {selectedFilter === option && (
                                <Check className="w-4 h-4 text-text-light" />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="relative flex-1 min-w-0">
                    <button
                      onClick={() => {
                        setShowSortDropdown(!showSortDropdown);
                        setShowFilterDropdown(false);
                      }}
                      className="h-10 bg-bg-secondary border border-text-base/10 rounded-full px-4 flex items-center gap-2 hover:bg-bg-secondary/80 transition-colors w-full"
                    >
                      <span className="text-text-base font-medium text-sm truncate">
                        Sort: {selectedSort}
                      </span>
                      <ChevronDown className="w-4 h-4 text-text-base flex-shrink-0" />
                    </button>

                    <AnimatePresence>
                      {showSortDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-12 left-0 right-0 bg-bg-secondary rounded-2xl shadow-lg border border-text-base/10 py-2 z-10"
                        >
                          {SORT_OPTIONS.map((option) => (
                            <button
                              key={option}
                              onClick={() => {
                                setSelectedSort(option);
                                setShowSortDropdown(false);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-text-base/5 transition-colors flex items-center justify-between"
                            >
                              <span className="text-text-base font-medium text-sm">
                                {option}
                              </span>
                              {selectedSort === option && (
                                <Check className="w-4 h-4 text-text-light" />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div layout transition={{ duration: 0.3, ease: "easeInOut" }}>
            <div className="h-4" />
            <p className="text-text-base/30 font-medium text-xs text-center">
              Total Laporan Penipuan : {totalCount.toLocaleString("id-ID")}
            </p>
            <div className="h-4" />
          </motion.div>
        </div>

        <motion.div
          layout
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-1 overflow-y-auto pb-10"
        >
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-[107px] bg-bg-secondary rounded-xl" />
                </div>
              ))}
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <h3 className="text-text-light font-semibold text-lg">
                {searchQuery
                  ? "Tidak ada laporan yang sesuai"
                  : "Belum Ada Laporan Penipuan"}
              </h3>
              <div className="h-2" />
              <p className="text-text-base/50 font-medium text-sm">
                {searchQuery
                  ? `Pencarian "${searchQuery}" tidak ditemukan`
                  : "Database masih kosong."}
              </p>
              {!searchQuery && (
                <>
                  <div className="h-8" />
                  <Link
                    href="/scan/camera"
                    className="h-[44px] px-6 bg-text-light rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
                  >
                    <span className="text-text-dark font-semibold text-sm">
                      Scan QR Sekarang
                    </span>
                  </Link>
                </>
              )}
            </div>
          ) : searchQuery ? (
            <div>
              <p className="text-text-base/50 font-medium text-xs mb-4">
                Pencarian &ldquo;{searchQuery}&rdquo; ditemukan{" "}
                {filteredReports.length} hasil:
              </p>
              <div className="space-y-3">
                {filteredReports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className="w-full bg-bg-secondary rounded-xl p-4 flex items-center justify-between hover:bg-bg-secondary/80 transition-colors text-left"
                  >
                    <span className="text-text-base font-medium text-sm truncate flex-1">
                      {report.qr_data}
                    </span>
                    <span className="text-text-light font-semibold text-xs ml-3 flex-shrink-0">
                      {report.count} laporan
                    </span>
                  </button>
                ))}
              </div>
              <div className="h-4" />
              <p className="text-text-base/30 font-medium text-xs text-center">
                Ditampilkan {filteredReports.length} dari{" "}
                {filteredReports.length}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="w-full max-w-[350px] mx-auto bg-bg-secondary rounded-xl p-4 flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-text-base font-medium text-base flex-1">
                      {report.category}
                    </h3>
                    <span className="text-text-light font-semibold text-xs ml-2">
                      {report.count} laporan
                    </span>
                  </div>

                  <p className="text-text-warning/80 font-medium text-sm break-all line-clamp-1">
                    {report.qr_data}
                  </p>

                  <div className="flex items-center justify-between mt-1">
                    <p className="text-text-light/50 font-medium text-xs">
                      Terakhir dilaporkan{" "}
                      {formatRelativeTime(report.created_at)}
                    </p>
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="h-[29px] px-4 bg-text-light rounded-full hover:opacity-90 transition-opacity flex items-center justify-center"
                    >
                      <span className="text-text-dark font-medium text-xs">
                        Lihat Detail
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedReport && (
          <ReportDetailModal
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

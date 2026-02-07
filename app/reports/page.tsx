"use client";

import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Check,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const FILTER_OPTIONS = [
  "Semua",
  "Phishing Link",
  "QRIS Palsu",
  "Stiker ditempel",
  "Merchant Palsu",
  "Lainnya",
];

const SORT_OPTIONS = ["Terbaru", "Paling Banyak"];

interface Report {
  id: string;
  created_at: string;
  qr_type: string;
  qr_data: string;
  category: string;
  details: string | null;
  location: string | null;
  security_status: string | null;
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

  // Aggregate reports by qr_data
  const aggregatedReports = reports.reduce(
    (acc: Record<string, Report>, report) => {
      const key = report.qr_data;
      if (!acc[key]) {
        acc[key] = { ...report, count: 0 };
      }
      acc[key].count = (acc[key].count || 0) + 1;
      // Keep the most recent report
      if (new Date(report.created_at) > new Date(acc[key].created_at)) {
        acc[key] = { ...report, count: acc[key].count };
      }
      return acc;
    },
    {},
  );

  let reportsList = Object.values(aggregatedReports);

  // Apply sort
  reportsList = reportsList.sort((a, b) => {
    if (selectedSort === "Paling Banyak") {
      return (b.count || 0) - (a.count || 0);
    }
    // Terbaru (default)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Apply search filter
  const filteredReports = reportsList.filter((report) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      report.qr_data?.toLowerCase().includes(query) ||
      report.category?.toLowerCase().includes(query) ||
      report.details?.toLowerCase().includes(query)
    );
  });

  // Format relative time
  function formatRelativeTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} menit lalu`;
    } else if (diffHours < 24) {
      return `${diffHours} jam lalu`;
    } else if (diffDays === 1) {
      return "1 hari lalu";
    } else {
      return `${diffDays} hari lalu`;
    }
  }

  return (
    <main className="min-h-screen bg-white overflow-hidden h-screen">
      <div className="mx-auto max-w-md w-full px-5 py-5 h-full flex flex-col">
        <div className="mb-8">
          <div className="w-full max-w-[350px] h-[55px] bg-lime rounded-full flex items-center justify-center">
            <h1 className="text-text font-medium text-xl">
              Realtime QR Checker
            </h1>
          </div>

          <div className="h-[53px]" />

          <div className="relative">
            <Link
              href="/"
              className="absolute left-0 top-0 w-8 h-8 bg-[#F5F5F5] rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-text" />
            </Link>

            <div className="text-center">
              <h2 className="text-text font-semibold text-xl">
                Laporan QR Penipuan
              </h2>
              <div className="h-2" />
              <p className="text-text font-medium text-xs">
                Temukan hal mencurigakan
              </p>
            </div>
          </div>

          <div className="h-9" />

          <div className="relative w-full max-w-[350px] h-[50px]">
            <div className="absolute inset-0 border-2 border-lime rounded-[47px] flex items-center pl-4 pr-[6px] bg-white">
              <Search className="w-5 h-5 text-text/50 flex-shrink-0" />
              <input
                type="text"
                placeholder="Cari URL, merchant, atau NMID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 mx-3 text-text font-medium text-sm placeholder:text-text/50 bg-transparent outline-none"
              />
              <button
                onClick={() => setShowFilterSort(!showFilterSort)}
                className="w-[37px] h-[37px] bg-lime rounded-full flex items-center justify-center hover:bg-lime/90 transition-colors flex-shrink-0"
              >
                <SlidersHorizontal className="w-5 h-5 text-text" />
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

                <div className="flex gap-3 w-full max-w-[350px]">
                  <div className="relative flex-1 min-w-0">
                    <button
                      onClick={() => {
                        setShowFilterDropdown(!showFilterDropdown);
                        setShowSortDropdown(false);
                      }}
                      className="h-10 bg-[#F5F5F5] rounded-full px-4 flex items-center gap-2 hover:bg-gray-200 transition-colors w-full"
                    >
                      <span className="text-text font-medium text-sm truncate">
                        Filter: {selectedFilter}
                      </span>
                      <ChevronDown className="w-4 h-4 text-text flex-shrink-0" />
                    </button>

                    <AnimatePresence>
                      {showFilterDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-12 left-0 right-0 bg-white rounded-2xl shadow-lg border border-gray-200 py-2 z-10"
                        >
                          {FILTER_OPTIONS.map((option) => (
                            <button
                              key={option}
                              onClick={() => {
                                setSelectedFilter(option);
                                setShowFilterDropdown(false);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center justify-between"
                            >
                              <span className="text-text font-medium text-sm">
                                {option}
                              </span>
                              {selectedFilter === option && (
                                <Check className="w-4 h-4 text-lime" />
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
                      className="h-10 bg-[#F5F5F5] rounded-full px-4 flex items-center gap-2 hover:bg-gray-200 transition-colors w-full"
                    >
                      <span className="text-text font-medium text-sm truncate">
                        Sort: {selectedSort}
                      </span>
                      <ChevronDown className="w-4 h-4 text-text flex-shrink-0" />
                    </button>

                    <AnimatePresence>
                      {showSortDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-12 left-0 right-0 bg-white rounded-2xl shadow-lg border border-gray-200 py-2 z-10"
                        >
                          {SORT_OPTIONS.map((option) => (
                            <button
                              key={option}
                              onClick={() => {
                                setSelectedSort(option);
                                setShowSortDropdown(false);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center justify-between"
                            >
                              <span className="text-text font-medium text-sm">
                                {option}
                              </span>
                              {selectedSort === option && (
                                <Check className="w-4 h-4 text-lime" />
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

            <p className="text-text/50 font-medium text-xs text-center">
              Total Laporan Penipuan: {totalCount.toLocaleString("id-ID")}
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
                  <div className="h-32 bg-gray-200 rounded-2xl" />
                </div>
              ))}
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text/50 font-medium text-base">
                {searchQuery
                  ? "Tidak ada laporan yang sesuai"
                  : "Belum ada laporan"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="w-full max-w-[350px] h-[107px] bg-[#F5F5F5] rounded-xl p-4 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-text font-medium text-base flex-1">
                      {report.category}
                    </h3>
                    <span className="text-[#FF4141]/80 font-semibold text-xs ml-2">
                      {report.count} laporan
                    </span>
                  </div>

                  <p className="text-[#FF4141]/80 font-medium text-sm break-all line-clamp-1">
                    {report.qr_data}
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="text-[#334B06]/50 font-medium text-xs">
                      Terakhir dilaporkan{" "}
                      {formatRelativeTime(report.created_at)}
                    </p>
                    <button className="w-[84px] h-[29px] bg-[#B0FF1F] rounded-full hover:bg-[#B0FF1F]/90 transition-colors flex items-center justify-center">
                      <span className="text-text font-medium text-xs">
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
    </main>
  );
}

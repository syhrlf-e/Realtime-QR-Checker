"use client";

import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  Check,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FILTER_OPTIONS = [
  "Semua",
  "Phishing Link",
  "Fake QRIS",
  "Stiker Palsu",
  "Lainnya",
];

const SORT_OPTIONS = ["Paling Banyak", "Terbaru", "Verified Scam"];

export default function ReportsPage() {
  const [showFilterSort, setShowFilterSort] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Semua");
  const [selectedSort, setSelectedSort] = useState("Terbaru");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-[390px] px-5">
        <div className="pt-safe-top">
          <div className="w-[350px] h-[55px] bg-lime rounded-full flex items-center justify-center">
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

          <div className="relative w-[350px] h-[50px]">
            <div className="absolute inset-0 border-2 border-lime rounded-[47px] flex items-center pl-4 pr-[6px] bg-white">
              <Search className="w-5 h-5 text-text/50 flex-shrink-0" />
              <input
                type="text"
                placeholder="Cari URL, merchant, atau NMID"
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

          <AnimatePresence>
            {showFilterSort && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <div className="h-3" />

                <div className="flex gap-3 w-[350px]">
                  <div className="relative flex-1 min-w-0">
                    <button
                      onClick={() => {
                        setShowFilterDropdown(!showFilterDropdown);
                        setShowSortDropdown(false);
                      }}
                      className="h-10 bg-[#F5F5F5] rounded-full px-4 flex items-center gap-2 hover:bg-gray-200 transition-colors w-full"
                    >
                      <span className="text-text font-medium text-sm truncate">
                        Filter :{" "}
                        <span className="font-semibold">{selectedFilter}</span>
                      </span>
                      <ChevronDown className="w-4 h-4 text-text flex-shrink-0" />
                    </button>

                    <AnimatePresence>
                      {showFilterDropdown && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 min-w-full bg-white rounded-2xl shadow-lg border border-gray-200 py-2 z-10"
                        >
                          {FILTER_OPTIONS.map((option) => (
                            <button
                              key={option}
                              onClick={() => {
                                setSelectedFilter(option);
                                setShowFilterDropdown(false);
                              }}
                              className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors whitespace-nowrap"
                            >
                              <span className="text-text font-medium text-sm">
                                {option}
                              </span>
                              {selectedFilter === option && (
                                <Check
                                  className="w-4 h-4 text-text ml-3"
                                  strokeWidth={2.5}
                                />
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
                        Sort :{" "}
                        <span className="font-semibold">{selectedSort}</span>
                      </span>
                      <ChevronDown className="w-4 h-4 text-text flex-shrink-0" />
                    </button>

                    <AnimatePresence>
                      {showSortDropdown && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 min-w-full bg-white rounded-2xl shadow-lg border border-gray-200 py-2 z-10"
                        >
                          {SORT_OPTIONS.map((option) => (
                            <button
                              key={option}
                              onClick={() => {
                                setSelectedSort(option);
                                setShowSortDropdown(false);
                              }}
                              className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-gray-50 transition-colors whitespace-nowrap"
                            >
                              <span className="text-text font-medium text-sm">
                                {option}
                              </span>
                              {selectedSort === option && (
                                <Check
                                  className="w-4 h-4 text-text ml-3"
                                  strokeWidth={2.5}
                                />
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

          <div className={showFilterSort ? "h-24" : "h-32"} />

          <div className="flex flex-col items-center">
            <h3 className="text-text font-bold text-xl">
              Belum Ada Laporan Penipuan
            </h3>

            <div className="h-4" />

            <p className="text-text/50 font-medium text-sm">
              Database masih kosong.
            </p>

            <div className="h-24" />

            <Link
              href="/scan/camera"
              className="w-[166px] h-[44px] bg-lime rounded-full flex items-center justify-center hover:bg-lime/90 transition-colors"
            >
              <span className="text-text font-semibold text-sm">
                Scan QR Sekarang
              </span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

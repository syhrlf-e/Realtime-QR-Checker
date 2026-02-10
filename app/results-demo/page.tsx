"use client";

import toast from "react-hot-toast";
import { useState } from "react";
import ResultsBottomSheetSafe from "../components/ResultsBottomSheetSafe";

export default function ResultsDemoPage() {
  const [showResults, setShowResults] = useState(true);

  const mockData = {
    type: "QRIS Payment",
    merchant: "Warung Makan Pak Budi",
    nmid: "ID4326789654354675",
    city: "Tangerang",
    amount: "Rp 25.000",
    checks: [
      "Format QRIS valid",
      "Merchant ID terverifikasi",
      "Tidak ada laporan scam",
    ],
  };

  return (
    <main className="min-h-screen bg-bg-primary flex items-center justify-center">
      <button
        onClick={() => setShowResults(true)}
        className="px-6 py-3 bg-text-light rounded-full text-text-dark font-semibold"
      >
        Show Results (Safe)
      </button>

      {showResults && (
        <ResultsBottomSheetSafe
          data={mockData}
          onClose={() => setShowResults(false)}
          onScanAgain={() => {
            setShowResults(false);
            toast.success("Scan QR Lain clicked!");
          }}
        />
      )}
    </main>
  );
}

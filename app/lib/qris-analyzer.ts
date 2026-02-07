import {
  SecurityStatus,
  SecurityCheck,
  SecurityAnalysisResult,
} from "./url-analyzer";

export function analyzeQRIS(
  parsedData: Record<string, any>,
): SecurityAnalysisResult {
  const checks: SecurityCheck[] = [];
  let dangerCount = 0;
  let warningCount = 0;

  if (parsedData.merchantPAN && parsedData.merchantId) {
    checks.push({
      name: "Format QRIS valid",
      status: SecurityStatus.SAFE,
      message: "Format QRIS sesuai standar EMVCo",
    });
  } else {
    checks.push({
      name: "Format QRIS tidak valid",
      status: SecurityStatus.DANGER,
      message: "Format QRIS tidak sesuai standar",
    });
    dangerCount++;
  }

  if (parsedData.merchantName) {
    const merchantName = parsedData.merchantName.toLowerCase();
    const suspiciousKeywords = [
      "official",
      "promo",
      "gratis",
      "bonus",
      "hadiah",
      "menang",
    ];

    const hasSuspiciousKeyword = suspiciousKeywords.some((keyword) =>
      merchantName.includes(keyword),
    );

    if (hasSuspiciousKeyword) {
      checks.push({
        name: "Nama merchant mencurigakan",
        status: SecurityStatus.WARNING,
        message:
          "Nama merchant mengandung kata-kata yang sering digunakan scammer",
      });
      warningCount++;
    } else {
      checks.push({
        name: "Nama merchant terverifikasi",
        status: SecurityStatus.SAFE,
        message: "Nama merchant tidak mengandung kata mencurigakan",
      });
    }
  }

  if (parsedData.nmid || parsedData.merchantId) {
    const nmid = parsedData.nmid || parsedData.merchantId;
    if (nmid.startsWith("ID") && nmid.length >= 15) {
      checks.push({
        name: "NMID terverifikasi",
        status: SecurityStatus.SAFE,
        message: "NMID memiliki format yang valid",
      });
    } else {
      checks.push({
        name: "NMID tidak valid",
        status: SecurityStatus.WARNING,
        message: "Format NMID tidak sesuai standar",
      });
      warningCount++;
    }
  }

  if (parsedData.transactionAmount) {
    const amount = parseFloat(parsedData.transactionAmount);
    if (amount > 1000000) {
      checks.push({
        name: "Jumlah transaksi besar",
        status: SecurityStatus.WARNING,
        message: `Jumlah Rp ${amount.toLocaleString("id-ID")} cukup besar, pastikan merchant benar`,
      });
      warningCount++;
    }
  }

  if (parsedData.transactionCurrency) {
    if (parsedData.transactionCurrency === "360") {
      checks.push({
        name: "Mata uang IDR",
        status: SecurityStatus.SAFE,
        message: "Menggunakan mata uang Rupiah",
      });
    } else {
      checks.push({
        name: "Mata uang bukan IDR",
        status: SecurityStatus.WARNING,
        message: "QRIS menggunakan mata uang selain Rupiah",
      });
      warningCount++;
    }
  }

  const overallStatus =
    dangerCount > 0
      ? SecurityStatus.DANGER
      : warningCount > 0
        ? SecurityStatus.WARNING
        : SecurityStatus.SAFE;

  return {
    overallStatus,
    checks,
  };
}

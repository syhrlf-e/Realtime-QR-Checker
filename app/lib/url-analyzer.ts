export enum SecurityStatus {
  SAFE = "safe",
  WARNING = "warning",
  DANGER = "danger",
}

export interface SecurityCheck {
  name: string;
  status: SecurityStatus;
  message: string;
}

export interface SecurityAnalysisResult {
  overallStatus: SecurityStatus;
  checks: SecurityCheck[];
  reportCount?: number;
}

const SUSPICIOUS_TLDS = [
  ".tk",
  ".ml",
  ".ga",
  ".cf",
  ".gq",
  ".xyz",
  ".top",
  ".work",
];

const URL_SHORTENERS = [
  "bit.ly",
  "tinyurl.com",
  "goo.gl",
  "ow.ly",
  "short.link",
  "t.co",
];

const POPULAR_DOMAINS = [
  "google.com",
  "facebook.com",
  "instagram.com",
  "twitter.com",
  "youtube.com",
  "tokopedia.com",
  "shopee.co.id",
  "bukalapak.com",
  "lazada.co.id",
  "blibli.com",
];

export function analyzeURL(url: string): SecurityAnalysisResult {
  const checks: SecurityCheck[] = [];
  let dangerCount = 0;
  let warningCount = 0;

  try {
    const urlObj = new URL(url);

    if (urlObj.protocol === "https:") {
      checks.push({
        name: "Menggunakan HTTPS",
        status: SecurityStatus.SAFE,
        message: "URL menggunakan koneksi aman",
      });
    } else {
      checks.push({
        name: "Tidak menggunakan HTTPS",
        status: SecurityStatus.DANGER,
        message: "URL tidak aman, data bisa disadap",
      });
      dangerCount++;
    }

    const isShortener = URL_SHORTENERS.some((shortener) =>
      urlObj.hostname.includes(shortener),
    );
    if (isShortener) {
      checks.push({
        name: "URL Shortener terdeteksi",
        status: SecurityStatus.WARNING,
        message: "Link dipendekkan, tujuan asli tidak jelas",
      });
      warningCount++;
    }

    const hasSuspiciousTLD = SUSPICIOUS_TLDS.some((tld) =>
      urlObj.hostname.endsWith(tld),
    );
    if (hasSuspiciousTLD) {
      checks.push({
        name: "TLD mencurigakan",
        status: SecurityStatus.WARNING,
        message: "Domain menggunakan ekstensi yang sering digunakan scammer",
      });
      warningCount++;
    }

    const isTyposquatting = checkTyposquatting(urlObj.hostname);
    if (isTyposquatting) {
      checks.push({
        name: "Kemungkinan typosquatting",
        status: SecurityStatus.DANGER,
        message: `Domain mirip dengan situs populer: ${isTyposquatting}`,
      });
      dangerCount++;
    }

    const isIPAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(urlObj.hostname);
    if (isIPAddress) {
      checks.push({
        name: "Menggunakan IP Address",
        status: SecurityStatus.DANGER,
        message: "URL menggunakan IP address, sangat mencurigakan",
      });
      dangerCount++;
    }

    const subdomainCount = urlObj.hostname.split(".").length - 2;
    if (subdomainCount > 2) {
      checks.push({
        name: "Terlalu banyak subdomain",
        status: SecurityStatus.WARNING,
        message: "URL memiliki subdomain berlebihan",
      });
      warningCount++;
    }

    if (checks.length === 1 && checks[0].status === SecurityStatus.SAFE) {
      checks.push({
        name: "Tidak ada URL shortener",
        status: SecurityStatus.SAFE,
        message: "Link tidak dipendekkan",
      });
      checks.push({
        name: "Domain terpercaya",
        status: SecurityStatus.SAFE,
        message: "Tidak terdeteksi sebagai typosquatting",
      });
    }
  } catch (error) {
    checks.push({
      name: "Format URL tidak valid",
      status: SecurityStatus.DANGER,
      message: "URL tidak dapat diproses",
    });
    dangerCount++;
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

function checkTyposquatting(hostname: string): string | null {
  for (const popular of POPULAR_DOMAINS) {
    const distance = levenshteinDistance(hostname, popular);
    if (distance > 0 && distance <= 2) {
      return popular;
    }
  }
  return null;
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

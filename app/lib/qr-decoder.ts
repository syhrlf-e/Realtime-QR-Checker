export enum QRType {
  URL = "URL",
  QRIS = "QRIS",
  VCARD = "vCard",
  WIFI = "WiFi",
  EMAIL = "Email",
  SMS = "SMS",
  GEO = "Geo Location",
  CALENDAR = "Calendar Event",
  PLAIN_TEXT = "Plain Text",
}

export interface DecodedQR {
  type: QRType;
  rawData: string;
  parsedData: Record<string, any>;
}

export function decodeQR(data: string): DecodedQR {
  const trimmedData = data.trim();

  const urlPattern = /^(https?:\/\/|www\.)/i;
  const isURLMatch = urlPattern.test(trimmedData);
  console.log("🔍 URL Pattern test:", isURLMatch);
  console.log("🔍 Starts with 'http://':", trimmedData.startsWith("http://"));
  console.log("🔍 Starts with 'https://':", trimmedData.startsWith("https://"));

  if (isURLMatch) {
    let url = trimmedData;
    if (trimmedData.toLowerCase().startsWith("www.")) {
      url = "http://" + trimmedData;
    }
    console.log("✅ DETECTED AS URL:", url);
    return {
      type: QRType.URL,
      rawData: trimmedData,
      parsedData: { url },
    };
  }
  console.log("❌ NOT URL - checking other types...");

  if (trimmedData.startsWith("00020") || trimmedData.includes("ID.CO.QRIS")) {
    return {
      type: QRType.QRIS,
      rawData: trimmedData,
      parsedData: parseQRIS(trimmedData),
    };
  }

  if (trimmedData.startsWith("BEGIN:VCARD")) {
    return {
      type: QRType.VCARD,
      rawData: trimmedData,
      parsedData: parseVCard(trimmedData),
    };
  }

  if (trimmedData.startsWith("WIFI:")) {
    return {
      type: QRType.WIFI,
      rawData: trimmedData,
      parsedData: parseWiFi(trimmedData),
    };
  }

  if (trimmedData.startsWith("mailto:")) {
    return {
      type: QRType.EMAIL,
      rawData: trimmedData,
      parsedData: { email: trimmedData.replace("mailto:", "") },
    };
  }

  if (trimmedData.startsWith("sms:") || trimmedData.startsWith("smsto:")) {
    return {
      type: QRType.SMS,
      rawData: trimmedData,
      parsedData: parseSMS(trimmedData),
    };
  }

  if (trimmedData.startsWith("geo:")) {
    return {
      type: QRType.GEO,
      rawData: trimmedData,
      parsedData: parseGeo(trimmedData),
    };
  }

  if (trimmedData.startsWith("BEGIN:VEVENT")) {
    return {
      type: QRType.CALENDAR,
      rawData: trimmedData,
      parsedData: parseCalendar(trimmedData),
    };
  }

  return {
    type: QRType.PLAIN_TEXT,
    rawData: trimmedData,
    parsedData: { text: trimmedData },
  };
}

function parseQRIS(data: string): Record<string, any> {
  const result: Record<string, any> = {};

  try {
    let index = 0;
    while (index < data.length) {
      const tag = data.substring(index, index + 2);
      const length = parseInt(data.substring(index + 2, index + 4), 10);
      const value = data.substring(index + 4, index + 4 + length);

      if (tag === "26") {
        const merchantData = parseTLV(value);
        result.merchantPAN = merchantData["00"] || "";
        result.merchantId = merchantData["01"] || "";
      } else if (tag === "51") {
        result.merchantCategoryCode = value;
      } else if (tag === "52") {
        result.transactionCurrency = value;
      } else if (tag === "54") {
        result.transactionAmount = value;
      } else if (tag === "59") {
        result.merchantName = value;
      } else if (tag === "60") {
        result.merchantCity = value;
      }

      index += 4 + length;
    }

    result.nmid = result.merchantId || "";
  } catch (error) {
    console.error("Error parsing QRIS:", error);
  }

  return result;
}

function parseTLV(data: string): Record<string, string> {
  const result: Record<string, string> = {};
  let index = 0;

  while (index < data.length) {
    const tag = data.substring(index, index + 2);
    const length = parseInt(data.substring(index + 2, index + 4), 10);
    const value = data.substring(index + 4, index + 4 + length);
    result[tag] = value;
    index += 4 + length;
  }

  return result;
}

function parseVCard(data: string): Record<string, any> {
  const lines = data.split("\n");
  const result: Record<string, any> = {};

  lines.forEach((line) => {
    if (line.startsWith("FN:")) result.name = line.substring(3);
    if (line.startsWith("TEL:")) result.phone = line.substring(4);
    if (line.startsWith("EMAIL:")) result.email = line.substring(6);
  });

  return result;
}

function parseWiFi(data: string): Record<string, any> {
  const parts = data.substring(5).split(";");
  const result: Record<string, any> = {};

  parts.forEach((part) => {
    const [key, value] = part.split(":");
    if (key === "S") result.ssid = value;
    if (key === "T") result.encryption = value;
    if (key === "P") result.password = value;
  });

  return result;
}

function parseSMS(data: string): Record<string, any> {
  const cleaned = data.replace("sms:", "").replace("smsto:", "");
  const [phone, body] = cleaned.split(":");
  return { phone, body: body || "" };
}

function parseGeo(data: string): Record<string, any> {
  const coords = data.substring(4).split(",");
  return {
    latitude: coords[0],
    longitude: coords[1],
  };
}

function parseCalendar(data: string): Record<string, any> {
  const lines = data.split("\n");
  const result: Record<string, any> = {};

  lines.forEach((line) => {
    if (line.startsWith("SUMMARY:")) result.title = line.substring(8);
    if (line.startsWith("DTSTART:")) result.start = line.substring(8);
    if (line.startsWith("DTEND:")) result.end = line.substring(6);
  });

  return result;
}

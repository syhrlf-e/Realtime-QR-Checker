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
  if (data.startsWith("http://") || data.startsWith("https://")) {
    return {
      type: QRType.URL,
      rawData: data,
      parsedData: { url: data },
    };
  }

  if (data.startsWith("00020") || data.includes("ID.CO.QRIS")) {
    return {
      type: QRType.QRIS,
      rawData: data,
      parsedData: parseQRIS(data),
    };
  }

  if (data.startsWith("BEGIN:VCARD")) {
    return {
      type: QRType.VCARD,
      rawData: data,
      parsedData: parseVCard(data),
    };
  }

  if (data.startsWith("WIFI:")) {
    return {
      type: QRType.WIFI,
      rawData: data,
      parsedData: parseWiFi(data),
    };
  }

  if (data.startsWith("mailto:")) {
    return {
      type: QRType.EMAIL,
      rawData: data,
      parsedData: { email: data.replace("mailto:", "") },
    };
  }

  if (data.startsWith("sms:") || data.startsWith("smsto:")) {
    return {
      type: QRType.SMS,
      rawData: data,
      parsedData: parseSMS(data),
    };
  }

  if (data.startsWith("geo:")) {
    return {
      type: QRType.GEO,
      rawData: data,
      parsedData: parseGeo(data),
    };
  }

  if (data.startsWith("BEGIN:VEVENT")) {
    return {
      type: QRType.CALENDAR,
      rawData: data,
      parsedData: parseCalendar(data),
    };
  }

  return {
    type: QRType.PLAIN_TEXT,
    rawData: data,
    parsedData: { text: data },
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

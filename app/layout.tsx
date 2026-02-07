import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Realtime QR Checker - Cek Keamanan QR Code",
  description:
    "Lindungi diri dari penipuan QR. Scan dan analisis keamanan QR code sebelum pembayaran. Deteksi phishing, QRIS palsu, dan stiker scam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${plusJakartaSans.variable} font-sans antialiased`}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#333",
              color: "#fff",
              borderRadius: "50px",
              padding: "12px 20px",
            },
            success: {
              iconTheme: {
                primary: "#B0FF1F",
                secondary: "#333",
              },
            },
            error: {
              iconTheme: {
                primary: "#FF0000",
                secondary: "#fff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}

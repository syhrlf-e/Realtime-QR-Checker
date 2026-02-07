import { useEffect, useRef, useCallback } from "react";
import jsQR from "jsqr";

interface UseQRScannerOptions {
  onScan: (data: string) => void;
  onError?: (error: Error) => void;
  scanInterval?: number;
}

export function useQRScanner({
  onScan,
  onError,
  scanInterval = 100,
}: UseQRScannerOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scanningRef = useRef(false);
  const lastScanRef = useRef<string>("");

  const scanQRCode = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !scanningRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });

    if (code && code.data && code.data !== lastScanRef.current) {
      lastScanRef.current = code.data;
      onScan(code.data);

      // Auto-reset after 3 seconds to allow re-scanning
      setTimeout(() => {
        lastScanRef.current = "";
      }, 3000);
    }
  }, [onScan]);

  const startScanning = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        scanningRef.current = true;

        if (!canvasRef.current) {
          canvasRef.current = document.createElement("canvas");
        }

        const interval = setInterval(scanQRCode, scanInterval);
        return () => {
          clearInterval(interval);
          scanningRef.current = false;
        };
      }
    } catch (error) {
      if (onError) {
        onError(error as Error);
      }
    }
  }, [scanQRCode, scanInterval, onError]);

  const stopScanning = useCallback(() => {
    scanningRef.current = false;
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
  }, []);

  const resetLastScan = useCallback(() => {
    lastScanRef.current = "";
  }, []);

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, [stopScanning]);

  return {
    videoRef,
    startScanning,
    stopScanning,
    resetLastScan,
  };
}

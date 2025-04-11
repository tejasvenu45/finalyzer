"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Tesseract from "tesseract.js";

export function ReceiptScanner({ onScanComplete }) {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleReceiptScan = async (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    try {
      setLoading(true);
      toast.info("Scanning receipt...");

      const {
        data: { text },
      } = await Tesseract.recognize(file, "eng", {
        logger: (m) => console.log(m),
      });

      console.log("OCR Result:", text);

      const extracted = extractTransactionFromText(text);

      if (!extracted) {
        toast.error("Could not extract transaction from the receipt.");
        return;
      }

      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(extracted),
      });

      const result = await res.json();

      if (!result.success) {
        toast.error("Transaction could not be saved.");
      } else {
        toast.success("Transaction added successfully");
        if (onScanComplete) onScanComplete(result.data);
      }
    } catch (err) {
      console.error("Scan error:", err);
      toast.error("Failed to scan receipt");
    } finally {
      setLoading(false);
    }
  };

  const extractTransactionFromText = (text) => {
    const amountMatch = text.match(/(?:Rs|INR|₹)\s?(\d+[.,]?\d*)/i);
    const dateMatch = text.match(/(\d{2}[\/\-\.]\d{2}[\/\-\.]\d{2,4})/);
    const category = /grocery|fuel|food|restaurant|travel/i.exec(text);

    const amount = amountMatch?.[1]?.replace(",", "");
    const rawDate = dateMatch?.[1];
    const date = rawDate ? new Date(rawDate).toISOString().substring(0, 10) : null;

    if (!amount || !date) return null;

    return {
      type: "expense",
      amount,
      description: "Scanned from receipt",
      category: category?.[0] || "General",
      date,
    };
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptScan(file);
        }}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full h-10 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 animate-gradient hover:opacity-90 transition-opacity text-white hover:text-white"
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 animate-spin" />
            <span>Scanning...</span>
          </>
        ) : (
          <>
            <Camera className="mr-2" />
            <span>Scan Receipt with AI</span>
          </>
        )}
      </Button>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import Tesseract from "tesseract.js";

export default function ReceiptScannerPage() {
  const { isAuthenticated, user, authLoading } = useAuth();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleReceiptScan = async (file) => {
    if (!file || file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB.");
      return;
    }

    setLoading(true);

    try {
      const { data: { text } } = await Tesseract.recognize(file, "eng", {
        logger: (m) => console.log(m), 
      });

      const lines = text.split("\n").map(line => line.trim()).filter(Boolean);
      const amountLine = lines.find(line => line.includes("$") || line.toLowerCase().includes("total"));
      const amountMatch = amountLine?.match(/(\d+[.,]?\d*)/);

      const transaction = {
        date: new Date().toISOString(),
        amount: parseFloat(amountMatch?.[0]) || 0,
        description: lines[0] || "Scanned Receipt",
        category: "misc",
        isRecurring: false,
        recurringInterval: null,
      };

      const res = await fetch("/api/scan", {
        method: "POST",
        body: JSON.stringify(transaction),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Transaction added successfully!");
        console.log("Scanned Transaction:", data.transaction);
      } else {
        toast.error(data.message || "Failed to save transaction.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while scanning the receipt.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Scan Receipt</h1>
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
      <button
        type="button"
        className="w-full h-10 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 animate-gradient hover:opacity-90 transition-opacity text-white rounded-md font-medium flex items-center justify-center gap-2"
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />
            Scanning...
          </>
        ) : (
          <>
            <Camera />
            Scan Receipt with AI
          </>
        )}
      </button>
    </div>
  );
}

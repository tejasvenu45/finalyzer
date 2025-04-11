"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ReceiptScannerPage() {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleReceiptScan = async (file) => {
    if (!file || file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("receipt", file);

    setLoading(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Transaction added successfully!");
        console.log("Scanned Transaction:", data.transaction);
      } else {
        toast.error(data.message || "Failed to scan receipt.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred.");
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

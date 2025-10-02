"use client";

import { useRef, useEffect } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { scanReceipt } from "@/actions/transaction";
import { motion } from "framer-motion";

export function ReceiptScanner({ onScanComplete }) {
  const fileInputRef = useRef(null);

  const {
    loading: scanReceiptLoading,
    fn: scanReceiptFn,
    data: scannedData,
  } = useFetch(scanReceipt);

  const handleReceiptScan = async (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    try {
      await scanReceiptFn(file);
    } catch (error) {
      console.error("Error scanning receipt:", error);
      toast.error("Failed to scan receipt");
    }
  };

  useEffect(() => {
    if (scannedData && !scanReceiptLoading) {
      onScanComplete(scannedData);
      toast.success("Receipt scanned successfully");
    }
  }, [scannedData, scanReceiptLoading]);

  return (
    <motion.div 
      className="flex items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptScan(file);
          e.target.value = ""; // Reset input so same file can be scanned again
        }}
      />
      <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-0"
          onClick={() => fileInputRef.current?.click()}
          disabled={scanReceiptLoading}
        >
          {scanReceiptLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Scanning Receipt...</span>
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              <span>Scan Receipt with AI</span>
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}
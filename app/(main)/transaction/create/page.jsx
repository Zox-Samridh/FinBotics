"use client";

export const dynamic = "force-dynamic"; // ensures this page is always client-rendered

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { defaultCategories } from "@/data/categories";
import { AddTransactionForm } from "../_components/transaction-form";
import { getUserAccounts } from "@/actions/dashboard";
import { getTransaction } from "@/actions/transaction";
import { Loader2 } from "lucide-react";

function AddTransactionContent() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [accounts, setAccounts] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const accountsRes = await getUserAccounts();
        setAccounts(accountsRes || []);

        if (editId) {
          const transaction = await getTransaction(editId);
          setInitialData(transaction);
        }
      } catch (err) {
        setError(err.message || "Failed to load data");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [editId]);

  // Render loading / error states
  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#282828] to-[#282828] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#282828] to-[#282828]">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen py-8 bg-gradient-to-r from-[#282828] to-[#282828]">
      <div className="max-w-3xl mx-auto px-5">
        <motion.div
          className="flex justify-center md:justify-start mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            {editId ? "Edit" : "Add"} Transaction
          </h1>
        </motion.div>

        <AddTransactionForm
          accounts={accounts}
          categories={defaultCategories}
          editMode={!!editId}
          initialData={initialData}
        />
      </div>
    </div>
  );
}

export default function AddTransactionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-r from-[#282828] to-[#282828] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      }
    >
      <AddTransactionContent />
    </Suspense>
  );
}
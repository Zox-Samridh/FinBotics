"use client";

import React, { Suspense, useState, useEffect } from "react";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { getDashboardData, getUserAccounts } from "@/actions/dashboard";
import { AccountCard } from "./_components/account-card";
import { getCurrentBudget } from "@/actions/budget";
import { BudgetProgress } from "./_components/budget-progress";
import { DashboardOverview } from "./_components/transactions-overview";
import { motion } from "framer-motion";

function DashboardPage() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [accountsRes, transactionsRes] = await Promise.all([
          getUserAccounts(),
          getDashboardData(),
        ]);

        setAccounts(accountsRes || []);
        setTransactions(transactionsRes || []);

        const defaultAccount = accountsRes?.find((account) => account.isDefault);
        if (defaultAccount) {
          const budgetRes = await getCurrentBudget(defaultAccount.id);
          setBudgetData(budgetRes);
        }
      } catch (err) {
        setError(err.message || "Failed to load data");
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 bg-[#282828] min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12 bg-[#282828] min-h-screen">
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
  }

  return (
    <div className="space-y-12 bg-gradient-to-r from-[#282828] to-[#282828] min-h-screen text-white px-4">
      {/* Budget Progress */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl bg-[#1e1e1e] p-6 md:p-8 shadow-lg"
      >
        <BudgetProgress
          initialBudget={budgetData?.budget}
          currentExpenses={budgetData?.currentExpenses || 0}
        />
      </motion.section>

      {/* Dashboard Overview */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
        className="bg-[#1e1e1e] p-6 md:p-8 rounded-2xl shadow-lg"
      >
        <Suspense fallback={<div className="text-center py-8 text-gray-300">Loading Overview ...</div>}>
          <DashboardOverview
            accounts={accounts}
            transactions={transactions}
          />
        </Suspense>
      </motion.section>

      {/* Accounts Grid */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="relative"
      >
        <h2 className="text-3xl font-bold mb-6 text-white">
          Your Accounts
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CreateAccountDrawer>
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.3 }}
              className="group"
            >
              <Card className="hover:shadow-xl transition-all duration-500 cursor-pointer border-2 border-dashed border-gray-600 hover:border-blue-400 bg-[#1e1e1e] h-full">
                <CardContent className="flex flex-col items-center justify-center text-gray-300 h-full pt-5 pb-5">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="h-12 w-12 mb-3 bg-gradient-to-r from-[#282828] to-[#282828] rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  >
                    <Plus className="h-6 w-6" />
                  </motion.div>
                  <p className="text-base font-semibold">Add New Account</p>
                </CardContent>
              </Card>
            </motion.div>
          </CreateAccountDrawer>

          {accounts.length > 0 &&
            accounts.map((account, index) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <AccountCard account={account} />
              </motion.div>
            ))}
        </div>
      </motion.section>
    </div>
  );
}

export default DashboardPage;

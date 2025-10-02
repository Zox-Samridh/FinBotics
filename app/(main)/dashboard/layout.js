"use client";

import React, { Suspense } from 'react';
import DashboardPage from './page';
import { BarLoader } from 'react-spinners';
import { motion } from 'framer-motion';

const DashboardLayout = () => {
  return (
    <div className="px-5 py-8 bg-gradient-to-r from-[#282828] to-[#282828] min-h-screen text-white">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
      </motion.div>
      <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#933ea" />} >
        <DashboardPage />
      </Suspense>
    </div>
  );
};

export default DashboardLayout;

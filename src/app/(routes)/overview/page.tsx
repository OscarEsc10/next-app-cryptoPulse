"use client";

import React from "react";
import { motion } from "framer-motion";
import OverviewStats from "./components/overViewStats";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
} as const;

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }
} as const;

export default function OverviewPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate="show"
        variants={container}
      >
        <motion.div 
          className="text-center mb-12"
          variants={item}
        >
          <motion.h1 
            className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white-500 to-black bg-clip-text text-transparent inline-block"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Market Overview
          </motion.h1>
          <motion.p 
            className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Real-time cryptocurrency market data and portfolio insights at a glance
          </motion.p>
        </motion.div>

        <motion.div
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <OverviewStats />
        </motion.div>

        {/* Additional decorative elements */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      </motion.div>
    </div>
  );
}

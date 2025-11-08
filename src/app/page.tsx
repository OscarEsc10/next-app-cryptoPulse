"use client";

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import DashboardStats from '../app/(routes)/dashboard/page';

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

export default function Home() {
  return (
    <div className="min-h-[80vh] flex items-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="w-full max-w-7xl mx-auto"
        initial="hidden"
        animate="show"
        variants={container}
      >
        <motion.div 
          className="text-center mb-8"
          variants={item}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            CryptoPulse Dashboard
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Real-time cryptocurrency market overview
          </motion.p>
          <motion.div 
            className="h-1 w-20 bg-blue-600 mx-auto mt-6 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </motion.div>
        
        <motion.div
          variants={item}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <motion.div 
                  key={i} 
                  className="p-6 bg-white/30 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      delay: 0.1 * i,
                      duration: 0.5 
                    } 
                  }}
                >
                  <div className="animate-pulse">
                    <div className="h-4 bg-white/50 rounded-full w-1/2 mb-4"></div>
                    <div className="h-8 w-3/4 bg-white/50 rounded-full mb-2"></div>
                    <div className="h-4 bg-white/30 rounded-full w-1/3"></div>
                  </div>
                </motion.div>
              ))}
            </div>
          }>
            <motion.div
              className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <DashboardStats />
            </motion.div>
          </Suspense>
        </motion.div>
      </motion.div>
    </div>
  );
}

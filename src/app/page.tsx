"use client";

import { Suspense } from 'react';
import DashboardStats from '../app/(routes)/dashboard/page';

export default function Home() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            CryptoPulse Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Real-time cryptocurrency market overview
          </p>
        </div>
        
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 border border-gray-200 rounded-lg">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 w-3/4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        }>
          <DashboardStats />
        </Suspense>
      </div>
    </div>
  );
}

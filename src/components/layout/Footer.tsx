import React from "react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 bg-white text-xs text-gray-500">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
        <span>© {new Date().getFullYear()} CryptoPulse</span>
        <span className="hidden sm:inline">Built with Next.js</span>
      </div>
    </footer>
  );
}

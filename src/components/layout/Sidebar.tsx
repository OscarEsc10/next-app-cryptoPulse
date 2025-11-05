import Link from "next/link";
import { FiHome, FiPieChart, FiTrendingUp, FiBell, FiSettings } from "react-icons/fi";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white p-6 border-r border-gray-100">
      <div className="flex items-center gap-2 mb-8">
        <span className="text-lg font-bold">Crypto Navigation</span>
      </div>
      
      <nav>
        <ul className="space-y-1">
          <li>
            <Link 
              href="/" 
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[#2563eb] bg-blue-50 rounded-lg"
            >
              <FiHome size={18} className="text-blue-500" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link 
              href="#" 
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <FiPieChart size={18} className="text-gray-500" />
              <span>Overview</span>
            </Link>
          </li>
          <li>
            <Link 
              href="#" 
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <FiTrendingUp size={18} className="text-gray-500" />
              <span>Markets</span>
            </Link>
          </li>
          <li>
            <Link 
              href="#" 
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <FiBell size={18} className="text-gray-500" />
              <span>News</span>
            </Link>
          </li>
          <li className="pt-4 mt-4 border-t border-gray-100">
            <Link 
              href="#" 
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <FiSettings size={18} className="text-gray-500" />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-blue-50 p-4 rounded-xl">
          <p className="text-sm text-blue-800 font-medium mb-1">Need help?</p>
          <p className="text-xs text-blue-600">Check our documentation</p>
        </div>
      </div>
    </aside>
  );
}
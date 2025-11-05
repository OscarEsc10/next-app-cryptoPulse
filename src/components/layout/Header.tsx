import { GiPayMoney } from "react-icons/gi";
import { FiGrid, FiBell, FiSearch } from "react-icons/fi";

export default function Header() {
  return (
    <header className="w-full h-16 px-4 md:px-8 flex items-center justify-between bg-white">
      {/* Left: Brand */}
      <div className="flex items-center gap-2 cursor-pointer select-none">
        <div className="h-8 w-8 rounded-full bg-[#2563eb] flex items-center justify-center text-white">
          <GiPayMoney size={18} />
        </div>
        <span className="text-base font-semibold text-gray-900">Crypto</span>
        <span className="text-base font-semibold text-[#2563eb]">Pulse</span>
      </div>

      {/* Right: Search + Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 h-10 rounded-lg bg-gray-50 px-3 text-gray-500 focus-within:ring-2 focus-within:ring-blue-100 border border-gray-200">
          <FiSearch size={16} />
          <input
            className="bg-transparent outline-none placeholder-gray-400 text-sm w-40 lg:w-64"
            placeholder="Search..."
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <FiGrid size={20} className="text-gray-500 hover:text-gray-700 cursor-pointer" />
          <FiBell size={20} className="text-gray-500 hover:text-gray-700 cursor-pointer" />
|       </div>
      </div>
    </header>
  );
}
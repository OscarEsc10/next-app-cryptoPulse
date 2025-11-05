import { GiPayMoney } from "react-icons/gi";
import { FiGrid, FiHelpCircle, FiBell, FiSearch } from "react-icons/fi";

export default function Header() {
  return (
    <header className="w-full h-14 px-4 md:px-8 flex items-center justify-between bg-black/80 backdrop-blur border-b border-white/10 text-white">
      {/* Left: Brand + Nav */}
      <div className="flex items-center gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2 cursor-pointer select-none">
          <div className="h-8 w-8 rounded-full flex items-center justify-center text-white">
            <GiPayMoney size={18} />
          </div>
          <span className="text-sm sm:text-base tracking-tight text-white/90">Crypto</span>
          <span className="text-sm sm:text-base tracking-tight font-semibold" style={{ color: '#FFC145' }}>Pulse</span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-3 text-sm">
          <span className="px-3 py-1 rounded-full border border-[#FFC145]/40 text-[#FFC145] bg-[#FFC145]/10">Overview</span>
          <button className="text-white/70 hover:text-white cursor-pointer">Markets</button>
          <button className="text-white/70 hover:text-white cursor-pointer">News</button>
        </nav>
      </div>

      {/* Right: Search + Actions */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 h-9 rounded-xl border border-white/10 bg-white/5 px-3 text-white/80 focus-within:border-white/20">
          <FiSearch size={16} className="text-white/60" />
          <input
            className="bg-transparent outline-none placeholder:text-white/40 text-sm w-40 md:w-56"
            placeholder="Search"
          />
        </div>

        {/* Buy button */}
        <button className="h-9 px-4 rounded-full bg-[#FFC145] text-[#343A40] text-sm font-medium transition hover:bg-yellow-500 cursor-pointer">
          Buy Crypto
        </button>

        {/* Icons */}
        <FiGrid size={22} className="cursor-pointer text-white/80 hover:text-white" />
        <FiHelpCircle size={22} className="cursor-pointer text-white/80 hover:text-white" />
        <FiBell size={20} className="cursor-pointer text-white/80 hover:text-white" />
      </div>
    </header>
  );
}
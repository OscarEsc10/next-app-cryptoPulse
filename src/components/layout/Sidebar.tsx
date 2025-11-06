"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiPieChart, FiTrendingUp, FiBell, FiSettings } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { MenuItem } from "../../types/SideBar.Interface";

export default function Sidebar() {
  const pathname = usePathname();
  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 });
  const itemsRef = useRef<{ [key: string]: HTMLLIElement | null }>({});

  const menuItems: MenuItem[] = [
    { href: "/", icon: <FiHome size={18} />, label: "Home" },
    { href: "/overview", icon: <FiPieChart size={18} />, label: "Overview" },
    { 
      href: "/markets", 
      icon: <FiTrendingUp size={18} />, 
      label: "Markets",
      alsoStartsWith: ["/coin"]
    },
    { href: "/news", icon: <FiBell size={18} />, label: "News" },
    { href: "/settings", icon: <FiSettings size={18} />, label: "Settings" },
  ];

  // Create a ref callback that properly handles the ref assignment
  const setItemRef = (href: string) => (el: HTMLLIElement | null) => {
    itemsRef.current[href] = el;
  };

  const isActive = (item: MenuItem) => {
    if (item.href === "/") return pathname === "/";
    return pathname.startsWith(item.href) || 
           (item.alsoStartsWith?.some(p => pathname.startsWith(p)) || false);
  };

  useEffect(() => {
    const activeItem = menuItems.find(item => isActive(item));
    if (activeItem) {
      const element = itemsRef.current[activeItem.href];
      if (element) {
        setIndicatorStyle({
          top: element.offsetTop,
          height: element.offsetHeight,
        });
      }
    }
  }, [pathname]);

  return (
    <aside className="w-64 min-h-screen bg-white p-6 border-r border-gray-100 relative">
      <div className="flex items-center gap-2 mb-8">
        <span className="text-lg font-bold">Crypto Navigation</span>
      </div>
      
      <nav>
        <ul className="space-y-1 relative">
          {/* Sliding indicator */}
          <div 
            className="absolute left-0 w-1 bg-blue-500 rounded-r transition-all duration-300 ease-out"
            style={indicatorStyle}
          />
          
          {menuItems.map((item, index) => {
            const active = isActive(item);
            return (
              <li 
                key={item.href} 
                ref={setItemRef(item.href)}
                className="relative"
              >
                <Link 
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ease-out ${
                    active 
                      ? 'text-blue-600 bg-blue-50 pl-6' 
                      : 'text-gray-600 hover:bg-gray-50 hover:pl-6'
                  }`}
                >
                  <span className={`transition-colors duration-300 ${active ? 'text-blue-500' : 'text-gray-500'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
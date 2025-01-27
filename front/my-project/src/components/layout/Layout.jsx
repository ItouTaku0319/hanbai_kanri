import React, { useState } from "react";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { menuItems } from "./menuItems";

const Layout = ({ children }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({}); // サブメニューの開閉状態

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <nav className="w-64 bg-gray-900 text-gray-300">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Menu size={22} />
            <h1 className="text-lg font-semibold text-white">販売管理システム</h1>
          </div>
        </div>

        <ul className="p-2">
  {menuItems.map((item) => (
    <li key={item.label} className="mb-1">
      {item.subMenu ? (
        <div>
          {/* 親メニュー (マスタ) */}
          <button
            onClick={() => toggleMenu(item.label)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md 
                        ${openMenus[item.label] ? "bg-gray-800 text-white" : "bg-gray-700 text-gray-300"} 
                        hover:bg-gray-800 transition-colors`}
          >
            {item.label}
          </button>

          {/* サブメニュー */}
          {openMenus[item.label] && (
            <ul className="ml-4 border-l border-gray-600 pl-2">
              {item.subMenu.map((sub) =>
                sub.subMenu ? (
                  <div key={sub.label}>
                    <button
                      onClick={() => toggleMenu(sub.label)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md 
                                  ${openMenus[sub.label] ? "bg-gray-700 text-white" : "bg-gray-600 text-gray-300"} 
                                  hover:bg-gray-700 transition-colors`}
                    >
                      {sub.label}
                    </button>
                    {openMenus[sub.label] && (
                      <ul className="ml-4 border-l border-gray-500 pl-2">
                        {sub.subMenu.map((subSub) => (
                          <li key={subSub.path}>
                            <Link
                              to={subSub.path}
                              className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
                            >
                              {subSub.icon} {subSub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <li key={sub.path}>
                    <Link
                      to={sub.path}
                      className="block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      {sub.icon} {sub.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      ) : (
        <Link
          to={item.path}
          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors 
                      ${location.pathname === item.path ? "bg-gray-800 text-white" : "hover:bg-gray-800 text-gray-300"}`}
        >
          {item.icon} {item.label}
        </Link>
      )}
    </li>
  ))}
</ul>

      </nav>

      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
};

export default Layout;

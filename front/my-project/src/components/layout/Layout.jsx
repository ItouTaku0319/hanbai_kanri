// src/components/layout/Layout.jsx
import React from 'react';
import { Menu, Package, Truck, Database, Plus, List } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/orders', icon: Package, label: '受注管理' },
    { path: '/shipments', icon: Truck, label: '出荷管理' },
    { path: '/inventory', icon: Database, label: '在庫管理' },
    { path: '/inventory/add', icon: Plus, label: '在庫追加' },
    { path: '/lists', icon: List, label: '一覧表示' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="fixed top-0 left-0 h-full w-64 bg-gray-900 text-gray-300">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Menu size={22} />
            <h1 className="text-lg font-semibold text-white">販売管理システム</h1>
          </div>
        </div>
        
        <ul className="p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path} className="mb-1">
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    location.pathname === item.path
                      ? 'bg-gray-800 text-white'
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <main className="ml-64 min-h-screen bg-gray-100">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
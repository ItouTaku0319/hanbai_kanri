import React, { useState, useEffect } from 'react';
import { Search } from "lucide-react";

const InventoryManagement = () => {
  // サンプルデータ
  const [inventory, setInventory] = useState([
    { id: 1, code: "ITEM001", name: "商品A", quantity: 100, unit: "個", reorderPoint: 20 },
    { id: 2, code: "ITEM002", name: "商品B", quantity: 50, unit: "箱", reorderPoint: 10 },
    { id: 3, code: "ITEM003", name: "商品C", quantity: 75, unit: "個", reorderPoint: 15 },
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  // 検索フィルター
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 在庫状態に基づく行の色分け用のスタイル
  const getRowStyle = (quantity, reorderPoint) => {
    if (quantity <= reorderPoint) {
      return "bg-red-100";
    }
    return "";
  };

  const fetchProducts = async () => {
    try {
      console.log('Fetching inventory...');
      const response = await fetch('http://localhost:8080/inventory', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'omit'
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      setInventory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error details:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">在庫管理</h2>
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="商品名・商品コードで検索"
              className="w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            新規商品登録
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="p-2 text-left">商品コード</th>
              <th className="p-2 text-left">商品名</th>
              <th className="p-2 text-right">在庫数</th>
              <th className="p-2 text-center">単位</th>
              <th className="p-2 text-right">発注点</th>
              <th className="p-2 text-center">アクション</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map(item => (
              <tr 
                key={item.id} 
                className={`border-b border-gray-200 ${getRowStyle(item.quantity, item.reorderPoint)}`}
              >
                <td className="p-2">{item.code}</td>
                <td className="p-2">{item.name}</td>
                <td className="p-2 text-right">{item.quantity ? item.quantity.toLocaleString() : ''}</td>
                <td className="p-2 text-center">{item.unit}</td>
                <td className="p-2 text-right">{item.reorderPoint ? item.reorderPoint.toLocaleString() : ''}</td>
                <td className="p-2 text-center">
                  <div className="flex justify-center gap-2">
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                      編集
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                      入庫
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100">
                      出庫
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManagement;
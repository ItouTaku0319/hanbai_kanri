import React, { useState, useEffect } from 'react';
import { Search } from "lucide-react";

const ZaikoList = () => {
  // サンプルデータ
  const [inventory, setInventory] = useState([
    { id: 1, code: "ITEM001", name: "商品A", zaiko_su: 100, unit: "個", reorderPoint: 20 },
    { id: 2, code: "ITEM002", name: "商品B", zaiko_su: 50, unit: "箱", reorderPoint: 10 },
    { id: 3, code: "ITEM003", name: "商品C", zaiko_su: 75, unit: "個", reorderPoint: 15 },
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  // 検索フィルター
  const filteredInventory = inventory.filter(item => 
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.code?.toLowerCase().includes(searchQuery.toLowerCase())
);

  // 在庫状態に基づく行の色分け用のスタイル
  const getRowStyle = (zaiko_su, reorderPoint) => {
    if (zaiko_su <= reorderPoint) {
      return "bg-red-100";
    }
    return "";
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/zaiko');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data); 
      setInventory(data.map(item => ({
        id: item.id || 0,
        code: item.syohin_code || "",
        name: item.syohin_name || "",
        zaiko_su: item.zaiko_su || 0,
        unit: item.stock_unit || "",
        price: item.price || "",
        reorderPoint: item.alert_threshold || 0
    })));
      
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
              <th className="p-2 text-center">単価</th>
              <th className="p-2 text-right">発注点</th>
              <th className="p-2 text-center">アクション</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map(item => (
              <tr 
              key={`${item.id}-${item.code}`}
                className={`border-b border-gray-200 ${getRowStyle(item.zaiko_su, item.reorderPoint)}`}
              >
                <td className="p-2">{item.code}</td>
                <td className="p-2">{item.name}</td>
                <td className="p-2 text-right">{item.zaiko_su ? item.zaiko_su.toLocaleString() : ''}</td>
                <td className="p-2 text-center">{item.unit}</td>
                <td className="p-2 text-center">{item.price}</td>
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

export default ZaikoList;
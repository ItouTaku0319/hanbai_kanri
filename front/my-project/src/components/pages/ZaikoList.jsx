import React, { useState } from 'react';
import { Search } from "lucide-react";

const ZaikoList = () => {
  // 在庫データの状態管理
  const [inventory, setInventory] = useState([]);
  
  // 検索条件の状態管理
  const [searchCode, setSearchCode] = useState("");
  const [searchName, setSearchName] = useState("");
  const [zaikoSuMax, setZaikoSuMax] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [leftMatch, setLeftMatch] = useState(false); // 先頭一致検索用

  // 在庫状態に基づく行の色分け
  const getRowStyle = (zaiko_su, reorderPoint) => {
    if (zaiko_su <= reorderPoint) {
      return "bg-red-100";
    }
    return "";
  };

  // 検索APIを呼び出す関数
  const fetchProducts = async () => {
    try {
        const query = new URLSearchParams();
        
        if (searchCode) {
            query.append("code", searchCode);
            query.append("isLeftMatch", leftMatch); // true/false をそのまま送信
        }

        if (searchName) query.append("name", searchName);
        if (zaikoSuMax) query.append("zaikoSuMax", zaikoSuMax);
        if (lowStockOnly) query.append("lowStockOnly", lowStockOnly);

        const response = await fetch(`http://localhost:8080/zaiko?${query.toString()}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setInventory(
            data.map(item => ({
                id: item.id ?? 0,
                code: item.syohin_code ?? "",
                name: item.syohin_name ?? "",
                zaiko_su: item.zaiko_su ?? 0,
                unit: item.stock_unit ?? "",
                price: item.price ?? "",
                reorderPoint: item.reorder_point ?? 0
            }))
        );
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};


  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">在庫管理</h2>

        {/* 検索条件フォーム */}
        <div className="grid grid-cols-3 gap-4">
          {/* 商品コード */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="商品コード"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
            />
            <input
              type="checkbox"
              checked={leftMatch}
              onChange={(e) => setLeftMatch(e.target.checked)}
            />
            <span>先頭一致</span>
          </div>

          {/* 商品名 */}
          <input
            type="text"
            placeholder="商品名"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />

          {/* 在庫数以下 */}
          <input
            type="number"
            placeholder="在庫数以下"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={zaikoSuMax}
            onChange={(e) => setZaikoSuMax(e.target.value)}
          />
          
          {/* 在庫少ないチェックボックス */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) => setLowStockOnly(e.target.checked)}
            />
            <span>在庫が発注点の1.5倍以下</span>
          </label>
        </div>

        {/* 検索ボタン */}
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={fetchProducts}
          >
            検索
          </button>
        </div>
      </div>

      {/* 在庫一覧 */}
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
            {inventory.map(item => (
              <tr 
                key={`${item.id}-${item.code}`}
                className={`border-b border-gray-200 ${getRowStyle(item.zaiko_su, item.reorderPoint)}`}
              >
                <td className="p-2">{item.code}</td>
                <td className="p-2">{item.name}</td>
                <td className="p-2 text-right">{item.zaiko_su ? item.zaiko_su.toLocaleString() : ''}</td>
                <td className="p-2 text-center">{item.unit}</td>
                <td className="p-2 text-center">{item.price}</td>
                <td className="p-2 text-right">{item.reorderPoint}</td>
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

import React, { useState } from "react";
import InputField from "../common/InputField";
import SearchRow from "../common/SearchRow";
import CheckboxField from "../common/CheckboxField";
import Button from "../common/Button";
import Table from "../common/Table";

const ZaikoList = () => {
  // 在庫データの状態管理
  const [inventory, setInventory] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false); // 🔹 検索実行済みかどうかの状態

  // 検索条件の状態管理
  const [searchCode, setSearchCode] = useState("");
  const [searchName, setSearchName] = useState("");
  const [zaikoSuMax, setZaikoSuMax] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [leftMatch, setLeftMatch] = useState(false);

  const columns = [
    { key: "code", label: "商品コード" },
    { key: "name", label: "商品名" },
    { key: "zaiko_su", label: "在庫数", align: "text-right" },
    { key: "unit", label: "単位", align: "text-center" },
    { key: "price", label: "単価", align: "text-right" },
    { key: "reorderPoint", label: "発注点", align: "text-right" },
  ];

  const actions = [
    { label: "編集", onClick: (item) => console.log("編集", item) },
    { label: "入庫", onClick: (item) => console.log("入庫", item) },
    { label: "出庫", onClick: (item) => console.log("出庫", item) },
  ];

  // 🔹 在庫状態に基づく行の色分け
  const getRowStyle = (zaiko_su, reorderPoint) => {
    return zaiko_su <= reorderPoint ? "bg-red-100" : "";
  };

  // 🔹 検索APIを呼び出す関数 (ページネーション対応)
  const fetchProducts = async (page = 1, size = pageSize) => {
    try {
      const query = new URLSearchParams({
        page,
        pageSize: size,
      });

      if (searchCode) {
        query.append("code", searchCode);
        query.append("isLeftMatch", leftMatch);
      }
      if (searchName) query.append("name", searchName);
      if (zaikoSuMax) query.append("zaikoSuMax", zaikoSuMax);
      if (lowStockOnly) query.append("lowStockOnly", lowStockOnly);

      const response = await fetch(`http://localhost:8080/zaiko?${query.toString()}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setInventory(
        data.map((item) => ({
          id: item.id ?? 0,
          code: item.syohin_code ?? "",
          name: item.syohin_name ?? "",
          zaiko_su: item.zaiko_su ?? 0,
          unit: item.stock_unit ?? "",
          price: item.price ?? "",
          reorderPoint: item.reorder_point ?? 0,
        }))
      );
      setTotalRecords(data.length);
      setPageSize(size);
      setCurrentPage(page);
      setHasSearched(true); // 🔹 検索が実行されたことを記録
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 🔹 検索ボタンを押したときに `fetchProducts` を呼ぶ (ページを1にリセット)
  const handleSearch = () => {
    setCurrentPage(1);
    fetchProducts(1, pageSize);
  };

  return (
    <div className="w-full max-w-full mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">在庫検索</h2>

      <div className="space-y-4">
        <SearchRow cols={2}>
          <InputField 
            label="商品コード" 
            value={searchCode} 
            onChange={(e) => setSearchCode(e.target.value)} 
            className="48"
            rightElement={
              <CheckboxField label="先頭一致" checked={leftMatch} onChange={(e) => setLeftMatch(e.target.checked)} />
            }
          />
          <InputField label="商品名" value={searchName} onChange={(e) => setSearchName(e.target.value)} className="64" />
        </SearchRow>

        <SearchRow cols={2} hasSearchButton={true}>
          <InputField 
            label="在庫数以下" 
            type="number" 
            value={zaikoSuMax} 
            onChange={(e) => setZaikoSuMax(e.target.value)} 
            className="32"
            rightElement={
              <CheckboxField label="発注点の1.5倍以下" checked={lowStockOnly} onChange={(e) => setLowStockOnly(e.target.checked)} />
            }
          />
        </SearchRow>
        <Button label="検索" type="primary" onClick={handleSearch} />
      </div>

      {/* 🔹 検索実行後にテーブルを表示 */}
      {hasSearched && (
        <Table
          columns={columns}
          data={inventory}
          actions={actions}
          totalRecords={totalRecords}
          pageSize={pageSize}
          onPageChange={fetchProducts}
        />
      )}
    </div>
  );
};

export default ZaikoList;

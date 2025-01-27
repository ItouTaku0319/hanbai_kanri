import React, { useState, useEffect } from "react";
import InputField from "../../common/InputField";
import CheckboxField from "../../common/CheckboxField";
import Button from "../../common/Button";
import Table from "../../common/Table";
import ComboBox from "../../common/ComboBox";

const SyohinList = () => {
  // 商品データの状態管理
  const [syohin, setSyohin] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // 検索条件の状態管理
  const [searchCode, setSearchCode] = useState("");
  const [searchName, setSearchName] = useState("");
  const [leftMatch, setLeftMatch] = useState(false);
  const [syohinTypeFilter, setSyohinTypeFilter] = useState("all"); // "all", "product", "material"

  // 商品構成表示の状態管理
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [koseiData, setKoseiData] = useState({});

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const columns = [
    {
      id: "expander",
      header: "",
      cell: ({ row }) => (
        row.syohin_type && (  // 商品の場合のみ表示
          <button
            onClick={() => handleRowExpand(row.code)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {expandedRows.has(row.code) ? "▼" : "▶"}
          </button>
        )
      ),
      size: 40,
    },
    { accessorKey: "code", id: "code", header: "商品コード" },
    { accessorKey: "name", id: "name", header: "商品名" },
    { accessorKey: "price", id: "price", header: "単価" },
    { accessorKey: "type", id: "type", header: "商品素材区分" },
    { accessorKey: "categoryName", id: "categoryName", header: "商品カテゴリ" },
    { accessorKey: "subCategoryName", id: "subCategoryName", header: "商品サブカテゴリ" },
    { accessorKey: "unit", id: "unit", header: "単位" },
    { accessorKey: "safetyStock", id: "safetyStock", header: "安全在庫" },
    { accessorKey: "reorderPoint", id: "reorderPoint", header: "発注点" },
    // この次あたりに商品構成マスタからsyohin_codeで紐づけたsozai,sozai_suを表示するが、ない場合や複数ある場合が当然想定されるのでどう対応するべきか検討する
  ];

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
      if (syohinTypeFilter !== "all") {
        query.append("syohinType", syohinTypeFilter === "product" ? "true" : "false");
      }
      if (selectedCategory) {
        query.append("category", parseInt(selectedCategory.value, 10));
      }
      if (selectedSubCategory) {
        query.append("subCategory", parseInt(selectedSubCategory.value, 10));
      }

      const response = await fetch(`http://localhost:8080/syohin?${query.toString()}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setSyohin(
        data.map((item) => ({
          id: item.id ?? 0,
          code: item.syohin_code ?? "",
          name: item.syohin_name ?? "",
          price: item.price ?? "",
          syohin_type: item.syohin_type,
          type: item.syohin_type ? "製品" : "素材",
          categoryName: item.category_name ?? "",
          subCategoryName: item.sub_category_name ?? "",
          unit: item.stock_unit ?? "",
          safetyStock: item.safety_stock ?? "",
          reorderPoint: item.reorder_point ?? 0,
        }))
      );
      setTotalRecords(data.length);
      setPageSize(size);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // 🔹 検索ボタンを押したときに `fetchProducts` を呼ぶ (ページを1にリセット)
  const handleSearch = () => {
    setCurrentPage(1);
    fetchProducts(1, pageSize);
  };

  // 商品構成を取得する関数
  const fetchKosei = async (syohinCode) => {
    try {
      const response = await fetch(`http://localhost:8080/syohin/${syohinCode}/kosei`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching kosei:", error);
      return [];
    }
  };

  // 行の展開/折りたたみを処理
  const handleRowExpand = async (syohinCode) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(syohinCode)) {
      newExpandedRows.delete(syohinCode);
    } else {
      newExpandedRows.add(syohinCode);
      // 構成情報がまだ取得されていない場合のみ取得
      if (!koseiData[syohinCode]) {
        const data = await fetchKosei(syohinCode);
        setKoseiData(prev => ({
          ...prev,
          [syohinCode]: data
        }));
      }
    }
    setExpandedRows(newExpandedRows);
  };

  // カテゴリー一覧を取得
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/kbn/ITEM_CATEGORY');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setCategories(data.map(item => ({
        value: item.kbn_value,
        label: item.kbn_value_name
      })));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // サブカテゴリー一覧を取得
  const fetchSubCategories = async () => {
    try {
      const response = await fetch(`http://localhost:8080/kbn/ITEM_SUB_CATEGORY`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setSubCategories(data.map(item => ({
        value: item.kbn_value,
        label: item.kbn_value_name,
        category: item.category,     // カテゴリID (← APIが返すようにする)
      })));
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  // サブカテゴリー選択時にカテゴリーを自動選択
  const handleSubCategoryChange = (selectedSubCategory) => {
    setSelectedSubCategory(selectedSubCategory);
    
    if (selectedSubCategory) {
      const matchingCategory = subCategories.find(sub => sub.value === selectedSubCategory.value)?.category;
      if (matchingCategory) {
        console.log("Setting category to:", matchingCategory); // デバッグ用ログ
        setSelectedCategory(matchingCategory.toString());
      }
    }
  };

  // コンポーネントマウント時にカテゴリー一覧を取得
  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  return (
    <div className="w-full max-w-full mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">商品検索</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="商品コード"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            className="w-full"
            rightElement={
              <CheckboxField label="先頭一致" checked={leftMatch} onChange={(e) => setLeftMatch(e.target.checked)} />
            }
          />
          <InputField
            label="商品名"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ComboBox
            label="カテゴリー"
            options={categories}
            value={selectedCategory}
            onChange={setSelectedCategory}
            placeholder="カテゴリーを選択"
          />
          <ComboBox
            label="サブカテゴリー"
            options={subCategories}
            value={selectedSubCategory}
            onChange={handleSubCategoryChange}
            placeholder="サブカテゴリーを選択"
          />
        </div>
        {/* 商品素材区分の判断はラジオボタンで行う */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-700">商品素材区分</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="syohinType"
                  value="all"
                  checked={syohinTypeFilter === "all"}
                  onChange={(e) => setSyohinTypeFilter(e.target.value)}
                />
                <span className="ml-2">全て</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="syohinType"
                  value="product"
                  checked={syohinTypeFilter === "product"}
                  onChange={(e) => setSyohinTypeFilter(e.target.value)}
                />
                <span className="ml-2">商品のみ</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="syohinType"
                  value="material"
                  checked={syohinTypeFilter === "material"}
                  onChange={(e) => setSyohinTypeFilter(e.target.value)}
                />
                <span className="ml-2">素材のみ</span>
              </label>
            </div>
          </div>
        </div>
        <Button label="検索" type="primary" onClick={handleSearch} />
      </div>

      {/* 🔹 検索実行後にテーブルを表示 */}
      <Table
        columns={columns}
        data={syohin}
        pageSize={pageSize}
        totalRecords={totalRecords}
        onFetchData={(page, size) => fetchProducts(page, size)}
        renderSubComponent={({ row }) => {
          const koseiItems = koseiData[row.code] || [];
          return (
            <div className="px-4 py-2 bg-gray-50">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-2 py-1">素材コード</th>
                    <th className="px-2 py-1">素材名</th>
                    <th className="px-2 py-1">必要数</th>
                    <th className="px-2 py-1">単位</th>
                    <th className="px-2 py-1">カテゴリ</th>
                  </tr>
                </thead>
                <tbody>
                  {koseiItems.length > 0 ? (
                    koseiItems.map((kosei, index) => (
                      <tr key={`${kosei.sozai_code}-${index}`}>
                        <td className="px-2 py-1">{kosei.sozai_code}</td>
                        <td className="px-2 py-1">{kosei.sozai_name}</td>
                        <td className="px-2 py-1">{kosei.sozai_su}</td>
                        <td className="px-2 py-1">{kosei.sozai_unit}</td>
                        <td className="px-2 py-1">{kosei.category_name}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-2 py-1 text-center text-gray-500">
                        構成情報がありません
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          );
        }}
        expandedRows={expandedRows}
      />
    </div>
  );
};

export default SyohinList;

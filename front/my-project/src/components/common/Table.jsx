import React, { useState, useEffect } from "react";
import Button from "./Button";

const Table = ({ columns, data = [], actions, totalRecords = 0, pageSize = 10, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = totalRecords > 0 ? Math.ceil(totalRecords / pageSize) : 1;

  // 🔹 ページ変更時にデータを取得
  useEffect(() => {
    if (totalRecords > 0 && pageSize > 0) {
      onPageChange(currentPage, pageSize);
    }
  }, [currentPage, pageSize]);

  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div>
      {/* 🔹 テーブル本体 */}
      <div className="overflow-x-auto mt-6">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={`p-2 ${col.align || "text-left"}`}>
                  {col.label}
                </th>
              ))}
              {actions && <th className="p-2 text-center">アクション</th>}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-200 even:bg-gray-100">
                  {columns.map((col) => (
                    <td key={col.key} className={`p-2 ${col.align || "text-left"}`}>
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="p-2 text-center">
                      <div className="flex justify-center gap-2">
                        {actions.map((action, i) => (
                          <button
                            key={i}
                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                            onClick={() => action.onClick(item)}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center p-4 text-gray-500">
                  データがありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 ページネーションUI */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-gray-700">
          検索結果: <strong>{totalRecords}</strong> 件 / 全 <strong>{totalPages}</strong> ページ
        </p>
        <div className="flex items-center">
          <label className="mr-2 text-gray-700">1ページあたり</label>
          <select
            value={pageSize}
            onChange={(e) => {
              const newSize = Number(e.target.value);
              setCurrentPage(1); // 🔹 ページサイズ変更時に1ページ目へ戻る
              onPageChange(1, newSize);
            }}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="ml-2 text-gray-700">件</span>
        </div>
      </div>

      {/* 🔹 ページ切り替えボタン */}
      <div className="flex justify-center items-center space-x-4 mt-4">
        <Button label="前へ" type="default" onClick={goToPreviousPage} disabled={currentPage === 1} />
        <span>現在のページ: <strong>{currentPage}</strong> / {totalPages}</span>
        <Button label="次へ" type="default" onClick={goToNextPage} disabled={currentPage === totalPages} />
      </div>
    </div>
  );
};

export default Table;

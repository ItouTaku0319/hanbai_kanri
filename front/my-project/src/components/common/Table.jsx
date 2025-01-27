import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import Button from "./Button";

const Table = ({ columns, data, pageSize, onFetchData }) => {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageIndex: 0, pageSize } },
  });

  return (
    <div>
      {/* テーブル本体 */}
      <div className="overflow-x-auto mt-6">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <th
                    key={column.id}
                    className="p-2 cursor-pointer"
                    onClick={column.column.getToggleSortingHandler()}
                  >
                    {flexRender(column.column.columnDef.header, column.getContext())}
                    {column.column.getIsSorted() === "asc" ? " ▲" : column.column.getIsSorted() === "desc" ? " ▼" : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {data.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-200 even:bg-gray-100">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-4 text-center text-gray-500">
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ページネーション */}
      <div className="flex justify-between items-center mt-4">
        <Button label="前へ" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} />
        <span>現在のページ: <strong>{table.getState().pagination.pageIndex + 1}</strong></span>
        <Button label="次へ" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} />
        
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            const newSize = Number(e.target.value);
            table.setPageSize(newSize);
            // onFetchData(1, newSize); // 🔹 ページサイズ変更時に1ページ目へ戻る
          }}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value={4}>4</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>
    </div>
  );
};

export default Table;

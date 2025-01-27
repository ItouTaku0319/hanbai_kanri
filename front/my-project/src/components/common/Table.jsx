import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import Button from "./Button";

const Table = ({ columns, data, pageSize, totalRecords, onFetchData, renderSubComponent, expandedRows }) => {
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
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-2 cursor-pointer">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {data.map((row, i) => (
              <React.Fragment key={row.code || i}>
                <tr className="border-b">
                  {columns.map(column => (
                    <td key={column.id} className="px-6 py-4">
                      {column.cell ? column.cell({ row }) : row[column.accessorKey]}
                    </td>
                  ))}
                </tr>
                {expandedRows.has(row.code) && renderSubComponent && (
                  <tr>
                    <td colSpan={columns.length}>
                      {renderSubComponent({ row })}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
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

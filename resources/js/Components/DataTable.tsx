import React from "react";
import { Link } from "@inertiajs/react";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode; // optional custom rendering
  className?: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  links: PaginationLink[];
  emptyMessage?: string;
}

export default function DataTable<T extends { id: number }>({
  columns,
  data,
  links,
  emptyMessage = "No records found",
}: Props<T>) {
  return (
    <div>
      {/* Table */}
      <div className="overflow-x-auto dark:text-white bg-gray-200 dark:bg-gray-900 rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200  dark:bg-gray-900  border-b dark:border-gray-700 ">
              {columns.map((col) => (
                <th key={col.key.toString()} className={`p-3 dark:text-white ${col.className}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row) => (
                <tr key={row.id} className="border-t border-b-gray-100 bg-slate-50 dark:bg-gray-900  hover:bg-gray-100 dark:hover:bg-gray-700">
                  {columns.map((col) => (
                    <td key={col.key.toString()} className={`p-3 ${col.className}`}>
                      {col.render ? col.render(row) : (row[col.key as keyof T] as any)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-3 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        {links.map((link, i) =>
          link.url ? (
            <Link
              key={i}
              href={link.url}
              className={`px-3 py-1 border rounded ${
                link.active ? "bg-purple-700 text-white" : "bg-white"
              }`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ) : (
            <span
              key={i}
              className="px-3 py-1 text-gray-400 border rounded cursor-not-allowed"
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          )
        )}
      </div>
    </div>
  );
}

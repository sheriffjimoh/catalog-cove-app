import React, { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import { Search } from "lucide-react";

interface Column<T> {
    key: keyof T | string;
    label: string;
    render?: (row: T) => React.ReactNode;
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
    filters: { search?: string };
    searchLink: string;
}

export default function DataTable<T extends { id: number }>({
    columns,
    data,
    links,
    emptyMessage = "No records found",
    filters,
    searchLink,
}: Props<T>) {
    const [search, setSearch] = useState(filters.search || "");

    useEffect(() => {
        const delaySearch = setTimeout(() => {
            router.get(
                searchLink,
                { search },
                {
                    preserveState: true,
                    replace: true,
                }
            );
        }, 300);

        return () => clearTimeout(delaySearch);
    }, [search]);

    // Separate action column from data columns for mobile layout
    const dataColumns = columns.filter((col) => col.key !== "actions");
    const actionColumn = columns.find((col) => col.key === "actions");

    return (
        <div>
            <div className="relative mb-4">
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-700 focus:border-transparent dark:bg-gray-900 dark:text-white bg-white"
                />
            </div>

            {/* Desktop Table — hidden on mobile */}
            <div className="hidden md:block dark:text-white bg-gray-200 dark:bg-gray-900 rounded-lg shadow">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-200 dark:bg-gray-900 border-b dark:border-gray-700">
                            <th className="p-3 text-center text-gray-500 dark:text-gray-300">
                                #
                            </th>
                            {columns.map((col) => (
                                <th
                                    key={col.key.toString()}
                                    className={`p-3 dark:text-white ${col.className || ""}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <tr
                                    key={row.id}
                                    className="border-b bg-white dark:border-gray-700 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <td className="p-3 text-center text-gray-600 dark:text-gray-400">
                                        {rowIndex + 1}
                                    </td>
                                    {columns.map((col) => (
                                        <td
                                            key={col.key.toString()}
                                            className={`p-3 ${col.className || ""}`}
                                        >
                                            {col.render
                                                ? col.render(row)
                                                : (row[col.key as keyof T] as any)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length + 1}
                                    className="p-3 text-center text-gray-500"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card Layout — shown only on mobile */}
            <div className="md:hidden space-y-3">
                {data.length > 0 ? (
                    data.map((row, rowIndex) => (
                        <div
                            key={row.id}
                            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                                    #{rowIndex + 1}
                                </span>
                                {actionColumn && actionColumn.render && (
                                    <div>{actionColumn.render(row)}</div>
                                )}
                            </div>
                            <div className="space-y-2">
                                {dataColumns.map((col) => (
                                    <div
                                        key={col.key.toString()}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                            {col.label}
                                        </span>
                                        <span className="text-sm text-black dark:text-white font-medium text-right">
                                            {col.render
                                                ? col.render(row)
                                                : (row[col.key as keyof T] as any)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                        {emptyMessage}
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6 space-x-2">
                {links.map((link, i) =>
                    link.url ? (
                        <Link
                            key={i}
                            href={link.url}
                            className={`px-3 py-1 border rounded ${
                                link.active
                                    ? "bg-purple-700 text-white border-purple-700"
                                    : "bg-white dark:bg-gray-900 text-black dark:text-white border-gray-200 dark:border-gray-700"
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        <span
                            key={i}
                            className="px-3 py-1 text-gray-400 border border-gray-200 dark:border-gray-700 rounded cursor-not-allowed"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    )
                )}
            </div>
        </div>
    );
}

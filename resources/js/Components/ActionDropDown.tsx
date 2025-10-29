import Dropdown from "@/Components/Dropdown";
import { ChevronDown, Edit, Eye, Trash2, BookOpenCheck } from "lucide-react";

interface Props {
    row: { id: number, is_published: boolean };
    handleDelete: (id: number) => void;
}
export default function ActionDropDown({ row, handleDelete }: Props) {
    return (
        <div className="flex justify-end">
            <Dropdown>
                <Dropdown.Trigger>
                    <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                        Actions
                        <ChevronDown size={16} className="ml-1" />
                    </button>
                </Dropdown.Trigger>

                <Dropdown.Content
                    align="right"
                    contentClasses="py-1 bg-white dark:bg-slate-800"
                >
                    <Dropdown.Link
                        href={`/products/${row.id}/edit`}
                        className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                    >
                        <div className="flex items-center gap-2">
                            <Edit size={16} />
                            Edit
                        </div>
                    </Dropdown.Link>

                    <Dropdown.Link
                        href={`/products/${row.id}`}
                        className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                    >
                        <div className="flex items-center gap-2">
                            <Eye size={16} />
                            View
                        </div>
                    </Dropdown.Link>
                    <Dropdown.Link
                        href={`/products/${row.id}/toggle-publish`}
                        className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                    >
                        <div className="flex items-center gap-2">
                            <BookOpenCheck size={16} />
                            { row.is_published ? 'Unpublish' : 'Publish' }
                        </div>
                    </Dropdown.Link>

                    <div className="border-t border-gray-100 dark:border-slate-700 my-1"></div>

                    <button
                        onClick={() => handleDelete(row.id)}
                        className="w-full px-4 py-2 text-start text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition flex items-center gap-2"
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>
                </Dropdown.Content>
            </Dropdown>
        </div>
    );
}

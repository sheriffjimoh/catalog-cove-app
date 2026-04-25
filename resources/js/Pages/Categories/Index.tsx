import React, { useState } from "react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { Tag, Plus, Pencil, Trash2, GripVertical, X, Check, Package } from "lucide-react";

interface Category {
    id: number;
    name: string;
    slug: string;
    sort_order: number;
    products_count: number;
}

export default function CategoriesIndex({
    categories: initialCategories,
}: {
    categories: Category[];
}) {
    const [categories] = useState<Category[]>(initialCategories);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");
    const [showNew, setShowNew] = useState(false);

    const newForm = useForm({ name: "" });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newForm.data.name.trim()) return;
        newForm.post(route("categories.store"), {
            preserveScroll: true,
            onSuccess: () => {
                newForm.reset();
                setShowNew(false);
            },
        });
    };

    const startEdit = (cat: Category) => {
        setEditingId(cat.id);
        setEditName(cat.name);
    };

    const saveEdit = (cat: Category) => {
        if (!editName.trim() || editName === cat.name) {
            setEditingId(null);
            return;
        }
        router.put(
            route("categories.update", cat.id),
            { name: editName },
            {
                preserveScroll: true,
                onSuccess: () => setEditingId(null),
            }
        );
    };

    const handleDelete = (cat: Category) => {
        if (
            !confirm(
                `Delete "${cat.name}"? ${cat.products_count} product(s) will become uncategorized.`
            )
        )
            return;
        router.delete(route("categories.destroy", cat.id), {
            preserveScroll: true,
        });
    };

    return (
        <Authenticated>
            <Head title="Categories" />

            <div className="w-full xl:px-[48px] px-3 pb-6 xl:pb-[48px] sm:pt-[15px]">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Categories
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Organize your products into categories
                        </p>
                    </div>
                    <button
                        onClick={() => setShowNew(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
                    >
                        <Plus size={16} />
                        Add Category
                    </button>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="p-6 space-y-3">
                        {/* New Category Input */}
                        {showNew && (
                            <form
                                onSubmit={handleCreate}
                                className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
                            >
                                <Tag size={18} className="text-purple-600 flex-shrink-0" />
                                <input
                                    type="text"
                                    value={newForm.data.name}
                                    onChange={(e) => newForm.setData("name", e.target.value)}
                                    placeholder="Category name..."
                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={newForm.processing || !newForm.data.name.trim()}
                                    className="p-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 disabled:opacity-50 transition-colors"
                                >
                                    <Check size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowNew(false);
                                        newForm.reset();
                                    }}
                                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </form>
                        )}

                        {/* Category List */}
                        {categories.length === 0 && !showNew ? (
                            <div className="text-center py-20">
                                <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-3xl flex items-center justify-center mx-auto mb-5">
                                    <Tag className="h-10 w-10 text-purple-600" />
                                </div>
                                <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    No categories yet
                                </p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 max-w-sm mx-auto">
                                    Organize your products by creating categories. Customers can filter by category on your storefront.
                                </p>
                                <button
                                    onClick={() => setShowNew(true)}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
                                >
                                    <Plus size={16} />
                                    Create First Category
                                </button>
                            </div>
                        ) : (
                            categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700 group hover:border-purple-200 dark:hover:border-purple-800 transition-colors"
                                >
                                    <GripVertical
                                        size={18}
                                        className="text-gray-300 dark:text-gray-600 flex-shrink-0 cursor-grab"
                                    />

                                    {editingId === cat.id ? (
                                        <div className="flex-1 flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") saveEdit(cat);
                                                    if (e.key === "Escape") setEditingId(null);
                                                }}
                                                className="flex-1 px-3 py-1.5 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => saveEdit(cat)}
                                                className="p-1.5 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors"
                                            >
                                                <Check size={14} />
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex-1 min-w-0 flex items-center gap-3">
                                                <div className="w-9 h-9 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Tag size={16} className="text-purple-600" />
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white block">
                                                        {cat.name}
                                                    </span>
                                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                                        <Package size={11} />
                                                        {cat.products_count} product{cat.products_count !== 1 ? "s" : ""}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => startEdit(cat)}
                                                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                                                    title="Rename"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}

import React from "react";
import { Link, router, Head, usePage } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ActionDropDown from "@/Components/ActionDropDown";
import { AlertTriangle, ArrowUpRight } from "lucide-react";

interface Product {
  id: number;
  name: string;
  description?: string;
  price?: string;
  stock?: number;
  created_at: string;
  is_published: boolean;
}

interface Props {
  products: {
    data: Product[];
    links: { url: string | null; label: string; active: boolean }[];
  };
  filters: { search?: string };
}

export default function Index({ products, filters }: Props) {
  const { subscription } = usePage<{
    subscription?: {
      plan_name: string;
      plan_slug: string;
      product_limit: number | null;
      product_count: number;
      is_active: boolean;
    };
  }>().props;

  const isAtLimit = subscription?.product_limit !== null && subscription?.product_limit !== undefined
    && subscription.product_count >= subscription.product_limit;
  const isNearLimit = subscription?.product_limit !== null && subscription?.product_limit !== undefined
    && subscription.product_count >= subscription.product_limit * 0.8 && !isAtLimit;

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      router.delete(`/products/${id}`);
    }
  };

  return (
    <AuthenticatedLayout>
      <Head title="Products" />
      <div className="p-6 max-w-6xl mx-auto dark:bg-gray-800 bg-slate-50 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold dark:text-white text-black">Products</h1>
          <div className="flex items-center gap-3">
            {subscription?.product_limit !== null && subscription?.product_limit !== undefined && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {subscription.product_count}/{subscription.product_limit} used
              </span>
            )}
            <Link
              href="/products/create"
              className={`px-4 py-2 rounded-lg text-white transition-colors ${
                isAtLimit
                  ? "bg-gray-400 cursor-not-allowed pointer-events-none"
                  : "bg-purple-700 hover:bg-purple-800"
              }`}
            >
              + Add Product
            </Link>
          </div>
        </div>

        {/* At Limit Warning */}
        {isAtLimit && (
          <div className="mb-4 flex items-center justify-between gap-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-black dark:text-white flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-black dark:text-white">
                  Product limit reached
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  You've used all {subscription.product_limit} products on your {subscription.plan_name} plan.
                </p>
              </div>
            </div>
            <Link
              href="/select-plan"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0"
            >
              Upgrade
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Near Limit Warning */}
        {isNearLimit && (
          <div className="mb-4 flex items-center justify-between gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-purple-700 dark:text-purple-400 flex-shrink-0" />
              <p className="text-sm text-purple-700 dark:text-purple-300">
                You're approaching your product limit ({subscription!.product_count}/{subscription!.product_limit}).
                Consider upgrading for more capacity.
              </p>
            </div>
            <Link
              href="/select-plan"
              className="text-sm text-purple-700 dark:text-purple-400 hover:underline font-medium flex-shrink-0"
            >
              Upgrade →
            </Link>
          </div>
        )}

        {/* Generic Table */}
        <DataTable<Product>
          filters={filters}
          searchLink="/products"
          columns={[
            { key: "name", label: "Name" },
            { key: "price", label: "Price" },
            {
              key: "is_published",
              label: "Published",
              render: (row) => (
                <span className={row.is_published ? 'text-purple-700 font-semibold' : 'text-gray-500 font-semibold'}>
                  {row.is_published ? 'Yes' : 'No'}
                </span>
              ),
            },
            { key: "stock", label: "Stock" },
            {
              key: "created_at",
              label: "Created",
              render: (row) =>
                new Date(row.created_at).toLocaleDateString(),
            },
            {
              key: "actions",
              label: "Actions",
              render: (row) => (
                <ActionDropDown row={row} handleDelete={handleDelete} />
              ),
              className: "text-right",
            },
          ]}
          data={products.data}
          links={products.links}
          emptyMessage="No products found"
        />
      </div>
    </AuthenticatedLayout>
  );
}

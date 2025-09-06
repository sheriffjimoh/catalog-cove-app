import React from "react";
import { Link, useForm, router, Head } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import  AuthenticatedLayout  from "@/Layouts/AuthenticatedLayout";
import { TextInput } from "@/Components/TextInput";

interface Product {
  id: number;
  name: string;
  description?: string;
  price?: string;
  stock?: number;
  created_at: string;
}

interface Props {
  products: {
    data: Product[];
    links: { url: string | null; label: string; active: boolean }[];
  };
  filters: { search?: string };
}

export default function Index({ products, filters }: Props) {
  const { data, setData } = useForm({ search: filters.search || "" });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get("/products", { search: data.search }, { preserveState: true });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      router.delete(`/products/${id}`);
    }
  };

  return (
    <AuthenticatedLayout>
    <Head title="Products" />
    <div className="p-6 max-w-6xl mx-auto dark:bg-gray-800 bg-gray-100 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white  text-black">Products</h1>
        <Link
          href="/products/create"
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          + Add Product
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-4">
        <TextInput
          type="text"
          placeholder="Search products..."
          value={data.search}
          onChange={(e) => setData("search", e.target.value)}
          className="w-full border rounded p-2"
        />
      </form>

      {/* Generic Table */}
      <DataTable<Product>
        columns={[
          { key: "name", label: "Name" },
          { key: "price", label: "Price" },
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
              <div className="space-x-2 text-right">
                <Link
                  href={`/products/create?id=${row.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(row.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
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

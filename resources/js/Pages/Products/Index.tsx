import React, { useEffect, useState} from "react";
import { Link, useForm, router, Head } from "@inertiajs/react";
import DataTable from "@/Components/DataTable";
import  AuthenticatedLayout  from "@/Layouts/AuthenticatedLayout";
import { TextInput } from "@/Components/TextInput";
import ActionDropDown from "@/Components/ActionDropDown";

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
          className="px-4 py-2 bg-purple-700 text-white rounded-lg"
        >
          + Add Product
        </Link>
      </div>

      {/* Generic Table */}
      <DataTable<Product>
        filters={filters}
        searchLink="/products"
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

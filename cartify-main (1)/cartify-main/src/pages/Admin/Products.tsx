import { useEffect, useMemo, useState } from "react";
import {
  getMyProductsApi,
  deleteProductApi,
} from "../../services/product.api";
import toast from "react-hot-toast";
import AddProductModal from "../../components/admin/AddProductModal";

import {
  Add,
  Edit,
  Delete,
  Search,
  Inventory2,
  Sell,
  Category,
  CurrencyRupee,
  Visibility,
} from "@mui/icons-material";

interface Product {
  _id: string;
  title: string;
  brand: string;
  category: string;
  description: string;
  mrp: number;
  sellingPrice: number;
  quantity: number;
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK";
  images?: { url: string; publicId?: string }[];
  sku?: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getMyProductsApi();
      setProducts(res?.data || []);
    } catch {
      toast.error("Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    try {
      setDeletingId(id);
      await deleteProductApi(id);
      toast.success("Deleted 🗑️");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error("Failed ❌");
    } finally {
      setDeletingId(null);
    }
  };

  const total = products.length;
  const inStock = products.filter((p) => p.stockStatus === "IN_STOCK").length;
  const outStock = products.filter(
    (p) => p.stockStatus === "OUT_OF_STOCK"
  ).length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 text-white">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Inventory2 /> Product Management
        </h2>

        <button
          onClick={() => {
            setEditData(null);
            setOpen(true);
          }}
          className="bg-blue-600 px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-blue-500 transition shadow-md"
        >
          <Add fontSize="small" /> Add Product
        </button>
      </div>

      {/* 🔥 STATS */}
      <div className="grid md:grid-cols-3 gap-6">
        <Stat title="Total Products" value={total} variant="blue" />
        <Stat title="In Stock" value={inStock} variant="green" />
        <Stat title="Out of Stock" value={outStock} variant="red" />
      </div>

      {/* 🔥 SEARCH */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 text-gray-400" />
        <input
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 pl-10 pr-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* 🔥 LIST */}
      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[260px] bg-gray-800 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400 text-center py-10">
          No products found 😕
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div
              key={p._id}
              className="bg-[#020617] p-4 rounded-xl border border-gray-800 hover:border-blue-500 transition flex flex-col group"
            >
              {/* IMAGE */}
              <div className="relative h-[180px] flex items-center justify-center bg-gray-900 rounded-lg overflow-hidden">
                <img
                  src={p.images?.[0]?.url || "https://via.placeholder.com/200"}
                  className="h-full object-contain group-hover:scale-105 transition"
                />

                {/* QUICK ACTION */}
                <button className="absolute top-2 right-2 bg-black/60 p-1 rounded opacity-0 group-hover:opacity-100 transition">
                  <Visibility fontSize="small" />
                </button>
              </div>

              {/* CONTENT */}
              <div className="mt-3 flex-1 space-y-1">

                <h3 className="font-semibold text-sm line-clamp-2">
                  {p.title}
                </h3>

                {/* SKU */}
                {p.sku && (
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Sell fontSize="inherit" /> {p.sku}
                  </p>
                )}

                {/* CATEGORY */}
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Category fontSize="inherit" /> {p.category}
                </p>

                {/* PRICE */}
                <p className="text-green-400 font-bold flex items-center gap-1">
                  <CurrencyRupee fontSize="inherit" />
                  {p.sellingPrice.toLocaleString("en-IN")}
                </p>

                {/* STOCK */}
                <span
                  className={`inline-block text-xs px-2 py-1 rounded ${
                    p.stockStatus === "IN_STOCK"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {p.stockStatus === "IN_STOCK"
                    ? "In Stock"
                    : "Out of Stock"}
                </span>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setEditData(p);
                    setOpen(true);
                  }}
                  className="flex-1 bg-yellow-500 py-1.5 rounded flex items-center justify-center gap-1 text-sm hover:bg-yellow-400 transition"
                >
                  <Edit fontSize="small" /> Edit
                </button>

                <button
                  onClick={() => handleDelete(p._id)}
                  disabled={deletingId === p._id}
                  className="flex-1 bg-red-500 py-1.5 rounded flex items-center justify-center gap-1 text-sm hover:bg-red-400 transition disabled:opacity-50"
                >
                  <Delete fontSize="small" />
                  {deletingId === p._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <AddProductModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditData(null);
        }}
        refresh={fetchProducts}
        editData={editData}
      />
    </div>
  );
};

/* 🔥 STAT CARD */
const Stat = ({
  title,
  value,
  variant,
}: {
  title: string;
  value: number;
  variant: "blue" | "green" | "red";
}) => {
  const styles = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    red: "bg-red-600",
  };

  return (
    <div className={`${styles[variant]} p-5 rounded-xl shadow-lg`}>
      <p className="text-sm opacity-80">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default Products;
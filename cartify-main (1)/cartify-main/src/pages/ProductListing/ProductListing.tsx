import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getProductsApi } from "../../services/product.api";
import { AppLoader } from "../../components/ui/AppLoader/AppLoader";
import { ProductCard } from "../../components/common/ProductCard/ProductCard";

interface Product {
  _id: string;
  title: string;
  sellingPrice: number;
  mrp: number;
  images: string[];
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK";
}

interface Pagination {
  page: number;
  pages: number;
}

const ProductListing = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const page = Number(searchParams.get("page") || 1);

  // 🔥 reusable param setter
  const updateParams = useCallback(
    (
      newParams: Partial<{
        search: string;
        category: string;
        sort: string;
        page: string;
      }>,
    ) => {
      setSearchParams({
        search,
        category,
        sort,
        page: String(page),
        ...newParams,
      });
    },
    [search, category, sort, page, setSearchParams],
  );

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await getProductsApi({
          page,
          limit: 12,
          search,
          category,
          sort,
        });

        const rawList = res?.data?.products ?? [];

        const list: Product[] = rawList.map((item: any) => ({
          _id: item._id,
          title: item.title,
          sellingPrice: item.sellingPrice,
          mrp: item.mrp,

          // 🔥 CRITICAL FIX
          images: Array.isArray(item.images)
            ? item.images.map((img: any) => img.url)
            : [],

          stockStatus: item.stockStatus,
        }));
        const paginationData: Pagination = res?.data?.pagination ?? {
          page: 1,
          pages: 1,
        };

        if (isMounted) {
          setProducts(list);
          setPagination(paginationData);
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [search, category, sort, page]);

  const isEmpty = !loading && products.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 mt-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Products ({products.length})</h2>

        {/* SORT */}
        <select
          value={sort}
          onChange={(e) =>
            updateParams({
              sort: e.target.value,
              page: "1",
            })
          }
          className="bg-white text-black border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sort</option>
          <option value="price_asc">Price Low → High</option>
          <option value="price_desc">Price High → Low</option>
        </select>
      </div>

      {/* PRODUCTS */}
      {loading ? (
        <AppLoader />
      ) : isEmpty ? (
        <div className="text-center py-10">
          <p className="text-lg text-gray-500">No products found 😕</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <ProductCard
              key={item._id}
              id={item._id}
              title={item.title}
              price={item.sellingPrice}
              originalPrice={item.mrp}
              images={item.images}
              stockStatus={
                item.stockStatus === "OUT_OF_STOCK"
                  ? "OUT_OF_STOCK"
                  : "IN_STOCK"
              }
            />
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {!loading && !isEmpty && pagination && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() =>
              updateParams({
                page: String(Math.max(1, page - 1)),
              })
            }
            disabled={page <= 1}
            className={`px-4 py-2 rounded ${
              page <= 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            Prev
          </button>

          <span className="text-sm font-medium">
            Page {page} of {pagination.pages}
          </span>

          <button
            onClick={() =>
              updateParams({
                page: String(page + 1),
              })
            }
            disabled={page >= pagination.pages}
            className={`px-4 py-2 rounded ${
              page >= pagination.pages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductListing;

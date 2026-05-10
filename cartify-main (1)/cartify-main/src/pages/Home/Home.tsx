import { useEffect, useState } from "react";
import HeroCarousel from "../../components/common/HeroCarousel/HeroCarousel";
import HomeContent from "../../components/common/HomeContent/HomeContent";
import { getProductsApi } from "../../services/product.api";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { ProductCard } from "../../components/common/ProductCard/ProductCard";

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  images: string[];
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK";
  rating: number;
  badge?: "BEST_SELLER" | "TRENDING";
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  useEffect(() => {
    if (isLoggedIn && user?.role === "ADMIN") {
      navigate("/admin", { replace: true });
    }
  }, [isLoggedIn, user, navigate]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        const res = await getProductsApi({
          page: 1,
          limit: 20,
          search,
          category, // 🔥 ADD THIS
        });

        const list = res?.data?.products || [];

        console.log("API PRODUCTS:", list); // 🔥 DEBUG
        const mapped: Product[] = list.map((item: any) => ({
          id: item._id,
          title: item.title,
          price: item.sellingPrice,
          originalPrice: item.mrp,

          // 🔥 FIXED PROPERLY
          images: Array.isArray(item.images)
            ? item.images.map((img: any) => img.url)
            : [],

          stockStatus: item.stockStatus,
          rating: Math.round(item.rating || 4),

          badge:
            item.sellingPrice < 600
              ? "BEST_SELLER"
              : item.rating > 4
                ? "TRENDING"
                : undefined,
        }));
        console.log("MAPPED:", mapped); // 🔥 DEBUG

        setProducts(mapped);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [search, category]); // 🔥 IMPORTANT
  const isEmpty = !loading && products.length === 0;

  return (
    <div className="space-y-6">
      <HeroCarousel />

      <div className="max-w-[1280px] mx-auto px-4">
        {loading ? (
          <p>Loading...</p>
        ) : isEmpty ? (
          <p>No products</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {products.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        )}
      </div>

      <HomeContent />
    </div>
  );
};

export default Home;

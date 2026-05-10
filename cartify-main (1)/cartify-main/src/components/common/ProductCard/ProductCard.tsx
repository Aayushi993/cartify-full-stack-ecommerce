import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { Star, ShoppingCart } from "@mui/icons-material";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  images?: string[];
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK";
  rating?: number;
  badge?: "BEST_SELLER" | "TRENDING";
}

export const ProductCard = ({
  id,
  title,
  price,
  originalPrice,
  images = [],
  stockStatus,
  rating = 4,
  badge,
}: ProductCardProps) => {
  const navigate = useNavigate();
  const [hoverIndex, setHoverIndex] = useState(0);

  const handleNavigate = useCallback(() => {
    navigate(`/product/${id}`);
  }, [navigate, id]);

  const isOutOfStock = stockStatus === "OUT_OF_STOCK";

  // 🔥 SAFE IMAGE ARRAY (IMPORTANT)
  const safeImages =
    images && images.length > 0
      ? images
      : ["https://via.placeholder.com/300x300?text=No+Image"];

  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  return (
    <div
      onClick={handleNavigate}
      onMouseEnter={() => {
        if (safeImages.length > 1) setHoverIndex(1);
      }}
      onMouseLeave={() => setHoverIndex(0)}
      className="relative bg-white rounded-2xl shadow-sm p-4 cursor-pointer hover:shadow-lg transition group"
    >
      {/* BADGES */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {badge === "BEST_SELLER" && (
          <span className="bg-yellow-500 text-white text-[10px] px-2 py-1 rounded">
            Best Seller
          </span>
        )}
        {badge === "TRENDING" && (
          <span className="bg-purple-600 text-white text-[10px] px-2 py-1 rounded">
            Trending
          </span>
        )}
        {discount > 0 && (
          <span className="bg-green-600 text-white text-[10px] px-2 py-1 rounded">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* IMAGE */}
      <div className="relative h-[200px] flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden p-2">
        <img
  src={
    safeImages[hoverIndex]?.startsWith("http")
      ? safeImages[hoverIndex]
      : safeImages[0]
  }
  alt={title}
  onError={(e) => {
    e.currentTarget.src =
      "https://via.placeholder.com/300x300?text=No+Image";
  }}
  className={`h-full w-full object-contain transition duration-300 ${
    isOutOfStock ? "opacity-40" : ""
  }`}
/>

        {/* DOTS */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-2 flex gap-1">
            {safeImages.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === hoverIndex ? "bg-black" : "bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}

        {/* OUT OF STOCK */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-red-600 text-white text-xs px-3 py-1 rounded">
              Out of Stock
            </span>
          </div>
        )}

        {/* ADD TO CART */}
        {!isOutOfStock && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Add to cart");
            }}
            className="absolute bottom-2 right-2 bg-white shadow-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            <ShoppingCart fontSize="small" />
          </button>
        )}
      </div>

      {/* CONTENT */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
          {title}
        </h3>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-primary font-bold text-base">
            ₹{price.toLocaleString()}
          </span>

          {originalPrice && (
            <span className="text-gray-400 line-through text-sm">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* RATING */}
        <div className="flex items-center gap-1 mt-1 text-yellow-500 text-sm">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              fontSize="inherit"
              className={i < rating ? "text-yellow-500" : "text-gray-300"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
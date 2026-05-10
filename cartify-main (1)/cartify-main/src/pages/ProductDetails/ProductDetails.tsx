import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getSingleProductApi } from "../../services/product.api";
import { getReviewsApi } from "../../services/review.api";

import { AppLoader } from "../../components/ui/AppLoader/AppLoader";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";

import { openAuth } from "../../features/ui/uiSlice";
import { addToCartApi, getCartApi } from "../../services/cart.api";
import { setCart, openCart } from "../../features/cart/cartSlice";

import { ShoppingCart, Star } from "@mui/icons-material";

import RatingBreakdown from "../../components/review/RatingBreakdown";
import { ReviewForm } from "../../components/review/ReviewForm";
import ReviewList from "../../components/review/ReviewList";

const ProductDetails = () => {
  const { id } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);

  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<any>({});
  const [cartLoading, setCartLoading] = useState(false);
  const [flyImage, setFlyImage] = useState(false);

  const [refreshReviews, setRefreshReviews] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshReviews((p) => !p);
  }, []);

  // 🔥 LOAD PRODUCT
  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        setLoading(true);
        const res = await getSingleProductApi(id);
        setProduct(res.data);
      } catch {
        toast.error("Failed ❌");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // 🔥 LOAD REVIEWS
  useEffect(() => {
    if (!id) return;

    const loadReviews = async () => {
      try {
        const res = await getReviewsApi(id);
        setReviews(res ?? []);
      } catch {
        toast.error("Reviews failed ❌");
      }
    };

    loadReviews();
  }, [id, refreshReviews]);

  if (loading || !product) return <AppLoader />;

  const images = product.images?.map((i: any) => i.url) || [];
  const isOutOfStock = product.quantity === 0;

  // 🛒 ADD TO CART
  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      dispatch(openAuth("login"));
      return;
    }

    try {
      setCartLoading(true);

      await addToCartApi(product._id);
      const cart = await getCartApi();

      dispatch(
        setCart(
          (cart?.items ?? []).map((i: any) => ({
            id: i.productId._id,
            title: i.productId.title,
            price: i.priceAtThatTime,
            qty: i.quantity,
            image: i.productId.images?.[0]?.url,
          }))
        )
      );

      dispatch(openCart());
      toast.success("Added 🛒");
    } catch {
      toast.error("Failed ❌");
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-6 space-y-10">

      {/* 🔥 PRODUCT */}
      <div className="grid md:grid-cols-2 gap-10">

        {/* LEFT */}
        <div className="relative space-y-4">

          {/* 🔥 FLY ANIMATION */}
          {flyImage && (
            <img
              src={images[currentIndex]}
              className="fixed z-[9999] w-20 h-20 animate-fly"
              style={{ top: "45%", left: "45%" }}
            />
          )}

          {/* IMAGE */}
          <div
            className="h-[400px] bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;

              setZoomStyle({
                transformOrigin: `${x}% ${y}%`,
                transform: "scale(2)",
              });
            }}
            onMouseLeave={() => setZoomStyle({ transform: "scale(1)" })}
          >
            <img
              src={images[currentIndex]}
              className="max-h-full object-contain"
              style={zoomStyle}
            />
          </div>

          {/* THUMB */}
          <div className="flex gap-2 justify-center">
            {images.map((img: string, i: number) => (
              <img
                key={i}
                src={img}
                onClick={() => setCurrentIndex(i)}
                className={`w-14 h-14 border rounded cursor-pointer ${
                  i === currentIndex ? "border-blue-500" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-5 sticky top-[90px]">

          <h1 className="text-2xl font-semibold">{product.title}</h1>

          {/* ⭐ PRODUCT RATING */}
          <div className="flex items-center gap-2">
            <span className="bg-green-600 text-white px-2 py-1 rounded flex items-center gap-1">
              {product.rating ?? 0}
              <Star fontSize="small" />
            </span>
            <span className="text-gray-500">
              ({product.reviewCount ?? 0} reviews)
            </span>
          </div>

          {/* ⭐ USER RATING */}
          <div>
            <p className="text-sm font-medium">Rate this product</p>
            <div className="flex">
              {[1,2,3,4,5].map((star) => (
                <Star
                  key={star}
                  onClick={() => setUserRating(star)}
                  className={`cursor-pointer ${
                    star <= userRating
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* PRICE */}
          <div>
            <p className="text-3xl font-bold">₹{product.sellingPrice}</p>
            <p className="line-through text-gray-400">₹{product.mrp}</p>
          </div>

          {/* STOCK */}
          <p className={isOutOfStock ? "text-red-500" : "text-green-600"}>
            {isOutOfStock ? "Out of Stock" : "In Stock"}
          </p>

          {/* DESC */}
          <p className="text-gray-600 text-sm">{product.description}</p>

          {/* BUTTON */}
          <button
            onClick={async () => {
              setFlyImage(true);
              await handleAddToCart();
              setTimeout(() => setFlyImage(false), 700);
            }}
            disabled={isOutOfStock || cartLoading}
            className="w-full bg-yellow-500 text-white py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <ShoppingCart />
            {cartLoading ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* 🔥 REVIEWS */}
      <div className="space-y-6 border-t pt-6">

        <RatingBreakdown reviews={reviews} />

        {isLoggedIn && (
          <ReviewForm
            productId={product._id}
            onSuccess={triggerRefresh}
            reviews={reviews}
            userId={user?._id || user?.id}
          />
        )}

        <ReviewList reviews={reviews} refresh={triggerRefresh} />
      </div>
    </div>
  );
};

export default ProductDetails;
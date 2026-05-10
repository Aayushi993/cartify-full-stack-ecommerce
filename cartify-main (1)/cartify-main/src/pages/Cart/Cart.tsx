// import { useDispatch, useSelector } from "react-redux";
// import type { RootState, AppDispatch } from "../../app/store";
// import {
//   increaseQty,
//   decreaseQty,
//   removeItem,
// } from "../../features/cart/cartSlice";
// import {
//   updateCartQtyApi,
//   removeCartItemApi,
// } from "../../services/cart.api";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import toast from "react-hot-toast";

// const Cart = () => {
//   const { items } = useSelector((state: RootState) => state.cart);
//   const dispatch = useDispatch<AppDispatch>();
//   const navigate = useNavigate();

//   const [loadingId, setLoadingId] = useState<string | null>(null);

//   const total = items.reduce(
//     (sum, item) => sum + item.price * item.qty,
//     0
//   );

//   const handleIncrease = async (id: string, qty: number) => {
//     try {
//       setLoadingId(id);
//       dispatch(increaseQty(id));
//       await updateCartQtyApi(id, qty + 1);
//     } catch {
//       toast.error("Update failed ❌");
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   const handleDecrease = async (id: string, qty: number) => {
//     if (qty === 1) return;

//     try {
//       setLoadingId(id);
//       dispatch(decreaseQty(id));
//       await updateCartQtyApi(id, qty - 1);
//     } catch {
//       toast.error("Update failed ❌");
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   const handleRemove = async (id: string) => {
//     try {
//       setLoadingId(id);
//       dispatch(removeItem(id));
//       await removeCartItemApi(id);
//     } catch {
//       toast.error("Remove failed ❌");
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   return (
//     <div className="max-w-[1100px] mx-auto p-4 grid md:grid-cols-3 gap-6">
//       <div className="mb-4">
//         <button
//           onClick={() => navigate(-1)}
//           className="text-primary font-semibold"
//         >
//           ← Continue Shopping
//         </button>
//       </div>

//       {/* LEFT */}
//       <div className="md:col-span-2 space-y-4">
//         {items.length === 0 ? (
//           <div className="text-center py-10">
//             <p className="text-gray-500 mb-4">Your cart is empty 🛒</p>
//             <button
//               onClick={() => navigate("/")}
//               className="bg-primary text-white px-6 py-2 rounded-lg"
//             >
//               Shop Now
//             </button>
//           </div>
//         ) : (
//           items.map((item) => (
//             <div
//               key={item.id}
//               className="flex gap-4 bg-white p-4 rounded-xl shadow-card"
//             >
//               <img
//                 src={
//                   item.image ??
//                   "https://dummyimage.com/100x100/ccc/000&text=No+Img"
//                 }
//                 alt="product"
//                 className="w-[90px] h-[110px] object-cover rounded"
//               />

//               <div className="flex-1">
//                 <h3 className="font-semibold text-sm">{item.title}</h3>
//                 <p className="text-lg font-bold mt-1">₹{item.price}</p>

//                 <div className="flex items-center gap-2 mt-3">
//                   <button
//                     onClick={() => handleDecrease(item.id, item.qty)}
//                     disabled={loadingId === item.id}
//                   >
//                     -
//                   </button>

//                   <span>{item.qty}</span>

//                   <button
//                     onClick={() => handleIncrease(item.id, item.qty)}
//                     disabled={loadingId === item.id}
//                   >
//                     +
//                   </button>
//                 </div>

//                 <button
//                   onClick={() => handleRemove(item.id)}
//                   className="text-red-500 text-sm mt-2"
//                   disabled={loadingId === item.id}
//                 >
//                   Remove
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* RIGHT */}
//       <div className="bg-white p-4 rounded-xl shadow-card h-fit">
//         <h2 className="font-semibold mb-4">Price Details</h2>

//         <div className="flex justify-between mb-2">
//           <span>Total</span>
//           <span>₹{total}</span>
//         </div>

//         <button
//           onClick={() => navigate("/checkout")}
//           className="w-full mt-4 bg-primary text-white py-2 rounded-lg"
//         >
//           Checkout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Cart;

import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import {
  increaseQty,
  decreaseQty,
  removeItem,
} from "../../features/cart/cartSlice";
import {
  updateCartQtyApi,
  removeCartItemApi,
} from "../../services/cart.api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { Add, Remove, Delete } from "@mui/icons-material";

const Cart = () => {
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [loadingId, setLoadingId] = useState<string | null>(null);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handleIncrease = async (id: string, qty: number) => {
    try {
      setLoadingId(id);
      dispatch(increaseQty(id));
      await updateCartQtyApi(id, qty + 1);
    } catch {
      toast.error("Update failed ❌");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDecrease = async (id: string, qty: number) => {
    if (qty === 1) return;

    try {
      setLoadingId(id);
      dispatch(decreaseQty(id));
      await updateCartQtyApi(id, qty - 1);
    } catch {
      toast.error("Update failed ❌");
    } finally {
      setLoadingId(null);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm("Remove this item?")) return;

    try {
      setLoadingId(id);
      dispatch(removeItem(id));
      await removeCartItemApi(id);
      toast.success("Removed 🗑️");
    } catch {
      toast.error("Remove failed ❌");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto p-4 grid md:grid-cols-3 gap-6">

      {/* 🔙 BACK */}
      <div className="md:col-span-3">
        <button
          onClick={() => navigate(-1)}
          className="text-primary font-medium hover:underline"
        >
          ← Continue Shopping
        </button>
      </div>

      {/* LEFT */}
      <div className="md:col-span-2 space-y-4">

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow">
            <p className="text-gray-500 text-lg mb-4">
              Your cart is empty 🛒
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90"
            >
              Shop Now
            </button>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 bg-white p-4 rounded-xl shadow hover:shadow-md transition"
            >
              {/* IMAGE */}
              <img
                src={
                  item.image ??
                  "https://dummyimage.com/100x100/ccc/000&text=No+Img"
                }
                className="w-[100px] h-[120px] object-contain rounded"
              />

              {/* CONTENT */}
              <div className="flex-1 flex flex-col justify-between">

                <div>
                  <h3 className="font-medium text-sm line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-lg font-bold mt-1">
                    ₹{item.price}
                  </p>
                </div>

                {/* QTY + REMOVE */}
                <div className="flex items-center justify-between mt-3">

                  {/* QTY CONTROL */}
                  <div className="flex items-center border rounded-lg overflow-hidden">
                    <button
                      onClick={() =>
                        handleDecrease(item.id, item.qty)
                      }
                      disabled={loadingId === item.id}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      <Remove fontSize="small" />
                    </button>

                    <span className="px-4 text-sm">
                      {item.qty}
                    </span>

                    <button
                      onClick={() =>
                        handleIncrease(item.id, item.qty)
                      }
                      disabled={loadingId === item.id}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      <Add fontSize="small" />
                    </button>
                  </div>

                  {/* REMOVE */}
                  <button
                    onClick={() => handleRemove(item.id)}
                    disabled={loadingId === item.id}
                    className="text-red-500 text-sm flex items-center gap-1 hover:underline"
                  >
                    <Delete fontSize="small" />
                    Remove
                  </button>
                </div>

                {loadingId === item.id && (
                  <p className="text-xs text-gray-400 mt-1">
                    Updating...
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* RIGHT */}
      {items.length > 0 && (
        <div className="bg-white p-5 rounded-xl shadow sticky top-[90px] h-fit">

          <h2 className="font-semibold mb-4 text-lg">
            Price Details
          </h2>

          <div className="flex justify-between mb-2 text-sm">
            <span>Items ({items.length})</span>
            <span>₹{total}</span>
          </div>

          <div className="flex justify-between mb-2 text-sm text-green-600">
            <span>Discount</span>
            <span>- ₹{Math.round(total * 0.1)}</span>
          </div>

          <hr className="my-3" />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total Amount</span>
            <span>₹{total - Math.round(total * 0.1)}</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full mt-5 bg-primary text-white py-3 rounded-lg hover:opacity-90 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
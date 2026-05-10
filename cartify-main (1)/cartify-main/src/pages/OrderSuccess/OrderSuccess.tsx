import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "../../features/cart/cartSlice";
import { useNavigate, useLocation } from "react-router-dom";
import type { AppDispatch } from "../../app/store";

interface Order {
  _id: string;
  totalAmount: number;
}

const OrderSuccess = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as Order | null;

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  if (!state) {
    return (
      <div className="text-center mt-20">
        <p>No order found</p>
        <button onClick={() => navigate("/orders")}>
          View Orders
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-20 gap-3">
      <h2 className="text-xl font-bold">🎉 Order Placed</h2>
      <p>Order ID: {state._id}</p>
      <p>Total: ₹{state.totalAmount}</p>

      <button
        onClick={() => navigate("/")}
        className="bg-primary text-white px-4 py-2 rounded"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderSuccess;
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  loginSuccess,
  logout,
  setAuthChecked,
} from "./features/auth/authSlice";
import { setCart } from "./features/cart/cartSlice";
import { getCartApi } from "./services/cart.api";
import type { AppDispatch } from "./app/store";
import { isTokenExpired } from "./utils/auth.utils";

const AppInitializer = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const init = async () => {
      try {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (token && isTokenExpired(token)) {
          dispatch(logout());
          return;
        }

        if (token && user) {
          let parsedUser;

          try {
            parsedUser = JSON.parse(user);
          } catch {
            console.warn("Invalid user data in localStorage");
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            return;
          }

          dispatch(loginSuccess(parsedUser));

          try {
            const cart = await getCartApi();

            const mappedCart =
              cart?.items?.map((item: any) => ({
                id: item.productId?._id,
                title: item.productId?.title,
                price: item.priceAtThatTime,
                qty: item.quantity,
                image: item.productId?.images?.[0]?.url,
              })) || [];

            dispatch(setCart(mappedCart));
          } catch (error) {
            console.error("Cart load failed", error);
            dispatch(setCart([]));
          }
        }
      } finally {
        dispatch(setAuthChecked());
      }
    };

    init();
  }, [dispatch]);

  return null;
};

export default AppInitializer;
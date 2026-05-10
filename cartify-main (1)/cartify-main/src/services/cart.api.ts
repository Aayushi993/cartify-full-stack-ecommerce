import api from "./axios";

// 🛒 GET CART
export const getCartApi = async () => {
  const res = await api.get("/cart");
  return res.data.data || { items: [] }; // 🔥 FIX HERE
};
// ➕ ADD TO CART
export const addToCartApi = async (productId: string) => {
  const res = await api.post("/user/cart", { productId });
  return res.data.data;
};

// 🔄 UPDATE QTY
export const updateCartQtyApi = async (productId: string, quantity: number) => {
  const res = await api.patch(`/cart/${productId}`, {
    quantity,
  });

  return res.data;
};

// ❌ REMOVE
export const removeCartItemApi = async (productId: string) => {
  const res = await api.delete(`/cart/${productId}`);
  return res.data;
};

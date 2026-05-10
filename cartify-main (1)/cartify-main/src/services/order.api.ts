import api from "./axios";

// 🧾 CREATE ORDER
export const createOrderApi = async (address: any) => {
  const res = await api.post("/orders", { address });
  return res.data.data;
};

// 📦 GET MY ORDERS
export const getMyOrdersApi = async () => {
  const res = await api.get("/orders");
  return res.data.data;
};

// 🔥 GET SELLER ORDERS
export const getSellerOrdersApi = async () => {
  const res = await api.get("/orders/seller");
  return res.data;
};

// 🔥 UPDATE ORDER STATUS
export const updateOrderStatusApi = async (orderId: string, status: string) => {
  const res = await api.patch(`/orders/${orderId}/status`, {
    status,
  });
  return res.data;
};

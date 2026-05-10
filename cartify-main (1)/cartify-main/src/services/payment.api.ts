import api from "./axios";

// 💳 CREATE PAYMENT
export const createPaymentApi = async (orderId: string) => {
  const res = await api.post("/payments/create", { orderId });
  return res.data.data;
};

// ✅ CONFIRM PAYMENT
export const confirmPaymentApi = async (paymentId: string, method: string) => {
  const res = await api.post("/payments/confirm", {
    paymentId,
    method,
  });
  return res.data.data;
};

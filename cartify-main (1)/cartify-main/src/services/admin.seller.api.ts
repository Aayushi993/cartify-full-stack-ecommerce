import api from "./axios";

export const getSellerRequestsApi = async () => {
  const res = await api.get("/super/seller-requests");
  return res.data.data;
};

export const updateSellerStatusApi = async (
  id: string,
  status: "APPROVED" | "REJECTED",
  reason?: string
) => {
  const res = await api.patch(`/super/seller-requests/${id}`, {
    status,
    reason,
  });

  return res.data;
};
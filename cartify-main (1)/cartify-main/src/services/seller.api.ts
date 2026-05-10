import api from "./axios";

export const applySellerApi = async (data: any) => {
  const res = await api.post("/seller/apply", data);
  return res.data;
};

export const getSellerStatusApi = async () => {
  const res = await api.get("/seller/status");
  return res.data.data;
};

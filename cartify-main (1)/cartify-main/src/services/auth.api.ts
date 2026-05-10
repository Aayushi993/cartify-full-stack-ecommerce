import api from "./axios";

export const authApi = async (data: any) => {
  const res = await api.post("/auth", data);
  return res.data.data;
};

// 🔥 ADD THIS
export const refreshTokenApi = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  const res = await api.post("/auth/refresh", {
    refreshToken,
  });

  return res.data;
};

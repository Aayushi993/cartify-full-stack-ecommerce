import api from "./axios";

export const getUsersApi = async (search = "", page = 1) => {
  const res = await api.get(
    `/super/users?search=${search}&page=${page}&limit=5`
  );

  return res.data;
};

export const updateRoleApi = async (userId: string, role: string) => {
  const res = await api.patch(`/super/users/role`, {
    userId,
    role,
  });

  return res.data;
};

export const toggleBlockApi = async (userId: string) => {
  const res = await api.patch(`/super/users/block/${userId}`);
  return res.data;
};
import api from "./axios";

export const getProductsApi = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
}) => {
  const res = await api.get("/products", { params });
  return res.data;
};

export const getSingleProductApi = async (id: string) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const getMyProductsApi = async () => {
  const res = await api.get("/products/my");
  return res.data;
};

export const createProductApi = async (formData: FormData) => {
  const res = await api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const updateProductApi = async (id: string, formData: FormData) => {
  const res = await api.patch(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const deleteProductApi = async (id: string) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};
import api from "./axios";

export const addReviewApi = async (productId: string, payload: any) => {
  const res = await api.post(`/products/${productId}/reviews`, payload);
  return res.data;
};

export const getReviewsApi = async (productId: string, sort = "newest") => {
  const res = await api.get(`/products/${productId}/reviews`, {
    params: { sort },
  });

  return res.data.data;
};

export const deleteReviewApi = async (id: string) => {
  const res = await api.delete(`/reviews/${id}`);
  return res.data;
};

export const updateReviewApi = async (
  id: string,
  payload: { rating: number; comment: string },
) => {
  const res = await api.patch(`/reviews/${id}`, payload);
  return res.data;
};
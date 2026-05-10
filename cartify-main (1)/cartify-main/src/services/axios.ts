import axios from "axios";
import { toast } from "react-hot-toast";
import { refreshTokenApi } from "./auth.api";
import { store } from "../app/store";
import { logout } from "../features/auth/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;
    const data = error?.response?.data;

    const message =
      data?.message || data?.error || error?.message || "Something went wrong";

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await refreshTokenApi();

        const newAccessToken =
          refreshResponse?.accessToken || refreshResponse?.token;

        if (!newAccessToken) {
          throw new Error("No access token received");
        }

        localStorage.setItem("token", newAccessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        toast.error("Session expired, login again");
        return Promise.reject(refreshError);
      }
    }

    switch (status) {
      case 400:
        toast.error(message);
        break;

      case 401:
        toast.error("Please login again");
        store.dispatch(logout());
        break;

      case 403:
        toast.error(message || "Access denied");
        break;

      case 404:
        toast.error(message || "Data not found");
        break;

      case 409:
        toast.error(message || "Already exists");
        break;

      case 500:
        toast.error("Server error. Please try again later.");
        break;

      default:
        toast.error(message);
        break;
    }

    return Promise.reject(data || error);
  },
);

const responseBody = (response: any) => response?.data;

const getQueryString = (params: any) => {
  if (!params) {
    return "";
  }

  const filtered = Object.entries(params).reduce((acc: any, [key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      acc[key] = value;
    }

    return acc;
  }, {});

  const query = new URLSearchParams(filtered).toString();

  return query ? `?${query}` : "";
};

const multipartHeaders = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

export const apiService = {
  get: (url: string, params?: any) =>
    api.get(url + getQueryString(params)).then(responseBody),

  post: (url: string, body = {}) => api.post(url, body).then(responseBody),

  put: (url: string, body = {}) => api.put(url, body).then(responseBody),

  patch: (url: string, body = {}) => api.patch(url, body).then(responseBody),

  delete: (url: string) => api.delete(url).then(responseBody),

  postForm: (url: string, data: any) =>
    api.post(url, data, multipartHeaders).then(responseBody),

  putForm: (url: string, data: any) =>
    api.put(url, data, multipartHeaders).then(responseBody),

  patchForm: (url: string, data: any) =>
    api.patch(url, data, multipartHeaders).then(responseBody),
};

export const createFormData = (data: any) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => formData.append(key, item as any));
      return;
    }

    formData.append(key, value as any);
  });

  return formData;
};

export default api;
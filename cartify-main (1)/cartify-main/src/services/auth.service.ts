import { authApi } from "./auth.api";

const saveAuthData = (data: any) => {
  const accessToken = data.accessToken || data.token;

  if (!accessToken) {
    throw new Error("Access token missing from server response");
  }

  localStorage.setItem("token", accessToken);

  if (data.refreshToken) {
    localStorage.setItem("refreshToken", data.refreshToken);
  }

  localStorage.setItem("user", JSON.stringify(data.user));

  return data.user;
};

export const authService = {
  login: async (form: any) => {
    const data = await authApi({
      ...form,
      mode: "login",
    });

    return saveAuthData(data);
  },

  signup: async (form: any) => {
    const data = await authApi({
      ...form,
      mode: "register",
    });

    return saveAuthData(data);
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  getUser: () => {
    const user = localStorage.getItem("user");

    try {
      return user ? JSON.parse(user) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  },

  isAuthenticated: () => {
    return Boolean(localStorage.getItem("token"));
  },
};
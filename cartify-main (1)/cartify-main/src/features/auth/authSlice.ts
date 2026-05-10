import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  user: any;
  isAuthChecked: boolean;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  isAuthChecked: false,
};

const clearAuthStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.isAuthChecked = true;
    },

    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.isAuthChecked = true;
      clearAuthStorage();
    },

    setAuthChecked: (state) => {
      state.isAuthChecked = true;
    },
  },
});

export const { loginSuccess, logout, setAuthChecked } = authSlice.actions;
export default authSlice.reducer;
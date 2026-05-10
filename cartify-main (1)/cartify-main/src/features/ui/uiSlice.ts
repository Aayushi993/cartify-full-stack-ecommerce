import { createSlice } from "@reduxjs/toolkit";

interface UIState {
  isAuthOpen: boolean;
  authMode: "login" | "signup";
}

const initialState: UIState = {
  isAuthOpen: false,
  authMode: "login",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openAuth: (state, action) => {
      state.isAuthOpen = true;
      state.authMode = action.payload;
    },
    closeAuth: (state) => {
      state.isAuthOpen = false;
    },
    switchAuthMode: (state, action) => {
      state.authMode = action.payload;
    },
  },
});

export const { openAuth, closeAuth, switchAuthMode } = uiSlice.actions;
export default uiSlice.reducer;
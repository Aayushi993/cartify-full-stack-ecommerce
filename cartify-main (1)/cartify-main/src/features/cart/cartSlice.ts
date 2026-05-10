import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: string;
  title: string;
  price: number;
  qty: number;
  image?: string;
}

interface CartState {
  isOpen: boolean;
  items: CartItem[];
}

const initialState: CartState = {
  isOpen: false,
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    openCart: (state) => {
      state.isOpen = true;
    },

    closeCart: (state) => {
      state.isOpen = false;
    },

    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },

    addToCart: (state, action: PayloadAction<Omit<CartItem, "qty">>) => {
      const item = state.items.find((i) => i.id === action.payload.id);

      if (item) {
        item.qty += 1;
      } else {
        state.items.push({ ...action.payload, qty: 1 });
      }
    },

    increaseQty: (state, action: PayloadAction<string>) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) item.qty += 1;
    },

    decreaseQty: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);

      if (item) {
        item.qty -= 1;

        if (item.qty <= 0) {
          state.items = state.items.filter((i) => i.id !== action.payload);
        }
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },

    clearCart: (state) => {
      state.items = [];
      state.isOpen = false;
    },
  },
});

export const {
  openCart,
  closeCart,
  setCart,
  addToCart,
  increaseQty,
  decreaseQty,
  removeItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

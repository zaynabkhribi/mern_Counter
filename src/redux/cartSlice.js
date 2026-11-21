
import { createSlice } from '@reduxjs/toolkit';

// Charger les articles sauvegardes dans localStorage
const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem('techstore_cart')) || [];
  } catch (error) {
    return [];
  }
};

const initialState = {
  items: loadCart(),
  totalCount: 0,
  totalPrice: 0,
  discountPercent: 0
};

// Recalculer les totaux et sauvegarder le panier
const recalculateTotals = (state) => {
  state.totalCount = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  state.totalPrice = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  localStorage.setItem('techstore_cart', JSON.stringify(state.items));
};

// Initialiser les totaux au demarrage
initialState.totalCount = initialState.items.reduce(
  (sum, item) => sum + item.quantity,
  0
);

initialState.totalPrice = initialState.items.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState,

  reducers: {
    addItem: (state, action) => {
      const existing = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1
        });
      }

      recalculateTotals(state);
    },

    removeItem: (state, action) => {
      const existing = state.items.find(
        (item) => item.id === action.payload
      );

      if (existing) {
        if (existing.quantity > 1) {
          existing.quantity -= 1;
        } else {
          state.items = state.items.filter(
            (item) => item.id !== action.payload
          );
        }
      }

      recalculateTotals(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.totalCount = 0;
      state.totalPrice = 0;
      state.discountPercent = 0;

      localStorage.setItem('techstore_cart', JSON.stringify([]));
    },

    // DEFI 2 : appliquer un code promo
    applyPromoCode: (state, action) => {
      if (action.payload === 'POLY2027') {
        state.discountPercent = 20;
      } else {
        state.discountPercent = 0;
      }
    }
  }
});

export const {
  addItem,
  removeItem,
  clearCart,
  applyPromoCode
} = cartSlice.actions;

export default cartSlice.reducer;

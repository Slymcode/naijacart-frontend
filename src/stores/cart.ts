import { create } from "zustand";
import { CartItem } from "@/types";
import { apiClient } from "@/api/client";

interface CartState {
  items: CartItem[];
  subtotal: number;
  isLoading: boolean;
  affiliateCode: string;

  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => void;
  setAffiliateCode: (code: string) => void;
  clearAffiliateCode: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  subtotal: 0,
  isLoading: false,
  affiliateCode: localStorage.getItem("affiliateCode") || "",

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const response = await apiClient.getCart();
      set({
        items: response.data.items,
        subtotal: response.data.subtotal,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId, quantity) => {
    set({ isLoading: true });
    try {
      await apiClient.addToCart({ productId, quantity });
      await get().fetchCart();
    } catch (error) {
      set({ isLoading: false });
    }
  },

  updateQuantity: async (cartItemId, quantity) => {
    set({ isLoading: true });
    try {
      await apiClient.updateCartItem(cartItemId, { quantity });
      await get().fetchCart();
    } catch (error) {
      set({ isLoading: false });
    }
  },

  removeItem: async (cartItemId) => {
    set({ isLoading: true });
    try {
      await apiClient.removeFromCart(cartItemId);
      await get().fetchCart();
    } catch (error) {
      set({ isLoading: false });
    }
  },

  clearCart: () => {
    set({ items: [], subtotal: 0 });
  },

  setAffiliateCode: (code) => {
    localStorage.setItem("affiliateCode", code);
    set({ affiliateCode: code });
  },

  clearAffiliateCode: () => {
    localStorage.removeItem("affiliateCode");
    set({ affiliateCode: "" });
  },

  getCartTotal: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));

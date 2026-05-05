import { useCartStore } from "@/stores/cart";

export const useCart = () => {
  const store = useCartStore();
  return {
    items: store.items,
    subtotal: store.subtotal,
    isLoading: store.isLoading,
    fetchCart: store.fetchCart,
    addToCart: store.addToCart,
    updateQuantity: store.updateQuantity,
    removeItem: store.removeItem,
    clearCart: store.clearCart,
    getCartTotal: store.getCartTotal,
  };
};

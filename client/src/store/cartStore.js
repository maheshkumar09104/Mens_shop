import { create } from "zustand";

const CART_STORAGE_KEY = "mensShopCart";

const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
  } catch (error) {
    return [];
  }
};

const saveCart = (cartItems) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
};

const useCartStore = create((set) => ({
  cartItems: loadCart(),
  addToCart: (product) =>
    set((state) => {
      const existingItem = state.cartItems.find((item) => item._id === product._id);
      const quantityToAdd = Math.max(1, Number(product.quantity) || 1);
      const updatedCart = existingItem
        ? state.cartItems.map((item) =>
            item._id === product._id ? { ...item, quantity: item.quantity + quantityToAdd } : item
          )
        : [...state.cartItems, { ...product, quantity: quantityToAdd }];

      saveCart(updatedCart);
      return { cartItems: updatedCart };
    }),
  removeFromCart: (id) =>
    set((state) => {
      const updatedCart = state.cartItems.filter((item) => item._id !== id);
      saveCart(updatedCart);
      return { cartItems: updatedCart };
    }),
  updateQuantity: (id, quantity) =>
    set((state) => {
      const nextQuantity = Math.max(1, Number(quantity) || 1);
      const updatedCart = state.cartItems.map((item) =>
        item._id === id ? { ...item, quantity: nextQuantity } : item
      );

      saveCart(updatedCart);
      return { cartItems: updatedCart };
    }),
  clearCart: () => {
    saveCart([]);
    set({ cartItems: [] });
  }
}));

export default useCartStore;

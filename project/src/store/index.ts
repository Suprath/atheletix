import { create } from 'zustand';
import { CartItem, User } from '../types';

interface StoreState {
  user: User | null;
  cart: CartItem[];
  setUser: (user: User | null) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
}

export const useStore = create<StoreState>((set) => ({
  user: null,
  cart: [],
  setUser: (user) => set({ user }),
  addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
  removeFromCart: (itemId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== itemId),
    })),
  clearCart: () => set({ cart: [] }),
}));